import client from '../api/client';
import type { Product, ProductRequest, Combo, ComboRequest } from '../types/inventory.types';

export const InventoryService = {
    // --- PRODUCTOS ---
    getProducts: async (businessId: number) => {
        const response = await client.get<Product[]>('/products', {
            params: { businessId }
        });
        return response.data;
    },

    createProduct: async (businessId: number, data: ProductRequest) => {
        const response = await client.post<Product>('/products', data, {
            params: { businessId }
        });
        return response.data;
    },

    updateProduct: async (businessId: number, productId: number, data: ProductRequest) => {
        const response = await client.put<Product>(`/products/${productId}`, data, {
            params: { businessId }
        });
        return response.data;
    },

    deleteProduct: async (businessId: number, productId: number) => {
        await client.delete(`/products/${productId}`, {
            params: { businessId }
        });
    },

    // --- COMBOS ---
    getCombos: async (businessId: number) => {
        const response = await client.get<Combo[]>('/combos', {
            params: { businessId }
        });
        return response.data;
    },

    createCombo: async (businessId: number, data: ComboRequest) => {
        const response = await client.post<Combo>('/combos', data, {
            params: { businessId }
        });
        return response.data;
    },

    updateCombo: async (businessId: number, comboId: number, data: ComboRequest) => {
        const response = await client.put<Combo>(`/combos/${comboId}`, data, {
            params: { businessId }
        });
        return response.data;
    },

    deleteCombo: async (businessId: number, comboId: number) => {
        await client.delete(`/combos/${comboId}`, {
            params: { businessId }
        });
    }
};