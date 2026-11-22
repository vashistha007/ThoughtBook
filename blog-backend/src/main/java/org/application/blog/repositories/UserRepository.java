package org.application.blog.repositories;

import org.application.blog.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    // Username se user find karna (Login flow ke liye)
    Optional<User> findByUsername(String username);

    // Email se user find karna
    Optional<User> findByEmail(String email);

    // Registration ke waqt duplicate check karne ke liye
    Boolean existsByUsername(String username);

    Boolean existsByEmail(String email);
}
