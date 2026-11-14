package com.kittyclicker.service;

import com.kittyclicker.dto.UserRegistrationRequest;
import com.kittyclicker.dto.UserRegistrationResponse;
import com.kittyclicker.dto.UserResponse;
import com.kittyclicker.entity.User;
import com.kittyclicker.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository){
        this.userRepository = userRepository;
    }

    public UserRegistrationResponse register(UserRegistrationRequest request){
        User user = new User(request.username());
        User savedUser = userRepository.save(user);

        return new UserRegistrationResponse(
                savedUser.getId(),
                savedUser.getUsername(),
                "you got registered"
        );
    }

    @Transactional(readOnly = true)
    public UserResponse getUserById(Long userId){
        User user = userRepository.findById(userId).orElseThrow();

        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getMoney()
        );
    }
}
