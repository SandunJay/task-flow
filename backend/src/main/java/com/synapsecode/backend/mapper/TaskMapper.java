package com.synapsecode.backend.mapper;

import com.synapsecode.backend.dto.TaskRequest;
import com.synapsecode.backend.dto.TaskResponse;
import com.synapsecode.backend.entity.Task;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface TaskMapper {
    TaskResponse toResponse(Task task);
    Task toEntity(TaskRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateTaskFromDto(TaskRequest dto, @MappingTarget Task entity);
}


