package org.application.blog.controllers;

import jakarta.validation.Valid;
import org.application.blog.dto.request.LoginRequest;
import org.application.blog.dto.request.RegisterRequest;
import org.application.blog.dto.response.JwtAuthResponse;
import org.application.blog.services.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // 1. Register Endpoint: POST /api/auth/register
    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody RegisterRequest request) {
        String response = authService.register(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // 2. Login Endpoint: POST /api/auth/login
    @PostMapping("/login")
    public ResponseEntity<JwtAuthResponse> login(@Valid @RequestBody LoginRequest request) {
        JwtAuthResponse jwtAuthResponse = authService.login(request);
        return ResponseEntity.ok(jwtAuthResponse);
    }
}