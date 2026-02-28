/**
 * Hook custom para gestión de historial de órdenes
 * Carga TODAS las órdenes sin filtro de caja
 */

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { OrderService } from '../services/order.service';
import { CashShiftService } from '../services/cashshift.service';
import type { OrderResponse } from '../types/order.types';
import type { CashShiftResponse } from '../types/cashshift.types';

interface UseOrdersHistoricReturn {
    orders: OrderResponse[];
    cashShifts: CashShiftResponse[];
    loading: boolean;
    error: string | null;
    loadOrdersHistoric: () => Promise<void>;
}

/**
 * Hook para gestión del historial de órdenes
 * Carga todas las órdenes del negocio sin filtro de caja abierta
 */
export function useOrdersHistoric(businessId: number | undefined): UseOrdersHistoricReturn {
    const [orders, setOrders] = useState<OrderResponse[]>([]);
    const [cashShifts, setCashShifts] = useState<CashShiftResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Cargar todas las órdenes del historial
     */
    const loadOrdersHistoric = useCallback(async () => {
        if (!businessId) return;

        setLoading(true);
        setError(null);

        try {
            const [ordersData, cashShiftsData] = await Promise.all([
                OrderService.getOrdersHistoric(businessId),
                CashShiftService.getAllCashShifts(businessId)
            ]);
            setOrders(ordersData);
            setCashShifts(cashShiftsData);
        } catch (err: any) {
            const message = err.response?.data?.message || 'Error al cargar historial de órdenes';
            setError(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    }, [businessId]);

    // Cargar órdenes al montar o cambiar businessId
    useEffect(() => {
        if (businessId) {
            loadOrdersHistoric();
        } else {
            // Limpiar órdenes si no hay negocio seleccionado
            setOrders([]);
        }
    }, [businessId, loadOrdersHistoric]);

    return {
        orders,
        cashShifts,
        loading,
        error,
        loadOrdersHistoric
    };
}
