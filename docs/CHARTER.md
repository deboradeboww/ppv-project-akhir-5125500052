# Project Charter: Sistem Manajemen Tugas Interaktif

## 1. Masalah yang Diselesaikan
Mahasiswa sering mengalami kesulitan dalam mengelola tumpukan tugas kuliah, catatan harian yang tercecer, dan jadwal kuliah yang padat, yang berisiko menyebabkan keterlambatan pengumpulan tugas akibat kurangnya pengorganisasian data yang andal dan dapat diakses secara luring (*offline*).

## 2. Pengguna Sasaran & Persona Singkat
*   **Siapa**: Mahasiswa aktif tingkat awal/menengah (contoh: mahasiswa D3 PENS).
*   **Keseharian**: Mengikuti perkuliahan padat setiap hari, mengerjakan berbagai tugas praktikum secara paralel, dan sering membutuhkan akses data cepat tanpa koneksi internet yang stabil.
*   **Masalah**: Sering lupa tenggat waktu tugas, kesulitan memantau progres pengerjaan harian, serta kerepotan mencatat hal penting secara cepat di tengah kesibukan kuliah.

## 3. Fitur MVP (Prioritas MoSCoW)
*   **Must Have**:
    1. Formulir penambahan tugas dengan validasi input dan dukungan tombol *Enter*.
    2. Daftar tugas (*Task List*) dengan *progress bar* otomatis dan sistem filter kategori.
*   **Should Have**:
    3. Modul catatan cepat (*Sticky Notes*) dengan pilihan warna dan fitur *pin*.
    4. Tabel jadwal kuliah harian yang terstruktur.
*   **Could Have**:
    5. Integrasi efek suara interaktif dan aset gambar ilustrasi lokal (*offline-capable*).
*   **Won't Have (Sengaja Tidak Dibuat)**:
    *   Fitur sinkronisasi akun multi-pengguna berbasis *cloud database* online pada tahap MVP ini.

## 4. Kriteria Sukses Terukur
*   Pengguna baru dapat menyelesaikan alur utama (menambah tugas, melihat progres bar, dan membuat catatan) dalam waktu $\le 2$ menit tanpa bantuan panduan eksternal.
*   Aplikasi dapat berjalan 100% secara luring (*offline*) dengan seluruh aset lokal termuat sempurna tanpa error di tab DevTools.

## 5. Risiko & Antisipasi
1. **Risiko**: Berkas aset lokal (`assets/`) gagal dimuat karena kesalahan struktur folder atau penamaan jalur (*path*).
   * **Antisipasi**: Menerapkan struktur folder yang konsisten dan melakukan pengujian *offline* secara berkala.
2. **Risiko**: Data tugas atau catatan hilang saat halaman browser disegarkan (*refresh*) karena belum memakai penyimpanan permanen.
   * **Antisipasi**: Menjelaskan batasan sistem pada dokumentasi dan memasukkan rencana *LocalStorage* ke dalam `ROADMAP.md` (Sprint 7).
3. **Risiko**: Tampilan tata letak rusak saat diuji pada layar ponsel berukuran kecil ($\pm 400$ px).
   * **Antisipasi**: Menggunakan desain responsif berbasis CSS fleksibel serta navigasi bawah melayang (*bottom navigation*).