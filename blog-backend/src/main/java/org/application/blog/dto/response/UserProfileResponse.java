package org.application.blog.dto.response;

import lombok.*;
import org.application.blog.entity.Role;

import java.time.LocalDateTime;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfileResponse {
    private Long id;
    private String username;
    private String email;
    private Set<Role> roles;
    private long totalPosts;
    private LocalDateTime createdAt;
}