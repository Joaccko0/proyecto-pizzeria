// Tipos para Supplies (Insumos/Partidas de Gasto)
export const SupplyCategory = {
    STOCK: 'STOCK',           // Insumos de producción (Harina, Queso)
    SERVICE: 'SERVICE',       // Servicios (Internet, Gas)
    FIXED_COST: 'FIXED_COST'  // Gastos fijos (Alquiler)
} as const;
export type SupplyCategory = typeof SupplyCategory[keyof typeof SupplyCategory];

export interface Supply {
    id: number;
    name: string;
    category: SupplyCategory;
}

export interface SupplyRequest {
    name: string;
    category: SupplyCategory;
}
