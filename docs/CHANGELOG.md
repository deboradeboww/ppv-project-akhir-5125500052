# Changelog

Semua perubahan penting pada proyek akhir ini akan dicatat dalam dokumen ini.

Format didasarkan pada [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
dan proyek ini berpedoman pada [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v0.4.0] - 2026-11-11

### Ditambahkan
- Modul komponen reusable (`src/komponen.js`) untuk memisahkan logika perenderan elemen DOM secara modular.
- Implementasi proteksi keamanan XSS menggunakan `textContent` pada seluruh komponen antarmuka.

### Diubah
- Memperbarui modul `src/storage.js` dengan penggunaan kunci berversi (`proyek-tugas:v1`) dan proteksi blok `try/catch` untuk ketahanan data lokal dari kerusakan (*corrupted data*).

## [v0.3.0]
### Diperbarui
- Implementasi modul ES pada struktur proyek `src/`.

## [v0.2.0]
### Ditambahkan
- Integrasi pustaka UI dan perbaikan bug tampilan antarmuka.

## [v0.1.0]
### Ditambahkan
- Basis pengerjaan Tugas 4 dan penyusunan dokumen charter.