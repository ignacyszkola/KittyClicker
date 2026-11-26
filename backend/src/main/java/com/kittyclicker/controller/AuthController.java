package com.kittyclicker.controller;

import com.kittyclicker.security.CurrentUser;
import com.kittyclicker.service.UserService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

    @GetMapping("/me")
    public Map<String, String> getCurrentUser() {
        return userService.getCurrentUser(currentUser.getId());
    }
}
