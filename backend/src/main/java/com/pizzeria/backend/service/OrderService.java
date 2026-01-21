package com.pizzeria.backend.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pizzeria.backend.dto.order.CreateOrderRequest;
import com.pizzeria.backend.dto.order.OrderResponse;
import com.pizzeria.backend.dto.order.UpdateOrderStatusRequest;
import com.pizzeria.backend.mapper.OrderMapper;
import com.pizzeria.backend.model.Combo;
import com.pizzeria.backend.model.Customer;
import com.pizzeria.backend.model.Order;
import com.pizzeria.backend.model.OrderItem;
import com.pizzeria.backend.model.Product;
import com.pizzeria.backend.model.enums.OrderStatus;
import com.pizzeria.backend.model.enums.PaymentStatus;
import com.pizzeria.backend.repository.ComboRepository;
import com.pizzeria.backend.repository.CustomerRepository;
import com.pizzeria.backend.repository.OrderRepository;
import com.pizzeria.backend.repository.ProductRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final ComboRepository comboRepository;
    private final CustomerRepository customerRepository;
    private final OrderMapper orderMapper;

    @Transactional
    public OrderResponse createOrder(Long businessId, CreateOrderRequest request) {

        // Si no mandan estado, asumimos PENDING
        PaymentStatus statusPago = (request.paymentStatus() != null) 
                                   ? request.paymentStatus() 
                                   : PaymentStatus.PENDING;
        
        // 1. Inicializar Pedido
        Order order = Order.builder()
                .businessId(businessId)
                .orderStatus(OrderStatus.PENDING)
                .paymentStatus(statusPago)
                .paymentMethod(request.paymentMethod())
                .deliveryMethod(request.deliveryMethod())
                .createdAt(LocalDateTime.now())
                .items(new ArrayList<>())
                .build();

        // 2. Asignar Cliente (Si existe)
        if (request.customerId() != null) {
            Customer customer = customerRepository.findByIdAndBusinessId(request.customerId(), businessId)
                    .orElseThrow(() -> new EntityNotFoundException("Cliente no encontrado"));
            order.setCustomer(customer);
        }

        // 3. Procesar Items y Calcular Total
        BigDecimal totalAmount = BigDecimal.ZERO;

        for (var itemReq : request.items()) {
            // Validación XOR (Producto O Combo)
            if (!itemReq.isValid()) {
                throw new IllegalArgumentException("Cada ítem debe ser un Producto O un Combo (no ambos, no ninguno)");
            }

            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setQuantity(itemReq.quantity());

            BigDecimal currentPrice;

            if (itemReq.productId() != null) {
                // Es un Producto
                Product p = productRepository.findByIdAndBusinessId(itemReq.productId(), businessId)
                        .orElseThrow(() -> new EntityNotFoundException("Producto ID " + itemReq.productId() + " no encontrado"));
                
                item.setProduct(p);
                currentPrice = p.getPrice(); // Tomamos el precio ACTUAL
            } else {
                // Es un Combo
                Combo c = comboRepository.findByIdAndBusinessId(itemReq.comboId(), businessId)
                        .orElseThrow(() -> new EntityNotFoundException("Combo ID " + itemReq.comboId() + " no encontrado"));
                
                item.setCombo(c);
                currentPrice = c.getPrice(); // Tomamos el precio ACTUAL
            }

            // 4. CONGELAR PRECIOS
            item.setUnitPrice(currentPrice);
            
            // Calcular Subtotal
            BigDecimal subtotal = currentPrice.multiply(BigDecimal.valueOf(itemReq.quantity()));
            item.setSubtotal(subtotal);

            // Sumar al total general
            totalAmount = totalAmount.add(subtotal);

            // Agregar a la lista del pedido
            order.getItems().add(item);
        }

        // 5. Finalizar y Guardar
        order.setTotal(totalAmount);
        Order savedOrder = orderRepository.save(order);

        return orderMapper.toResponse(savedOrder);
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getAllOrders(Long businessId) {
        return orderRepository.findByBusinessIdOrderByCreatedAtDesc(businessId).stream()
                .map(orderMapper::toResponse)
                .toList();
    }

    @Transactional
    public OrderResponse updateOrderStatus(Long businessId, Long orderId, UpdateOrderStatusRequest request) {
        Order order = orderRepository.findByIdAndBusinessId(orderId, businessId)
                .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("Pedido no encontrado"));
        
        order.setOrderStatus(request.orderStatus());
        // Si vienen cambios en paymentStatus, aplicarlos también
        if (request.paymentStatus() != null) {
            order.setPaymentStatus(request.paymentStatus());
        }

        orderRepository.save(order);

        return orderMapper.toResponse(order);
    }

    @Transactional
    public OrderResponse updateOrderDetails(Long businessId, Long orderId, 
            com.pizzeria.backend.dto.order.UpdateOrderDetailsRequest request) {
        Order order = orderRepository.findByIdAndBusinessId(orderId, businessId)
                .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("Pedido no encontrado"));
        
        // Actualizar solo los campos que vengan
        if (request.paymentStatus() != null) {
            order.setPaymentStatus(request.paymentStatus());
        }
        if (request.paymentMethod() != null) {
            order.setPaymentMethod(request.paymentMethod());
        }
        if (request.deliveryMethod() != null) {
            order.setDeliveryMethod(request.deliveryMethod());
        }

        orderRepository.save(order);

        return orderMapper.toResponse(order);
    }
}