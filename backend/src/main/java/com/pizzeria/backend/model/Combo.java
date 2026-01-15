package com.pizzeria.backend.model;

import java.math.BigDecimal;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder.Default;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "combos")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @SuperBuilder
public class Combo extends BaseEntity {

    private String name;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price; // Precio congelado del combo

    @Default
    private boolean active = true;

    @OneToMany(mappedBy = "combo", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ComboItem> comboItems;
}
