import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, Eye, Calendar } from 'lucide-react';
import type { Expense } from '../types/expense.types';

interface ExpenseTableProps {
    expenses: Expense[];
    isLoading: boolean;
    onEdit: (expense: Expense) => void;
    onDelete: (id: number) => void;
    onView: (expense: Expense) => void;
}

/**
 * Tabla de gastos con acciones de ver, editar y eliminar
 */
export function ExpenseTable({ expenses, isLoading, onEdit, onDelete, onView }: ExpenseTableProps) {
    
    // Función helper para formatear fecha
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-AR', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };

    // Función helper para formatear moneda
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS'
        }).format(amount);
    };

    if (isLoading) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-[#E5D9D1] overflow-hidden">
                <Table>
                    <TableHeader className="bg-[#F2EDE4]">
                        <TableRow>
                            <TableHead className="font-bold text-[#262626]">Fecha</TableHead>
                            <TableHead className="font-bold text-[#262626]">Proveedor</TableHead>
                            <TableHead className="font-bold text-[#262626]">Detalle</TableHead>
                            <TableHead className="font-bold text-[#262626] text-right">Total</TableHead>
                            <TableHead className="text-right font-bold text-[#262626]">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell colSpan={5} className="text-center py-8">
                                Cargando gastos...
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        );
    }

    if (expenses.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-[#E5D9D1] overflow-hidden">
                <Table>
                    <TableHeader className="bg-[#F2EDE4]">
                        <TableRow>
                            <TableHead className="font-bold text-[#262626]">Fecha</TableHead>
                            <TableHead className="font-bold text-[#262626]">Proveedor</TableHead>
                            <TableHead className="font-bold text-[#262626]">Detalle</TableHead>
                            <TableHead className="font-bold text-[#262626] text-right">Total</TableHead>
                            <TableHead className="text-right font-bold text-[#262626]">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                                No hay gastos registrados.
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-[#E5D9D1] overflow-hidden">
            <Table>
                <TableHeader className="bg-[#F2EDE4]">
                    <TableRow>
                        <TableHead className="font-bold text-[#262626]">Fecha</TableHead>
                        <TableHead className="font-bold text-[#262626]">Proveedor</TableHead>
                        <TableHead className="font-bold text-[#262626]">Detalle</TableHead>
                        <TableHead className="font-bold text-[#262626] text-right">Total</TableHead>
                        <TableHead className="text-right font-bold text-[#262626]">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {expenses.map((expense) => (
                        <TableRow key={expense.id}>
                            {/* Fecha */}
                            <TableCell className="font-medium">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-gray-400" />
                                    {formatDate(expense.date)}
                                </div>
                            </TableCell>

                            {/* Proveedor */}
                            <TableCell>
                                {expense.supplierName || (
                                    <span className="text-gray-400 text-sm italic">Sin proveedor</span>
                                )}
                            </TableCell>

                            {/* Nombres de items */}
                            <TableCell className="text-sm text-gray-700">
                                {expense.items.length === 0 ? (
                                    <span className="text-gray-400 italic">Sin ítems</span>
                                ) : (
                                    <span className="line-clamp-2">
                                        {expense.items
                                            .map((item) => item.supplyName || `Insumo #${item.supplyId}`)
                                            .join(', ')}
                                    </span>
                                )}
                            </TableCell>

                            {/* Total */}
                            <TableCell className="text-right font-bold text-[#F24452]">
                                {formatCurrency(expense.total)}
                            </TableCell>

                            {/* Acciones */}
                            <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onView(expense)}
                                        className="text-green-600 hover:text-green-700 hover:bg-green-50 cursor-pointer"
                                        title="Ver detalles"
                                    >
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onEdit(expense)}
                                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 cursor-pointer"
                                        title="Editar"
                                    >
                                        <Edit2 className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onDelete(expense.id)}
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                                        title="Eliminar"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
