import { useState, useEffect } from 'react';
import { SupplyService } from '../services/supply.service';
import type { Supply, SupplyRequest } from '../types/supply.types';
import { toast } from 'sonner';

/**
 * Hook personalizado para gestión de insumos
 * Encapsula toda la lógica CRUD y estado
 */
export function useSupplies(businessId: number | null) {
    const [supplies, setSupplies] = useState<Supply[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Cargar insumos del negocio actual
    const loadSupplies = async () => {
        if (!businessId) return;
        
        setIsLoading(true);
        setError(null);
        
        try {
            const data = await SupplyService.getSupplies(businessId);
            setSupplies(data);
        } catch (err) {
            const message = 'Error al cargar los insumos';
            setError(message);
            toast.error(message);
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    // Crear nuevo insumo
    const createSupply = async (supplyData: SupplyRequest): Promise<boolean> => {
        if (!businessId) return false;
        
        try {
            await SupplyService.createSupply(businessId, supplyData);
            toast.success('Insumo creado exitosamente');
            await loadSupplies();
            return true;
        } catch (err) {
            toast.error('Error al crear el insumo');
            console.error(err);
            return false;
        }
    };

    // Editar insumo existente
    const updateSupply = async (supplyId: number, supplyData: SupplyRequest): Promise<boolean> => {
        if (!businessId) return false;
        
        try {
            await SupplyService.updateSupply(businessId, supplyId, supplyData);
            toast.success('Insumo actualizado exitosamente');
            await loadSupplies();
            return true;
        } catch (err) {
            toast.error('Error al actualizar el insumo');
            console.error(err);
            return false;
        }
    };

    // Eliminar insumo
    const deleteSupply = async (supplyId: number): Promise<boolean> => {
        if (!businessId) return false;
        
        try {
            await SupplyService.deleteSupply(businessId, supplyId);
            toast.success('Insumo eliminado correctamente');
            await loadSupplies();
            return true;
        } catch (err) {
            toast.error('Error al eliminar el insumo');
            console.error(err);
            return false;
        }
    };

    // Cargar automáticamente cuando cambia el businessId
    useEffect(() => {
        loadSupplies();
    }, [businessId]);

    return {
        supplies,
        isLoading,
        error,
        loadSupplies,
        createSupply,
        updateSupply,
        deleteSupply
    };
}
