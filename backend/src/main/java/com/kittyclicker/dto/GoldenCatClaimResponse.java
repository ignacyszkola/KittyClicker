package com.kittyclicker.dto;

public record GoldenCatClaimResponse(
        long reward,
        long amount,
        String message
) {}