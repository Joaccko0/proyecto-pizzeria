package com.pizzeria.backend.dto.cashshift;

import java.math.BigDecimal;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

/**
 * DTO para cerrar una CashShift (cerrar caja)
 */
public record CloseCashShiftRequest(
    @NotNull(message = "El monto final es requerido")
    @PositiveOrZero(message = "El monto final debe ser mayor o igual a 0")
    BigDecimal endAmount
) {}
