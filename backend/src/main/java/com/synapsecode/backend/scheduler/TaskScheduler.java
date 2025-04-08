package com.synapsecode.backend.scheduler;

import com.synapsecode.backend.dto.TaskReminderEvent;
import com.synapsecode.backend.entity.Task;
import com.synapsecode.backend.entity.TaskStatus;
import com.synapsecode.backend.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class TaskScheduler {

    private final TaskRepository taskRepository;
    private final ApplicationEventPublisher eventPublisher;

    @Scheduled(cron = "0 0 9 * * ?") // Daily at 9 AM
    public void checkOverdueTasks() {
        List<Task> overdueTasks = taskRepository.findByDueDateBeforeAndStatusNot(
                LocalDateTime.now(),
                TaskStatus.COMPLETED
        );

        overdueTasks.forEach(task -> {
            eventPublisher.publishEvent(new TaskReminderEvent(task));
        });
    }
}