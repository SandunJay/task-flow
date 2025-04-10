package com.synapsecode.backend.service.impl;

import com.synapsecode.backend.dto.*;
import com.synapsecode.backend.entity.Project;
import com.synapsecode.backend.entity.SubTask;
import com.synapsecode.backend.entity.Task;
import com.synapsecode.backend.entity.User;
import com.synapsecode.backend.events.SubTaskEvent;
import com.synapsecode.backend.events.TaskEvent;
import com.synapsecode.backend.exception.ResourceNotFoundException;
import com.synapsecode.backend.mapper.SubTaskMapper;
import com.synapsecode.backend.mapper.TaskMapper;
import com.synapsecode.backend.mapper.UserMapper;
import com.synapsecode.backend.repository.ProjectRepository;
import com.synapsecode.backend.repository.SubTaskRepository;
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

@Service
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService {
    public static final String SUB_TASK = "SubTask";
    private final TaskRepository taskRepository;
    private final SubTaskRepository subTaskRepository;
    private final ProjectRepository projectRepository;
    private final TaskMapper taskMapper;
    private final UserMapper userMapper;
    private final SubTaskMapper subTaskMapper;
    private final UserRepository userRepository;
    private final RedisTemplate<String, Object> redisTemplate;
    private final ApplicationEventPublisher eventPublisher;

    @Override
    @Cacheable(value = "userTasks", key = "#userId")
    @Transactional(readOnly = true)
    public List<TaskResponse> getTasks(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        return taskRepository.findByCreatedBy(user).stream()
                .map(taskMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional
    @CacheEvict(value = "userTasks", key = "#userId")
    public TaskResponse createTask(Long userId, TaskRequest request) {
        User createdBy = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        // Validate project exists and user has access
        Project project = projectRepository.findByIdAndCreatedBy(request.projectId(), createdBy)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", request.projectId()));

        Task task = taskMapper.toEntity(request, createdBy);
        task.setProject(project);

        // Handle assignees
        if (request.assigneeIds() != null && !request.assigneeIds().isEmpty()) {
            List<User> assignees = userRepository.findAllById(request.assigneeIds());
            task.setAssignees(assignees);
        }

        // Handle subtasks
        if (request.subTasks() != null && !request.subTasks().isEmpty()) {
            for (SubTaskRequest subTaskRequest : request.subTasks()) {
                SubTask subTask = subTaskMapper.toEntity(subTaskRequest, task);

                if (subTaskRequest.assignees() != null && !subTaskRequest.assignees().isEmpty()) {
                    List<User> subTaskAssignees = userRepository.findAllById(subTaskRequest.assignees());
                    subTask.setAssignees(subTaskAssignees);
                }

                task.addSubTask(subTask);
            }
        }

        Task savedTask = taskRepository.save(task);
        UserDto userDto = userMapper.toDto(createdBy);

        if (!savedTask.getAssignees().isEmpty()) {
            eventPublisher.publishEvent(new TaskEvent(this, userDto, savedTask));
        }

        return taskMapper.toResponse(savedTask);
    }

    @Override
    @Transactional
    @CachePut(value = "userTasks", key = "#userId")
    public TaskResponse updateTask(Long userId, Long taskId, TaskUpdateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", taskId));

        // Validate task's project is owned by user
        Project project = task.getProject();
        if (project == null || !project.getCreatedBy().getId().equals(userId)) {
            throw new ResourceNotFoundException("Task", "id", taskId);
        }

        taskMapper.toUpdateTask(request, task);

        // Handle assignees
        if (request.assigneeIds() != null) {
            List<User> assignees = userRepository.findAllById(request.assigneeIds());
            task.setAssignees(assignees);
        }

        Task updatedTask = taskRepository.save(task);

        if (!updatedTask.getAssignees().isEmpty()) {
            UserDto userDto = userMapper.toDto(user);
            eventPublisher.publishEvent(new TaskEvent(this, userDto, updatedTask));
        }

        return taskMapper.toResponse(updatedTask);
    }

    @Override
    @Transactional
    @CacheEvict(value = "userTasks", key = "#userId")
    public void deleteTask(Long userId, Long taskId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Task task = taskRepository.findByIdAndCreatedBy(taskId, user)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", taskId));

        // Validate task's project is owned by user
        Project project = task.getProject();
        if (project == null || !project.getCreatedBy().getId().equals(userId)) {
            throw new ResourceNotFoundException("Task", "id", taskId);
        }

        taskRepository.delete(task);
    }

    @Override
    @Transactional
    @CacheEvict(value = "userTasks", key = "#userId")
    public SubTaskResponse addSubTask(Long userId, Long taskId, SubTaskRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", taskId));

        // Validate task's project is owned by user
        Project project = task.getProject();
        if (project == null || !project.getCreatedBy().getId().equals(userId)) {
            throw new ResourceNotFoundException("Task", "id", taskId);
        }

        SubTask subTask = subTaskMapper.toEntity(request, task);

        if (request.assignees() != null && !request.assignees().isEmpty()) {
            List<User> assignees = userRepository.findAllById(request.assignees());
            subTask.setAssignees(assignees);
        }

        SubTask savedSubTask = subTaskRepository.save(subTask);
        UserDto userDto = userMapper.toDto(user);

        if (!savedSubTask.getAssignees().isEmpty()) {
            eventPublisher.publishEvent(new SubTaskEvent(this, userDto, task, savedSubTask));
        }

        return subTaskMapper.toResponse(savedSubTask);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SubTaskResponse> getSubTasksByTaskId(Long userId, Long taskId) {

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", taskId));

        // Validate task's project is owned by user
        Project project = task.getProject();
        if (project == null || !project.getCreatedBy().getId().equals(userId)) {
            throw new ResourceNotFoundException("Task", "id", taskId);
        }

        return task.getSubTasks().stream()
                .map(subTaskMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public SubTaskResponse getSubTask(Long userId, Long taskId, Long subTaskId) {

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", taskId));

        // Validate task's project is owned by user
        Project project = task.getProject();
        if (project == null || !project.getCreatedBy().getId().equals(userId)) {
            throw new ResourceNotFoundException("Task", "id", taskId);
        }

        SubTask subTask = subTaskRepository.findByIdAndParentTask(subTaskId, task)
                .orElseThrow(() -> new ResourceNotFoundException(SUB_TASK, "id", subTaskId));

        return subTaskMapper.toResponse(subTask);
    }

    @Override
    @Transactional
    @CacheEvict(value = "userTasks", key = "#userId")
    public SubTaskResponse updateSubTask(Long userId, Long taskId, Long subTaskId, SubTaskRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", taskId));

        // Validate task's project is owned by user
        Project project = task.getProject();
        if (project == null || !project.getCreatedBy().getId().equals(userId)) {
            throw new ResourceNotFoundException("Task", "id", taskId);
        }

        SubTask subTask = subTaskRepository.findByIdAndParentTask(subTaskId, task)
                .orElseThrow(() -> new ResourceNotFoundException(SUB_TASK, "id", subTaskId));

        subTaskMapper.toUpdateSubTask(request, subTask);

        if (request.assignees() != null) {
            List<User> assignees = userRepository.findAllById(request.assignees());
            subTask.setAssignees(assignees);
        }

        SubTask updatedSubTask = subTaskRepository.save(subTask);
        UserDto userDto = userMapper.toDto(user);

        if (!updatedSubTask.getAssignees().isEmpty()) {
            eventPublisher.publishEvent(new SubTaskEvent(this, userDto, task, updatedSubTask));
        }

        return subTaskMapper.toResponse(updatedSubTask);
    }

    @Override
    @Transactional
    @CacheEvict(value = "userTasks", key = "#userId")
    public void deleteSubTask(Long userId, Long taskId, Long subTaskId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", taskId));

        // Validate task's project is owned by user
        Project project = task.getProject();
        if (project == null || !project.getCreatedBy().getId().equals(userId)) {
            throw new ResourceNotFoundException("Task", "id", taskId);
        }

        SubTask subTask = subTaskRepository.findByIdAndParentTask(subTaskId, task)
                .orElseThrow(() -> new ResourceNotFoundException(SUB_TASK, "id", subTaskId));

        subTaskRepository.delete(subTask);
    }
}