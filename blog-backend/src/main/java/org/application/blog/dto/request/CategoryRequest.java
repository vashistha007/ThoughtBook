package org.application.blog.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CategoryRequest {

    @NotBlank(message = "Category ka naam zaroori hai")
    @Size(min = 2, max = 50, message = "Category naam 2 se 50 characters ke beech hona chahiye")
    private String name;

    @Size(max = 250, message = "Description 250 characters se zyada nahi ho sakta")
    private String description;
}