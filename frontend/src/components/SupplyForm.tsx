import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Package, Tag } from 'lucide-react';
import { SupplyCategory } from '@/types/supply.types';
import type { Supply } from '@/types/supply.types';

interface SupplyFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (supply: Omit<Supply, 'id' | 'businessId'>, id?: number) => Promise<void>;
    supply?: Supply | null;
    defaultCategory?: SupplyCategory;
}

export function SupplyForm({ isOpen, onClose, onSave, supply, defaultCategory }: SupplyFormProps) {
    const [name, setName] = useState('');
    const [category, setCategory] = useState<string>(SupplyCategory.STOCK);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (supply) {
            setName(supply.name);
            setCategory(supply.category);
        } else {
            setName('');
            setCategory(defaultCategory ?? SupplyCategory.STOCK);
        }
    }, [supply, isOpen, defaultCategory]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        setLoading(true);
        try {
            await onSave({ name: name.trim(), category: category as SupplyCategory }, supply?.id);
            onClose();
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {supply ? 'Editar Insumo' : 'Nuevo Insumo'}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name" className="flex items-center gap-1.5">
                                <Package className="h-4 w-4 text-[#F24452]" />
                                Nombre
                            </Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Ej: Harina 000"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="category" className="flex items-center gap-1.5">
                                <Tag className="h-4 w-4 text-[#F24452]" />
                                Categoría
                            </Label>
                            <Select value={category} onValueChange={setCategory}>
                                <SelectTrigger className="h-10 w-full bg-[#F2EDE4] border-[#E5D9D1] focus:border-[#F24452] focus:ring-0 overflow-hidden text-ellipsis whitespace-nowrap">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-[#F2EDE4] border border-[#E5D9D1] shadow-lg max-h-[260px]">
                                    <SelectItem value={SupplyCategory.STOCK}>Stock</SelectItem>
                                    <SelectItem value={SupplyCategory.SERVICE}>Servicio</SelectItem>
                                    <SelectItem value={SupplyCategory.FIXED_COST}>Costo Fijo</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancelar
                        </Button>
                        <Button 
                            type="submit"
                            disabled={loading}
                            style={{ backgroundColor: '#F24452' }}
                            className="hover:opacity-90"
                        >
                            {loading ? 'Guardando...' : supply ? 'Actualizar' : 'Crear'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
