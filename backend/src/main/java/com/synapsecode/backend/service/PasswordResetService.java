package com.synapsecode.backend.service;


public interface PasswordResetService {
    void initiatePasswordReset(String email);
    void validateResetToken(String token);
    void completePasswordReset(String token, String newPassword);
}