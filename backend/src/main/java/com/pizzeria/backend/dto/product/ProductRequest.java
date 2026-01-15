package com.pizzeria.backend.dto.product;

import java.math.BigDecimal;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

// Lo que recibimos del Front para crear/editar un Product
public record ProductRequest(
    
    @NotBlank(message = "El título no puede estar vacío")
    String title,

    String description, // Puede ser null/vacío, no ponemos validación

    @NotNull(message = "El precio es obligatorio")
    @Positive(message = "El precio debe ser mayor a cero")
    BigDecimal price,

    @NotBlank(message = "La categoría es obligatoria")
    String category,

    Boolean active // Opcional
) {}
