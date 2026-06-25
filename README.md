# KitaLaundry 🧺

KitaLaundry adalah sistem manajemen operasional dan layanan binatu (laundry) yang dibangun menggunakan arsitektur modern (Next.js untuk Frontend dan Ruby on Rails 8 API untuk Backend).

## ✨ Fitur Utama & Tech Stack
- **Frontend**: Next.js 14, React, Tailwind CSS, TypeScript.
- **Backend**: Ruby on Rails 8 (API mode), PostgreSQL.
- **Autentikasi & Keamanan**: JWT (JSON Web Tokens), `bcrypt`, **Google reCAPTCHA v3**.
- **Login Sosial (OAuth)**: Mendukung *Login/Register* instan menggunakan **Google** dan **Facebook**.
- **Validasi Keamanan Ekstra**: Validasi *password* dinamis terintegrasi di *frontend* (Huruf besar, kecil, angka, simbol).
- **Auto-Logout Sesi**: Sistem mendeteksi inaktivitas pengguna (30 menit) di frontend dan otomatis mengakhiri sesi untuk mencegah penyalahgunaan.
- **Payment Gateway**: Integrasi **Xendit** (Pembuatan Invoice Otomatis & Webhook Callback).
- **Penyimpanan Berkas**: **Cloudinary** (via ActiveStorage) untuk Avatar, Struk Pembayaran, dan Bukti Kondisi Pakaian.
- **Notifikasi**: **Meta WhatsApp Cloud API** dengan kapabilitas *Production* (Nomor Terdaftar & System User Permanent Token).
- **Real-Time**: ActionCable (WebSockets) untuk pembaruan status pesanan secara langsung.
- **Port Khusus**: Frontend (`:3000`), Backend (`:8000`).
- **Autentikasi Nyata**: Sinkronisasi login ke DB PostgreSQL menggunakan token JWT asli, dilindungi enkripsi. Verifikasi email dikirim (simulasi) dengan **Letter Opener**.
- **Role-Based Routing**: *Branch Manager* memiliki dashboard khusus `/branch/dashboard` yang terpisah dari pelanggan.
- **Manajemen Pengguna (CRUD)**: Admin Pusat dapat memantau dan mengedit informasi semua pelanggan, staf, maupun manager cabang.
- **Manajemen Alamat**: Pelanggan dapat mengatur banyak alamat pengiriman secara dinamis yang terhubung ke DB.
- **Sistem Notifikasi Internal**: Lonceng notifikasi pelanggan tersambung riil ke PostgreSQL untuk rekam jejak status order.
- **Barcode Scanner Terintegrasi**: Tersedia API khusus bagi admin untuk mengubah status pesanan secara instan hanya dengan memindai kode *barcode*.
- **100% Database-Driven**: Aplikasi tidak lagi menggunakan *dummy/mock data* di *frontend*, melainkan menarik seluruh kalkulasi dan statistik (Dasbor) secara *real-time* dari *database*.
- **Pemesanan Hybrid & Multilayanan**: Mendukung pemilihan menu campuran (contoh: Kiloan digabung dengan Cuci Sepatu Premium) dalam satu kali keranjang *checkout*.
- **Peta Rute Riil (OpenStreetMap)**: Kalkulasi otomatis jarak antar (KM) dari lokasi *laundry* ke alamat pelanggan menggunakan API Geocoding (Nominatim) dan Routing (OSRM) yang 100% gratis.
- **Tampilan Invoice Transparan**: Detail invoice kini mencantumkan *Processing Branch* (cabang spesifik) tempat pakaian diproses.
- **Manajemen Pekerja Multidimensi**: Admin Pusat dan Cabang dapat mengelola staf spesifik (*Washer*, *Ironer*, *Driver*) secara komprehensif, dengan total integrasi staf simulasi hingga 50 pekerja otomatis melalui *seeding*.
- **Staff Assignment Hard Limit**: Sistem otomatis memblokir penugasan pesanan baru kepada staf yang sedang menangani maksimal 3 pesanan berstatus *Processing* untuk mencegah beban kerja berlebih (Overwork Protection).
- **Strict Multi-Stage Workflow**: Alur penugasan dibuat ketat. Pesanan harus ditandai sebagai *Arrived / Picked Up* di cabang terlebih dahulu sebelum Admin Cabang dapat melemparnya (Assign Staff) kepada staf mesin cuci. Mencegah error operasional barang belum datang tapi sudah diproses.
- **Smart Delivery Workflow**: Membedakan alur secara spesifik antara layanan antar-jemput (*Full Service*) dan antar-sendiri (*Self Drop*). Admin wajib "Assign Driver" khusus untuk order yang butuh penjemputan sebelum barang dinyatakan tiba di cabang.
- **Proteksi DDoS & Brute Force (Rate Limiting)**: Pengamanan API Login dan Registrasi menggunakan `rack-attack` untuk memblokir serangan spam.
- **Sistem Ulasan (Star Reviews)**: Pelanggan dapat memberikan *rating* bintang (1-5) beserta komentar setelah pesanan selesai (*Delivered*).
---

