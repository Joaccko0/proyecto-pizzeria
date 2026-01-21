package com.pizzeria.backend.mapper;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import com.pizzeria.backend.dto.customer.CustomerRequest;
import com.pizzeria.backend.dto.customer.CustomerResponse;
import com.pizzeria.backend.model.Customer;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface CustomerMapper {

    // De Entidad a Respuesta (Para leer)
    CustomerResponse toResponse(Customer customer);

    // De Petición a Entidad (Para crear)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "businessId", ignore = true)
    @Mapping(target = "addresses", ignore = true)
    @Mapping(target = "active", ignore = true)
    Customer toEntity(CustomerRequest request);

    // Actualizar Entidad existente (Para editar)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "businessId", ignore = true)
    @Mapping(target = "addresses", ignore = true)
    @Mapping(target = "active", ignore = true)
    void updateEntityFromRequest(CustomerRequest request, @MappingTarget Customer customer);
}
