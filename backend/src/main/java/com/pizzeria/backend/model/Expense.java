package com.pizzeria.backend.model;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

/**
 * Entidad Expense (Gasto/Expensa)
 * Representa un registro de gasto que puede incluir uno o más insumos/partidas.
 * 
 * Ejemplo:
 *  - Factura del proveedor "Distribuidor X" con fecha 2026-01-15
 *    contiene varios ExpenseItem: Harina (50kg @ $X), Queso (10kg @ $Y), etc.
 *  - Recibo de Sueldos sin proveedor externo (supplier_id es null)
 * 
 * Multi-tenant: cada gasto pertenece a un negocio específico (via businessId en BaseEntity)
 */
@Entity
@Table(name = "expenses")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @SuperBuilder
public class Expense extends BaseEntity {

    /**
     * Referencia al Proveedor (Nullable)
     * Nullable porque algunos gastos no tienen proveedor externo:
     *  - Sueldos/Salarios: no tienen proveedor sino que son internos
     *  - Gastos administrativos diversos
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "supplier_id", nullable = true)
    private Supplier supplier;

    /** Fecha del gasto/factura */
    @Column(nullable = false)
    private LocalDate date;

    /** Total del gasto (suma de todos los ExpenseItem.subtotal) */
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal total;

    /**
     * Detalles de línea del gasto (items)
     * CascadeType.ALL: si borro un Expense, se borran todos sus ExpenseItem
     * orphanRemoval: si quito un item de la lista, se borra de la BD
     */
    @OneToMany(mappedBy = "expense", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<ExpenseItem> items;
}
