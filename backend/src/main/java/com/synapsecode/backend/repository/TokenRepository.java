package com.synapsecode.backend.repository;

import com.synapsecode.backend.entity.Token;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.Optional;

public interface TokenRepository extends JpaRepository<Token, Long> {
    Optional<Token> findByToken(String token);

    void deleteAllByExpiryDateBefore(LocalDateTime now);
}
