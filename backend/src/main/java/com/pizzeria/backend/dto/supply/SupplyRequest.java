package com.pizzeria.backend.dto.supply;

import com.pizzeria.backend.model.enums.SupplyCategory;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * DTO para crear/editar un Insumo (Supply)
 * Los valores que el Front envía para alta/edición de partidas de gasto o insumos.
 */
public record SupplyRequest(

    @NotBlank(message = "El nombre del insumo es obligatorio")
    String name,

    @NotNull(message = "La categoría del insumo es obligatoria")
    SupplyCategory category // STOCK, SERVICE, FIXED_COST
) {}
