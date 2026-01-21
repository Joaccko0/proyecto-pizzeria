package com.pizzeria.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pizzeria.backend.model.Address;

public interface AddressRepository extends JpaRepository<Address, Long> {

    Optional<Address> findByIdAndCustomer_BusinessId(Long id, Long businessId);

    List<Address> findByCustomer_IdAndCustomer_BusinessId(Long customerId, Long businessId);

    void deleteByIdAndCustomer_BusinessId(Long id, Long businessId);
}
