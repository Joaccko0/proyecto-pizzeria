package com.pizzeria.backend.controller;

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

import com.pizzeria.backend.dto.supplier.SupplierRequest;
import com.pizzeria.backend.dto.supplier.SupplierResponse;
import com.pizzeria.backend.service.SupplierService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

/**
 * Controlador para gestionar Proveedores (Suppliers)
 * 
 * Endpoints:
 *  POST   /api/suppliers              - Crear proveedor
 *  GET    /api/suppliers              - Listar proveedores
 *  GET    /api/suppliers/{id}         - Obtener proveedor específico
 *  PUT    /api/suppliers/{id}         - Editar proveedor
 *  DELETE /api/suppliers/{id}         - Borrar proveedor
 *  GET    /api/suppliers/search?name  - Buscar por nombre
 */
@RestController
@RequestMapping("/api/suppliers")
@RequiredArgsConstructor
public class SupplierController {

    private final SupplierService supplierService;

    /**
     * CREAR un nuevo proveedor
     * POST /api/suppliers?businessId=1
     */
    @PostMapping
    public ResponseEntity<SupplierResponse> create(
            @RequestParam Long businessId,
            @RequestBody @Valid SupplierRequest request
    ) {
        SupplierResponse response = supplierService.createSupplier(businessId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * LEER todos los proveedores de un negocio
     * GET /api/suppliers?businessId=1
     */
    @GetMapping
    public ResponseEntity<List<SupplierResponse>> getAll(
            @RequestParam Long businessId
    ) {
        List<SupplierResponse> suppliers = supplierService.getAllSuppliers(businessId);
        return ResponseEntity.ok(suppliers);
    }

    /**
     * LEER un proveedor específico
     * GET /api/suppliers/5?businessId=1
     */
    @GetMapping("/{id}")
    public ResponseEntity<SupplierResponse> getById(
            @PathVariable Long id,
            @RequestParam Long businessId
    ) {
        SupplierResponse supplier = supplierService.getSupplierById(businessId, id);
        return ResponseEntity.ok(supplier);
    }

    /**
     * EDITAR un proveedor
     * PUT /api/suppliers/5?businessId=1
     */
    @PutMapping("/{id}")
    public ResponseEntity<SupplierResponse> update(
            @PathVariable Long id,
            @RequestParam Long businessId,
            @RequestBody @Valid SupplierRequest request
    ) {
        SupplierResponse response = supplierService.updateSupplier(businessId, id, request);
        return ResponseEntity.ok(response);
    }

    /**
     * BORRAR un proveedor
     * DELETE /api/suppliers/5?businessId=1
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id,
            @RequestParam Long businessId
    ) {
        supplierService.deleteSupplier(businessId, id);
        return ResponseEntity.noContent().build();
    }

    /**
     * BUSCAR proveedores por nombre
     * GET /api/suppliers/search?businessId=1&name=Distribuidor
     */
    @GetMapping("/search")
    public ResponseEntity<List<SupplierResponse>> search(
            @RequestParam Long businessId,
            @RequestParam String name
    ) {
        List<SupplierResponse> suppliers = supplierService.searchSuppliersByName(businessId, name);
        return ResponseEntity.ok(suppliers);
    }
}
