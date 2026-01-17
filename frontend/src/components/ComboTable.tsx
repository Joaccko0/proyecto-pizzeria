import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from 'lucide-react';
import type { Combo } from '../types/inventory.types';

interface ComboTableProps {
    combos: Combo[];
    isLoading: boolean;
    onEdit: (combo: Combo) => void;
    onDelete: (id: number) => void;
}

/**
 * Tabla de combos con acciones de editar y eliminar
 * Muestra información de productos incluidos
 */
export function ComboTable({ combos, isLoading, onEdit, onDelete }: ComboTableProps) {
    
    // Estado de carga
    if (isLoading) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-[#E5D9D1] overflow-hidden">
                <Table>
                    <TableHeader className="bg-[#F2EDE4]">
                        <TableRow>
                            <TableHead className="font-bold text-[#262626]">Nombre</TableHead>
                            <TableHead className="font-bold text-[#262626]">Productos</TableHead>
                            <TableHead className="font-bold text-[#262626]">Precio</TableHead>
                            <TableHead className="text-right font-bold text-[#262626]">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell colSpan={4} className="text-center py-8">
                                Cargando combos...
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        );
    }

    // Lista vacía
    if (combos.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-[#E5D9D1] overflow-hidden">
                <Table>
                    <TableHeader className="bg-[#F2EDE4]">
                        <TableRow>
                            <TableHead className="font-bold text-[#262626]">Nombre</TableHead>
                            <TableHead className="font-bold text-[#262626]">Productos</TableHead>
                            <TableHead className="font-bold text-[#262626]">Precio</TableHead>
                            <TableHead className="text-right font-bold text-[#262626]">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                                No hay combos registrados.
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        );
    }

    // Tabla con datos
    return (
        <div className="bg-white rounded-lg shadow-sm border border-[#E5D9D1] overflow-hidden">
            <Table>
                <TableHeader className="bg-[#F2EDE4]">
                    <TableRow>
                        <TableHead className="font-bold text-[#262626]">Nombre</TableHead>
                        <TableHead className="font-bold text-[#262626]">Productos</TableHead>
                        <TableHead className="font-bold text-[#262626]">Precio</TableHead>
                        <TableHead className="text-right font-bold text-[#262626]">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {combos.map((combo) => (
                        <TableRow key={combo.id}>
                            {/* Nombre */}
                            <TableCell className="font-medium">{combo.name}</TableCell>

                            {/* Productos incluidos */}
                            <TableCell>
                                <div className="text-sm">
                                    {combo.items.map((item, idx) => (
                                        <div key={idx} className="text-xs text-gray-600">
                                            {item.productName} x{item.quantity}
                                        </div>
                                    ))}
                                </div>
                            </TableCell>

                            {/* Precio formateado */}
                            <TableCell className="font-medium">
                                ${combo.price.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                            </TableCell>

                            {/* Acciones */}
                            <TableCell className="text-right space-x-2">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                                    onClick={() => onEdit(combo)}
                                >
                                    <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                    onClick={() => onDelete(combo.id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
