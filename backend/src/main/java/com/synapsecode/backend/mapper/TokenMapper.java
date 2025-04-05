package com.synapsecode.backend.mapper;


import com.synapsecode.backend.dto.TokenDto;
import com.synapsecode.backend.entity.Token;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        uses = {UserMapper.class})
public interface TokenMapper {

    TokenMapper INSTANCE = Mappers.getMapper(TokenMapper.class);

    @Mapping(target = "user", source = "user")
    TokenDto toDto(Token token);

    @Mapping(target = "id", ignore = true)
    Token toEntity(TokenDto tokenDto);
}