package org.application.blog.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.application.blog.entity.ReactionType;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReactionSummaryResponse {
    private Long postId;
    private Map<ReactionType, Long> counts;
    private long totalCount;
    private ReactionType userReaction;
    private List<ReactedUser> users; // Kisne kya react kiya

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ReactedUser {
        private String username;
        private ReactionType type;
    }
}