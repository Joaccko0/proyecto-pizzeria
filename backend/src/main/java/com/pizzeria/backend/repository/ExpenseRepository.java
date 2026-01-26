package com.pizzeria.backend.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.pizzeria.backend.model.Expense;

/**
 * Repositorio para la entidad Expense
 * Proporciona métodos CRUD y queries custom para gastos
 */
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    
    // Obtener todos los gastos de un negocio
    List<Expense> findByBusinessId(Long businessId);

    // Obtener un gasto específico verificando que pertenezca al negocio
    Optional<Expense> findByIdAndBusinessId(Long id, Long businessId);

    // Obtener gastos en un rango de fechas
    List<Expense> findByBusinessIdAndDateBetween(Long businessId, LocalDate startDate, LocalDate endDate);

    // Obtener gastos de un proveedor específico
    List<Expense> findByBusinessIdAndSupplierId(Long businessId, Long supplierId);

    // Query custom para obtener gastos con sus items eager-loaded (evita N+1 queries)
    @Query("SELECT DISTINCT e FROM Expense e LEFT JOIN FETCH e.items WHERE e.businessId = :businessId")
    List<Expense> findByBusinessIdWithItems(@Param("businessId") Long businessId);
}
