package com.synapsecode.backend.service;


import com.synapsecode.backend.dto.UserDto;
import com.synapsecode.backend.entity.Task;
import com.synapsecode.backend.entity.User;

public interface EmailService {
    void sendVerificationEmail(UserDto userDto, String verificationUrl);
    void sendPasswordResetEmail(UserDto userDto, String resetUrl);
    void sendTaskNotificationEmail(UserDto userDto, Task taskDetails);
}