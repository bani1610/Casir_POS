# Product Requirements Document (PRD)

| Field        | Value              |
|--------------|--------------------|
| **Version**  | 1.0                |
| **Status**   | Draft              |
| **Author**   | Product Manager    |
| **Last Updated** | 2026-07-04     |

---

# 1. Product Overview

## Product Name
**Casir POS**

## Product Vision

Membangun sistem Point of Sale (POS) berbasis web yang mudah digunakan, cepat, dan andal untuk pelaku UMKM. Casir POS hadir untuk menggantikan proses penjualan manual dengan solusi digital yang modern, responsif di berbagai perangkat, dan dilengkapi laporan bisnis otomatis.

---

# 2. Background

Proses penjualan yang masih dilakukan secara manual sering menimbulkan human error, mulai dari pencatatan transaksi yang tidak akurat hingga rekap harian atau bulanan yang tidak terkendali. Hal ini menyebabkan kerugian bisnis dan kesulitan dalam pengambilan keputusan.

Tim mengembangkan **Casir POS** sebagai solusi digital yang menghubungkan tiga aktor utama:

| Aktor       | Peran                                       |
|-------------|---------------------------------------------|
| **Owner / Admin** | Mengelola bisnis, menu, karyawan, dan laporan |
| **Karyawan**      | Menerima dan memproses pesanan pelanggan      |
| **Pembeli**       | Melihat menu dan melakukan pemesanan mandiri  |

**Design System:** Casir menggunakan *Casir Design System* yang dibangun di atas **Tailwind CSS** untuk konsistensi visual dan pengembangan yang cepat.

### Fitur Utama

- Dashboard Admin, Karyawan, dan Pembeli
- Manajemen Karyawan (CRUD)
- Manajemen Menu & Harga (CRUD)
- Manajemen Order (CRUD)
- Grafik & Statistik Penjualan
- Ekspor Laporan Bulanan ke Excel/PDF

---

# 3. Goals

## Business Goals

- Meningkatkan efisiensi operasional penjualan
- Mengurangi human error dalam pencatatan transaksi
- Digitalisasi seluruh proses penjualan dan pelaporan
- Menghasilkan laporan keuangan yang lebih akurat dan real-time
- Memungkinkan rekapan data diakses kapan saja dan di mana saja

## User Goals

- Antarmuka yang mudah dipahami tanpa pelatihan khusus
- Tampilan responsif di desktop, tablet, dan mobile
- Kecepatan proses transaksi yang tinggi
- Data order dan stok yang selalu real-time
- Notifikasi dan konfirmasi yang jelas pada setiap aksi

---

# 4. Success Metrics

| Metrik                        | Target           |
|-------------------------------|------------------|
| Waktu login                   | < 1 detik        |
| Waktu load dashboard          | < 2 detik        |
| Error rate produksi           | < 1%             |
| Waktu proses order            | < 30 detik       |
| Uptime sistem                 | >= 99%           |
| Seluruh fitur utama berjalan  | Tanpa bug kritis |

---

# 5. Target Users

## Primary User - Admin / Owner

**Deskripsi:** Pemilik atau pengelola bisnis yang memiliki akses penuh ke sistem.

**Kebutuhan:**
- Mengelola seluruh data (menu, karyawan, order)
- Membuat dan mengunduh laporan penjualan
- Monitoring aktivitas real-time
- Membuat dan mengelola akun karyawan
- Mengatur daftar menu beserta harga

---

## Secondary User - Karyawan / Staff

**Deskripsi:** Pegawai yang bertugas melayani pelanggan di kasir.

**Kebutuhan:**
- Menerima dan memproses pesanan pelanggan
- Membuat order baru
- Melihat daftar menu dan stok
- Melihat total harga dan status pembayaran
- Mencetak atau mengirim struk transaksi

---

## Tertiary User - Pembeli

**Deskripsi:** Pelanggan yang melakukan pemesanan secara mandiri (self-order).

