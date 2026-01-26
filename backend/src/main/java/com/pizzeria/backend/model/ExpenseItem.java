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
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Entidad ExpenseItem (Línea de Gasto / Detalle de Expensa)
 * Representa cada línea/item que compone un gasto/factura.
 * 
 * Ejemplo:
 *  - Expense: "Factura del 2026-01-15 de Distribuidor X"
 *    - ExpenseItem 1: 50 kg de Harina a $10/kg = $500
 *    - ExpenseItem 2: 10 kg de Queso a $50/kg = $500
 *    - Total Expense: $1000
 * 
 * Nota: ExpenseItem NO hereda de BaseEntity porque es una tabla subordinada sin multi-tenant directo.
 * El multi-tenant se controla via la relación con Expense.
 */
@Entity
@Table(name = "expense_items")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ExpenseItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Referencia al gasto padre */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "expense_id", nullable = false)
    private Expense expense;

    /** Referencia al insumo/partida de gasto */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "supply_id", nullable = false)
    private Supply supply;

    /** Cantidad comprada/consumida (puede ser kg, unidades, horas, etc.) */
    @Column(nullable = false)
    private Integer quantity;

    /** Precio unitario del insumo */
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal unitPrice;

    /** Subtotal: quantity * unitPrice (se calcula en el servicio) */
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal subtotal;
}
