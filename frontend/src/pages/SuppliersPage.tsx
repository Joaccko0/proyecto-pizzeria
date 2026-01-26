import { useState } from 'react';
import { useBusiness } from '../context/BusinessContext';
import { useSuppliers } from '../hooks/useSuppliers';
import { useSearch } from '../hooks/useSearch';
import { Plus, Search, Building2 } from 'lucide-react';

import { SupplierForm } from '../components/SupplierForm';
import { SupplierTable } from '../components/SupplierTable';
import { ConfirmDialog } from '../components/ConfirmDialog';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import type { Supplier } from '../types/supplier.types';

/**
 * Página de gestión de proveedores
 * Funcionalidades: CRUD completo de proveedores
 */
export default function SuppliersPage() {
    const { currentBusiness } = useBusiness();
    
    // Hook de lógica de negocio
    const { suppliers, isLoading, createSupplier, updateSupplier, deleteSupplier } = useSuppliers(
        currentBusiness?.id || null
    );

    // Estado de búsqueda
    const [searchTerm, setSearchTerm] = useState('');
    const filteredSuppliers = useSearch(suppliers, searchTerm, ['name', 'contactInfo']);

    // Estados de modales
    const [isSupplierFormOpen, setIsSupplierFormOpen] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
    const [supplierToDelete, setSupplierToDelete] = useState<number | null>(null);

    // Manejadores de proveedores
    const handleOpenSupplierForm = (supplier?: Supplier) => {
        if (supplier) {
            setEditingSupplier(supplier);
        } else {
            setEditingSupplier(null);
        }
        setIsSupplierFormOpen(true);
    };

    const handleSubmitSupplier = async (formData: any) => {
        if (editingSupplier) {
            return await updateSupplier(editingSupplier.id, formData);
        } else {
            return await createSupplier(formData);
        }
    };

    const handleDeleteSupplierClick = (id: number) => {
        setSupplierToDelete(id);
    };

    const handleConfirmDeleteSupplier = async () => {
        if (supplierToDelete) {
            await deleteSupplier(supplierToDelete);
            setSupplierToDelete(null);
        }
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-[#0D0D0D] flex items-center gap-2">
                        <Building2 className="h-8 w-8 text-[#F24452]" />
                        Proveedores
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Gestiona tus proveedores de insumos y servicios
                    </p>
                </div>
                
                <Button
                    onClick={() => handleOpenSupplierForm()}
                    className="bg-[#F24452] hover:bg-[#d93a48] text-white cursor-pointer"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Nuevo Proveedor
                </Button>
            </div>

            {/* Barra de búsqueda */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-[#E5D9D1]">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                        type="text"
                        placeholder="Buscar proveedores por nombre o contacto..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 h-11 focus-visible:ring-0 focus:border-[#F24452]"
                    />
                </div>
            </div>

            {/* Tabla de proveedores */}
            <SupplierTable
                suppliers={filteredSuppliers}
                isLoading={isLoading}
                onEdit={handleOpenSupplierForm}
                onDelete={handleDeleteSupplierClick}
            />

            {/* Formulario de proveedor */}
            <SupplierForm
                open={isSupplierFormOpen}
                onOpenChange={setIsSupplierFormOpen}
                onSubmit={handleSubmitSupplier}
                editingSupplier={editingSupplier || undefined}
            />

            {/* Diálogo de confirmación de eliminación */}
            <ConfirmDialog
                open={!!supplierToDelete}
                onOpenChange={(open) => !open && setSupplierToDelete(null)}
                onConfirm={handleConfirmDeleteSupplier}
                title="Confirmar eliminación"
                description="¿Estás seguro de que deseas eliminar este proveedor? Esta acción no se puede deshacer."
            />
        </div>
    );
}
