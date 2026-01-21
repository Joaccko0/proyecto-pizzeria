package com.pizzeria.backend.dto.customer;

import jakarta.validation.constraints.NotBlank;

public record AddressRequest(
    
    @NotBlank(message = "La calle es obligatoria")
    String street,

    @NotBlank(message = "El número es obligatorio")
    String number,

    String description // Opcional (piso, departamento, referencias)

) {}
