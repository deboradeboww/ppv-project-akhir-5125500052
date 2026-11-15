# Sistem Manajemen Tugas Interaktif

Mahasiswa sering kali kesulitan mengelola dan melacak tenggat waktu tugas kuliah, jadwal harian, serta catatan penting secara efisien dalam satu platform yang praktis dan terintegrasi. Aplikasi ini menyatukan daftar tugas, catatan cepat, dan jadwal kuliah dalam satu halaman web yang bisa dipakai secara luring.

**Versi saat ini:** v0.4.0 (lihat [CHANGELOG](./docs/CHANGELOG.md))

## 🚀 Cara Menjalankan

Aplikasi memakai ES Modules, jadi **harus dijalankan lewat server lokal**, bukan klik dua kali pada `index.html` (`file://`).

1. *Clone* repository ini: `git clone https://github.com/deboradeboww/ppv-project-akhir-5125500052.git`
2. Buka folder proyek di VS Code.
3. Jalankan salah satu server lokal berikut dari folder proyek:
   * Ekstensi **Live Server** di VS Code (klik kanan `index.html` › *Open with Live Server*), atau
   * `python -m http.server 5500` lalu buka `http://127.0.0.1:5500`, atau
   * `npx vite`

## ✨ Fitur MVP dan Statusnya

| No | Fitur | Prioritas | Status |
|---|---|---|---|
| 1 | Formulir tambah tugas dengan validasi input dan tombol *Enter* | Must | Selesai |
| 2 | Daftar tugas dengan *progress bar* otomatis dan filter kategori/prioritas | Must | Selesai |
| 3 | Catatan cepat (*sticky notes*) dengan pilihan warna dan *pin* | Should | Selesai |
| 4 | Jadwal kuliah harian (tambah/ubah/hapus, termasuk Sabtu dan Minggu) | Should | Selesai |
| 5 | Efek suara dan aset gambar lokal (*offline-capable*) | Could | Selesai |
| 6 | Profil pengguna, pengaturan suara, ukuran font, dan mode gelap | Tambahan | Selesai |
| 7 | Penyimpanan data tugas dan pengaturan ke `localStorage` yang tahan data rusak | Sprint 4 | Selesai |
| 8 | Sinkronisasi multi-pengguna berbasis *cloud* | Won't Have | Tidak dibuat pada MVP |

## 🗂️ Struktur Proyek dan Modul

```
PROTOTIPE TODOLIST/
├── index.html          # satu-satunya <script type="module" src="src/main.js">
├── style.css
├── manifest.json
├── assets/             # click.mp3, notification.mp3, empty-note.png, empty-task.png, fontawesome/
├── docs/               # CHARTER.md, ROADMAP.md, CHANGELOG.md
├── MODULE_MAP.md
├── DEPENDENCIES.md
├── DEBUG_LOG.md
└── src/
    ├── main.js         # titik masuk, event listener (delegasi data-aksi)
    ├── ui.js           # semua render tampilan, toast, dialog, validasi form
    ├── komponen.js     # komponen reusable: KartuTugas, PesanKosong
    ├── state.js        # pemilik data tugas, catatan, jadwal, pengaturan (bebas DOM)
    ├── storage.js      # satu-satunya modul yang menyentuh localStorage
    ├── suara.js        # pemutar suara klik dan notifikasi
    └── ui-pustaka.js   # pembungkus pustaka UI untuk modal
```

Arah import satu arah (tanpa dependensi melingkar). Penjelasan lengkap ada di [MODULE_MAP.md](./MODULE_MAP.md).

## 🧩 Kontrak Komponen (`src/komponen.js`)

### `KartuTugas(task)` → `HTMLElement`

| Parameter | Keterangan |
|---|---|
| `task.id` | Wajib. Pengenal unik tugas. |
| `task.title` | Wajib. Judul tugas (teks pengguna). |
| `task.category` | Mata kuliah/kategori (teks pengguna). |
| `task.deadline` | Tenggat (teks pengguna). |
| `task.priority` | Prioritas; dipakai juga untuk kelas CSS `tag-prio-<nilai>`. |
| `task.status` | `Belum Selesai`, `Sedang Dikerjakan`, atau `Selesai`. |

