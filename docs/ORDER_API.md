# Order Management API Documentation

## Overview

This document describes the Order Management API endpoints for the Casir POS system. The API supports two main workflows:

1. **Public Self-Order** - Customers order without authentication (for kiosk/web ordering)
2. **Authenticated Order Management** - Staff/admin manage orders (requires auth token)

**Base URL**: `http://localhost:8000/api/v1`

**API Version**: v1

---

## Authentication

### Public Endpoints (Self-Order)
No authentication required. Customers are identified by `customer_identifier` (device fingerprint).

```
GET /self-order/menus
POST /self-order/orders
GET /self-order/orders/{customerIdentifier}
```

### Authenticated Endpoints (Order Management)
Require Laravel Sanctum bearer token. Pass token in Authorization header:

```
Authorization: Bearer {token}
```

**Status**: Phase 3 (to be implemented by Umar)

---

## Response Format

### Success Response
```json
{
  "message": "Human-readable success message",
  "data": { /* response payload */ }
}
```

### Paginated Response
```json
{
  "message": "Data order berhasil diambil.",
  "data": [ /* array of items */ ],
  "meta": {
    "current_page": 1,
    "last_page": 5,
    "per_page": 15,
    "total": 73
  }
}
```

### Error Response
```json
{
  "message": "Error description",
  "errors": {
    "field_name": ["Validation error message"]
  }
}
```

---

## PUBLIC ENDPOINTS (Self-Order)

### 1. Get Available Menus

List all available menus for self-order customers.

**Endpoint**: `GET /self-order/menus`

**Query Parameters**:
- `category_id` (optional, int) - Filter by category
- `search` (optional, string) - Search by name or description

**Response**: `200 OK`

```json
{
  "message": "Daftar menu berhasil diambil.",
  "data": [
    {
      "id": 1,
      "category_id": 1,
      "name": "Nasi Goreng Spesial",
      "slug": "nasi-goreng-spesial",
      "description": "Nasi goreng dengan telur, ayam, dan sayuran pilihan",
      "price": 25000,
      "image": null,
      "is_available": true,
      "category": {
        "id": 1,
        "name": "Makanan",
        "slug": "makanan"
      }
    },
    {
      "id": 9,
      "category_id": 2,
      "name": "Es Teh Manis",
      "slug": "es-teh-manis",
      "description": "Teh manis segar dengan es batu",
      "price": 8000,
      "image": null,
      "is_available": true,
      "category": {
        "id": 2,
        "name": "Minuman",
        "slug": "minuman"
      }
    }
  ]
}
```

**Example cURL**:
```bash
curl -X GET "http://localhost:8000/api/v1/self-order/menus" \
  -H "Accept: application/json"

# With category filter
curl -X GET "http://localhost:8000/api/v1/self-order/menus?category_id=1" \
  -H "Accept: application/json"

# With search
curl -X GET "http://localhost:8000/api/v1/self-order/menus?search=nasi" \
  -H "Accept: application/json"
```

---

### 2. Place Order (Self-Order)

Create a new order from a self-order customer.

**Endpoint**: `POST /self-order/orders`

**Request Body**:
```json
{
  "customer_identifier": "device-fingerprint-12345",
  "payment_method_id": 1,
  "notes": "Tidak pake sambal",
  "items": [
    {
      "menu_id": 1,
      "quantity": 1
    },
    {
      "menu_id": 9,
      "quantity": 2
    }
  ]
}
```

**Request Parameters**:
- `customer_identifier` (required, string, max 64) - Unique device fingerprint for tracking (24-hour session)
- `payment_method_id` (required, int) - ID of payment method
- `notes` (optional, string, max 2000) - Special instructions/notes
- `items` (required, array) - At least 1 item required
  - `menu_id` (required, int) - Menu ID to order
  - `quantity` (required, int) - Quantity (1-999)

**Response**: `201 Created`

