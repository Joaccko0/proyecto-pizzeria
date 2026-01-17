package com.pizzeria.backend.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.pizzeria.backend.dto.combo.ComboResponse;
import com.pizzeria.backend.model.Combo;
import com.pizzeria.backend.model.ComboItem;

@Mapper(componentModel = "spring")
public interface ComboMapper {

    // Mapeo principal de Combo -> Response
    @Mapping(target = "items", source = "comboItems")
    ComboResponse toResponse(Combo combo);

    // Mapeo de cada Item -> Item Detail
    @Mapping(target = "productId", source = "product.id")
    @Mapping(target = "productName", source = "product.title")
    ComboResponse.ComboItemResponseDetail toItemDetail(ComboItem item);
}