# Laporan Progress Implementasi RBAC (Role-Based Access Control)
## Laporan Lanjutan — Progress 2
### dengan Bun.js + TypeScript + EJS + TailwindCSS + MySQL2

---

**Nama Repository** : RBAC-Bun.js-TypeScript  
**Platform** : GitHub Codespaces  
**Tanggal Laporan** : 7 Mei 2026  
**Laporan Sebelumnya** : Progress 1 (75% Selesai)  
**Status Keseluruhan** : ✅ Selesai (100%)

---

## 1. Ringkasan Progress Sebelumnya

Pada laporan Progress 1, implementasi telah mencapai **75%** dengan kondisi:

- ✅ Struktur folder dan file source code selesai
- ✅ Konfigurasi TypeScript, environment, dan dependensi selesai
- ✅ Models, Controllers, Routers, dan Middleware RBAC selesai
- ✅ Layout EJS (main, header, sidebar, footer) selesai
- ⬜ Database MySQL belum disetup
- ⬜ Sistem autentikasi (login/session) belum ada
- ⬜ View EJS untuk users, roles, permissions belum dibuat
- ⬜ Output terkini: semua route mengembalikan `401 Unauthorized`

---

## 2. Tambahan Dependensi

Pada tahap ini ditambahkan dependensi berikut untuk mendukung fitur autentikasi:

| Package | Versi | Keterangan |
|---------|-------|------------|
| express-session | Latest | Manajemen session pengguna |
| bcryptjs | Latest | Hashing password |
| @types/express-session | Latest | Type definitions express-session |
| @types/bcryptjs | Latest | Type definitions bcryptjs |

Instalasi dilakukan dengan perintah:

```bash
bun add express-session bcryptjs
bun add -d @types/express-session @types/bcryptjs
```

---

## 3. Yang Dikerjakan pada Progress 2

### 3.1 Setup Database MySQL

MySQL Server 8.0.45 berhasil diinstall dan dijalankan di environment Codespaces. Berikut langkah yang dilakukan:

```bash
sudo apt update && sudo apt install -y mysql-server
sudo usermod -d /var/lib/mysql mysql
sudo service mysql start
```

#### Tabel yang Dibuat

| Tabel | Jumlah Record | Keterangan |
|-------|---------------|------------|
| `roles` | 3 | admin, editor, viewer |
| `permissions` | 9 | CRUD users, roles, permissions |
| `users` | 1 | User admin untuk demo |
| `role_permissions` | 16 | Relasi role dan permission |

#### Struktur Relasi Role-Permission

| Role | Permission yang Dimiliki |
|------|--------------------------|
| **Admin** | user:view, user:create, user:edit, user:delete, role:view, role:create, role:delete, permission:view, permission:assign (9 permissions) |
| **Editor** | user:view, user:create, role:view, permission:view (4 permissions) |
| **Viewer** | user:view, role:view, permission:view (3 permissions) |

#### User MySQL Khusus Aplikasi

Dibuat user MySQL terpisah agar aplikasi tidak menggunakan `root`:

```sql
CREATE USER 'rbac_user'@'localhost' IDENTIFIED BY 'rbac_password';
GRANT ALL PRIVILEGES ON rbac_db.* TO 'rbac_user'@'localhost';
FLUSH PRIVILEGES;
```

#### Konfigurasi `.env` Final

```env
DB_HOST=localhost
DB_USER=rbac_user
DB_PASSWORD=rbac_password
DB_NAME=rbac_db
PORT=3000
SESSION_SECRET=rahasia123
```

---

### 3.2 Sistem Autentikasi (Login/Session)

#### File Baru yang Dibuat

**`src/controllers/authController.ts`**

Menangani logika login dan logout:
- `showLogin` — render halaman login
- `login` — verifikasi username & password dengan bcrypt, simpan user ke session
- `logout` — destroy session dan redirect ke `/login`

**`src/routers/authRoutes.ts`**

Mendaftarkan route autentikasi:

