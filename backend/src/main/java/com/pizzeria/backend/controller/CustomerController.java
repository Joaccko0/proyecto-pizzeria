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

import com.pizzeria.backend.dto.customer.CustomerRequest;
import com.pizzeria.backend.dto.customer.CustomerResponse;
import com.pizzeria.backend.service.CustomerService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;

    // --- CREAR CLIENTE ---
    // POST /api/customers?businessId=1
    @PostMapping
    public ResponseEntity<CustomerResponse> create(
            @RequestParam Long businessId,
            @RequestBody @Valid CustomerRequest request
    ) {
        CustomerResponse response = customerService.createCustomer(businessId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // --- LEER TODOS LOS CLIENTES ---
    // GET /api/customers?businessId=1
    @GetMapping
    public ResponseEntity<List<CustomerResponse>> getAll(
            @RequestParam Long businessId
    ) {
        List<CustomerResponse> customers = customerService.getAllCustomers(businessId);
        return ResponseEntity.ok(customers);
    }

    // --- LEER UN CLIENTE ---
    // GET /api/customers/5?businessId=1
    @GetMapping("/{id}")
    public ResponseEntity<CustomerResponse> getById(
            @PathVariable Long id,
            @RequestParam Long businessId
    ) {
        CustomerResponse response = customerService.getCustomerById(businessId, id);
        return ResponseEntity.ok(response);
    }

    // --- EDITAR CLIENTE ---
    // PUT /api/customers/5?businessId=1
    @PutMapping("/{id}")
    public ResponseEntity<CustomerResponse> update(
            @PathVariable Long id,
            @RequestParam Long businessId,
            @RequestBody @Valid CustomerRequest request
    ) {
        CustomerResponse response = customerService.updateCustomer(businessId, id, request);
        return ResponseEntity.ok(response);
    }

    // --- ELIMINAR CLIENTE ---
    // DELETE /api/customers/5?businessId=1
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id,
            @RequestParam Long businessId
    ) {
        customerService.deleteCustomer(businessId, id);
        return ResponseEntity.noContent().build();
    }
}
