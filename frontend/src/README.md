src/
├── api/          # Configuración de Axios (el teléfono rojo con el backend)
├── components/   # Botones, Inputs, Tablas (UI pura, sin lógica de negocio)
│   └── ui/       # Aquí irían los componentes de Shadcn/Tailwind
├── context/      # Estado global (Sesión del usuario)
├── hooks/        # Lógica reutilizable (ej: useProducts)
├── layouts/      # Plantillas de páginas (con Navbar, Sidebar)
├── pages/        # Las vistas completas (Login, Home, Dashboard)
├── types/        # Las Interfaces (Espejo de tus DTOs de Java)
└── App.tsx