package com.kittyclicker.dto;

public record UserResponse(
        Long id,
        String username,
        long money
) {}