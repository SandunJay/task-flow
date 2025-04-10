package com.synapsecode.backend.dto;

import com.synapsecode.backend.entity.TaskStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;

public record SubTaskRequest(
        @NotBlank @Size(max = 100) String title,
        @Size(max = 500) String description,
        TaskStatus status,
        List<Long> assignees,
        @NotNull Long projectId,
        @NotNull Long taskId
) {}