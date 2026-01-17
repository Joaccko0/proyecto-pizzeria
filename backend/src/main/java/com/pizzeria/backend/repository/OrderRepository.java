package com.pizzeria.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pizzeria.backend.model.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {
    
    // SQL: SELECT * FROM orders WHERE business_id = ? ORDER BY created_at DESC
    List<Order> findByBusinessIdOrderByCreatedAtDesc(Long businessId);

    // SQL: SELECT * FROM orders WHERE id = ? AND business_id = ?
    Optional<Order> findByIdAndBusinessId(Long id, Long businessId);
}
