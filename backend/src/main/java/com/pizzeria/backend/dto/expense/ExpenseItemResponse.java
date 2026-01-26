package com.pizzeria.backend.dto.expense;

import java.math.BigDecimal;

/**
 * DTO para responder datos de una línea de gasto (ExpenseItem)
 * Incluye información del insumo y los cálculos de cantidad/precio/subtotal.
 */
public record ExpenseItemResponse(
    Long id,
    Long supplyId,
    String supplyName,      // Nombre del insumo para display en el Front
    Integer quantity,
    BigDecimal unitPrice,
    BigDecimal subtotal     // quantity * unitPrice (calculado en el Backend)
) {}
