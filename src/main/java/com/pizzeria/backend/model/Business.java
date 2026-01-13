package com.pizzeria.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "businesses")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Business {
    // NO extiende BaseEntity porque Business no pertenece a otro Business

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
}
