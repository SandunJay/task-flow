package com.synapsecode.backend.controller;

import com.synapsecode.backend.dto.*;
import com.synapsecode.backend.entity.User;
import com.synapsecode.backend.repository.UserRepository;
import com.synapsecode.backend.response.ApiResponse;
import com.synapsecode.backend.response.ResponseBuilder;
import com.synapsecode.backend.security.JwtUtils;
import com.synapsecode.backend.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;
    private final JwtUtils jwtUtils;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<TaskResponse>>> getAllTasks(
            @RequestHeader("Authorization") String token
    ) {
        String email = jwtUtils.extractUsername(token.substring(7));
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return ResponseEntity.ok(
                ResponseBuilder.success(taskService.getUserTasks(user.getId()))
        );
    }

    @PostMapping
    public ResponseEntity<ApiResponse<TaskResponse>> createTask(
            @RequestHeader("Authorization") String token,
            @Valid @RequestBody TaskRequest request
    ) {
        String email = jwtUtils.extractUsername(token.substring(7));
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return ResponseEntity.ok(
                ResponseBuilder.success(taskService.createTask(user.getId(), request))
        );
    }

    @PutMapping("/{taskId}")
    public ResponseEntity<ApiResponse<TaskResponse>> updateTask(
            @RequestHeader("Authorization") String token,
            @PathVariable Long taskId,
            @Valid @RequestBody TaskUpdateRequest request
    ) {
        String email = jwtUtils.extractUsername(token.substring(7));
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return ResponseEntity.ok(
                ResponseBuilder.success(taskService.updateTask(user.getId(), taskId, request))
        );
    }

    @DeleteMapping("/{taskId}")
    public ResponseEntity<ApiResponse<Void>> deleteTask(
            @RequestHeader("Authorization") String token,
            @PathVariable Long taskId
    ) {
        String email = jwtUtils.extractUsername(token.substring(7));
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        taskService.deleteTask(user.getId(), taskId);
        return ResponseEntity.ok(ResponseBuilder.success(null));
    }
}