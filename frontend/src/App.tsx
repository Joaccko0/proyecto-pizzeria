import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Componente que protege rutas: solo deja pasar si isAuthenticated es true
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated } = useAuth();
    // Si no tiene JWT válido, redirige a login
    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }
    // Si tiene JWT, renderiza el componente hijo
    return <>{children}</>;
};

// Página temporal de Dashboard (reemplazar con componente real)
const Dashboard = () => (
    <div className="p-10">
        <h1 className="text-3xl font-bold">¡Bienvenido al Panel de Control! 🚀</h1>
        <p className="mt-4">Aquí verás tus productos pronto.</p>
    </div>
);

function App() {
    return (
        <BrowserRouter>
            {/* AuthProvider envuelve todo: proporciona contexto de autenticación */}
            <AuthProvider>
                <Routes>
                    {/* Rutas públicas */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    
                    {/* Rutas privadas: protegidas por ProtectedRoute */}
                    <Route 
                        path="/dashboard" 
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        } 
                    />
                    
                    {/* Ruta catch-all: cualquier otra ruta redirige a dashboard */}
                    <Route path="*" element={<Navigate to="/dashboard" />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;