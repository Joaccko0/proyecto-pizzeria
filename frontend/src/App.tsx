import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BusinessProvider } from './context/BusinessContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardLayout from './layouts/DashboardLayout';
import OrdersPage from './pages/OrdersPage';
import ProductsPage from './pages/ProductsPage';
import CustomersPage from './pages/CustomersPage';
import ExpensesPage from './pages/ExpensesPage';
import { Toaster } from "@/components/ui/sonner";

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

function App() {
    return (
        <BrowserRouter>
            {/* AuthProvider envuelve todo: proporciona contexto de autenticación */}
            <AuthProvider>
                <BusinessProvider>
                    <Routes>
                        {/* Rutas públicas */}
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        
                        {/* Rutas privadas: protegidas por ProtectedRoute */}
                        <Route 
                                path="/dashboard" 
                                element={
                                    <ProtectedRoute>
                                        <DashboardLayout />
                                    </ProtectedRoute>
                                } 
                            >
                                {/* Rutas Hijas (se renderizan en <Outlet />) */}
                                <Route index element={<OrdersPage />} />
                                
                                <Route path="products" element={<ProductsPage />} />
                                <Route path="customers" element={<CustomersPage />} />
                                <Route path="expenses" element={<ExpensesPage />} />
                                
                        </Route>
                        
                        {/* Ruta catch-all: cualquier otra ruta redirige a dashboard */}
                        <Route path="*" element={<Navigate to="/dashboard" />} />
                    </Routes>
                    
                    {/* Sistema de notificaciones global */}
                    <Toaster position="top-right" richColors />
                </BusinessProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;