package com.pizzeria.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pizzeria.backend.model.ExpenseItem;

/**
 * Repositorio para la entidad ExpenseItem
 * Proporciona métodos para acceder a las líneas de gastos
 * 
 * Nota: Los ExpenseItem generalmente se acceden a través de Expense (relación bidireccional)
 * Este repositorio se proporciona por completitud y flexibilidad futura
 */
public interface ExpenseItemRepository extends JpaRepository<ExpenseItem, Long> {
    
    // Obtener todos los items de un gasto específico
    List<ExpenseItem> findByExpenseId(Long expenseId);

    // Obtener todos los items que referencian un insumo
    List<ExpenseItem> findBySupplyId(Long supplyId);
}
