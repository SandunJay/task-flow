package com.synapsecode.backend.dto;

import lombok.Builder;

@Builder
public record RegResponse(
        String status,
        String message
) {
}
