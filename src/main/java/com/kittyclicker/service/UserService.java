package com.kittyclicker.service;

import com.kittyclicker.dto.UserRegistrationRequest;
import com.kittyclicker.dto.UserActionResponse;
import com.kittyclicker.dto.UserBalanceResponse;
import com.kittyclicker.entity.User;
import com.kittyclicker.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository){
        this.userRepository = userRepository;
    }

    public UserActionResponse register(UserRegistrationRequest request){
        User user = new User(request.username(), request.password());
        User savedUser = userRepository.save(user);

        return new UserActionResponse(
                savedUser.getId(),
                savedUser.getUsername(),
                "you got registered"
        );
    }

    @Transactional(readOnly = true)
    public UserBalanceResponse getUserById(Long userId){
        User user = userRepository.findById(userId).orElseThrow();

        return new UserBalanceResponse(
                user.getId(),
                user.getUsername(),
                user.getMoney()
        );
    }

    @Transactional
    public UserBalanceResponse addMoney(Long userId, long amount) {
        User user = userRepository.findById(userId).orElseThrow();
        user.setMoney(user.getMoney() + amount);

        return new UserBalanceResponse(
                user.getId(),
                user.getUsername(),
                user.getMoney()
        );
    }

    @Transactional
    public UserActionResponse deleteUserById(Long userId){
        User user = userRepository.findById(userId).orElseThrow(() -> new NoSuchElementException());
        userRepository.delete(user);

        return new UserActionResponse(
                user.getId(),
                user.getUsername(),
                "Successfully deleted"
        );
    }

    private final Map<Long, Deque<Long>> userClicks = new HashMap<>();
    private static final int MAX_CPS = 15;
    private static final long ONE_SECOND_NANOS = 1_000_000_000L;


    @Transactional
    public UserActionResponse click(Long userId){
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException());

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
                        "Maximum of 15 clicks per second exceeded"
                );
            }

            timestamps.addLast(now);
            user.setClicks((int) (user.getClicks() + 1));
        }

        return new UserActionResponse(
                user.getId(),
                user.getUsername(),
                "Click registered"
        );
    }

}
