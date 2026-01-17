package com.pizzeria.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pizzeria.backend.model.User;

public interface UserRepository extends JpaRepository<User, Long> {

    // SQL generado: SELECT * FROM users WHERE email = ?
    Optional<User> findByEmail(String email);
    
}
