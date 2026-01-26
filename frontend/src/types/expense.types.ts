// Tipos para Expenses (Gastos/Facturas)
export interface ExpenseItem {
    id?: number;
    supplyId: number;
    supplyName?: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
}

export interface ExpenseItemRequest {
    supplyId: number;
    quantity: number;
    unitPrice: number;
}

export interface Expense {
    id: number;
    supplierId?: number;
    supplierName?: string;
    date: string; // ISO date string
    total: number;
    items: ExpenseItem[];
}

export interface ExpenseRequest {
    supplierId?: number;
    date: string; // ISO date string (YYYY-MM-DD)
    items: ExpenseItemRequest[];
}
