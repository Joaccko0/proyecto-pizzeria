package com.pizzeria.backend.mapper;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import com.pizzeria.backend.dto.expense.ExpenseRequest;
import com.pizzeria.backend.dto.expense.ExpenseResponse;
import com.pizzeria.backend.model.Expense;

/**
 * Mapper para la entidad Expense
 * Convierte entre DTOs (Request/Response) y la entidad JPA (Expense)
 * 
 * Nota: El mapeo de items y proveedores se maneja en el Service de manera más granular
 * para asegurar cálculos correctos (ej: total = suma de items)
 */
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ExpenseMapper {

    // De Entidad a Respuesta (Para leer)
    ExpenseResponse toResponse(Expense expense);

    // De Petición a Entidad (Para crear)
    // El mapeo real se hace en ExpenseService debido a la complejidad de items y cálculos
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "businessId", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "items", ignore = true) // Mapeado manualmente en Service
    @Mapping(target = "supplier", ignore = true) // Mapeado manualmente en Service
    Expense toEntity(ExpenseRequest request);

    // Actualizar Entidad existente (Para editar)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "items", ignore = true)
    @Mapping(target = "supplier", ignore = true)
    void updateEntityFromRequest(ExpenseRequest request, @MappingTarget Expense expense);
}
