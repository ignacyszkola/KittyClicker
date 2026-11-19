package com.kittyclicker.dto;

public record LoginResponse(
        Long userId,
        String username,
        String token,
        String tokenType
) {}