## 🚀 Panduan Instalasi & Menjalankan Aplikasi

### 1. Prasyarat
- **Node.js** (v18+)
- **Ruby** (v3.2+)
- **PostgreSQL** (Sedang berjalan di sistem Anda)
- Kredensial Pihak Ketiga (Xendit, Cloudinary, Meta Developer, reCAPTCHA v3)

### 2. Setup Backend (Rails API)
1. Buka terminal/WSL dan navigasikan ke folder backend:
   ```bash
   cd backend
   ```
2. Instal *gem* dan dependensi:
   ```bash
   bundle install
   ```
3. Konfigurasi Environment Variables:
   - Salin file `.env.example` menjadi `.env`.
   - Isikan *API Keys* untuk Xendit, Cloudinary, Meta WhatsApp, dan reCAPTCHA Secret Key di dalamnya.
4. Setup Database & Migrasi:
   ```bash
   rails db:create db:migrate db:seed
   ```
5. Jalankan Server Backend (berjalan di `http://localhost:3000`):
   ```bash
   rails s
   ```

### 3. Setup Frontend (Next.js)
1. Buka terminal baru dan navigasikan ke folder frontend:
   ```bash
   cd frontend
   ```
2. Instal dependensi NPM:
   ```bash
   npm install
   ```
3. Konfigurasi Environment Variables:
   - Salin `.env.local.example` (jika ada) atau buat file `.env.local`.
   - Isikan `NEXT_PUBLIC_API_URL=http://localhost:3000`
   - Isikan `NEXT_PUBLIC_RECAPTCHA_SITE_KEY=<kunci-site-anda>`
4. Jalankan Server Frontend (berjalan di `http://localhost:3001` atau *port* lainnya):
   ```bash
   npm run dev
   ```

---

## 🧪 Panduan Testing / Uji Coba

Setelah menjalankan proses `rails db:seed` pada backend, sistem telah menyediakan beberapa data awal dan akun *dummy* untuk keperluan *testing*:

### Kredensial Akun:
| Peran (Role) | Email | Password | Hak Akses Utama |
|---|---|---|---|
| **Center Admin** | `admin@kitalaundry.com` | `Password123!` | Manajemen semua cabang, laporan, layanan, admin sistem. |
| **Branch Manager** | `manager.petisah@kitalaundry.com`,<br>`manager.baru@kitalaundry.com`,<br>`manager.timur@kitalaundry.com`,<br>`manager.sunggal@kitalaundry.com`,<br>`manager.johor@kitalaundry.com` | `Password123!` | Manajemen operasional khusus untuk cabangnya sendiri (Medan). |
| **Customer** | `customer1@gmail.com` s/d `customer15@gmail.com` | `Password123!` | Pembuatan pesanan, manajemen alamat, riwayat transaksi diri sendiri. |

### Skenario Testing 1: Lewat Postman (Backend Saja)
1. Buka aplikasi **Postman**.
2. **Login & Dapatkan Token:**
   - Metode: `POST`
   - URL: `http://localhost:3000/auth/login`
   - Body (JSON): 
     ```json
     {
       "email": "customer1@gmail.com",
       "password": "Password123!"
       // "recaptcha_token": "abaikan saat ini di lingkungan development jika tidak diwajibkan"
     }
     ```
   - Salin nilai `token` dari hasil *response*.
3. **Melihat Cabang (Tidak perlu token):**
   - Metode: `GET`
   - URL: `http://localhost:3000/branches`
4. **Membuat Pesanan (Perlu token):**
   - Metode: `POST`
   - URL: `http://localhost:3000/orders`
   - Headers: Tambahkan `Authorization: Bearer <token_anda>`
   - Body (JSON):
     ```json
     {
       "order": {
         "branch_id": 1,
         "pickup_address_id": 1,
         "delivery_address_id": 1
       },
       "order_items": [
         { "service_id": 1, "weight_kg": 2 }
       ]
     }
     ```
   - *Catatan: Jika integrasi WhatsApp dihidupkan, sistem akan otomatis mengirim pesan WA ke nomor yang didaftarkan pada `.env` Meta API.*

