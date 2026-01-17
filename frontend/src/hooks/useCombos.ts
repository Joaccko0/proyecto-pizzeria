import { useState, useEffect } from 'react';
import { InventoryService } from '../services/inventory.service';
import type { Combo, ComboRequest } from '../types/inventory.types';
import { toast } from 'sonner';

/**
 * Hook personalizado para gestión de combos
 * Encapsula toda la lógica CRUD de combos
 */
export function useCombos(businessId: number | null) {
    const [combos, setCombos] = useState<Combo[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Cargar combos del negocio actual
    const loadCombos = async () => {
        if (!businessId) return;
        
        setIsLoading(true);
        setError(null);
        
        try {
            const data = await InventoryService.getCombos(businessId);
            setCombos(data);
        } catch (err) {
            const message = 'Error al cargar los combos';
            setError(message);
            toast.error(message);
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    // Crear nuevo combo
    const createCombo = async (comboData: ComboRequest): Promise<boolean> => {
        if (!businessId) return false;
        
        try {
            await InventoryService.createCombo(businessId, comboData);
            toast.success('Combo creado exitosamente');
            await loadCombos();
            return true;
        } catch (err) {
            toast.error('Error al crear el combo');
            console.error(err);
            return false;
        }
    };

    // Editar combo existente
    const updateCombo = async (comboId: number, comboData: ComboRequest): Promise<boolean> => {
        if (!businessId) return false;
        
        try {
            await InventoryService.updateCombo(businessId, comboId, comboData);
            toast.success('Combo actualizado exitosamente');
            await loadCombos();
            return true;
        } catch (err) {
            toast.error('Error al actualizar el combo');
            console.error(err);
            return false;
        }
    };

    // Eliminar combo
    const deleteCombo = async (comboId: number): Promise<boolean> => {
        if (!businessId) return false;
        
        try {
            await InventoryService.deleteCombo(businessId, comboId);
            toast.success('Combo eliminado correctamente');
            await loadCombos();
            return true;
        } catch (err) {
            toast.error('Error al eliminar el combo');
            console.error(err);
            return false;
        }
    };

    // Cargar automáticamente cuando cambia el businessId
    useEffect(() => {
        loadCombos();
    }, [businessId]);

    return {
        combos,
        isLoading,
        error,
        loadCombos,
        createCombo,
        updateCombo,
        deleteCombo
    };
}
