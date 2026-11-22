package org.application.blog.services;

import jakarta.validation.Valid;
import org.application.blog.dto.request.PostCreateRequest;
import org.application.blog.dto.response.PostPageResponse;
import org.application.blog.dto.response.PostResponse;
import org.application.blog.entity.Category;
import org.application.blog.entity.Post;
//import org.application.blog.exceptions.PostNotFoundException;
import org.application.blog.entity.Role;
import org.application.blog.entity.User;
import org.application.blog.exceptions.ResourceNotFoundException;
import org.application.blog.repositories.CategoryRepository;
import org.application.blog.repositories.PostRepository;
//import org.bson.types.ObjectId;
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
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private CategoryRepository categoryRepository;



    public PostResponse createPost(PostCreateRequest request) {
        User currentUser = getCurrentAuthenticatedUser();

        Category category = null;
        if (request.getCategoryId() != null) {
            category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category", "id", request.getCategoryId()));
        }

        Post post = Post.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .author(currentUser)
                .category(category)
                .build();
              postRepository.save(post);

              return  mapToResponse(post);
    }

    public List<PostResponse> fetchAllPosts() {
//            return Post(Entity) object but after it convert into DTO and then return
        return postRepository.findAll().stream()
                .map(this::mapToResponse)
                .toList();
    }

    public PostResponse fetchPostById(Long id) {
        Post post =  postRepository.findById(id)
                .orElseThrow(()->  new ResourceNotFoundException("Post", "id",  id));

        return mapToResponse(post);
    }

    public PostResponse updatePost(Long id, PostCreateRequest request) {
        Post existingPost = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post", "id", id));

        User currentUser = getCurrentAuthenticatedUser();
        boolean isAuthor = existingPost.getAuthor().getId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getRoles().contains(Role.ROLE_ADMIN);

        if (!isAuthor && !isAdmin) {
            throw new AccessDeniedException("Aap sirf apna hi post update kar sakte hain!");
        }

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category", "id", request.getCategoryId()));
            existingPost.setCategory(category);
        }

        existingPost.setTitle(request.getTitle());
        existingPost.setContent(request.getContent());

        Post updatedPost = postRepository.save(existingPost);
        return mapToResponse(updatedPost);
    }

    public void deletePost(Long id) {
        Post existingPost = postRepository.findById(id)
                .orElseThrow(()-> new ResourceNotFoundException("Post", "id", id));

           User currentUser = getCurrentAuthenticatedUser();

//         17/11/2026
        // Check: Kya current user is post ka author hai YA phir ROLE_ADMIN hai?
        boolean isAuthor = existingPost.getAuthor().getId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getRoles().contains(Role.ROLE_ADMIN);

        if (!isAuthor && !isAdmin) {
            throw new AccessDeniedException("Aap sirf apna hi post delete kar sakte hain!");
        }
        postRepository.delete(existingPost);
    }


    public PostPageResponse getPostsByCategory(Long categoryId, int pageNumber, int pageSize, String sortBy, String direction) {
        if (!categoryRepository.existsById(categoryId)) {
            throw new ResourceNotFoundException("Category", "id", categoryId);
        }
        Pageable pageable = createPageable(pageNumber, pageSize, sortBy, direction);
        Page<Post> pagePost = postRepository.findByCategoryId(categoryId, pageable);
        return buildPostPageResponse(pagePost);
    }



//    public PostPageResponse getAllPostPaged(int pageNumber, int pageSize, String sortBy, String sortDirection) {
//
//        Sort sort = sortDirection.equalsIgnoreCase("desc")?
//        Sort.by(sortBy).descending()
//        : Sort.by(sortBy).ascending();
//
//        Pageable pageable = PageRequest.of(pageNumber, pageSize, sort);
//
//        Page<Post> pagePost = postRepository.findAll(pageable);
//
//        List<PostResponse> postResponses = pagePost.getContent().stream().map(this::mapToResponse).toList();
//
//        return PostPageResponse.builder()
//                .content(postResponses)
//                .pageNumber(pagePost.getNumber())
//                .pageSize(pagePost.getSize())
//                .totalElements(pagePost.getTotalElements())
//                .totalPages(pagePost.getTotalPages())
//                .last(pagePost.isLast())
//                .build();
//
//    }


//    ---------------------------------------------------------------------------------------------
//     upper wale code ko modify kar rhe  taki ye hum title and author ke naam se search kr sake
//     to abhi hum ek  help code bnayenge jo bas database se wale data ko postpageresponse m
//     convert krta , DTO of PostPageResponse.
//    ---------------------------------------------------------------------------------------------

// 1. All Posts with Pagination & Sorting
    public PostPageResponse getAllPostPaged(int pageNumber, int pageSize, String sortBy, String  Direction){

        Pageable pageable = createPageable(pageNumber, pageSize, sortBy, Direction);
        Page<Post> pagePost = postRepository.findAll(pageable);
        return buildPostPageResponse(pagePost);

    }

//    2. Dedicated Keyword Search
    public PostPageResponse searchPostByTitle(String keyword, int pageNumber, int pageSize, String sortBy, String  Direction){
        Pageable pageable = createPageable(pageNumber, pageSize, sortBy, Direction);
        Page<Post> pagePost = postRepository.findByTitleContainingIgnoreCase(keyword, pageable);
        return buildPostPageResponse(pagePost);
    }

//    3.Dedicated Author Filter
     public PostPageResponse getPostByAuthor(String authorName, int pageNumber, int pageSize, String sortBy, String  Direction){
        Pageable pageable = createPageable(pageNumber, pageSize, sortBy, Direction);
        Page<Post> pagePost = postRepository.findByAuthorUsername(authorName, pageable);
        return buildPostPageResponse(pagePost);
     }


    private Pageable createPageable(int pageNumber, int pageSize, String sortBy, String sortDirection) {
        Sort sort = sortDirection.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        return PageRequest.of(pageNumber, pageSize, sort);
    }


    // 1. Helper Method: Current logged-in User ko DB se nikalne ke liye
    private User getCurrentAuthenticatedUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Logged-in user nahi mila: " + username));
    }

//    Help to convert post object to postPageResponse
    private PostPageResponse buildPostPageResponse(Page<Post> pagePost) {

        List<PostResponse> postResponses = pagePost.getContent()
                .stream()
                .map(this::mapToResponse).toList();

        return PostPageResponse.builder()
                .content(postResponses)
                .pageNumber(pagePost.getNumber())
                .pageSize(pagePost.getSize())
                .totalElements(pagePost.getTotalElements())
                .totalPages(pagePost.getTotalPages())
                .last(pagePost.isLast())
                .build();
    }


    //    convert Post(entity) to DTO
    public PostResponse mapToResponse(Post post) {

        return PostResponse.builder()
                .id(post.getId())
                .title(post.getTitle())
                .content(post.getContent())
//                .authorName(post.getAuthorName())
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .authorUsername(post.getAuthor().getUsername())
                .categoryId(post.getCategory() != null ? post.getCategory().getId() : null)
                .categoryName(post.getCategory() != null ? post.getCategory().getName() : "Uncategorized")
                .build();

    }
}
