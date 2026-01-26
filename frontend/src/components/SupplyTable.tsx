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
            <div className="text-center py-12 text-muted-foreground">
                No hay insumos registrados
            </div>
        );
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Categoría</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {supplies.map((supply) => (
                        <TableRow key={supply.id}>
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
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onDelete(supply.id)}
                                    >
                                        <Trash2 className="h-4 w-4 text-destructive" />
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
