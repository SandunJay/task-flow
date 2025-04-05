//package com.synapsecode.backend.scheduler;
//
//import com.synapsecode.backend.entity.Task;
//import com.synapsecode.backend.service.EmailService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.scheduling.annotation.Scheduled;
//import org.springframework.stereotype.Component;
//
//import java.util.List;
//
//@Component
//@RequiredArgsConstructor
//public class EmailScheduler {
//
//    private final TaskService taskService;
//    private final EmailService emailService;
//
//    @Scheduled(cron = "0 0 9 * * ?") // Daily at 9 AM
//    public void sendDailySummary() {
//        List<Task> overdueTasks = taskService.getOverdueTasks();
//        emailService.sendDailySummary(overdueTasks);
//    }
//}