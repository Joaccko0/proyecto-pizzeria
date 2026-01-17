import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from 'lucide-react';
import type { Product } from '../types/inventory.types';

interface ProductTableProps {
    products: Product[];
    isLoading: boolean;
    onEdit: (product: Product) => void;
    onDelete: (id: number) => void;
}

/**
 * Tabla de productos con acciones de editar y eliminar
 * Muestra lista de productos con opción de gestionar
 */
export function ProductTable({ products, isLoading, onEdit, onDelete }: ProductTableProps) {
    
    // Estado de carga
    if (isLoading) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-[#E5D9D1] overflow-hidden">
                <Table>
                    <TableHeader className="bg-[#F2EDE4]">
                        <TableRow>
                            <TableHead className="font-bold text-[#262626]">Nombre</TableHead>
                            <TableHead className="font-bold text-[#262626]">Categoría</TableHead>
                            <TableHead className="font-bold text-[#262626]">Precio</TableHead>
                            <TableHead className="text-right font-bold text-[#262626]">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell colSpan={4} className="text-center py-8">
                                Cargando menú...
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        );
    }

    // Lista vacía
    if (products.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-[#E5D9D1] overflow-hidden">
                <Table>
                    <TableHeader className="bg-[#F2EDE4]">
                        <TableRow>
                            <TableHead className="font-bold text-[#262626]">Nombre</TableHead>
                            <TableHead className="font-bold text-[#262626]">Categoría</TableHead>
                            <TableHead className="font-bold text-[#262626]">Precio</TableHead>
                            <TableHead className="text-right font-bold text-[#262626]">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                                No hay productos registrados.
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
                        <TableHead className="font-bold text-[#262626]">Categoría</TableHead>
                        <TableHead className="font-bold text-[#262626]">Precio</TableHead>
                        <TableHead className="text-right font-bold text-[#262626]">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {products.map((product) => (
                        <TableRow key={product.id}>
                            {/* Nombre y descripción */}
                            <TableCell>
                                <div className="font-medium">{product.title}</div>
                                {product.description && (
                                    <div className="text-xs text-gray-500">{product.description}</div>
                                )}
                            </TableCell>

                            {/* Categoría con badge */}
                            <TableCell>
                                <span className="px-2 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">
                                    {product.category}
                                </span>
                            </TableCell>

                            {/* Precio formateado */}
                            <TableCell className="font-medium">
                                ${product.price.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                            </TableCell>

                            {/* Acciones */}
                            <TableCell className="text-right space-x-2">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                                    onClick={() => onEdit(product)}
                                >
                                    <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                    onClick={() => onDelete(product.id)}
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
