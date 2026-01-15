package com.pizzeria.backend.mapper;

import com.pizzeria.backend.dto.product.ProductRequest;
import com.pizzeria.backend.dto.product.ProductResponse;
import com.pizzeria.backend.model.Product;
import org.mapstruct.*;

// componentModel = "spring" permite inyectarlo luego con @Autowired o constructores
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ProductMapper {

    // De Entidad a Respuesta (Para leer)
    ProductResponse toResponse(Product product);

    // De Petición a Entidad (Para crear)
    @Mapping(target = "id", ignore = true) // El ID lo genera la BD
    @Mapping(target = "businessId", ignore = true) // Lo asignamos en el Service
    Product toEntity(ProductRequest request);

    // Actualizar Entidad existente (Para editar)
    // nullValuePropertyMappingStrategy = IGNORE significa:
    // Si el request trae "description: null", NO borres la descripción que ya existe en la BD. Solo actualiza lo que trae valor.
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromRequest(ProductRequest request, @MappingTarget Product product);
}
