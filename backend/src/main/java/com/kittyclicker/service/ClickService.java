package com.kittyclicker.service;

import com.kittyclicker.dto.ClickResponse;
import com.kittyclicker.entity.User;
import com.kittyclicker.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayDeque;
import java.util.Deque;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Map;

@Service
public class ClickService {

    private final UserRepository userRepository;

    private final Map<Long, Deque<Long>> userClicks =
            new ConcurrentHashMap<>();

    private static final int MAX_CPS = 15;
    private static final long ONE_SECOND_NANOS = 1_000_000_000L;

    public ClickService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public ClickResponse click(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "User not found"
                        )
                );

        Deque<Long> timestamps = userClicks.computeIfAbsent(
                userId,
                key -> new ArrayDeque<>()
        );

        synchronized (timestamps) {

            long now = System.nanoTime();

            while (!timestamps.isEmpty()
                    && now - timestamps.peekFirst() >= ONE_SECOND_NANOS) {
                timestamps.removeFirst();
            }

            if (timestamps.size() >= MAX_CPS) {
                throw new ResponseStatusException(
                        HttpStatus.TOO_MANY_REQUESTS,
                        "Maximum of " + MAX_CPS + " clicks per second exceeded"
                );
            }

            timestamps.addLast(now);
        }

        user.setClicks(user.getClicks() + 1);

        long moneyEarned = 1;
        user.setMoney(user.getMoney() + moneyEarned);

        return new ClickResponse(
                user.getClicks(),
                moneyEarned,
                user.getMoney()
        );
    }
}
