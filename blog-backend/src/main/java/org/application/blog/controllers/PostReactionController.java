package org.application.blog.controllers;

import lombok.RequiredArgsConstructor;
import org.application.blog.dto.response.ReactionSummaryResponse;
import org.application.blog.entity.ReactionType;
import org.application.blog.services.PostReactionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/posts/{postId}/reactions")
@RequiredArgsConstructor
public class PostReactionController {

    private final PostReactionService reactionService;

    @GetMapping
    public ResponseEntity<ReactionSummaryResponse> getReactions(@PathVariable Long postId) {
        return ResponseEntity.ok(reactionService.getReactionSummary(postId));
    }

    @PostMapping
    public ResponseEntity<ReactionSummaryResponse> toggleReaction(
            @PathVariable Long postId,
            @RequestParam("type") ReactionType type
    ) {
        return ResponseEntity.ok(reactionService.toggleReaction(postId, type));
    }
}