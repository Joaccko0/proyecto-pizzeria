package com.pizzeria.backend.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import com.pizzeria.backend.dto.order.OrderResponse;
import com.pizzeria.backend.model.Order;
import com.pizzeria.backend.model.OrderItem;

@Mapper(componentModel = "spring")
public interface OrderMapper {

    @Mapping(target = "customerId", source = "customer.id")
    @Mapping(target = "customerName", source = "customer.name")
    @Mapping(target = "addressId", source = "address.id")
    @Mapping(target = "deliveryAddress", source = "order", qualifiedByName = "formatAddress")
    @Mapping(target = "items", source = "items")
    OrderResponse toResponse(Order order);

    @Mapping(target = "productId", source = "product.id")
    @Mapping(target = "comboId", source = "combo.id")
    @Mapping(target = "name", source = "item", qualifiedByName = "resolveName")
    OrderResponse.OrderItemResponse toItemResponse(OrderItem item);

    @Named("formatAddress")
    default String formatAddress(Order order) {
        // Priorizar dirección manual (para delivery sin cliente)
        if (order.getManualAddress() != null && !order.getManualAddress().isBlank()) {
            return order.getManualAddress();
        }
        
        // Si no hay dirección manual, formatear desde Address
        if (order.getAddress() != null) {
            var addr = order.getAddress();
            String base = addr.getStreet() + " " + addr.getNumber();
            if (addr.getDescription() != null && !addr.getDescription().isEmpty()) {
                base += " (" + addr.getDescription() + ")";
            }
            return base;
        }
        
        return null;
    }

    @Named("resolveName")
    default String resolveName(OrderItem item) {
        if (item.getProduct() != null) {
            return item.getProduct().getTitle();
        } else if (item.getCombo() != null) {
            return item.getCombo().getName();
        }
        return "Item Desconocido";
    }
}