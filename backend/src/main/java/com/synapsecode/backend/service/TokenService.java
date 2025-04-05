package com.synapsecode.backend.service;

import com.synapsecode.backend.entity.Token;
import com.synapsecode.backend.entity.TokenType;
import com.synapsecode.backend.entity.User;

import java.util.Optional;

public interface TokenService {
    String generateToken(User user, TokenType tokenType, long expirationSeconds);
    void saveToken(String token, User user, TokenType tokenType, long expirationSeconds);
    Optional<Token> validateToken(String token, TokenType tokenType);
    void deleteToken(String token);
    String createTokenKey(String token, TokenType tokenType);
}