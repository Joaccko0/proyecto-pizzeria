package com.pizzeria.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pizzeria.backend.dto.product.ProductRequest;
import com.pizzeria.backend.dto.product.ProductResponse;
import com.pizzeria.backend.mapper.ProductMapper;
import com.pizzeria.backend.model.Product;
import com.pizzeria.backend.repository.ProductRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor // Lombok crea el constructor con los "final" (Inyección de dependencias)
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductMapper productMapper;

    // --- CREAR ---
    @Transactional // Asegura que se guarde todo o nada
    public ProductResponse createProduct(Long businessId, ProductRequest request) {
        // 1. Convertir DTO a Entidad
        Product product = productMapper.toEntity(request);
        
        // 2. Asignar el negocio
        product.setBusinessId(businessId);
        
        // 3. Guardar en BD
        Product savedProduct = productRepository.save(product);
        
        // 4. Devolver DTO
        return productMapper.toResponse(savedProduct);
    }

    // --- LEER TODOS (De mi negocio) ---
    @Transactional(readOnly = true) // Optimiza el rendimiento para lectura
    public List<ProductResponse> getAllProducts(Long businessId) {
        List<Product> products = productRepository.findByBusinessId(businessId);
        
        // Convertir lista de Entidades a lista de DTOs
        return products.stream()
                .map(productMapper::toResponse)
                .toList();
    }

    // --- EDITAR ---
    @Transactional
    public ProductResponse updateProduct(Long businessId, Long productId, ProductRequest request) {
        // 1. Buscar el producto verificando que sea de MI negocio
        Product product = productRepository.findByIdAndBusinessId(productId, businessId)
                .orElseThrow(() -> new EntityNotFoundException("Producto no encontrado"));

        // 2. Actualizar solo los campos que vienen en el request
        productMapper.updateEntityFromRequest(request, product);

        // 3. Guardar cambios
        Product updatedProduct = productRepository.save(product);

        return productMapper.toResponse(updatedProduct);
    }
    
}
