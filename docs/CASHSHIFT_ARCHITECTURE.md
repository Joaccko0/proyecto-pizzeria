# CashShift Architecture - Full Stack Implementation

**Last Updated**: February 5, 2026  
**Status**: ✅ Complete (Pending DB Migration)

---

## 📐 Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     FRONTEND (React/TypeScript)                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  OrdersPage.tsx (Container)                                     │
│  ├─ useCashShift() hook (State Management)                      │
│  ├─ useOrders() hook (Order Management)                         │
│  │                                                              │
│  ├─ CashShiftStatus (Display: Open/Closed)                     │
│  ├─ OpenCashDialog (Modal: startAmount input)                  │
│  ├─ CloseCashDialog (Modal: endAmount + calculations)          │
│  ├─ KanbanBoard (Restricted: only if open)                     │
│  └─ CreateOrderDialog (Disabled: if no cash shift)             │
│                                                                  │
│  Services Layer:                                                │
│  ├─ CashShiftService (API: /api/cash-shifts)                  │
│  ├─ OrderService (API: /api/orders)                           │
│  └─ [other services...]                                        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
              │ HTTP Requests (with businessId param)
              │
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND (Spring Boot/Java)                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  CashShiftController                                            │
│  ├─ POST /api/cash-shifts (openCashShift)                      │
│  ├─ PUT /api/cash-shifts/close (closeCashShift)               │
│  ├─ GET /api/cash-shifts/open (getOpenCashShift)              │
│  ├─ GET /api/cash-shifts (getAllCashShifts)                   │
│  └─ GET /api/cash-shifts/{id} (getCashShiftById)              │
│                                                                  │
│  OrderController (MODIFIED)                                     │
│  ├─ GET /api/orders (filters by open CashShift)               │
│  └─ GET /api/orders/historic (all orders, no filter)          │
│                                                                  │
│  CashShiftService                                               │
│  ├─ openCashShift() (creates OPEN shift)                       │
│  ├─ closeCashShift() (sets CLOSED, endAmount)                 │
│  ├─ getOpenCashShift() (throws if not found)                  │
│  ├─ getCashShiftById()                                         │
│  └─ getAllCashShifts()                                         │
│                                                                  │
│  OrderService (MODIFIED)                                        │
│  ├─ createOrder() (validates open CashShift exists)           │
│  ├─ getAllOrders() (filters by open CashShift)                │
│  └─ getAllOrdersHistoric() (all orders)                        │
│                                                                  │
│  Data Access Layer:                                             │
│  ├─ CashShiftRepository (custom queries)                       │
│  ├─ OrderRepository (custom queries)                           │
│  └─ [other repositories...]                                    │
│                                                                  │
│  Entities:                                                       │
│  ├─ CashShift (new entity)                                     │
│  ├─ Order (modified: added CashShift FK)                       │
│  └─ [other entities...]                                        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
              │ JPA/Hibernate ORM
              │
┌─────────────────────────────────────────────────────────────────┐
│                   PostgreSQL Database                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  cash_shifts                          orders                    │
│  ├─ id (PK)                           ├─ id (PK)             │
│  ├─ business_id (FK)                  ├─ business_id (FK)    │
│  ├─ status (OPEN|CLOSED)              ├─ cash_shift_id (FK) ←┘
│  ├─ start_date (timestamp)            ├─ [other fields...]   │
│  ├─ end_date (nullable)               └─ created_at          │
│  ├─ start_amount (numeric)                                   │
│  ├─ end_amount (nullable)                                    │
│  └─ [audit fields...]                                        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow: Open Cash

```
User clicks "Abrir Caja"
         ↓
   [OpenCashDialog Modal]
         ↓
  User inputs: $100
         ↓
   handleSubmit()
         ↓
   useCashShift.openCash(100)
         ↓
   CashShiftService.openCashShift(businessId, 100)
         ↓
   POST /api/cash-shifts?businessId=1 {startAmount: 100}
         ↓
   CashShiftController.openCashShift()
         ↓
   CashShiftService.openCashShift()
         ↓
   CashShiftRepository.findOpenCashShift() (check if already open)
         ↓
   [Create new CashShift entity with OPEN status]
         ↓
   Save to PostgreSQL
         ↓
   Return CashShiftResponse
         ↓
   Toast: "Caja abierta con $100.00"
         ↓
   [CashShiftStatus shows green "ACTIVA"]
         ↓
   [KanbanBoard becomes enabled]
         ↓
   ["Nuevo Pedido" button becomes enabled]
```

---

## 🔄 Data Flow: Close Cash

