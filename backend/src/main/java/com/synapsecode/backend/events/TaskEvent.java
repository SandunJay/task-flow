package com.synapsecode.backend.events;

import com.synapsecode.backend.entity.Task;
import org.springframework.context.ApplicationEvent;

public class TaskEvent extends ApplicationEvent {
    private final Task task;

    public TaskEvent(Object source, Task task) {
        super(source);
        this.task = task;
    }

    public Task getTask() {
        return task;
    }
}
