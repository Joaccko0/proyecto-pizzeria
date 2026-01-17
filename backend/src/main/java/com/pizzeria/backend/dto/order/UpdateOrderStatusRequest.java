package com.pizzeria.backend.dto.order;

import com.pizzeria.backend.model.enums.OrderStatus;

import jakarta.validation.constraints.NotNull;

public record UpdateOrderStatusRequest(
    @NotNull OrderStatus orderStatus
) {}