```
User clicks "Cerrar Caja"
         ↓
   [CloseCashDialog Modal]
         ↓
   [Auto-calculate expected: $100 + sales]
         ↓
  User inputs: $150 (or enters expected)
         ↓
   [If difference > $0.01, show alert]
         ↓
   [User confirms or cancels]
         ↓
   handleSubmit(150)
         ↓
   useCashShift.closeCash(150)
         ↓
   CashShiftService.closeCashShift(businessId, 150)
         ↓
   PUT /api/cash-shifts/close?businessId=1 {endAmount: 150}
         ↓
   CashShiftController.closeCashShift()
         ↓
   CashShiftService.closeCashShift()
         ↓
   CashShiftRepository.findOpenCashShift()
         ↓
   [Update: status = CLOSED, endAmount = 150, endDate = now]
         ↓
   Save to PostgreSQL
         ↓
   Return CashShiftResponse
         ↓
   Toast: "Caja cerrada con $150.00"
         ↓
   setOpenCashShift(null)
         ↓
   [CashShiftStatus shows orange "Cerrada"]
         ↓
   [KanbanBoard becomes disabled]
         ↓
   ["Nuevo Pedido" button becomes disabled]
```

---

## 🔄 Data Flow: Create Order (with validation)

```
User clicks "Nuevo Pedido"
         ↓
   [CreateOrderDialog opens]
         ↓
   [User selects products/combos, customer, etc]
         ↓
   User clicks "Crear Pedido"
         ↓
   handleCreateOrder(data)
         ↓
   [Frontend: Check if openCashShift exists]
         ↓
   If null → return false (don't send request)
         ↓
   OrderService.createOrder(businessId, data)
         ↓
   POST /api/orders?businessId=1 {data}
         ↓
   OrderController.createOrder()
         ↓
   OrderService.createOrder()
         ↓
   [CRITICAL: CashShiftService.getOpenCashShift()]
         ↓
   If no open shift → throw EntityNotFoundException
   Response: 404 or 500 with error message
         ↓
   [Assign fetched CashShift to order.cashShift]
         ↓
   [Create OrderItems for each product/combo]
         ↓
   Save Order to PostgreSQL
   (includes cash_shift_id foreign key)
         ↓
   Return OrderResponse
         ↓
   Frontend:
   - Toast: "Pedido creado"
   - useOrders.loadOrders() (refresh)
   - KanbanBoard updates with new order
```

---

## 🔄 Data Flow: Get Orders (filtered by shift)

```
KanbanBoard component mounts
         ↓
   useOrders.loadOrders()
         ↓
   OrderService.getOrders(businessId)
         ↓
   GET /api/orders?businessId=1
         ↓
   OrderController.getOrders()
         ↓
   OrderService.getAllOrders()
         ↓
   CashShiftService.getOpenCashShift()
         ↓
   [Get current open CashShift or throw]
         ↓
   OrderRepository.findByBusinessIdAndCashShiftOrderByCreatedAtDesc()
         ↓
   SELECT * FROM orders
   WHERE business_id = 1 AND cash_shift_id = <open_shift_id>
   ORDER BY created_at DESC
         ↓
   Return List<Order> (only current shift orders)
         ↓
   Map to List<OrderResponse>
         ↓
   Frontend:
   - Update orders state
   - KanbanBoard renders only these orders
   - Orders from previous shifts NOT shown

   Alternative: GET /api/orders/historic
   - Returns ALL orders for business
   - No CashShift filter
   - For historical reports
```

---

## 📊 Entity Relationships

### CashShift Entity
```java
@Entity
@Table(name = "cash_shifts")
public class CashShift extends BaseEntity {
    @Id
    private Long id;
    private Long businessId;                    // Multi-tenancy
    
    @Enumerated(EnumType.STRING)
    private CashShiftStatus status;            // OPEN or CLOSED
    
    @Column(name = "start_date")
    private LocalDateTime startDate;           // When shift opened
    
    @Column(name = "end_date", nullable = true)
    private LocalDateTime endDate;             // When shift closed
    
    @Column(name = "start_amount")
    private BigDecimal startAmount;            // Initial cash
    
    @Column(name = "end_amount", nullable = true)
    private BigDecimal endAmount;              // Final cash
    
    // No relationships to other entities
    // Orders reference CashShift (inverse side)
}

@Table(name = "orders")
public class Order extends BaseEntity {
    // ... existing fields ...
    
    @ManyToOne(fetch = LAZY)
    @JoinColumn(name = "cash_shift_id", nullable = false)
    private CashShift cashShift;               // REQUIRED FK
}
```

---

## 🔐 Multi-Tenancy & Security

**All operations validate businessId:**

```
Frontend:
├─ OrdersPage gets businessId from useBusiness()
├─ All API calls include ?businessId=X param
└─ CashShift operations always pass businessId

Backend:
├─ CashShiftService: every method validates businessId
├─ OrderService: only returns orders for current business
├─ Repositories: @Query filters by businessId
└─ JPA queries: WHERE business_id = :businessId

Database:
├─ CashShift.businessId indexed for performance
├─ Order.business_id ensures data isolation
└─ Foreign keys prevent orphaned records
```

