export interface Product {
    id: number;
    title: string;
    description: string;
    price: number;
    category: string; // "PIZZAS", "EMPANADAS", "BEBIDAS"
    active: boolean;
}

export interface ProductRequest {
    title: string;
    description?: string;
    price: number;
    category: string;
    active?: boolean;
}

// Tipos para Combos (Para mostrar el listado)
export interface ComboItemDetail {
    productId: number;
    productName: string;
    quantity: number;
}

export interface Combo {
    id: number;
    name: string;
    price: number;
    active: boolean;
    items: ComboItemDetail[];
}

// Tipos para crear/editar combos
export interface ComboItem {
    productId: number;
    quantity: number;
}

export interface ComboRequest {
    name: string;
    price: number;
    items: ComboItem[];
}