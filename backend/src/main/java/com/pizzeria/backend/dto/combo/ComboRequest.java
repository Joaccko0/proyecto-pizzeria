package com.pizzeria.backend.dto.combo;

import java.math.BigDecimal;
import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record ComboRequest(
    @NotBlank String name,
    @NotNull @Positive BigDecimal price,
    @NotNull List<ComboItemDto> items // Lista de productos que componen el combo
) {}