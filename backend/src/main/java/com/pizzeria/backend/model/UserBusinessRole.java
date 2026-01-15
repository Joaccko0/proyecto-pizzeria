package com.pizzeria.backend.model;

import com.pizzeria.backend.model.enums.Role;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "user_business_roles")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class UserBusinessRole {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Guardamos ID para facilitar consultas
    @Column(name = "business_id", nullable = false)
    private Long businessId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;
}
