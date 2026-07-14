# Casir POS — Task List (2 Developer Fullstack)

> Urutan pengerjaan dari Setup hingga Production.
> Tandai `[x]` setiap task yang sudah selesai.
>
> **Umar (Dev A)** → Fitur: Auth, Dashboard, Manajemen Menu & Kategori, Laporan, Audit Log, Security & Deployment
> **Bani (Dev B)** → Fitur: Database & Model, Manajemen Order, Manajemen Karyawan, Self-Order Pembeli
>
> ⚠️ **DEPENDENCY CRITICAL**: Bani TIDAK BISA kerjakan frontend sebelum Umar selesai Phase 3 (Auth) + Phase 4 (Layout) + Phase 5 (Menu API)

---

## PHASE 1 — SETUP & FONDASI

> ⚠️ Dikerjakan **bersama** satu kali di awal project.

### 1.1 Backend (Laravel) — Bersama
- [x] Init project Laravel 12
- [x] Konfigurasi `.env` (DB, APP_KEY, APP_URL)
- [x] Koneksi MySQL berhasil
- [x] Install Laravel Sanctum
- [x] Konfigurasi CORS (`config/cors.php`) untuk React frontend
- [x] Buat struktur folder `app/Services/`, `app/Repositories/`, `app/DTO/`
- [x] Binding interface di `AppServiceProvider` (Repository Pattern)
- [x] Buat file `routes/api.php` dengan prefix `/api/v1`
- [x] Register `api.php` di `bootstrap/app.php`
- [x] Update `routes/web.php` sebagai SPA catch-all route
- [x] Buat `resources/views/app.blade.php` sebagai SPA shell

### 1.2 Frontend (React + Vite) — Bersama
- [x] Install React + React DOM
- [x] Install dependencies: `axios`, `react-router-dom`, `zustand`, `react-hook-form`, `@hookform/resolvers`, `zod`, `sonner`, `dayjs`, `lucide-react`, `@vitejs/plugin-react`
- [x] Update `vite.config.js` untuk React + alias `@`
- [x] Setup folder struktur (`components/`, `pages/`, `layouts/`, `hooks/`, `services/`, `stores/`, `lib/`, `routes/`, `styles/`)
- [x] Buat `resources/js/main.jsx` sebagai entry point
- [x] Buat `resources/js/styles/index.css` (CSS variables design system)
- [x] Buat `resources/js/lib/axios.js` (Axios instance + interceptors)
- [x] Buat `resources/js/stores/authStore.js` (Zustand + persist)
- [x] Buat `resources/js/services/authService.js`
- [x] Buat `resources/js/routes/index.jsx` (React Router config)
- [x] Buat `resources/js/components/shared/ProtectedRoute.jsx`
- [x] Buat semua Layout: `AdminLayout`, `KaryawanLayout`, `GuestLayout`
- [x] Buat `LoginPage` (React Hook Form + Zod, redirect by role)
- [x] Buat placeholder semua pages (admin, karyawan, pembeli)
- [x] Buat `NotFoundPage` dan `UnauthorizedPage`

---

## PHASE 2 — DATABASE `👤 Bani`

### 2.1 Migration
- [x] Migration `users` (+ `role`, `is_active`)
- [x] Migration `categories`
- [x] Migration `menus` (+ softDeletes)
- [x] Migration `payment_methods`
- [x] Migration `orders`
- [x] Migration `order_items`
- [x] Migration `audit_logs`
- [x] Jalankan `php artisan migrate`

### 2.2 Seeder & Factory
- [x] Buat `PaymentMethodSeeder` → insert data payment methods awal (Cash, QRIS, Transfer)
- [x] Buat `UserSeeder` → insert akun admin default + 3 karyawan dummy
- [x] Buat `CategorySeeder` → insert kategori awal (Makanan, Minuman, Snack, Dessert, Paket Hemat)
- [x] Buat `MenuSeeder` + `MenuFactory` → data dummy menu (30+ menu realistis)
- [x] Buat `DatabaseSeeder` → panggil semua seeder berurutan
- [x] Jalankan `php artisan db:seed`

