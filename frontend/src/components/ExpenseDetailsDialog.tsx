import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, Building2, Receipt } from 'lucide-react';
import type { Expense } from '../types/expense.types';

interface ExpenseDetailsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    expense: Expense | null;
}

/**
 * Diálogo para mostrar detalles completos de un gasto
 * Muestra proveedor, fecha, items detallados y total
 */
export function ExpenseDetailsDialog({ open, onOpenChange, expense }: ExpenseDetailsDialogProps) {
    if (!expense) return null;

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-AR', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS'
        }).format(amount);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-white max-w-3xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Receipt className="h-5 w-5 text-[#F24452]" />
                        Detalle del Gasto #{expense.id}
                    </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-6">
                    {/* Información general */}
                    <div className="grid grid-cols-2 gap-4 p-4 bg-[#F2EDE4] rounded-lg">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <div>
                                <div className="text-xs text-gray-500">Fecha</div>
                                <div className="font-medium">{formatDate(expense.date)}</div>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-gray-500" />
                            <div>
                                <div className="text-xs text-gray-500">Proveedor</div>
                                <div className="font-medium">
                                    {expense.supplierName || (
                                        <span className="text-gray-400 italic">Sin proveedor (gasto interno)</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Items del gasto */}
                    <div>
                        <h3 className="font-semibold mb-3">Líneas del Gasto</h3>
                        <div className="border border-[#E5D9D1] rounded-lg overflow-hidden">
                            <Table>
                                <TableHeader className="bg-[#F2EDE4]">
                                    <TableRow>
                                        <TableHead className="font-bold">Insumo</TableHead>
                                        <TableHead className="font-bold text-right">Cantidad</TableHead>
                                        <TableHead className="font-bold text-right">Precio Unitario</TableHead>
                                        <TableHead className="font-bold text-right">Subtotal</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {expense.items.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell className="font-medium">
                                                {item.supplyName}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {item.quantity}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {formatCurrency(item.unitPrice)}
                                            </TableCell>
                                            <TableCell className="text-right font-semibold">
                                                {formatCurrency(item.subtotal)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>

                    {/* Total */}
                    <div className="flex justify-end items-center gap-4 p-4 bg-[#F2EDE4] rounded-lg">
                        <span className="text-lg font-semibold">Total del Gasto:</span>
                        <span className="text-2xl font-bold text-[#F24452]">
                            {formatCurrency(expense.total)}
                        </span>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
