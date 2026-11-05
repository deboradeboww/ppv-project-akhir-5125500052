// main.js - titik masuk: memasang semua event listener dan menjalankan inisialisasi.
// Tidak menyimpan data dan tidak membuat HTML; hanya menghubungkan state.js, ui.js, dan suara.js.
import * as State from './state.js';
import * as Ui from './ui.js';
import { el } from './ui.js';
import { mainkanKlik } from './suara.js';

// ==========================================
// NAVIGASI HALAMAN
// ==========================================
Ui.daftarNavigasi.forEach(item => {
    if (item.btn && item.page) {
        item.btn.addEventListener('click', () => {
            Ui.tampilkanHalaman(item.btn, item.page, true);
        });
    }
});

// ==========================================
// TOAST & POP-UP KONFIRMASI
// ==========================================
if (el.closeToastBtn) el.closeToastBtn.addEventListener('click', Ui.tutupToast);

if (el.confirmYesBtn) el.confirmYesBtn.addEventListener('click', Ui.jawabKonfirmasiYa);
if (el.confirmNoBtn) el.confirmNoBtn.addEventListener('click', Ui.jawabKonfirmasiTidak);

// Tombol Tutup (X) di semua modal
el.tombolTutupModal.forEach(btn => {
    btn.addEventListener('click', () => {
        mainkanKlik();
        Ui.tutupSemuaModal();
    });
});

// Klik area gelap di luar kotak modal = tutup
el.semuaModal.forEach(modalEl => {
    modalEl.addEventListener('mousedown', (e) => {
        if (e.target === modalEl) Ui.tutupSemuaModal();
    });
});

// Tombol Esc = tutup modal yang sedang terbuka
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && Ui.adaModalTerbuka()) Ui.tutupSemuaModal();
});

// ==========================================
// PENGATURAN: SOUND, FONT, DARK MODE
// ==========================================
if (el.soundSwitch) {
    el.soundSwitch.checked = State.suaraAktif();
    el.soundSwitch.addEventListener('change', () => {
        State.ubahSuara(el.soundSwitch.checked);
        mainkanKlik(); // hanya bunyi kalau sound baru dinyalakan
    });
}

if (el.darkSwitch) {
    el.darkSwitch.checked = !!State.ambilPengaturan().dark;
    el.darkSwitch.addEventListener('change', () => {
        State.ubahGelap(el.darkSwitch.checked);
        Ui.terapkanTema(el.darkSwitch.checked);
        mainkanKlik();
    });
}

el.fontBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const size = btn.getAttribute('data-font');
        if (!State.ubahFont(size)) return;
        Ui.terapkanFont(size);
        mainkanKlik();
    });
});

// ==========================================
// PROFIL
// ==========================================
el.avatarBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const icon = btn.getAttribute('data-icon');
        if (!State.avatarValid(icon)) return;
        mainkanKlik();
        Ui.pilihAvatar(icon);
    });
});

if (el.profileNameInput) {
    el.profileNameInput.addEventListener('input', () => Ui.setErrorNamaProfil(false));
}

if (el.profileForm) {
    el.profileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = el.profileNameInput.value.trim();
        const campus = el.profileCampusInput.value.trim();

        // Jika nama kosong: error merah, TANPA toast sukses
        if (!name) {
            Ui.setErrorNamaProfil(true);
            el.profileNameInput.focus();
            return;
        }

        Ui.setErrorNamaProfil(false);
        State.simpanProfil({ name, campus, avatar: Ui.ambilAvatarTerpilih() });
        Ui.renderProfil();
        Ui.tampilkanToast("Profil berhasil diperbarui!");
    });
}

// ==========================================
// TUGAS
// ==========================================
if (el.taskTitleInput) el.taskTitleInput.addEventListener('input', Ui.hilangkanErrorJudul);
if (el.taskCategoryInput) el.taskCategoryInput.addEventListener('change', Ui.hilangkanErrorKategori);
if (el.taskDeadlineInput) el.taskDeadlineInput.addEventListener('change', Ui.hilangkanErrorDeadline);

function prosesTambahTugas() {
    // Jika belum lengkap: tampilkan error merah, TANPA toast sukses
    if (!Ui.validasiFormTugas()) return;

    State.tambahTugas(Ui.bacaFormTugas());
    Ui.resetFormTugas();
    Ui.bersihkanErrorTugas();
    Ui.renderTugas();
    Ui.tampilkanToast("Yey! Tugas barumu berhasil ditambahkan!");

    // Pindah halaman otomatis tanpa memicu suara klik dobel (cukup suara toast)
    Ui.tampilkanHalaman(el.navList, el.pageList, false);
}

