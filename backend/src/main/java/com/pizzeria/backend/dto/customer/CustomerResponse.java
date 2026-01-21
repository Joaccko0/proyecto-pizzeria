package com.pizzeria.backend.dto.customer;

import java.util.List;

public record CustomerResponse(
    Long id,
    String name,
    String phone,
    List<DetailedAddressResponse> addresses
) {}
