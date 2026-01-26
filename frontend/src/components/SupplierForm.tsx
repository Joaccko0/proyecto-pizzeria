import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Supplier, SupplierRequest } from '../types/supplier.types';
import { toast } from 'sonner';

interface SupplierFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (supplier: SupplierRequest, id?: number) => Promise<boolean>;
    editingSupplier?: Supplier;
}

const emptyForm: SupplierRequest = {
    name: '',
    contactInfo: ''
};

/**
 * Formulario modal para crear/editar proveedores
 * Soporta ambos modos: crear nuevo y editar existente
 */
export function SupplierForm({ open, onOpenChange, onSubmit, editingSupplier }: SupplierFormProps) {
    const [formData, setFormData] = useState<SupplierRequest>(emptyForm);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (editingSupplier && open) {
            setFormData({
                name: editingSupplier.name,
                contactInfo: editingSupplier.contactInfo || ''
            });
        } else if (open) {
            setFormData(emptyForm);
        }
    }, [open, editingSupplier]);

    const handleChange = (field: keyof SupplierRequest, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        if (!formData.name.trim()) {
            toast.error('El nombre del proveedor es obligatorio');
            return;
        }

        setIsSubmitting(true);
        const success = await onSubmit(formData, editingSupplier?.id);
        setIsSubmitting(false);

        if (success) {
            setFormData(emptyForm);
            onOpenChange(false);
        }
    };

    const isEditMode = !!editingSupplier;
    const title = isEditMode ? 'Editar Proveedor' : 'Crear Nuevo Proveedor';

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-white max-w-md">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                    {/* Nombre */}
                    <div className="grid gap-2">
                        <Label htmlFor="name" className="text-sm">Nombre del Proveedor *</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            placeholder="Ej: Distribuidor X, Telecom Y"
                            required
                            className="h-10 focus-visible:ring-0 focus:border-[#F24452]"
                        />
                    </div>

                    {/* Información de contacto */}
                    <div className="grid gap-2">
                        <Label htmlFor="contactInfo" className="text-sm">Información de Contacto</Label>
                        <Textarea
                            id="contactInfo"
                            value={formData.contactInfo}
                            onChange={(e) => handleChange('contactInfo', e.target.value)}
                            placeholder="Teléfono, email, dirección, etc."
                            rows={4}
                            className="focus-visible:ring-0 focus:border-[#F24452]"
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
                        {isSubmitting ? 'Guardando...' : (isEditMode ? 'Guardar Cambios' : 'Crear Proveedor')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
