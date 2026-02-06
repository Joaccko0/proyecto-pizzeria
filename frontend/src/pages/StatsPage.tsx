/**
 * Página de Estadísticas
 * Resumen de ventas, métodos de pago, top productos/combos y tendencias horarias
 */

import { useMemo, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { useBusiness } from '../context/BusinessContext';
import { useOrdersHistoric } from '../hooks/useOrdersHistoric';
import type { PaymentMethod } from '../types/order.types';
import { PaymentMethodLabels } from '../types/order.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const PIE_COLORS = [
    '#F24452',
    '#F2A444',
    '#4F9CF7',
    '#7C4DFF',
    '#22C55E',
    '#0EA5E9',
    '#F59E0B',
    '#6B7280'
];

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS'
    }).format(amount);
};

const formatPercent = (value: number) => `${(value * 100).toFixed(1)}%`;

const toDateStart = (dateString: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return null;
    date.setHours(0, 0, 0, 0);
    return date;
};

const toDateEnd = (dateString: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return null;
    date.setHours(23, 59, 59, 999);
    return date;
};

function polarToCartesian(cx: number, cy: number, radius: number, angleInDegrees: number) {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
        x: cx + radius * Math.cos(angleInRadians),
        y: cy + radius * Math.sin(angleInRadians)
    };
}

