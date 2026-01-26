package com.pizzeria.backend.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.pizzeria.backend.dto.expense.ExpenseRequest;
import com.pizzeria.backend.dto.expense.ExpenseResponse;
import com.pizzeria.backend.service.ExpenseService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

/**
 * Controlador para gestionar Gastos (Expenses)
 * 
 * Endpoints:
 *  POST   /api/expenses                          - Crear gasto con items
 *  GET    /api/expenses                          - Listar gastos
 *  GET    /api/expenses/{id}                     - Obtener gasto específico
 *  PUT    /api/expenses/{id}                     - Editar gasto
 *  DELETE /api/expenses/{id}                     - Borrar gasto
 *  GET    /api/expenses/date-range               - Filtrar por rango de fechas
 *  GET    /api/expenses/supplier/{supplierId}    - Filtrar por proveedor
 */
@RestController
@RequestMapping("/api/expenses")
@RequiredArgsConstructor
public class ExpenseController {

    private final ExpenseService expenseService;

    /**
     * CREAR un nuevo gasto con sus líneas detalladas
     * POST /api/expenses?businessId=1
     * 
     * Body:
     * {
     *   "supplierId": 5,  (opcional)
     *   "date": "2026-01-15",
     *   "items": [
     *     { "supplyId": 1, "quantity": 50, "unitPrice": 10.00 },
     *     { "supplyId": 2, "quantity": 10, "unitPrice": 50.00 }
     *   ]
     * }
     */
    @PostMapping
    public ResponseEntity<ExpenseResponse> create(
            @RequestParam Long businessId,
            @RequestBody @Valid ExpenseRequest request
    ) {
        ExpenseResponse response = expenseService.createExpense(businessId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * LEER todos los gastos de un negocio
     * GET /api/expenses?businessId=1
     */
    @GetMapping
    public ResponseEntity<List<ExpenseResponse>> getAll(
            @RequestParam Long businessId
    ) {
        List<ExpenseResponse> expenses = expenseService.getAllExpenses(businessId);
        return ResponseEntity.ok(expenses);
    }

    /**
     * LEER un gasto específico con sus items
     * GET /api/expenses/5?businessId=1
     */
    @GetMapping("/{id}")
    public ResponseEntity<ExpenseResponse> getById(
            @PathVariable Long id,
            @RequestParam Long businessId
    ) {
        ExpenseResponse expense = expenseService.getExpenseById(businessId, id);
        return ResponseEntity.ok(expense);
    }

    /**
     * EDITAR un gasto (reemplaza todos sus items)
     * PUT /api/expenses/5?businessId=1
     */
    @PutMapping("/{id}")
    public ResponseEntity<ExpenseResponse> update(
            @PathVariable Long id,
            @RequestParam Long businessId,
            @RequestBody @Valid ExpenseRequest request
    ) {
        ExpenseResponse response = expenseService.updateExpense(businessId, id, request);
        return ResponseEntity.ok(response);
    }

    /**
     * BORRAR un gasto (y sus items vía cascada)
     * DELETE /api/expenses/5?businessId=1
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id,
            @RequestParam Long businessId
    ) {
        expenseService.deleteExpense(businessId, id);
        return ResponseEntity.noContent().build();
    }

    /**
     * LEER gastos en un rango de fechas
     * GET /api/expenses/date-range?businessId=1&startDate=2026-01-01&endDate=2026-01-31
     */
    @GetMapping("/date-range")
    public ResponseEntity<List<ExpenseResponse>> getByDateRange(
            @RequestParam Long businessId,
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate
    ) {
        List<ExpenseResponse> expenses = expenseService.getExpensesByDateRange(businessId, startDate, endDate);
        return ResponseEntity.ok(expenses);
    }

    /**
     * LEER gastos de un proveedor específico
     * GET /api/expenses/supplier/5?businessId=1
     */
    @GetMapping("/supplier/{supplierId}")
    public ResponseEntity<List<ExpenseResponse>> getBySupplier(
            @PathVariable Long supplierId,
            @RequestParam Long businessId
    ) {
        List<ExpenseResponse> expenses = expenseService.getExpensesBySupplier(businessId, supplierId);
        return ResponseEntity.ok(expenses);
    }
}
