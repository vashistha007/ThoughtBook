package org.application.blog.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PostCreateRequest {

    @NotBlank(message = "title can't be empty")
    @Size(min = 5, max = 150, message = "min length 5 , max length 150")
    private String title;

    @NotBlank(message = "content can't be empty")
    @Size(min = 5,max = 50000, message = "min length 5")
    private String content;

//    private String authorName;

    private Long categoryId;
}
