/**
 * Tablero Kanban principal con drag & drop
 * Permite arrastrar pedidos entre columnas para cambiar su estado
 */

import { useState } from 'react';
import {
    DndContext,
    DragOverlay,
    PointerSensor,
    useSensor,
    useSensors
} from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import type { OrderResponse, OrderStatus } from '../types/order.types';
import { OrderStatus as OrderStatusEnum } from '../types/order.types';
import { KanbanColumn } from './KanbanColumn';
import { OrderCard } from './OrderCard';

interface KanbanBoardProps {
    orders: OrderResponse[];
    onOrderClick: (order: OrderResponse) => void;
    onStatusChange: (orderId: number, newStatus: OrderStatus) => Promise<void>;
}

// Estados a mostrar en el Kanban (sin CANCELLED)
const KANBAN_STATUSES: OrderStatus[] = [
    OrderStatusEnum.PENDING,
    OrderStatusEnum.PREPARING,
    OrderStatusEnum.READY,
    OrderStatusEnum.DELIVERED
];

/**
 * Tablero Kanban con drag & drop funcional
 */
export function KanbanBoard({ orders, onOrderClick, onStatusChange }: KanbanBoardProps) {
    const [activeOrder, setActiveOrder] = useState<OrderResponse | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8 // Requiere arrastrar 8px para activar
            }
        })
    );

    /**
     * Agrupar órdenes por estado
     */
    const ordersByStatus = KANBAN_STATUSES.reduce((acc, status) => {
        acc[status] = orders.filter(order => order.orderStatus === status);
        return acc;
    }, {} as Record<OrderStatus, OrderResponse[]>);

    /**
     * Inicio del drag
     */
    const handleDragStart = (event: DragStartEvent) => {
        const orderId = Number(event.active.id);
        const order = orders.find(o => o.id === orderId);
        setActiveOrder(order || null);
    };

    /**
     * Fin del drag (soltar)
     */
    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        
        setActiveOrder(null);

        if (!over) return;

        const orderId = Number(active.id);
        const newStatus = over.id as OrderStatus;
        
        // Verificar que sea un estado válido
        if (!KANBAN_STATUSES.includes(newStatus)) return;

        // Verificar si cambió de estado
        const order = orders.find(o => o.id === orderId);
        if (!order || order.orderStatus === newStatus) return;

        // Actualizar estado
        await onStatusChange(orderId, newStatus);
    };

    return (
        <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="flex gap-4 overflow-x-auto pb-4">
                {KANBAN_STATUSES.map(status => (
                    <KanbanColumn
                        key={status}
                        status={status}
                        orders={ordersByStatus[status]}
                        onOrderClick={onOrderClick}
                    />
                ))}
            </div>

            {/* Overlay para mostrar la tarjeta mientras se arrastra */}
            <DragOverlay>
                {activeOrder && <OrderCard order={activeOrder} isDragging />}
            </DragOverlay>
        </DndContext>
    );
}
