package com.synapsecode.backend.listener;

import com.synapsecode.backend.dto.EmailNotification;
import com.synapsecode.backend.dto.TaskAssignedEvent;
import com.synapsecode.backend.dto.TaskReminderEvent;
import com.synapsecode.backend.dto.UserDto;
import com.synapsecode.backend.events.TaskEvent;
import com.synapsecode.backend.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class TaskEventListener {

    private final EmailService emailService;
    private final RabbitTemplate rabbitTemplate;

    @Async
    @EventListener
    public void handleTaskAssignment(TaskEvent event) {
//        event.task().getAssignees().forEach(user -> {
//            String message = String.format(
//                    "You have been assigned to task: %s\nDue Date: %s",
//                    event.task().getTitle(),
//                    event.task().getDueDate()
//            );
//            rabbitTemplate.convertAndSend(
//                    "emailQueue",
//                    new EmailNotification(
//                            user.getEmail(),
//                            "New Task Assignment",
//                            message
//                    )
//            );
//        });
        event.getTask().getAssignees().forEach(assignee -> {
            UserDto assigneeDto = new UserDto(assignee.getId(), assignee.getEmail(), true);
            emailService.sendTaskNotificationEmail(assigneeDto, event.getTask());
        });
//        emailService.sendTaskNotificationEmail(event.getUserdto(), event.getTask());
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