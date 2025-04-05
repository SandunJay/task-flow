package com.synapsecode.backend.dto;

import com.synapsecode.backend.entity.TokenType;

import java.time.LocalDateTime;

public record TokenDto(
         String token,
        TokenType tokenType,
         UserDto user,
        LocalDateTime expiryDate
) {
}