### 2.3 Model & Relasi
- [x] Model `User` (fillable, hidden, casts, relasi `orders`, `auditLogs`)
- [x] Model `Category` (fillable, slug, is_active, relasi `menus`)
- [x] Model `Menu` (fillable, SoftDeletes, relasi `category`, `orderItems`)
- [x] Model `PaymentMethod` (fillable, relasi `orders`)
- [x] Model `Order` (fillable, casts status, relasi `user`, `paymentMethod`, `orderItems`)
- [x] Model `OrderItem` (fillable, relasi `order`, `menu`)
- [x] Model `AuditLog` (fillable, relasi `user`)

---

## PHASE 3 — AUTHENTICATION `👤 Umar`

### 3.1 Backend
- [ ] Buat `AuthController` (`login`, `logout`, `me`)
- [ ] Buat `LoginRequest` (validasi email + password)
- [ ] Buat `AuthService` (logic verifikasi, issue token Sanctum)
- [ ] Buat `UserResource` (format response user)
- [ ] Daftarkan route `POST /api/v1/auth/login`, `POST /api/v1/auth/logout`, `GET /api/v1/auth/me`
- [ ] Middleware `auth:sanctum` pada route terproteksi
- [ ] Middleware `role` custom untuk membatasi akses per role
- [ ] Test endpoint login & logout via Postman

### 3.2 Frontend
- [ ] Buat halaman `LoginPage`
- [ ] Buat `useAuthStore` (Zustand) — simpan token & data user
- [ ] Buat `authService.js` — fungsi `login()`, `logout()`, `getMe()`
- [ ] Setup Axios interceptor (attach Bearer token otomatis)
- [ ] Redirect ke dashboard sesuai role setelah login
- [ ] Guard route (redirect ke login jika belum auth)
- [ ] Buat komponen `ProtectedRoute`

---

## PHASE 4 — LAYOUT & DASHBOARD `👤 Umar`

### 4.1 Layout
- [ ] Buat `AdminLayout` (sidebar + header + outlet)
- [ ] Buat `KaryawanLayout` (sidebar ringkas + header)
- [ ] Buat `GuestLayout` (untuk self-order pembeli)
- [ ] Buat komponen `Sidebar` (navigasi per role)
- [ ] Buat komponen `Header` (breadcrumb, user info, logout)
- [ ] Responsif: mobile drawer sidebar

### 4.2 Dashboard Admin
- [ ] Buat `DashboardController` dengan endpoint statistik
- [ ] Endpoint `GET /api/v1/dashboard` (total order, pendapatan hari ini, menu terlaris)
- [ ] Buat `DashboardPage` (Admin)
- [ ] Komponen `StatCard` (total pendapatan, total order, dll.)
- [ ] Komponen grafik penjualan (`Recharts` line/bar chart)
- [ ] Tabel order terbaru (5 terakhir)

### 4.3 Dashboard Karyawan
- [ ] Buat `DashboardPage` (Karyawan) — tampil order aktif
- [ ] Daftar order pending/processing
- [ ] Tombol cepat "Buat Order Baru"

---

## PHASE 5 — MANAJEMEN KATEGORI & MENU `👤 Umar`

### 5.1 Backend
- [ ] Buat `CategoryController` (index, store, update, destroy)
- [ ] Buat `CategoryRequest` (validasi)
- [ ] Buat `CategoryService` + `CategoryRepository`
- [ ] Buat `CategoryResource`
- [ ] Daftarkan route CRUD `/api/v1/categories`
- [ ] Buat `MenuController` (index, show, store, update, destroy)
- [ ] Buat `MenuRequest` (validasi + upload foto)
- [ ] Buat `MenuService` + `MenuRepository`
- [ ] Buat `MenuResource`
- [ ] Handle upload gambar ke `storage/app/public/menus`
- [ ] Daftarkan route CRUD `/api/v1/menus`

### 5.2 Frontend
- [ ] Buat `CategoryPage` (tabel + modal tambah/edit/hapus)
- [ ] Buat `MenuPage` (tabel + modal + preview foto)
- [ ] Komponen `MenuCard` untuk self-order pembeli
- [ ] Form validasi dengan React Hook Form + Zod
- [ ] Toast notifikasi (Sonner) untuk setiap aksi

---

## PHASE 6 — MANAJEMEN ORDER `👤 Bani`

