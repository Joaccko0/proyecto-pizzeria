package com.pizzeria.backend.dto.order;

import com.pizzeria.backend.model.enums.DeliveryMethod;
import com.pizzeria.backend.model.enums.PaymentMethod;
import com.pizzeria.backend.model.enums.PaymentStatus;

/**
 * DTO para actualizar detalles de pago y entrega de una orden
 * (sin afectar el orderStatus)
 */
public record UpdateOrderDetailsRequest(
    PaymentStatus paymentStatus,
    PaymentMethod paymentMethod,
    DeliveryMethod deliveryMethod
) {}