### Skenario Testing 2: Pengujian Keamanan reCAPTCHA v3 (Anti-Bot)
Untuk memastikan sistem backend kebal dari serangan bot dan menolak permintaan login/register tanpa verifikasi Google reCAPTCHA:
1. Buka aplikasi **Postman**.
2. **Uji Coba Login Tanpa Token reCAPTCHA:**
   - Metode: `POST`
   - URL: `http://localhost:8000/auth/login` (sesuaikan port backend Anda, misalnya `:8000` atau `:3000`)
   - Headers: `Content-Type: application/json`
   - Body (JSON): 
     ```json
     {
       "email": "customer1@gmail.com",
       "password": "Password123!"
     }
     ```
   - Tekan **Send**.
   - **Hasil yang Diharapkan:** Anda akan mendapat balasan `422 Unprocessable Entity` atau `401 Unauthorized` dengan pesan:
     `{"success": false, "message": "Validasi reCAPTCHA gagal. Silakan coba lagi."}`
   - *Catatan: Ini membuktikan keamanan berfungsi. Login yang valid dari frontend (melalui browser nyata) akan secara otomatis menyertakan `"recaptcha_token"` pada body di latar belakang.*

### Skenario Testing 3: Lewat Frontend Vercel Menggunakan Cloudflare Tunnel (Tanpa Kartu Kredit)
Untuk menguji *frontend* Vercel langsung ke *backend* lokal Anda, kita akan menggunakan **Cloudflare Tunnel** (lebih disarankan daripada Ngrok karena tidak memiliki halaman peringatan blokir API).
1. Pastikan *backend* berjalan lokal: `rails s -p 8000`.
2. Di terminal baru, jalankan Cloudflare Tunnel:
   ```bash
   npx cloudflared tunnel --url http://localhost:8000
   ```
3. Salin URL publik yang dihasilkan (misal: `https://xxxx.trycloudflare.com`).
4. Buka **Dashboard Vercel** > Settings > Environment Variables.
5. Set `NEXT_PUBLIC_API_URL` ke URL Cloudflare yang baru Anda salin.
6. Lakukan **Redeploy** di Vercel.
7. Buka *website* Vercel Anda dan coba masuk dengan akun yang sudah ada.

2. Masuk ke halaman **Login**.
   - Sistem akan otomatis menghitung skor reCAPTCHA v3 di latar belakang untuk keamanan anti-bot.
   - **Cara Memastikan reCAPTCHA Berjalan:** Tekan **F12** (atau klik kanan > *Inspect*) untuk membuka **Developer Tools**, lalu pindah ke *tab* **Network**. Saat Anda menekan tombol "Masuk", klik *request* bernama `login` di daftar Network, lalu lihat bagian **Payload**. Jika terdapat bidang `recaptcha_token` berisi kode panjang, berarti fungsi *invisible* reCAPTCHA berhasil bekerja!
3. Masuk menggunakan akun **Customer** (`customer1@gmail.com`).
4. **Buat Pesanan Baru**: Cobalah antarmuka pemesanan. Saat Anda memilih opsi *checkout* atau *bayar*, backend akan memanggil layanan Xendit dan *Invoice* / Kode Pembayaran akan muncul!
5. Masuk menggunakan akun **Center Admin** (`admin@kitalaundry.com`) untuk melihat data analitik, tabel seluruh pesanan, atau merespons tiket keluhan.

---
### 🛠️ Tutorial Testing Fitur Keamanan (Rate Limiting)

Fitur **Rate Limiting (Rack Attack)** akan memblokir *request* yang berlebihan (serangan DDoS atau *brute force*) dari satu IP.
Untuk mengujinya, lakukan simulasi menggunakan aplikasi **Postman**, **cURL**, atau langsung melalui Browser:

**Cara Pengujian via cURL (Terminal):**
Buka terminal dan jalankan *script* berikut secara berturut-turut untuk melakukan *hit* beruntun ke *endpoint* Login:
```bash
for i in {1..10}; do curl -i -X POST -H "Content-Type: application/json" -d '{"email":"test@test.com", "password":"123"}' http://localhost:8000/api/v1/auth/login; done
```
*   **Hasil yang Diharapkan:** Pada 5 panggilan pertama (dalam rentang waktu 20 detik), *server* akan mengembalikan respons `401 Unauthorized` (karena *password* salah). Namun, pada panggilan ke-6 dan seterusnya, *server* akan mengembalikan respons HTTP `429 Too Many Requests` dengan pesan *"Too Many Requests. Please wait and try again later."* 

---
*Dokumentasi ini otomatis digenerate dan diperbarui pada rilis integrasi Fase 6 (Eksternal) beserta fitur Ulasan & Rate Limiting.*
