package com.synapsecode.backend.repository;

import com.synapsecode.backend.entity.Project;
import com.synapsecode.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByCreatedBy(User user);
    Optional<Project> findByIdAndCreatedBy(Long id, User user);
}
