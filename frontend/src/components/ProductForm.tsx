import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Product, ProductRequest } from '../types/inventory.types';

interface ProductFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (product: ProductRequest) => Promise<boolean>;
    editingProduct?: Product; // Si se proporciona, es modo edición
}

// Formulario inicial vacío
const emptyForm: ProductRequest = {
    title: '',
    description: '',
    price: 0,
    category: 'PIZZAS',
    active: true
};

/**
 * Formulario modal para crear/editar productos
 * Soporta ambos modos: crear nuevo y editar existente
 */
export function ProductForm({ open, onOpenChange, onSubmit, editingProduct }: ProductFormProps) {
    const [formData, setFormData] = useState<ProductRequest>(emptyForm);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Inicializar forma cuando se abre con un producto para editar
    useEffect(() => {
        if (editingProduct && open) {
            setFormData({
                title: editingProduct.title,
                description: editingProduct.description,
                price: editingProduct.price,
                category: editingProduct.category,
                active: editingProduct.active
            });
        } else if (open) {
            setFormData(emptyForm);
        }
    }, [open, editingProduct]);

    // Actualizar campo del formulario
    const handleChange = (field: keyof ProductRequest, value: string | number | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // Enviar formulario
    const handleSubmit = async () => {
        // Validación básica
        if (!formData.title.trim()) {
            return;
        }

        setIsSubmitting(true);
        const success = await onSubmit(formData);
        setIsSubmitting(false);

        if (success) {
            // Resetear y cerrar
            setFormData(emptyForm);
            onOpenChange(false);
        }
    };

    const isEditMode = !!editingProduct;
    const title = isEditMode ? 'Editar Producto' : 'Crear Nuevo Producto';

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-white max-w-2xl max-h-[85vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                
                <div className="grid gap-3 py-4 flex-1 overflow-y-auto overflow-x-hidden">
                    {/* Nombre */}
                    <div className="grid gap-1.5">
                        <Label htmlFor="title" className="text-sm">Nombre</Label>
                        <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => handleChange('title', e.target.value)}
                            placeholder="Ej: Pizza Muzzarella"
                            required
                            className="h-10 focus-visible:ring-0 focus:border-[#F24452] focus-visible:outline-none"
                        />
                    </div>

                    {/* Precio y Categoría */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="grid gap-1.5">
                            <Label htmlFor="price" className="text-sm">Precio</Label>
                            <Input
                                id="price"
                                type="number"
                                value={formData.price}
                                onChange={(e) => handleChange('price', parseFloat(e.target.value) || 0)}
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                                className="h-10 focus-visible:ring-0 focus:border-[#F24452] focus-visible:outline-none"
                            />
                        </div>

                        <div className="grid gap-1.5">
                            <Label htmlFor="category" className="text-sm">Categoría</Label>
                            <Select
                                value={formData.category}
                                onValueChange={(val) => handleChange('category', val)}
                            >
                                <SelectTrigger className="h-10 bg-[#F2EDE4] border-[#E5D9D1] focus:border-[#F24452] focus:ring-0 overflow-hidden text-ellipsis whitespace-nowrap">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-[#F2EDE4] border border-[#E5D9D1] shadow-lg max-h-[260px]">
                                    <SelectItem value="PIZZAS">Pizzas</SelectItem>
                                    <SelectItem value="EMPANADAS">Empanadas</SelectItem>
                                    <SelectItem value="BEBIDAS">Bebidas</SelectItem>
                                    <SelectItem value="POSTRES">Postres</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Descripción */}
                    <div className="grid gap-1.5">
                        <Label htmlFor="description" className="text-sm">Descripción</Label>
                        <Textarea
                            id="description"
                            value={formData.description || ''}
                            onChange={(e) => handleChange('description', e.target.value)}
                            placeholder="Ingredientes, detalles..."
                            rows={2}
                            className="resize-none focus-visible:ring-0 focus:border-[#F24452] focus-visible:outline-none"
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isSubmitting}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        className="bg-[#F24452] hover:bg-[#F23D3D] text-white"
                        disabled={isSubmitting || !formData.title.trim()}
                    >
                        {isSubmitting ? 'Guardando...' : isEditMode ? 'Actualizar' : 'Guardar'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
