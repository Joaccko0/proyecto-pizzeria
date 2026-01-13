// src/main/java/com/pizzeria/backend/model/BaseEntity.java
package com.pizzeria.backend.model;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@MappedSuperclass
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public abstract class BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Columna discriminadora para Multi-tenant
    @Column(name = "business_id", nullable = false)
    private Long businessId; 

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;                                                                

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}