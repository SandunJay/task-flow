package com.synapsecode.backend.config;

import org.springframework.amqp.core.Queue;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String TASK_QUEUE = "task_queue";
    private static final String EMAIL_QUEUE = "email_queue";
    public static final String REGISTRATION_QUEUE = "registration_queue";

    @Bean
    public Queue taskQueue() {
        return new Queue(TASK_QUEUE);
    }

    @Bean
    public Queue emailQueue() {
        return new Queue(EMAIL_QUEUE);
    }

    @Bean
    public Queue registrationQueue() {
        return new Queue(REGISTRATION_QUEUE);
    }
}