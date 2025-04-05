//package com.synapsecode.backend.listener;
//
//import com.synapsecode.backend.config.RabbitMQConfig;
//import com.synapsecode.backend.events.TaskEvent;
//import com.synapsecode.backend.service.EmailService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.amqp.rabbit.annotation.RabbitListener;
//import org.springframework.amqp.rabbit.core.RabbitTemplate;
//import org.springframework.context.event.EventListener;
//import org.springframework.scheduling.annotation.Async;
//import org.springframework.stereotype.Component;
//
//@Component
//@RequiredArgsConstructor
//public class TaskEventListener {
//
//    private final RabbitTemplate rabbitTemplate;
//    private final EmailService emailService;
//
//    @Async
//    @EventListener
//    public void handleTaskEvent(TaskEvent event) {
//        rabbitTemplate.convertAndSend(RabbitMQConfig.TASK_QUEUE, event);
//    }
//
//    @RabbitListener(queues = RabbitMQConfig.TASK_QUEUE)
//    public void processTaskEvent(TaskEvent event) {
//        emailService.sendTaskNotification(event.getTask());
//    }
//}