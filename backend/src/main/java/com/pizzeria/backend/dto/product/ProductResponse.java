package com.pizzeria.backend.dto.product;

import java.math.BigDecimal;

public record ProductResponse(
    Long id,
    String title,
    String description,
    BigDecimal price,
    String category,
    boolean active
) {}
