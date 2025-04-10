package com.synapsecode.backend.controller;

import com.synapsecode.backend.dto.SubTaskRequest;
import com.synapsecode.backend.dto.SubTaskResponse;
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
@RequestMapping("/api/v1/tasks/{taskId}/subtasks")
@RequiredArgsConstructor
public class SubTaskController {

    public static final String USER_NOT_FOUND = "User not found";
    private final TaskService taskService;
    private final JwtUtils jwtUtils;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<SubTaskResponse>>> getSubTasks(
            @RequestHeader("Authorization") String token,
            @PathVariable Long taskId
    ) {
        String email = jwtUtils.extractUsername(token.substring(7));
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException(USER_NOT_FOUND));

        return ResponseEntity.ok(
                ResponseBuilder.success(taskService.getSubTasksByTaskId(user.getId(), taskId))
        );
    }

    @PostMapping
    public ResponseEntity<ApiResponse<SubTaskResponse>> createSubTask(
            @RequestHeader("Authorization") String token,
            @PathVariable Long taskId,
            @Valid @RequestBody SubTaskRequest request
    ) {
        String email = jwtUtils.extractUsername(token.substring(7));
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException(USER_NOT_FOUND));

        return ResponseEntity.ok(
                ResponseBuilder.success(taskService.addSubTask(user.getId(), taskId, request))
        );
    }

    @GetMapping("/{subTaskId}")
    public ResponseEntity<ApiResponse<SubTaskResponse>> getSubTask(
            @RequestHeader("Authorization") String token,
            @PathVariable Long taskId,
            @PathVariable Long subTaskId
    ) {
        String email = jwtUtils.extractUsername(token.substring(7));
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException(USER_NOT_FOUND));

        return ResponseEntity.ok(
                ResponseBuilder.success(taskService.getSubTask(user.getId(), taskId, subTaskId))
        );
    }

    @PutMapping("/{subTaskId}")
    public ResponseEntity<ApiResponse<SubTaskResponse>> updateSubTask(
            @RequestHeader("Authorization") String token,
            @PathVariable Long taskId,
            @PathVariable Long subTaskId,
            @Valid @RequestBody SubTaskRequest request
    ) {
        String email = jwtUtils.extractUsername(token.substring(7));
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException(USER_NOT_FOUND));

        return ResponseEntity.ok(
                ResponseBuilder.success(taskService.updateSubTask(user.getId(), taskId, subTaskId, request))
        );
    }

    @DeleteMapping("/{subTaskId}")
    public ResponseEntity<ApiResponse<Void>> deleteSubTask(
            @RequestHeader("Authorization") String token,
            @PathVariable Long taskId,
            @PathVariable Long subTaskId
    ) {
        String email = jwtUtils.extractUsername(token.substring(7));
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException(USER_NOT_FOUND));

        taskService.deleteSubTask(user.getId(), taskId, subTaskId);
        return ResponseEntity.ok(ResponseBuilder.success(null));
    }
}