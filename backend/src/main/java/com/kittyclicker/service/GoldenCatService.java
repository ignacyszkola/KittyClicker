package com.kittyclicker.service;

import com.kittyclicker.dto.GoldenCatClaimResponse;
import com.kittyclicker.entity.User;
import com.kittyclicker.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@Service
public class GoldenCatService {

    private final UserRepository userRepository;

    private final Map<Long, Instant> activeEvents = new HashMap<>();

    public GoldenCatService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public synchronized Instant startEvent(Long userId) {
        if (activeEvents.containsKey(userId)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "Golden Cat is already active"
            );
        }

        Instant expiresAt = Instant.now().plusSeconds(1);
        activeEvents.put(userId, expiresAt);

        return expiresAt;
    }

    public synchronized GoldenCatClaimResponse claimEvent(Long userId) {
        Instant expiresAt = activeEvents.get(userId);

        if (expiresAt == null) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "No active Golden Cat"
            );
        }

        if (!Instant.now().isBefore(expiresAt)) {
            activeEvents.remove(userId);

            throw new ResponseStatusException(
                    HttpStatus.GONE, "Golden Cat has expired"
            );
        }

        activeEvents.remove(userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "User not found"
                ));

        long digits = String.valueOf(user.getClicks()).length();
        long reward = 2 + digits * 2;

        user.setMoney(user.getMoney() + reward);
        userRepository.save(user);

        return new GoldenCatClaimResponse(
                reward,
                user.getMoney(),
                "Golden Cat caught!"
        );
    }
}
