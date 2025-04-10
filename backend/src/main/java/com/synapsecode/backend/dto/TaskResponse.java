package com.synapsecode.backend.dto;

import com.synapsecode.backend.entity.TaskStatus;

import java.time.LocalDateTime;
import java.util.List;

public record TaskResponse(
        Long id,
        String title,
        String description,
        TaskStatus status,
        List<UserDto> assignees,
        UserDto createdBy,
        LocalDateTime dueDate,
        LocalDateTime createdAt,
        List<SubTaskResponse> subTasks
) {}