# Sistem Reservasi Lapangan Padel & Membership

Dokumentasi ini dibuat untuk membantu anggota tim baru dalam melakukan konfigurasi awal (*onboarding*) proyek backend berbasis Node.js, Express.js, dan Knex.js secara cepat dan bebas dari hambatan (*error*).

## Teknologi Utama
* **Backend Framework:** Node.js & Express.js
* **Database Driver & Query Builder:** Knex.js (MySQL)
* **Payment Gateway:** Midtrans (Snap API Integration)

---

## Prasyarat Sistem (Prerequisites)
Sebelum melakukan instalasi, pastikan perangkat lokal kamu sudah terpasang perkakas berikut:
1. **Node.js** (Versi LTS minimal v18.x atau terbaru)
2. **MySQL Database Server** (Sangat direkomendasikan menggunakan XAMPP atau Laragon)
3. **Git Client**

---

## Langkah Instalasi & Konfigurasi Aplikasi

### 1. Kloning Repositori Proyek
Buka terminal (Git Bash sangat direkomendasikan untuk pengguna Windows) lalu jalankan perintah kloning:
git clone <url-repositori-github-kelompok-kamu>
cd <nama-folder-proyek-kamu>

### 2. Instalasi Dependensi Paket:
Instal seluruh library dan package pendukung dengan cara buka terminal lalu jalankan perintah:
npm install

### 3. Pengaturan Berkas Lingkungan (.env)
Buat sebuah file baru bernama .env tepat di folder utama (root) proyek kamu, lalu salin dan sesuaikan variabel di bawah ini:
PORT=3000
NODE_ENV=development

# Konfigurasi Koneksi Database MySQL LOCAL
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=db_booking_padel

# Kredensial Akses Midtrans Payment Gateway (Sandbox Mode)
MIDTRANS_SERVER_KEY=Masukan_Server_Key_Sandbox_Kamu_Disini
MIDTRANS_CLIENT_KEY=Masukan_Client_Key_Sandbox_Kamu_Disini
MIDTRANS_IS_PRODUCTION=false

### 4. Panduan Eksekusi & Migrasi Database
Proyek ini sepenuhnya menggunakan Knex.js Migration untuk merancang dan memperbarui struktur tabel database. DILARANG KERAS membuat, mengubah, atau menghapus tabel secara manual langsung melalui phpMyAdmin agar skema database antar-anggota tim tetap sinkron dan konsisten.

Alur Menjalankan Migrasi Awal:
1. Jalankan control panel XAMPP/Laragon kamu, lalu pastikan service MySQL dalam status Running / Start.
2. Buka phpMyAdmin (atau MySQL editor pilihanmu seperti DBeaver/Navicat), kemudian buat sebuah database baru yang masih kosong bernama: db_booking_padel.
3. Kembali ke terminal proyek, jalankan perintah eksekusi seluruh file migrasi (10 tabel utama):
   knex migrate:latest
   
Kumpulan Perintah Knex Mandatori:
#### Melihat Status Berkas Migrasi:
knex migrate:status
#### Membatalkan Migrasi Terakhir (Rollback 1 Batch):
knex migrate:rollback
#### Mereset Total Seluruh Struktur Tabel (Hapus Semua):
knex migrate:rollback --all

### 5. Denah Struktur Folder Proyek
## 🗂️ Denah Struktur Folder Proyek Backend
├── src/
│   ├── config/          # Pengaturan database dan inisialisasi Midtrans Client
│   ├── controllers/     # Logika bisnis utama (Pemesanan, Membership, User Auth, Webhook Callback)
│   ├── migrations/      # Berkas skema tabel database (Total 10 tabel terstruktur)
│   ├── models/          # Query builder Knex untuk komunikasi ke database
│   ├── routes/          # Manajemen jalur / Routing endpoint API Express
│   └── app.js           # Berkas utama aplikasi (Entry Point Server)
├── .env.example         # Template contoh berkas konfigurasi variabel lingkungan
├── knexfile.js          # Berkas konfigurasi relasi dan driver utama Knex.js
├── package.json         # Manifest proyek, daftar dependensi, dan skrip otomasi
└── README.md            # Dokumen panduan utama tim (Berkas ini)

### 6. Aturan Kontribusi Tim & Standar Git Workflow
Untuk menjaga kerapian riwayat kerja kelompok pada commit history Git, seluruh anggota tim wajib menggunakan standar aturan penulisan pesan komit Conventional Commits.
1. Gunakan format awalan (prefix) berikut sesuai tipe perubahan kodemu:
  -feat: Digunakan saat kamu menambahkan fitur, endpoint, atau tabel migrasi baru.
    -Contoh: feat: menambahkan tabel notifikasi dan kolom nomor_telepon pengguna
  -fix: Digunakan saat kamu memperbaiki error, crash, salah ketik, atau bug kodingan.
    -Contoh: fix: memperbaiki penamaan fungsi down dropTableIfExists pada tabel ulasan
  -refactor: Digunakan saat merapikan, merestrukturisasi, atau membersihkan kode tanpa mengubah performa/fitur.
    -Contoh: refactor: menyelaraskan tipe status_langganan agar sinkron dengan siklus midtrans
  -chore: Digunakan untuk pemeliharaan internal seperti instalasi paket baru atau mengubah seting proyek.
    -Contoh: chore: menginstal package dotenv dan midtrans-client
2. Rutinitas Mengirim Kode ke GitHub:
git add .
git commit -m "feat: deskripsi singkat perubahan kodemu"
git push origin <nama-branch-kerja-kamu>

### 7. Cara Menjalankan Server Local
Untuk menyalakan server Express.js dalam mode pengembangan dengan auto-restart (menggunakan Nodemon):
npm run dev
Setelah server menyala, kamu bisa mengakses endpoint API lokal melalui alamat: http://localhost:3000

---
