# 🚀 CashShift Frontend - Quick Start Guide

**Completado**: 5 de Febrero, 2026  
**Versión**: 1.0  
**Estado**: ✅ Listo para Compilación

---

## 📋 Qué se Implementó

### ✨ Nuevas Funcionalidades

1. **Restricción del Kanban**
   - El tablero Kanban ahora requiere que haya una caja abierta
   - Sin caja: muestra alerta y bloquea "Nuevo Pedido"
   - Con caja: permite crear y gestionar pedidos

2. **Abrir Caja (OpenCashDialog)**
   - Modal para ingresa monto inicial
   - Validaciones: número positivo, no vacío
   - Guarda en base de datos
   - Actualiza estado visual instantáneamente

3. **Cerrar Caja (CloseCashDialog)**
   - Calcula automáticamente monto esperado:
     ```
     Esperado = Monto Inicial + Ventas en Efectivo
     ```
   - Muestra resumen del turno
   - Si hay diferencia: pide confirmación al usuario
   - Ejemplo:
     ```
     Esperado: $1,000
     Ingresado: $950
     Diferencia: -$50 (faltante)
     ```

4. **Estado de Caja (CashShiftStatus)**
   - Card visual que muestra si caja está abierta/cerrada
   - Si está abierta: muestra hora, monto inicial, ID
   - Botones de acción (Abrir/Cerrar)

---

## 📁 Archivos Creados (6)

```
frontend/src/
├── types/
│   └── cashshift.types.ts
├── services/
│   └── cashshift.service.ts
├── hooks/
│   └── useCashShift.ts
└── components/
    ├── OpenCashDialog.tsx
    ├── CloseCashDialog.tsx
    └── CashShiftStatus.tsx
```

---

## 🔧 Cómo Usar

### Para Desarrolladores

1. **Compilar frontend**:
   ```bash
   cd frontend
   npm run build
   ```

2. **Iniciar en desarrollo**:
   ```bash
   npm run dev
   ```

3. **Ver el tablero de pedidos**:
   - Navega a `/orders`
   - Verás el nuevo componente `CashShiftStatus`
   - Si no hay caja: botón "Abrir Caja" visible

### Para Usuarios (Flujo Normal)

1. **Inicio del turno**:
   - Abre la página de Pedidos
   - Ve "Caja Cerrada"
   - Cuenta el dinero inicial (ej: $500)
   - Hace click en "Abrir Caja"
   - Ingresa $500
   - ✅ Caja abierta

2. **Durante el turno**:
   - Crea pedidos normalmente
   - El tablero muestra solo pedidos de este turno
   - Aunque sea pasada medianoche, los pedidos no desaparecen

3. **Cierre de turno**:
   - Hace click en "Cerrar Caja"
   - Sistema muestra: "Esperado: $500 + ventas"
   - Cuenta el dinero actual
   - Ingresa el monto
   - Si coincide: cierra inmediatamente
   - Si hay diferencia: confirma la diferencia
   - ✅ Caja cerrada

---

## ⚙️ Validaciones Incluidas

### En Frontend
- ✅ Monto inicial debe ser número positivo
- ✅ No puede estar vacío
- ✅ Botón "Nuevo Pedido" deshabilitado sin caja
- ✅ Alerta visual si no hay caja

### En Backend (ya implementado)
- ✅ No permite crear orden sin caja abierta
- ✅ Filtra órdenes solo del turno actual
- ✅ Valida que el negocio tenga caja abierta

---

## 🎨 Estilos Aplicados

- **Caja Cerrada**: Card naranja, botón prominente
- **Caja Abierta**: Card verde, con detalles del turno
- **Diferencias**: Alerta naranja con icono de advertencia
- **Confirmaciones**: Diálogo con detalles de la diferencia

---

## 🧪 Testing Checklist

Antes de usar en producción:

- [ ] Abrir caja con monto inicial
- [ ] Crear 3+ pedidos
- [ ] Cerrar caja sin diferencia
- [ ] Cerrar caja con diferencia (debe pedir confirmación)
- [ ] Verificar órdenes desaparecen tras cerrar
- [ ] Abrir segunda caja
- [ ] Verificar órdenes nuevas van a segunda caja

---

## ⚠️ Requisitos Pendientes

