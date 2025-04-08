package com.synapsecode.backend.service.impl;

import com.synapsecode.backend.entity.Token;
import com.synapsecode.backend.entity.User;
import com.synapsecode.backend.repository.UserRepository;
import com.synapsecode.backend.response.ApiResponse;
import com.synapsecode.backend.response.ResponseBuilder;
import com.synapsecode.backend.service.TokenService;
import com.synapsecode.backend.service.VerificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.synapsecode.backend.entity.TokenType;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class VerificationServiceImpl implements VerificationService {

    private final TokenService tokenService;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public ApiResponse<?> verifyRegistration(String token) {
        Optional<Token> verificationTokenOpt = tokenService.validateToken(token, TokenType.VERIFICATION);

        if (verificationTokenOpt.isEmpty()) {
            return ResponseBuilder.error("INVALID_TOKEN", "Verification token is invalid or expired");
        }

        Token verificationToken = verificationTokenOpt.get();
        User user = verificationToken.getUser();

        user.setEnabled(true);
        userRepository.save(user);
        tokenService.deleteToken(token);

        return ResponseBuilder.success("Account activated successfully");
    }
}