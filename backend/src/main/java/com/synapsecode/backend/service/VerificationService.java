package com.synapsecode.backend.service;

import com.synapsecode.backend.response.ApiResponse;

public interface VerificationService {
    public ApiResponse<?> verifyRegistration(String token);
}
