package com.pizzeria.backend.dto.expense;

import java.time.LocalDate;
import java.util.List;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

/**
 * DTO para crear/editar un Gasto (Expense)
 * 
 * Nota: El total se calcula en el servicio a partir de los items,
 * por lo que no se envía en el request. El Front debe confiar en
 * el cálculo del Back (como validación final).
 */
public record ExpenseRequest(

    Long supplierId, // Opcional: puede ser null para gastos sin proveedor externo (ej: Sueldos)

    @NotNull(message = "La fecha del gasto es obligatoria")
    LocalDate date,

    @NotEmpty(message = "El gasto debe incluir al menos un ítem")
    List<ExpenseItemRequest> items // Detalles de línea del gasto
) {}
