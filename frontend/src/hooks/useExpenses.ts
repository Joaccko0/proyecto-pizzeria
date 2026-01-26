import { useState, useEffect } from 'react';
import { ExpenseService } from '../services/expense.service';
import type { Expense, ExpenseRequest } from '../types/expense.types';
import { toast } from 'sonner';

/**
 * Hook personalizado para gestión de gastos
 * Encapsula toda la lógica CRUD y estado
 */
export function useExpenses(businessId: number | null) {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Cargar gastos del negocio actual
    const loadExpenses = async () => {
        if (!businessId) return;
        
        setIsLoading(true);
        setError(null);
        
        try {
            const data = await ExpenseService.getExpenses(businessId);
            setExpenses(data);
        } catch (err) {
            const message = 'Error al cargar los gastos';
            setError(message);
            toast.error(message);
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    // Crear nuevo gasto
    const createExpense = async (expenseData: ExpenseRequest): Promise<boolean> => {
        if (!businessId) return false;
        
        try {
            await ExpenseService.createExpense(businessId, expenseData);
            toast.success('Gasto registrado exitosamente');
            await loadExpenses();
            return true;
        } catch (err) {
            toast.error('Error al registrar el gasto');
            console.error(err);
            return false;
        }
    };

    // Editar gasto existente
    const updateExpense = async (expenseId: number, expenseData: ExpenseRequest): Promise<boolean> => {
        if (!businessId) return false;
        
        try {
            await ExpenseService.updateExpense(businessId, expenseId, expenseData);
            toast.success('Gasto actualizado exitosamente');
            await loadExpenses();
            return true;
        } catch (err) {
            toast.error('Error al actualizar el gasto');
            console.error(err);
            return false;
        }
    };

    // Eliminar gasto
    const deleteExpense = async (expenseId: number): Promise<boolean> => {
        if (!businessId) return false;
        
        try {
            await ExpenseService.deleteExpense(businessId, expenseId);
            toast.success('Gasto eliminado correctamente');
            await loadExpenses();
            return true;
        } catch (err) {
            toast.error('Error al eliminar el gasto');
            console.error(err);
            return false;
        }
    };

    // Cargar automáticamente cuando cambia el businessId
    useEffect(() => {
        loadExpenses();
    }, [businessId]);

    return {
        expenses,
        isLoading,
        error,
        loadExpenses,
        createExpense,
        updateExpense,
        deleteExpense
    };
}
