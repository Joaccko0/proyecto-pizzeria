package com.pizzeria.backend.dto.supplier;

/**
 * DTO para leer/responder datos de un Proveedor (Supplier)
 * Lo que el Back devuelve al Front cuando consulta o crea un proveedor.
 */
public record SupplierResponse(
    Long id,
    String name,
    String contactInfo
) {}