| Method | Route | Handler | Keterangan |
|--------|-------|---------|------------|
| GET | `/login` | `showLogin` | Tampilkan form login |
| POST | `/login` | `login` | Proses login |
| GET | `/logout` | `logout` | Proses logout |

#### Update File yang Ada

**`src/middleware/rbacMiddleware.ts`** — diperbarui agar membaca user dari session:

```typescript
const user = (req.session as any)?.user;
if (!user) return res.redirect('/login');
```

Perubahan penting: sebelumnya mengembalikan `401 Unauthorized`, sekarang redirect ke `/login` jika belum terautentikasi.

**`src/index.ts`** — ditambahkan konfigurasi session:

```typescript
app.use(session({
  secret: process.env.SESSION_SECRET || 'rahasia123',
  resave: false,
  saveUninitialized: false,
}));
app.use('/', authRoutes);
```

---

### 3.3 View EJS yang Dibuat

#### `src/views/auth/login.ejs`
Halaman login dengan form username dan password. Menampilkan pesan error jika login gagal.

#### `src/views/users/list.ejs`
Menampilkan daftar users dari database beserta form tambah user (username, password, role) dan tombol hapus.

#### `src/views/roles/list.ejs`
Menampilkan daftar roles beserta timestamp pembuatan dan form tambah role baru.

#### `src/views/permissions/list.ejs`
Menampilkan daftar permissions beserta resource dan action, dilengkapi form assign permission ke role tertentu.

---

## 4. Struktur Folder Final

```
RBAC-Bun.js-TypeScript/
├── .env                              ✅
├── .gitignore                        ✅
├── package.json                      ✅
├── bun.lock                          ✅
├── tsconfig.json                     ✅
├── tailwind.config.js                ✅
├── README.md                         ✅
└── src/
    ├── index.ts                      ✅ (diupdate: session + authRoutes)
    ├── config/
    │   └── database.ts               ✅
    ├── controllers/
    │   ├── authController.ts         ✅ (baru)
    │   ├── userController.ts         ✅
    │   ├── roleController.ts         ✅
    │   └── permissionController.ts   ✅
    ├── models/
    │   ├── userModel.ts              ✅
    │   ├── roleModel.ts              ✅
    │   └── permissionModel.ts        ✅
    ├── routers/
    │   ├── authRoutes.ts             ✅ (baru)
    │   ├── userRoutes.ts             ✅
    │   ├── roleRoutes.ts             ✅
    │   └── permissionRoutes.ts       ✅
    ├── middleware/
    │   └── rbacMiddleware.ts         ✅ (diupdate: session-based)
    └── views/
        ├── auth/
        │   └── login.ejs             ✅ (baru)
        ├── layouts/
        │   ├── main.ejs              ✅
        │   ├── header.ejs            ✅
        │   ├── sidebar.ejs           ✅
        │   └── footer.ejs            ✅
        ├── users/
        │   └── list.ejs              ✅ (baru)
        ├── roles/
        │   └── list.ejs              ✅ (baru)
        └── permissions/
            └── list.ejs              ✅ (baru)
```

---

## 5. Output Terkini

### 5.1 Alur Aplikasi yang Berjalan

```
Buka aplikasi
     ↓
/login → Form login tampil
     ↓
Input: username=admin, password=password
     ↓
Session dibuat → req.session.user = { id: 1, role_id: 1 }
     ↓
Redirect → /users
     ↓
checkPermission('user:view') → Query DB → admin punya permission ✅
     ↓
Render halaman User Management
     ↓
Navigasi ke /roles → ✅ Tampil
Navigasi ke /permissions → ✅ Tampil
     ↓
/logout → Session destroyed → Redirect /login
```

### 5.2 Hasil Akses Semua Route

