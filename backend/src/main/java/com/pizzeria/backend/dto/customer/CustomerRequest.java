package com.pizzeria.backend.dto.customer;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record CustomerRequest(
    
    @NotBlank(message = "El nombre del cliente es obligatorio")
    String name,

    @NotBlank(message = "El teléfono es obligatorio")
    @Pattern(regexp = "^[0-9+\\-\\s()]*$", message = "El teléfono no tiene un formato válido")
    String phone

) {}
