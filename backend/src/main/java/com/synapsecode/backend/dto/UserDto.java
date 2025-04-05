package com.synapsecode.backend.dto;

public record UserDto(
         Long id,
         String email,
         boolean enabled
) {
}