| Route | Status | Response | Keterangan |
|-------|--------|----------|------------|
| `/` | 404 | `Cannot GET /` | Normal, tidak ada root route |
| `/login` (GET) | 200 | Form login | ✅ Tampil |
| `/login` (POST) | 302 | Redirect `/users` | ✅ Login berhasil |
| `/users` | 200 | Halaman User Management | ✅ Tampil dengan data |
| `/roles` | 200 | Halaman Role Management | ✅ Tampil 3 roles |
| `/permissions` | 200 | Halaman Permission Management | ✅ Tampil 9 permissions |
| `/logout` | 302 | Redirect `/login` | ✅ Session terhapus |

### 5.3 Screenshot Fitur

| Halaman | Fitur yang Terverifikasi |
|---------|--------------------------|
| **Login** | Form username & password, judul "🔐 RBAC Login" |
| **User Management** | Tabel users, form tambah user dengan dropdown role |
| **Role Management** | Tabel roles (admin, editor, viewer) dengan timestamp |
| **Permission Management** | Tabel 9 permissions, form assign permission ke role |
| **Logout** | Redirect ke halaman login, session terhapus |

---

## 6. Perbandingan Progress 1 vs Progress 2

| Komponen | Progress 1 | Progress 2 |
|----------|------------|------------|
| Setup Project | ✅ | ✅ |
| Dependensi | ✅ | ✅ + session & bcrypt |
| Database MySQL | ⬜ | ✅ |
| Tabel & Seed Data | ⬜ | ✅ |
| Models | ✅ | ✅ |
| Controllers | ✅ | ✅ + authController |
| Routers | ✅ | ✅ + authRoutes |
| Middleware RBAC | ✅ (401) | ✅ (redirect login) |
| View Login | ⬜ | ✅ |
| View Users | ⬜ | ✅ |
| View Roles | ⬜ | ✅ |
| View Permissions | ⬜ | ✅ |
| Session/Auth | ⬜ | ✅ |
| Version Control | ✅ | ✅ |
| **Total Progress** | **75%** | **100%** |

---

## 7. Kendala yang Dihadapi & Solusi

| No | Kendala | Solusi |
|----|---------|--------|
| 1 | `node_modules` ikut ter-commit ke GitHub | Buat `.gitignore`, hapus cache dengan `git rm -r --cached node_modules`, force push |
| 2 | MySQL gagal start di Codespaces | `sudo usermod -d /var/lib/mysql mysql` lalu restart service |
| 3 | Error `Access denied for user 'root'@'localhost'` | Buat user MySQL khusus `rbac_user` dengan privileges terbatas |
| 4 | Error `Cannot GET /` di root URL | Normal — tidak ada route `/`, akses langsung ke `/login` |
| 5 | Error `Duplicate entry 'admin'` | Normal — user admin sudah ada di database, tidak perlu insert ulang |
| 6 | File hilang setelah `git reset --hard` | Buat script `fill-files.sh` untuk generate ulang semua file sekaligus |

---

## 8. Kesimpulan

Implementasi sistem RBAC dengan Bun.js + TypeScript telah berhasil diselesaikan **100%**. Seluruh fitur inti telah berjalan dengan baik, meliputi:

1. **Autentikasi** — Login dan logout dengan session berbasis `express-session` dan password hashing menggunakan `bcryptjs`
2. **Otorisasi** — Middleware RBAC yang memverifikasi permission pengguna berdasarkan role sebelum mengizinkan akses ke setiap route
3. **Manajemen Users** — CRUD users dengan assignment role
4. **Manajemen Roles** — CRUD roles
5. **Manajemen Permissions** — Tampilan permissions dan assign permission ke role
6. **Database** — MySQL dengan 4 tabel terstruktur dan relasi yang benar
7. **Tampilan** — Layout EJS dengan sidebar navigasi, header, dan footer

Sistem ini telah membuktikan konsep RBAC berjalan dengan benar dimana setiap pengguna hanya dapat mengakses halaman yang sesuai dengan permission yang dimiliki role-nya, dan akses akan ditolak atau diarahkan ke halaman login jika pengguna belum terautentikasi.

---

*Laporan Progress 2 — Implementasi selesai 100%*  
*Platform: GitHub Codespaces | Runtime: Bun.js 1.3.13 | Database: MySQL 8.0.45*
