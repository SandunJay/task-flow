package com.synapsecode.backend.service.impl;

import com.synapsecode.backend.entity.Token;
import com.synapsecode.backend.entity.TokenType;
import com.synapsecode.backend.entity.User;
import com.synapsecode.backend.repository.TokenRepository;
import com.synapsecode.backend.repository.UserRepository;
import com.synapsecode.backend.service.TokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TokenServiceImpl implements TokenService {

    private final RedisTemplate<String, Object> redisTemplate;

    private static final String VERIFICATION_PREFIX = "verify:";
    private static final String PASSWORD_RESET_PREFIX = "reset:";
    private static final String REFRESH_PREFIX = "refresh:";
    private final TokenRepository tokenRepository;
    private final UserRepository userRepository;

    @Override
    public String generateToken(User user, TokenType tokenType, long expirationSeconds) {
        return UUID.randomUUID().toString();
    }

    @Override
    public void saveToken(String token, User user, TokenType tokenType, long expirationSeconds) {
        String key = createTokenKey(token, tokenType);
        Map<String, String> tokenData = new HashMap<>();
        tokenData.put("email", user.getEmail());
        tokenData.put("tokenType", tokenType.name());
        tokenData.put("expiryDate", LocalDateTime.now().plusSeconds(expirationSeconds).toString());

        redisTemplate.opsForValue().set(key, tokenData, Duration.ofSeconds(expirationSeconds));
    }

    @Override
    public Optional<Token> validateToken(String token, TokenType tokenType) {
        String key = createTokenKey(token, tokenType);
        Map<String, String> tokenData = (Map<String, String>) redisTemplate.opsForValue().get(key);

        if (tokenData == null) {
            return Optional.empty();
        }

        String savedTokenType = tokenData.get("tokenType");
        if (!tokenType.name().equals(savedTokenType)) {
            return Optional.empty();
        }

        String email = tokenData.get("email");
        LocalDateTime expiryDate = LocalDateTime.parse(tokenData.get("expiryDate"));

        if (expiryDate.isBefore(LocalDateTime.now())) {
            deleteToken(token);
            return Optional.empty();
        }

        User user = userRepository.findByEmail(email)
                .orElse(null);

        if (user == null) {
            return Optional.empty();
        }

        Token tokenEntity = Token.builder()
                .token(token)
                .tokenType(tokenType)
                .user(user)
                .expiryDate(expiryDate)
                .build();

        return Optional.of(tokenEntity);
    }

    @Override
    public void deleteToken(String token) {
        // Delete token with all possible prefixes
        redisTemplate.delete(VERIFICATION_PREFIX + token);
        redisTemplate.delete(PASSWORD_RESET_PREFIX + token);
        redisTemplate.delete(REFRESH_PREFIX + token);
    }

    @Override
    public String createTokenKey(String token, TokenType tokenType) {
        switch (tokenType) {
            case VERIFICATION:
                return VERIFICATION_PREFIX + token;
            case RESET:
                return PASSWORD_RESET_PREFIX + token;
            case REFRESH:
                return REFRESH_PREFIX + token;
            default:
                throw new IllegalArgumentException("Unsupported token type: " + tokenType);
        }
    }
}