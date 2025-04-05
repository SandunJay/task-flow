package com.synapsecode.backend.service.impl;

import com.synapsecode.backend.dto.*;
import com.synapsecode.backend.entity.Task;
import com.synapsecode.backend.entity.User;
import com.synapsecode.backend.events.TaskEvent;
import com.synapsecode.backend.exception.ResourceNotFoundException;
import com.synapsecode.backend.mapper.TaskMapper;
import com.synapsecode.backend.mapper.UserMapper;
import com.synapsecode.backend.repository.TaskRepository;
import com.synapsecode.backend.repository.UserRepository;
import com.synapsecode.backend.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService {
    private final TaskRepository taskRepository;
    private final TaskMapper taskMapper;
    private final UserMapper userMapper;
    private final UserRepository userRepository;
    private final RedisTemplate<String, Object> redisTemplate;
    private final ApplicationEventPublisher eventPublisher;


    @Cacheable(value = "userTasks", key = "#userId")
    public List<TaskResponse> getUserTasks(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        return taskRepository.findByCreatedBy(user).stream()
                .map(taskMapper::toResponse)
                .toList();
    }

    @Transactional
    @CacheEvict(value = "userTasks", key = "#userId")
    public TaskResponse createTask(Long userId, TaskRequest request) {
        User createdBy = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Task task = taskMapper.toEntity(request, createdBy);
        Task savedTask = taskRepository.save(task);

        UserDto userDto = userMapper.toDto(createdBy);

        if (!savedTask.getAssignees().isEmpty()) {
            eventPublisher.publishEvent(new TaskEvent(this, userDto, savedTask));
        }
        return taskMapper.toResponse(savedTask);
    }

    @Transactional
    @CachePut(value = "userTasks", key = "#userId")
    public TaskResponse updateTask(Long userId, Long taskId, TaskUpdateRequest request) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", taskId));

        taskMapper.updateTaskFromDto(request, task);
        Task updatedTask = taskRepository.save(task);

        eventPublisher.publishEvent(new TaskAssignedEvent(updatedTask));

        return taskMapper.toResponse(updatedTask);
    }

    @CacheEvict(value = "userTasks", key = "#userId")
    public void deleteTask(Long userId, Long taskId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        Task task = taskRepository.findByIdAndCreatedBy(taskId, user)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", taskId));
        taskRepository.delete(task);
    }
}
