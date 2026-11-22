package org.application.blog.dto.response;
import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder // agr mujhe is class ka    use krke kuch build krna h to ye (builder) use krte h
public class PostPageResponse {
    private List<PostResponse> content; // Current page ke posts
    private int pageNumber;             // Current page number (0-indexed)
    private int pageSize;               // Ek page me kitne items
    private long totalElements;         // Database me total kitne posts hain
    private int totalPages;             // Total kitne pages banenge
    private boolean last;               // Kya ye last page hai?
}
