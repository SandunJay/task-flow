package com.synapsecode.backend.dto;

import com.synapsecode.backend.entity.ProjectStatus;

import java.time.LocalDateTime;
import java.util.List;

public record ProjectResponse(
        Long id,
        String name,
        String description,
        ProjectStatus status,
        LocalDateTime dueDate,
        UserDto createdBy,
        List<TaskResponse> tasks,
        LocalDateTime createdAt
) {}