package com.pizzeria.backend.dto.customer;

public record DetailedAddressResponse(
    Long id,
    String street,
    String number,
    String description
) {}
