package com.synapsecode.backend.dto;

import com.synapsecode.backend.entity.TaskStatus;
import java.time.LocalDateTime;
import java.util.List;

public record SubTaskResponse(
        Long id,
        String title,
        String description,
        TaskStatus status,
        List<UserDto> assignees,
        LocalDateTime createdAt
) {}