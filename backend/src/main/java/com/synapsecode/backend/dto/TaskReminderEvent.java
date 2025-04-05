package com.synapsecode.backend.dto;

import com.synapsecode.backend.entity.Task;

public record TaskReminderEvent(Task task) {
}
