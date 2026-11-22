package org.application.blog.dto.response;

import lombok.*;
import java.time.LocalDateTime;

@Setter
@Getter
@Builder
public class CommentResponse {
    private Long id;
    private String text;
    private String authorName;
    private Long postId; // Client ko sirf parent post ki ID dikhayenge
    private LocalDateTime createdAt;

}
