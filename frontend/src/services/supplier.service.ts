import client from '../api/client';
import type { Supplier, SupplierRequest } from '../types/supplier.types';

/**
 * Servicio para gestionar Proveedores
 * Comunica con el backend en /api/suppliers
 */
export const SupplierService = {
    // Listar todos los proveedores
    getSuppliers: async (businessId: number) => {
        const response = await client.get<Supplier[]>('/suppliers', {
            params: { businessId }
        });
        return response.data;
    },

    // Obtener un proveedor específico
    getSupplierById: async (businessId: number, supplierId: number) => {
        const response = await client.get<Supplier>(`/suppliers/${supplierId}`, {
            params: { businessId }
        });
        return response.data;
    },

    // Crear un proveedor
    createSupplier: async (businessId: number, data: SupplierRequest) => {
        const response = await client.post<Supplier>('/suppliers', data, {
            params: { businessId }
        });
        return response.data;
    },

    // Editar un proveedor
    updateSupplier: async (businessId: number, supplierId: number, data: SupplierRequest) => {
        const response = await client.put<Supplier>(`/suppliers/${supplierId}`, data, {
            params: { businessId }
        });
        return response.data;
    },

    // Eliminar un proveedor
    deleteSupplier: async (businessId: number, supplierId: number) => {
        await client.delete(`/suppliers/${supplierId}`, {
            params: { businessId }
        });
    },

    // Buscar proveedores por nombre
    searchSuppliers: async (businessId: number, name: string) => {
        const response = await client.get<Supplier[]>('/suppliers/search', {
            params: { businessId, name }
        });
        return response.data;
    }
};
