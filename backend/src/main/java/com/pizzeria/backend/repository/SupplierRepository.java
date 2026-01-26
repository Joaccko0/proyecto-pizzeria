package com.pizzeria.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pizzeria.backend.model.Supplier;

/**
 * Repositorio para la entidad Supplier
 * Proporciona métodos CRUD y queries custom para proveedores
 */
public interface SupplierRepository extends JpaRepository<Supplier, Long> {
    
    // Obtener todos los proveedores de un negocio
    List<Supplier> findByBusinessId(Long businessId);

    // Obtener un proveedor específico verificando que pertenezca al negocio
    Optional<Supplier> findByIdAndBusinessId(Long id, Long businessId);

    // Búsqueda por nombre (para autocomplete, ej)
    List<Supplier> findByBusinessIdAndNameContainingIgnoreCase(Long businessId, String name);
}
