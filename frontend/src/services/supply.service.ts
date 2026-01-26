import client from '../api/client';
import type { Supply, SupplyRequest } from '../types/supply.types';
import { SupplyCategory } from '../types/supply.types';

/**
 * Servicio para gestionar Insumos/Partidas de Gasto
 * Comunica con el backend en /api/supplies
 */
export const SupplyService = {
    // Listar todos los insumos
    getSupplies: async (businessId: number) => {
        const response = await client.get<Supply[]>('/supplies', {
            params: { businessId }
        });
        return response.data;
    },

    // Obtener un insumo específico
    getSupplyById: async (businessId: number, supplyId: number) => {
        const response = await client.get<Supply>(`/supplies/${supplyId}`, {
            params: { businessId }
        });
        return response.data;
    },

    // Crear un insumo
    createSupply: async (businessId: number, data: SupplyRequest) => {
        const response = await client.post<Supply>('/supplies', data, {
            params: { businessId }
        });
        return response.data;
    },

    // Editar un insumo
    updateSupply: async (businessId: number, supplyId: number, data: SupplyRequest) => {
        const response = await client.put<Supply>(`/supplies/${supplyId}`, data, {
            params: { businessId }
        });
        return response.data;
    },

    // Eliminar un insumo
    deleteSupply: async (businessId: number, supplyId: number) => {
        await client.delete(`/supplies/${supplyId}`, {
            params: { businessId }
        });
    },

    // Obtener insumos por categoría
    getSuppliesByCategory: async (businessId: number, category: SupplyCategory) => {
        const response = await client.get<Supply[]>(`/supplies/category/${category}`, {
            params: { businessId }
        });
        return response.data;
    },

    // Buscar insumos por nombre
    searchSupplies: async (businessId: number, name: string) => {
        const response = await client.get<Supply[]>('/supplies/search', {
            params: { businessId, name }
        });
        return response.data;
    }
};
