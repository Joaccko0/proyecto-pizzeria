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

import com.pizzeria.backend.dto.supply.SupplyRequest;
import com.pizzeria.backend.dto.supply.SupplyResponse;
import com.pizzeria.backend.model.enums.SupplyCategory;
import com.pizzeria.backend.service.SupplyService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

/**
 * Controlador para gestionar Insumos/Partidas de Gasto (Supplies)
 * 
 * Endpoints:
 *  POST   /api/supplies              - Crear insumo
 *  GET    /api/supplies              - Listar insumos
 *  GET    /api/supplies/{id}         - Obtener insumo específico
 *  PUT    /api/supplies/{id}         - Editar insumo
 *  DELETE /api/supplies/{id}         - Borrar insumo
 *  GET    /api/supplies/category     - Filtrar por categoría
 *  GET    /api/supplies/search?name  - Buscar por nombre
 */
@RestController
@RequestMapping("/api/supplies")
@RequiredArgsConstructor
public class SupplyController {

    private final SupplyService supplyService;

    /**
     * CREAR un nuevo insumo
     * POST /api/supplies?businessId=1
     */
    @PostMapping
    public ResponseEntity<SupplyResponse> create(
            @RequestParam Long businessId,
            @RequestBody @Valid SupplyRequest request
    ) {
        SupplyResponse response = supplyService.createSupply(businessId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * LEER todos los insumos de un negocio
     * GET /api/supplies?businessId=1
     */
    @GetMapping
    public ResponseEntity<List<SupplyResponse>> getAll(
            @RequestParam Long businessId
    ) {
        List<SupplyResponse> supplies = supplyService.getAllSupplies(businessId);
        return ResponseEntity.ok(supplies);
    }

    /**
     * LEER un insumo específico
     * GET /api/supplies/5?businessId=1
     */
    @GetMapping("/{id}")
    public ResponseEntity<SupplyResponse> getById(
            @PathVariable Long id,
            @RequestParam Long businessId
    ) {
        SupplyResponse supply = supplyService.getSupplyById(businessId, id);
        return ResponseEntity.ok(supply);
    }

    /**
     * EDITAR un insumo
     * PUT /api/supplies/5?businessId=1
     */
    @PutMapping("/{id}")
    public ResponseEntity<SupplyResponse> update(
            @PathVariable Long id,
            @RequestParam Long businessId,
            @RequestBody @Valid SupplyRequest request
    ) {
        SupplyResponse response = supplyService.updateSupply(businessId, id, request);
        return ResponseEntity.ok(response);
    }

    /**
     * BORRAR un insumo
     * DELETE /api/supplies/5?businessId=1
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id,
            @RequestParam Long businessId
    ) {
        supplyService.deleteSupply(businessId, id);
        return ResponseEntity.noContent().build();
    }

    /**
     * LEER insumos por categoría
     * GET /api/supplies/category?businessId=1&category=STOCK
     */
    @GetMapping("/category/{category}")
    public ResponseEntity<List<SupplyResponse>> getByCategory(
            @PathVariable SupplyCategory category,
            @RequestParam Long businessId
    ) {
        List<SupplyResponse> supplies = supplyService.getSuppliesByCategory(businessId, category);
        return ResponseEntity.ok(supplies);
    }

    /**
     * BUSCAR insumos por nombre
     * GET /api/supplies/search?businessId=1&name=Harina
     */
    @GetMapping("/search")
    public ResponseEntity<List<SupplyResponse>> search(
            @RequestParam Long businessId,
            @RequestParam String name
    ) {
        List<SupplyResponse> supplies = supplyService.searchSuppliesByName(businessId, name);
        return ResponseEntity.ok(supplies);
    }
}