* Semua teks pengguna dimasukkan lewat `textContent`, sehingga judul seperti `<b>tebal</b>` tampil sebagai teks biasa.
* Elemen aksi memakai atribut `data-aksi` yang ditangani lewat delegasi event di `main.js`: `ubah-status`, `edit-tugas`, `hapus-tugas` (disertai `data-id`).
* Dipakai di seluruh item daftar tugas, sehingga markup kartu ditulis sekali.

### `PesanKosong(pesan)` → `HTMLElement`

Menampilkan keadaan kosong (`.empty-state`) dengan teks `pesan` yang dimasukkan lewat `textContent`. Dipakai saat daftar tugas atau catatan kosong.

## 💾 Kontrak Penyimpanan (`src/storage.js`)

| Ekspor | Perilaku |
|---|---|
| `KUNCI_TUGAS` | `'proyek-tugas:v1'`, kunci berversi untuk data tugas. |
| `KUNCI_PENGATURAN` | `'proyek-pengaturan:v1'`, kunci berversi untuk pengaturan. |
| `muatTugasLokal()` | Membaca `localStorage` setiap dipanggil. Selalu mengembalikan array dan **tidak pernah melempar galat**. JSON rusak, nilai bukan array, atau penyimpanan diblokir menghasilkan `[]`; item rusak (bukan objek atau tanpa judul teks) disaring. |
| `simpanTugasLokal(data)` | Menulis JSON ke `KUNCI_TUGAS` dengan `try/catch`; tidak melempar galat saat penyimpanan penuh atau diblokir. |
| `bacaPengaturanMentah()` | Mengembalikan objek pengaturan atau `null` bila belum ada atau rusak. |
| `simpanPengaturanMentah(data)` | Menulis pengaturan ke `KUNCI_PENGATURAN` dengan `try/catch`. |

Bila nanti struktur data berubah, naikkan versi kunci (misalnya `proyek-tugas:v2`) dan tulis migrasi dari kunci lama.

## 🧪 Uji Ketahanan (Sprint 4)

Penyimpanan diuji dengan merusak isi `localStorage` lewat DevTools (Application › Local Storage), lalu memuat ulang aplikasi.

| No | Skenario | Isi yang dimasukkan | Hasil |
|---|---|---|---|
| P-01 | S2: JSON rusak | `{rusak` | Aplikasi tetap terbuka dengan daftar kosong; tugas baru bisa ditambah dan isi kunci pulih. Lolos |
| P-02 | S5: item rusak | `[null, 5, {"title":7}]` | Aplikasi tetap terbuka, semua item rusak tersaring, badge List 0. Lolos |

## 📚 Kredit Aset dan Pustaka

| Komponen | Sumber |
|---|---|
| Bootstrap 5.3.2 | https://getbootstrap.com |
| Font Awesome (lokal di `assets/fontawesome`) | https://fontawesome.com |
| `click.mp3`, `notification.mp3` | [Pixabay] |
| `empty-note.png`, `empty-task.png` | [AI Gemini] |

Rincian pustaka lain ada di [DEPENDENCIES.md](./DEPENDENCIES.md).

## 🤖 Penggunaan Asisten AI

Bagian kode berikut dibantu asisten AI (Claude, Anthropic): [isi, misalnya `src/komponen.js`, `src/storage.js`, README ini].

## 🔗 Tautan Dokumen

* [Project Charter](./docs/CHARTER.md)
* [Project Roadmap](./docs/ROADMAP.md)
* [Changelog](./docs/CHANGELOG.md)
* [Peta Modul](./MODULE_MAP.md)
* [Dependensi](./DEPENDENCIES.md)
* [Debug Log](./DEBUG_LOG.md)