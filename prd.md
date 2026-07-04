# Product Requirements Document (PRD)

Version: 1.0
Status: Draft
Author: Product Manager
Last Updated: YYYY-MM-DD

---

# 1. Product Overview

## Product Name
Casir POS

## Product Vision

Membangun sebuah sistem point of sales berbasis web yang mudah digunakan dan cepat digunakan untuk UMKM, dengan design yang modern dan responsif di berbagai perangkat


---

# 2. Background

---
aplikasi ini dibuat dikarenakan sistem penjualan yang masih manual yang dimana ini sering terjadi human error dan rekap harian atau bulanan sering bocor atau tidak terkendali maka dari itu tim membuat aplikasi ini casir pos yang memiliki 3 pov 
pertama : owner
kedua : karyawan
ketiga : pembeli

designnya menggunakan design system yang sudah dibuat yaitu casir design system yang dibuat menggunakan tailwind css 

fitur yang di berikan kurang lebih
- dashboard admin
- dashboard karyawan
- dashboard pembeli
- daftar karyawan yang bisa di tambahkan atau di hapus atau di edit
- daftar menu yang bisa di tambahkan atau di hapus atau di edit
- daftar order yang bisa di tambahkan atau di hapus atau di edit
- daftar order yang bisa di tambahkan atau di hapus atau di edit
- grafik 
- export laporan bulanan  ke exel

---

# 3. Goals

## Business Goals

- meningkatkan efisiensi
- mengurangi human error
- digitalisasi proses
- laporan lebih akurat 
- rekapan bisa diambil kapan saja 

## User Goals

- mudah digunakan
- responsive
- cepat
- realtime
- 

---

# 4. Success Metrics

Misalnya:

- User dapat login < 1 detik
- Dashboard load < 2 detik
- Error rate <1%
- Semua fitur utama berjalan tanpa bug

---

# 5. Target Users

## Primary User

contoh

Admin

Deskripsi:

- mengelola data
- membuat laporan
- monitoring
- membuat akun karyawan
- mengatur pengeluaran
- membuat daftar menu
- membuat daftar harga

## Secondary User

contoh

Karyawan/staff

Deskripsi
- menerima pesanan
- membuat order
- melihat data yang di butuhkan
- melihat total harga
- mencetak struk

---

## Tertiary User

Contoh

Pembeli

Deskripsi

- bisa order menu
- bisa melihat riwayat order
- bisa menghapus orderan sebelum di pesan
- memilih pembayaran
- tidak perlu login tapi dibatasi 1 divice 1 user selama 24 jam di refresh
- 

# 6. User Roles

## Super Admin

Hak akses:

- CRUD seluruh data
- mengelola user
- melihat laporan
- konfigurasi sistem
---

## karyawan

Hak akses:

- membuat order
- mengelola order
- melihat laporan
- 
---

## Pembeli

Hak akses

- melihat daftar menu
- melakukan order
- melihat riwayat order
- menghapus orderan sebelum di pesan
- memilih pembayaran
- tidak perlu login tapi dibatasi 1 divice 1 user selama 24 jam di refresh

---

# 7. admin jurney

Contoh

admin

↓

Login

↓

Dashboard admin

↓

Melihat aktifitas

↓

Melakukan Aktivitas

↓

Logout

---

# 8. Core Features

## Authentication

### Login

Deskripsi

User dapat login menggunakan email dan password.

Acceptance Criteria

- validasi email
- validasi password
- remember me
- logout

---

### Register

Jika diperlukan

Acceptance Criteria

- validasi email
- password minimal 8 karakter
- konfirmasi password

---

### Forgot Password

Acceptance Criteria

- kirim email reset
- token berlaku 15 menit

---

## Dashboard

Menampilkan

- Total data
- Statistik
- Grafik
- Aktivitas terbaru

---

## User Management

Fitur

- Tambah user
- Edit user
- Hapus user
- Nonaktifkan user
- Reset password

---

## Profile

User dapat

- mengubah nama
- foto
- password

---

## Notification

Jika diperlukan

Jenis

- Email
- In App

---

## Search

Global Search

Support

- keyword
- filter
- sorting

---

## Export

Support

- PDF
- Excel
- CSV

---

## Audit Log

Mencatat

- login
- edit
- delete
- create

---

# 9. Functional Requirements

FR-001

User dapat login.

---

FR-002

User dapat logout.

---

FR-003

Admin dapat CRUD data.

---

FR-004

User hanya dapat melihat datanya sendiri.

---

FR-005

Dashboard menampilkan statistik realtime.

---

dst...

---

# 10. Non Functional Requirements

Performance

