package com.pizzeria.backend.dto.supplier;

import jakarta.validation.constraints.NotBlank;

/**
 * DTO para crear/editar un Proveedor (Supplier)
 * Los valores que el Front envía para alta/edición de proveedores.
 */
public record SupplierRequest(

    @NotBlank(message = "El nombre del proveedor es obligatorio")
    String name,

    String contactInfo // Opcional: teléfono, email, dirección, etc.
) {}
