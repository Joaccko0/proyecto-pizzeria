package com.pizzeria.backend.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pizzeria.backend.dto.expense.ExpenseItemResponse;
import com.pizzeria.backend.dto.expense.ExpenseRequest;
import com.pizzeria.backend.dto.expense.ExpenseResponse;
import com.pizzeria.backend.mapper.ExpenseItemMapper;
import com.pizzeria.backend.mapper.ExpenseMapper;
import com.pizzeria.backend.model.Expense;
import com.pizzeria.backend.model.ExpenseItem;
import com.pizzeria.backend.model.Supplier;
import com.pizzeria.backend.model.Supply;
import com.pizzeria.backend.repository.ExpenseRepository;
import com.pizzeria.backend.repository.SupplierRepository;
import com.pizzeria.backend.repository.SupplyRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

/**
 * Servicio para gestionar Gastos (Expenses)
 * 
 * Responsabilidades:
 * - CRUD de gastos con sus detalles de línea (ExpenseItem)
 * - Cálculo automático del total desde los items
 * - Validación de datos y relaciones
 * - Control de acceso multi-tenant (verificar businessId)
 * 
 * Flujo de creación:
 *  1. Recibe ExpenseRequest con lista de ExpenseItemRequest
 *  2. Valida que existan los insumos (supplies) referenciados
 *  3. Calcula el subtotal de cada línea (quantity * unitPrice)
 *  4. Calcula el total del gasto (suma de subtotales)
 *  5. Persiste Expense y sus ExpenseItem en cascada
 */
