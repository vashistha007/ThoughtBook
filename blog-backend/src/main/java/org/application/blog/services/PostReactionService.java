package org.application.blog.services;

import lombok.RequiredArgsConstructor;
import org.application.blog.dto.response.ReactionSummaryResponse;
import org.application.blog.entity.Post;
import org.application.blog.entity.PostReaction;
import org.application.blog.entity.ReactionType;
import org.application.blog.entity.User;
import org.application.blog.exceptions.ResourceNotFoundException;
import org.application.blog.repositories.PostReactionRepository;
import org.application.blog.repositories.PostRepository;
import org.application.blog.repositories.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PostReactionService {

    private final PostReactionRepository reactionRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    @Transactional
    public ReactionSummaryResponse toggleReaction(Long postId, ReactionType type) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post", "id", postId));
        User currentUser = getCurrentUser();

        Optional<PostReaction> existingOpt = reactionRepository.findByPostIdAndUserId(postId, currentUser.getId());

        if (existingOpt.isPresent()) {
            PostReaction existing = existingOpt.get();
            if (existing.getType() == type) {
                // Same reaction clicked again -> remove reaction
                reactionRepository.delete(existing);
            } else {
                // Different reaction clicked -> switch emotion
                existing.setType(type);
                reactionRepository.save(existing);
            }
        } else {
            PostReaction reaction = PostReaction.builder()
                    .post(post)
                    .user(currentUser)
                    .type(type)
                    .build();
            reactionRepository.save(reaction);
        }

        return getReactionSummary(postId);
    }

    @Transactional(readOnly = true)
    public ReactionSummaryResponse getReactionSummary(Long postId) {
        if (!postRepository.existsById(postId)) {
            throw new ResourceNotFoundException("Post", "id", postId);
        }

        Map<ReactionType, Long> counts = new EnumMap<>(ReactionType.class);
        for (ReactionType rType : ReactionType.values()) {
            counts.put(rType, 0L);
        }

        List<PostReaction> allReactions = reactionRepository.findByPostIdOrderByUpdatedAtDesc(postId);
        long total = allReactions.size();

        for (PostReaction r : allReactions) {
            counts.put(r.getType(), counts.get(r.getType()) + 1);
        }

        List<ReactionSummaryResponse.ReactedUser> reactedUsers = allReactions.stream()
                .map(r -> ReactionSummaryResponse.ReactedUser.builder()
                        .username(r.getUser().getUsername())
                        .type(r.getType())
                        .build())
                .toList();

        ReactionType userReaction = null;
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        if (username != null && !username.equals("anonymousUser")) {
            userReaction = allReactions.stream()
                    .filter(r -> r.getUser().getUsername().equals(username))
                    .map(PostReaction::getType)
                    .findFirst()
                    .orElse(null);
        }

        return ReactionSummaryResponse.builder()
                .postId(postId)
                .counts(counts)
                .totalCount(total)
                .userReaction(userReaction)
                .users(reactedUsers)
                .build();
    }

    private User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }
}