### 1. **Database Migration** (CRÍTICO)
El backend está listo pero la base de datos necesita:
```sql
-- Agregar columna a tabla orders
ALTER TABLE orders ADD COLUMN cash_shift_id BIGINT;

-- Agregar restricción de clave foránea
ALTER TABLE orders ADD CONSTRAINT fk_orders_cash_shift 
    FOREIGN KEY (cash_shift_id) REFERENCES cash_shifts(id);

-- Hacer no nulo
ALTER TABLE orders ALTER COLUMN cash_shift_id SET NOT NULL;
```

**⚠️ Atención**: Órdenes existentes necesitan:
- Ser asignadas a una caja de referencia, O
- Ser eliminadas

### 2. **Compilación Backend**
```bash
cd backend
mvn clean compile
```

### 3. **Compilación Frontend** (opcional, para production)
```bash
cd frontend
npm run build
```

---

## 🚀 Flujo Completado

### Problema Original
> "Una pizzería puede abrir a las 20:00 PM y cerrar a las 02:00 AM del día siguiente. Si filtro los pedidos por 'Fecha actual', a la medianoche los pedidos desaparecen"

### Solución Implementada
1. **Backend**: CashShift entity agrupa órdenes por turno, no por fecha
2. **Frontend**: Interfaz para abrir/cerrar caja
3. **Logic**: Órdenes filtradas por caja abierta, no por date

### Resultado
✅ Órdenes ahora persisten a través de medianoche  
✅ Kanban muestra turno completo  
✅ Sistema de validación en caja  
✅ Cálculos automáticos de diferencias  

---

## 📱 Screenshots de Componentes

### CashShiftStatus - Estado Cerrado
```
┌────────────────────────────────────────────┐
│  $ Caja Cerrada                            │
│                                            │
│  Abre la caja para comenzar a             │
│  registrar ventas           [Abrir Caja] │
└────────────────────────────────────────────┘
```

### CashShiftStatus - Estado Abierto
```
┌────────────────────────────────────────────┐
│  $ Caja Abierta    ◆ ACTIVA               │
│                                            │
│  20:30   Jueves 5 de Febrero              │
│                                            │
│  ┌──────────┬───────────┬──────────┐      │
│  │Monto     │Estado     │Caja ID   │      │
│  │$500.00   │OPEN       │#1        │      │
│  └──────────┴───────────┴──────────┘      │
│                            [Cerrar Caja] │
└────────────────────────────────────────────┘
```

### CloseCashDialog - Con Diferencia
```
╔════════════════════════════════════════════╗
║  $ Cerrar Caja                             ║
╠════════════════════════════════════════════╣
║                                            ║
║  RESUMEN DE TURNO                          ║
║  Monto Inicial:        $500.00            ║
║  Ventas (efectivo):    $150.00            ║
║  Monto Esperado:       $650.00            ║
║                                            ║
║  MONTO FINAL EN CAJA: [________$600.00_]  ║
║                                            ║
║  ⚠  Diferencia detectada:                 ║
║  Se esperaba $650.00 pero registraste    ║
║  $600.00 (-$50.00)                       ║
║                                            ║
║  [Cancelar]              [Cerrar Caja]   ║
╚════════════════════════════════════════════╝
```

---

## 🔗 Endpoints API Usados

| Método | Endpoint | Función |
|--------|----------|---------|
| GET | `/api/cash-shifts/open?businessId=X` | Obtener caja abierta |
| POST | `/api/cash-shifts?businessId=X` | Abrir caja |
| PUT | `/api/cash-shifts/close?businessId=X` | Cerrar caja |
| GET | `/api/orders?businessId=X` | Órdenes del turno actual |
| GET | `/api/orders/historic?businessId=X` | Historial completo |

---

## 📞 Support / Troubleshooting

### "No hay caja abierta" error
- ✅ Click "Abrir Caja" en pantalla principal
- ✅ Ingresa monto inicial correcto

### Órdenes desaparecen al cerrar caja
- ✅ Comportamiento correcto (órdenes limitadas al turno)
- ✅ Ver con `/api/orders/historic` si necesitas historial

### "Botón Nuevo Pedido deshabilitado"
- ✅ No hay caja abierta
- ✅ Click "Abrir Caja" primero

### Errores de compilación TypeScript
- ✅ Ejecutar: `npm install`
- ✅ Limpiar: `rm -rf node_modules && npm install`

---

## 📚 Documentación Relacionada

- `CASHSHIFT_ARCHITECTURE.md` - Arquitectura técnica completa
- `frontend/CASHSHIFT_IMPLEMENTATION.md` - Detalles de implementación
- Backend code: `src/main/java/com/pizzeria/backend/...`

---

**¿Listo para empezar?** Avísame cuando hayas hecho los cambios en la base de datos.
