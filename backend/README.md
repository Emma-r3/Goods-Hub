# GoodsHub Backend API

RESTful API untuk aplikasi Online Marketplace (Web & Mobile) menggunakan **Node.js, Express.js, MongoDB (Mongoose), dan JWT Authentication**.

---

## 🛠️ Tech Stack
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: MongoDB via Mongoose ODM
- **Authentication**: JSON Web Token (JWT) + bcryptjs
- **Validation**: express-validator
- **Logger**: morgan
- **CORS**: cors (mendukung Web React & Mobile React Native Expo)

---

## 🚀 Panduan Menjalankan Secara Lokal

### 1. Prasyarat
- Node.js (v18+)
- MongoDB berjalan di lokal (`mongodb://localhost:27017`) atau MongoDB Atlas URI

### 2. Instalasi
```bash
cd backend
npm install
```

### 3. Konfigurasi Environment Variable
Salin file `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```
Isi konfigurasi dalam file `.env`:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/goodshub
JWT_SECRET=goods_hub_secret_jwt_key_2026_secure
JWT_EXPIRES_IN=7d
CORS_ORIGIN=*
```

### 4. Mengisi Data Awal (Seeding Data)
Jalankan script seeder untuk otomatis mengisi database dengan 12 produk dan akun default:
```bash
npm run seed
```

**Akun Bawaan Seeder:**
- **Admin**: `admin@goodshub.com` / `admin123password`
- **User**: `user@goodshub.com` / `user123password`

### 5. Menjalankan Server
Mode pengembangan (dengan nodemon auto-reload):
```bash
npm run dev
```
Mode produksi:
```bash
npm start
```

Server akan aktif di: `http://localhost:5000`

---

## 📖 Dokumentasi Endpoint RESTful API

### 1. Health Check
| Method | Endpoint | Deskripsi | Akses |
|---|---|---|---|
| `GET` | `/` | Pesan selamat datang & info API | Public |
| `GET` | `/api/health` | Status server uptime | Public |

### 2. Autentikasi (`/api/auth`)
| Method | Endpoint | Deskripsi | Request Body / Header | Akses |
|---|---|---|---|---|
| `POST` | `/api/auth/register` | Daftar akun baru | `{ "name", "email", "password" }` | Public |
| `POST` | `/api/auth/login` | Login user & dapatkan token JWT | `{ "email", "password" }` | Public |
| `GET` | `/api/auth/me` | Profil user login | `Bearer <token>` | User/Admin |
| `PUT` | `/api/auth/profile` | Update nama/password sendiri | `Bearer <token>` | User/Admin |

### 3. Manajemen Produk (`/api/products`)
| Method | Endpoint | Deskripsi | Akses |
|---|---|---|---|
| `GET` | `/api/products` | Ambil semua produk (support `?category=...&search=...&sort=...`) | Public |
| `GET` | `/api/products/categories` | Ambil daftar kategori produk | Public |
| `GET` | `/api/products/:id` | Detail produk (berdasarkan customId e.g. `1` atau MongoDB `_id`) | Public |
| `POST` | `/api/products` | Tambah produk baru (validasi input) | Admin Only |
| `PUT` | `/api/products/:id` | Update produk | Admin Only |
| `DELETE` | `/api/products/:id` | Hapus produk | Admin Only |

### 4. Manajemen Pengguna (`/api/users`)
| Method | Endpoint | Deskripsi | Akses |
|---|---|---|---|
| `GET` | `/api/users` | Ambil daftar semua user | Admin Only |
| `GET` | `/api/users/:id` | Ambil detail user by ID | Admin Only |
| `PUT` | `/api/users/:id` | Update data & role user | Admin Only |
| `DELETE` | `/api/users/:id` | Hapus user | Admin Only |

### 5. Pemesanan / Order (`/api/orders`)
| Method | Endpoint | Deskripsi | Akses |
|---|---|---|---|
| `POST` | `/api/orders` | Buat order baru (Checkout) | Public / User |
| `GET` | `/api/orders/my-orders` | Riwayat belanja user | User |
| `GET` | `/api/orders/:id` | Detail order (by `_id` atau `orderNumber`) | Public / User |
| `GET` | `/api/orders` | Ambil semua order | Admin Only |
| `PUT` | `/api/orders/:id/status` | Update status order | Admin Only |

---

## ☁️ Panduan Deployment Cloud (Soal 5)

### Database: MongoDB Atlas (Free Tier M0)
1. Buka [mongodb.com/atlas](https://www.mongodb.com/atlas) dan buat cluster gratis.
2. Buat database user & password di menu **Database Access**.
3. Atur **Network Access** ke `0.0.0.0/0` (Allow access from anywhere).
4. Ambil connection string:
   `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/goodshub?retryWrites=true&w=majority`
5. Masukkan ke `MONGO_URI` di environment setting platform deploy.

### Web Service: Render.com
1. Buat **Web Service** baru di [render.com](https://render.com).
2. Hubungkan ke repositori GitHub project ini.
3. Konfigurasi:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Tambahkan Environment Variables di tab **Environment**:
   - `NODE_ENV`: `production`
   - `MONGO_URI`: *(URI MongoDB Atlas Anda)*
   - `JWT_SECRET`: *(string acak yang kuat)*
   - `PORT`: `5000`
5. Klik **Create Web Service**. URL publik Anda siap digunakan oleh tim Web & Mobile!

