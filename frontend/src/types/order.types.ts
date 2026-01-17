/**
 * Tipos TypeScript para el sistema de órdenes
 * Basados en el backend Java
 */

// Enums del backend
export const OrderStatus = {
    PENDING: 'PENDING',
    PREPARING: 'PREPARING',
    READY: 'READY',
    DELIVERED: 'DELIVERED',
    CANCELLED: 'CANCELLED'
} as const;
export type OrderStatus = typeof OrderStatus[keyof typeof OrderStatus];

export const PaymentStatus = {
    PENDING: 'PENDING',
    PAID: 'PAID',
    CANCELLED: 'CANCELLED'
} as const;
export type PaymentStatus = typeof PaymentStatus[keyof typeof PaymentStatus];

export const PaymentMethod = {
    CASH: 'CASH',
    CARD: 'CARD',
    TRANSFER: 'TRANSFER'
} as const;
export type PaymentMethod = typeof PaymentMethod[keyof typeof PaymentMethod];

export const DeliveryMethod = {
    PICKUP: 'PICKUP',
    DELIVERY: 'DELIVERY',
    DINE_IN: 'DINE_IN'
} as const;
export type DeliveryMethod = typeof DeliveryMethod[keyof typeof DeliveryMethod];

// Item de orden (puede ser producto o combo)
export interface OrderItemResponse {
    productId: number | null;
    comboId: number | null;
    name: string; // Nombre del producto o combo
    quantity: number;
    unitPrice: number;
    subtotal: number;
}

// Respuesta completa de orden
export interface OrderResponse {
    id: number;
    customerId: number | null;
    customerName: string | null;
    orderStatus: OrderStatus;
    paymentStatus: PaymentStatus;
    paymentMethod: PaymentMethod;
    deliveryMethod: DeliveryMethod;
    total: number;
    createdAt: string; // ISO date string
    items: OrderItemResponse[];
}

// Request para crear un item
export interface OrderItemRequest {
    productId?: number;
    comboId?: number;
    quantity: number;
}

// Request para crear una orden
export interface CreateOrderRequest {
    customerId?: number;
    deliveryMethod: DeliveryMethod;
    paymentMethod: PaymentMethod;
    paymentStatus?: PaymentStatus;
    items: OrderItemRequest[];
    note?: string;
}

// Labels en español para los enums
export const OrderStatusLabels: Record<OrderStatus, string> = {
    [OrderStatus.PENDING]: 'Pendiente',
    [OrderStatus.PREPARING]: 'En Preparación',
    [OrderStatus.READY]: 'Listo',
    [OrderStatus.DELIVERED]: 'Entregado',
    [OrderStatus.CANCELLED]: 'Cancelado'
};

export const PaymentStatusLabels: Record<PaymentStatus, string> = {
    [PaymentStatus.PENDING]: 'Pendiente',
    [PaymentStatus.PAID]: 'Pagado',
    [PaymentStatus.CANCELLED]: 'Cancelado'
};

export const PaymentMethodLabels: Record<PaymentMethod, string> = {
    [PaymentMethod.CASH]: 'Efectivo',
    [PaymentMethod.CARD]: 'Tarjeta',
    [PaymentMethod.TRANSFER]: 'Transferencia'
};

export const DeliveryMethodLabels: Record<DeliveryMethod, string> = {
    [DeliveryMethod.PICKUP]: 'Retiro',
    [DeliveryMethod.DELIVERY]: 'Delivery',
    [DeliveryMethod.DINE_IN]: 'Salón'
};

// Colores para cada estado (para el Kanban)
export const OrderStatusColors: Record<OrderStatus, string> = {
    [OrderStatus.PENDING]: 'bg-amber-100 border-amber-300 text-amber-800',
    [OrderStatus.PREPARING]: 'bg-blue-100 border-blue-300 text-blue-800',
    [OrderStatus.READY]: 'bg-green-100 border-green-300 text-green-800',
    [OrderStatus.DELIVERED]: 'bg-gray-100 border-gray-300 text-gray-800',
    [OrderStatus.CANCELLED]: 'bg-red-100 border-red-300 text-red-800'
};
