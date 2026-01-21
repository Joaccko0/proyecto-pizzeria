package com.pizzeria.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pizzeria.backend.dto.customer.CustomerRequest;
import com.pizzeria.backend.dto.customer.CustomerResponse;
import com.pizzeria.backend.mapper.CustomerMapper;
import com.pizzeria.backend.model.Customer;
import com.pizzeria.backend.repository.CustomerRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final CustomerMapper customerMapper;

    // --- CREAR ---
    @Transactional
    public CustomerResponse createCustomer(Long businessId, CustomerRequest request) {
        // 1. Convertir DTO a Entidad
        Customer customer = customerMapper.toEntity(request);
        
        // 2. Asignar el negocio
        customer.setBusinessId(businessId);
        
        // 3. Guardar en BD
        Customer savedCustomer = customerRepository.save(customer);
        
        // 4. Devolver DTO
        return customerMapper.toResponse(savedCustomer);
    }

    // --- LEER TODOS (Activos) ---
    @Transactional(readOnly = true)
    public List<CustomerResponse> getAllCustomers(Long businessId) {
        List<Customer> customers = customerRepository.findByBusinessIdAndActiveTrue(businessId);
        
        return customers.stream()
                .map(customerMapper::toResponse)
                .toList();
    }

    // --- LEER UNO ---
    @Transactional(readOnly = true)
    public CustomerResponse getCustomerById(Long businessId, Long customerId) {
        Customer customer = customerRepository.findByIdAndBusinessId(customerId, businessId)
                .orElseThrow(() -> new EntityNotFoundException("Cliente no encontrado"));
        
        return customerMapper.toResponse(customer);
    }

    // --- EDITAR ---
    @Transactional
    public CustomerResponse updateCustomer(Long businessId, Long customerId, CustomerRequest request) {
        // 1. Buscar el cliente verificando que sea de MI negocio
        Customer customer = customerRepository.findByIdAndBusinessId(customerId, businessId)
                .orElseThrow(() -> new EntityNotFoundException("Cliente no encontrado"));

        // 2. Actualizar solo los campos que vienen en el request
        customerMapper.updateEntityFromRequest(request, customer);

        // 3. Guardar cambios
        Customer updatedCustomer = customerRepository.save(customer);

        return customerMapper.toResponse(updatedCustomer);
    }
    
    // --- ELIMINAR (Lógico) ---
    @Transactional
    public void deleteCustomer(Long businessId, Long customerId) {
        Customer customer = customerRepository.findByIdAndBusinessId(customerId, businessId)
                .orElseThrow(() -> new EntityNotFoundException("Cliente no encontrado"));
        
        // Eliminación lógica (mantiene datos para estadísticas)
        customer.setActive(false);
        customerRepository.save(customer);
    }
}
