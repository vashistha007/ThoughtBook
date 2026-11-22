package org.application.blog.services;

import org.application.blog.dto.request.LoginRequest;
import org.application.blog.dto.request.RegisterRequest;
import org.application.blog.dto.response.JwtAuthResponse;
import org.application.blog.entity.Role;
import org.application.blog.entity.User;
import org.application.blog.repositories.UserRepository;
import org.application.blog.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtTokenProvider jwtTokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    // 1. User Registration
    public String register(RegisterRequest request) {
        // Check duplicate username
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username pehle se liya ja chuka hai!");
        }

        // Check duplicate email
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email pehle se registered hai!");
        }

        // Naya User object banao aur password BCrypt se hash karo
        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .roles(Set.of(Role.ROLE_USER)) // By default har naya user ROLE_USER hoga
                .build();

        userRepository.save(user);
        return "User successfully register ho gaya hai!";
    }

    // 2. User Login & JWT Generation
    public JwtAuthResponse login(LoginRequest request) {
        // AuthenticationManager internally CustomUserDetailsService aur PasswordEncoder use karke verify karega
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsernameOrEmail(),
                        request.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Verified user ke liye JWT generate karo
        String token = jwtTokenProvider.generateToken(authentication);

        return JwtAuthResponse.builder()
                .accessToken(token)
                .tokenType("Bearer")
                .build();
    }
}