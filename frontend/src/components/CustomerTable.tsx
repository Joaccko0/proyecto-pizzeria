import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, MapPin } from 'lucide-react';
import type { Customer } from '../types/customer.types';

interface CustomerTableProps {
    customers: Customer[];
    isLoading: boolean;
    onEdit: (customer: Customer) => void;
    onDelete: (id: number) => void;
    onManageAddresses: (customer: Customer) => void;
}

/**
 * Tabla de clientes con acciones de editar, eliminar y gestionar direcciones
 */
export function CustomerTable({ customers, isLoading, onEdit, onDelete, onManageAddresses }: CustomerTableProps) {
    
    if (isLoading) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-[#E5D9D1] overflow-hidden">
                <Table>
                    <TableHeader className="bg-[#F2EDE4]">
                        <TableRow>
                            <TableHead className="font-bold text-[#262626]">Nombre</TableHead>
                            <TableHead className="font-bold text-[#262626]">Teléfono</TableHead>
                            <TableHead className="font-bold text-[#262626]">Direcciones</TableHead>
                            <TableHead className="text-right font-bold text-[#262626]">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell colSpan={4} className="text-center py-8">
                                Cargando clientes...
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        );
    }

    if (customers.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-[#E5D9D1] overflow-hidden">
                <Table>
                    <TableHeader className="bg-[#F2EDE4]">
                        <TableRow>
                            <TableHead className="font-bold text-[#262626]">Nombre</TableHead>
                            <TableHead className="font-bold text-[#262626]">Teléfono</TableHead>
                            <TableHead className="font-bold text-[#262626]">Direcciones</TableHead>
                            <TableHead className="text-right font-bold text-[#262626]">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                                No hay clientes registrados.
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
                        <TableHead className="font-bold text-[#262626]">Nombre</TableHead>
                        <TableHead className="font-bold text-[#262626]">Teléfono</TableHead>
                        <TableHead className="font-bold text-[#262626]">Direcciones</TableHead>
                        <TableHead className="text-right font-bold text-[#262626]">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {customers.map((customer) => (
                        <TableRow key={customer.id}>
                            {/* Nombre */}
                            <TableCell className="font-medium">
                                {customer.name}
                            </TableCell>

                            {/* Teléfono */}
                            <TableCell>
                                {customer.phone}
                            </TableCell>

                            {/* Direcciones */}
                            <TableCell>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onManageAddresses(customer)}
                                    className="text-[#F24452] hover:text-[#d93a48] hover:bg-[#FFF5F5] cursor-pointer"
                                >
                                    <MapPin className="mr-1 h-4 w-4" />
                                    {customer.addresses.length} {customer.addresses.length === 1 ? 'dirección' : 'direcciones'}
                                </Button>
                            </TableCell>

                            {/* Acciones */}
                            <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onEdit(customer)}
                                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 cursor-pointer"
                                    >
                                        <Edit2 className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onDelete(customer.id)}
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
