package com.synapsecode.backend.dto;

import com.synapsecode.backend.entity.TaskStatus;

import java.time.LocalDateTime;
import java.util.List;

public record TaskUpdateRequest(
        String title,
        String description,
        TaskStatus status,
        List<Long> assigneeIds,
        LocalDateTime dueDate
) {
}
