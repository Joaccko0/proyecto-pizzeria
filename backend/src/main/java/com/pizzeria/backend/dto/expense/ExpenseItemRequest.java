package com.pizzeria.backend.dto.expense;

import java.math.BigDecimal;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

/**
 * DTO para línea de gasto dentro de un ExpenseRequest
 * Representa cada ítem que compone un gasto/factura.
 */
public record ExpenseItemRequest(

    @NotNull(message = "El ID del insumo es obligatorio")
    Long supplyId,

    @NotNull(message = "La cantidad es obligatoria")
    @Positive(message = "La cantidad debe ser mayor a cero")
    Integer quantity,

    @NotNull(message = "El precio unitario es obligatorio")
    @Positive(message = "El precio unitario debe ser mayor a cero")
    BigDecimal unitPrice
) {}
