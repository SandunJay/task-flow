package com.synapsecode.backend.mapper;

import com.synapsecode.backend.dto.ProjectRequest;
import com.synapsecode.backend.dto.ProjectResponse;
import com.synapsecode.backend.dto.ProjectUpdateRequest;
import com.synapsecode.backend.entity.Project;
import com.synapsecode.backend.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring", uses = { TaskMapper.class },
        unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ProjectMapper {

    // Map Project entity to ProjectResponse
    @Mapping(target = "tasks", source = "tasks")
    @Mapping(target = "createdBy", source = "createdBy")
    ProjectResponse toResponse(Project project);

    // Map ProjectRequest to Project entity
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "tasks", ignore = true)
    @Mapping(target = "createdBy", source = "createdBy")
    Project toEntity(ProjectRequest request, User createdBy);

    // Update Project entity from ProjectUpdateRequest
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "tasks", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    void updateProjectFromDto(ProjectUpdateRequest request, @MappingTarget Project project);

}
