package com.pizzeria.backend.dto.combo;

import java.math.BigDecimal;
import java.util.List;

public record ComboResponse(
    Long id,
    String name,
    BigDecimal price,
    boolean active,
    List<ComboItemResponseDetail> items
) {
    // Record interno para el detalle
    public record ComboItemResponseDetail(
        Long productId,
        String productName,
        Integer quantity
    ) {}
}