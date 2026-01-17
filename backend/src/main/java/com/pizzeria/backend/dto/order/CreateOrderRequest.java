package com.pizzeria.backend.dto.order;

import java.util.List;

import com.pizzeria.backend.model.enums.DeliveryMethod;
import com.pizzeria.backend.model.enums.PaymentMethod;
import com.pizzeria.backend.model.enums.PaymentStatus;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public record CreateOrderRequest(
    Long customerId, // Nullable (Cliente anónimo)
    @NotNull DeliveryMethod deliveryMethod,
    @NotNull PaymentMethod paymentMethod,
    PaymentStatus paymentStatus,
    @NotNull @Valid List<OrderItemRequest> items,
    String note // Nota opcional ("Sin aceitunas")
) {}