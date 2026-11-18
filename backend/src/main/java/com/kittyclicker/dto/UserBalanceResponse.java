package com.kittyclicker.dto;

public record UserBalanceResponse(
        Long id,
        String username,
        long money
) {}