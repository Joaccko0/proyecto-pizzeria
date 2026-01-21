/**
 * Tarjeta individual de pedido para el tablero Kanban
 * Muestra información resumida del pedido
 */

import { Clock, Package, CreditCard, MapPin } from 'lucide-react';
import { Card } from '@/components/ui/card';
import type { OrderResponse } from '../types/order.types';
import {
    PaymentMethodLabels,
    DeliveryMethodLabels,
    PaymentStatusLabels
} from '../types/order.types';

interface OrderCardProps {
    order: OrderResponse;
    onClick?: () => void;
    isDragging?: boolean;
}

/**
 * Tarjeta de pedido para el Kanban
 * Clickeable para ver detalles
 */
export function OrderCard({ order, onClick, isDragging }: OrderCardProps) {
    const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
    const timeAgo = formatTimeAgo(order.createdAt);

    return (
        <Card
            onClick={onClick}
            className={`p-3 cursor-pointer hover:shadow-md transition-all duration-200 bg-white border-2 ${
                isDragging ? 'opacity-50 rotate-2' : ''
            }`}
        >
            {/* Header: ID y tiempo */}
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                    <Package className="w-4 h-4 text-[#F24452]" />
                    <span className="font-semibold text-sm text-[#0D0D0D]">
                        Pedido #{order.id}
                    </span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    {timeAgo}
                </div>
            </div>

            {/* Cliente */}
            {order.customerName && (
                <div className="text-xs text-[#262626] mb-2 truncate">
                    Cliente: <span className="font-medium">{order.customerName}</span>
                </div>
            )}

            {/* Items */}
            <div className="mb-2 text-xs text-[#262626]">
                <div className="font-medium mb-1">Items:</div>
                <div className="space-y-1">
                    {order.items.map((item, index) => (
                        <div key={index} className="text-xs text-[#404040] truncate">
                            • {item.name} {item.quantity > 1 && `(x${item.quantity})`}
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer: Total, Método pago, Método entrega */}
            <div className="flex items-center justify-between pt-2 border-t border-[#E5D9D1]">
                <div className="flex items-center gap-2">
                    {/* Método de pago */}
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                        <CreditCard className="w-3 h-3" />
                        {PaymentMethodLabels[order.paymentMethod]}
                    </div>
                    
                    {/* Método de entrega */}
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                        <MapPin className="w-3 h-3" />
                        {DeliveryMethodLabels[order.deliveryMethod]}
                    </div>
                </div>

                {/* Total */}
                <div className="text-sm font-bold text-[#F24452]">
                    ${order.total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                </div>
            </div>

            {/* Estado de pago (si no está pagado) */}
            {order.paymentStatus !== 'PAID' && (
                <div className="mt-2 text-xs text-amber-600 font-medium">
                    {PaymentStatusLabels[order.paymentStatus]}
                </div>
            )}
        </Card>
    );
}

/**
 * Formatear tiempo relativo (hace X minutos)
 */
function formatTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    return `${diffDays}d`;
}
