package com.kittyclicker.controller;

import com.kittyclicker.dto.UserRegistrationRequest;
import com.kittyclicker.dto.UserRegistrationResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @PostMapping(value = "/register", produces = "application/json")
    public ResponseEntity<UserRegistrationResponse> register(@Valid @RequestBody UserRegistrationRequest request) {
        UserRegistrationResponse response = new UserRegistrationResponse(
                request.username(),
                "you got registered"
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping(value = "/status", produces = "application/json")
    public Map<String, String> response(){
        Map<String, String> r = new HashMap<>();
        r.put("status", "operational");
        r.put("message", "KittyClicker API is running");
        return r;
    }


}