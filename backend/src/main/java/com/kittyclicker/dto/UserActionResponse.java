package com.kittyclicker.dto;

public record UserActionResponse(
        Long id,
        String username,
        String message
) {}
