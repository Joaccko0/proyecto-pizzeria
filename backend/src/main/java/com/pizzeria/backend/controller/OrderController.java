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

import com.pizzeria.backend.dto.order.CreateOrderRequest;
import com.pizzeria.backend.dto.order.OrderResponse;
import com.pizzeria.backend.dto.order.UpdateOrderStatusRequest;
import com.pizzeria.backend.service.OrderService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<OrderResponse> create(
            @RequestParam Long businessId,
            @RequestBody @Valid CreateOrderRequest request
    ) {
        OrderResponse response = orderService.createOrder(businessId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<OrderResponse>> getAll(
            @RequestParam Long businessId
    ) {
        return ResponseEntity.ok(orderService.getAllOrders(businessId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<OrderResponse> updateStatus(
            @PathVariable Long id,
            @RequestParam Long businessId,
            @RequestBody @Valid UpdateOrderStatusRequest request
    ) {
        OrderResponse response = orderService.updateOrderStatus(businessId, id, request);
        return ResponseEntity.ok(response);
    }
}