package com.synapsecode.backend.events;

import com.synapsecode.backend.dto.UserDto;
import org.springframework.context.ApplicationEvent;

public class PasswordResetEvent extends ApplicationEvent {
    private final UserDto userdto;
    private final String token;

    public PasswordResetEvent(UserDto userdto, String token) {
        super(userdto);
        this.userdto = userdto;
        this.token = token;
    }

}