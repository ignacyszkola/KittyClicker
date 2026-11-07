package com.kittyclicker.dto;

import java.util.Map;

public record ApiError(
   String message,
   int status,
   Map<String, String> errors
) {}
