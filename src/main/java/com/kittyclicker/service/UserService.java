package com.kittyclicker.service;

import com.kittyclicker.dto.UserRegistrationRequest;
import com.kittyclicker.dto.UserActionResponse;
import com.kittyclicker.dto.UserBalanceResponse;
import com.kittyclicker.entity.User;
import com.kittyclicker.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.NoSuchElementException;

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

    public UserActionResponse click(Long userId){
        User user = userRepository.findById(userId).orElseThrow(() -> new NoSuchElementException());


    }

}
