/**
 * Dialog para crear un nuevo pedido
 * Permite seleccionar productos/combos, asociar cliente y dirección, método de pago y entrega
 */

import { useState, useEffect, useMemo } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Minus, Trash2, User } from 'lucide-react';
import type { Product, Combo } from '../types/inventory.types';
import type { CreateOrderRequest, OrderItemRequest, PaymentMethod, DeliveryMethod } from '../types/order.types';
import type { Customer } from '../types/customer.types';
import { PaymentMethod as PM, DeliveryMethod as DM } from '../types/order.types';
// import { CustomerService } from '../services/customer.service';
import { CustomerAddressSelector } from './CustomerAddressSelector';
import { toast } from 'sonner';

interface CreateOrderDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: CreateOrderRequest) => Promise<boolean>;
    products: Product[];
    combos: Combo[];
    customers: Customer[];
    businessId: number;
    onCustomersChanged: () => void;
}

interface CartItem {
    type: 'product' | 'combo';
    id: number;
    name: string;
    price: number;
    quantity: number;
}

/**
 * Dialog para crear nuevo pedido
 */
export function CreateOrderDialog({
    open,
    onOpenChange,
    onSubmit,
    products,
    combos,
    customers,
    businessId,
    onCustomersChanged
}: CreateOrderDialogProps) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PM.CASH);
    const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>(DM.PICKUP);
    const [selectedCustomerId, setSelectedCustomerId] = useState<number | undefined>(undefined);
    const [selectedAddressId, setSelectedAddressId] = useState<number | undefined>(undefined);
    const [manualAddress, setManualAddress] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showCustomerAddressDialog, setShowCustomerAddressDialog] = useState(false);

    // const selectedCustomer = customers.find(c => c.id === selectedCustomerId);
    const selectedAddress = useMemo(() => {
        if (!selectedCustomerId) return null;
        const customer = customers.find(c => c.id === selectedCustomerId);
        return customer?.addresses.find(a => a.id === selectedAddressId);
    }, [selectedCustomerId, selectedAddressId, customers]);

    // Resetear al abrir
    useEffect(() => {
        if (open) {
            setCart([]);
            setPaymentMethod(PM.CASH);
            setDeliveryMethod(DM.PICKUP);
            setSelectedCustomerId(undefined);
            setSelectedAddressId(undefined);
            setManualAddress('');
            setShowCustomerAddressDialog(false);
        }
    }, [open]);

    // Resetear dirección si cambia el cliente o el método de entrega
    useEffect(() => {
        setSelectedAddressId(undefined);
        setManualAddress('');
    }, [deliveryMethod]);

    const addToCart = (type: 'product' | 'combo', id: number, name: string, price: number) => {
        const existing = cart.find(item => item.type === type && item.id === id);
        
        if (existing) {
            setCart(cart.map(item =>
                item.type === type && item.id === id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            ));
        } else {
            setCart([...cart, { type, id, name, price, quantity: 1 }]);
        }
    };

    const updateQuantity = (type: string, id: number, delta: number) => {
        setCart(cart.map(item => {
            if (item.type === type && item.id === id) {
                const newQty = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    const removeFromCart = (type: string, id: number) => {
        setCart(cart.filter(item => !(item.type === type && item.id === id)));
    };

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const handleSubmit = async () => {
        if (cart.length === 0) {
            toast.error('Agrega al menos un producto al carrito');
            return;
        }

        // Validar dirección si es delivery
        if (deliveryMethod === DM.DELIVERY && !selectedAddressId && !manualAddress) {
            toast.error('Selecciona una dirección o ingresa una dirección manual');
            return;
        }

        const items: OrderItemRequest[] = cart.map(item => {
            const orderItem: any = {
                quantity: item.quantity
            };
            
            if (item.type === 'product') {
                orderItem.productId = item.id;
            } else {
                orderItem.comboId = item.id;
            }
            
            return orderItem;
        });

        const request: CreateOrderRequest = {
            deliveryMethod,
            paymentMethod,
            items,
            customerId: selectedCustomerId,
            addressId: deliveryMethod === DM.DELIVERY ? selectedAddressId : undefined,
            manualAddress: deliveryMethod === DM.DELIVERY && manualAddress ? manualAddress : undefined
        };

        console.log('Enviando request:', JSON.stringify(request, null, 2));

        setIsSubmitting(true);
        const success = await onSubmit(request);
        setIsSubmitting(false);

        if (success) {
            setCart([]);
            onOpenChange(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-white max-w-[1100px] w-[1000px] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Nuevo Pedido</DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-6 flex-1 overflow-hidden">
                    {/* Columna izquierda: Productos y combos */}
                    <ScrollArea className="h-[620px] pr-4">
                        <div className="grid grid-cols-2 gap-4">
                            {/* Productos */}
                            <div>
                                <h4 className="font-semibold text-sm mb-2">Productos</h4>
                                <div className="space-y-2">
                                    {products.filter(p => p.active).map(product => (
                                        <div
                                            key={product.id}
                                            className="flex items-center justify-between p-2 bg-[#F2EDE4] rounded hover:bg-[#E5D9D1] transition-colors"
                                        >
                                            <div className="flex-1">
                                                <div className="font-medium text-sm">{product.title}</div>
                                                <div className="text-xs text-gray-600">
                                                    ${product.price.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                                                </div>
                                            </div>
                                            <Button
                                                size="sm"
                                                onClick={() => addToCart('product', product.id, product.title, product.price)}
                                                className="bg-[#F24452] hover:bg-[#F23D3D] h-8"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Combos */}
                            {combos.length > 0 && (
                                <div>
                                    <h4 className="font-semibold text-sm mb-2">Combos</h4>
                                    <div className="space-y-2">
                                        {combos.filter(c => c.active).map(combo => (
                                            <div
                                                key={combo.id}
                                                className="flex items-center justify-between p-2 bg-[#F2EDE4] rounded hover:bg-[#E5D9D1] transition-colors"
                                            >
                                                <div className="flex-1">
                                                    <div className="font-medium text-sm">{combo.name}</div>
                                                    <div className="text-xs text-gray-600">
                                                        ${combo.price.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                                                    </div>
                                                </div>
                                                <Button
                                                    size="sm"
                                                    onClick={() => addToCart('combo', combo.id, combo.name, combo.price)}
                                                    className="bg-[#F24452] hover:bg-[#F23D3D] h-8"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </ScrollArea>

                    {/* Columna derecha: Carrito y opciones */}
                    <div className="flex flex-col gap-4">
                        {/* Carrito */}
                        <div className="flex-1 border-2 border-[#E5D9D1] rounded-lg p-3 overflow-y-auto">
                            <h4 className="font-semibold text-sm mb-2">Carrito ({cart.length})</h4>
                            {cart.length === 0 ? (
                                <div className="text-center text-sm text-gray-400 py-8">
                                    Agregá productos al carrito
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {cart.map((item, index) => (
                                        <div key={index} className="flex items-center gap-2 bg-[#F2EDE4] p-2 rounded">
                                            <div className="flex-1 min-w-0">
                                                <div className="font-medium text-xs truncate">{item.name}</div>
                                                <div className="text-xs text-gray-600">
                                                    ${item.price.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Button
                                                    size="icon"
                                                    variant="outline"
                                                    className="h-6 w-6"
                                                    onClick={() => updateQuantity(item.type, item.id, -1)}
                                                >
                                                    <Minus className="w-3 h-3" />
                                                </Button>
                                                <span className="text-xs font-medium w-6 text-center">
                                                    {item.quantity}
                                                </span>
                                                <Button
                                                    size="icon"
                                                    variant="outline"
                                                    className="h-6 w-6"
                                                    onClick={() => updateQuantity(item.type, item.id, 1)}
                                                >
                                                    <Plus className="w-3 h-3" />
                                                </Button>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-6 w-6 text-red-500"
                                                    onClick={() => removeFromCart(item.type, item.id)}
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Opciones */}
                        <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="grid gap-1.5">
                                    <Label className="text-sm">Método de Pago</Label>
                                    <Select value={paymentMethod} onValueChange={(val) => setPaymentMethod(val as PaymentMethod)}>
                                        <SelectTrigger className="h-10 bg-[#F2EDE4] border-[#E5D9D1] focus:border-[#F24452] focus:ring-0 overflow-hidden text-ellipsis whitespace-nowrap">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-[#F2EDE4] border border-[#E5D9D1] shadow-lg max-h-[260px]">
                                            <SelectItem value={PM.CASH}>Efectivo</SelectItem>
                                            <SelectItem value={PM.CARD}>Tarjeta</SelectItem>
                                            <SelectItem value={PM.TRANSFER}>Transferencia</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid gap-1.5">
                                    <Label className="text-sm">Método de Entrega</Label>
                                    <Select value={deliveryMethod} onValueChange={(val) => setDeliveryMethod(val as DeliveryMethod)}>
                                        <SelectTrigger className="h-10 bg-[#F2EDE4] border-[#E5D9D1] focus:border-[#F24452] focus:ring-0 overflow-hidden text-ellipsis whitespace-nowrap">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-[#F2EDE4] border border-[#E5D9D1] shadow-lg max-h-[260px]">
                                            <SelectItem value={DM.PICKUP}>Retiro</SelectItem>
                                            <SelectItem value={DM.DELIVERY}>Delivery</SelectItem>
                                            <SelectItem value={DM.DINE_IN}>Salón</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Cliente y Dirección (al final) */}
                            <div className="border-2 border-[#E5D9D1] rounded-lg p-3 space-y-2 bg-[#F2EDE4]/30">
                                <div className="flex items-center justify-between">
                                    <Label className="text-sm font-semibold">
                                        Cliente {deliveryMethod === DM.DELIVERY && '& Dirección'}
                                    </Label>
                                    <Button
                                        type="button"
                                        size="sm"
                                        onClick={() => setShowCustomerAddressDialog(true)}
                                        className="bg-[#F24452] hover:bg-[#d93a48] cursor-pointer h-8"
                                    >
                                        <User className="w-4 h-4 mr-1" />
                                        {selectedCustomerId || manualAddress ? 'Cambiar' : 'Seleccionar'}
                                    </Button>
                                </div>

                                {/* Información seleccionada */}
                                {selectedCustomerId ? (
                                    <div className="bg-white p-2 rounded border">
                                        <div className="flex items-center justify-between">
                                            <div className="text-sm font-medium">
                                                {customers.find(c => c.id === selectedCustomerId)?.name}
                                            </div>
                                            <span className="text-[10px] px-2 py-0.5 rounded bg-green-100 text-green-700 border border-green-200">Seleccionado</span>
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {customers.find(c => c.id === selectedCustomerId)?.phone}
                                        </div>
                                        {deliveryMethod === DM.DELIVERY && selectedAddress && (
                                            <div className="text-xs text-gray-700 mt-1 pt-1 border-t">
                                                📍 {selectedAddress.street} {selectedAddress.number}
                                                {selectedAddress.description && ` - ${selectedAddress.description}`}
                                            </div>
                                        )}
                                    </div>
                                ) : manualAddress ? (
                                    <div className="bg-white p-2 rounded border">
                                        <div className="flex items-center justify-between">
                                            <div className="text-sm text-gray-600">Sin cliente asociado</div>
                                            <span className="text-[10px] px-2 py-0.5 rounded bg-green-100 text-green-700 border border-green-200">Seleccionado</span>
                                        </div>
                                        <div className="text-xs text-gray-700 mt-1">
                                            📍 {manualAddress}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-sm text-gray-500 italic p-2">
                                        {deliveryMethod === DM.DELIVERY 
                                            ? 'No hay cliente ni dirección seleccionados' 
                                            : 'No hay cliente seleccionado'}
                                    </div>
                                )}
                            </div>

                            {/* Total */}
                            <div className="flex items-center justify-between bg-[#F24452]/10 p-3 rounded-lg">
                                <span className="font-bold">TOTAL</span>
                                <span className="font-bold text-lg text-[#F24452]">
                                    ${total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting} className="cursor-pointer">
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={cart.length === 0 || isSubmitting}
                        className="bg-[#F24452] hover:bg-[#F23D3D] cursor-pointer"
                    >
                        {isSubmitting ? 'Creando...' : 'Crear Pedido'}
                    </Button>
                </DialogFooter>

                            {/* Dialog para seleccionar cliente y dirección */}
                            <CustomerAddressSelector
                                open={showCustomerAddressDialog}
                                onOpenChange={setShowCustomerAddressDialog}
                                customers={customers}
                                businessId={businessId}
                                isDelivery={deliveryMethod === DM.DELIVERY}
                                initialCustomerId={selectedCustomerId}
                                initialAddressId={selectedAddressId}
                                initialManualAddress={manualAddress}
                                onConfirm={(data) => {
                                    setSelectedCustomerId(data.customerId);
                                    setSelectedAddressId(data.addressId);
                                    setManualAddress(data.manualAddress || '');
                                }}
                                onCustomersChanged={onCustomersChanged}
                            />
            </DialogContent>
        </Dialog>
    );
}
