package com.kittyclicker.exception;

public class NotEnoughMaterialException extends RuntimeException {
    public NotEnoughMaterialException(String message) {
        super(message);
    }
}