---

## ⚠️ Critical Validations

### Frontend (OrdersPage)
1. ✅ Disable "Nuevo Pedido" button if no open CashShift
2. ✅ Show alert if no caja abierta
3. ✅ handleCreateOrder checks openCashShift before sending

### Backend (OrderService.createOrder)
1. ✅ Fetch open CashShift (throws if not found)
2. ✅ Assign CashShift to order (not null)
3. ✅ Validate businessId matches

### Database
1. ⏳ **PENDING**: Add cash_shift_id column to orders table
2. ⏳ **PENDING**: Add NOT NULL constraint
3. ⏳ **PENDING**: Add FK constraint to cash_shifts table
4. ⏳ **PENDING**: Handle existing orders (backfill or delete)

---

## 🚨 What Happens If...

| Scenario | Result |
|----------|--------|
| No CashShift open, user clicks "Nuevo Pedido" | Button disabled, cannot proceed |
| Frontend bypasses button (hacker), tries to create order | Backend rejects: 404/500 "No hay caja abierta" |
| CashShift exists but different businessId | Backend rejects: 403 Forbidden (data isolation) |
| User tries to close CashShift twice | 404 (second request finds no OPEN shift) |
| Sales amount calculated wrong | User sees alert + needs to confirm before closing |

---

## 📈 Business Logic Summary

```
Pizzeria opens at 20:00 (Feb 4)
1. Manager clicks "Abrir Caja" with $1000
   - CashShift created: OPEN, startAmount=$1000

2. Orders created 20:00 - 23:59 (Feb 4)
   - Each order.cashShift → points to this CashShift
   - Database stores: orders.cash_shift_id = 1

3. At 00:00 (midnight, now Feb 5)
   - BEFORE: Orders disappear (old date-based filtering)
   - AFTER: Orders STILL visible (CashShift-based filtering)

4. Orders created 00:00 - 02:00 (Feb 5)
   - Each order.cashShift → SAME CashShift (id=1)
   - Still appears on Kanban (same shift)

5. Manager clicks "Cerrar Caja" at 02:00
   - CashShift calculates: $1000 + (cash sales) = expected
   - Manager counts: $1250
   - System shows: -$250 difference (overage)
   - Manager confirms
   - CashShift: CLOSED, endAmount=$1250, endDate=02:00

6. Kanban now shows: "Caja Cerrada"
   - New orders BLOCKED
   - All orders from shift gone
   - Can only view via /historic endpoint
```

---

## ✅ Implementation Status

| Component | Backend | Frontend | Database | Tests |
|-----------|---------|----------|----------|-------|
| CashShift Entity | ✅ | - | ⏳ | - |
| CashShiftService | ✅ | - | ✅ | - |
| CashShiftController | ✅ | - | ✅ | - |
| CashShiftRepository | ✅ | - | ✅ | - |
| OrderService (modified) | ✅ | - | ✅ | - |
| OrderRepository (modified) | ✅ | - | ✅ | - |
| OrderController (modified) | ✅ | - | ✅ | - |
| useCashShift hook | - | ✅ | - | - |
| CashShiftService (FE) | - | ✅ | - | - |
| OpenCashDialog | - | ✅ | - | - |
| CloseCashDialog | - | ✅ | - | - |
| CashShiftStatus | - | ✅ | - | - |
| OrdersPage (modified) | - | ✅ | - | - |
| **CRITICAL**: DB Migration | - | - | ⏳ | - |

---

## 🎯 Next Steps

### Immediate (Required)
1. **Create Database Migration**
   ```sql
   ALTER TABLE orders ADD COLUMN cash_shift_id BIGINT;
   ALTER TABLE orders ADD CONSTRAINT fk_orders_cash_shift 
       FOREIGN KEY (cash_shift_id) REFERENCES cash_shifts(id);
   ALTER TABLE orders ALTER COLUMN cash_shift_id SET NOT NULL;
   ```

2. **Backend Compilation Test**
   ```bash
   cd backend && mvn clean compile
   ```

3. **Frontend Build Test**
   ```bash
   cd frontend && npm run build
   ```

### Testing
1. Integration tests for CashShift creation/closure
2. E2E tests for order creation with open shift
3. E2E tests for filtered order retrieval
4. UI tests for dialog flows

### Future Enhancements
1. CashShift history view (list all shifts)
2. Reports: shift summary, sales by payment method
3. Automatic shift creation (scheduled)
4. Multi-shift support (multiple simultaneous shifts)

---

**Architecture Review Date**: February 5, 2026  
**Approved By**: User (implied via "Avancemos, me parece bien")  
**Status**: Ready for Database Migration & Testing
