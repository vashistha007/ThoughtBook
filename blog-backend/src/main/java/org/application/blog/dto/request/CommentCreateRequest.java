package org.application.blog.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
public class CommentCreateRequest {

    @NotBlank(message = "Comment text khali nahi ho sakta")
    @Size(min = 1, max = 500, message = "Comment 1 se 500 characters ke beech hona chahiye")
    private String text;


}
