package com.synapsecode.backend.listener;

import com.synapsecode.backend.dto.EmailNotification;
import com.synapsecode.backend.dto.TaskAssignedEvent;
import com.synapsecode.backend.dto.TaskReminderEvent;
import com.synapsecode.backend.dto.UserDto;
import com.synapsecode.backend.entity.User;
import com.synapsecode.backend.events.SubTaskEvent;
import com.synapsecode.backend.events.TaskEvent;
import com.synapsecode.backend.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class TaskEventListener {

    private final EmailService emailService;
    private final RabbitTemplate rabbitTemplate;

//    @Async
//    @EventListener
//    public void handleTaskAssignment(TaskEvent event) {
//        event.getTask().getAssignees().forEach(assignee -> {
//            UserDto assigneeDto = new UserDto(assignee.getId(), assignee.getEmail(), true);
//            emailService.sendTaskNotificationEmail(assigneeDto, event.getTask());
//        });
//    }
    @Async
    @EventListener
    public void handleTaskAssignment(TaskEvent event) {
        // Get all assignees from the task and its subtasks
        Set<User> allAssignees = new HashSet<>(event.getTask().getAssignees());

        // Add assignees from subtasks if any
        if (event.getTask().getSubTasks() != null) {
            event.getTask().getSubTasks().forEach(subTask ->
                    allAssignees.addAll(subTask.getAssignees())
            );
        }

        // Send notification to each assignee only once
        allAssignees.forEach(assignee -> {
            UserDto assigneeDto = new UserDto(assignee.getId(), assignee.getEmail(), true);
            emailService.sendTaskNotificationEmail(assigneeDto, event.getTask());
        });
    }

    @Async
    @EventListener
    public void handleSubTaskAssignment(SubTaskEvent event) {
        // Get assignees already notified for the parent task
        Set<Long> parentTaskAssigneeIds = event.getTask().getAssignees().stream()
                .map(User::getId)
                .collect(Collectors.toSet());

        // Only notify assignees not already assigned to the parent task
        event.getSubTask().getAssignees().stream()
                .filter(assignee -> !parentTaskAssigneeIds.contains(assignee.getId()))
                .forEach(assignee -> {
                    UserDto assigneeDto = new UserDto(assignee.getId(), assignee.getEmail(), true);
                    emailService.sendTaskNotificationEmail(assigneeDto, event.getTask());
                });
    }

    @Async
    @EventListener
    public void handleTaskReminder(TaskReminderEvent event) {
        event.task().getAssignees().forEach(user -> {
            String message = String.format(
                    "Reminder: Task '%s' is due on %s",
                    event.task().getTitle(),
                    event.task().getDueDate()
            );
            rabbitTemplate.convertAndSend(
                    "emailQueue",
                    new EmailNotification(
                            user.getEmail(),
                            "Task Deadline Reminder",
                            message
                    )
            );
        });
    }
}