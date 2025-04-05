package com.synapsecode.backend.dto;

import com.synapsecode.backend.entity.TaskStatus;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDateTime;
import java.util.List;

public record TaskRequest(
        @NotBlank String title,
        String description,
        TaskStatus status,
        LocalDateTime dueDate,
        List<Long> assigneeIds
) {}