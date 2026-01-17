import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BusinessProvider } from './context/BusinessContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardLayout from './layouts/DashboardLayout';

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

// Dashboard Home (Temporal)
const DashboardHome = () => (
    <div>
        <h1 className="text-3xl font-bold text-gray-800">Panel de Control</h1>
        <p className="text-gray-500 mt-2">Bienvenido al sistema de gestión.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold">Ventas de Hoy</h3>
                <p className="text-3xl font-bold text-green-600 mt-2">$0.00</p>
            </div>
            {/* Más widgets... */}
        </div>
    </div>
);

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
                                <Route index element={<DashboardHome />} />
                                
                                {/* AQUÍ PONDREMOS PRODUCTOS LUEGO */}
                                {/* <Route path="products" element={<ProductsPage />} /> */}
                                
                        </Route>
                        
                        {/* Ruta catch-all: cualquier otra ruta redirige a dashboard */}
                        <Route path="*" element={<Navigate to="/dashboard" />} />
                    </Routes>
                </BusinessProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;