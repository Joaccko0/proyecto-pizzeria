/**
 * Dialog para cerrar caja
 * Calcula automáticamente el monto esperado (inicial + ventas) y muestra advertencia si hay diferencia
 */

import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, AlertTriangle } from 'lucide-react';
import type { CashShiftResponse } from '../types/cashshift.types';
import type { OrderResponse } from '../types/order.types';

interface CloseCashDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (endAmount: number) => Promise<any>;
    cashShift: CashShiftResponse | null;
    orders: OrderResponse[]; // Órdenes del turno actual
    onClosed?: () => void; // Callback cuando se cierra la caja exitosamente
    loading?: boolean;
}

export function CloseCashDialog({
    open,
    onOpenChange,
    onSubmit,
    cashShift,
    orders,
    onClosed,
    loading = false
}: CloseCashDialogProps) {
    const [endAmount, setEndAmount] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [showConfirm, setShowConfirm] = useState(false);

    // Filtrar solo ordenes del cashShift actual
    const currentCashShiftOrders = orders.filter(
        (order) => order.cashShiftId === cashShift?.id
    );

    // Calcular monto de ventas (dinero en efectivo recibido)
    const calculateSalesAmount = () => {
        return currentCashShiftOrders
            .filter((order) => order.paymentMethod === 'CASH') // Solo pagos en efectivo
            .reduce((sum, order) => sum + order.total, 0);
    };

    // Calcular desglose por método de pago
    const calculatePaymentBreakdown = () => {
        const breakdown = {
            CASH: 0,
            CARD: 0,
            TRANSFER: 0,
        };

        currentCashShiftOrders.forEach((order) => {
            if (order.paymentMethod in breakdown) {
                breakdown[order.paymentMethod as keyof typeof breakdown] += order.total;
            }
        });

        return breakdown;
    };

    // Detectar pedidos no pagados (excluir cancelados)
    const unpaidOrders = currentCashShiftOrders.filter(
        (order) => order.paymentStatus !== 'PAID' && order.orderStatus !== 'CANCELLED'
    );
    const hasUnpaidOrders = unpaidOrders.length > 0;

    const startAmount = cashShift?.startAmount || 0;
    const salesAmount = calculateSalesAmount();
    const expectedAmount = startAmount + salesAmount;
    const paymentBreakdown = calculatePaymentBreakdown();

    const handleSubmit = async () => {
        setError('');

        // Validaciones
        if (!endAmount.trim()) {
            setError('Por favor ingresa el monto final');
            return;
        }

        const amount = parseFloat(endAmount);
        if (isNaN(amount)) {
            setError('El monto debe ser un número válido');
            return;
        }

        if (amount < 0) {
            setError('El monto no puede ser negativo');
            return;
        }

        // Verificar si hay diferencia
        const difference = Math.abs(expectedAmount - amount);
        if (difference > 0.01) {
            // Mostrar diálogo de confirmación si hay diferencia
            setShowConfirm(true);
            return;
        }

        // Si no hay diferencia, cerrar directamente
        await performClose(amount);
    };

    const performClose = async (amount: number) => {
        try {
            await onSubmit(amount);
            setEndAmount('');
            onOpenChange(false);
            // Llamar callback para recargar órdenes
            if (onClosed) {
                onClosed();
            }
        } catch (err) {
            console.error('Error closing cash:', err);
        }
    };

    const handleOpenChange = (newOpen: boolean) => {
        if (!loading) {
            setEndAmount('');
            setError('');
            setShowConfirm(false);
            onOpenChange(newOpen);
        }
    };

    const difference = expectedAmount - parseFloat(endAmount || '0');
    const isDifference = Math.abs(difference) > 0.01;

    return (
        <>
            <Dialog open={open} onOpenChange={handleOpenChange}>
                <DialogContent className="bg-white sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <DollarSign className="w-5 h-5 text-[#F24452]" />
                            Cerrar Caja
                        </DialogTitle>
                        <DialogDescription>
                            Verifica el monto esperado y registra el monto final en la caja
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        {/* Advertencia de pedidos no pagados */}
                        {hasUnpaidOrders && (
                            <Card className="border-red-300 bg-red-50">
                                <CardContent className="pt-4">
                                    <div className="flex items-start gap-3">
                                        <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                                        <div className="text-red-800">
                                            <p className="font-semibold mb-1">⚠️ Hay {unpaidOrders.length} pedido{unpaidOrders.length > 1 ? 's' : ''} sin pagar</p>
                                            <p className="text-sm">
                                                Verifica que todos los pedidos estén pagados antes de cerrar la caja.
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Resumen de caja */}
                        <Card className="bg-white border-[#E5D9D1]">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm">Resumen de Turno</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between items-center py-2 border-b">
                                    <span className="text-sm text-gray-600">Monto Inicial:</span>
                                    <span className="font-semibold">${startAmount.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b">
                                    <span className="text-sm text-gray-600">Ventas (efectivo):</span>
                                    <span className="font-semibold text-green-600">${salesAmount.toFixed(2)}</span>
                                </div>
                                
                                {/* Desglose por método de pago */}
                                <div className="py-2 border-b">
                                    <p className="text-xs text-gray-500 mb-2">Recaudación por método:</p>
                                    <div className="space-y-1 pl-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">💵 Efectivo:</span>
                                            <span className="font-medium">${paymentBreakdown.CASH.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">💳 Tarjeta:</span>
                                            <span className="font-medium">${paymentBreakdown.CARD.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">🏦 Transferencia:</span>
                                            <span className="font-medium">${paymentBreakdown.TRANSFER.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm font-semibold pt-1 border-t">
                                            <span className="text-gray-800">Total recaudado:</span>
                                            <span className="text-green-600">${(paymentBreakdown.CASH + paymentBreakdown.CARD + paymentBreakdown.TRANSFER).toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex justify-between items-center py-2 bg-[#F2EDE4] px-3 rounded">
                                    <span className="text-sm font-semibold">Monto Esperado en Caja:</span>
                                    <span className="font-bold text-lg">${expectedAmount.toFixed(2)}</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Input monto final */}
                        <div className="space-y-2">
                            <Label htmlFor="endAmount">Monto Final en Caja</Label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
                                    $
                                </span>
                                <Input
                                    id="endAmount"
                                    type="number"
                                    placeholder="0.00"
                                    value={endAmount}
                                    onChange={(e) => {
                                        setEndAmount(e.target.value);
                                        setError('');
                                    }}
                                    className="pl-8 bg-[#F2EDE4] border-[#E5D9D1] focus:border-[#F24452] focus:ring-0"
                                    min="0"
                                    step="0.01"
                                    disabled={loading}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter' && !loading) {
                                            handleSubmit();
                                        }
                                    }}
                                />
                            </div>
                            {error && <p className="text-sm text-red-500">{error}</p>}
                        </div>

                        {/* Mostrar diferencia si existe */}
                        {endAmount && isDifference && (
                            <Card className="border-orange-300 bg-orange-50">
                                <CardContent className="pt-4">
                                    <div className="flex items-start gap-3">
                                        <AlertTriangle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                                        <div className="text-orange-800">
                                            <p className="font-semibold mb-1">Diferencia detectada:</p>
                                            <p className="text-sm">
                                                Se esperaba ${expectedAmount.toFixed(2)} pero registraste $
                                                {parseFloat(endAmount).toFixed(2)} ({difference > 0 ? '+' : ''}
                                                ${difference.toFixed(2)})
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => handleOpenChange(false)}
                            disabled={loading}
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="bg-[#F24452] hover:bg-[#d63c47]"
                        >
                            {loading ? 'Cerrando...' : 'Cerrar Caja'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Diálogo de confirmación si hay diferencia */}
            <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
                <AlertDialogContent className="bg-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-orange-600" />
                            Confirmar Diferencia en Caja
                        </AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogDescription>
                        <div className="space-y-3">
                            <p>
                                Se esperaba <strong>${expectedAmount.toFixed(2)}</strong> pero
                                registraste <strong>${parseFloat(endAmount).toFixed(2)}</strong>
                            </p>
                            <p>
                                <strong>Diferencia:</strong>{' '}
                                <span className={difference > 0 ? 'text-red-600' : 'text-green-600'}>
                                    {difference > 0 ? '-' : '+'} ${Math.abs(difference).toFixed(2)}
                                </span>
                            </p>
                            <p className="text-sm text-gray-500">
                                ¿Estás seguro de que deseas cerrar la caja con esta diferencia?
                            </p>
                        </div>
                    </AlertDialogDescription>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            disabled={loading}
                            onClick={() => performClose(parseFloat(endAmount))}
                            className="bg-[#F24452] hover:bg-[#d63c47]"
                        >
                            {loading ? 'Cerrando...' : 'Sí, cerrar caja'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
