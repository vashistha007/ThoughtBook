# ThoughtBook — RESTful Blogging Platform API

A production-grade, secure, and scalable backend REST API for a multi-user blogging platform built with **Java 21**, **Spring Boot**, **Spring Security (JWT)**, **Spring Data JPA**, and **PostgreSQL**.

Designed following clean layered architecture principles with strict DTO isolation, role-based access control (RBAC), ownership-level authorization, custom pagination, and interactive OpenAPI/Swagger documentation.

---

## Tech Stack

- **Language:** Java 21
- **Framework:** Spring Boot 4.1.1 (Spring Web, Spring Data JPA, Spring Security, Bean Validation)
- **Database:** PostgreSQL
- **Authentication & Authorization:** Stateless JWT (`jjwt 0.13.0`), BCrypt Password Hashing, Role-Based Access Control (`ROLE_USER`, `ROLE_ADMIN`)
- **API Documentation:** Swagger UI / OpenAPI 3 (`springdoc-openapi 3.0.2`)
- **Build Tool:** Maven

---

## Key Engineering Highlights

- **Stateless JWT Security & RBAC:** Custom `JwtAuthenticationFilter` validating Bearer tokens on every request, paired with method-level security (`@PreAuthorize("hasRole('ADMIN')")`) for administrative operations.
- **Ownership-Based Access Control:** Enforces resource-level authorization ensuring only the post/comment author or an administrator (`isAuthor || isAdmin`) can modify or delete content.
- **Strict DTO Isolation:** Complete decoupling of JPA entities from API contracts using dedicated Request/Response DTOs—eliminating Jackson bidirectional infinite recursion and preventing sensitive fields (like password hashes) from leaking.
- **Custom Pagination, Sorting & Filtering:** Standardized `PostPageResponse` wrapper supporting dynamic sorting, keyword search, category filtering, and author-based queries.
- **Centralized Exception Handling:** Global `@RestControllerAdvice` mapping `ResourceNotFoundException`, `AccessDeniedException`, `IllegalArgumentException`, and Jakarta Validation errors to consistent HTTP status codes (`404`, `403`, `400`).

---

## Project Architecture

```text
src/main/java/org/application/blog
├── config          # SecurityConfig, OpenApiConfig, PasswordEncoder
├── controllers     # AuthController, PostController, CategoryController, CommentController, UserController
├── dto
│   ├── request     # LoginRequest, RegisterRequest, PostCreateRequest, CategoryRequest, CommentRequest
│   └── response    # AuthResponse, PostResponse, PostPageResponse, CategoryResponse, CommentResponse, UserProfileResponse
├── entity          # User, Post, Category, Comment, Role
├── exceptions      # ResourceNotFoundException, GlobalExceptionHandler
├── repositories    # UserRepository, PostRepository, CategoryRepository, CommentRepository
├── security        # JwtTokenProvider, JwtAuthenticationFilter, CustomUserDetailsService
└── services        # AuthService, PostService, CategoryService, CommentService, UserService