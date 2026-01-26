package com.pizzeria.backend.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import com.pizzeria.backend.dto.expense.ExpenseItemResponse;
import com.pizzeria.backend.model.ExpenseItem;

/**
 * Mapper para la entidad ExpenseItem
 * Convierte ExpenseItem en respuesta DTO para mostrar al Front
 * 
 * Nota: No tiene RequestMapper porque los ExpenseItem se crean/editan
 * como parte del ExpenseRequest (anidados en la lista de items)
 */
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ExpenseItemMapper {

    // De Entidad a Respuesta (Para leer)
    // Mapeo manual de supplyName por la relación con Supply
    default ExpenseItemResponse toResponse(ExpenseItem item) {
        if (item == null) return null;
        
        String supplyName = item.getSupply() != null ? item.getSupply().getName() : null;
        
        return new ExpenseItemResponse(
            item.getId(),
            item.getSupply() != null ? item.getSupply().getId() : null,
            supplyName,
            item.getQuantity(),
            item.getUnitPrice(),
            item.getSubtotal()
        );
    }
}
