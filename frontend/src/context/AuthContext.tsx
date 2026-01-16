import { createContext, useContext, useState, useEffect } from 'react';
import client from '../api/client';
import type { ReactNode } from 'react';
import type { LoginRequest, AuthResponse, RegisterRequest } from '../types/auth.types';

// Definimos qué datos y funciones tendrá nuestro contexto
interface AuthContextType {
    token: string | null;
    isAuthenticated: boolean;
    login: (data: LoginRequest) => Promise<void>;
    logout: () => void;
    register: (data: RegisterRequest) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    // Al iniciar, buscamos si ya había un token guardado (para que no te saque al recargar F5)
    const [token, setToken] = useState<string | null>(localStorage.getItem('jwt_token'));

    const register = async (data: RegisterRequest) => {
        try {
            const response = await client.post<AuthResponse>('/auth/register', data);
            setToken(response.data.token);
        } catch (error) {
            console.error("Error en registro:", error);
            throw error;
        }
    };

    // Efecto: Mantener sincronizado el estado con el LocalStorage
    useEffect(() => {
        if (token) {
            localStorage.setItem('jwt_token', token);
        } else {
            localStorage.removeItem('jwt_token');
        }
    }, [token]);

    const login = async (credentials: LoginRequest) => {
        try {
            // Llamamos al backend real
            const response = await client.post<AuthResponse>('/auth/login', credentials);
            
            // Si todo sale bien, guardamos el token
            setToken(response.data.token);
        } catch (error) {
            console.error("Error en login:", error);
            throw error; // Re-lanzamos para que la UI muestre el error
        }
    };

    const logout = () => {
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ 
            token, 
            isAuthenticated: !!token, // true si hay token, false si es null
            login, 
            logout,
            register
        }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook personalizado para usar el contexto fácil
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe usarse dentro de un AuthProvider');
    }
    return context;
};