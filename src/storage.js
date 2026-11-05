// storage.js - satu-satunya modul yang menyentuh localStorage.
// Tidak tahu isi data aplikasi: hanya membaca dan menulis objek pengaturan.

const STORAGE_KEY = 'smti_pengaturan';

export function bacaPengaturanMentah() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY));
    } catch (err) {
        return null; // data rusak atau penyimpanan tidak tersedia
    }
}

export function simpanPengaturanMentah(data) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (err) { /* penyimpanan tidak tersedia */ }
}
