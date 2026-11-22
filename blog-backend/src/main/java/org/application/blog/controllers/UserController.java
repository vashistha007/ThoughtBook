package org.application.blog.controllers;

import lombok.RequiredArgsConstructor;
import org.application.blog.dto.response.PostPageResponse;
import org.application.blog.dto.response.UserProfileResponse;
import org.application.blog.services.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> getMyProfile() {
        return ResponseEntity.ok(userService.getCurrentUserProfile());
    }

    @GetMapping("/me/posts")
    public ResponseEntity<PostPageResponse> getMyPosts(
            @RequestParam(defaultValue = "0") int pageNumber,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {
        return ResponseEntity.ok(userService.getCurrentUserPosts(pageNumber, pageSize, sortBy, direction));
    }
}