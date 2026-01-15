package com.pizzeria.backend.model;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "order_items")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    // OPCIÓN A: Producto individual
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    // OPCIÓN B: Combo
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "combo_id")
    private Combo combo;

    private Integer quantity;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal unitPrice; // Precio histórico

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal subtotal;

    // VALIDACIÓN: Asegura que sea Producto O Combo, pero no ambos.
    @PrePersist
    @PreUpdate
    private void validate() {
        if (product == null && combo == null) {
            throw new IllegalStateException("OrderItem must have a Product OR a Combo.");
        }
        if (product != null && combo != null) {
            throw new IllegalStateException("OrderItem cannot have both Product AND Combo.");
        }
    }
}
