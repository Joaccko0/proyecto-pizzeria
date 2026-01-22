# Proyecto Pizzeria 1.0 - Contexto para futuras IA

## Visión general
- Monorepo con backend Spring Boot (`backend/`) y frontend React + Vite + TypeScript + Tailwind/shadcn (`frontend/`).
- Objetivo: gestión de pedidos, combos, productos, clientes y direcciones, con creación de pedidos desde un modal amplio.

## Backend (Spring Boot)
- Punto de entrada: [backend/src/main/java/com/pizzeria/backend/BackendApplication.java](backend/src/main/java/com/pizzeria/backend/BackendApplication.java).
- Configuración: Maven (`pom.xml`), wrapper `mvnw`. Perfil/app config en [backend/src/main/resources/application.yaml](backend/src/main/resources/application.yaml) y artefacto compilado en `target/`.
- Paquetes principales esperados (revisar en árbol `com/pizzeria/backend`):
  - `auth/` (probable JWT/autenticación), `config/` (configuración), `controller/`, `dto/`, `mapper/`, `model/`, `repository/`, `service/`.
- Tests en [backend/src/test/java/com/pizzeria/backend](backend/src/test/java/com/pizzeria/backend).
- Para levantar local: revisar `backend/docker-compose.yml` y `start.sh` (corre todo el stack).

## Frontend (React + Vite + Tailwind/shadcn)
- Entrada: [frontend/src/main.tsx](frontend/src/main.tsx), App en [frontend/src/App.tsx](frontend/src/App.tsx).
- Estilos: Tailwind config en [frontend/tailwind.config.ts](frontend/tailwind.config.ts), CSS base en [frontend/src/index.css](frontend/src/index.css) y [frontend/src/App.css](frontend/src/App.css).
- API client base: [frontend/src/api/client.ts](frontend/src/api/client.ts).
- Contextos: [frontend/src/context/AuthContext.tsx](frontend/src/context/AuthContext.tsx), [frontend/src/context/BusinessContext.tsx](frontend/src/context/BusinessContext.tsx).
- Hooks de datos: [frontend/src/hooks/useProducts.ts](frontend/src/hooks/useProducts.ts), [frontend/src/hooks/useCombos.ts](frontend/src/hooks/useCombos.ts), [frontend/src/hooks/useOrders.ts](frontend/src/hooks/useOrders.ts), [frontend/src/hooks/useSearch.ts](frontend/src/hooks/useSearch.ts).
- Servicios: [frontend/src/services/inventory.service.ts](frontend/src/services/inventory.service.ts), [frontend/src/services/order.service.ts](frontend/src/services/order.service.ts).
- Tipos: [frontend/src/types/inventory.types.ts](frontend/src/types/inventory.types.ts), [frontend/src/types/order.types.ts](frontend/src/types/order.types.ts), [frontend/src/types/auth.types.ts](frontend/src/types/auth.types.ts).
- Páginas: [frontend/src/pages/LoginPage.tsx](frontend/src/pages/LoginPage.tsx), [frontend/src/pages/RegisterPage.tsx](frontend/src/pages/RegisterPage.tsx), [frontend/src/pages/ProductsPage.tsx](frontend/src/pages/ProductsPage.tsx), [frontend/src/pages/OrdersPage.tsx](frontend/src/pages/OrdersPage.tsx).
- Layout: [frontend/src/layouts/DashboardLayout.tsx](frontend/src/layouts/DashboardLayout.tsx).
- Componentes clave UI (carrito/pedidos):
  - [frontend/src/components/CreateOrderDialog.tsx](frontend/src/components/CreateOrderDialog.tsx): modal para crear pedidos; ancho ajustable; columnas de productos/combos y carrito; selección de cliente/dirección via `CustomerAddressSelector`; métodos de pago/entrega en dos columnas; total al final.
  - [frontend/src/components/CustomerAddressSelector.tsx](frontend/src/components/CustomerAddressSelector.tsx): selector/creador de cliente y dirección (comportamiento similar para altas).
  - [frontend/src/components/OrderCard.tsx](frontend/src/components/OrderCard.tsx): tarjeta de pedido (rediseñada previamente).
  - Tablas/forms: [frontend/src/components/ProductTable.tsx](frontend/src/components/ProductTable.tsx), [frontend/src/components/ProductForm.tsx](frontend/src/components/ProductForm.tsx), [frontend/src/components/ComboTable.tsx](frontend/src/components/ComboTable.tsx), [frontend/src/components/ComboForm.tsx](frontend/src/components/ComboForm.tsx).
  - Kanban: [frontend/src/components/KanbanBoard.tsx](frontend/src/components/KanbanBoard.tsx) con columnas y tarjetas.
  - Diálogos de confirmación/detalle: [frontend/src/components/ConfirmDialog.tsx](frontend/src/components/ConfirmDialog.tsx), [frontend/src/components/OrderDetailsDialog.tsx](frontend/src/components/OrderDetailsDialog.tsx).
  - UI base (shadcn): [frontend/src/components/ui](frontend/src/components/ui) (buttons, dialog, inputs, selects, etc.).

## Flujos actuales relevantes
- Crear pedido:
  - Abrir `CreateOrderDialog` (botón según página). Modal ancho personalizado.
  - Columna izquierda: listas filtradas de productos/combos activos con botón "+" para agregar al carrito.
  - Columna derecha: carrito con cantidades editables, selección de pago y entrega (dos columnas), selección de cliente/dirección (abre `CustomerAddressSelector`), total al final.
  - Validaciones: requiere al menos un ítem; para delivery exige dirección seleccionada o manual.
  - Al confirmar `onSubmit`, vacía carrito y cierra si éxito.
- Selector de cliente/dirección:
  - Permite alternar lista y formulario de alta tanto para cliente como para dirección; al crear vuelve a la lista con la nueva opción seleccionada.

## Notas de diseño/UI
- El diálogo base en [frontend/src/components/ui/dialog.tsx](frontend/src/components/ui/dialog.tsx) ya no limita `sm:max-w-lg`; el ancho lo fijan las clases del consumidor (p. ej., `CreateOrderDialog`).
- Colores frecuentes: fondos beige `#F2EDE4`, bordes `#E5D9D1`, primario `#F24452` para CTAs.
- Grillas: se usan `grid-cols-2` en el modal para listas y opciones; scroll area fija en productos/combos.

## Cómo levantar
- Script raíz: `./start.sh` (ejecutado exitosamente según último comando). Verifica si levanta docker + backend + frontend.
- Frontend dev: `cd frontend && npm install && npm run dev` (Vite).
- Backend dev: `cd backend && ./mvnw spring-boot:run` (revisar perfiles/vars en `application.yaml`).

## Preguntas abiertas / pendientes típicos
- Reglas de negocio completas de estados de pedido (revisar Kanban y API de orders).
- Autenticación exacta (JWT/roles) en backend y su consumo en `AuthContext`.
- Deploy/config de base de datos (ver `docker-compose.yml` y `application.yaml`).
- Endpoints disponibles y contratos: revisar controllers/dto en backend.

## Tip para futuras IA
- Mantener consistencia de colores y anchos en modales; el ancho depende de las clases pasadas a `DialogContent`.
- Si cambias comportamientos de selección (cliente/dirección), alinear con `CustomerAddressSelector` para no romper el flujo de creación de pedidos.
- Evita sobreescribir estilos base de shadcn en `ui/` salvo necesidad puntual (ya se eliminó el límite de `max-w` del dialog).
