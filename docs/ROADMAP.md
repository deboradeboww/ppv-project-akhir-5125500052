# ROADMAP PROYEK P09–P14

Dokumen ini memetakan rencana pengembangan mingguan aplikasi manajemen tugas dari P09 hingga P14 selaras dengan fitur MVP yang didefinisikan pada Project Charter. Catatan: Dokumen ini diperbarui setiap minggu.

---

## 📅 Mingguan (Sprint Roadmap)

### **P09: Integrasi Pustaka & Pembungkus [SELESAI]**
- **Fitur MVP yang Dikerjakan**: Memasukkan pustaka pendukung atau pembungkus (*wrapper*) eksternal ke dalam arsitektur aplikasi awal.
- **Deliverable**:
  * Integrasi pustaka pendukung/pembungkus ke dalam struktur proyek.
- **Bukti**:
  * Berkas pustaka/pembungkus yang terhubung dengan baik pada kode sumber aplikasi.

---

### **P10: Debugging & Git Branching [SELESAI]**
- **Fitur MVP yang Dikerjakan**: Pembenahan fungsionalitas utama (perbaikan bug responsivitas modal dan penanganan pemicu ganda audio pada form/operasi CRUD).
- **Deliverable**:
  * Perbaikan minimal 2 bug nyata pada aplikasi.
  * Penerapan strategi pembancangan (*branching*) dan *merge* Git yang rapi.
- **Bukti**:
  * Riwayat commit / pull request branch *feature* ke *main*.
  * Log perbaikan bug pada dokumentasi/commit history.

---

### **P11: Modularisasi Kode JavaScript [SELESAI]**
- **Fitur MVP yang Dikerjakan**: Refaktorisasi struktur logika aplikasi agar lebih terstruktur dan mudah dipelihara.
- **Deliverable**:
  * Pemecahan file JS utama menjadi minimal 3 Modul ES6 (`main.js`, `ui.js`, `storage.js`/`state.js`, dll.).
- **Bukti**:
  * Struktur repositori dengan sintaks `import`/`export` ES Modules serta berkas `MODULE_MAP.md`.

---

## [v0.4.0] - 2026-11-15

P12: Komponen Reusable, Penyimpanan Aman, dan Rilis Versioning

### Ditambahkan
- Modul komponen reusable `src/komponen.js` berisi `KartuTugas(task)` dan `PesanKosong(pesan, { gambar, alt })`. `KartuTugas` dipakai untuk setiap item daftar tugas, `PesanKosong` dipakai di daftar tugas, catatan cepat, dan jadwal kuliah.
- Penyimpanan data tugas ke `localStorage` dengan kunci berversi `proyek-tugas:v1`; sebelumnya hanya pengaturan yang tersimpan.
- Cadangan di memori di `src/storage.js` dan fungsi `penyimpananTersedia()`, sehingga aplikasi tetap berjalan saat `localStorage` diblokir atau penuh.
- Toast peringatan bila penyimpanan peramban tidak tersedia (data tidak tersimpan setelah halaman ditutup).
- Ekspor `bacaPengaturanMentah` dan `simpanPengaturanMentah` di `src/storage.js` untuk dipakai `state.js`.
- `README.md` lengkap dan penandaan Sprint 4 di `ROADMAP.md`.

### Diubah
- `KartuTugas` dibangun dengan `createElement` dan `textContent` tanpa `innerHTML`, sehingga teks pengguna dan `id` tidak diperlakukan sebagai kode HTML.
- `src/state.js` merapikan data saat dimuat: tipe tiap field dipastikan benar, `id` dipastikan unik, dan pengaturan tidak valid kembali ke nilai bawaan.
- `renderTugas()` di `src/ui.js` memakai komponen `KartuTugas`, sehingga markup kartu tidak lagi ditulis ulang di `ui.js`.

### Diperbaiki
- Aplikasi tidak lagi mati saat isi `proyek-tugas:v1` rusak. `muatTugasLokal()` tidak pernah melempar galat dan menyaring item yang bukan objek atau tanpa judul teks (diuji lewat DevTools: JSON rusak dan item rusak).

**Riwayat lengkap:** lihat [CHANGELOG.md](./docs/CHANGELOG.md)

---

### **P13: Validasi Konsep Produk**
- **Fitur MVP yang Dikerjakan**: Finalisasi seluruh alur pengguna (*user flow*) dan persiapan pengujian produk (Tugas 7).
- **Deliverable**:
  * Dokumen validasi konsep produk dan pengujian kelayakan alur aplikasi.
- **Bukti**:
  * Laporan/berkas pengujian konsep produk (Tugas 7).

---

### **P14: Demo Akhir Proyek**
- **Fitur MVP yang Dikerjakan**: Peluncuran aplikasi versi final secara penuh (MVP Lengkap).
- **Deliverable**:
  * Presentasi dan demonstrasi langsung fitur aplikasi.
  * Repositori proyek akhir yang bersih dan terdokumentasi secara utuh.
- **Bukti**:
  * Tautan repositori GitHub final (`ppv-project-akhir-5125500052`).
  * Sesi demonstrasi/presentasi di depan penguji.