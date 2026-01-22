import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, Edit2, Trash2, MapPin } from 'lucide-react';
import { AddressForm } from './AddressForm';
import { ConfirmDialog } from './ConfirmDialog';
import { CustomerService } from '../services/customer.service';
import type { Customer, Address, AddressRequest } from '../types/customer.types';
import { toast } from 'sonner';

interface AddressManagerDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    customer: Customer | null;
    businessId: number;
    onAddressesChanged: () => void;
}

/**
 * Diálogo para gestionar las direcciones de un cliente
 */
export function AddressManagerDialog({ open, onOpenChange, customer, businessId, onAddressesChanged }: AddressManagerDialogProps) {
    const [isAddressFormOpen, setIsAddressFormOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);
    const [addressToDelete, setAddressToDelete] = useState<number | null>(null);

    if (!customer) return null;

    const handleOpenAddressForm = (address?: Address) => {
        if (address) {
            setEditingAddress(address);
        } else {
            setEditingAddress(null);
        }
        setIsAddressFormOpen(true);
    };

    const handleSubmitAddress = async (formData: AddressRequest): Promise<boolean> => {
        try {
            if (editingAddress) {
                await CustomerService.updateAddress(businessId, customer.id, editingAddress.id, formData);
                toast.success('Dirección actualizada exitosamente');
            } else {
                await CustomerService.createAddress(businessId, customer.id, formData);
                toast.success('Dirección agregada exitosamente');
            }
            onAddressesChanged();
            return true;
        } catch (err) {
            toast.error('Error al guardar la dirección');
            console.error(err);
            return false;
        }
    };

    const handleDeleteAddressClick = (addressId: number) => {
        setAddressToDelete(addressId);
    };

    const handleConfirmDeleteAddress = async () => {
        if (!addressToDelete) return;
        
        try {
            await CustomerService.deleteAddress(businessId, customer.id, addressToDelete);
            toast.success('Dirección eliminada correctamente');
            onAddressesChanged();
        } catch (err) {
            toast.error('Error al eliminar la dirección');
            console.error(err);
        } finally {
            setAddressToDelete(null);
        }
    };

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="bg-white max-w-2xl max-h-[85vh]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-[#F24452]" />
                            Direcciones de {customer.name}
                        </DialogTitle>
                    </DialogHeader>
                    
                    <div className="py-4">
                        {/* Botón para agregar nueva dirección */}
                        <div className="mb-4">
                            <Button
                                onClick={() => handleOpenAddressForm()}
                                className="bg-[#F24452] hover:bg-[#d93a48] cursor-pointer"
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Agregar Dirección
                            </Button>
                        </div>

                        {/* Lista de direcciones */}
                        <div className="space-y-3">
                            {customer.addresses.length === 0 ? (
                                <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                                    Este cliente no tiene direcciones registradas.
                                </div>
                            ) : (
                                customer.addresses.map((address) => (
                                    <div
                                        key={address.id}
                                        onClick={() => handleOpenAddressForm(address)}
                                        className="flex items-start justify-between p-4 border border-[#E5D9D1] rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                                    >
                                        <div className="flex-1">
                                            <div className="font-medium text-[#262626]">
                                                {address.street} {address.number}
                                            </div>
                                            {address.description && (
                                                <div className="text-sm text-gray-500 mt-1">
                                                    {address.description}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex gap-2 ml-4" onClick={(e) => e.stopPropagation()}>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleOpenAddressForm(address);
                                                }}
                                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 cursor-pointer"
                                            >
                                                <Edit2 className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteAddressClick(address.id);
                                                }}
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Formulario de dirección */}
            <AddressForm
                open={isAddressFormOpen}
                onOpenChange={setIsAddressFormOpen}
                onSubmit={handleSubmitAddress}
                editingAddress={editingAddress || undefined}
            />

            {/* Confirmación de eliminación */}
            <ConfirmDialog
                open={!!addressToDelete}
                onOpenChange={(open) => !open && setAddressToDelete(null)}
                onConfirm={handleConfirmDeleteAddress}
                title="Eliminar Dirección"
                description="¿Estás seguro de que deseas eliminar esta dirección? Esta acción no se puede deshacer."
            />
        </>
    );
}
