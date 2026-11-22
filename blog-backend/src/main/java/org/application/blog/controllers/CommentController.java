package org.application.blog.controllers;

import jakarta.validation.Valid;
import org.application.blog.dto.request.CommentCreateRequest;
import org.application.blog.dto.response.CommentResponse;
import org.application.blog.services.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/posts/{postId}/comments")
public class CommentController {


    @Autowired
    CommentService commentService;

    // 1. POST /api/posts/{postId}/comments
    @PostMapping
    public ResponseEntity<CommentResponse> addComment(@PathVariable Long postId,
            @Valid @RequestBody CommentCreateRequest request) {
        return new ResponseEntity<>(commentService.addComment(postId, request), HttpStatus.CREATED);
    }

    // 2. GET /api/posts/{postId}/comments?page=0&size=5
    @GetMapping
    public ResponseEntity<List<CommentResponse>> getComments(
            @PathVariable Long postId,
            @RequestParam(defaultValue = "0", required = false) int page,
            @RequestParam(defaultValue = "10", required = false) int size
    ) {
        return ResponseEntity.ok(commentService.getCommentsByPostId(postId, page, size));
    }

    // 4. UPDATE /api/posts/{postId}/comments/{commentId}
    @PutMapping("/{commentId}")
    public ResponseEntity<CommentResponse> updateComment(
            @PathVariable Long postId,
            @PathVariable Long commentId,
            @Valid @RequestBody CommentCreateRequest request) {
        return ResponseEntity.ok(commentService.updateComment(postId, commentId, request));
    }

    // 4. DELETE /api/posts/{postId}/comments/{commentId}
    @DeleteMapping("/{commentId}")
    public ResponseEntity<String> deleteComment(
            @PathVariable Long postId,
            @PathVariable Long commentId
    ) {
        commentService.deleteComment(postId, commentId);
        return ResponseEntity.ok("Comment successfully delete ho gaya.");
    }

}
