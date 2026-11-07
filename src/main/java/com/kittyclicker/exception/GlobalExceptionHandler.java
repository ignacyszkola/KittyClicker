package com.kittyclicker.exception;

import com.kittyclicker.dto.ApiError;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleValidation(
            MethodArgumentNotValidException ex
    ){

        List<FieldError> errors = ex.getBindingResult().getFieldErrors();

        Map<String, String> errorMap = errors.stream().collect(Collectors.toMap(
                error -> error.getField(),
                error -> error.getDefaultMessage() != null ? error.getDefaultMessage() : "Invalid value",
                (first, second) -> first + "; " + second
        ));

        ApiError response = new ApiError(
                "Validation failed",
                400, errorMap
        );

        return ResponseEntity.badRequest().body(response);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiError> handleIllegalArgument(
            IllegalArgumentException ex
    ){

        ApiError error = new ApiError(
                "Illegal Data",
                400, Map.of()
        );

        return ResponseEntity.badRequest().body(error);
    }
}
