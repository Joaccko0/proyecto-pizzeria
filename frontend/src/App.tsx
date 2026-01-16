import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Un componente para proteger rutas
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated } = useAuth();
    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }
    return <>{children}</>;
};

// Página temporal de Dashboard
const Dashboard = () => (
    <div className="p-10">
        <h1 className="text-3xl font-bold">¡Bienvenido al Panel de Control! 🚀</h1>
        <p className="mt-4">Aquí verás tus productos pronto.</p>
    </div>
);

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    
                    {/* Rutas Privadas */}
                    <Route 
                        path="/dashboard" 
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        } 
                    />
                    
                    {/* Redirección por defecto */}
                    <Route path="*" element={<Navigate to="/dashboard" />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;