package com.synapsecode.backend.service;

import com.synapsecode.backend.dto.TaskRequest;
import com.synapsecode.backend.dto.TaskResponse;
import com.synapsecode.backend.dto.TaskUpdateRequest;

import java.util.List;

public interface TaskService {
    public List<TaskResponse> getUserTasks(Long userId);
    public TaskResponse createTask(Long userId, TaskRequest request);
    public TaskResponse updateTask(Long userId, Long taskId, TaskUpdateRequest request);
    public void deleteTask(Long userId, Long taskId);

}
