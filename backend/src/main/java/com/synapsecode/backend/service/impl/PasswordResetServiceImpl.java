package com.synapsecode.backend.service.impl;

import com.synapsecode.backend.dto.UserDto;
import com.synapsecode.backend.entity.Token;
import com.synapsecode.backend.entity.TokenType;
import com.synapsecode.backend.entity.User;
import com.synapsecode.backend.events.PasswordResetEvent;
import com.synapsecode.backend.exception.InvalidTokenException;
import com.synapsecode.backend.exception.ResourceNotFoundException;
import com.synapsecode.backend.mapper.UserMapper;
import com.synapsecode.backend.repository.TokenRepository;
import com.synapsecode.backend.repository.UserRepository;
import com.synapsecode.backend.service.PasswordResetService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PasswordResetServiceImpl implements PasswordResetService {

    private final UserRepository userRepository;
    private final TokenRepository tokenRepository;
    private final ApplicationEventPublisher eventPublisher;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;

    @Override
    @Transactional
    public void initiatePasswordReset(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        String token = UUID.randomUUID().toString();
        Token resetToken = Token.builder()
                .tokenType(TokenType.RESET)
                .token(token)
                .user(user)
                .expiryDate(LocalDateTime.now().plusHours(2))
                .build();

        tokenRepository.save(resetToken);
        UserDto userDto = userMapper.toDto(user);
        eventPublisher.publishEvent(new PasswordResetEvent(userDto, token));
    }

    @Override
    @Transactional
    public void validateResetToken(String token) {
        Token resetToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new InvalidTokenException("Invalid password reset token"));

        if (resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new InvalidTokenException("Token has expired");
        }
    }

    @Override
    @Transactional
    public void completePasswordReset(String token, String newPassword) {
        Token resetToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new InvalidTokenException("Invalid password reset token"));

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        tokenRepository.delete(resetToken);
    }

    @Scheduled(cron = "0 0 0 * * ?") // Daily cleanup
    @Transactional
    public void cleanupExpiredTokens() {
        tokenRepository.deleteAllByExpiryDateBefore(LocalDateTime.now());
    }
}