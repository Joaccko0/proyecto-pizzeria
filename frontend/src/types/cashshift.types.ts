/**
 * Tipos para CashShift (Apertura y Cierre de Caja)
 */

export type CashShiftStatus = 'OPEN' | 'CLOSED';

export interface CashShiftResponse {
    id: number;
    status: CashShiftStatus;
    startDate: string; // ISO 8601 datetime
    endDate: string | null;
    startAmount: number;
    endAmount: number | null;
}

export interface OpenCashShiftRequest {
    startAmount: number;
}

export interface CloseCashShiftRequest {
    endAmount: number;
}
