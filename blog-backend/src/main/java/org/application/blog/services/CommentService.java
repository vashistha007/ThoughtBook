package org.application.blog.services;

import org.application.blog.dto.request.CommentCreateRequest;
import org.application.blog.dto.response.CommentResponse;
import org.application.blog.entity.Comment;
import org.application.blog.entity.Post;
import org.application.blog.entity.Role;
import org.application.blog.entity.User;
import org.application.blog.exceptions.ResourceNotFoundException;
import org.application.blog.repositories.CommentRepository;
import org.application.blog.repositories.PostRepository;
import org.application.blog.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;
    @Autowired
    private PostRepository postRepository;
    @Autowired
    private UserRepository userRepository;

    // 1. Add Comment to a Post
    @Transactional
    public CommentResponse addComment(Long postId, CommentCreateRequest request) {
        // Step A: Post dhoondho (nahi mila toh 404 throw hoga)
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post", "id", postId));


        User currentUser = getCurrentAuthenticatedUser();
        // Step B: Comment build karo aur parent post assign karo
        Comment comment = Comment.builder()
                .text(request.getText())
                .author(currentUser)
                .post(post)
                .build();

        // Step C: Save in DB
        Comment savedComment = commentRepository.save(comment);

        return mapToResponse(savedComment);
    }


    // 2. Get All Comments of a Post (Paged & Sorted by newest first)
    @Transactional(readOnly = true)
    public List<CommentResponse> getCommentsByPostId(Long postId, int page, int size) {
        if (!postRepository.existsById(postId)) {
            throw new ResourceNotFoundException("Post", "id", postId);
        }

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Comment> commentPage = commentRepository.findByPostId(postId, pageable);

        return commentPage.getContent()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    // 3. Update Comment (Only Author or Admin)
    public CommentResponse updateComment(Long postId, Long commentId, CommentCreateRequest request) {
        Comment comment = validatePostAndComment(postId, commentId);
        checkOwnershipOrAdmin(comment, "Aap sirf apna hi comment edit kar sakte hain!");

        comment.setText(request.getText());
        Comment updatedComment = commentRepository.save(comment);
        return mapToResponse(updatedComment);
    }

    // 4. Delete a Comment
    @Transactional
    public void deleteComment(Long postId, Long commentId) {
        if (!postRepository.existsById(postId)) {
            throw new ResourceNotFoundException("Post", "id", postId);
        }

        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment ID not found: " + commentId));
           //        isko baad mein dekhna  h ki kese exception ko handle krna h

        // Check ki comment usi post ka hai ya nahi
        if (!comment.getPost().getId().equals(postId)) {
            throw new RuntimeException("This comment does not belong to this post");
        }

        commentRepository.delete(comment);
    }

// --- Helper Methods ---

    private Comment validatePostAndComment(Long postId, Long commentId) {
        if (!postRepository.existsById(postId)) {
            throw new ResourceNotFoundException("Post", "id", postId);
        }

        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Post", "id", commentId));

        if (!comment.getPost().getId().equals(postId)) {
            throw new IllegalArgumentException("Ye comment is post se belong nahi karta!");
        }

        return comment;
    }

    private void checkOwnershipOrAdmin(Comment comment, String errorMessage) {
        User currentUser = getCurrentAuthenticatedUser();
        boolean isAuthor = comment.getAuthor().getId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getRoles().contains(Role.ROLE_ADMIN);

        if (!isAuthor && !isAdmin) {
            throw new AccessDeniedException(errorMessage);
        }
    }



    private User getCurrentAuthenticatedUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Logged-in user nahi mila: " + username));
    }

    private CommentResponse mapToResponse(Comment comment) {
        return CommentResponse.builder()
                .id(comment.getId())
                .text(comment.getText())
                .authorName(comment.getAuthor().getUsername())
                .postId(comment.getPost().getId())
                .createdAt(comment.getCreatedAt())
                .build();
    }



}
