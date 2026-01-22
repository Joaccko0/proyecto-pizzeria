import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Customer, CustomerRequest } from '../types/customer.types';
import { toast } from 'sonner';

interface CustomerFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (customer: CustomerRequest) => Promise<boolean>;
    editingCustomer?: Customer;
}

const emptyForm: CustomerRequest = {
    name: '',
    phone: ''
};

/**
 * Formulario modal para crear/editar clientes
 * Soporta ambos modos: crear nuevo y editar existente
 */
export function CustomerForm({ open, onOpenChange, onSubmit, editingCustomer }: CustomerFormProps) {
    const [formData, setFormData] = useState<CustomerRequest>(emptyForm);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (editingCustomer && open) {
            setFormData({
                name: editingCustomer.name,
                phone: editingCustomer.phone
            });
        } else if (open) {
            setFormData(emptyForm);
        }
    }, [open, editingCustomer]);

    const handleChange = (field: keyof CustomerRequest, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        if (!formData.name.trim() || !formData.phone.trim()) {
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

    const isEditMode = !!editingCustomer;
    const title = isEditMode ? 'Editar Cliente' : 'Crear Nuevo Cliente';

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-white max-w-md">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                    {/* Nombre */}
                    <div className="grid gap-2">
                        <Label htmlFor="name" className="text-sm">Nombre Completo</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            placeholder="Ej: Juan Pérez"
                            required
                            className="h-10 focus-visible:ring-0 focus:border-[#F24452]"
                        />
                    </div>

                    {/* Teléfono */}
                    <div className="grid gap-2">
                        <Label htmlFor="phone" className="text-sm">Teléfono</Label>
                        <Input
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => handleChange('phone', e.target.value)}
                            placeholder="Ej: +54 9 11 1234-5678"
                            required
                            className="h-10 focus-visible:ring-0 focus:border-[#F24452]"
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
                        {isSubmitting ? 'Guardando...' : (isEditMode ? 'Guardar Cambios' : 'Crear Cliente')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
