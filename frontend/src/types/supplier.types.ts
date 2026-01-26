// Tipos para Suppliers (Proveedores)
export interface Supplier {
    id: number;
    name: string;
    contactInfo?: string;
}

export interface SupplierRequest {
    name: string;
    contactInfo?: string;
}
