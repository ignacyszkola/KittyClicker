package com.kittyclicker.controller;

import com.kittyclicker.dto.LoginRequest;
import com.kittyclicker.dto.LoginResponse;
import com.kittyclicker.dto.UserActionResponse;
import com.kittyclicker.dto.UserRegistrationRequest;
import com.kittyclicker.security.CurrentUser;
import com.kittyclicker.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final CurrentUser currentUser;
    private final UserService userService;

    public AuthController(CurrentUser currentUser, UserService userService) {
        this.currentUser = currentUser;
        this.userService = userService;
    }

    @PostMapping(value = "/register", produces = "application/json")
    public ResponseEntity<UserActionResponse> register(@Valid @RequestBody UserRegistrationRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.register(request));
    }

    @PostMapping(value = "/login", produces = "application/json")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request){
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(userService.login(request));
    }

    @GetMapping("/me")
    public Map<String, String> getCurrentUser() {
        return userService.getCurrentUser(currentUser.getId());
    }
}