```json
{
  "message": "Order berhasil dibuat. Silakan menunggu pesanan Anda diproses.",
  "data": {
    "id": 1,
    "user_id": null,
    "payment_method_id": 1,
    "table_number": null,
    "customer_identifier": "device-fingerprint-12345",
    "status": "pending",
    "total_price": 41000,
    "notes": "Tidak pake sambal",
    "paid_at": null,
    "is_self_order": true,
    "payment_method": {
      "id": 1,
      "name": "Cash",
      "description": "Pembayaran tunai langsung di kasir"
    },
    "items": [
      {
        "id": 1,
        "order_id": 1,
        "menu_id": 1,
        "menu_name": "Nasi Goreng Spesial",
        "quantity": 1,
        "price_at_order": 25000,
        "subtotal": 25000,
        "menu": {
          "id": 1,
          "name": "Nasi Goreng Spesial",
          "category_id": 1,
          "image": null
        },
        "created_at": "2026-07-14T07:04:45.000000Z",
        "updated_at": "2026-07-14T07:04:45.000000Z"
      },
      {
        "id": 2,
        "order_id": 1,
        "menu_id": 9,
        "menu_name": "Es Teh Manis",
        "quantity": 2,
        "price_at_order": 8000,
        "subtotal": 16000,
        "menu": {
          "id": 9,
          "name": "Es Teh Manis",
          "category_id": 2,
          "image": null
        },
        "created_at": "2026-07-14T07:04:45.000000Z",
        "updated_at": "2026-07-14T07:04:45.000000Z"
      }
    ],
    "created_at": "2026-07-14T07:04:45.000000Z",
    "updated_at": "2026-07-14T07:04:45.000000Z"
  }
}
```

**Validation Errors**: `422 Unprocessable Entity`

```json
{
  "message": "The selected items.0.menu_id is invalid.",
  "errors": {
    "items.0.menu_id": ["The selected items.0.menu_id is invalid."]
  }
}
```

**Example cURL**:
```bash
curl -X POST "http://localhost:8000/api/v1/self-order/orders" \
  -H "Content-Type: application/json" \
  -d '{
    "customer_identifier": "device-fp-12345",
    "payment_method_id": 1,
    "notes": "Tidak pake sambal",
    "items": [
      {"menu_id": 1, "quantity": 1},
      {"menu_id": 9, "quantity": 2}
    ]
  }'
```

---

### 3. Get Order Status by Customer Identifier

Track order status using customer device fingerprint. Returns all orders from the last 24 hours.

**Endpoint**: `GET /self-order/orders/{customerIdentifier}`

**Path Parameters**:
- `customerIdentifier` (required, string) - Device fingerprint provided when placing order

**Response**: `200 OK`

```json
{
  "message": "Status order berhasil diambil.",
  "data": [
    {
      "id": 1,
      "user_id": null,
      "payment_method_id": 1,
      "table_number": null,
      "customer_identifier": "device-fingerprint-12345",
      "status": "pending",
      "total_price": 41000,
      "notes": "Tidak pake sambal",
      "paid_at": null,
      "is_self_order": true,
      "payment_method": {
        "id": 1,
        "name": "Cash",
        "description": "Pembayaran tunai langsung di kasir"
      },
      "items": [ /* order items */ ],
      "created_at": "2026-07-14T07:04:45.000000Z",
      "updated_at": "2026-07-14T07:04:45.000000Z"
    }
  ]
}
```

**Example cURL**:
```bash
curl -X GET "http://localhost:8000/api/v1/self-order/orders/device-fingerprint-12345" \
  -H "Accept: application/json"
```

---

## AUTHENTICATED ENDPOINTS (Order Management)

> **Status**: Phase 3 - Requires Laravel Sanctum authentication (not yet implemented)

