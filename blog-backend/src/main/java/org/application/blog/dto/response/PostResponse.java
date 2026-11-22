package org.application.blog.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
//import org.bson.types.ObjectId;
import java.time.LocalDateTime;


@Getter
@Builder
public class PostResponse {

    private Long id;
    private String title;
    private String content;
//    private String authorName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private String authorUsername;

    private Long categoryId;
    private String categoryName;
}
