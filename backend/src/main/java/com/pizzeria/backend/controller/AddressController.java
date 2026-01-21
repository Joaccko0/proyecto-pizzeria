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

import com.pizzeria.backend.dto.customer.AddressRequest;
import com.pizzeria.backend.dto.customer.DetailedAddressResponse;
import com.pizzeria.backend.service.AddressService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/customers/{customerId}/addresses")
@RequiredArgsConstructor
public class AddressController {

    private final AddressService addressService;

    // --- CREAR DIRECCIÓN PARA UN CLIENTE ---
    // POST /api/customers/5/addresses?businessId=1
    @PostMapping
    public ResponseEntity<DetailedAddressResponse> create(
            @PathVariable Long customerId,
            @RequestParam Long businessId,
            @RequestBody @Valid AddressRequest request
    ) {
        DetailedAddressResponse response = addressService.createAddress(businessId, customerId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // --- LEER TODAS LAS DIRECCIONES DE UN CLIENTE ---
    // GET /api/customers/5/addresses?businessId=1
    @GetMapping
    public ResponseEntity<List<DetailedAddressResponse>> getAll(
            @PathVariable Long customerId,
            @RequestParam Long businessId
    ) {
        List<DetailedAddressResponse> addresses = addressService.getAddressesByCustomer(businessId, customerId);
        return ResponseEntity.ok(addresses);
    }

    // --- LEER UNA DIRECCIÓN ---
    // GET /api/customers/5/addresses/3?businessId=1
    @GetMapping("/{addressId}")
    public ResponseEntity<DetailedAddressResponse> getById(
            @PathVariable Long customerId,
            @PathVariable Long addressId,
            @RequestParam Long businessId
    ) {
        DetailedAddressResponse response = addressService.getAddressById(businessId, customerId, addressId);
        return ResponseEntity.ok(response);
    }

    // --- EDITAR DIRECCIÓN ---
    // PUT /api/customers/5/addresses/3?businessId=1
    @PutMapping("/{addressId}")
    public ResponseEntity<DetailedAddressResponse> update(
            @PathVariable Long customerId,
            @PathVariable Long addressId,
            @RequestParam Long businessId,
            @RequestBody @Valid AddressRequest request
    ) {
        DetailedAddressResponse response = addressService.updateAddress(businessId, customerId, addressId, request);
        return ResponseEntity.ok(response);
    }

    // --- ELIMINAR DIRECCIÓN ---
    // DELETE /api/customers/5/addresses/3?businessId=1
    @DeleteMapping("/{addressId}")
    public ResponseEntity<Void> delete(
            @PathVariable Long customerId,
            @PathVariable Long addressId,
            @RequestParam Long businessId
    ) {
        addressService.deleteAddress(businessId, customerId, addressId);
        return ResponseEntity.noContent().build();
    }
}
