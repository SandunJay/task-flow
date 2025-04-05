package com.synapsecode.backend.mapper;

import com.synapsecode.backend.dto.TaskRequest;
import com.synapsecode.backend.dto.TaskResponse;
import com.synapsecode.backend.dto.TaskUpdateRequest;
import com.synapsecode.backend.entity.Task;
import com.synapsecode.backend.entity.User;
import com.synapsecode.backend.repository.UserRepository;
import org.mapstruct.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@Mapper(componentModel = "spring",
        uses = UserMapper.class,
        injectionStrategy = InjectionStrategy.CONSTRUCTOR)
public abstract class TaskMapper {

    @Autowired
    protected UserRepository userRepository;

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "assignees", expression = "java(mapUsers(request.assigneeIds()))")
    @Mapping(target = "createdBy", source = "createdBy")
    @Mapping(target = "createdAt", ignore = true)
    public abstract Task toEntity(TaskRequest request, User createdBy);

    @Mapping(target = "assignees", source = "assignees")
    @Mapping(target = "createdBy", source = "createdBy")
    public abstract TaskResponse toResponse(Task task);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "assignees", expression = "java(updateAssignees(dto.assigneeIds(), task))")
    public abstract void updateTaskFromDto(TaskUpdateRequest dto, @MappingTarget Task task);

    protected List<User> mapUsers(List<Long> assigneeIds) {
        if (assigneeIds == null) return List.of();
        return userRepository.findAllById(assigneeIds);
    }

    protected List<User> updateAssignees(List<Long> assigneeIds, Task task) {
        if (assigneeIds == null) return task.getAssignees();
        return userRepository.findAllById(assigneeIds);
    }
}