import { useState } from 'react';
import { useBusiness } from '../context/BusinessContext';
import { useProducts } from '../hooks/useProducts';
import { useCombos } from '../hooks/useCombos';
import { useSearch } from '../hooks/useSearch';
import { Plus, Search, Pizza, UtensilsCrossed } from 'lucide-react';

// Componentes personalizados
import { ProductForm } from '../components/ProductForm';
import { ProductTable } from '../components/ProductTable';
import { ComboForm } from '../components/ComboForm';
import { ComboTable } from '../components/ComboTable';
import { ConfirmDialog } from '../components/ConfirmDialog';

// Componentes UI de shadcn
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import type { Product, Combo } from '../types/inventory.types';

/**
 * Página de gestión de menú (productos y combos)
 * Funcionalidades: CRUD completo, búsqueda en tiempo real, edición
 */
export default function ProductsPage() {
    const { currentBusiness } = useBusiness();
    
    // Hooks de lógica de negocio
    const { products, isLoading: productsLoading, createProduct, updateProduct, deleteProduct } = useProducts(
        currentBusiness?.id || null
    );
    const { combos, isLoading: combosLoading, createCombo, updateCombo, deleteCombo } = useCombos(
        currentBusiness?.id || null
    );

    // Estado de búsqueda
    const [productSearchTerm, setProductSearchTerm] = useState('');
    const [comboSearchTerm, setComboSearchTerm] = useState('');
    
    // Filtrar productos con búsqueda
    const filteredProducts = useSearch(products, productSearchTerm, ['title', 'description']);
    // Filtrar combos con búsqueda
    const filteredCombos = useSearch(combos, comboSearchTerm, ['name']);

    // Estados de modales
    const [isProductFormOpen, setIsProductFormOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [isComboFormOpen, setIsComboFormOpen] = useState(false);
    const [editingCombo, setEditingCombo] = useState<Combo | null>(null);
    
    // Estados de confirmación de eliminación
    const [productToDelete, setProductToDelete] = useState<number | null>(null);
    const [comboToDelete, setComboToDelete] = useState<number | null>(null);

    // Manejadores de productos
    const handleOpenProductForm = (product?: Product) => {
        if (product) {
            setEditingProduct(product);
        } else {
            setEditingProduct(null);
        }
        setIsProductFormOpen(true);
    };

    const handleSubmitProduct = async (formData: any) => {
        if (editingProduct) {
            return await updateProduct(editingProduct.id, formData);
        } else {
            return await createProduct(formData);
        }
    };

    const handleDeleteProductClick = (id: number) => {
        setProductToDelete(id);
    };

    const handleConfirmDeleteProduct = async () => {
        if (productToDelete) {
            await deleteProduct(productToDelete);
            setProductToDelete(null);
        }
    };

    // Manejadores de combos
    const handleOpenComboForm = (combo?: Combo) => {
        if (combo) {
            setEditingCombo(combo);
        } else {
            setEditingCombo(null);
        }
        setIsComboFormOpen(true);
    };

    const handleSubmitCombo = async (formData: any) => {
        if (editingCombo) {
            return await updateCombo(editingCombo.id, formData);
        } else {
            return await createCombo(formData);
        }
    };

    const handleDeleteComboClick = (id: number) => {
        setComboToDelete(id);
    };

    const handleConfirmDeleteCombo = async () => {
        if (comboToDelete) {
            await deleteCombo(comboToDelete);
            setComboToDelete(null);
        }
    };

    return (
        <div className="space-y-6">
            
            {/* Encabezado de sección */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-[#262626]">Gestión de Menú</h2>
                    <p className="text-gray-500">Administra tus productos y combos promocionales.</p>
                </div>
            </div>

            {/* Pestañas principales */}
            <Tabs defaultValue="products" className="w-full">
                <TabsList className="bg-[#E5D9D1]">
                    <TabsTrigger 
                        value="products" 
                        className="data-[state=active]:bg-[#F24452] data-[state=active]:text-white"
                    >
                        <Pizza className="w-4 h-4 mr-2" />
                        Productos ({filteredProducts.length})
                    </TabsTrigger>
                    <TabsTrigger 
                        value="combos" 
                        className="data-[state=active]:bg-[#F24452] data-[state=active]:text-white"
                    >
                        <UtensilsCrossed className="w-4 h-4 mr-2" />
                        Combos ({filteredCombos.length})
                    </TabsTrigger>
                </TabsList>

                {/* TAB: PRODUCTOS */}
                <TabsContent value="products" className="space-y-4">
                    
                    {/* Barra de acciones */}
                    <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-[#E5D9D1]">
                        {/* Buscador funcional */}
                        <div className="relative w-64">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                            <Input
                                placeholder="Buscar por nombre..."
                                className="pl-8 bg-[#F2EDE4] border-none"
                                value={productSearchTerm}
                                onChange={(e) => setProductSearchTerm(e.target.value)}
                            />
                        </div>
                        
                        {/* Botón crear producto */}
                        <Button 
                            className="bg-[#F24452] hover:bg-[#F23D3D] text-white"
                            onClick={() => handleOpenProductForm()}
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Nuevo Producto
                        </Button>
                    </div>

                    {/* Tabla de productos */}
                    <ProductTable
                        products={filteredProducts}
                        isLoading={productsLoading}
                        onEdit={handleOpenProductForm}
                        onDelete={handleDeleteProductClick}
                    />
                </TabsContent>

                {/* TAB: COMBOS */}
                <TabsContent value="combos" className="space-y-4">
                    
                    {/* Barra de acciones */}
                    <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-[#E5D9D1]">
                        {/* Buscador funcional */}
                        <div className="relative w-64">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                            <Input
                                placeholder="Buscar por nombre..."
                                className="pl-8 bg-[#F2EDE4] border-none"
                                value={comboSearchTerm}
                                onChange={(e) => setComboSearchTerm(e.target.value)}
                            />
                        </div>
                        
                        {/* Botón crear combo */}
                        <Button 
                            className="bg-[#F24452] hover:bg-[#F23D3D] text-white"
                            onClick={() => handleOpenComboForm()}
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Nuevo Combo
                        </Button>
                    </div>

                    {/* Tabla de combos */}
                    <ComboTable
                        combos={filteredCombos}
                        isLoading={combosLoading}
                        onEdit={handleOpenComboForm}
                        onDelete={handleDeleteComboClick}
                    />
                </TabsContent>
            </Tabs>

            {/* Modal de formulario de producto */}
            <ProductForm
                open={isProductFormOpen}
                onOpenChange={(open) => {
                    setIsProductFormOpen(open);
                    if (!open) setEditingProduct(null);
                }}
                onSubmit={handleSubmitProduct}
                editingProduct={editingProduct || undefined}
            />

            {/* Modal de formulario de combo */}
            <ComboForm
                open={isComboFormOpen}
                onOpenChange={(open) => {
                    setIsComboFormOpen(open);
                    if (!open) setEditingCombo(null);
                }}
                onSubmit={handleSubmitCombo}
                products={products}
                editingCombo={editingCombo || undefined}
            />

            {/* Dialog de confirmación de eliminación de producto */}
            <ConfirmDialog
                open={productToDelete !== null}
                onOpenChange={(open) => !open && setProductToDelete(null)}
                onConfirm={handleConfirmDeleteProduct}
                title="¿Eliminar producto?"
                description="Esta acción no se puede deshacer. El producto será eliminado permanentemente del menú."
                confirmText="Eliminar"
                cancelText="Cancelar"
                variant="destructive"
            />

            {/* Dialog de confirmación de eliminación de combo */}
            <ConfirmDialog
                open={comboToDelete !== null}
                onOpenChange={(open) => !open && setComboToDelete(null)}
                onConfirm={handleConfirmDeleteCombo}
                title="¿Eliminar combo?"
                description="Esta acción no se puede deshacer. El combo será eliminado permanentemente."
                confirmText="Eliminar"
                cancelText="Cancelar"
                variant="destructive"
            />
        </div>
    );
}