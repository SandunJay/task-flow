package com.synapsecode.backend.events;


import com.synapsecode.backend.dto.UserDto;
import com.synapsecode.backend.entity.SubTask;
import com.synapsecode.backend.entity.Task;
import lombok.Getter;
import lombok.Setter;
import org.springframework.context.ApplicationEvent;

@Getter
@Setter
public class SubTaskEvent extends ApplicationEvent {
    private final UserDto userDto;
    private final Task task;
    private final SubTask subTask;

    public SubTaskEvent(Object source, UserDto userDto, Task task, SubTask subTask) {
        super(source);
        this.userDto = userDto;
        this.task = task;
        this.subTask = subTask;
    }
}