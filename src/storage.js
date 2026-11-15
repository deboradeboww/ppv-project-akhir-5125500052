// src/storage.js - satu-satunya modul yang membaca dan menulis localStorage.
// Kontrak: fungsi di sini TIDAK PERNAH melempar galat.
export const KUNCI_TUGAS = 'proyek-tugas:v1';
export const KUNCI_PENGATURAN = 'proyek-pengaturan:v1';

// Cadangan di memori: dipakai saat localStorage diblokir/penuh, supaya aplikasi
// tetap konsisten selama halaman terbuka (datanya hilang setelah halaman ditutup).
const cadanganMemori = new Map();
let tersedia = true;

// false bila operasi localStorage terakhir gagal (diblokir atau penuh)
export function penyimpananTersedia() { return tersedia; }

// Mengembalikan true bila berhasil tersimpan permanen, false bila hanya ada di memori
function tulis(kunci, data) {
  try {
    cadanganMemori.set(kunci, JSON.parse(JSON.stringify(data)));
  } catch (err) {
    console.warn(`Data "${kunci}" tidak bisa dijadikan JSON:`, err);
    return false;
  }
  try {
    localStorage.setItem(kunci, JSON.stringify(data));
    tersedia = true;
    return true;
  } catch (err) {
    tersedia = false;
    console.warn(`Gagal menyimpan "${kunci}" ke localStorage:`, err);
    return false;
  }
}

// Mengembalikan nilai hasil parse, atau null bila kosong/rusak/diblokir
function baca(kunci) {
  let mentah;
  try {
    mentah = localStorage.getItem(kunci);
    tersedia = true;
  } catch (err) {
    tersedia = false;
    console.warn(`localStorage tidak bisa dibaca, memakai cadangan memori ("${kunci}"):`, err);
    return cadanganMemori.has(kunci) ? cadanganMemori.get(kunci) : null;
  }
  if (mentah === null) return null;
  try {
    return JSON.parse(mentah);
  } catch (err) {
    console.warn(`Isi "${kunci}" rusak dan diabaikan:`, err);
    return null;
  }
}

// ---------- Tugas ----------
// Selalu mengembalikan array; item yang bukan objek atau tanpa judul teks dibuang.
export function muatTugasLokal() {
  const data = baca(KUNCI_TUGAS);
  if (!Array.isArray(data)) return [];
  return data.filter(
    (t) => t !== null && typeof t === 'object' && typeof t.title === 'string'
  );
}

export function simpanTugasLokal(data) {
  return tulis(KUNCI_TUGAS, data);
}

// ---------- Pengaturan ----------
// Mengembalikan objek pengaturan, atau null bila belum ada / rusak.
export function bacaPengaturanMentah() {
  const data = baca(KUNCI_PENGATURAN);
  return data !== null && typeof data === 'object' && !Array.isArray(data) ? data : null;
}

export function simpanPengaturanMentah(data) {
  return tulis(KUNCI_PENGATURAN, data);
}