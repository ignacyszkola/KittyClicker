package com.kittyclicker.dto;

import java.util.Map;

public record LoginResponse(
        String token,
        Map<String, String> user
) {}