package com.pizzeria.backend.mapper;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import com.pizzeria.backend.dto.customer.AddressRequest;
import com.pizzeria.backend.dto.customer.DetailedAddressResponse;
import com.pizzeria.backend.model.Address;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface AddressMapper {

    // De Entidad a Respuesta (Para leer)
    DetailedAddressResponse toResponse(Address address);

    // De Petición a Entidad (Para crear)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "customer", ignore = true)
    Address toEntity(AddressRequest request);

    // Actualizar Entidad existente (Para editar)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "customer", ignore = true)
    void updateEntityFromRequest(AddressRequest request, @MappingTarget Address address);
}
