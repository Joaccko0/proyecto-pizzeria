/**
 * Dialog para seleccionar cliente y dirección
 * Incluye búsqueda de clientes, creación rápida de cliente/dirección
 * y opción de dirección manual para delivery sin cliente
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Search, UserPlus, MapPin, X } from 'lucide-react';
import type { Customer } from '../types/customer.types';
import { CustomerService } from '../services/customer.service';
import { toast } from 'sonner';

interface CustomerAddressSelectorProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    customers: Customer[];
    businessId: number;
    isDelivery: boolean;
    initialCustomerId?: number;
    initialAddressId?: number;
    initialManualAddress?: string;
    onConfirm: (data: {
        customerId?: number;
        addressId?: number;
        manualAddress?: string;
    }) => void;
    onCustomersChanged: () => void;
}

export function CustomerAddressSelector({
    open,
    onOpenChange,
    customers,
    businessId,
    isDelivery,
    initialCustomerId,
    initialAddressId,
    initialManualAddress,
    onConfirm,
    onCustomersChanged
}: CustomerAddressSelectorProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCustomerId, setSelectedCustomerId] = useState<number | undefined>(initialCustomerId);
    const [selectedAddressId, setSelectedAddressId] = useState<number | undefined>(initialAddressId);
    const [manualAddress, setManualAddress] = useState(initialManualAddress || '');
    const [useManualAddress, setUseManualAddress] = useState(!!initialManualAddress && !initialCustomerId);

    // Formularios de creación rápida
    const [showCustomerForm, setShowCustomerForm] = useState(false);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [newCustomerName, setNewCustomerName] = useState('');
    const [newCustomerPhone, setNewCustomerPhone] = useState('');
    const [newAddressStreet, setNewAddressStreet] = useState('');
    const [newAddressNumber, setNewAddressNumber] = useState('');
    const [newAddressDescription, setNewAddressDescription] = useState('');
    const [addressSearch, setAddressSearch] = useState('');

    const selectedCustomer = customers.find(c => c.id === selectedCustomerId);

    // Resetear valores al abrir
    useEffect(() => {
        if (open) {
            setSearchTerm('');
            setSelectedCustomerId(initialCustomerId);
            setSelectedAddressId(initialAddressId);
            setManualAddress(initialManualAddress || '');
            setUseManualAddress(!!initialManualAddress && !initialCustomerId);
            setShowCustomerForm(false);
            setShowAddressForm(false);
        }
    }, [open, initialCustomerId, initialAddressId, initialManualAddress]);

    // Resetear dirección si cambia el cliente
    useEffect(() => {
        if (!useManualAddress) {
            setSelectedAddressId(undefined);
        }
    }, [selectedCustomerId, useManualAddress]);

    // Filtrar clientes por búsqueda
    const filteredCustomers = useMemo(() => {
        if (!searchTerm.trim()) return customers;
        const term = searchTerm.toLowerCase();
        return customers.filter(c =>
            c.name.toLowerCase().includes(term) ||
            c.phone.toLowerCase().includes(term)
        );
    }, [customers, searchTerm]);

    const filteredAddresses = useMemo(() => {
        if (!selectedCustomer) return [];
        const all = selectedCustomer.addresses || [];
        if (!addressSearch.trim()) return all;
        const term = addressSearch.toLowerCase();
        return all.filter(a =>
            `${a.street} ${a.number}`.toLowerCase().includes(term) ||
            (a.description || '').toLowerCase().includes(term)
        );
    }, [selectedCustomer, addressSearch]);

    // Crear cliente
    const handleCreateCustomer = async () => {
        if (!newCustomerName.trim() || !newCustomerPhone.trim()) {
            toast.error('Completa nombre y teléfono');
            return;
        }

        try {
            const customer = await CustomerService.createCustomer(businessId, {
                name: newCustomerName,
                phone: newCustomerPhone
            });
            toast.success('Cliente creado exitosamente');
            setNewCustomerName('');
            setNewCustomerPhone('');
            setShowCustomerForm(false);
            await onCustomersChanged();
            setSelectedCustomerId(customer.id);
            setUseManualAddress(false);
        } catch (err) {
            toast.error('Error al crear el cliente');
            console.error(err);
        }
    };

    // Crear dirección
    const handleCreateAddress = async () => {
        if (!selectedCustomerId || !newAddressStreet.trim() || !newAddressNumber.trim()) {
            toast.error('Completa los campos de dirección');
            return;
        }

        try {
            const address = await CustomerService.createAddress(businessId, selectedCustomerId, {
                street: newAddressStreet,
                number: newAddressNumber,
                description: newAddressDescription
            });
            toast.success('Dirección agregada exitosamente');
            setNewAddressStreet('');
            setNewAddressNumber('');
            setNewAddressDescription('');
            setShowAddressForm(false);
            setAddressSearch('');
            await onCustomersChanged();
            setSelectedAddressId(address.id);
        } catch (err) {
            toast.error('Error al crear la dirección');
            console.error(err);
        }
    };

    const handleConfirm = () => {
        // Validar si es delivery
        if (isDelivery) {
            if (useManualAddress) {
                if (!manualAddress.trim()) {
                    toast.error('Ingresa una dirección de entrega');
                    return;
                }
            } else {
                if (!selectedAddressId && selectedCustomerId) {
                    toast.error('Selecciona una dirección del cliente');
                    return;
                }
            }
        }

        onConfirm({
            customerId: useManualAddress ? undefined : selectedCustomerId,
            addressId: useManualAddress ? undefined : selectedAddressId,
            manualAddress: useManualAddress ? manualAddress : undefined
        });
        onOpenChange(false);
    };

    // Removed handleClearSelection (unused after tabs refactor)

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-white max-w-2xl max-h-[85vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>
                        {isDelivery ? 'Cliente y Dirección de Entrega' : 'Seleccionar Cliente (Opcional)'}
                    </DialogTitle>
                </DialogHeader>

                <div className="flex-1 overflow-hidden space-y-4">
                    {/* Opción de dirección manual (solo delivery) */}
                    {isDelivery && (
                        <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-lg">
                            <input
                                type="checkbox"
                                id="useManual"
                                checked={useManualAddress}
                                onChange={(e) => {
                                    setUseManualAddress(e.target.checked);
                                    if (e.target.checked) {
                                        setSelectedCustomerId(undefined);
                                        setSelectedAddressId(undefined);
                                    } else {
                                        setManualAddress('');
                                    }
                                }}
                                className="cursor-pointer"
                            />
                            <Label htmlFor="useManual" className="text-sm cursor-pointer">
                                Ingresar dirección manualmente (sin asociar cliente)
                            </Label>
                        </div>
                    )}

                    {useManualAddress ? (
                        /* Dirección manual */
                        <div className="space-y-2">
                            <Label>Dirección de Entrega</Label>
                            <Input
                                placeholder="Ej: Av. Corrientes 1234, Piso 2 Depto A"
                                value={manualAddress}
                                onChange={(e) => setManualAddress(e.target.value)}
                                className="focus-visible:ring-0 focus:border-[#F24452]"
                            />
                        </div>
                    ) : (
                        <>
                            {/* Tabs para Cliente/Dirección (reduce tamaño visual) */}
                            {isDelivery ? (
                                <Tabs defaultValue={selectedCustomerId ? 'direccion' : 'cliente'}>
                                    <TabsList className="grid grid-cols-2 w-full">
                                        <TabsTrigger value="cliente">Cliente</TabsTrigger>
                                        <TabsTrigger value="direccion" disabled={!selectedCustomerId}>Dirección</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="cliente" className="space-y-2 pt-2">
                                        {/* Búsqueda de clientes + crear */}
                                        {!showCustomerForm && (
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <Label>Buscar Cliente</Label>
                                                    <Button type="button" size="sm" variant="outline" onClick={() => setShowCustomerForm(true)}>
                                                        <UserPlus className="w-4 h-4 mr-1" />
                                                        Crear Nuevo
                                                    </Button>
                                                </div>
                                                <div className="relative">
                                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                                                    <Input placeholder="Nombre o teléfono..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
                                                </div>
                                            </div>
                                        )}
                                        {showCustomerForm && (
                                            <div className="border-2 border-[#F24452] rounded-lg p-3 space-y-2 bg-[#FFF5F5]">
                                                <div className="flex items-center justify-between">
                                                    <Label className="font-semibold">Crear Cliente</Label>
                                                    <Button type="button" size="sm" variant="ghost" onClick={() => { setShowCustomerForm(false); setNewCustomerName(''); setNewCustomerPhone(''); }}>
                                                        <X className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                                <Input placeholder="Nombre del cliente" value={newCustomerName} onChange={(e) => setNewCustomerName(e.target.value)} />
                                                <Input placeholder="Teléfono" value={newCustomerPhone} onChange={(e) => setNewCustomerPhone(e.target.value)} />
                                                <Button type="button" onClick={handleCreateCustomer} className="w-full bg-[#F24452] hover:bg-[#d93a48]">Crear Cliente</Button>
                                            </div>
                                        )}
                                        {!showCustomerForm && (
                                            <ScrollArea className="h-[180px] border rounded-lg">
                                                <div className="p-1 space-y-1">
                                                    {filteredCustomers.length === 0 ? (
                                                        <div className="text-center py-8 text-gray-500 text-sm">Sin resultados</div>
                                                    ) : (
                                                        filteredCustomers.map((customer) => (
                                                            <button key={customer.id} type="button" onClick={() => { setSelectedCustomerId(customer.id); setSearchTerm(''); }}
                                                                className={`w-full text-left p-2 rounded-md transition-colors flex items-center gap-2 ${selectedCustomerId === customer.id ? 'bg-[#F24452] text-white' : 'hover:bg-gray-100'}`}
                                                            >
                                                                {selectedCustomerId === customer.id && (
                                                                    <span className="inline-block w-4 h-4 rounded-full bg-white text-[#F24452] flex items-center justify-center text-[10px]">✓</span>
                                                                )}
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="font-medium text-sm truncate">{customer.name}</div>
                                                                    <div className="text-[11px] opacity-80 truncate">{customer.phone}</div>
                                                                </div>
                                                            </button>
                                                        ))
                                                    )}
                                                </div>
                                            </ScrollArea>
                                        )}
                                    </TabsContent>
                                    <TabsContent value="direccion" className="space-y-2 pt-2">
                                        {/* Nueva dirección */}
                                        <div className="flex items-center justify-between">
                                            <Label>Dirección de Entrega</Label>
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="outline"
                                                onClick={() => {
                                                    setShowAddressForm(true);
                                                    setSelectedAddressId(undefined);
                                                    setAddressSearch('');
                                                }}
                                                disabled={!selectedCustomerId}
                                            >
                                                <MapPin className="w-4 h-4 mr-1" />
                                                Nueva Dirección
                                            </Button>
                                        </div>
                                        {showAddressForm ? (
                                            <div className="border-2 border-[#F24452] rounded-lg p-3 space-y-2 bg-[#FFF5F5]">
                                                <div className="flex items-center justify-between">
                                                    <Label className="font-semibold">Agregar Dirección</Label>
                                                    <Button type="button" size="sm" variant="ghost" onClick={() => { setShowAddressForm(false); setNewAddressStreet(''); setNewAddressNumber(''); setNewAddressDescription(''); }}>
                                                        <X className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                                <Input placeholder="Calle" value={newAddressStreet} onChange={(e) => setNewAddressStreet(e.target.value)} />
                                                <Input placeholder="Número" value={newAddressNumber} onChange={(e) => setNewAddressNumber(e.target.value)} />
                                                <Input placeholder="Referencias (opcional)" value={newAddressDescription} onChange={(e) => setNewAddressDescription(e.target.value)} />
                                                <Button type="button" onClick={handleCreateAddress} className="w-full bg-[#F24452] hover:bg-[#d93a48]">Agregar Dirección</Button>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="relative">
                                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                                                    <Input placeholder="Buscar dirección o referencia..." value={addressSearch} onChange={(e) => setAddressSearch(e.target.value)} className="pl-10" />
                                                </div>
                                                <ScrollArea className="h-[160px] border rounded-lg">
                                                    <div className="p-1 space-y-1">
                                                        {filteredAddresses.length === 0 ? (
                                                            <div className="text-center py-6 text-gray-500 text-sm">Sin direcciones</div>
                                                        ) : (
                                                            filteredAddresses.map((address) => (
                                                                <button key={address.id} type="button" onClick={() => setSelectedAddressId(address.id)}
                                                                    className={`w-full text-left p-2 rounded-md border transition-colors flex items-center gap-2 ${selectedAddressId === address.id ? 'border-[#F24452] bg-[#FFF5F5]' : 'border-[#E5D9D1] hover:bg-gray-50'}`}
                                                                >
                                                                    {selectedAddressId === address.id && (
                                                                        <span className="inline-block w-4 h-4 rounded-full bg-[#F24452] text-white flex items-center justify-center text-[10px]">✓</span>
                                                                    )}
                                                                    <div className="flex-1 min-w-0">
                                                                        <div className="font-medium text-sm truncate">{address.street} {address.number}</div>
                                                                        {address.description && (
                                                                            <div className="text-[11px] text-gray-500 mt-0.5 truncate">{address.description}</div>
                                                                        )}
                                                                    </div>
                                                                </button>
                                                            ))
                                                        )}
                                                    </div>
                                                </ScrollArea>
                                            </>
                                        )}
                                    </TabsContent>
                                </Tabs>
                            ) : (
                                // Caso no-delivery: solo cliente
                                <>
                                    {!showCustomerForm && (
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <Label>Buscar Cliente</Label>
                                                <Button type="button" size="sm" variant="outline" onClick={() => setShowCustomerForm(true)}>
                                                    <UserPlus className="w-4 h-4 mr-1" />
                                                    Crear Nuevo
                                                </Button>
                                            </div>
                                            <div className="relative">
                                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                                                <Input placeholder="Nombre o teléfono..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
                                            </div>
                                        </div>
                                    )}
                                    {showCustomerForm && (
                                        <div className="border-2 border-[#F24452] rounded-lg p-3 space-y-2 bg-[#FFF5F5]">
                                            <div className="flex items-center justify-between">
                                                <Label className="font-semibold">Crear Cliente</Label>
                                                <Button type="button" size="sm" variant="ghost" onClick={() => { setShowCustomerForm(false); setNewCustomerName(''); setNewCustomerPhone(''); }}>
                                                    <X className="w-4 h-4" />
                                                </Button>
                                            </div>
                                            <Input placeholder="Nombre del cliente" value={newCustomerName} onChange={(e) => setNewCustomerName(e.target.value)} />
                                            <Input placeholder="Teléfono" value={newCustomerPhone} onChange={(e) => setNewCustomerPhone(e.target.value)} />
                                            <Button type="button" onClick={handleCreateCustomer} className="w-full bg-[#F24452] hover:bg-[#d93a48]">Crear Cliente</Button>
                                        </div>
                                    )}
                                    {!showCustomerForm && (
                                        <ScrollArea className="h-[180px] border rounded-lg">
                                            <div className="p-1 space-y-1">
                                                {filteredCustomers.length === 0 ? (
                                                    <div className="text-center py-8 text-gray-500 text-sm">Sin resultados</div>
                                                ) : (
                                                    filteredCustomers.map((customer) => (
                                                        <button key={customer.id} type="button" onClick={() => { setSelectedCustomerId(customer.id); setSearchTerm(''); }}
                                                            className={`w-full text-left p-2 rounded-md transition-colors ${selectedCustomerId === customer.id ? 'bg-[#F24452] text-white' : 'hover:bg-gray-100'}`}
                                                        >
                                                            <div className="font-medium text-sm truncate">{customer.name}</div>
                                                            <div className="text-[11px] opacity-80 truncate">{customer.phone}</div>
                                                        </button>
                                                    ))
                                                )}
                                            </div>
                                        </ScrollArea>
                                    )}
                                </>
                            )}
                        </>
                    )}
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="cursor-pointer"
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        className="bg-[#F24452] hover:bg-[#d93a48] cursor-pointer"
                    >
                        Confirmar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
