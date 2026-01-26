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

/**
 * Entidad Supply (Insumo / Partida de Gasto)
 * Representa los conceptos de gasto o insumo que se pueden registrar en expensas.
 * 
 * Ejemplos:
 *  - STOCK: "Harina", "Queso", "Tomate" (insumos de producción)
 *  - SERVICE: "Internet", "Gas", "Teléfono" (servicios)
 *  - FIXED_COST: "Alquiler", "Seguros" (gastos fijos)
 * 
 * Multi-tenant: cada insumo pertenece a un negocio específico (via businessId en BaseEntity)
 */
@Entity
@Table(name = "supplies")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @SuperBuilder
public class Supply extends BaseEntity {

    /** Nombre del insumo/partida de gasto (ej: "Harina", "Internet", "Alquiler") */
    @Column(nullable = false)
    private String name;

    /** Categoría del insumo para clasificación contable y de inventario */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SupplyCategory category;
}