**Kebutuhan:**
- Melihat daftar menu yang tersedia
- Melakukan pemesanan secara mandiri
- Menghapus item sebelum order dikonfirmasi
- Memilih metode pembayaran
- Melihat riwayat order selama sesi berlangsung
- Tidak perlu registrasi/login - sesi berbasis device (1 device = 1 sesi, reset setiap 24 jam)

---

# 6. User Roles

## Super Admin / Owner

**Hak Akses:**

- CRUD seluruh data (menu, karyawan, order, laporan)
- Mengelola akun karyawan (tambah, edit, nonaktifkan, hapus)
- Melihat dan mengunduh laporan keuangan
- Konfigurasi sistem (nama toko, jam operasional, metode pembayaran)
- Melihat audit log

---

## Karyawan

**Hak Akses:**

- Membuat dan mengelola order aktif
- Memproses pembayaran
- Melihat daftar menu dan harga
- Mencetak struk
- Tidak dapat mengakses laporan keuangan atau manajemen karyawan

---

## Pembeli

**Hak Akses:**

- Melihat daftar menu yang tersedia
- Melakukan order mandiri
- Menghapus item dari keranjang sebelum dikonfirmasi
- Memilih metode pembayaran
- Melihat riwayat order dalam sesi aktif
- Tidak perlu login - sesi berbasis device selama 24 jam

---

# 7. User Journey

## Admin Journey

```
Admin
  |
  v
Login (email + password)
  |
  v
Dashboard Admin
  +-- Melihat statistik penjualan hari ini
  +-- Melihat order terbaru
  +-- Melihat notifikasi sistem
  |
  v
Melakukan Aktivitas
  +-- Kelola Menu (tambah / edit / hapus)
  +-- Kelola Karyawan (tambah / edit / nonaktifkan)
  +-- Lihat & Unduh Laporan
  +-- Konfigurasi Sistem
  |
  v
Logout
```

---

## Karyawan Journey

```
Karyawan
  |
  v
Login (email + password)
  |
  v
Dashboard Karyawan
  +-- Melihat daftar order aktif
  +-- Melihat status meja / antrian
  |
  v
Proses Order
  +-- Pilih menu dari daftar
  +-- Konfirmasi pesanan pelanggan
  +-- Proses pembayaran
  +-- Cetak / kirim struk
  |
  v
Logout
```

---

## Pembeli Journey

```
Pembeli (tanpa login)
  |
  v
Scan QR / Akses URL meja
  |
  v
Lihat Daftar Menu
  |
  v
Tambah item ke Keranjang
  |
  v
Review Order (hapus / ubah qty)
  |
  v
Pilih Metode Pembayaran
  |
  v
Konfirmasi Order
  |
  v
Tampil Status Order (menunggu / diproses / selesai)
```

---

# 8. Core Features

## Authentication

### Login

**Deskripsi:** User (admin/karyawan) dapat login menggunakan email dan password.

**Acceptance Criteria:**
- [ ] Validasi format email
- [ ] Validasi password (min 8 karakter)
- [ ] Fitur "Remember Me" (sesi 30 hari)
- [ ] Tombol logout tersedia di seluruh halaman
- [ ] Redirect ke dashboard sesuai role setelah login berhasil
- [ ] Pesan error yang jelas saat login gagal

---

### Register (Admin Only)

**Deskripsi:** Admin membuat akun karyawan baru dari panel manajemen user.

**Acceptance Criteria:**
- [ ] Validasi email (unique)
- [ ] Password minimal 8 karakter dengan konfirmasi
- [ ] Role dapat ditentukan saat pembuatan akun
- [ ] Email notifikasi dikirim ke karyawan baru (opsional)

---

### Forgot Password

**Acceptance Criteria:**
- [ ] Form input email tersedia
- [ ] Email reset password dikirim jika email terdaftar
- [ ] Token reset berlaku selama 15 menit
- [ ] Password baru harus dikonfirmasi

