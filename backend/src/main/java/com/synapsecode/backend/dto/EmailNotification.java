package com.synapsecode.backend.dto;

public record EmailNotification(
        String to,
        String subject,
        String body
) {}