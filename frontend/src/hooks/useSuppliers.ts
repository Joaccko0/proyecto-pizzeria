import { useState, useEffect } from 'react';
import { SupplierService } from '../services/supplier.service';
import type { Supplier, SupplierRequest } from '../types/supplier.types';
import { toast } from 'sonner';

/**
 * Hook personalizado para gestión de proveedores
 * Encapsula toda la lógica CRUD y estado
 */
export function useSuppliers(businessId: number | null) {
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Cargar proveedores del negocio actual
    const loadSuppliers = async () => {
        if (!businessId) return;
        
        setIsLoading(true);
        setError(null);
        
        try {
            const data = await SupplierService.getSuppliers(businessId);
            setSuppliers(data);
        } catch (err) {
            const message = 'Error al cargar los proveedores';
            setError(message);
            toast.error(message);
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    // Crear nuevo proveedor
    const createSupplier = async (supplierData: SupplierRequest): Promise<boolean> => {
        if (!businessId) return false;
        
        try {
            await SupplierService.createSupplier(businessId, supplierData);
            toast.success('Proveedor creado exitosamente');
            await loadSuppliers();
            return true;
        } catch (err) {
            toast.error('Error al crear el proveedor');
            console.error(err);
            return false;
        }
    };

    // Editar proveedor existente
    const updateSupplier = async (supplierId: number, supplierData: SupplierRequest): Promise<boolean> => {
        if (!businessId) return false;
        
        try {
            await SupplierService.updateSupplier(businessId, supplierId, supplierData);
            toast.success('Proveedor actualizado exitosamente');
            await loadSuppliers();
            return true;
        } catch (err) {
            toast.error('Error al actualizar el proveedor');
            console.error(err);
            return false;
        }
    };

    // Eliminar proveedor
    const deleteSupplier = async (supplierId: number): Promise<boolean> => {
        if (!businessId) return false;
        
        try {
            await SupplierService.deleteSupplier(businessId, supplierId);
            toast.success('Proveedor eliminado correctamente');
            await loadSuppliers();
            return true;
        } catch (err) {
            toast.error('Error al eliminar el proveedor');
            console.error(err);
            return false;
        }
    };

    // Cargar automáticamente cuando cambia el businessId
    useEffect(() => {
        loadSuppliers();
    }, [businessId]);

    return {
        suppliers,
        isLoading,
        error,
        loadSuppliers,
        createSupplier,
        updateSupplier,
        deleteSupplier
    };
}