---

## Dashboard

### Dashboard Admin

**Menampilkan:**
- Total pendapatan hari ini / bulan ini
- Total order aktif, selesai, dan dibatalkan
- Grafik penjualan harian/mingguan/bulanan
- Daftar order terbaru (5 terakhir)
- Statistik menu terlaris

### Dashboard Karyawan

**Menampilkan:**
- Daftar order aktif yang perlu diproses
- Status order per meja / nomor antrian
- Tombol cepat untuk buat order baru

---

## Manajemen Menu

**Fitur:**
- Tambah menu baru (nama, harga, kategori, foto, deskripsi)
- Edit menu
- Hapus menu (soft delete)
- Nonaktifkan menu (tanpa menghapus)
- Kategori menu (Makanan, Minuman, Snack, dll.)
- Upload foto menu

---

## Manajemen Order

**Fitur:**
- Buat order baru
- Tambah / hapus item dari order
- Update status order (pending -> diproses -> selesai / dibatalkan)
- Cetak struk / nota digital
- Riwayat order dengan filter tanggal

---

## Manajemen Karyawan

**Fitur (Admin Only):**
- Tambah akun karyawan baru
- Edit data karyawan
- Nonaktifkan / aktifkan akun karyawan
- Reset password karyawan
- Lihat riwayat aktivitas karyawan

---

## Laporan

**Fitur:**
- Laporan penjualan harian, mingguan, bulanan
- Filter berdasarkan tanggal, kategori, karyawan
- Grafik tren penjualan
- Ekspor ke **Excel (.xlsx)** dan **PDF**
- Ringkasan menu terlaris

---


## Notifikasi

**Jenis:**
- In-App: notifikasi order baru, order selesai
- Toast notification untuk setiap aksi CRUD

---

## Search & Filter

**Support:**
- Pencarian berdasarkan keyword
- Filter berdasarkan kategori, status, tanggal
- Sorting ascending / descending
- Pagination

---

## Export

**Support:**
- PDF
- Excel (.xlsx)
- CSV

---

## Audit Log

**Mencatat aktivitas:**
- Login / Logout
- Create, Read, Update, Delete data
- Perubahan konfigurasi sistem
- Akses laporan

---

# 9. Functional Requirements

| ID     | Deskripsi                                                              | Priority |
|--------|------------------------------------------------------------------------|----------|
| FR-001 | Admin dan karyawan dapat login menggunakan email dan password          | High     |
| FR-002 | User dapat logout dari sistem                                          | High     |
| FR-003 | Admin dapat melakukan CRUD menu (nama, harga, kategori, foto)          | High     |
| FR-004 | Admin dapat mengelola akun karyawan (tambah, edit, nonaktifkan)        | High     |
| FR-005 | Karyawan dapat membuat dan memproses order                             | High     |
| FR-006 | Karyawan dapat memproses pembayaran dan mencetak struk                 | High     |
| FR-007 | Pembeli dapat melihat menu dan melakukan order mandiri tanpa login     | High     |
| FR-008 | Dashboard admin menampilkan statistik penjualan real-time              | High     |
| FR-009 | Admin dapat mengunduh laporan penjualan (PDF / Excel)                  | High     |
| FR-010 | Sistem mencatat seluruh aktivitas penting di audit log                 | Medium   |
| FR-011 | Admin dapat mengkonfigurasi nama toko dan metode pembayaran            | Medium   |
| FR-012 | User mendapatkan notifikasi in-app untuk setiap aksi penting           | Medium   |
| FR-013 | Sistem mendukung pencarian dan filter pada seluruh data tabel          | Medium   |
| FR-014 | Pembeli mendapatkan sesi berbasis device selama 24 jam                 | Medium   |
| FR-015 | Admin dapat mengatur kategori menu                                     | Low      |

---

# 10. Non-Functional Requirements

## Performance
- Response time API < 2 detik untuk semua endpoint
- Load dashboard < 2 detik pada koneksi 4G
- Support minimal 50 concurrent user

