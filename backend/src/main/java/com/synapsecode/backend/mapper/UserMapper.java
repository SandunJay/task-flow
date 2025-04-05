package com.synapsecode.backend.mapper;

import com.synapsecode.backend.dto.RegisterRequest;
import com.synapsecode.backend.dto.UserDto;
import com.synapsecode.backend.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface UserMapper {

    UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);

    @Mapping(target = "password", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "enabled", constant = "false")
    User toEntity(RegisterRequest registerRequest);

    UserDto toDto(User user);

    @Mapping(target = "id", ignore = true)
    void updateUserFromDto(UserDto userDto, @MappingTarget User user);
}