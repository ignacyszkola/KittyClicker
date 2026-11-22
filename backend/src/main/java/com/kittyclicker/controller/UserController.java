package com.kittyclicker.controller;

import com.kittyclicker.dto.*;
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
    public ResponseEntity<UserActionResponse> register(@Valid @RequestBody UserRegistrationRequest request) {
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
    public UserBalanceResponse getUserById(@PathVariable Long id){
        return userService.getUserById(id);
    }

    @PatchMapping(value = "/{id}/money", produces = "application/json")
    public UserBalanceResponse addMoney(@PathVariable Long id, @Valid @RequestBody AmountRequest amount){
        return userService.addMoney(id, amount.amount());
    }

    @DeleteMapping(value = "/{id}")
    public UserActionResponse deleteUserById(@PathVariable Long id){
        return userService.deleteUserById(id);
    }

    @PostMapping(value = "/login", produces = "application/json")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request){
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(userService.login(request));
    }

}