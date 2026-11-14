package com.kittyclicker.controller;

import com.kittyclicker.dto.UserRegistrationRequest;
import com.kittyclicker.dto.UserRegistrationResponse;
import com.kittyclicker.dto.UserResponse;
import com.kittyclicker.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService){ this.userService = userService; }

    @PostMapping(value = "/register", produces = "application/json")
    public ResponseEntity<UserRegistrationResponse> register(@Valid @RequestBody UserRegistrationRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.register(request));
    }

    @GetMapping(value = "/status", produces = "application/json")
    public Map<String, String> response(){
        return Map.of(
                "status", "operational",
                "message", "KittyClicker API is running"
        );
    }

    @GetMapping(value = "/{id}")
    public UserResponse getUserById(@PathVariable Long id){
        return userService.getUserById(id);
    }

}