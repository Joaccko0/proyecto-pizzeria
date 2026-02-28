import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2 } from 'lucide-react';
import { SupplyCategory } from '@/types/supply.types';
import type { Supply } from '@/types/supply.types';

interface SupplyTableProps {
    supplies: Supply[];
    onEdit: (supply: Supply) => void;
    onDelete: (id: number) => void;
}

const getCategoryLabel = (category: string): string => {
    switch (category) {
        case SupplyCategory.STOCK:
            return 'Stock';
        case SupplyCategory.SERVICE:
            return 'Servicio';
        case SupplyCategory.FIXED_COST:
            return 'Costo Fijo';
        default:
            return category;
    }
};

const getCategoryColor = (category: string): string => {
    switch (category) {
        case SupplyCategory.STOCK:
            return 'bg-blue-500';
        case SupplyCategory.SERVICE:
            return 'bg-green-500';
        case SupplyCategory.FIXED_COST:
            return 'bg-orange-500';
        default:
            return 'bg-gray-500';
    }
};

export function SupplyTable({ supplies, onEdit, onDelete }: SupplyTableProps) {
    if (supplies.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
                <div className="text-gray-400 text-sm mb-1">📦 No hay insumos registrados</div>
                <div className="text-xs text-gray-500">Crea tu primer insumo usando el botón de arriba</div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border-2 border-[#E5D9D1] overflow-hidden">
            <Table>
                <TableHeader className="bg-gradient-to-r from-[#F2EDE4] to-[#F8F4F0]">
                    <TableRow className="border-b-2 border-[#E5D9D1]">
                        <TableHead className="font-bold text-[#262626]">Nombre</TableHead>
                        <TableHead className="font-bold text-[#262626]">Categoría</TableHead>
                        <TableHead className="text-right font-bold text-[#262626]">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {supplies.map((supply) => (
                        <TableRow key={supply.id} className="hover:bg-[#FFF9F5] transition-colors border-b border-[#E5D9D1]/50">
                            <TableCell className="font-medium">{supply.name}</TableCell>
                            <TableCell>
                                <Badge className={`${getCategoryColor(supply.category)} text-white`}>
                                    {getCategoryLabel(supply.category)}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onEdit(supply)}
                                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 cursor-pointer"
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onDelete(supply.id)}
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
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