<<<<<<< HEAD
### 6.1 Backend
- [x] Buat `OrderController` (index, show, store, update, destroy, updateStatus)
- [x] Buat `OrderRequest` (validasi items + payment)
- [x] Buat `OrderService` (hitung total, update status, simpan items)
- [x] Buat `OrderRepository`
- [x] Buat `OrderResource` + `OrderItemResource`
- [x] Daftarkan route `/api/v1/orders` + `PATCH /orders/{id}/status`
- [x] Logic self-order pembeli (device fingerprint, sesi 24 jam)
=======
> ✅ Backend bisa dikerjakan tanpa menunggu Umar.
> ❌ Frontend Karyawan & Self-Order butuh Phase 3 Auth, Phase 4 Layout, dan Phase 5 Menu API dari Umar.
>>>>>>> f8badd55e32a7be3bee105d2bc0ccede290c97fc

### 6.1 Backend `✅ Bisa dikerjakan sekarang`
- [x] Buat `OrderController` (index, show, store, update, destroy, updateStatus)
- [x] Buat `OrderRequest` (validasi items + payment)
- [x] Buat `OrderService` (hitung total, update status, simpan items)
- [x] Buat `OrderRepository`
- [x] Buat `OrderResource` + `OrderItemResource`
- [x] Daftarkan route `/api/v1/orders` + `PATCH /orders/{id}/status`
- [x] Logic self-order pembeli (device fingerprint, sesi 24 jam)

### 6.2 Frontend — Karyawan `⛔ Blocked by Umar Phase 3 + Phase 4 + Phase 5`
- [ ] Buat `CreateOrderPage` (pilih menu, qty, catatan)
- [ ] Buat `OrderListPage` (filter status, tanggal)
- [ ] Buat `OrderDetailPage` (detail item + aksi update status)
- [ ] Komponen `OrderStatusBadge`
- [ ] Cetak struk (print CSS / window.print)

### 6.3 Frontend — Pembeli (Self-Order) `👤 Bani` `⛔ Blocked by Umar Phase 5 Menu API`
- [ ] Buat `MenuBrowserPage` (tampil semua menu by kategori)
- [ ] Buat `CartPage` (keranjang, hapus item, ubah qty)
- [ ] Buat `CheckoutPage` (pilih metode pembayaran, konfirmasi)
- [ ] Buat `OrderStatusPage` (status order real-time)
- [ ] Simpan sesi pembeli di localStorage (expire 24 jam)

---

## PHASE 7 — MANAJEMEN KARYAWAN `👤 Bani`

> ✅ Backend bisa dikerjakan tanpa menunggu Umar.
> ❌ Frontend `KaryawanPage` butuh Phase 3 Auth dan Phase 4 AdminLayout dari Umar.

- [ ] Buat `UserController` (index, store, update, destroy, toggleActive)
- [ ] Buat `UserRequest` (validasi + assign role)
- [ ] Buat `UserService` + `UserRepository`
- [ ] Buat `UserResource`
- [ ] Daftarkan route `/api/v1/users`
- [ ] Buat `KaryawanPage` (tabel karyawan + modal tambah/edit/nonaktifkan) `⛔ Blocked by Umar Phase 3 + Phase 4`
- [ ] Reset password karyawan oleh admin

---

## PHASE 8 — LAPORAN & EXPORT `👤 Umar`

- [ ] Buat `ReportController` (daily, monthly, export)
- [ ] Buat `ReportService` (query agregasi penjualan)
- [ ] Endpoint `GET /api/v1/reports/daily`
- [ ] Endpoint `GET /api/v1/reports/monthly`
- [ ] Endpoint `GET /api/v1/reports/export` (PDF + Excel)
- [ ] Install `maatwebsite/excel` untuk export Excel
- [ ] Install `barryvdh/laravel-dompdf` untuk export PDF
- [ ] Buat `LaporanPage` (grafik + tabel + tombol export)
- [ ] Filter laporan: tanggal, kategori, karyawan
- [ ] Komponen grafik tren penjualan (Recharts)

---

## PHASE 9 — AUDIT LOG `👤 Umar`

> ✅ Backend bisa dikerjakan kapan saja.
> ❌ Frontend `AuditLogPage` butuh Phase 4 AdminLayout dari Umar.

- [ ] Buat `AuditLogObserver` untuk model User, Menu, Order
- [ ] Register observer di `AppServiceProvider`
- [ ] Catat event: login, logout, created, updated, deleted
- [ ] Buat `AuditLogController` (index, filter)
- [ ] Buat `AuditLogPage` di panel admin

---

## PHASE 10 — SECURITY & HARDENING `👤 Umar`

