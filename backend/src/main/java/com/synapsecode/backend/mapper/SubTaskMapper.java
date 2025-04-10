package com.synapsecode.backend.mapper;

import com.synapsecode.backend.dto.SubTaskRequest;
import com.synapsecode.backend.dto.SubTaskResponse;
import com.synapsecode.backend.entity.SubTask;
import com.synapsecode.backend.entity.Task;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring",
        uses = { UserMapper.class },
        unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface SubTaskMapper {

    // Map SubTask entity to SubTaskResponse
    @Mapping(target = "title", source = "title")
    @Mapping(target = "description", source = "description")
    @Mapping(target = "status", source = "status")
    @Mapping(target = "assignees", source = "assignees")
    SubTaskResponse toResponse(SubTask subTask);

    // Map SubTaskRequest to SubTask entity
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "title", source = "request.title")
    @Mapping(target = "description", source = "request.description")
    @Mapping(target = "status", source = "request.status")
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "assignees", ignore = true) // Handled in service
    @Mapping(target = "parentTask", source = "parentTask")
    SubTask toEntity(SubTaskRequest request, Task parentTask);

    // Update SubTask entity from SubTaskRequest
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "parentTask", ignore = true)
    @Mapping(target = "assignees", ignore = true) // Handled in service
    void toUpdateSubTask(SubTaskRequest request, @MappingTarget SubTask subTask);

}
