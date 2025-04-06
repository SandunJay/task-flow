package com.synapsecode.backend.repository;


import com.synapsecode.backend.entity.SubTask;
import com.synapsecode.backend.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SubTaskRepository extends JpaRepository<SubTask, Long> {
    List<SubTask> findByParentTask(Task task);
    Optional<SubTask> findByIdAndParentTask(Long id, Task task);
}