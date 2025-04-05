package com.synapsecode.backend.service;

import com.synapsecode.backend.dto.AuthResponse;
import com.synapsecode.backend.dto.LoginRequest;
import com.synapsecode.backend.dto.RegResponse;
import com.synapsecode.backend.dto.RegisterRequest;

public interface AuthenticationService {
    RegResponse register(RegisterRequest request);
    AuthResponse authenticate(LoginRequest request);
    AuthResponse refreshToken(String refreshToken);
    void logout(String refreshToken);
}
