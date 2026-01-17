src/
├── api/          # Configuración de Axios (el teléfono rojo con el backend)
├── components/   # Botones, Inputs, Tablas (UI pura, sin lógica de negocio)
│   └── ui/       # Aquí irían los componentes de Shadcn/Tailwind
├── context/      # Estado global (Sesión del usuario, Control del negocio actual)
├── hooks/        # Lógica reutilizable (ej: useProducts)
├── layouts/      # Plantillas de páginas (con Navbar, Sidebar)
├── pages/        # Las vistas completas (Login, Home, Dashboard)
├── types/        # Las Interfaces (Espejo de tus DTOs de Java)
├── services/     # Comunicación con el backend (casos de uso / lógica de dominio)
└── App.tsx