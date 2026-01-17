package com.pizzeria.backend.dto.combo;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record ComboItemDto(
    @NotNull Long productId,
    @Positive Integer quantity
) {}