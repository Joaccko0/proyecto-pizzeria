import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, Lock, Pizza } from "lucide-react";
import { Link } from "react-router-dom";

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleEmailValidation = (e: React.ChangeEvent<HTMLInputElement>) => {
        const emailInput = e.target;
        if (!emailInput.validity.valid) {
            if (emailInput.validity.valueMissing) {
                emailInput.setCustomValidity('Por favor ingresa un correo electrónico.');
            } else if (emailInput.validity.typeMismatch) {
                emailInput.setCustomValidity('Por favor ingresa un correo electrónico válido.');
            }
        } else {
            emailInput.setCustomValidity('');
        }
        setEmail(emailInput.value);
    };

    const handlePasswordValidation = (e: React.ChangeEvent<HTMLInputElement>) => {
        const passwordInput = e.target;
        if (!passwordInput.validity.valid && passwordInput.validity.valueMissing) {
            passwordInput.setCustomValidity('Por favor ingresa tu contraseña.');
        } else {
            passwordInput.setCustomValidity('');
        }
        setPassword(passwordInput.value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        
        try {
            await login({ email, password });
            navigate('/dashboard'); 
        } catch (err) {
            setError('Credenciales inválidas. Verifica tus datos.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-[#F2EDE4] to-[#E5D9D1] p-8">
            <div className="mx-auto w-full max-w-[400px] space-y-8 bg-white rounded-2xl shadow-2xl p-8">
                
                {/* Encabezado del formulario */}
                <div className="flex flex-col space-y-2 text-center">
                    <div className="flex justify-center">
                        <Pizza className="h-10 w-10 text-primary mb-4" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Bienvenido de nuevo</h1>
                    <p className="text-sm text-muted-foreground">
                        Ingresa tus credenciales para acceder al panel.
                    </p>
                </div>

                {/* Mensaje de Error */}
                {error && (
                    <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-md font-medium animate-in fade-in-50">
                        {error}
                    </div>
                )}

                {/* Formulario */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Correo Electrónico</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input 
                                    id="email" 
                                    type="email" 
                                    placeholder="nombre@ejemplo.com" 
                                    className="pl-10 h-11"
                                    value={email}
                                    onChange={handleEmailValidation}
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Contraseña</Label>
                                <a href="#" className="text-sm font-medium text-primary hover:underline underline-offset-4 text-muted-foreground">
                                    ¿Olvidaste tu contraseña?
                                </a>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input 
                                    id="password" 
                                    type="password" 
                                    className="pl-10 h-11"
                                    value={password}
                                    onChange={handlePasswordValidation}
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        </div>
                    </div>

                    <Button 
                        className="w-full h-11 font-bold text-base bg-[#F24452] hover:bg-[#F23D3D] active:bg-[#E03333] text-white transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed" 
                        type="submit" 
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Autenticando...
                            </>
                        ) : (
                            'Iniciar Sesión'
                        )}
                    </Button>
                </form>

                {/* Enlace para registrarse */}
                <div className="text-center text-sm">
                    <span className="text-muted-foreground">¿No tienes una cuenta? </span>
                    <Link to="/register" className="font-medium text-primary hover:underline underline-offset-4">
                        Regístrate aquí
                    </Link>
                </div>
              
            </div>
        </div>
    );
}