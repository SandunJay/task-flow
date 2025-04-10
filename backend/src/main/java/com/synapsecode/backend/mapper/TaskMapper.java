package com.synapsecode.backend.mapper;

import com.synapsecode.backend.dto.TaskRequest;
import com.synapsecode.backend.dto.TaskResponse;
import com.synapsecode.backend.dto.TaskUpdateRequest;
import com.synapsecode.backend.entity.Task;
import com.synapsecode.backend.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring", uses = { SubTaskMapper.class },
        unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface TaskMapper {

    TaskMapper INSTANCE = Mappers.getMapper(TaskMapper.class);

    // Map Task entity to TaskResponse
    @Mapping(target = "subTasks", source = "subTasks")
    @Mapping(target = "assignees", source = "assignees")
    @Mapping(target = "createdBy", source = "createdBy")
    TaskResponse toResponse(Task task);

    // Map TaskRequest to Task entity
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "title", source = "request.title")
    @Mapping(target = "description", source = "request.description")
    @Mapping(target = "status", source = "request.status")
    @Mapping(target = "dueDate", source = "request.dueDate")
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "assignees", ignore = true) // Handled in service
    @Mapping(target = "subTasks", ignore = true)
    @Mapping(target = "createdBy", source = "createdBy")
    @Mapping(target = "project", ignore = true) // Handled in service
    Task toEntity(TaskRequest request, User createdBy);

    // Update Task entity from TaskUpdateRequest
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "project", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "subTasks", ignore = true)
    @Mapping(target = "assignees", ignore = true) // Handled in service
    void toUpdateTask(TaskUpdateRequest request, @MappingTarget Task task);
}
