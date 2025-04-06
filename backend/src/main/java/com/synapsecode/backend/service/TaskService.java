package com.synapsecode.backend.service;

import com.synapsecode.backend.dto.*;

import java.util.List;

public interface TaskService {
    public List<TaskResponse> getUserTasks(Long userId);
    public TaskResponse createTask(Long userId, TaskRequest request);
    public TaskResponse updateTask(Long userId, Long taskId, TaskUpdateRequest request);
    public void deleteTask(Long userId, Long taskId);
    // Add to TaskService interface
    SubTaskResponse addSubTask(Long userId, Long taskId, SubTaskRequest request);
    SubTaskResponse updateSubTask(Long userId, Long taskId, Long subTaskId, SubTaskRequest request);
    void deleteSubTask(Long userId, Long taskId, Long subTaskId);
}