> ⛔ Dikerjakan setelah Phase 3–8 selesai karena bergantung pada semua controller, route, dan role access.

- [ ] Rate limiting login (max 5x / menit) di `RouteServiceProvider`
- [ ] Policy: `MenuPolicy`, `OrderPolicy`, `UserPolicy`
- [ ] Pastikan semua endpoint diproteksi role yang tepat
- [ ] Sanitasi input (strip_tags di service layer)
- [ ] Validasi CORS hanya dari domain frontend
- [ ] Aktifkan HTTPS di production (Let's Encrypt)
- [ ] Set `APP_DEBUG=false` dan `APP_ENV=production`

---

## PHASE 11 — TESTING

### 11.1 Backend — PHPUnit `👤 Umar`
- [ ] Feature test: AuthController (login, logout, me)
- [ ] Feature test: MenuController (CRUD)
- [ ] Feature test: ReportController (daily, export)
- [ ] Jalankan `php artisan test` — pastikan semua green

### 11.2 Backend — PHPUnit `👤 Bani`
- [ ] Feature test: OrderController (create, update status)
- [ ] Feature test: UserController (CRUD, toggleActive)
- [ ] Unit test: OrderService (hitung total, validasi status)
- [ ] Jalankan `php artisan test` — pastikan semua green

### 11.3 Frontend — Vitest `👤 Umar`
- [ ] Component test: `LoginPage`
- [ ] Component test: `MenuCard`
- [ ] Hook test: `useAuthStore`
- [ ] Jalankan `npm run test`

### 11.4 Frontend — Vitest `👤 Bani`
- [ ] Component test: `CartPage`
- [ ] Component test: `OrderListPage`
- [ ] Jalankan `npm run test`

---

## PHASE 12 — DEPLOYMENT (PRODUCTION)

### 12.1 Server Setup `👤 Umar`
- [ ] Provisioning Ubuntu Server LTS
- [ ] Install Nginx, PHP 8.3-FPM, MySQL 8, Redis, Supervisor
- [ ] Setup user non-root untuk deploy
- [ ] Konfigurasi Nginx virtual host

### 12.2 CI/CD (GitHub Actions) `👤 Bani`
- [ ] Buat workflow `.github/workflows/deploy.yml`
- [ ] Step: Install dependencies, run PHPUnit, run Vitest
- [ ] Step: Build frontend (`npm run build`)
- [ ] Step: Deploy ke server via SSH
- [ ] Step: `php artisan migrate --force` + restart queue worker

### 12.3 Go Live Checklist — Bersama
- [ ] SSL/HTTPS aktif (Let's Encrypt / Certbot)
- [ ] `APP_ENV=production`, `APP_DEBUG=false`
- [ ] `php artisan storage:link`
- [ ] `php artisan config:cache` + `php artisan route:cache`
- [ ] Supervisor queue worker berjalan
- [ ] Redis terkoneksi
- [ ] Cek semua endpoint API via Postman
- [ ] Acceptance criteria di PRD Section 28 terpenuhi ✅

---

## Ringkasan Pembagian Tugas

| Fitur | Umar | Bani |
|---|---|---|
| Setup & Fondasi | ✅ Bersama | ✅ Bersama |
| Database & Model | — | ✅ |
| Authentication | ✅ | — |
| Layout & Dashboard | ✅ | — |
| Manajemen Menu & Kategori | ✅ | — |
| Manajemen Order (Backend) | — | ✅ Backend |
| Manajemen Order (Frontend) | — | ✅ Frontend (setelah Umar Phase 3,4,5) |
| Self-Order Pembeli | — | ✅ (setelah Umar Phase 5) |
| Manajemen Karyawan (Backend) | — | ✅ Backend |
| Manajemen Karyawan (Frontend) | — | ✅ Frontend (setelah Umar Phase 3,4) |
| Laporan & Export | ✅ | — |
| Audit Log (Backend) | ✅ Backend | — |
| Audit Log (Frontend) | ✅ Frontend | — |
| Security & Hardening | ✅ | — |
| Testing (Auth, Menu, Laporan) | ✅ | — |
| Testing (Order, Karyawan) | — | ✅ |
| Server Setup | ✅ | — |
| CI/CD GitHub Actions | — | ✅ |
| Go Live Checklist | ✅ Bersama | ✅ Bersama |

---

## Catatan Progress

| Phase | Status | Dev | Keterangan |
|---|---|---|---|
| Phase 1 — Setup | ✅ Done | Bersama | Laravel + React setup selesai |
| Phase 2 — Database | ✅ Done | Bani | Migration + Seeder + Model & Relasi selesai |
<<<<<<< HEAD
| Phase 3 — Auth | ⬜ Belum | Dev A | |
| Phase 4 — Dashboard | ⬜ Belum | Dev A | |
| Phase 5 — Menu & Kategori | ⬜ Belum | Dev A | |
| Phase 6 — Order | 🔄 In Progress | Dev B | 6.1 Backend selesai |
| Phase 7 — Karyawan | ⬜ Belum | Dev B | |
| Phase 8 — Laporan | ⬜ Belum | Dev A | |
| Phase 9 — Audit Log | ⬜ Belum | Dev A | |
| Phase 10 — Security | ⬜ Belum | Dev A | |
| Phase 11 — Testing | ⬜ Belum | Bersama | |
| Phase 12 — Production | ⬜ Belum | Bersama | |
=======
| Phase 3 — Auth | ⬜ Belum | Umar | **BLOCKING**: Bani butuh ini untuk frontend |
| Phase 4 — Dashboard | ⬜ Belum | Umar | **BLOCKING**: Bani butuh Layout untuk frontend |
| Phase 5 — Menu & Kategori | ⬜ Belum | Umar | **BLOCKING**: Bani butuh Menu API untuk Self-Order |
| Phase 6 — Order (Backend) | ⬜ Belum | Bani | ✅ Bisa dikerjakan sekarang |
| Phase 6 — Order (Frontend) | ⬜ Belum | Bani | ⛔ Butuh Phase 3, 4, 5 dari Umar |
| Phase 7 — Karyawan (Backend) | ⬜ Belum | Bani | ✅ Bisa dikerjakan sekarang |
| Phase 7 — Karyawan (Frontend) | ⬜ Belum | Bani | ⛔ Butuh Phase 3, 4 dari Umar |
| Phase 8 — Laporan | ⬜ Belum | Umar | — |
| Phase 9 — Audit Log | ⬜ Belum | Umar | — |
| Phase 10 — Security | ⬜ Belum | Umar | Dikerjakan setelah Phase 3–8 |
| Phase 11 — Testing | ⬜ Belum | Bersama | — |
| Phase 12 — Production | ⬜ Belum | Bersama | — |

---

## 🚦 Apa yang Bisa Bani Kerjakan Sekarang?

### ✅ Yang BISA dikerjakan (tanpa tunggu Umar):

**Phase 6 — Order Management (Backend only)**
- `OrderController` (index, show, store, update, destroy, updateStatus)
- `OrderRequest` (validasi items + payment)
- `OrderService` (hitung total, update status, simpan items)
- `OrderRepository`
- `OrderResource` + `OrderItemResource`
- Route `/api/v1/orders`
- Logic self-order pembeli (device fingerprint, sesi 24 jam)

**Phase 7 — Karyawan Management (Backend only)**
- `UserController` (index, store, update, destroy, toggleActive)
- `UserRequest` (validasi + assign role)
- `UserService` + `UserRepository`
- `UserResource`
- Route `/api/v1/users`
- Logic reset password karyawan

### ⛔ Yang TIDAK BISA dikerjakan (harus tunggu Umar):

**Semua Frontend Order & Karyawan** karena butuh:
- Phase 3: Auth API (login, logout, me) + middleware auth:sanctum
- Phase 4: AdminLayout & KaryawanLayout + Sidebar + Header
- Phase 5: Menu API (untuk Self-Order MenuBrowserPage)

**Self-Order Pembeli (Frontend)** butuh:
- Phase 5: Menu API untuk tampilkan daftar menu

### 💡 Rekomendasi Strategi:

1. **Bani mulai Backend dulu**: Kerjakan OrderController, UserController, Service, Repository
2. **Umar prioritas Auth + Layout**: Phase 3 & 4 adalah BLOCKING untuk semua frontend Bani
3. **Setelah Umar selesai Phase 3–4**: Bani bisa lanjut semua frontend Order & Karyawan
4. **Setelah Umar selesai Phase 5**: Bani bisa lanjut Self-Order Pembeli
5. **Testing parallel**: Setelah backend/frontend masing-masing selesai, masing-masing test fiturnya sendiri
>>>>>>> f8badd55e32a7be3bee105d2bc0ccede290c97fc
