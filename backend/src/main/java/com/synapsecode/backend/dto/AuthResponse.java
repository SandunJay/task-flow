package com.synapsecode.backend.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.synapsecode.backend.entity.TokenType;
import lombok.Builder;
import lombok.Data;

@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public record AuthResponse(
         String accessToken,
         String refreshToken,
         Long expiresIn,
         TokenType tokenType,
         String error,
         String errorDescription
) { }