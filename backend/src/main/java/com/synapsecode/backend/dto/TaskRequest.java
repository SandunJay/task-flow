package com.synapsecode.backend.dto;

import com.synapsecode.backend.entity.TaskStatus;
import jakarta.validation.constraints.NotBlank;

public record TaskRequest(
        @NotBlank String title,
        String description,
        TaskStatus status
) {}