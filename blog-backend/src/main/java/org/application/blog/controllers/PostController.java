package org.application.blog.controllers;

import jakarta.validation.Valid;
import org.application.blog.dto.request.PostCreateRequest;
import org.application.blog.dto.response.PostPageResponse;
import org.application.blog.dto.response.PostResponse;
import org.application.blog.entity.Post;
import org.application.blog.services.PostService;
//import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Sort;

import java.util.List;

@RestController
@RequestMapping("api/posts")
public class PostController {

    @Autowired
    private PostService postService;

    @PostMapping
    public  ResponseEntity<PostResponse> createPost(@Valid  @RequestBody PostCreateRequest request) {
      PostResponse savePost =   postService.createPost(request);
        return new ResponseEntity<PostResponse>(savePost, HttpStatus.CREATED);
    }


//    1. Get all posts
    @GetMapping
    public ResponseEntity<PostPageResponse> getAllPosts(
            @RequestParam(value = "page", defaultValue = "0", required = false) int page,
            @RequestParam(value = "size", defaultValue = "5", required = false) int size,
            @RequestParam(value = "sortBy", defaultValue = "createdAt", required = false) String sortBy,
            @RequestParam(value = "sortDir", defaultValue = "desc", required = false) String sortDir

    ){
        PostPageResponse Posts = postService.getAllPostPaged(page,size, sortBy,sortDir);

        return ResponseEntity.ok(Posts);
    }

    // 2. Keyword Search: GET /api/posts/search?keyword=boot&page=0&size=5
    @GetMapping("/search")
    public ResponseEntity<PostPageResponse> searchPosts(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0", required = false) int page,
            @RequestParam(defaultValue = "5", required = false) int size,
            @RequestParam(defaultValue = "createdAt", required = false) String sortBy,
            @RequestParam(defaultValue = "desc", required = false) String sortDir
    ) {
        return ResponseEntity.ok(postService.searchPostByTitle(keyword, page, size, sortBy, sortDir));
    }

    // 3. Author Filter: GET /api/posts/author/{authorName}?page=0&size=5
    @GetMapping("/author/{authorName}")
    public ResponseEntity<PostPageResponse> getPostsByAuthor(
            @PathVariable String authorName,
            @RequestParam(defaultValue = "0", required = false) int page,
            @RequestParam(defaultValue = "5", required = false) int size,
            @RequestParam(defaultValue = "createdAt", required = false) String sortBy,
            @RequestParam(defaultValue = "desc", required = false) String sortDir
    ) {
        return ResponseEntity.ok(postService.getPostByAuthor(authorName, page, size, sortBy, sortDir));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PostResponse> getPostById(@PathVariable Long id) {

        PostResponse postById = postService.fetchPostById(id);
        return ResponseEntity.ok(postById);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PostResponse> updatePost(@PathVariable Long id, @Valid  @RequestBody PostCreateRequest request) {

           PostResponse updatedPost = postService.updatePost(id, request);
           return ResponseEntity.ok(updatedPost);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePost(@PathVariable Long id) {
        postService.deletePost(id);
        return ResponseEntity.ok("Post Deleted Successfully");
    }



    @GetMapping("/category/{categoryId}")
    public ResponseEntity<PostPageResponse> getPostsByCategory(
            @PathVariable Long categoryId,
            @RequestParam(defaultValue = "0") int pageNumber,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {
        return ResponseEntity.ok(postService.getPostsByCategory(categoryId, pageNumber, pageSize, sortBy, direction));
    }





}
