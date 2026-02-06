package com.pizzeria.backend.mapper;

import org.mapstruct.Mapper;

import com.pizzeria.backend.dto.cashshift.CashShiftResponse;
import com.pizzeria.backend.model.CashShift;

/**
 * Mapper para CashShift -> DTOs
 */
@Mapper(componentModel = "spring")
public interface CashShiftMapper {

    CashShiftResponse toResponse(CashShift cashShift);
}
