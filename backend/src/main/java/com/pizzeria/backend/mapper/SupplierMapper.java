package com.pizzeria.backend.mapper;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import com.pizzeria.backend.dto.supplier.SupplierRequest;
import com.pizzeria.backend.dto.supplier.SupplierResponse;
import com.pizzeria.backend.model.Supplier;

/**
 * Mapper para la entidad Supplier
 * Convierte entre DTOs (Request/Response) y la entidad JPA (Supplier)
 */
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface SupplierMapper {

    // De Entidad a Respuesta (Para leer)
    SupplierResponse toResponse(Supplier supplier);

    // De Petición a Entidad (Para crear)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "businessId", ignore = true) // Asignado en el Service
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Supplier toEntity(SupplierRequest request);

    // Actualizar Entidad existente (Para editar)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromRequest(SupplierRequest request, @MappingTarget Supplier supplier);
}
