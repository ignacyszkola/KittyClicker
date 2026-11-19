package com.kittyclicker.exception;

public class InvalidCredentialsException extends RuntimeException {

    public InvalidCredentialsException() {
        super("Wrong username or password");
    }
}