- Response < 2 detik

Security

- CSRF
- XSS Protection
- SQL Injection Protection
- Rate Limiter

Availability

99%

Responsive

Desktop

Tablet

Mobile

Browser

Chrome

Firefox

Edge

Safari

---

# 11. UI/UX Guidelines

Style

Modern Minimalist

Color

Primary

Secondary

Success

Danger

Warning

Typography

Inter

Spacing

8px Grid System

Border Radius

12px

Shadow

Soft

Animation

200ms

---

# 12. Navigation

Dashboard

├── Home

├── User

├── Data

├── Report

├── Settings

└── Profile

---

# 13. Database Design

## Users

id

name

email

password

role

created_at

updated_at

---

Contoh Entity

Users

↓

Posts

↓

Comments

↓

Categories

↓

Tags

---

# 14. API Design

Authentication

POST

/api/login

POST

/api/logout

GET

/api/me

---

Users

GET

/api/users

POST

/api/users

PUT

/api/users/{id}

DELETE

/api/users/{id}

---

Gunakan REST API.

---

# 15. Validation Rules

Email

Required

Unique

Password

Min 8 karakter

Phone

Numeric

Max 15 digit

---

# 16. Error Handling

404

Data tidak ditemukan

403

Forbidden

422

Validation Error

500

Internal Server Error

---

# 17. Tech Stack

Backend

Laravel 12

PHP 8.3+

Frontend

React

Vite

Database

MySQL

Authentication

Laravel Sanctum

API

REST API

Styling

Tailwind CSS

Icons

Lucide React

Charts

Chart.js / Recharts

State Management

Zustand

Form

React Hook Form

Validation

Zod

HTTP Client

Axios

Notification

Sonner

Date

Day.js

---

# 18. Laravel Architecture

Controllers

Services

Repositories

Form Requests

Policies

Resources

Events

Listeners

Jobs

Middleware

Observer

DTO (optional)

---

Folder Standard

app/

Controllers/

Services/

Repositories/

Models/

Policies/

Observers/

Jobs/

Events/

Listeners/

Http/

Requests/

Resources/

Middleware/

---

# 19. React Architecture

src/

components/

pages/

layouts/

hooks/

services/

stores/

types/

routes/

utils/

assets/

contexts/

providers/

---

Component Rules

Reusable

Atomic

No duplicated code

Reusable Form Component

Reusable Modal

Reusable Table

Reusable Card

Reusable Button

---

# 20. Coding Standards

Laravel

PSR-12

SOLID

Repository Pattern

Service Pattern

Resource Response

Validation menggunakan Form Request

Tidak boleh business logic di Controller

---

React

Functional Component

Hooks Only

No Class Component

Reusable Component

TypeScript Recommended

---

# 21. Security

Authentication

Authorization

Role Permission

Input Validation

Rate Limiting

Sanitization

Hash Password

HTTPS

CORS

CSRF

XSS Protection

SQL Injection Protection

---

# 22. Logging

Login

Logout

CRUD

Exception

API Request

---

# 23. Testing

Backend

PHPUnit

Feature Test

Unit Test

Frontend

Vitest

React Testing Library

---

# 24. Deployment

Production

Ubuntu Server

Nginx

PHP-FPM

MySQL

Redis

Queue Worker

Supervisor

SSL

CI/CD

GitHub Actions

---

# 25. Future Roadmap

Phase 1

MVP

Phase 2

Notification

Phase 3

Realtime

Phase 4

Mobile App

Phase 5

AI Integration

---

# 26. Constraints

- Laravel 12
- React
- MySQL
- REST API
- Responsive
- Clean Architecture
- SOLID
- Repository Pattern
- Service Pattern
- Reusable Components
- Dark Mode Ready
- Localization Ready
- Production Ready

---

# 27. Out of Scope

Tidak termasuk:

- Mobile Native
- Desktop App
- Multi Tenant
- Offline Mode

---

# 28. Acceptance Criteria

Aplikasi dianggap selesai apabila:

✅ Seluruh fitur berjalan

✅ Tidak ada error critical

✅ Responsive

✅ Validasi lengkap

✅ Authentication aman

✅ CRUD berjalan

✅ API terdokumentasi

✅ Clean Code

✅ Mudah dikembangkan

---

# 29. Open Questions

Tuliskan pertanyaan yang masih perlu diputuskan.

Contoh

- Apakah menggunakan OAuth?
- Apakah perlu realtime?
- Apakah perlu multi bahasa?
- Apakah perlu multi tenant?

---

# 30. Appendix

Wireframe

Flowchart

ERD

API Collection

UI Design

Assets

Referensi
