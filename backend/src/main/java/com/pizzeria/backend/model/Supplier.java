package com.pizzeria.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

/**
 * Entidad Supplier (Proveedor)
 * Representa a los proveedores de insumos para el negocio.
 * Ej: Distribuidor de harina, proveedor de internet, etc.
 * 
 * Multi-tenant: cada proveedor pertenece a un negocio específico (via businessId en BaseEntity)
 */
@Entity
@Table(name = "suppliers")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @SuperBuilder
public class Supplier extends BaseEntity {

    /** Nombre del proveedor (ej: "Distribuidor X", "Telecom Y") */
    @Column(nullable = false)
    private String name;

    /** Información de contacto (teléfono, email, dirección) */
    @Column(columnDefinition = "TEXT")
    private String contactInfo;
}
