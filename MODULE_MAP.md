# MODULE_MAP.md - Sistem Manajemen Tugas Interaktif

Aplikasi dimuat lewat satu `<script type="module" src="src/main.js">`. Modul harus dijalankan lewat server lokal (Live Server, `python -m http.server`, atau `npx vite`), bukan klik dua kali (`file://`).

## Peta modul (arah import: dari atas ke bawah, satu arah)

```
main.js
  ├──> ui.js
  │      ├──> state.js ──> storage.js
  │      ├──> suara.js ──> state.js
  │      └──> ui-pustaka.js
  ├──> state.js
  └──> suara.js
```

Daftar import sebenarnya:

| Modul | Mengimpor |
|---|---|
| `main.js` | `state.js`, `ui.js`, `suara.js` |
| `ui.js` | `state.js`, `suara.js`, `ui-pustaka.js` |
| `suara.js` | `state.js` |
| `state.js` | `storage.js` |
| `storage.js` | (tidak ada) |
| `ui-pustaka.js` | (tidak ada) |

Tidak ada dependensi melingkar.

## Tanggung jawab satu kalimat per modul

| Modul | Tanggung jawab |
|---|---|
| `main.js` | Titik masuk yang memasang semua event listener (termasuk delegasi untuk tombol hasil render) dan menjalankan inisialisasi. |
| `ui.js` | Semua yang menyentuh tampilan: render tugas/catatan/jadwal/profil, toast, dialog konfirmasi, dan validasi form. |
| `state.js` | Satu-satunya pemilik data tugas, catatan cepat, jadwal kuliah, dan pengaturan; bebas DOM. |
| `storage.js` | Satu-satunya modul yang membaca dan menulis `localStorage` (kunci `smti_pengaturan`). |
| `suara.js` | Memutar suara klik dan notifikasi sesuai status suara dari `state.js`. |
| `ui-pustaka.js` | Pembungkus pustaka UI untuk membuka dan menutup modal (hasil P09). |

## Perubahan yang dilakukan

- Variabel/fungsi global di `script.js` dipindah ke modul. `window.changeTaskStatus`, `window.deleteTask`, `window.openEditTaskModal`, `window.deleteNote`, `window.togglePinNote`, `window.openAddSchedule`, `window.openEditSchedule`, `window.deleteScheduleItem`, `window.deleteScheduleDay`, dan `window.toastTimer` dihapus.
- Atribut `onclick`/`onchange` pada HTML hasil render diganti `data-aksi` (+ `data-id`, `data-hari`, `data-idx`) dan ditangani lewat delegasi event di `main.js`.
- `ui-pustaka.js` hanya ditambah `export { UiPustaka }`.

## Bagian yang belum dimodulkan

- **Data tugas, catatan, dan jadwal tidak disimpan ke `localStorage`.** Itu perilaku asli aplikasi (hanya pengaturan yang tersimpan), jadi sengaja tidak diubah supaya refactor tidak mengubah perilaku. Kalau nanti ingin disimpan, cukup tambah fungsi di `storage.js` dan panggil dari `state.js`.
- **`ui.js` masih besar** (render semua halaman dalam satu modul). Bisa dipecah per halaman (misalnya `ui-tugas.js`, `ui-catatan.js`, `ui-jadwal.js`) pada sprint berikutnya.
- **Bootstrap JS bundle** tetap dimuat sebagai `<script>` klasik dari CDN karena memang bukan kode aplikasi; modal tidak memakainya (ditangani `ui-pustaka.js`).
