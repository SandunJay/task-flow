package com.synapsecode.backend.repository;

import com.synapsecode.backend.entity.Task;
import com.synapsecode.backend.entity.TaskStatus;
import com.synapsecode.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByCreatedBy(User user);
    List<Task> findByCreatedByAndStatus(User user, TaskStatus status);
    List<Task> findByCreatedByAndDueDateBefore(User user, LocalDateTime date);

    Optional<Task> findByIdAndCreatedBy(Long taskId, User user);

    List<Task> findByDueDateBeforeAndStatusNot(LocalDateTime date, TaskStatus status);
}