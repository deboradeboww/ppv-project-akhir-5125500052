// state.js - pemilik data aplikasi (tugas, catatan, jadwal, pengaturan).
// Aturan: tidak boleh menyentuh DOM, confirm, atau suara.
import {
    bacaPengaturanMentah, simpanPengaturanMentah,
    muatTugasLokal, simpanTugasLokal, penyimpananTersedia
} from './storage.js';

// ---------- Konstanta ----------
export const APP_VERSION = 'v5';
export const DAY_ORDER = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

const ALLOWED_AVATARS = ['fa-user', 'fa-user-graduate', 'fa-cat', 'fa-ghost', 'fa-rocket', 'fa-heart'];
const ALLOWED_FONTS = ['kecil', 'sedang', 'besar'];
const STATUS_VALID = ['Belum Selesai', 'Sedang Dikerjakan', 'Selesai'];
const PRIORITAS_DEFAULT = 'Sedang'; // dipakai bila prioritas pada data tersimpan rusak; sesuaikan dengan pilihan di form

const defaultSettings = {
    sound: true,
    font: 'sedang',
    dark: false,
    profile: { name: 'Debo', campus: '', avatar: 'fa-user' }
};

// ---------- Peringatan penyimpanan ----------
// state.js bebas DOM, jadi pesan hanya disimpan di sini; ui.js yang menampilkannya sebagai toast.
let sudahDiperingatkan = false;
let peringatanTertunda = null;

function laporkanPenyimpanan(berhasil) {
    if (berhasil || sudahDiperingatkan) return;
    sudahDiperingatkan = true;
    peringatanTertunda = 'Penyimpanan peramban tidak tersedia, jadi data tidak akan tersimpan setelah halaman ditutup.';
}

// Mengembalikan pesan sekali saja (lalu dikosongkan), atau null bila tidak ada.
export function ambilPeringatanPenyimpanan() {
    const pesan = peringatanTertunda;
    peringatanTertunda = null;
    return pesan;
}

// ---------- Pengaturan ----------
// Hanya nilai bertipe benar yang dipakai; sisanya kembali ke bawaan.
function muatPengaturan() {
    const hasil = JSON.parse(JSON.stringify(defaultSettings));
    const raw = bacaPengaturanMentah();
    if (!raw) return hasil;

    if (typeof raw.sound === 'boolean') hasil.sound = raw.sound;
    if (typeof raw.dark === 'boolean') hasil.dark = raw.dark;
    if (ALLOWED_FONTS.includes(raw.font)) hasil.font = raw.font;

    const p = raw.profile;
    if (p && typeof p === 'object' && !Array.isArray(p)) {
        if (typeof p.name === 'string' && p.name.trim()) hasil.profile.name = p.name;
        if (typeof p.campus === 'string') hasil.profile.campus = p.campus;
        if (ALLOWED_AVATARS.includes(p.avatar)) hasil.profile.avatar = p.avatar;
    }
    return hasil;
}

const settings = muatPengaturan();
laporkanPenyimpanan(penyimpananTersedia());

function simpanPengaturan() { laporkanPenyimpanan(simpanPengaturanMentah(settings)); }

export function ambilPengaturan() { return settings; }
export function suaraAktif() { return !!settings.sound; }
export function avatarValid(icon) { return ALLOWED_AVATARS.includes(icon); }

export function ubahSuara(aktif) {
    settings.sound = aktif;
    simpanPengaturan();
}

export function ubahGelap(gelap) {
    settings.dark = gelap;
    simpanPengaturan();
}

// Mengembalikan false kalau ukuran font tidak diizinkan
export function ubahFont(ukuran) {
    if (!ALLOWED_FONTS.includes(ukuran)) return false;
    settings.font = ukuran;
    simpanPengaturan();
    return true;
}

export function simpanProfil(profil) {
    settings.profile = profil;
    simpanPengaturan();
}

// ---------- Tugas ----------
// Merapikan data dari penyimpanan: tipe dipastikan benar, id dipastikan ada dan unik.
function rapikanTugas(daftar) {
    const idDipakai = new Set();
    return daftar.map((t, i) => {
        let id = (typeof t.id === 'string' || typeof t.id === 'number') ? String(t.id) : '';
        if (!id || idDipakai.has(id)) id = 't_' + Date.now() + '_' + i;
        idDipakai.add(id);
        return {
            id,
            title: t.title,
            category: typeof t.category === 'string' ? t.category : '',
            deadline: typeof t.deadline === 'string' ? t.deadline : '',
            priority: typeof t.priority === 'string' && t.priority ? t.priority : PRIORITAS_DEFAULT,
            status: STATUS_VALID.includes(t.status) ? t.status : 'Belum Selesai'
        };
    });
}

let taskListArray = rapikanTugas(muatTugasLokal());
laporkanPenyimpanan(penyimpananTersedia());

function simpanTugas() { laporkanPenyimpanan(simpanTugasLokal(taskListArray)); }

export function jumlahTugas() { return taskListArray.length; }

