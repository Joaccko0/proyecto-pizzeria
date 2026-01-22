import { useState, useEffect } from 'react';
import { useBusiness } from '../context/BusinessContext';
import { useCustomers } from '../hooks/useCustomers';
import { useSearch } from '../hooks/useSearch';
import { Plus, Search, Users } from 'lucide-react';

import { CustomerForm } from '../components/CustomerForm';
import { CustomerTable } from '../components/CustomerTable';
import { AddressManagerDialog } from '../components/AddressManagerDialog';
import { ConfirmDialog } from '../components/ConfirmDialog';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import type { Customer } from '../types/customer.types';

/**
 * Página de gestión de clientes
 * Funcionalidades: CRUD completo de clientes y sus direcciones
 */
export default function CustomersPage() {
    const { currentBusiness } = useBusiness();
    
    // Hook de lógica de negocio
    const { customers, isLoading, createCustomer, updateCustomer, deleteCustomer, loadCustomers } = useCustomers(
        currentBusiness?.id || null
    );

    // Estado de búsqueda
    const [searchTerm, setSearchTerm] = useState('');
    const filteredCustomers = useSearch(customers, searchTerm, ['name', 'phone']);

    // Estados de modales
    const [isCustomerFormOpen, setIsCustomerFormOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
    const [customerToDelete, setCustomerToDelete] = useState<number | null>(null);
    
    // Estado para gestión de direcciones
    const [isAddressManagerOpen, setIsAddressManagerOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

    // Manejadores de clientes
    const handleOpenCustomerForm = (customer?: Customer) => {
        if (customer) {
            setEditingCustomer(customer);
        } else {
            setEditingCustomer(null);
        }
        setIsCustomerFormOpen(true);
    };

    const handleSubmitCustomer = async (formData: any) => {
        if (editingCustomer) {
            return await updateCustomer(editingCustomer.id, formData);
        } else {
            return await createCustomer(formData);
        }
    };

    const handleDeleteCustomerClick = (id: number) => {
        setCustomerToDelete(id);
    };

    const handleConfirmDeleteCustomer = async () => {
        if (customerToDelete) {
            await deleteCustomer(customerToDelete);
            setCustomerToDelete(null);
        }
    };

    // Manejadores de direcciones
    const handleManageAddresses = (customer: Customer) => {
        setSelectedCustomer(customer);
        setIsAddressManagerOpen(true);
    };

    const handleAddressesChanged = async () => {
        await loadCustomers();
    };

    // Actualizar el cliente seleccionado cuando se actualicen los clientes
    useEffect(() => {
        if (selectedCustomer) {
            const updatedCustomer = customers.find(c => c.id === selectedCustomer.id);
            if (updatedCustomer) {
                setSelectedCustomer(updatedCustomer);
            }
        }
    }, [customers]);

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-[#0D0D0D] flex items-center gap-2">
                        <Users className="h-8 w-8 text-[#F24452]" />
                        Clientes
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Gestiona tus clientes y sus direcciones de entrega
                    </p>
                </div>
                
                <Button
                    onClick={() => handleOpenCustomerForm()}
                    className="bg-[#F24452] hover:bg-[#d93a48] text-white cursor-pointer"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Nuevo Cliente
                </Button>
            </div>

            {/* Barra de búsqueda */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-[#E5D9D1]">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                        type="text"
                        placeholder="Buscar clientes por nombre o teléfono..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 h-11 focus-visible:ring-0 focus:border-[#F24452]"
                    />
                </div>
            </div>

            {/* Tabla de clientes */}
            <CustomerTable
                customers={filteredCustomers}
                isLoading={isLoading}
                onEdit={handleOpenCustomerForm}
                onDelete={handleDeleteCustomerClick}
                onManageAddresses={handleManageAddresses}
            />

            {/* Formulario de cliente */}
            <CustomerForm
                open={isCustomerFormOpen}
                onOpenChange={setIsCustomerFormOpen}
                onSubmit={handleSubmitCustomer}
                editingCustomer={editingCustomer || undefined}
            />

            {/* Gestor de direcciones */}
            <AddressManagerDialog
                open={isAddressManagerOpen}
                onOpenChange={setIsAddressManagerOpen}
                customer={selectedCustomer}
                businessId={currentBusiness?.id || 0}
                onAddressesChanged={handleAddressesChanged}
            />

            {/* Confirmación de eliminación de cliente */}
            <ConfirmDialog
                open={!!customerToDelete}
                onOpenChange={(open) => !open && setCustomerToDelete(null)}
                onConfirm={handleConfirmDeleteCustomer}
                title="Eliminar Cliente"
                description="¿Estás seguro de que deseas eliminar este cliente? Los datos históricos se mantendrán para estadísticas."
            />
        </div>
    );
}
