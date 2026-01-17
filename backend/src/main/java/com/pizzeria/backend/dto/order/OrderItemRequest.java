package com.pizzeria.backend.dto.order;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

@OrderItemXor
public record OrderItemRequest(
    Long productId, // Puede ser null si es combo
    Long comboId,   // Puede ser null si es producto
    @NotNull @Positive Integer quantity
) {
    // Helper para validar lógica desde el Service
    public boolean isValid() {
        return (productId != null && comboId == null) || (productId == null && comboId != null);
    }
}