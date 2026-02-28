/**
 * Vista de Historial de Pedidos con filtros
 * Permite filtrar por fecha, estado, método de pago, etc.
 */

import { useState, useMemo } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { formatCurrency } from '../lib/utils';
import { Badge } from '@/components/ui/badge';
import { Calendar, FilterX, Wallet } from 'lucide-react';
import type { OrderResponse, OrderStatus, PaymentStatus, PaymentMethod } from '../types/order.types';
import type { CashShiftResponse } from '../types/cashshift.types';
import {
    OrderStatusLabels,
    OrderStatusColors,
    PaymentStatusLabels,
    PaymentMethodLabels
} from '../types/order.types';

interface OrdersHistoryViewProps {
    orders: OrderResponse[];
    loading?: boolean;
    cashShifts?: CashShiftResponse[];
}

export function OrdersHistoryView({ orders, loading = false, cashShifts = [] }: OrdersHistoryViewProps) {
    const ALL = 'ALL';
    const [filterDateFrom, setFilterDateFrom] = useState<string>('');
    const [filterDateTo, setFilterDateTo] = useState<string>('');
    const [filterOrderStatus, setFilterOrderStatus] = useState<OrderStatus | typeof ALL>(ALL);
    const [filterPaymentStatus, setFilterPaymentStatus] = useState<PaymentStatus | typeof ALL>(ALL);
    const [filterPaymentMethod, setFilterPaymentMethod] = useState<PaymentMethod | typeof ALL>(ALL);
    const [filterCustomer, setFilterCustomer] = useState<string>('');
    const [filterCashShift, setFilterCashShift] = useState<number | typeof ALL>(ALL);

    // Aplicar filtros
    const filteredOrders = useMemo(() => {
        return orders.filter((order) => {
            // Obtener la caja a la que pertenece este pedido
            const orderCashShift = cashShifts.find(cs => cs.id === order.cashShiftId);
            
            // Filtro de fecha desde (basado en la fecha de apertura de la caja)
            if (filterDateFrom && orderCashShift) {
                const fromDate = new Date(filterDateFrom);
                fromDate.setHours(0, 0, 0, 0); // Ignorar horas
                
                const cashShiftDate = new Date(orderCashShift.startDate);
                cashShiftDate.setHours(0, 0, 0, 0); // Ignorar horas
                
                if (cashShiftDate < fromDate) return false;
            }

            // Filtro de fecha hasta (basado en la fecha de apertura de la caja)
            if (filterDateTo && orderCashShift) {
                const toDate = new Date(filterDateTo);
                toDate.setHours(23, 59, 59, 999); // Fin del día
                
                const cashShiftDate = new Date(orderCashShift.startDate);
                cashShiftDate.setHours(0, 0, 0, 0); // Ignorar horas
                
                if (cashShiftDate > toDate) return false;
            }

            // Filtro de estado del pedido
            if (filterOrderStatus !== ALL && order.orderStatus !== filterOrderStatus) {
                return false;
            }

            // Filtro de estado de pago
            if (filterPaymentStatus !== ALL && order.paymentStatus !== filterPaymentStatus) {
                return false;
            }

            // Filtro de método de pago
            if (filterPaymentMethod !== ALL && order.paymentMethod !== filterPaymentMethod) {
                return false;
            }

            // Filtro de cliente (por nombre)
            if (filterCustomer && !order.customerName?.toLowerCase().includes(filterCustomer.toLowerCase())) {
                return false;
            }

            // Filtro de caja
            if (filterCashShift !== ALL && order.cashShiftId !== filterCashShift) {
                return false;
            }

            return true;
        });
    }, [
        orders,
        cashShifts,
        filterDateFrom,
        filterDateTo,
        filterOrderStatus,
        filterPaymentStatus,
        filterPaymentMethod,
        filterCustomer,
        filterCashShift
    ]);

    const handleClearFilters = () => {
        setFilterDateFrom('');
        setFilterDateTo('');
        setFilterOrderStatus(ALL);
        setFilterPaymentStatus(ALL);
        setFilterPaymentMethod(ALL);
        setFilterCustomer('');
        setFilterCashShift(ALL);
    };

    const hasActiveFilters = filterDateFrom || filterDateTo || filterOrderStatus !== ALL || filterPaymentStatus !== ALL || filterPaymentMethod !== ALL || filterCustomer || filterCashShift !== ALL;

    return (
        <div className="space-y-6">
            <div>
                <p className="text-gray-600 mt-1">Total: {filteredOrders.length} pedidos encontrados</p>
            </div>

            <Card className="bg-white">
                <CardHeader>
                    <CardTitle className="text-lg">Filtros</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="filterDateFrom">Desde</Label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
                                <Input
                                    id="filterDateFrom"
                                    type="date"
                                    value={filterDateFrom}
                                    onChange={(e) => setFilterDateFrom(e.target.value)}
                                    className="pl-10 bg-[#F2EDE4]"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="filterDateTo">Hasta</Label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
                                <Input
                                    id="filterDateTo"
                                    type="date"
                                    value={filterDateTo}
                                    onChange={(e) => setFilterDateTo(e.target.value)}
                                    className="pl-10 bg-[#F2EDE4]"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="filterCustomer">Cliente</Label>
                            <Input
                                id="filterCustomer"
                                type="text"
                                placeholder="Nombre del cliente"
                                value={filterCustomer}
                                onChange={(e) => setFilterCustomer(e.target.value)}
                                className="bg-[#F2EDE4]"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="filterCashShift">Caja</Label>
                            <Select value={filterCashShift === ALL ? ALL : String(filterCashShift)} onValueChange={(value) => setFilterCashShift(value === ALL ? ALL : Number(value))}>
                                <SelectTrigger className="h-10 bg-[#F2EDE4] border-[#E5D9D1] focus:border-[#F24452] focus:ring-0 overflow-hidden text-ellipsis whitespace-nowrap">
                                    <SelectValue placeholder="Todas" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#F2EDE4] border border-[#E5D9D1] shadow-lg max-h-[260px]">
                                    <SelectItem value={ALL}>Todas las cajas</SelectItem>
                                    {cashShifts.map((cs) => {
                                        const openDate = new Date(cs.startDate).toLocaleDateString('es-ES', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric'
                                        });
                                        const closeDate = cs.endDate
                                            ? new Date(cs.endDate).toLocaleDateString('es-ES', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric'
                                            })
                                            : 'Abierta';
                                        return (
                                            <SelectItem key={cs.id} value={String(cs.id)}>
                                                #{cs.id} - {openDate} {cs.endDate ? `- ${closeDate}` : '(🔓 Abierta)'}
                                            </SelectItem>
                                        );
                                    })}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="filterOrderStatus">Estado del Pedido</Label>
                            <Select value={filterOrderStatus} onValueChange={(value) => setFilterOrderStatus(value as OrderStatus | typeof ALL)}>
                                <SelectTrigger className="h-10 bg-[#F2EDE4] border-[#E5D9D1] focus:border-[#F24452] focus:ring-0 overflow-hidden text-ellipsis whitespace-nowrap">
                                    <SelectValue placeholder="Todos" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#F2EDE4] border border-[#E5D9D1] shadow-lg max-h-[260px]">
                                    <SelectItem value={ALL}>Todos</SelectItem>
                                    <SelectItem value="PENDING">Pendiente</SelectItem>
                                    <SelectItem value="PREPARING">En Preparación</SelectItem>
                                    <SelectItem value="READY">Listo</SelectItem>
                                    <SelectItem value="DELIVERED">Entregado</SelectItem>
                                    <SelectItem value="CANCELLED">Cancelado</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="filterPaymentStatus">Estado de Pago</Label>
                            <Select value={filterPaymentStatus} onValueChange={(value) => setFilterPaymentStatus(value as PaymentStatus | typeof ALL)}>
                                <SelectTrigger className="h-10 bg-[#F2EDE4] border-[#E5D9D1] focus:border-[#F24452] focus:ring-0 overflow-hidden text-ellipsis whitespace-nowrap">
                                    <SelectValue placeholder="Todos" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#F2EDE4] border border-[#E5D9D1] shadow-lg max-h-[260px]">
                                    <SelectItem value={ALL}>Todos</SelectItem>
                                    <SelectItem value="PENDING">Pendiente</SelectItem>
                                    <SelectItem value="PAID">Pagado</SelectItem>
                                    <SelectItem value="CANCELLED">Cancelado</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="filterPaymentMethod">Método de Pago</Label>
                            <Select value={filterPaymentMethod} onValueChange={(value) => setFilterPaymentMethod(value as PaymentMethod | typeof ALL)}>
                                <SelectTrigger className="h-10 bg-[#F2EDE4] border-[#E5D9D1] focus:border-[#F24452] focus:ring-0 overflow-hidden text-ellipsis whitespace-nowrap">
                                    <SelectValue placeholder="Todos" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#F2EDE4] border border-[#E5D9D1] shadow-lg max-h-[260px]">
                                    <SelectItem value={ALL}>Todos</SelectItem>
                                    <SelectItem value="CASH">💵 Efectivo</SelectItem>
                                    <SelectItem value="CARD">💳 Tarjeta</SelectItem>
                                    <SelectItem value="TRANSFER">🏦 Transferencia</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-end">
                            {hasActiveFilters && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleClearFilters}
                                    className="w-full border-gray-300 hover:bg-gray-50"
                                >
                                    <FilterX className="w-4 h-4 mr-2" />
                                    Limpiar Filtros
                                </Button>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-white">
                <CardContent className="p-0">
                    {loading ? (
                        <div className="flex justify-center items-center h-40">
                            <p className="text-gray-500">Cargando pedidos...</p>
                        </div>
                    ) : filteredOrders.length === 0 ? (
                        <div className="flex justify-center items-center h-40">
                            <p className="text-gray-500">
                                {orders.length === 0
                                    ? 'No hay pedidos registrados'
                                    : 'No hay pedidos que coincidan con los filtros'}
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-b border-gray-200 bg-gray-50">
                                        <TableHead className="font-semibold text-gray-700">ID</TableHead>
                                        <TableHead className="font-semibold text-gray-700">Caja</TableHead>
                                        <TableHead className="font-semibold text-gray-700">Fecha</TableHead>
                                        <TableHead className="font-semibold text-gray-700">Cliente</TableHead>
                                        <TableHead className="font-semibold text-gray-700">Estado</TableHead>
                                        <TableHead className="font-semibold text-gray-700">Pago</TableHead>
                                        <TableHead className="font-semibold text-gray-700">Método</TableHead>
                                        <TableHead className="text-right font-semibold text-gray-700">Total</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredOrders.map((order) => {
                                        // Buscar la caja del pedido para mostrar su fecha de apertura
                                        const orderCashShift = cashShifts.find(cs => cs.id === order.cashShiftId);
                                        
                                        // Fecha del pedido (hora específica)
                                        const orderDate = new Date(order.createdAt);
                                        const orderTimeDisplay = !Number.isNaN(orderDate.getTime())
                                            ? orderDate.toLocaleTimeString('es-ES', {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })
                                            : '';
                                        
                                        // Fecha de la caja (día completo)
                                        const cashShiftDate = orderCashShift ? new Date(orderCashShift.startDate) : null;
                                        const dateDisplay = cashShiftDate && !Number.isNaN(cashShiftDate.getTime())
                                            ? cashShiftDate.toLocaleDateString('es-ES', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })
                                            : orderDate.toLocaleDateString('es-ES', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            });
                                        
                                        const totalValue = typeof order.total === 'number'
                                            ? order.total
                                            : Number(order.total);
                                        const totalDisplay = Number.isFinite(totalValue)
                                            ? formatCurrency(totalValue)
                                            : formatCurrency(0);

                                        return (
                                            <TableRow key={order.id} className="border-b border-gray-200 hover:bg-gray-50">
                                                <TableCell className="font-medium text-gray-900">#{order.id}</TableCell>
                                                <TableCell className="text-gray-600">
                                                    <div className="flex items-center gap-1">
                                                        <Wallet className="h-3 w-3 text-[#F24452]" />
                                                        <span className="text-xs">#{order.cashShiftId || 'N/A'}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-gray-600">
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">{dateDisplay}</span>
                                                        <span className="text-xs text-gray-500">{orderTimeDisplay}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-gray-600">{order.customerName || 'Sin cliente'}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className={`${OrderStatusColors[order.orderStatus]} border`}>
                                                        {OrderStatusLabels[order.orderStatus]}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {order.paymentStatus === 'PAID' ? (
                                                        <Badge className="bg-green-500 text-white border-0 font-semibold">
                                                            ✓ {PaymentStatusLabels[order.paymentStatus]}
                                                        </Badge>
                                                    ) : (
                                                        <Badge className="bg-red-500 text-white border-0 font-semibold">
                                                            ⚠ {PaymentStatusLabels[order.paymentStatus]}
                                                        </Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <span className="text-gray-600">
                                                        {PaymentMethodLabels[order.paymentMethod]}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-right font-semibold text-gray-900">
                                                    {totalDisplay}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
