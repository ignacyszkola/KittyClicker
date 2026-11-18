package com.kittyclicker.dto;

import jakarta.validation.constraints.Positive;

public record AmountRequest(
        @Positive long amount
) {}