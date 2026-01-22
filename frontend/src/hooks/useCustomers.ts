import { useState, useEffect } from 'react';
import { CustomerService } from '../services/customer.service';
import type { Customer, CustomerRequest } from '../types/customer.types';
import { toast } from 'sonner';

/**
 * Hook personalizado para gestión de clientes
 * Encapsula toda la lógica CRUD y estado
 */
export function useCustomers(businessId: number | null) {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Cargar clientes del negocio actual
    const loadCustomers = async () => {
        if (!businessId) return;
        
        setIsLoading(true);
        setError(null);
        
        try {
            const data = await CustomerService.getCustomers(businessId);
            setCustomers(data);
        } catch (err) {
            const message = 'Error al cargar los clientes';
            setError(message);
            toast.error(message);
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    // Crear nuevo cliente
    const createCustomer = async (customerData: CustomerRequest): Promise<boolean> => {
        if (!businessId) return false;
        
        try {
            await CustomerService.createCustomer(businessId, customerData);
            toast.success('Cliente creado exitosamente');
            await loadCustomers();
            return true;
        } catch (err) {
            toast.error('Error al crear el cliente');
            console.error(err);
            return false;
        }
    };

    // Editar cliente existente
    const updateCustomer = async (customerId: number, customerData: CustomerRequest): Promise<boolean> => {
        if (!businessId) return false;
        
        try {
            await CustomerService.updateCustomer(businessId, customerId, customerData);
            toast.success('Cliente actualizado exitosamente');
            await loadCustomers();
            return true;
        } catch (err) {
            toast.error('Error al actualizar el cliente');
            console.error(err);
            return false;
        }
    };

    // Eliminar cliente
    const deleteCustomer = async (customerId: number): Promise<boolean> => {
        if (!businessId) return false;
        
        try {
            await CustomerService.deleteCustomer(businessId, customerId);
            toast.success('Cliente eliminado correctamente');
            await loadCustomers();
            return true;
        } catch (err) {
            toast.error('Error al eliminar el cliente');
            console.error(err);
            return false;
        }
    };

    // Cargar automáticamente cuando cambia el businessId
    useEffect(() => {
        loadCustomers();
    }, [businessId]);

    return {
        customers,
        isLoading,
        error,
        loadCustomers,
        createCustomer,
        updateCustomer,
        deleteCustomer
    };
}
