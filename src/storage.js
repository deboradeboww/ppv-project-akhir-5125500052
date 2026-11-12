// src/storage.js
export const KUNCI_TUGAS = 'proyek-tugas:v1';

export function simpanTugasLokal(data) {
  try {
    localStorage.setItem(KUNCI_TUGAS, JSON.stringify(data));
  } catch (err) {
    console.warn('Gagal menyimpan ke localStorage:', err);
  }
}

export function muatTugasLokal() {
  try {
    const raw = localStorage.getItem(KUNCI_TUGAS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    return [];
  }
}

// Fungsi tambahan untuk menangani pemanggilan dari state.js
export function bacaPengaturanMentah() {
  try {
    return localStorage.getItem(KUNCI_TUGAS);
  } catch (err) {
    console.warn('Gagal membaca data mentah dari localStorage:', err);
    return null;
  }
}