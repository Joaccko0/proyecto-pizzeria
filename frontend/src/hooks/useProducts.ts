import { useState, useEffect } from 'react';
import { InventoryService } from '../services/inventory.service';
import type { Product, ProductRequest } from '../types/inventory.types';
import { toast } from 'sonner';

/**
 * Hook personalizado para gestión de productos
 * Encapsula toda la lógica CRUD y estado
 */
export function useProducts(businessId: number | null) {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Cargar productos del negocio actual
    const loadProducts = async () => {
        if (!businessId) return;
        
        setIsLoading(true);
        setError(null);
        
        try {
            const data = await InventoryService.getProducts(businessId);
            setProducts(data);
        } catch (err) {
            const message = 'Error al cargar los productos';
            setError(message);
            toast.error(message);
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    // Crear nuevo producto
    const createProduct = async (productData: ProductRequest): Promise<boolean> => {
        if (!businessId) return false;
        
        try {
            await InventoryService.createProduct(businessId, productData);
            toast.success('Producto creado exitosamente');
            await loadProducts();
            return true;
        } catch (err) {
            toast.error('Error al crear el producto');
            console.error(err);
            return false;
        }
    };

    // Editar producto existente
    const updateProduct = async (productId: number, productData: ProductRequest): Promise<boolean> => {
        if (!businessId) return false;
        
        try {
            await InventoryService.updateProduct(businessId, productId, productData);
            toast.success('Producto actualizado exitosamente');
            await loadProducts();
            return true;
        } catch (err) {
            toast.error('Error al actualizar el producto');
            console.error(err);
            return false;
        }
    };

    // Eliminar producto
    const deleteProduct = async (productId: number): Promise<boolean> => {
        if (!businessId) return false;
        
        try {
            await InventoryService.deleteProduct(businessId, productId);
            toast.success('Producto eliminado correctamente');
            await loadProducts();
            return true;
        } catch (err) {
            toast.error('Error al eliminar el producto');
            console.error(err);
            return false;
        }
    };

    // Cargar automáticamente cuando cambia el businessId
    useEffect(() => {
        loadProducts();
    }, [businessId]);

    return {
        products,
        isLoading,
        error,
        loadProducts,
        createProduct,
        updateProduct,
        deleteProduct
    };
}
