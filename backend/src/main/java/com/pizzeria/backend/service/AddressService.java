package com.pizzeria.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pizzeria.backend.dto.customer.AddressRequest;
import com.pizzeria.backend.dto.customer.DetailedAddressResponse;
import com.pizzeria.backend.mapper.AddressMapper;
import com.pizzeria.backend.model.Address;
import com.pizzeria.backend.model.Customer;
import com.pizzeria.backend.repository.AddressRepository;
import com.pizzeria.backend.repository.CustomerRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AddressService {

    private final AddressRepository addressRepository;
    private final CustomerRepository customerRepository;
    private final AddressMapper addressMapper;

    // --- CREAR DIRECCIÓN PARA UN CLIENTE ---
    @Transactional
    public DetailedAddressResponse createAddress(Long businessId, Long customerId, AddressRequest request) {
        // 1. Verificar que el cliente existe y pertenece al negocio
        Customer customer = customerRepository.findByIdAndBusinessId(customerId, businessId)
                .orElseThrow(() -> new EntityNotFoundException("Cliente no encontrado"));

        // 2. Convertir DTO a Entidad
        Address address = addressMapper.toEntity(request);
        
        // 3. Asignar el cliente
        address.setCustomer(customer);
        
        // 4. Guardar en BD
        Address savedAddress = addressRepository.save(address);
        
        // 5. Devolver DTO
        return addressMapper.toResponse(savedAddress);
    }

    // --- LEER TODAS LAS DIRECCIONES DE UN CLIENTE ---
    @Transactional(readOnly = true)
    public List<DetailedAddressResponse> getAddressesByCustomer(Long businessId, Long customerId) {
        // Verificar que el cliente existe y pertenece al negocio
        customerRepository.findByIdAndBusinessId(customerId, businessId)
                .orElseThrow(() -> new EntityNotFoundException("Cliente no encontrado"));

        List<Address> addresses = addressRepository.findByCustomer_IdAndCustomer_BusinessId(customerId, businessId);
        
        return addresses.stream()
                .map(addressMapper::toResponse)
                .toList();
    }

    // --- LEER UNA DIRECCIÓN ---
    @Transactional(readOnly = true)
    public DetailedAddressResponse getAddressById(Long businessId, Long customerId, Long addressId) {
        // Verificar que el cliente existe y pertenece al negocio
        customerRepository.findByIdAndBusinessId(customerId, businessId)
                .orElseThrow(() -> new EntityNotFoundException("Cliente no encontrado"));

        Address address = addressRepository.findByIdAndCustomer_BusinessId(addressId, businessId)
                .orElseThrow(() -> new EntityNotFoundException("Dirección no encontrada"));
        
        // Verificar que la dirección pertenece al cliente especificado
        if (!address.getCustomer().getId().equals(customerId)) {
            throw new EntityNotFoundException("La dirección no pertenece al cliente especificado");
        }
        
        return addressMapper.toResponse(address);
    }

    // --- EDITAR DIRECCIÓN ---
    @Transactional
    public DetailedAddressResponse updateAddress(Long businessId, Long customerId, Long addressId, AddressRequest request) {
        // Verificar que el cliente existe y pertenece al negocio
        customerRepository.findByIdAndBusinessId(customerId, businessId)
                .orElseThrow(() -> new EntityNotFoundException("Cliente no encontrado"));

        // Buscar la dirección
        Address address = addressRepository.findByIdAndCustomer_BusinessId(addressId, businessId)
                .orElseThrow(() -> new EntityNotFoundException("Dirección no encontrada"));
        
        // Verificar que la dirección pertenece al cliente especificado
        if (!address.getCustomer().getId().equals(customerId)) {
            throw new EntityNotFoundException("La dirección no pertenece al cliente especificado");
        }

        // Actualizar campos
        addressMapper.updateEntityFromRequest(request, address);

        // Guardar cambios
        Address updatedAddress = addressRepository.save(address);

        return addressMapper.toResponse(updatedAddress);
    }
    
    // --- ELIMINAR DIRECCIÓN ---
    @Transactional
    public void deleteAddress(Long businessId, Long customerId, Long addressId) {
        // Verificar que el cliente existe y pertenece al negocio
        customerRepository.findByIdAndBusinessId(customerId, businessId)
                .orElseThrow(() -> new EntityNotFoundException("Cliente no encontrado"));

        // Buscar la dirección
        Address address = addressRepository.findByIdAndCustomer_BusinessId(addressId, businessId)
                .orElseThrow(() -> new EntityNotFoundException("Dirección no encontrada"));
        
        // Verificar que la dirección pertenece al cliente especificado
        if (!address.getCustomer().getId().equals(customerId)) {
            throw new EntityNotFoundException("La dirección no pertenece al cliente especificado");
        }
        
        // Eliminación física
        addressRepository.delete(address);
    }
}
