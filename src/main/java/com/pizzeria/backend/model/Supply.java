package com.pizzeria.backend.model;

import com.pizzeria.backend.model.enums.SupplyCategory;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "supplies")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @SuperBuilder
public class Supply extends BaseEntity {

    private String name; // "Harina" o "Internet"

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SupplyCategory category;
}
