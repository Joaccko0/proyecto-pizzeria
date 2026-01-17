package com.pizzeria.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pizzeria.backend.model.Combo;

public interface ComboRepository extends JpaRepository<Combo, Long> {
    // SQL generado: SELECT * FROM combos WHERE business_id = ?
    List<Combo> findByBusinessIdAndActiveTrue(Long businessId);

    // SQL generado: SELECT * FROM combos WHERE id = ? AND business_id = ?
    Optional<Combo> findByIdAndBusinessId(Long id, Long businessId);
}
