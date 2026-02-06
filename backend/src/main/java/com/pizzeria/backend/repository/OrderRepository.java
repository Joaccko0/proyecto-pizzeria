package com.pizzeria.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.pizzeria.backend.model.CashShift;
import com.pizzeria.backend.model.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {
    
    // SQL: SELECT * FROM orders WHERE business_id = ? ORDER BY created_at DESC
    List<Order> findByBusinessIdOrderByCreatedAtDesc(Long businessId);

    // SQL: SELECT * FROM orders WHERE id = ? AND business_id = ?
    Optional<Order> findByIdAndBusinessId(Long id, Long businessId);

    // SQL: SELECT * FROM orders WHERE business_id = ? AND cash_shift_id = ? ORDER BY created_at DESC
    @Query("SELECT o FROM Order o WHERE o.businessId = :businessId AND o.cashShift = :cashShift ORDER BY o.createdAt DESC")
    List<Order> findByBusinessIdAndCashShiftOrderByCreatedAtDesc(
            @Param("businessId") Long businessId,
            @Param("cashShift") CashShift cashShift
    );
}
