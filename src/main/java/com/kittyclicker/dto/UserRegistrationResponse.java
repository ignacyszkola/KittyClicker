package com.kittyclicker.dto;

public record UserRegistrationResponse(
        Long id,
        String username,
        String message
) {}
