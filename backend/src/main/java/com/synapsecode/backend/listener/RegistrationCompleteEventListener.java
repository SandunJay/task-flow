package com.synapsecode.backend.listener;


import com.synapsecode.backend.config.RabbitMQConfig;
import com.synapsecode.backend.events.RegistrationCompleteEvent;
import com.synapsecode.backend.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class RegistrationCompleteEventListener {

    private final EmailService emailService;
    private final RabbitTemplate rabbitTemplate;


    @Async
    @EventListener
    public void handleRegistrationEvent(RegistrationCompleteEvent event) {
        emailService.sendVerificationEmail(event.getUserdto(), event.getVerificationUrl());
    }
}