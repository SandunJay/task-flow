package com.synapsecode.backend.dto;

import com.synapsecode.backend.entity.ProjectStatus;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

public record ProjectUpdateRequest(
        @Size(max = 100) String name,
        @Size(max = 500) String description,
        ProjectStatus status,
        LocalDateTime dueDate
) {}