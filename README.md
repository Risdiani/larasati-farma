# Sistem Pengadaan Larasati Farma

Project ini adalah aplikasi frontend untuk Sistem Pengadaan Larasati Farma.

Buka Agent AI : CTRL+L

## Tech Stack

Project ini dibangun menggunakan teknologi modern:

- **[Vue 3](https://vuejs.org/)**: Framework JavaScript untuk membangun antarmuka pengguna (User Interface).
- **[TypeScript](https://www.typescriptlang.org/)**: Superset dari JavaScript yang menambahkan static typing untuk meminimalisir error.
- **[Vite](https://vitejs.dev/)**: Build tool dan development server yang sangat cepat.

## Prasyarat (Prerequisites)

Sebelum menjalankan project ini, pastikan Anda telah menginstal:

- [Node.js](https://nodejs.org/) (disarankan versi LTS)
- npm (biasanya otomatis terinstal bersama Node.js)

## Cara Menjalankan Project (Local Development)

Ikuti langkah-langkah berikut untuk menjalankan aplikasi di komputer lokal Anda:

1. **Install Dependencies**
   Buka terminal (atau command prompt) di dalam folder project ini, kemudian jalankan perintah berikut untuk menginstal semua library yang dibutuhkan:

   ```bash
   npm install
   ```

2. **Jalankan Development Server**
   Setelah proses instalasi selesai, jalankan server pengembangan dengan perintah:

   ```bash
   npm run dev
   ```

3. **Akses Aplikasi**
   Setelah server berhasil berjalan, terminal akan menampilkan URL lokal (biasanya `http://localhost:5173/`). Buka URL tersebut di browser web Anda untuk melihat aplikasi.

## Build untuk Production

Jika Anda ingin mem-build aplikasi ini agar siap untuk di-deploy (production), jalankan perintah:

```bash
npm run build
```

File hasil build (HTML, CSS, JS yang sudah dioptimasi) akan dihasilkan dan diletakkan di dalam folder `dist/`.

Untuk melihat _preview_ dari hasil build di komputer lokal, Anda dapat menjalankan:

```bash
npm run preview
```
