package com.synapsecode.backend.service;

import com.synapsecode.backend.dto.ProjectRequest;
import com.synapsecode.backend.dto.ProjectResponse;
import com.synapsecode.backend.dto.ProjectUpdateRequest;
import com.synapsecode.backend.entity.User;

import java.util.List;

public interface ProjectService {
    ProjectResponse createProject(ProjectRequest request, User currentUser);
    ProjectResponse getProjectById(Long id, User currentUser);
    List<ProjectResponse> getAllProjects(User currentUser);
    ProjectResponse updateProject(Long id, ProjectUpdateRequest request, User currentUser);
    void deleteProject(Long id, User currentUser);
}
