package com.pizzeria.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pizzeria.backend.model.Supply;
import com.pizzeria.backend.model.enums.SupplyCategory;

/**
 * Repositorio para la entidad Supply
 * Proporciona métodos CRUD y queries custom para insumos/partidas de gasto
 */
public interface SupplyRepository extends JpaRepository<Supply, Long> {
    
    // Obtener todos los insumos de un negocio
    List<Supply> findByBusinessId(Long businessId);

    // Obtener un insumo específico verificando que pertenezca al negocio
    Optional<Supply> findByIdAndBusinessId(Long id, Long businessId);

    // Obtener insumos por categoría (ej: todos los STOCK, todos los SERVICE)
    List<Supply> findByBusinessIdAndCategory(Long businessId, SupplyCategory category);

    // Búsqueda por nombre (para autocomplete, ej)
    List<Supply> findByBusinessIdAndNameContainingIgnoreCase(Long businessId, String name);
}
