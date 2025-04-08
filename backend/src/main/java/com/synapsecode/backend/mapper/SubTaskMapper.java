package com.synapsecode.backend.mapper;


import com.synapsecode.backend.dto.SubTaskRequest;
import com.synapsecode.backend.dto.SubTaskResponse;
import com.synapsecode.backend.entity.SubTask;
import com.synapsecode.backend.entity.Task;
import com.synapsecode.backend.entity.User;
import com.synapsecode.backend.repository.UserRepository;
import org.mapstruct.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@Mapper(componentModel = "spring",
        uses = UserMapper.class,
        injectionStrategy = InjectionStrategy.CONSTRUCTOR)
public abstract class SubTaskMapper {

    @Autowired
    protected UserRepository userRepository;

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "assignees", expression = "java(mapUsers(request.assigneeIds()))")
    @Mapping(target = "parentTask", source = "parentTask")
    @Mapping(target = "createdAt", ignore = true)
    public abstract SubTask toEntity(SubTaskRequest request, Task parentTask);

    @Mapping(target = "assignees", source = "assignees")
    public abstract SubTaskResponse toResponse(SubTask subTask);

    protected List<User> mapUsers(List<Long> assigneeIds) {
        if (assigneeIds == null) return List.of();
        return userRepository.findAllById(assigneeIds);
    }
}