import axios from 'axios';
import type { InternalAxiosRequestConfig, AxiosInstance } from 'axios';

const client: AxiosInstance = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// --- INTERCEPTOR DE REQUEST: Añade el JWT a cada solicitud ---
client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // Busca el JWT en localStorage y lo agrega como 'Bearer <token>'
        const token = localStorage.getItem('jwt_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// --- INTERCEPTOR DE RESPONSE: Maneja 401 y refresh token ---
client.interceptors.response.use(
    (response) => response,
    async (error) => {
        // Si el servidor retorna 401, el token probablemente expiró
        if (error.response?.status === 401) {
            // Limpia el token y redirige al login
            localStorage.removeItem('jwt_token');
            localStorage.removeItem('refresh_token');
            // Recarga la página para que AuthContext se actualice
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default client;