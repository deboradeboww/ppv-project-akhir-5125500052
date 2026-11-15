# Changelog

Semua perubahan penting pada proyek akhir ini akan dicatat dalam dokumen ini.

Format didasarkan pada [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
dan proyek ini berpedoman pada [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v0.4.0] - 2026-11-15

### Ditambahkan
- Modul komponen reusable `src/komponen.js` berisi `KartuTugas(task)` dan `PesanKosong(pesan, { gambar, alt })`. `KartuTugas` dipakai untuk setiap item daftar tugas, `PesanKosong` dipakai di daftar tugas, catatan cepat, dan jadwal kuliah.
- Penyimpanan data tugas ke `localStorage` dengan kunci berversi `proyek-tugas:v1`; sebelumnya hanya pengaturan yang tersimpan.
- Cadangan di memori di `src/storage.js` dan fungsi `penyimpananTersedia()`, sehingga aplikasi tetap berjalan saat `localStorage` diblokir atau penuh.
- Toast peringatan untuk pengguna bila penyimpanan peramban tidak tersedia (data tidak tersimpan setelah halaman ditutup).
- Ekspor `bacaPengaturanMentah` dan `simpanPengaturanMentah` di `src/storage.js` untuk dipakai `state.js`.
- `README.md` lengkap (cara menjalankan, fitur MVP dan statusnya, struktur modul, kontrak komponen dan penyimpanan, kredit aset dan pustaka) dan penandaan Sprint 4 di `ROADMAP.md`.

### Diubah
- `KartuTugas` dibangun dengan `createElement` dan `textContent` tanpa `innerHTML`, sehingga teks pengguna dan `id` tidak diperlakukan sebagai kode HTML.
- `src/state.js` merapikan data saat dimuat: tipe tiap field dipastikan benar, `id` dipastikan unik, dan pengaturan yang tidak valid kembali ke nilai bawaan.
- `renderTugas()` di `src/ui.js` memakai komponen `KartuTugas`, sehingga markup kartu tidak lagi ditulis ulang di `ui.js`.

### Diperbaiki
- Aplikasi tidak lagi mati saat isi `proyek-tugas:v1` rusak. `muatTugasLokal()` tidak pernah melempar galat dan menyaring item yang bukan objek atau tanpa judul teks (skenario JSON rusak dan item rusak sudah diuji lewat DevTools).

## [v0.3.0]
### Diperbarui
- Implementasi modul ES pada struktur proyek `src/`.

## [v0.2.0]
### Ditambahkan
- Integrasi pustaka UI dan perbaikan bug tampilan antarmuka.

## [v0.1.0]
### Ditambahkan
- Basis pengerjaan Tugas 4 dan penyusunan dokumen charter.