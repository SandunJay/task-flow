package com.synapsecode.backend.events;

import com.synapsecode.backend.dto.UserDto;
import com.synapsecode.backend.entity.Task;
import lombok.Getter;
import lombok.Setter;
import org.springframework.context.ApplicationEvent;

@Getter
@Setter
public class TaskEvent extends ApplicationEvent {
    private final UserDto userdto;
    private final Task task;

    public TaskEvent(Object source, UserDto userdto, Task task) {
        super(source);
        this.userdto = userdto;
        this.task = task;
    }

}
