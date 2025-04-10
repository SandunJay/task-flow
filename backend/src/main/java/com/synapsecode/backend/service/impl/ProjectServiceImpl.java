package com.synapsecode.backend.service.impl;

import com.synapsecode.backend.service.ProjectService;

import com.synapsecode.backend.dto.ProjectRequest;
import com.synapsecode.backend.dto.ProjectResponse;
import com.synapsecode.backend.dto.ProjectUpdateRequest;
import com.synapsecode.backend.entity.Project;
import com.synapsecode.backend.entity.User;
import com.synapsecode.backend.exception.ResourceNotFoundException;
import com.synapsecode.backend.exception.UnauthorizedException;
import com.synapsecode.backend.mapper.ProjectMapper;
import com.synapsecode.backend.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectServiceImpl implements ProjectService {

    public static final String PROJECT = "Project";
    private final ProjectRepository projectRepository;
    private final ProjectMapper projectMapper;

    @Override
    @Transactional
    public ProjectResponse createProject(ProjectRequest request, User currentUser) {
        Project project = projectMapper.toEntity(request, currentUser);
        Project savedProject = projectRepository.save(project);
        return projectMapper.toResponse(savedProject);
    }

    @Override
    @Transactional(readOnly = true)
    public ProjectResponse getProjectById(Long id, User currentUser) {
        Project project = projectRepository.findByIdAndCreatedBy(id, currentUser)
                .orElseThrow(() -> new ResourceNotFoundException(PROJECT, "id", id.toString()));
        return projectMapper.toResponse(project);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProjectResponse> getAllProjects(User currentUser) {
        List<Project> projects = projectRepository.findByCreatedBy(currentUser);
        return projects.stream()
                .map(projectMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional
    public ProjectResponse updateProject(Long id, ProjectUpdateRequest request, User currentUser) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(PROJECT, "id", id.toString()));

        // Verify ownership
        if (!project.getCreatedBy().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You don't have permission to update this project");
        }

        projectMapper.updateProjectFromDto(request, project);
        Project updatedProject = projectRepository.save(project);
        return projectMapper.toResponse(updatedProject);
    }

    @Override
    @Transactional
    public void deleteProject(Long id, User currentUser) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(PROJECT, "id", id.toString()));

        // Verify ownership
        if (!project.getCreatedBy().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You don't have permission to delete this project");
        }

        projectRepository.delete(project);
    }
}