export function cariTugas(id) {
    return taskListArray.find(t => String(t.id) === String(id));
}

export function saringTugas({ kategori = 'Semua', status = 'Semua', prioritas = 'Semua' } = {}) {
    return taskListArray.filter(t => {
        const cocokKategori = (kategori === 'Semua' || t.category === kategori);
        const cocokStatus = (status === 'Semua' || t.status === status);
        const cocokPrioritas = (prioritas === 'Semua' || t.priority === prioritas);
        return cocokKategori && cocokStatus && cocokPrioritas;
    });
}

export function hitungProgres() {
    const total = taskListArray.length;
    if (total === 0) return { total: 0, persen: 0 };
    const selesai = taskListArray.filter(t => t.status === 'Selesai').length;
    return { total, persen: Math.round((selesai / total) * 100) };
}

export function tambahTugas({ title, category, deadline, priority, status }) {
    const tugas = { id: 't_' + Date.now(), title, category, deadline, priority, status };
    taskListArray.push(tugas);
    simpanTugas();
    return tugas;
}

export function ubahStatusTugas(id, statusBaru) {
    taskListArray = taskListArray.map(t => String(t.id) === String(id) ? { ...t, status: statusBaru } : t);
    simpanTugas();
}

export function ubahTugas(id, { title, category, deadline, priority }) {
    taskListArray = taskListArray.map(t =>
        String(t.id) === String(id) ? { ...t, title, category, deadline, priority } : t
    );
    simpanTugas();
}

export function hapusTugas(id) {
    taskListArray = taskListArray.filter(t => String(t.id) !== String(id));
    simpanTugas();
}

// ---------- Catatan cepat ----------
let notesListArray = [];
let warnaCatatan = 'kuning';

export function ambilWarnaCatatan() { return warnaCatatan; }
export function pilihWarnaCatatan(warna) { warnaCatatan = warna; }
export function jumlahCatatan() { return notesListArray.length; }
export function cariCatatan(id) { return notesListArray.find(n => n.id === id); }

// Catatan yang disematkan tampil paling atas
export function catatanTerurut() {
    return [...notesListArray].sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));
}

export function tambahCatatan(text) {
    notesListArray.push({ id: 'n_' + Date.now(), text, color: warnaCatatan, isPinned: false });
}

export function hapusCatatan(id) {
    notesListArray = notesListArray.filter(n => n.id !== id);
}

export function alihSematCatatan(id) {
    notesListArray = notesListArray.map(n => n.id === id ? { ...n, isPinned: !n.isPinned } : n);
}

// ---------- Jadwal kuliah ----------
const scheduleData = {
    "Senin": [
        { time: "07:30 - 10:00", subject: "Jaringan Komputer", room: "JJ 3.11" },
        { time: "10:15 - 13:00", subject: "Praktikum Jaringan Komputer", room: "Lab Jarkom" }
    ],
    "Selasa": [
        { time: "08:00 - 10:30", subject: "Animasi 2D", room: "Lab Komputer" },
        { time: "13:00 - 15:30", subject: "Praktikum Animasi 2D", room: "Lab Animasi" }
    ],
    "Rabu": [
        { time: "07:30 - 10:00", subject: "Teknik Penyiaran", room: "Studio TV" },
        { time: "10:15 - 12:45", subject: "Workshop UI/UX", room: "Lab UI/UX" }
    ],
    "Kamis": [
        { time: "08:00 - 10:30", subject: "Sistem Pemancar", room: "Ruang Teori 2" },
        { time: "13:00 - 15:30", subject: "Pemrograman Visual", room: "Lab Pemrograman" }
    ],
    "Jumat": [
        { time: "08:00 - 10:30", subject: "Workshop Produksi Konten", room: "Studio Multimedia" }
    ]
};

function urutkanHari(hari) {
    // Format HH:MM sudah rata, jadi aman dibandingkan sebagai teks
    scheduleData[hari].sort((a, b) => a.time.localeCompare(b.time));
}

export function adaHari(hari) { return !!scheduleData[hari]; }
export function hariAktif() { return DAY_ORDER.filter(d => scheduleData[d]); }
export function hariBelumAda() { return DAY_ORDER.filter(d => !scheduleData[d]); }
export function jadwalHari(hari) { return scheduleData[hari]; }
export function itemJadwal(hari, indeks) { return scheduleData[hari] && scheduleData[hari][indeks]; }

export function tambahHari(hari) { scheduleData[hari] = []; }
export function hapusHari(hari) { delete scheduleData[hari]; }

export function tambahJadwal(hari, entri) {
    if (!scheduleData[hari]) return false;
    scheduleData[hari].push(entri);
    urutkanHari(hari);
    return true;
}

export function ubahJadwal(hari, indeks, entri) {
    if (!scheduleData[hari] || !scheduleData[hari][indeks]) return false;
    scheduleData[hari][indeks] = entri;
    urutkanHari(hari);
    return true;
}

export function hapusJadwal(hari, indeks) {
    scheduleData[hari].splice(indeks, 1);
}