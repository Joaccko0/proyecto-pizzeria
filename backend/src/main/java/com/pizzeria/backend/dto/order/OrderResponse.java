package com.pizzeria.backend.dto.order;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.pizzeria.backend.model.enums.DeliveryMethod;
import com.pizzeria.backend.model.enums.OrderStatus;
import com.pizzeria.backend.model.enums.PaymentMethod;
import com.pizzeria.backend.model.enums.PaymentStatus;

public record OrderResponse(
    Long id,
    Long customerId,
    String customerName, // Para mostrar rápido en la tabla
    Long addressId,
    String deliveryAddress, // Dirección completa formateada
    OrderStatus orderStatus,
    PaymentStatus paymentStatus,
    PaymentMethod paymentMethod,
    DeliveryMethod deliveryMethod,
    BigDecimal total,
    LocalDateTime createdAt,
    List<OrderItemResponse> items
) {
    public record OrderItemResponse(
        Long productId,
        Long comboId,
        String name, // (Pizza Muzza o Combo Familiar)
        Integer quantity,
        BigDecimal unitPrice,
        BigDecimal subtotal
    ) {}
}