## Security
- CSRF Protection
- XSS Protection
- SQL Injection Protection
- Rate Limiting (login: max 5 percobaan / menit)
- Password di-hash menggunakan bcrypt
- HTTPS wajib di production
- CORS dikonfigurasi hanya untuk domain yang diizinkan

## Availability
- Uptime >= 99%
- Recovery time < 1 jam

## Responsiveness
- **Desktop** - >= 1280px
- **Tablet** - 768px - 1279px
- **Mobile** - 320px - 767px

## Browser Support
- Google Chrome (latest)
- Mozilla Firefox (latest)
- Microsoft Edge (latest)
- Safari (latest)
- brave (latest)
---

# 11. UI/UX Guidelines

| Aspek           | Nilai                                  |
|-----------------|----------------------------------------|
| **Style**       | Modern Minimalist                      |
| **Color Mode**  | Light Mode (Dark Mode Ready)           |
| **Primary**     | Brand color (misal: Indigo #4d50f0ff)    |
| **Secondary**   | Slate / Gray                           |
| **Success**     | Green #22C55E                          |
| **Danger**      | Red #EF4444                            |
| **Warning**     | Amber #F59E0B                          |
| **Typography**  | Inter (Google Fonts)                   |
| **Spacing**     | 8px Grid System                        |
| **Border Radius** | 12px                                 |
| **Shadow**      | Soft shadow (shadow-sm / shadow-md)    |
| **Animation**   | 200ms ease transition                  |
| **Icon Library** | Lucide React                          |

---

# 12. Navigation Structure

## Admin Panel

```
Dashboard
  +-- Home (Statistik & Ringkasan)
  +-- Orders (Daftar & Kelola Order)
  +-- Menu (Daftar Menu & Kategori)
  +-- Karyawan (Manajemen Akun Karyawan)
  +-- Laporan (Grafik & Ekspor)
  +-- Pengaturan (Konfigurasi Toko)
  +-- Profil
```

## Karyawan Panel

```
Dashboard
  +-- Home (Order Aktif)
  +-- Buat Order
  +-- Riwayat Order
  +-- Profil
```

## Pembeli (Self-Order)

```
Beranda
  +-- Daftar Menu (by Kategori)
  +-- Keranjang
  +-- Checkout & Pembayaran
  +-- Status Order
```

---

# 13. Database Design

## Tabel Utama

### users

| Kolom        | Tipe           | Keterangan              |
|--------------|----------------|-------------------------|
| id           | bigint (PK)    | Primary Key             |
| name         | varchar(255)   | Nama lengkap            |
| email        | varchar(255)   | Unique                  |
| password     | varchar(255)   | Bcrypt hash             |
| role         | enum           | admin, karyawan         |
| is_active    | boolean        | Status akun             |
| created_at   | timestamp      |                         |
| updated_at   | timestamp      |                         |

### menus

| Kolom        | Tipe           | Keterangan              |
|--------------|----------------|-------------------------|
| id           | bigint (PK)    |                         |
| category_id  | bigint (FK)    | Relasi ke categories    |
| name         | varchar(255)   | Nama menu               |
| description  | text           | Deskripsi menu          |
| price        | decimal(10,2)  | Harga                   |
| image        | varchar(255)   | Path foto               |
| is_available | boolean        | Status ketersediaan     |
| created_at   | timestamp      |                         |
| updated_at   | timestamp      |                         |

### categories

| Kolom        | Tipe           | Keterangan              |
|--------------|----------------|-------------------------|
| id           | bigint (PK)    |                         |
| name         | varchar(100)   | Makanan, Minuman, dll.  |
| created_at   | timestamp      |                         |

### orders

| Kolom          | Tipe           | Keterangan                            |
|----------------|----------------|---------------------------------------|
| id             | bigint (PK)    |                                       |
| user_id        | bigint (FK)    | Karyawan yang membuat order           |
| table_number   | varchar(20)    | Nomor meja / kode antrian             |
| status         | enum           | pending, processing, done, cancelled  |
| total_price    | decimal(10,2)  |                                       |
| payment_method | varchar(50)    | cash, qris, transfer                  |
| notes          | text           | Catatan tambahan                      |
| created_at     | timestamp      |                                       |
| updated_at     | timestamp      |                                       |

### order_items

| Kolom        | Tipe           | Keterangan              |
|--------------|----------------|-------------------------|
| id           | bigint (PK)    |                         |
| order_id     | bigint (FK)    | Relasi ke orders        |
| menu_id      | bigint (FK)    | Relasi ke menus         |
| quantity     | int            |                         |
| price        | decimal(10,2)  | Harga saat order        |
| subtotal     | decimal(10,2)  |                         |

### audit_logs

| Kolom        | Tipe           | Keterangan              |
|--------------|----------------|-------------------------|
| id           | bigint (PK)    |                         |
| user_id      | bigint (FK)    | Siapa yang melakukan    |
| action       | varchar(100)   | login, create, update   |
| model        | varchar(100)   | Tabel yang terpengaruh  |
| description  | text           | Detail aktivitas        |
| created_at   | timestamp      |                         |

## ERD Relasi

```
users (1) --< orders (many)
orders (1) --< order_items (many)
menus (1) --< order_items (many)
categories (1) --< menus (many)
users (1) --< audit_logs (many)
```

---

# 14. API Design

> Base URL: `/api/v1`
> Authentication: Bearer Token (Laravel Sanctum)
> Format Response: JSON

## Authentication

| Method | Endpoint                  | Deskripsi             |
|--------|---------------------------|-----------------------|
| POST   | `/auth/login`             | Login user            |
| POST   | `/auth/logout`            | Logout user           |
| GET    | `/auth/me`                | Data user aktif       |
| POST   | `/auth/forgot-password`   | Request reset password|
| POST   | `/auth/reset-password`    | Reset password        |

## Users (Admin Only)

| Method | Endpoint          | Deskripsi           |
|--------|-------------------|---------------------|
| GET    | `/users`          | Daftar karyawan     |
| POST   | `/users`          | Tambah karyawan     |
| GET    | `/users/{id}`     | Detail karyawan     |
| PUT    | `/users/{id}`     | Update karyawan     |
| DELETE | `/users/{id}`     | Hapus karyawan      |

## Menu

| Method | Endpoint          | Deskripsi           |
|--------|-------------------|---------------------|
| GET    | `/menus`          | Daftar menu         |
| POST   | `/menus`          | Tambah menu         |
| GET    | `/menus/{id}`     | Detail menu         |
| PUT    | `/menus/{id}`     | Update menu         |
| DELETE | `/menus/{id}`     | Hapus menu          |

## Kategori

| Method | Endpoint           | Deskripsi           |
|--------|--------------------|---------------------|
| GET    | `/categories`      | Daftar kategori     |
| POST   | `/categories`      | Tambah kategori     |
| PUT    | `/categories/{id}` | Update kategori     |
| DELETE | `/categories/{id}` | Hapus kategori      |

## Order

| Method | Endpoint                  | Deskripsi              |
|--------|---------------------------|------------------------|
| GET    | `/orders`                 | Daftar order           |
| POST   | `/orders`                 | Buat order baru        |
| GET    | `/orders/{id}`            | Detail order           |
| PUT    | `/orders/{id}`            | Update order           |
| PATCH  | `/orders/{id}/status`     | Update status order    |
| DELETE | `/orders/{id}`            | Batalkan order         |

## Laporan (Admin Only)

| Method | Endpoint              | Deskripsi                   |
|--------|-----------------------|-----------------------------|
| GET    | `/reports/daily`      | Laporan harian              |
| GET    | `/reports/monthly`    | Laporan bulanan             |
| GET    | `/reports/export`     | Ekspor laporan (PDF/Excel)  |

---

# 15. Validation Rules

| Field         | Aturan                                              |
|---------------|-----------------------------------------------------|
| email         | Required, format email valid, unique (users)        |
| password      | Required, min 8 karakter, konfirmasi wajib sama     |
| name          | Required, max 255 karakter                          |
| phone         | Numeric, max 15 digit                               |
| price         | Required, numeric, min 0                            |
| quantity      | Required, integer, min 1                            |
| image         | Optional, mimes: jpg, png, webp, max 2MB            |

---

# 16. Error Handling

| HTTP Code | Kode Error            | Keterangan                    |
|-----------|-----------------------|-------------------------------|
| 400       | BAD_REQUEST           | Request tidak valid           |
| 401       | UNAUTHORIZED          | Belum login / token invalid   |
| 403       | FORBIDDEN             | Tidak punya izin akses        |
| 404       | NOT_FOUND             | Data tidak ditemukan          |
| 422       | VALIDATION_ERROR      | Data tidak lolos validasi     |
| 429       | TOO_MANY_REQUESTS     | Rate limit terlampaui         |
| 500       | INTERNAL_SERVER_ERROR | Kesalahan server              |

**Format Response Error:**
```json
{
  "success": false,
  "message": "Pesan error yang informatif",
  "errors": {
    "field": ["detail validasi"]
  }
}
```

---

# 17. Tech Stack

## Backend

| Teknologi         | Versi / Detail        |
|-------------------|-----------------------|
| Laravel           | 12                    |
| PHP               | 8.3+                  |
| MySQL             | 8.0+                  |
| Laravel Sanctum   | Authentication API    |
| Redis             | Queue & Caching       |

## Frontend

| Teknologi           | Detail                |
|---------------------|-----------------------|
| React               | 18+                   |
| Vite                | Build tool            |
| Tailwind CSS        | Styling               |
| Lucide React        | Icon library          |
| Chart.js / Recharts | Visualisasi grafik    |
| Zustand             | State management      |
| React Hook Form     | Form handling         |
| Zod                 | Schema validation     |
| Axios               | HTTP client           |
| Sonner              | Toast notification    |
| Day.js              | Date utility          |
| React Router DOM    | Client-side routing   |

## DevOps & Tools

| Teknologi         | Detail                      |
|-------------------|-----------------------------|
| GitHub Actions    | CI/CD                       |
| Ubuntu Server     | Production server           |
| Nginx             | Web server                  |
| PHP-FPM           | FastCGI process             |
| Supervisor        | Queue worker                |
| SSL / HTTPS       | Wajib di production         |

---

# 18. Laravel Architecture

## Layer Architecture

```
HTTP Request
    |
    v
Middleware (auth, rate limit, role)
    |
    v
Controller (hanya routing & response)
    |
    v
Form Request (validasi)
    |
    v
Service (business logic)
    |
    v
Repository (query database)
    |
    v
Model (Eloquent ORM)
    |
    v
Resource (format response JSON)
```

## Folder Structure

```
app/
+-- Http/
|   +-- Controllers/
|   +-- Middleware/
|   +-- Requests/
+-- Services/
+-- Repositories/
+-- Models/
+-- Policies/
+-- Observers/
+-- Jobs/
+-- Events/
+-- Listeners/
+-- Resources/
```

---

# 19. React Architecture

## Folder Structure

```
src/
+-- components/       # Reusable UI components
|   +-- ui/           # Button, Input, Modal, Table, Card
|   +-- shared/       # Header, Sidebar, etc.
+-- pages/            # Halaman per route
+-- layouts/          # Layout wrapper (AdminLayout, etc.)
+-- hooks/            # Custom React hooks
+-- services/         # API call functions (Axios)
+-- stores/           # Zustand state management
+-- types/            # TypeScript interfaces & types
+-- routes/           # Route configuration
+-- utils/            # Helper functions
+-- assets/           # Gambar, ikon, font
+-- contexts/         # React Context
+-- providers/        # Provider wrapper
```

## Component Rules

- Gunakan **Functional Component** dengan hooks
- **Dilarang** menggunakan Class Component
- Setiap komponen harus **reusable** dan **atomic**
- Hindari duplikasi kode - buat komponen generik:
  - `<ReusableTable />`
  - `<ReusableModal />`
  - `<ReusableForm />`
  - `<ReusableButton />`
  - `<ReusableCard />`
- Gunakan **TypeScript** untuk type safety

---

# 20. Coding Standards

## Laravel
- Ikuti standar **PSR-12**
- Terapkan prinsip **SOLID**
- Gunakan **Repository Pattern** untuk akses data
- Gunakan **Service Pattern** untuk business logic
- **Dilarang** menulis business logic di Controller
- Validasi selalu menggunakan **Form Request**
- Response API selalu menggunakan **API Resource**

## React / TypeScript
- Gunakan **Functional Component** dan Hooks
- Deklarasikan tipe dengan TypeScript (hindari `any`)
- Pisahkan logic ke custom hooks
- Gunakan `const` untuk semua fungsi komponen
- Nama file komponen: **PascalCase** (`MenuCard.tsx`)
- Nama file hook: **camelCase** dengan prefix `use` (`useOrders.ts`)

---

# 21. Security

| Aspek                  | Implementasi                               |
|------------------------|--------------------------------------------|
| Authentication         | Laravel Sanctum (Bearer Token)             |
| Authorization          | Laravel Policies + Middleware Role         |
| Password               | Bcrypt hash (cost factor default)          |
| Input Validation       | Laravel Form Request + Zod (frontend)      |
| Rate Limiting          | Laravel Rate Limiter (login: 5x/menit)     |
| Sanitization           | Laravel auto-escaping + strip_tags         |
| HTTPS                  | Wajib di production                        |
| CORS                   | Konfigurasi whitelist domain               |
| CSRF                   | Laravel CSRF middleware                    |
| XSS Protection         | Escaping output + DOMPurify (frontend)     |
| SQL Injection          | Eloquent ORM / parameterized queries       |

---

# 22. Logging

**Yang dicatat:**

| Event          | Detail                              |
|----------------|-------------------------------------|
| Login          | User, IP, timestamp, status         |
| Logout         | User, timestamp                     |
| Create         | Model, data baru, user              |
| Update         | Model, data lama vs baru, user      |
| Delete         | Model, data yang dihapus, user      |
| Exception      | Stack trace, endpoint, user         |
| API Request    | Method, endpoint, status, latency   |

**Tool:** Laravel Log (Monolog) + custom `AuditLog` model

---

# 23. Testing

## Backend (PHPUnit)

- **Feature Test** - testing endpoint API end-to-end
- **Unit Test** - testing Service dan Repository layer
- Coverage target: >= 80% pada fitur utama

## Frontend (Vitest + React Testing Library)

- **Component Test** - render dan interaksi komponen
- **Hook Test** - logic custom hooks
- **Integration Test** - alur form dan API call

---

# 24. Deployment

## Production Stack

| Komponen      | Teknologi               |
|---------------|-------------------------|
| Server OS     | Ubuntu Server LTS       |
| Web Server    | Nginx                   |
| PHP Runtime   | PHP-FPM 8.3             |
| Database      | MySQL 8.0               |
| Cache / Queue | Redis                   |
| Process Mgr   | Supervisor              |
| SSL           | Let's Encrypt / Certbot |

## CI/CD (GitHub Actions)

```
push ke branch main
    |
    v
Run Tests (PHPUnit + Vitest)
    |
    v
Build frontend (npm run build)
    |
    v
Deploy ke server (SSH)
    |
    v
php artisan migrate --force
    |
    v
Restart queue worker
```

---

# 25. Future Roadmap

| Phase   | Fitur                                                 | Estimasi  |
|---------|-------------------------------------------------------|-----------|
| Phase 1 | MVP: Auth, Menu, Order, Dashboard, Laporan            | Bulan 1-2 |
| Phase 2 | Notifikasi real-time (Laravel Echo + Pusher)          | Bulan 3   |
| Phase 3 | Manajemen stok / inventory                            | Bulan 4   |
| Phase 4 | Mobile App (React Native / PWA)                       | Bulan 5-6 |
| Phase 5 | AI Integration (prediksi penjualan, rekomendasi menu) | TBD       |

---

# 26. Constraints

- Framework backend **wajib Laravel 12** dengan PHP 8.3+
- Framework frontend **wajib React** dengan Vite
- Database **wajib MySQL**
- Komunikasi client-server menggunakan **REST API**
- Tampilan harus **responsif** di semua ukuran layar
- Arsitektur mengikuti **Clean Architecture + SOLID**
- Wajib menggunakan **Repository Pattern** dan **Service Pattern**
- Komponen frontend harus **reusable** dan tidak duplikat
- Wajib **Dark Mode Ready** (CSS variable / Tailwind dark mode)
- **Production Ready** sejak awal (env, error handling, logging)

---

# 27. Out of Scope

Berikut fitur yang **tidak termasuk** dalam versi ini:

- Mobile Native (iOS / Android)
- Desktop Application (Electron)
- Multi-Tenant (satu sistem untuk banyak toko)
- Offline Mode
- Integrasi payment gateway eksternal (Midtrans, Xendit) - fase berikutnya
- Manajemen stok / inventory - fase berikutnya

---

# 28. Acceptance Criteria

Aplikasi dinyatakan selesai dan siap rilis apabila memenuhi seluruh kriteria berikut:

- [x] Seluruh fitur utama (Auth, Menu, Order, Laporan, Dashboard) berjalan dengan benar
- [x] Tidak ada error critical atau blocker di production
- [x] Tampilan responsif di desktop, tablet, dan mobile
- [x] Seluruh form memiliki validasi yang lengkap (frontend & backend)
- [x] Authentication dan authorization aman (role-based)
- [x] CRUD berjalan untuk semua entitas utama
- [x] API terdokumentasi (Postman Collection / OpenAPI)
- [x] Kode mengikuti standar (PSR-12, SOLID, clean code)
- [x] Test coverage >= 80% untuk fitur utama
- [x] Mudah dikembangkan dan di-maintain

---

# 29. Open Questions

Pertanyaan yang masih perlu diputuskan sebelum development:

| # | Pertanyaan                                                    | Status      |
|---|---------------------------------------------------------------|-------------|
| 1 | Apakah pembayaran menggunakan QRIS / payment gateway eksternal? | Pending   |
| 2 | Apakah notifikasi real-time (WebSocket) masuk ke MVP?         | Pending     |
| 3 | Apakah perlu fitur multi bahasa (i18n)?                       | Pending     |
| 4 | Berapa jumlah meja / kode QR yang perlu di-generate?          | Pending     |
| 5 | Apakah struk dicetak fisik (thermal printer) atau digital?    | Pending     |
| 6 | Apakah dibutuhkan fitur manajemen stok di Phase 1?            | Pending     |
| 7 | Siapa yang mengelola server production (self-host / cloud)?   | Pending     |

---

# 30. Appendix

## Referensi & Dokumentasi

| Dokumen              | Keterangan                                       |
|----------------------|--------------------------------------------------|
| **Wireframe**        | Desain awal tampilan per halaman                 |
| **Flowchart**        | Alur proses bisnis (order, pembayaran, laporan)  |
| **ERD**              | Entity Relationship Diagram database             |
| **API Collection**   | Postman / OpenAPI collection endpoint            |
| **UI Design**        | Figma / desain Casir Design System               |
| **Assets**           | Logo, ikon, gambar yang digunakan                |

> Semua dokumen referensi di atas akan dilampirkan seiring progress development.
