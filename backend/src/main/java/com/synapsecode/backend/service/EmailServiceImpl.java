package com.synapsecode.backend.service;

import com.synapsecode.backend.dto.UserDto;
import com.synapsecode.backend.entity.User;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    @Override
    public void sendVerificationEmail(UserDto user, String verificationUrl) {
        Context context = new Context();
        context.setVariable("name", user.email());
        context.setVariable("verificationUrl", verificationUrl);
        sendEmail(user.email(), "Verify Your Email", "EmailVerification", context);
    }

    @Override
    public void sendPasswordResetEmail(UserDto user, String resetUrl) {
        Context context = new Context();
        context.setVariable("name", user.email());
        context.setVariable("resetUrl", resetUrl);
        sendEmail(user.email(), "Password Reset Request", "PasswordReset", context);
    }

    @Override
    public void sendTaskNotificationEmail(UserDto user, String taskDetails) {

    }

    private void sendEmail(String to, String subject, String templateName, Context context) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message);

            String htmlContent = templateEngine.process("emails/" + templateName, context);

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send email", e);
        }
    }
}