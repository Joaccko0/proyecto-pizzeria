package com.pizzeria.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.pizzeria.backend.model.CashShift;

/**
 * Repositorio para la entidad CashShift.
 * Proporciona métodos para buscar, crear, actualizar y gestionar cajas de un negocio.
 */
@Repository
public interface CashShiftRepository extends JpaRepository<CashShift, Long> {

    /**
     * Busca la caja abierta (OPEN) actual de un negocio.
     * 
     * @param businessId ID del negocio
     * @return Optional con la caja abierta, vacío si no hay caja abierta
     */
    @Query("SELECT cs FROM CashShift cs WHERE cs.businessId = :businessId AND cs.status = 'OPEN'")
    Optional<CashShift> findOpenCashShift(@Param("businessId") Long businessId);

    /**
     * Busca todas las cajas (abiertas y cerradas) de un negocio.
     * 
     * @param businessId ID del negocio
     * @return Lista de cajas ordenadas por fecha de inicio descendente
     */
    @Query("SELECT cs FROM CashShift cs WHERE cs.businessId = :businessId ORDER BY cs.startDate DESC")
    List<CashShift> findByBusinessId(@Param("businessId") Long businessId);

    /**
     * Busca una caja específica por ID y verifica que pertenece al negocio indicado.
     * 
     * @param id ID de la caja
     * @param businessId ID del negocio
     * @return Optional con la caja si existe y pertenece al negocio
     */
    @Query("SELECT cs FROM CashShift cs WHERE cs.id = :id AND cs.businessId = :businessId")
    Optional<CashShift> findByIdAndBusinessId(@Param("id") Long id, @Param("businessId") Long businessId);

    /**
     * Verifica si hay una caja abierta para un negocio.
     * 
     * @param businessId ID del negocio
     * @return true si hay una caja abierta, false en caso contrario
     */
    @Query("SELECT COUNT(cs) > 0 FROM CashShift cs WHERE cs.businessId = :businessId AND cs.status = 'OPEN'")
    boolean hasCashShiftOpen(@Param("businessId") Long businessId);
}
