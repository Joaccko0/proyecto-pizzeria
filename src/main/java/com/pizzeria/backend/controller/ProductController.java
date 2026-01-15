package com.pizzeria.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.pizzeria.backend.dto.product.ProductRequest;
import com.pizzeria.backend.dto.product.ProductResponse;
import com.pizzeria.backend.service.ProductService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    // --- CREAR ---
    // POST /api/products?businessId=1
    @PostMapping
    public ResponseEntity<ProductResponse> create(
            @RequestParam Long businessId, // Temporal: luego esto vendrá del Token de seguridad
            @RequestBody @Valid ProductRequest request // @Valid activa las anotaciones del DTO (@NotNull, @Positive)
    ) {
        ProductResponse response = productService.createProduct(businessId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // --- LEER TODOS ---
    // GET /api/products?businessId=1
    @GetMapping
    public ResponseEntity<List<ProductResponse>> getAll(
            @RequestParam Long businessId
    ) {
        List<ProductResponse> products = productService.getAllProducts(businessId);
        return ResponseEntity.ok(products);
    }

    // --- EDITAR ---
    // PUT /api/products/5?businessId=1
    @PutMapping("/{id}")
    public ResponseEntity<ProductResponse> update(
            @PathVariable Long id,
            @RequestParam Long businessId,
            @RequestBody @Valid ProductRequest request
    ) {
        ProductResponse response = productService.updateProduct(businessId, id, request);
        return ResponseEntity.ok(response);
    }
}
