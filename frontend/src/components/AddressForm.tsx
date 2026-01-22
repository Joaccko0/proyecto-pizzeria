import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Address, AddressRequest } from '../types/customer.types';
import { toast } from 'sonner';

interface AddressFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (address: AddressRequest) => Promise<boolean>;
    editingAddress?: Address;
}

const emptyForm: AddressRequest = {
    street: '',
    number: '',
    description: ''
};

/**
 * Formulario modal para crear/editar direcciones
 */
export function AddressForm({ open, onOpenChange, onSubmit, editingAddress }: AddressFormProps) {
    const [formData, setFormData] = useState<AddressRequest>(emptyForm);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (editingAddress && open) {
            setFormData({
                street: editingAddress.street,
                number: editingAddress.number,
                description: editingAddress.description || ''
            });
        } else if (open) {
            setFormData(emptyForm);
        }
    }, [open, editingAddress]);

    const handleChange = (field: keyof AddressRequest, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        if (!formData.street.trim() || !formData.number.trim()) {
            toast.error('Por favor completa todos los campos requeridos');
            return;
        }

        setIsSubmitting(true);
        const success = await onSubmit(formData);
        setIsSubmitting(false);

        if (success) {
            setFormData(emptyForm);
            onOpenChange(false);
        }
    };

    const isEditMode = !!editingAddress;
    const title = isEditMode ? 'Editar Dirección' : 'Agregar Nueva Dirección';

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-white max-w-md">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                    {/* Calle */}
                    <div className="grid gap-2">
                        <Label htmlFor="street" className="text-sm">Calle</Label>
                        <Input
                            id="street"
                            value={formData.street}
                            onChange={(e) => handleChange('street', e.target.value)}
                            placeholder="Ej: Av. Corrientes"
                            required
                            className="h-10 focus-visible:ring-0 focus:border-[#F24452]"
                        />
                    </div>

                    {/* Número */}
                    <div className="grid gap-2">
                        <Label htmlFor="number" className="text-sm">Número</Label>
                        <Input
                            id="number"
                            value={formData.number}
                            onChange={(e) => handleChange('number', e.target.value)}
                            placeholder="Ej: 1234"
                            required
                            className="h-10 focus-visible:ring-0 focus:border-[#F24452]"
                        />
                    </div>

                    {/* Descripción */}
                    <div className="grid gap-2">
                        <Label htmlFor="description" className="text-sm">Referencias (opcional)</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                            placeholder="Ej: Piso 2, Depto. A - Timbre rojo"
                            className="min-h-[80px] focus-visible:ring-0 focus:border-[#F24452]"
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button 
                        variant="outline" 
                        onClick={() => onOpenChange(false)}
                        disabled={isSubmitting}
                        className="cursor-pointer"
                    >
                        Cancelar
                    </Button>
                    <Button 
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="bg-[#F24452] hover:bg-[#d93a48] cursor-pointer"
                    >
                        {isSubmitting ? 'Guardando...' : (isEditMode ? 'Guardar Cambios' : 'Agregar Dirección')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
