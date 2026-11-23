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

        long chance = 1;
        long drop = 1;
        boolean moneyDrop = false;
        boolean critDrop = false;

        if(user.getMoneyChanceDrop().isAvailable()){
            chance += user.getMoneyChanceDrop().getBoost();
        }

        if(((int)(Math.random() * 101)) < chance){
            if(user.getMoneyMultiplierDrop().isAvailable()){
                drop += user.getMoneyMultiplierDrop().getBoost();
            }
            user.setMoney(user.getMoney() + drop);
            moneyDrop = true;
        }

        chance = 1;
        drop = 1;

        if(user.getCritChanceDrop().isAvailable()){
            chance += user.getCritChanceDrop().getBoost();
        }

        if(((int)(Math.random() * 101)) < chance) {
            if (user.getCritMultiplierDrop().isAvailable()) {
                drop += user.getCritMultiplierDrop().getBoost();
            }
            critDrop = true;
        }

        if(user.getPointsPerClick().isAvailable()){
            drop += user.getPointsPerClick().getBoost();
        }

        user.setClicks(user.getClicks() + drop);

        return new ClickResponse(
                user.getClicks(),
                user.getMoney(),
                moneyDrop,
                critDrop
        );
    }
}
