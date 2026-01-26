package com.pizzeria.backend.mapper;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import com.pizzeria.backend.dto.supply.SupplyRequest;
import com.pizzeria.backend.dto.supply.SupplyResponse;
import com.pizzeria.backend.model.Supply;

/**
 * Mapper para la entidad Supply
 * Convierte entre DTOs (Request/Response) y la entidad JPA (Supply)
 */
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface SupplyMapper {

    // De Entidad a Respuesta (Para leer)
    SupplyResponse toResponse(Supply supply);

    // De Petición a Entidad (Para crear)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "businessId", ignore = true) // Asignado en el Service
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Supply toEntity(SupplyRequest request);

    // Actualizar Entidad existente (Para editar)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromRequest(SupplyRequest request, @MappingTarget Supply supply);
}