function describeArc(cx: number, cy: number, radius: number, startAngle: number, endAngle: number) {
    const start = polarToCartesian(cx, cy, radius, endAngle);
    const end = polarToCartesian(cx, cy, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;
    return `M ${cx} ${cy} L ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y} Z`;
}

function PieChart({ data }: { data: { label: string; value: number }[] }) {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    if (!total) {
        return (
            <div className="flex items-center justify-center h-56 text-sm text-gray-500">
                Sin datos para graficar
            </div>
        );
    }

    let cumulative = 0;

    return (
        <div className="flex flex-col md:flex-row gap-6 items-center">
            <svg viewBox="0 0 200 200" className="w-56 h-56">
                {data.map((slice, index) => {
                    const startAngle = (cumulative / total) * 360;
                    cumulative += slice.value;
                    const endAngle = (cumulative / total) * 360;
                    const path = describeArc(100, 100, 80, startAngle, endAngle);
                    return (
                        <path
                            key={slice.label}
                            d={path}
                            fill={PIE_COLORS[index % PIE_COLORS.length]}
                            stroke="#ffffff"
                            strokeWidth="2"
                        />
                    );
                })}
            </svg>

            <div className="space-y-2 w-full">
                {data.map((slice, index) => {
                    const percent = slice.value / total;
                    return (
                        <div key={slice.label} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                                <span
                                    className="inline-block w-3 h-3 rounded-full"
                                    style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}
                                />
                                <span className="text-gray-700">{slice.label}</span>
                            </div>
                            <div className="text-gray-500">
                                {slice.value} · {formatPercent(percent)}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function HourlyTrend({ counts }: { counts: number[] }) {
    const max = Math.max(...counts, 0);
    const labels = new Set([0, 6, 12, 18, 23]);

    return (
        <div className="space-y-3">
            <div
                className="grid gap-1 h-48 items-end"
                style={{ gridTemplateColumns: 'repeat(24, minmax(0, 1fr))' }}
            >
                {counts.map((count, hour) => {
                    const height = max ? Math.max(6, Math.round((count / max) * 100)) : 6;
                    return (
                        <div key={hour} className="flex flex-col items-center">
                            <div
                                title={`${hour.toString().padStart(2, '0')}:00 · ${count} pedidos`}
                                className="w-full rounded-md bg-[#F24452]/80"
                                style={{ height: `${height}%` }}
                            />
                            {labels.has(hour) && (
                                <span className="text-[10px] text-gray-500 mt-1">
                                    {hour}
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>
            <div className="text-xs text-gray-500">
                Barras más altas indican más pedidos por hora
            </div>
        </div>
    );
}

export default function StatsPage() {
    const { currentBusiness } = useBusiness();
    const { orders, loading, loadOrdersHistoric } = useOrdersHistoric(currentBusiness?.id);

    const [filterDateFrom, setFilterDateFrom] = useState('');
    const [filterDateTo, setFilterDateTo] = useState('');

    const filteredOrders = useMemo(() => {
        const start = toDateStart(filterDateFrom);
        const end = toDateEnd(filterDateTo);

        return orders.filter((order) => {
            const dateValue = new Date(order.createdAt);
            if (Number.isNaN(dateValue.getTime())) return false;
            if (start && dateValue < start) return false;
            if (end && dateValue > end) return false;
            return true;
        });
    }, [orders, filterDateFrom, filterDateTo]);

    const stats = useMemo(() => {
        const nonCancelled = filteredOrders.filter((order) => order.orderStatus !== 'CANCELLED');
        const paidOrders = nonCancelled.filter((order) => order.paymentStatus === 'PAID');
        const cancelledCount = filteredOrders.filter((order) => order.orderStatus === 'CANCELLED').length;

        const totalRevenue = paidOrders.reduce((sum, order) => sum + (Number(order.total) || 0), 0);
        const totalOrders = filteredOrders.length;
        const paidOrdersCount = paidOrders.length;
        const avgTicket = paidOrdersCount ? totalRevenue / paidOrdersCount : 0;

        const paymentTotals: Record<PaymentMethod, { amount: number; count: number }> = {
            CASH: { amount: 0, count: 0 },
            CARD: { amount: 0, count: 0 },
            TRANSFER: { amount: 0, count: 0 }
        };

        paidOrders.forEach((order) => {
            const method = order.paymentMethod;
            if (!paymentTotals[method]) return;
            paymentTotals[method].amount += Number(order.total) || 0;
            paymentTotals[method].count += 1;
        });

        const itemsMap = new Map<string, { label: string; quantity: number; revenue: number }>();
        paidOrders.forEach((order) => {
            order.items.forEach((item) => {
                const label = item.name || 'Sin nombre';
                const current = itemsMap.get(label) || { label, quantity: 0, revenue: 0 };
                current.quantity += item.quantity || 0;
                current.revenue += Number(item.subtotal) || 0;
                itemsMap.set(label, current);
            });
        });

        const items = Array.from(itemsMap.values()).sort((a, b) => b.quantity - a.quantity);
        const totalItemsSold = items.reduce((sum, item) => sum + item.quantity, 0);

        const pieData = (() => {
            const top = items.slice(0, 6);
            const rest = items.slice(6);
            const restTotal = rest.reduce((sum, item) => sum + item.quantity, 0);
            const data = top.map((item) => ({ label: item.label, value: item.quantity }));
            if (restTotal > 0) {
                data.push({ label: 'Otros', value: restTotal });
            }
            return data;
        })();

        const hourCounts = new Array(24).fill(0);
        nonCancelled.forEach((order) => {
            const date = new Date(order.createdAt);
            if (Number.isNaN(date.getTime())) return;
            hourCounts[date.getHours()] += 1;
        });

        const peakHours = hourCounts
            .map((count, hour) => ({ hour, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 3)
            .filter((item) => item.count > 0);

        return {
            totalRevenue,
            totalOrders,
            paidOrdersCount,
            cancelledCount,
            avgTicket,
            totalItemsSold,
            paymentTotals,
            items,
            pieData,
            hourCounts,
            peakHours
        };
    }, [filteredOrders]);

    const hasActiveFilters = filterDateFrom || filterDateTo;

    const handleClearFilters = () => {
        setFilterDateFrom('');
        setFilterDateTo('');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#F2EDE4] to-[#E5D9D1] p-6">
            <div className="max-w-[1400px] mx-auto space-y-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-[#0D0D0D]">Estadísticas</h1>
                        <p className="text-sm text-[#262626] mt-1">
                            Analiza ventas, métodos de pago y productos más vendidos
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={loadOrdersHistoric}
                        disabled={loading}
                        className="border-[#E5D9D1]"
                    >
                        <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                        Actualizar
                    </Button>
                </div>

                <Card className="bg-white">
                    <CardHeader>
                        <CardTitle className="text-lg">Filtros</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="statsDateFrom">Desde</Label>
                                <Input
                                    id="statsDateFrom"
                                    type="date"
                                    value={filterDateFrom}
                                    onChange={(e) => setFilterDateFrom(e.target.value)}
                                    className="bg-[#F2EDE4]"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="statsDateTo">Hasta</Label>
                                <Input
                                    id="statsDateTo"
                                    type="date"
                                    value={filterDateTo}
                                    onChange={(e) => setFilterDateTo(e.target.value)}
                                    className="bg-[#F2EDE4]"
                                />
                            </div>
                            <div className="flex items-end">
                                {hasActiveFilters && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleClearFilters}
                                        className="border-gray-300"
                                    >
                                        Limpiar Filtros
                                    </Button>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatCard title="Ventas Totales" value={formatCurrency(stats.totalRevenue)} />
                    <StatCard title="Pedidos Totales" value={stats.totalOrders.toString()} />
                    <StatCard title="Ticket Promedio" value={formatCurrency(stats.avgTicket)} />
                    <StatCard title="Pedidos Pagados" value={stats.paidOrdersCount.toString()} />
                    <StatCard title="Pedidos Cancelados" value={stats.cancelledCount.toString()} />
                    <StatCard title="Items Vendidos" value={stats.totalItemsSold.toString()} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="bg-white">
                        <CardHeader>
                            <CardTitle className="text-lg">Ventas por Medio de Pago</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {Object.entries(stats.paymentTotals).map(([method, data]) => {
                                const percent = stats.totalRevenue ? data.amount / stats.totalRevenue : 0;
                                return (
                                    <div key={method} className="flex items-center justify-between border-b border-gray-100 pb-2 text-sm">
                                        <div>
                                            <div className="font-medium text-gray-700">{PaymentMethodLabels[method as PaymentMethod]}</div>
                                            <div className="text-xs text-gray-500">{data.count} pedidos</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-semibold text-[#0D0D0D]">{formatCurrency(data.amount)}</div>
                                            <div className="text-xs text-gray-500">{formatPercent(percent)}</div>
                                        </div>
                                    </div>
                                );
                            })}
                            {stats.totalRevenue === 0 && (
                                <div className="text-sm text-gray-500">No hay ventas pagadas en el rango seleccionado.</div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="bg-white">
                        <CardHeader>
                            <CardTitle className="text-lg">Tendencia de Pedidos por Hora</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <HourlyTrend counts={stats.hourCounts} />
                            {stats.peakHours.length > 0 && (
                                <div className="mt-4 text-sm text-gray-600">
                                    Horas pico:{' '}
                                    <span className="font-semibold">
                                        {stats.peakHours.map((item) => `${item.hour.toString().padStart(2, '0')}:00`).join(', ')}
                                    </span>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="bg-white">
                        <CardHeader>
                            <CardTitle className="text-lg">Productos y Combos Más Vendidos</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <PieChart data={stats.pieData} />
                        </CardContent>
                    </Card>

                    <Card className="bg-white">
                        <CardHeader>
                            <CardTitle className="text-lg">Top Ventas</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {stats.items.slice(0, 10).map((item, index) => (
                                <div key={item.label} className="flex items-center justify-between text-sm border-b border-gray-100 pb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-400">#{index + 1}</span>
                                        <span className="font-medium text-gray-700">{item.label}</span>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-semibold">{item.quantity} vendidos</div>
                                        <div className="text-xs text-gray-500">{formatCurrency(item.revenue)}</div>
                                    </div>
                                </div>
                            ))}
                            {stats.items.length === 0 && (
                                <div className="text-sm text-gray-500">No hay productos vendidos en el rango seleccionado.</div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="text-xs text-gray-500">
                    Las métricas de ventas se calculan solo con pedidos pagados y no cancelados.
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value }: { title: string; value: string }) {
    return (
        <Card className="bg-white">
            <CardContent className="p-6">
                <div className="text-sm text-gray-600 mb-1">{title}</div>
                <div className="text-2xl font-bold text-[#0D0D0D]">{value}</div>
            </CardContent>
        </Card>
    );
}