if (el.taskForm) {
    el.taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        prosesTambahTugas();
    });
}

// Tombol Enter untuk semua form: satu pendengar di level dokumen (fase capture)
document.addEventListener('keydown', (e) => {
    const isEnter = e.key === 'Enter' || e.keyCode === 13 || e.which === 13;
    if (!isEnter || e.isComposing) return;

    const target = e.target;
    if (!target || !target.tagName || typeof target.closest !== 'function') return;

    const tag = target.tagName;
    if (tag === 'BUTTON' || tag === 'TEXTAREA' || tag === 'A') return; // biarkan normal

    const form = target.closest('form');
    if (!form) return; // contoh: kolom catatan cepat punya pendengar Enter sendiri

    e.preventDefault();
    e.stopPropagation();

    if (form === el.taskForm) {
        prosesTambahTugas();
    } else if (typeof form.requestSubmit === 'function') {
        form.requestSubmit();
    } else {
        form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }
}, true);

if (el.filterCategory) el.filterCategory.addEventListener('change', Ui.renderTugas);
if (el.filterStatus) el.filterStatus.addEventListener('change', Ui.renderTugas);
if (el.filterPriority) el.filterPriority.addEventListener('change', Ui.renderTugas);

// Delegasi event untuk daftar tugas (pengganti onclick/onchange di HTML)
function hapusTugasDenganKonfirmasi(id) {
    const task = State.cariTugas(id);
    if (!task) return;
    Ui.tampilkanKonfirmasi({
        title: 'Hapus Tugas?',
        message: `Yakin mau menghapus tugas "${task.title}"?`
    }, () => {
        State.hapusTugas(id);
        Ui.renderTugas();
        Ui.tampilkanToast("Tugas berhasil dihapus.");
    });
}

function bukaEditTugas(id) {
    mainkanKlik();
    const task = State.cariTugas(id);
    if (task) Ui.bukaFormEditTugas(task);
}

if (el.taskListContainer) {
    el.taskListContainer.addEventListener('click', (e) => {
        const tombol = e.target.closest('[data-aksi]');
        if (!tombol) return;
        const id = tombol.dataset.id;
        if (tombol.dataset.aksi === 'edit-tugas') bukaEditTugas(id);
        else if (tombol.dataset.aksi === 'hapus-tugas') hapusTugasDenganKonfirmasi(id);
    });

    el.taskListContainer.addEventListener('change', (e) => {
        const pilihan = e.target.closest('[data-aksi="ubah-status"]');
        if (!pilihan) return;
        State.ubahStatusTugas(pilihan.dataset.id, pilihan.value);
        Ui.renderTugas();
        Ui.tampilkanToast("Status tugas berhasil diperbarui!");
    });
}

if (el.editTaskForm) {
    el.editTaskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const { id, ...isian } = Ui.bacaFormEditTugas();
        State.ubahTugas(id, isian);
        Ui.renderTugas();
        Ui.tutupModal('editModal');
        Ui.tampilkanToast("Tugas berhasil diperbarui!");
    });
}

// ==========================================
// CATATAN CEPAT
// ==========================================
el.colorBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        mainkanKlik();
        Ui.sorotWarna(btn);
        State.pilihWarnaCatatan(btn.getAttribute('data-color'));
    });
});

function tambahCatatanBaru() {
    const text = el.noteInputText.value.trim();

    // Jika kosong: tampilkan error merah, TANPA toast sukses
    if (!text) {
        Ui.setErrorCatatan(true);
        el.noteInputText.focus();
        return;
    }

    Ui.setErrorCatatan(false);
    State.tambahCatatan(text);
    el.noteInputText.value = '';
    Ui.renderCatatan();
    Ui.tampilkanToast("Catatan cepat berhasil ditambahkan!");
}

if (el.addNoteBtn) el.addNoteBtn.addEventListener('click', tambahCatatanBaru);

if (el.noteInputText) {
    // Error hilang otomatis saat user mulai mengetik
    el.noteInputText.addEventListener('input', () => Ui.setErrorCatatan(false));

    // Tekan Enter untuk menambah catatan
    el.noteInputText.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            tambahCatatanBaru();
        }
    });
}

function hapusCatatanDenganKonfirmasi(id) {
    const note = State.cariCatatan(id);
    if (!note) return;
    const preview = note.text.length > 40 ? note.text.slice(0, 40) + '...' : note.text;
    Ui.tampilkanKonfirmasi({
        title: 'Hapus Catatan?',
        message: `Yakin mau menghapus catatan "${preview}"?`
    }, () => {
        State.hapusCatatan(id);
        Ui.renderCatatan();
        Ui.tampilkanToast("Catatan berhasil dihapus.");
    });
}

