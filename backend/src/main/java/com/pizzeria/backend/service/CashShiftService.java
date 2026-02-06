package com.pizzeria.backend.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pizzeria.backend.model.CashShift;
import com.pizzeria.backend.model.CashShift.CashShiftStatus;
import com.pizzeria.backend.model.Order;
import com.pizzeria.backend.model.enums.OrderStatus;
import com.pizzeria.backend.repository.CashShiftRepository;
import com.pizzeria.backend.repository.OrderRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

/**
 * Servicio para gestión de cajas (CashShift)
 * 
 * Responsabilidades:
 * - Abrir cajas al inicio del turno
 * - Cerrar cajas al final del turno
 * - Validar que haya caja abierta al crear pedidos
 * - Listar cajas históricas
 */
@Service
@RequiredArgsConstructor
public class CashShiftService {

    private final CashShiftRepository cashShiftRepository;
    private final OrderRepository orderRepository;

    /**
     * Abre una nueva caja para un negocio
     * 
     * @param businessId ID del negocio
     * @param startAmount Monto inicial de la caja
     * @return CashShift recién creada
     * @throws IllegalStateException si ya hay caja abierta
     */
    @Transactional
    public CashShift openCashShift(Long businessId, BigDecimal startAmount) {
        // Verificar que no haya caja abierta
        if (cashShiftRepository.hasCashShiftOpen(businessId)) {
            throw new IllegalStateException("Ya hay una caja abierta para este negocio. Ciérrala primero.");
        }

        CashShift cashShift = CashShift.builder()
                .businessId(businessId)
                .status(CashShiftStatus.OPEN)
                .startDate(LocalDateTime.now())
                .startAmount(startAmount)
                .build();

        return cashShiftRepository.save(cashShift);
    }

    /**
     * Cierra la caja abierta de un negocio
     * 
     * @param businessId ID del negocio
     * @param endAmount Monto final de la caja
     * @return CashShift cerrada
     * @throws EntityNotFoundException si no hay caja abierta
     */
    @Transactional
    public CashShift closeCashShift(Long businessId, BigDecimal endAmount) {
        CashShift cashShift = cashShiftRepository.findOpenCashShift(businessId)
                .orElseThrow(() -> new EntityNotFoundException("No hay caja abierta para este negocio"));

        cashShift.setStatus(CashShiftStatus.CLOSED);
        cashShift.setEndDate(LocalDateTime.now());
        cashShift.setEndAmount(endAmount);

        // Marcar todos los pedidos de esta caja como entregados
        List<Order> orders = orderRepository.findByBusinessIdAndCashShiftOrderByCreatedAtDesc(businessId, cashShift);
        orders.forEach(order -> order.setOrderStatus(OrderStatus.DELIVERED));
        orderRepository.saveAll(orders);

        return cashShiftRepository.save(cashShift);
    }

    /**
     * Obtiene la caja abierta actual de un negocio
     * 
     * @param businessId ID del negocio
     * @return CashShift abierta
     * @throws EntityNotFoundException si no hay caja abierta
     */
    @Transactional(readOnly = true)
    public CashShift getOpenCashShift(Long businessId) {
        return cashShiftRepository.findOpenCashShift(businessId)
                .orElseThrow(() -> new EntityNotFoundException("No hay caja abierta para este negocio"));
    }

    /**
     * Obtiene una caja específica por ID
     * 
     * @param businessId ID del negocio
     * @param cashShiftId ID de la caja
     * @return CashShift encontrada
     * @throws EntityNotFoundException si no existe
     */
    @Transactional(readOnly = true)
    public CashShift getCashShiftById(Long businessId, Long cashShiftId) {
        return cashShiftRepository.findByIdAndBusinessId(cashShiftId, businessId)
                .orElseThrow(() -> new EntityNotFoundException("Caja no encontrada"));
    }

    /**
     * Lista todas las cajas de un negocio (históricas y actual)
     * 
     * @param businessId ID del negocio
     * @return Lista de CashShift ordenadas por startDate DESC
     */
    @Transactional(readOnly = true)
    public List<CashShift> getAllCashShifts(Long businessId) {
        return cashShiftRepository.findByBusinessId(businessId);
    }
}
