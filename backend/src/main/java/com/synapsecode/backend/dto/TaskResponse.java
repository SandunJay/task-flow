package com.synapsecode.backend.dto;

import com.synapsecode.backend.entity.TaskStatus;

import java.time.LocalDateTime;

public record TaskResponse(
        Long id,
        String title,
        String description,
        TaskStatus status,
        LocalDateTime createdAt
) {}