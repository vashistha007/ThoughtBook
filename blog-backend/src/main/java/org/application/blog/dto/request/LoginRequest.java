package org.application.blog.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginRequest {

    @NotBlank(message = "Username ya Email zaroori hai")
    private String usernameOrEmail;

    @NotBlank(message = "Password zaroori hai")
    private String password;
}