if (el.notesContainer) {
    el.notesContainer.addEventListener('click', (e) => {
        const tombol = e.target.closest('[data-aksi]');
        if (!tombol) return;
        const id = tombol.dataset.id;
        if (tombol.dataset.aksi === 'semat-catatan') {
            mainkanKlik();
            State.alihSematCatatan(id);
            Ui.renderCatatan();
        } else if (tombol.dataset.aksi === 'hapus-catatan') {
            hapusCatatanDenganKonfirmasi(id);
        }
    });
}

// ==========================================
// JADWAL KULIAH
// ==========================================
Ui.daftarKolomJadwal.forEach(k => {
    if (k) k.addEventListener('input', Ui.sembunyikanErrorJadwal);
});

function hapusJadwalDenganKonfirmasi(day, index) {
    const item = State.itemJadwal(day, index);
    if (!item) return;
    Ui.tampilkanKonfirmasi({
        title: 'Hapus Jadwal?',
        message: `Yakin mau menghapus jadwal "${item.subject}" di hari ${day}?`
    }, () => {
        State.hapusJadwal(day, index);
        Ui.renderJadwal();
        Ui.tampilkanToast("Jadwal kuliah berhasil dihapus.");
    });
}

function hapusHariDenganKonfirmasi(day) {
    if (!State.adaHari(day)) return;
    const count = State.jadwalHari(day).length;
    const message = count > 0
        ? `Yakin mau menghapus hari ${day} beserta ${count} jadwal di dalamnya?`
        : `Yakin mau menghapus hari ${day}?`;
    Ui.tampilkanKonfirmasi({ title: 'Hapus Hari?', message }, () => {
        State.hapusHari(day);
        Ui.renderJadwal();
        Ui.tampilkanToast(`Hari ${day} berhasil dihapus.`);
    });
}

if (el.scheduleContainer) {
    el.scheduleContainer.addEventListener('click', (e) => {
        const tombol = e.target.closest('[data-aksi]');
        if (!tombol) return;
        const day = tombol.dataset.hari;
        const idx = Number(tombol.dataset.idx);

        switch (tombol.dataset.aksi) {
            case 'tambah-jadwal':
                mainkanKlik();
                Ui.bukaFormTambahJadwal(day);
                break;
            case 'edit-jadwal':
                mainkanKlik();
                Ui.bukaFormEditJadwal(day, idx, State.itemJadwal(day, idx));
                break;
            case 'hapus-jadwal':
                hapusJadwalDenganKonfirmasi(day, idx);
                break;
            case 'hapus-hari':
                hapusHariDenganKonfirmasi(day);
                break;
        }
    });
}

if (el.editScheduleForm) {
    el.editScheduleForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const data = Ui.bacaFormJadwal();
        if (!data) return; // error merah sudah tampil di modal

        const entri = { time: `${data.start} - ${data.end}`, subject: data.subject, room: data.room };
        const berhasil = data.isAddMode
            ? State.tambahJadwal(data.day, entri)
            : State.ubahJadwal(data.day, parseInt(data.indexText), entri);
        if (!berhasil) return;

        Ui.renderJadwal();
        Ui.tutupModal('editScheduleModal');
        Ui.tampilkanToast(data.isAddMode ? "Jadwal kuliah berhasil ditambahkan!" : "Jadwal kuliah berhasil diperbarui!");
    });
}

if (el.addDayBtn) {
    el.addDayBtn.addEventListener('click', () => {
        const missingDays = State.hariBelumAda();
        if (missingDays.length === 0) return;
        mainkanKlik();
        Ui.bukaModalTambahHari(missingDays);
    });
}

if (el.addDayForm) {
    el.addDayForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const day = Ui.bacaHariBaru();
        if (!day || State.adaHari(day)) return;
        State.tambahHari(day);
        Ui.renderJadwal();
        Ui.tutupModal('addDayModal');
        Ui.tampilkanToast(`Hari ${day} berhasil ditambahkan!`);
    });
}

// ==========================================
// INISIALISASI
// ==========================================
Ui.terapkanFont(State.ambilPengaturan().font);
Ui.terapkanTema(!!State.ambilPengaturan().dark);
Ui.renderProfil();
Ui.renderTugas();
Ui.renderCatatan();
Ui.renderJadwal();
Ui.tampilkanVersi('script ' + State.APP_VERSION);

console.log("Sistem Manajemen Tugas Interaktif " + State.APP_VERSION + " berhasil dimuat!");
