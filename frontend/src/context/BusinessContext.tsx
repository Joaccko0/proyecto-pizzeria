import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

// Definimos la estructura de un Negocio
interface Business {
    id: number;
    name: string;
}

interface BusinessContextType {
    currentBusiness: Business | null;
    isLoading: boolean;
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

export const BusinessProvider = ({ children }: { children: ReactNode }) => {
    const [currentBusiness, setCurrentBusiness] = useState<Business | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUserBusinesses = async () => {
            try {
                // TODO: En el futuro, aquí llamaríamos a un endpoint real: GET /api/users/me/businesses
                // Por ahora, SIMULAMOS que el backend nos devuelve el negocio que cargamos manualmente
                // OJO: Para que esto sea real, deberías crear ese endpoint en Java. 
                // Pero para avanzar YA, vamos a "hardcodear" el objeto si el usuario está logueado.
                
                // Opción A (Hardcode temporal para MVP Rápido):
                const mockBusiness = { id: 2, name: 'Pizzeria La Fabrica' }; 
                setCurrentBusiness(mockBusiness);

            } catch (error) {
                console.error("Error cargando negocio", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserBusinesses();
    }, []);

    return (
        <BusinessContext.Provider value={{ currentBusiness, isLoading }}>
            {children}
        </BusinessContext.Provider>
    );
};

export const useBusiness = () => {
    const context = useContext(BusinessContext);
    if (!context) throw new Error('useBusiness debe usarse dentro de BusinessProvider');
    return context;
};