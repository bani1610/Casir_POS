# Casir POS — Task List (2 Developer Fullstack)

> Urutan pengerjaan dari Setup hingga Production.
> Tandai `[x]` setiap task yang sudah selesai.
>
> **Dev A** → Fitur: Auth, Dashboard, Manajemen Menu & Kategori, Laporan, Audit Log, Security & Deployment
> **Dev B** → Fitur: Database & Model, Manajemen Order, Manajemen Karyawan, Self-Order Pembeli, Testing

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

### 6.1 Backend
- [ ] Buat `OrderController` (index, show, store, update, destroy, updateStatus)
- [ ] Buat `OrderRequest` (validasi items + payment)
- [ ] Buat `OrderService` (hitung total, update status, simpan items)
- [ ] Buat `OrderRepository`
- [ ] Buat `OrderResource` + `OrderItemResource`
- [ ] Daftarkan route `/api/v1/orders` + `PATCH /orders/{id}/status`
- [ ] Logic self-order pembeli (device fingerprint, sesi 24 jam)

### 6.2 Frontend — Karyawan
- [ ] Buat `CreateOrderPage` (pilih menu, qty, catatan)
- [ ] Buat `OrderListPage` (filter status, tanggal)
- [ ] Buat `OrderDetailPage` (detail item + aksi update status)
- [ ] Komponen `OrderStatusBadge`
- [ ] Cetak struk (print CSS / window.print)

### 6.3 Frontend — Pembeli (Self-Order) `👤 Bani`
- [ ] Buat `MenuBrowserPage` (tampil semua menu by kategori)
- [ ] Buat `CartPage` (keranjang, hapus item, ubah qty)
- [ ] Buat `CheckoutPage` (pilih metode pembayaran, konfirmasi)
- [ ] Buat `OrderStatusPage` (status order real-time)
- [ ] Simpan sesi pembeli di localStorage (expire 24 jam)

---

## PHASE 7 — MANAJEMEN KARYAWAN `👤 Bani`

- [ ] Buat `UserController` (index, store, update, destroy, toggleActive)
- [ ] Buat `UserRequest` (validasi + assign role)
- [ ] Buat `UserService` + `UserRepository`
- [ ] Buat `UserResource`
- [ ] Daftarkan route `/api/v1/users`
- [ ] Buat `KaryawanPage` (tabel karyawan + modal tambah/edit/nonaktifkan)
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

## PHASE 9 — AUDIT LOG `👤 Bani`

- [ ] Buat `AuditLogObserver` untuk model User, Menu, Order
- [ ] Register observer di `AppServiceProvider`
- [ ] Catat event: login, logout, created, updated, deleted
- [ ] Buat `AuditLogController` (index, filter)
- [ ] Buat `AuditLogPage` di panel admin

---

## PHASE 10 — SECURITY & HARDENING `👤 Bani`

- [ ] Rate limiting login (max 5x / menit) di `RouteServiceProvider`
- [ ] Policy: `MenuPolicy`, `OrderPolicy`, `UserPolicy`
- [ ] Pastikan semua endpoint diproteksi role yang tepat
- [ ] Sanitasi input (strip_tags di service layer)
- [ ] Validasi CORS hanya dari domain frontend
- [ ] Aktifkan HTTPS di production (Let's Encrypt)
- [ ] Set `APP_DEBUG=false` dan `APP_ENV=production`

---

## PHASE 11 — TESTING

### 11.1 Backend — PHPUnit `👤 Bani`
- [ ] Feature test: AuthController (login, logout, me)
- [ ] Feature test: MenuController (CRUD)
- [ ] Feature test: ReportController (daily, export)
- [ ] Unit test: OrderService (hitung total, validasi status)
- [ ] Jalankan `php artisan test` — pastikan semua green

### 11.2 Backend — PHPUnit `👤 Umar`
- [ ] Feature test: OrderController (create, update status)
- [ ] Feature test: UserController (CRUD, toggleActive)
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

### 12.1 Server Setup `👤 Bani`
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

| Fitur | Dev A | Dev B |
|---|---|---|
| Setup & Fondasi | ✅ Bersama | ✅ Bersama |
| Database & Model | — | ✅ |
| Authentication | ✅ | — |
| Layout & Dashboard | ✅ | — |
| Manajemen Menu & Kategori | ✅ | — |
| Manajemen Order | — | ✅ |
| Self-Order Pembeli | — | ✅ |
| Manajemen Karyawan | — | ✅ |
| Laporan & Export | ✅ | — |
| Audit Log | ✅ | — |
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
| Phase 1 — Setup | 🔄 In Progress | Bersama | Laravel ok, React belum |
| Phase 2 — Database | ✅ Done | Bani | Migration + Seeder + Model & Relasi selesai |
| Phase 3 — Auth | ⬜ Belum | Dev A | |
| Phase 4 — Dashboard | ⬜ Belum | Dev A | |
| Phase 5 — Menu & Kategori | ⬜ Belum | Dev A | |
| Phase 6 — Order | ⬜ Belum | Dev B | |
| Phase 7 — Karyawan | ⬜ Belum | Dev B | |
| Phase 8 — Laporan | ⬜ Belum | Dev A | |
| Phase 9 — Audit Log | ⬜ Belum | Dev A | |
| Phase 10 — Security | ⬜ Belum | Dev A | |
| Phase 11 — Testing | ⬜ Belum | Bersama | |
| Phase 12 — Production | ⬜ Belum | Bersama | |