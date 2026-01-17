/**
 * Columna de estado para el tablero Kanban
 * Contenedor droppable para tarjetas de órdenes
 */

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { OrderResponse, OrderStatus } from '../types/order.types';
import { OrderStatusLabels } from '../types/order.types';
import { OrderCard } from './OrderCard';

interface KanbanColumnProps {
    status: OrderStatus;
    orders: OrderResponse[];
    onOrderClick: (order: OrderResponse) => void;
}

/**
 * Columna del Kanban para un estado específico
 */
export function KanbanColumn({ status, orders, onOrderClick }: KanbanColumnProps) {
    const { setNodeRef } = useDroppable({
        id: status
    });

    const orderIds = orders.map(o => o.id.toString());
    const count = orders.length;

    return (
        <div className="flex-1 min-w-[280px] max-w-[350px] flex flex-col">
            {/* Header de la columna */}
            <div className="mb-3 px-3 py-2 bg-white rounded-lg border-2 border-[#E5D9D1] shadow-sm">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm text-[#0D0D0D]">
                        {OrderStatusLabels[status]}
                    </h3>
                    <span className="text-xs font-medium bg-[#F2EDE4] text-[#262626] px-2 py-1 rounded-full">
                        {count}
                    </span>
                </div>
            </div>

            {/* Lista de órdenes (droppable) */}
            <div
                ref={setNodeRef}
                className="flex-1 space-y-2 min-h-[200px] p-2 bg-[#F2EDE4]/50 rounded-lg border-2 border-dashed border-[#E5D9D1]"
            >
                <SortableContext items={orderIds} strategy={verticalListSortingStrategy}>
                    {orders.length === 0 ? (
                        <div className="flex items-center justify-center h-32 text-sm text-gray-400">
                            Sin pedidos
                        </div>
                    ) : (
                        orders.map(order => (
                            <SortableOrderCard
                                key={order.id}
                                order={order}
                                onClick={() => onOrderClick(order)}
                            />
                        ))
                    )}
                </SortableContext>
            </div>
        </div>
    );
}

/**
 * Wrapper sortable para OrderCard
 */
function SortableOrderCard({ order, onClick }: { order: OrderResponse; onClick: () => void }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: order.id.toString() });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
        >
            <OrderCard order={order} onClick={onClick} isDragging={isDragging} />
        </div>
    );
}
