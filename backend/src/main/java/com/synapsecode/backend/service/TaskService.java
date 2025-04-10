package com.synapsecode.backend.service;

import com.synapsecode.backend.dto.*;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface TaskService {
     List<TaskResponse> getTasks(Long userId);
     TaskResponse createTask(Long userId, TaskRequest request);
     TaskResponse updateTask(Long userId, Long taskId, TaskUpdateRequest request);
     void deleteTask(Long userId, Long taskId);
    // Add to TaskService interface
    SubTaskResponse addSubTask(Long userId, Long taskId, SubTaskRequest request);

    @Transactional(readOnly = true)
    List<SubTaskResponse> getSubTasksByTaskId(Long userId, Long taskId);

    @Transactional(readOnly = true)
    SubTaskResponse getSubTask(Long userId, Long taskId, Long subTaskId);

    SubTaskResponse updateSubTask(Long userId, Long taskId, Long subTaskId, SubTaskRequest request);
    void deleteSubTask(Long userId, Long taskId, Long subTaskId);
}
