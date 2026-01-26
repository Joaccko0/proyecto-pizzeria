package com.pizzeria.backend.dto.supply;

import com.pizzeria.backend.model.enums.SupplyCategory;

/**
 * DTO para leer/responder datos de un Insumo (Supply)
 * Lo que el Back devuelve al Front cuando consulta o crea un insumo.
 */
public record SupplyResponse(
    Long id,
    String name,
    SupplyCategory category
) {}
