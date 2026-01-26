package com.pizzeria.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pizzeria.backend.dto.supply.SupplyRequest;
import com.pizzeria.backend.dto.supply.SupplyResponse;
import com.pizzeria.backend.mapper.SupplyMapper;
import com.pizzeria.backend.model.Supply;
import com.pizzeria.backend.model.enums.SupplyCategory;
import com.pizzeria.backend.repository.SupplyRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

/**
 * Servicio para gestionar Insumos/Partidas de Gasto (Supplies)
 * 
 * Responsabilidades:
 * - CRUD de insumos
 * - Validación de datos
 * - Control de acceso multi-tenant (verificar businessId)
 * - Filtrado por categoría (STOCK, SERVICE, FIXED_COST)
 */
@Service
@RequiredArgsConstructor
public class SupplyService {

    private final SupplyRepository supplyRepository;
    private final SupplyMapper supplyMapper;

    /**
     * CREAR un nuevo insumo
     * @param businessId ID del negocio propietario
     * @param request DTO con los datos del insumo
     * @return DTO respuesta con el insumo creado
     */
    @Transactional
    public SupplyResponse createSupply(Long businessId, SupplyRequest request) {
        // 1. Convertir DTO a Entidad
        Supply supply = supplyMapper.toEntity(request);
        
        // 2. Asignar el negocio
        supply.setBusinessId(businessId);
        
        // 3. Guardar en BD
        Supply savedSupply = supplyRepository.save(supply);
        
        // 4. Devolver DTO
        return supplyMapper.toResponse(savedSupply);
    }

    /**
     * LEER todos los insumos de un negocio
     * @param businessId ID del negocio
     * @return Lista de DTOs respuesta con los insumos
     */
    @Transactional(readOnly = true)
    public List<SupplyResponse> getAllSupplies(Long businessId) {
        List<Supply> supplies = supplyRepository.findByBusinessId(businessId);
        
        return supplies.stream()
                .map(supplyMapper::toResponse)
                .toList();
    }

    /**
     * LEER un insumo específico
     * @param businessId ID del negocio
     * @param supplyId ID del insumo
     * @return DTO respuesta con el insumo
     * @throws EntityNotFoundException si el insumo no existe o no pertenece al negocio
     */
    @Transactional(readOnly = true)
    public SupplyResponse getSupplyById(Long businessId, Long supplyId) {
        Supply supply = supplyRepository.findByIdAndBusinessId(supplyId, businessId)
                .orElseThrow(() -> new EntityNotFoundException("Insumo no encontrado"));
        
        return supplyMapper.toResponse(supply);
    }

    /**
     * EDITAR un insumo existente
     * @param businessId ID del negocio
     * @param supplyId ID del insumo
     * @param request DTO con los datos actualizados
     * @return DTO respuesta con el insumo actualizado
     * @throws EntityNotFoundException si el insumo no existe o no pertenece al negocio
     */
    @Transactional
    public SupplyResponse updateSupply(Long businessId, Long supplyId, SupplyRequest request) {
        // 1. Buscar el insumo verificando que sea del negocio
        Supply supply = supplyRepository.findByIdAndBusinessId(supplyId, businessId)
                .orElseThrow(() -> new EntityNotFoundException("Insumo no encontrado"));

        // 2. Actualizar solo los campos que vienen en el request
        supplyMapper.updateEntityFromRequest(request, supply);

        // 3. Guardar cambios
        Supply updatedSupply = supplyRepository.save(supply);

        return supplyMapper.toResponse(updatedSupply);
    }

    /**
     * BORRAR un insumo (borrado físico)
     * 
     * Nota: Se realiza un borrado físico. Idealmente, si hay gastos que usan este insumo,
     * se debería prevenir el borrado o usar borrado lógico.
     * Esto puede mejorarse en futuras iteraciones.
     * 
     * @param businessId ID del negocio
     * @param supplyId ID del insumo
     * @throws EntityNotFoundException si el insumo no existe o no pertenece al negocio
     */
    @Transactional
    public void deleteSupply(Long businessId, Long supplyId) {
        Supply supply = supplyRepository.findByIdAndBusinessId(supplyId, businessId)
                .orElseThrow(() -> new EntityNotFoundException("Insumo no encontrado"));
        
        supplyRepository.delete(supply);
    }

    /**
     * LEER insumos por categoría
     * @param businessId ID del negocio
     * @param category Categoría a filtrar (STOCK, SERVICE, FIXED_COST)
     * @return Lista de DTOs respuesta con los insumos de esa categoría
     */
    @Transactional(readOnly = true)
    public List<SupplyResponse> getSuppliesByCategory(Long businessId, SupplyCategory category) {
        List<Supply> supplies = supplyRepository.findByBusinessIdAndCategory(businessId, category);
        
        return supplies.stream()
                .map(supplyMapper::toResponse)
                .toList();
    }

    /**
     * BUSCAR insumos por nombre (para autocomplete)
     * @param businessId ID del negocio
     * @param name Nombre o parte del nombre a buscar
     * @return Lista de DTOs respuesta con los insumos que coinciden
     */
    @Transactional(readOnly = true)
    public List<SupplyResponse> searchSuppliesByName(Long businessId, String name) {
        List<Supply> supplies = supplyRepository.findByBusinessIdAndNameContainingIgnoreCase(businessId, name);
        
        return supplies.stream()
                .map(supplyMapper::toResponse)
                .toList();
    }
}
