package com.pizzeria.backend.dto.cashshift;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * DTO de respuesta para CashShift
 */
public record CashShiftResponse(
    Long id,
    String status,
    LocalDateTime startDate,
    LocalDateTime endDate,
    BigDecimal startAmount,
    BigDecimal endAmount
) {}
