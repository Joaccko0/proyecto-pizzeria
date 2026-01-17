/**
 * Hook custom para gestión de órdenes
 * Maneja estado, carga de datos y operaciones CRUD
 */

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { OrderService } from '../services/order.service';
import type { OrderResponse, CreateOrderRequest, OrderStatus } from '../types/order.types';

interface UseOrdersReturn {
    orders: OrderResponse[];
    loading: boolean;
    error: string | null;
    loadOrders: () => Promise<void>;
    createOrder: (data: CreateOrderRequest) => Promise<boolean>;
    updateOrderStatus: (orderId: number, newStatus: OrderStatus) => Promise<boolean>;
    cancelOrder: (orderId: number) => Promise<boolean>;
}

/**
 * Hook para gestión completa de órdenes
 */
export function useOrders(businessId: number | undefined): UseOrdersReturn {
    const [orders, setOrders] = useState<OrderResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Cargar órdenes al montar o cambiar businessId
    useEffect(() => {
        if (businessId) {
            loadOrders();
        }
    }, [businessId]);

    /**
     * Cargar todas las órdenes
     */
    const loadOrders = async () => {
        if (!businessId) return;

        setLoading(true);
        setError(null);

        try {
            const data = await OrderService.getOrders(businessId);
            setOrders(data);
        } catch (err: any) {
            const message = err.response?.data?.message || 'Error al cargar órdenes';
            setError(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Crear nueva orden
     */
    const createOrder = async (data: CreateOrderRequest): Promise<boolean> => {
        if (!businessId) return false;

        try {
            const newOrder = await OrderService.createOrder(businessId, data);
            setOrders(prev => [newOrder, ...prev]); // Agregar al inicio
            toast.success('Pedido creado exitosamente');
            return true;
        } catch (err: any) {
            const message = err.response?.data?.message || 'Error al crear pedido';
            toast.error(message);
            return false;
        }
    };

    /**
     * Actualizar estado de una orden (para Kanban drag & drop)
     */
    const updateOrderStatus = async (
        orderId: number,
        newStatus: OrderStatus
    ): Promise<boolean> => {
        if (!businessId) return false;

        try {
            const updatedOrder = await OrderService.updateOrderStatus(businessId, orderId, newStatus);
            
            // Actualizar en el estado local
            setOrders(prev =>
                prev.map(order =>
                    order.id === orderId ? updatedOrder : order
                )
            );

            toast.success('Estado actualizado');
            return true;
        } catch (err: any) {
            const message = err.response?.data?.message || 'Error al actualizar estado';
            toast.error(message);
            return false;
        }
    };

    /**
     * Cancelar una orden
     */
    const cancelOrder = async (orderId: number): Promise<boolean> => {
        if (!businessId) return false;

        try {
            await OrderService.cancelOrder(businessId, orderId);
            
            // Remover del estado local
            setOrders(prev => prev.filter(order => order.id !== orderId));
            
            toast.success('Pedido cancelado');
            return true;
        } catch (err: any) {
            const message = err.response?.data?.message || 'Error al cancelar pedido';
            toast.error(message);
            return false;
        }
    };

    return {
        orders,
        loading,
        error,
        loadOrders,
        createOrder,
        updateOrderStatus,
        cancelOrder
    };
}
