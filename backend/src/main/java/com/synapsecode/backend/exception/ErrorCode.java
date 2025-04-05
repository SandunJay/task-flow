package com.synapsecode.backend.exception;

public enum ErrorCode {
    RESOURCE_NOT_FOUND("RESOURCE_NOT_FOUND"),
    VALIDATION_FAILED("VALIDATION_FAILED"),
    AUTHENTICATION_FAILED("AUTHENTICATION_FAILED"),
    ACCESS_DENIED("ACCESS_DENIED"),
    INTERNAL_SERVER_ERROR("INTERNAL_SERVER_ERROR");

    private final String code;

    ErrorCode(String code) {
        this.code = code;
    }

    public String getCode() {
        return code;
    }
}