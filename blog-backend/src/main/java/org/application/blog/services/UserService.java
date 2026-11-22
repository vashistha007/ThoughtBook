package org.application.blog.services;

import lombok.RequiredArgsConstructor;
import org.application.blog.dto.response.PostPageResponse;
import org.application.blog.dto.response.UserProfileResponse;
import org.application.blog.entity.User;
import org.application.blog.repositories.PostRepository;
import org.application.blog.repositories.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final PostService postService;

    public UserProfileResponse getCurrentUserProfile() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User nahi mila: " + username));

        long postCount = postRepository.countByAuthorId(user.getId());

        return UserProfileResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .roles(user.getRoles())
                .totalPosts(postCount)
                .createdAt(user.getCreatedAt())
                .build();
    }

    public PostPageResponse getCurrentUserPosts(int pageNumber, int pageSize, String sortBy, String direction) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return postService.getPostByAuthor(username, pageNumber, pageSize, sortBy, direction);
    }
}