import client from '../api/client';
import type { Expense, ExpenseRequest } from '../types/expense.types';

/**
 * Servicio para gestionar Gastos/Facturas
 * Comunica con el backend en /api/expenses
 */
export const ExpenseService = {
    // Listar todos los gastos
    getExpenses: async (businessId: number) => {
        const response = await client.get<Expense[]>('/expenses', {
            params: { businessId }
        });
        return response.data;
    },

    // Obtener un gasto específico con sus items
    getExpenseById: async (businessId: number, expenseId: number) => {
        const response = await client.get<Expense>(`/expenses/${expenseId}`, {
            params: { businessId }
        });
        return response.data;
    },

    // Crear un gasto con sus items
    createExpense: async (businessId: number, data: ExpenseRequest) => {
        const response = await client.post<Expense>('/expenses', data, {
            params: { businessId }
        });
        return response.data;
    },

    // Editar un gasto (reemplaza todos sus items)
    updateExpense: async (businessId: number, expenseId: number, data: ExpenseRequest) => {
        const response = await client.put<Expense>(`/expenses/${expenseId}`, data, {
            params: { businessId }
        });
        return response.data;
    },

    // Eliminar un gasto
    deleteExpense: async (businessId: number, expenseId: number) => {
        await client.delete(`/expenses/${expenseId}`, {
            params: { businessId }
        });
    },

    // Obtener gastos en un rango de fechas
    getExpensesByDateRange: async (businessId: number, startDate: string, endDate: string) => {
        const response = await client.get<Expense[]>('/expenses/date-range', {
            params: { businessId, startDate, endDate }
        });
        return response.data;
    },

    // Obtener gastos de un proveedor específico
    getExpensesBySupplier: async (businessId: number, supplierId: number) => {
        const response = await client.get<Expense[]>(`/expenses/supplier/${supplierId}`, {
            params: { businessId }
        });
        return response.data;
    }
};
