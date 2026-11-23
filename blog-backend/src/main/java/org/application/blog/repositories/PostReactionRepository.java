package org.application.blog.repositories;

import org.application.blog.entity.PostReaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PostReactionRepository extends JpaRepository<PostReaction, Long> {

    Optional<PostReaction> findByPostIdAndUserId(Long postId, Long userId);

    @Query("SELECT r.type, COUNT(r) FROM PostReaction r WHERE r.post.id = :postId GROUP BY r.type")
    List<Object[]> countReactionsByPostId(@Param("postId") Long postId);

    void deleteByPostId(Long postId);

    List<PostReaction> findByPostIdOrderByUpdatedAtDesc(Long postId);
}