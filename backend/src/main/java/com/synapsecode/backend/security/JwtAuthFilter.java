package com.synapsecode.backend.security;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {
    private static final Logger authLogger = LoggerFactory.getLogger(JwtAuthFilter.class);

    private final JwtUtils jwtUtils;
    private final UserDetailsService userDetailsService;
    private final AuthEntryPointJwt authEntryPointJwt;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        try {
            final String requestURI = request.getRequestURI();
            authLogger.debug("Processing request: {}", request.getRequestURI());

            if (requestURI.startsWith("/api/v1/auth/") ||
                    requestURI.startsWith("/v3/api-docs/") ||
                    requestURI.startsWith("/swagger-ui/")) {
                authLogger.debug("Skipping JWT authentication for public path: {}", requestURI);
                filterChain.doFilter(request, response);
                return;
            }

            final String authHeader = request.getHeader("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                authLogger.debug("No auth header found, proceeding with filter chain");
                filterChain.doFilter(request, response);
                return;
            }

            String jwt = authHeader.substring(7);
            String userEmail = jwtUtils.extractUsername(jwt);

            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);
                if (jwtUtils.isTokenValid(jwt, userDetails)) {
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    authLogger.debug("Authentication successful for user: {}", userEmail);
                }
            }
            filterChain.doFilter(request, response);
        } catch (ExpiredJwtException e) {
            authLogger.error("JWT token is expired: {}", e.getMessage());
            authEntryPointJwt.commence(
                    request,
                    response,
                    new JwtAuthenticationException("JWT token is expired")
            );
        } catch (JwtException e) {
            authLogger.error("Invalid JWT token: {}", e.getMessage());
            authEntryPointJwt.commence(
                    request,
                    response,
                    new JwtAuthenticationException("Invalid JWT token")
            );
        } catch (Exception e) {
            authLogger.error("Authentication error: {}", e.getMessage());
            authEntryPointJwt.commence(
                    request,
                    response,
                    new JwtAuthenticationException("Authentication failed")
            );
        }
    }

    private static class JwtAuthenticationException extends AuthenticationException {
        public JwtAuthenticationException(String msg) {
            super(msg);
        }
    }
}