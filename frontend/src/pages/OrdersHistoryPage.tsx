/**
 * Página de Historial de Pedidos
 * Visualiza todos los pedidos con filtros avanzados
 */

import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBusiness } from '../context/BusinessContext';
import { useOrdersHistoric } from '../hooks/useOrdersHistoric';
import { OrdersHistoryView } from '../components/OrdersHistoryView';

export default function OrdersHistoryPage() {
    const { currentBusiness } = useBusiness();
    const { orders, loading, loadOrdersHistoric } = useOrdersHistoric(currentBusiness?.id);

    // No necesitamos useEffect aquí porque useOrders ya se encarga de cargar
    // cuando cambia currentBusiness?.id

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#F2EDE4] to-[#E5D9D1] p-6">
            <div className="max-w-[1400px] mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-[#0D0D0D]">
                            Historial de Pedidos
                        </h1>
                        <p className="text-sm text-[#262626] mt-1">
                            Consulta y filtra todos los pedidos del negocio
                        </p>
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={loadOrdersHistoric}
                        disabled={loading}
                        className="border-[#E5D9D1]"
                    >
                        <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                        Actualizar
                    </Button>
                </div>

                {/* Vista del Historial */}
                <OrdersHistoryView
                    orders={orders}
                    loading={loading}
                />
            </div>
        </div>
    );
}
