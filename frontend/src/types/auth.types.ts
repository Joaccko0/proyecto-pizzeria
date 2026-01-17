// Datos que el usuario envía para iniciar sesión
export interface LoginRequest {
    email: string;
    password: string; 
}

// Respuesta del backend tras login/register: contiene el JWT
export interface AuthResponse {
    token: string; // JWT que se usa en todas las solicitudes autenticadas
}

// Información básica del usuario autenticado
export interface User {
    email: string;
}

// Datos que el usuario envía para registrarse
export interface RegisterRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}