### Endpoint List

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/orders` | List all orders (paginated) |
| POST | `/orders` | Create new order |
| GET | `/orders/{id}` | Get order details |
| PUT/PATCH | `/orders/{id}` | Update order |
| PATCH | `/orders/{id}/status` | Update order status |
| DELETE | `/orders/{id}` | Delete order |

### 4. List Orders (Authenticated)

**Endpoint**: `GET /orders`

**Headers**:
```
Authorization: Bearer {token}
```

**Query Parameters**:
- `page` (optional, int, default 1) - Page number
- `per_page` (optional, int, default 15) - Items per page
- `search` (optional, string) - Search by table, customer identifier, or user name
- `sort_by` (optional, string, default 'created_at') - Sort field
- `sort_direction` (optional, 'asc'|'desc', default 'desc') - Sort direction
- `status` (optional, 'pending'|'processing'|'done'|'cancelled') - Filter by status
- `user_id` (optional, int) - Filter by user/karyawan
- `payment_method_id` (optional, int) - Filter by payment method
- `date` (optional, YYYY-MM-DD) - Filter by specific date
- `from_date` (optional, YYYY-MM-DD) - Filter from date range
- `to_date` (optional, YYYY-MM-DD) - Filter to date range

**Response**: `200 OK`

```json
{
  "message": "Data order berhasil diambil.",
  "data": [ /* array of orders */ ],
  "meta": {
    "current_page": 1,
    "last_page": 5,
    "per_page": 15,
    "total": 73
  }
}
```

**Example cURL**:
```bash
curl -X GET "http://localhost:8000/api/v1/orders?status=pending&page=1&per_page=10" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Accept: application/json"
```

---

### 5. Create Order (Authenticated)

**Endpoint**: `POST /orders`

**Headers**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body**:
```json
{
  "table_number": "5",
  "payment_method_id": 1,
  "notes": "Pesanan untuk ruang VIP",
  "items": [
    {
      "menu_id": 1,
      "quantity": 2
    }
  ]
}
```

**Request Parameters**:
- `table_number` (optional, string, max 20) - Table number for dine-in
- `payment_method_id` (optional, int) - Payment method (can be set later)
- `notes` (optional, string, max 2000) - Order notes
- `items` (required, array) - At least 1 item

**Response**: `201 Created`

**Example cURL**:
```bash
curl -X POST "http://localhost:8000/api/v1/orders" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "table_number": "5",
    "payment_method_id": 1,
    "notes": "Pesanan untuk ruang VIP",
    "items": [{"menu_id": 1, "quantity": 2}]
  }'
```

---

### 6. Get Order Details

**Endpoint**: `GET /orders/{id}`

**Headers**:
```
Authorization: Bearer {token}
```

**Response**: `200 OK`

Returns single order with all items and relationships.

---

### 7. Update Order Status

**Endpoint**: `PATCH /orders/{id}/status`

**Headers**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body**:
```json
{
  "status": "processing"
}
```

**Status Values**: `pending` → `processing` → `done` (or `cancelled`)

**Rules**:
- Cannot change status if already `done` or `cancelled`
- Auto-set `paid_at` when status changes to `done`

**Response**: `200 OK`

**Example cURL**:
```bash
curl -X PATCH "http://localhost:8000/api/v1/orders/1/status" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "processing"}'
```

---

## Payment Methods

Get list of active payment methods for order creation:

```json
[
  {"id": 1, "name": "Cash", "description": "Pembayaran tunai langsung di kasir"},
  {"id": 2, "name": "QRIS", "description": "Pembayaran via QRIS scan"},
  {"id": 3, "name": "Transfer", "description": "Pembayaran via transfer bank"}
]
```

---

## Order Statuses

| Status | Description | Transitions |
|--------|-------------|------------|
| `pending` | Order created, waiting for processing | → processing, cancelled |
| `processing` | Being prepared in kitchen | → done, cancelled |
| `done` | Completed and served | (final) |
| `cancelled` | Order cancelled | (final) |

---

## Error Codes

| Code | Status | Meaning |
|------|--------|---------|
| 200 | OK | Success |
| 201 | Created | Resource created successfully |
| 422 | Unprocessable Entity | Validation error |
| 404 | Not Found | Resource not found |
| 500 | Internal Server Error | Server error |

---

## Features Implemented

✅ **Price Snapshot** - Menu price captured at order time  
✅ **Auto Total Calculation** - Total computed from items  
✅ **Duplicate Item Merge** - Same menu merged with summed quantity  
✅ **Self-Order Tracking** - 24-hour session via customer_identifier  
✅ **Advanced Filtering** - Filter by status, date, user, payment method  
✅ **Status Transitions** - Validated status flow  
✅ **Order Items Relationship** - Full order with items in response  
✅ **Payment Method Integration** - Links to payment methods

---

## Testing

All public endpoints have been tested and verified working:
- ✅ GET /self-order/menus
- ✅ POST /self-order/orders
- ✅ GET /self-order/orders/{customerIdentifier}
- ✅ Validation error handling
- ✅ Duplicate item merging

---

## Next Steps

- Phase 3: Implement Authentication (Umar)
- Phase 3: Implement Dashboard endpoints (Umar)
- Phase 7: Implement User Management (Bani)
- Phase 11: Add comprehensive test suite
