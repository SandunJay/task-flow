package com.synapsecode.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class InvalidTokenException extends RuntimeException {
    private final String token;
    private final String errorType;

    public InvalidTokenException(String message) {
        super(message);
        this.token = "";
        this.errorType = "INVALID_TOKEN";
    }

    public InvalidTokenException(String message, String token) {
        super(message);
        this.token = token;
        this.errorType = "EXPIRED_TOKEN";
    }

    // Getters
    public String getToken() { return token; }
    public String getErrorType() { return errorType; }
}