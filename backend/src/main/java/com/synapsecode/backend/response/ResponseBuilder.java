package com.synapsecode.backend.response;

import java.util.Map;

public class ResponseBuilder {

    public static <T> ApiResponse<T> success(T data) {
        return ApiResponse.<T>builder()
                .success(true)
                .data(data)
                .build();
    }

    public static <T> ApiResponse<T> success(String message, T data) {
        return ApiResponse.<T>builder()
                .success(true)
                .message(message)
                .data(data)
                .build();
    }

    public static ApiResponse<?> error(String errorCode, String message) {
        return ApiResponse.builder()
                .success(false)
                .errorCode(errorCode)
                .message(message)
                .build();
    }

    public static ApiResponse<?> error(String errorCode, String message,
                                       Map<String, String> errors) {
        return ApiResponse.builder()
                .success(false)
                .errorCode(errorCode)
                .message(message)
                .errors(errors)
                .build();
    }
}