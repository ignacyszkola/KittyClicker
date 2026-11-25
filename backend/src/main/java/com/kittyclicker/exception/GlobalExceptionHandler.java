package com.kittyclicker.exception;

import com.kittyclicker.dto.ApiError;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleValidation(MethodArgumentNotValidException ex){

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
    public ResponseEntity<ApiError> handleIllegalArgument(IllegalArgumentException ex){

        ApiError error = new ApiError(
                "Illegal Data",
                400, Map.of()
        );

        return ResponseEntity.badRequest().body(error);
    }

    @ExceptionHandler(NoSuchElementException.class)
    public ResponseEntity<ApiError> handle404Error(NoSuchElementException ex){

        ApiError error = new ApiError(
                ex.getMessage() != null ? ex.getMessage() : "Not found, error 404",
                404, Map.of()
        );

       return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<ApiError> handleUnauthorized(InvalidCredentialsException ex){

        ApiError error = new ApiError(
                ex.getMessage(),
                401, Map.of()
        );

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ApiError> handleResponseStatus(ResponseStatusException ex) {

        HttpStatus status = HttpStatus.valueOf(ex.getStatusCode().value());

        ApiError error = new ApiError(
                ex.getReason() != null ? ex.getReason() : "Request failed",
                status.value(),
                Map.of()
        );

        return ResponseEntity.status(status).body(error);
    }
}