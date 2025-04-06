package com.synapsecode.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@EntityListeners(AuditingEntityListener.class)
public class SubTask {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 100)
    @Column(nullable = false)
    private String title;

    @Size(max = 500)
    private String description;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "subtask_assignees",
            joinColumns = @JoinColumn(name = "subtask_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private List<User> assignees;

    @Enumerated(EnumType.STRING)
    private TaskStatus status = TaskStatus.TO_DO;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id", nullable = false)
    private Task parentTask;

    @CreatedDate
    private LocalDateTime createdAt;
}