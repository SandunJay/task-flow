package com.synapsecode.backend.controller;

import com.synapsecode.backend.dto.*;
import com.synapsecode.backend.exception.AuthenticationFailedException;
import com.synapsecode.backend.exception.ResourceNotFoundException;
import com.synapsecode.backend.response.ApiResponse;
import com.synapsecode.backend.response.ResponseBuilder;
import com.synapsecode.backend.service.AuthenticationService;
import com.synapsecode.backend.service.PasswordResetService;
import com.synapsecode.backend.service.VerificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationService authenticationService;
    private final VerificationService verificationService;
    private final PasswordResetService passwordResetService;

    @PostMapping("/register")
    public ResponseEntity<RegResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authenticationService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        try {
            AuthResponse response = authenticationService.authenticate(request);
            return ResponseEntity.ok(ResponseBuilder.success("Login successful", response));
        } catch (AuthenticationFailedException ex) {
            return ResponseEntity.status(401)
                    .body((ApiResponse<AuthResponse>) ResponseBuilder.error("INVALID_CREDENTIALS", ex.getMessage()));
        }
    }

    @GetMapping("/verify")
    public ResponseEntity<String> verifyRegistration(@RequestParam String token) {
        verificationService.verifyRegistration(token);
        return ResponseEntity.ok("Account activated successfully");
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refreshToken(@RequestBody RefreshTokenRequest request) {
        return ResponseEntity.ok(authenticationService.refreshToken(request.refreshToken()));
    }

    @PostMapping("/password-reset")
    public ResponseEntity<String> initiatePasswordReset(@RequestBody PasswordResetRequest request) {
        passwordResetService.initiatePasswordReset(request.email());
        return ResponseEntity.ok("Password reset email sent");
    }
}