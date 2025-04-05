package com.synapsecode.backend.events;

import com.synapsecode.backend.dto.UserDto;
import com.synapsecode.backend.entity.User;
import lombok.Getter;
import lombok.Setter;
import org.springframework.context.ApplicationEvent;

@Getter
@Setter
public class RegistrationCompleteEvent extends ApplicationEvent {
    private final UserDto userdto;
    private String verificationUrl;

    public RegistrationCompleteEvent(UserDto userdto, String verificationUrl) {
        super(userdto);
        this.userdto = userdto;
        this.verificationUrl = verificationUrl;
    }

}
