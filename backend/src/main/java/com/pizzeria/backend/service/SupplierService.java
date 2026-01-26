package com.pizzeria.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pizzeria.backend.dto.supplier.SupplierRequest;
import com.pizzeria.backend.dto.supplier.SupplierResponse;
import com.pizzeria.backend.mapper.SupplierMapper;
import com.pizzeria.backend.model.Supplier;
import com.pizzeria.backend.repository.SupplierRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

/**
 * Servicio para gestionar Proveedores (Suppliers)
 * 
 * Responsabilidades:
 * - CRUD de proveedores
 * - Validación de datos
 * - Control de acceso multi-tenant (verificar businessId)
 */
@Service
@RequiredArgsConstructor
public class SupplierService {

    private final SupplierRepository supplierRepository;
    private final SupplierMapper supplierMapper;

    /**
     * CREAR un nuevo proveedor
     * @param businessId ID del negocio propietario
     * @param request DTO con los datos del proveedor
     * @return DTO respuesta con el proveedor creado
     */
    @Transactional
    public SupplierResponse createSupplier(Long businessId, SupplierRequest request) {
        // 1. Convertir DTO a Entidad
        Supplier supplier = supplierMapper.toEntity(request);
        
        // 2. Asignar el negocio
        supplier.setBusinessId(businessId);
        
        // 3. Guardar en BD
        Supplier savedSupplier = supplierRepository.save(supplier);
        
        // 4. Devolver DTO
        return supplierMapper.toResponse(savedSupplier);
    }

    /**
     * LEER todos los proveedores de un negocio
     * @param businessId ID del negocio
     * @return Lista de DTOs respuesta con los proveedores
     */
    @Transactional(readOnly = true)
    public List<SupplierResponse> getAllSuppliers(Long businessId) {
        List<Supplier> suppliers = supplierRepository.findByBusinessId(businessId);
        
        return suppliers.stream()
                .map(supplierMapper::toResponse)
                .toList();
    }

    /**
     * LEER un proveedor específico
     * @param businessId ID del negocio
     * @param supplierId ID del proveedor
     * @return DTO respuesta con el proveedor
     * @throws EntityNotFoundException si el proveedor no existe o no pertenece al negocio
     */
    @Transactional(readOnly = true)
    public SupplierResponse getSupplierById(Long businessId, Long supplierId) {
        Supplier supplier = supplierRepository.findByIdAndBusinessId(supplierId, businessId)
                .orElseThrow(() -> new EntityNotFoundException("Proveedor no encontrado"));
        
        return supplierMapper.toResponse(supplier);
    }

    /**
     * EDITAR un proveedor existente
     * @param businessId ID del negocio
     * @param supplierId ID del proveedor
     * @param request DTO con los datos actualizados
     * @return DTO respuesta con el proveedor actualizado
     * @throws EntityNotFoundException si el proveedor no existe o no pertenece al negocio
     */
    @Transactional
    public SupplierResponse updateSupplier(Long businessId, Long supplierId, SupplierRequest request) {
        // 1. Buscar el proveedor verificando que sea del negocio
        Supplier supplier = supplierRepository.findByIdAndBusinessId(supplierId, businessId)
                .orElseThrow(() -> new EntityNotFoundException("Proveedor no encontrado"));

        // 2. Actualizar solo los campos que vienen en el request
        supplierMapper.updateEntityFromRequest(request, supplier);

        // 3. Guardar cambios
        Supplier updatedSupplier = supplierRepository.save(supplier);

        return supplierMapper.toResponse(updatedSupplier);
    }

    /**
     * BORRAR un proveedor (borrado físico)
     * 
     * Nota: Se realiza un borrado físico. Idealmente, si hay gastos asociados,
     * se debería prevenir el borrado o usar borrado lógico.
     * Esto puede mejorarse en futuras iteraciones.
     * 
     * @param businessId ID del negocio
     * @param supplierId ID del proveedor
     * @throws EntityNotFoundException si el proveedor no existe o no pertenece al negocio
     */
    @Transactional
    public void deleteSupplier(Long businessId, Long supplierId) {
        Supplier supplier = supplierRepository.findByIdAndBusinessId(supplierId, businessId)
                .orElseThrow(() -> new EntityNotFoundException("Proveedor no encontrado"));
        
        supplierRepository.delete(supplier);
    }

    /**
     * BUSCAR proveedores por nombre (para autocomplete)
     * @param businessId ID del negocio
     * @param name Nombre o parte del nombre a buscar
     * @return Lista de DTOs respuesta con los proveedores que coinciden
     */
    @Transactional(readOnly = true)
    public List<SupplierResponse> searchSuppliersByName(Long businessId, String name) {
        List<Supplier> suppliers = supplierRepository.findByBusinessIdAndNameContainingIgnoreCase(businessId, name);
        
        return suppliers.stream()
                .map(supplierMapper::toResponse)
                .toList();
    }
}
