package com.synapsecode.backend.service;


import com.synapsecode.backend.dto.*;
import com.synapsecode.backend.entity.TokenType;
import com.synapsecode.backend.entity.User;
import com.synapsecode.backend.events.RegistrationCompleteEvent;
import com.synapsecode.backend.exception.ResourceNotFoundException;
import com.synapsecode.backend.mapper.UserMapper;
import com.synapsecode.backend.repository.TokenRepository;
import com.synapsecode.backend.repository.UserRepository;
import com.synapsecode.backend.security.JwtUtils;
import io.jsonwebtoken.JwtException;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements AuthenticationService {

    private final UserRepository userRepository;
    private final TokenRepository tokenRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final ApplicationEventPublisher eventPublisher;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;
    private final RedisTemplate redisTemplate;
    private final TokenService tokenService;
    private final UserMapper userMapper;

//    @Override
//    @Transactional
//    public RegResponse register(RegisterRequest request) {
//        if (userRepository.existsByEmail(request.email())) {
//            throw new ResourceNotFoundException("User", "email", request.email());
//        }
//
//        User user = User.builder()
//                .email(request.email())
//                .password(passwordEncoder.encode(request.password()))
//                .enabled(false)
//                .build();
//
//        userRepository.save(user);
//        String verificationToken = tokenService.generateToken(user, TokenType.VERIFICATION, 24 * 60 * 60); // 24 hours
//        tokenService.saveToken(verificationToken, user, TokenType.VERIFICATION, 24 * 60 * 60);
//
//        eventPublisher.publishEvent(new RegistrationCompleteEvent(user, verificationToken));
//        return RegResponse.builder()
//                .status("Success")
//                .message("Registration Success")
//                .build();
//    }

    @Override
    @Transactional
    public RegResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new ResourceNotFoundException("User", "email", request.email());
        }

        User user = userMapper.toEntity(request);
        user.setPassword(passwordEncoder.encode(request.password()));

        userRepository.save(user);
        String verificationToken = tokenService.generateToken(user, TokenType.VERIFICATION, 24 * 60 * 60); // 24 hours
        tokenService.saveToken(verificationToken, user, TokenType.VERIFICATION, 24 * 60 * 60);

        UserDto userDto = userMapper.toDto(user);
        eventPublisher.publishEvent(new RegistrationCompleteEvent(userDto, verificationToken));
        return RegResponse.builder()
                .status("Success")
                .message("Registration Success")
                .build();
    }

    @Override
    public AuthResponse authenticate(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        User user = (User) authentication.getPrincipal();
        return generateAuthResponse(user);
    }

    @Override
    public AuthResponse refreshToken(String refreshToken) {
        String email = jwtUtils.extractUsername(refreshToken);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (jwtUtils.isTokenValid(refreshToken, user)) {
            String newAccessToken = jwtUtils.generateAccessToken(user);
            return new AuthResponse(
                    newAccessToken,
                    refreshToken,
                    jwtUtils.getAccessTokenExpirationMs(),
                    TokenType.ACCESS,
                    null,
                    null
            );
        }
        throw new JwtException("Invalid refresh token");
    }

    @Override
    @Transactional
    public void logout(String refreshToken) {
        tokenService.deleteToken(refreshToken);
    }

    private AuthResponse generateAuthResponse(User user) {
        String accessToken = jwtUtils.generateAccessToken(user);
        String refreshToken = jwtUtils.generateRefreshToken(user);

        // Save refresh token
        long refreshTokenExpirationSeconds = jwtUtils.getRefreshTokenExpirationMs() / 1000;
        tokenService.saveToken(refreshToken, user, TokenType.REFRESH, refreshTokenExpirationSeconds);

        return new AuthResponse(
                accessToken,
                refreshToken,
                jwtUtils.getAccessTokenExpirationMs(),
                TokenType.ACCESS,
                null,
                null
        );
    }
}