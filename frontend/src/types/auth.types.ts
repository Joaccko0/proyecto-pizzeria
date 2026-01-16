export interface LoginRequest {
    email: string;
    password: string; 
}

export interface AuthResponse {
    token: string;
}

export interface User {
    email: string;
}

export interface RegisterRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}