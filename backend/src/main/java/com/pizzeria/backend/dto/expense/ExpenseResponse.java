package com.pizzeria.backend.dto.expense;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * DTO para leer/responder datos de un Gasto (Expense)
 * Lo que el Back devuelve al Front cuando consulta un gasto.
 * 
 * Incluye el total calculado y los detalles de ítems.
 */
public record ExpenseResponse(
    Long id,
    Long supplierId,
    String supplierName,      // Nombre del proveedor (si existe)
    LocalDate date,
    BigDecimal total,         // Total calculado del gasto
    List<ExpenseItemResponse> items
) {}