@Service
@RequiredArgsConstructor
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final SupplyRepository supplyRepository;
    private final SupplierRepository supplierRepository;
    private final ExpenseMapper expenseMapper;
    private final ExpenseItemMapper expenseItemMapper;

    /**
     * CREAR un nuevo gasto con sus líneas detalladas
     * 
     * @param businessId ID del negocio propietario
     * @param request DTO con fecha, proveedor (opcional) e items
     * @return DTO respuesta con el gasto creado y sus items
     * @throws EntityNotFoundException si algún supply o supplier no existe
     */
    @Transactional
    public ExpenseResponse createExpense(Long businessId, ExpenseRequest request) {
        // 1. Convertir DTO a Entidad base
        Expense expense = expenseMapper.toEntity(request);
        expense.setBusinessId(businessId);
        expense.setDate(request.date());

        // 2. Asignar el Proveedor si viene especificado
        if (request.supplierId() != null) {
            Supplier supplier = supplierRepository.findByIdAndBusinessId(request.supplierId(), businessId)
                    .orElseThrow(() -> new EntityNotFoundException("Proveedor no encontrado"));
            expense.setSupplier(supplier);
        }

        // 3. Crear y validar los ExpenseItem
        List<ExpenseItem> items = request.items().stream()
                .map(itemRequest -> {
                    // Verificar que el supply existe y pertenece al negocio
                    Supply supply = supplyRepository.findByIdAndBusinessId(itemRequest.supplyId(), businessId)
                            .orElseThrow(() -> new EntityNotFoundException(
                                    "Insumo con ID " + itemRequest.supplyId() + " no encontrado"));

                    // Crear el item con cálculo de subtotal
                    BigDecimal subtotal = itemRequest.unitPrice()
                            .multiply(new BigDecimal(itemRequest.quantity()));

                    ExpenseItem item = ExpenseItem.builder()
                            .expense(expense)
                            .supply(supply)
                            .quantity(itemRequest.quantity())
                            .unitPrice(itemRequest.unitPrice())
                            .subtotal(subtotal)
                            .build();

                    return item;
                })
                .collect(Collectors.toList());

        expense.setItems(items);

        // 4. Calcular el total del gasto (suma de subtotales)
        BigDecimal total = items.stream()
                .map(ExpenseItem::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        expense.setTotal(total);

        // 5. Guardar en BD (con cascada de items)
        Expense savedExpense = expenseRepository.save(expense);

        // 6. Devolver DTO con respuesta
        return mapToResponse(savedExpense);
    }

    /**
     * LEER todos los gastos de un negocio
     * @param businessId ID del negocio
     * @return Lista de DTOs respuesta con los gastos y sus items
     */
    @Transactional(readOnly = true)
    public List<ExpenseResponse> getAllExpenses(Long businessId) {
        List<Expense> expenses = expenseRepository.findByBusinessIdWithItems(businessId);

        return expenses.stream()
                .map(this::mapToResponse)
                .toList();
    }

    /**
     * LEER un gasto específico
     * @param businessId ID del negocio
     * @param expenseId ID del gasto
     * @return DTO respuesta con el gasto y sus items
     * @throws EntityNotFoundException si el gasto no existe o no pertenece al negocio
     */
    @Transactional(readOnly = true)
    public ExpenseResponse getExpenseById(Long businessId, Long expenseId) {
        Expense expense = expenseRepository.findByIdAndBusinessId(expenseId, businessId)
                .orElseThrow(() -> new EntityNotFoundException("Gasto no encontrado"));

        return mapToResponse(expense);
    }

    /**
     * EDITAR un gasto existente (actualiza fecha, proveedor e items)
     * 
     * Nota: Los items se reemplazan completamente (se borran los viejos via orphanRemoval)
     * 
     * @param businessId ID del negocio
     * @param expenseId ID del gasto
     * @param request DTO con los datos actualizados
     * @return DTO respuesta con el gasto actualizado
     * @throws EntityNotFoundException si el gasto no existe o no pertenece al negocio
     */
    @Transactional
    public ExpenseResponse updateExpense(Long businessId, Long expenseId, ExpenseRequest request) {
        // 1. Buscar el gasto
        Expense expense = expenseRepository.findByIdAndBusinessId(expenseId, businessId)
                .orElseThrow(() -> new EntityNotFoundException("Gasto no encontrado"));

        // 2. Actualizar fecha y proveedor
        expense.setDate(request.date());
        
        if (request.supplierId() != null) {
            Supplier supplier = supplierRepository.findByIdAndBusinessId(request.supplierId(), businessId)
                    .orElseThrow(() -> new EntityNotFoundException("Proveedor no encontrado"));
            expense.setSupplier(supplier);
        } else {
            expense.setSupplier(null);
        }

        // 3. Reemplazar items (orphanRemoval borrará los viejos)
        expense.getItems().clear();

        List<ExpenseItem> newItems = request.items().stream()
                .map(itemRequest -> {
                    Supply supply = supplyRepository.findByIdAndBusinessId(itemRequest.supplyId(), businessId)
                            .orElseThrow(() -> new EntityNotFoundException("Insumo no encontrado"));

                    BigDecimal subtotal = itemRequest.unitPrice()
                            .multiply(new BigDecimal(itemRequest.quantity()));

                    ExpenseItem item = ExpenseItem.builder()
                            .expense(expense)
                            .supply(supply)
                            .quantity(itemRequest.quantity())
                            .unitPrice(itemRequest.unitPrice())
                            .subtotal(subtotal)
                            .build();

                    return item;
                })
                .collect(Collectors.toList());

        expense.setItems(newItems);

        // 4. Recalcular el total
        BigDecimal total = newItems.stream()
                .map(ExpenseItem::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        expense.setTotal(total);

        // 5. Guardar cambios
        Expense updatedExpense = expenseRepository.save(expense);

        return mapToResponse(updatedExpense);
    }

    /**
     * BORRAR un gasto (y sus items via cascada)
     * @param businessId ID del negocio
     * @param expenseId ID del gasto
     * @throws EntityNotFoundException si el gasto no existe o no pertenece al negocio
     */
    @Transactional
    public void deleteExpense(Long businessId, Long expenseId) {
        Expense expense = expenseRepository.findByIdAndBusinessId(expenseId, businessId)
                .orElseThrow(() -> new EntityNotFoundException("Gasto no encontrado"));

        expenseRepository.delete(expense);
    }

    /**
     * LEER gastos en un rango de fechas
     * @param businessId ID del negocio
     * @param startDate Fecha inicial (inclusive)
     * @param endDate Fecha final (inclusive)
     * @return Lista de DTOs respuesta con los gastos en ese período
     */
    @Transactional(readOnly = true)
    public List<ExpenseResponse> getExpensesByDateRange(Long businessId, LocalDate startDate, LocalDate endDate) {
        List<Expense> expenses = expenseRepository.findByBusinessIdAndDateBetween(businessId, startDate, endDate);

        return expenses.stream()
                .map(this::mapToResponse)
                .toList();
    }

    /**
     * LEER gastos de un proveedor específico
     * @param businessId ID del negocio
     * @param supplierId ID del proveedor
     * @return Lista de DTOs respuesta con los gastos de ese proveedor
     */
    @Transactional(readOnly = true)
    public List<ExpenseResponse> getExpensesBySupplier(Long businessId, Long supplierId) {
        List<Expense> expenses = expenseRepository.findByBusinessIdAndSupplierId(businessId, supplierId);

        return expenses.stream()
                .map(this::mapToResponse)
                .toList();
    }

    /**
     * HELPER privado: Convierte Expense a ExpenseResponse con mapeo de items
     * 
     * @param expense Entidad Expense con sus items cargados
     * @return DTO ExpenseResponse con información completa
     */
    private ExpenseResponse mapToResponse(Expense expense) {
        List<ExpenseItemResponse> itemResponses = expense.getItems() != null
                ? expense.getItems().stream()
                        .map(expenseItemMapper::toResponse)
                        .toList()
                : List.of();

        String supplierName = expense.getSupplier() != null ? expense.getSupplier().getName() : null;

        return new ExpenseResponse(
                expense.getId(),
                expense.getSupplier() != null ? expense.getSupplier().getId() : null,
                supplierName,
                expense.getDate(),
                expense.getTotal(),
                itemResponses
        );
    }
}
