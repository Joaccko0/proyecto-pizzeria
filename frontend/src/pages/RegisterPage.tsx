import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom'; // Importamos Link para navegar al login
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, Lock, Pizza, User } from "lucide-react";

export default function RegisterPage() {
    // Estado único para el formulario (más limpio que muchos useState sueltos)
    const [formData, setFormData] = useState({
            firstName: '',
            lastName: '',
            email: '',
            password: ''
        });

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const { register } = useAuth();
    const navigate = useNavigate();

    // Manejador genérico para todos los inputs
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
        
        // Limpiamos validación nativa al escribir
        e.target.setCustomValidity('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        
        try {
            await register(formData);
            navigate('/dashboard'); // Redirige directo al dashboard tras registro exitoso
        } catch (err) {
            setError('Error al registrar. Verifica los datos o intenta con otro correo.');
        } finally {
            setIsLoading(false);
        }
    };

return (
        <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-[#F2EDE4] to-[#E5D9D1] p-8">
            <div className="mx-auto w-full max-w-[500px] space-y-8 bg-white rounded-2xl shadow-2xl p-8">
                
                {/* Encabezado */}
                <div className="flex flex-col space-y-2 text-center">
                    <div className="flex justify-center">
                        <Pizza className="h-10 w-10 text-primary mb-2" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Crea tu cuenta</h1>
                    <p className="text-sm text-muted-foreground">
                        Únete a PizzeriaOS.
                    </p>
                </div>
                
                {/* Error */}
                {error && (
                    <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-md font-medium animate-in fade-in-50">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Nombre y Apellido */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">Nombre</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input 
                                    id="firstName" 
                                    type="text" 
                                    placeholder="Juan" 
                                    className="pl-10 h-11"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Apellido</Label>
                            <Input 
                                id="lastName" 
                                type="text" 
                                placeholder="Pérez" 
                                className="h-11"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <Label htmlFor="email">Correo Electrónico</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input 
                                id="email" 
                                type="email" 
                                placeholder="nombre@ejemplo.com" 
                                className="pl-10 h-11"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    {/* Contraseña */}
                    <div className="space-y-2">
                        <Label htmlFor="password">Contraseña</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input 
                                id="password" 
                                type="password" 
                                className="pl-10 h-11"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                minLength={6}
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <Button 
                        className="w-full h-11 font-bold text-base bg-[#F24452] hover:bg-[#F23D3D] text-white mt-4" 
                        type="submit" 
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Registrando...
                            </>
                        ) : (
                            'Registrarse'
                        )}
                    </Button>
                </form>

                {/* Footer Link */}
                <div className="text-center text-sm">
                    <span className="text-muted-foreground">¿Ya tienes una cuenta? </span>
                    <Link to="/login" className="font-medium text-primary hover:underline underline-offset-4">
                        Inicia sesión aquí
                    </Link>
                </div>
              
            </div>
        </div>
    );
}