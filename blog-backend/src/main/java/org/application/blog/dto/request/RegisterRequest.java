package org.application.blog.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {

    @NotBlank(message = "Username zaroori hai")
    @Size(min = 3, max = 30, message = "Username 3 se 30 characters ka hona chahiye")
    private String username;

    @NotBlank(message = "Email zaroori hai")
    @Email(message = "Sahi email format daalein")
    private String email;

    @NotBlank(message = "Password zaroori hai")
    @Size(min = 6, message = "Password kam se kam 6 characters ka hona chahiye")
    private String password;
}