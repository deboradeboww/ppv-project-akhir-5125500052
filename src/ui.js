// ui.js - semua yang menyentuh tampilan: render, toast, dialog konfirmasi, validasi tampilan.
// Tidak memasang event (itu tugas main.js) dan tidak menyimpan data (itu tugas state.js).
import * as State from './state.js';
import { mainkanKlik, mainkanNotifikasi } from './suara.js';
import { UiPustaka } from './ui-pustaka.js';

// ==========================================
// REFERENSI ELEMEN (dipakai juga oleh main.js untuk memasang event)
// ==========================================
export const el = {
    root: document.documentElement,

    // navigasi
    navInput: document.getElementById('navInput'),
    navList: document.getElementById('navList'),
    navNotes: document.getElementById('navNotes'),
    navSchedule: document.getElementById('navSchedule'),
    navProfile: document.getElementById('navProfile'),
    pageInput: document.getElementById('pageInput'),
    pageList: document.getElementById('pageList'),
    pageNotes: document.getElementById('pageNotes'),
    pageSchedule: document.getElementById('pageSchedule'),
    pageProfile: document.getElementById('pageProfile'),

    // toast & konfirmasi
    toastNotification: document.getElementById('toastNotification'),
    toastMessage: document.getElementById('toastMessage'),
    closeToastBtn: document.getElementById('closeToastBtn'),
    confirmTitle: document.getElementById('confirmTitle'),
    confirmMessage: document.getElementById('confirmMessage'),
    confirmYesBtn: document.getElementById('confirmYesBtn'),
    confirmNoBtn: document.getElementById('confirmNoBtn'),
    tombolTutupModal: document.querySelectorAll('[data-bs-dismiss="modal"], .btn-close'),
    semuaModal: document.querySelectorAll('.modal'),

    // pengaturan
    soundSwitch: document.getElementById('soundSwitch'),
    darkSwitch: document.getElementById('darkSwitch'),
    fontBtns: document.querySelectorAll('.seg-btn[data-font]'),

    // profil
    headerName: document.getElementById('headerName'),
    headerAvatarIcon: document.getElementById('headerAvatarIcon'),
    summaryAvatarIcon: document.getElementById('summaryAvatarIcon'),
    summaryName: document.getElementById('summaryName'),
    summaryCampus: document.getElementById('summaryCampus'),
    profileForm: document.getElementById('profileForm'),
    profileNameInput: document.getElementById('profileName'),
    profileCampusInput: document.getElementById('profileCampus'),
    profileNameError: document.getElementById('profileNameError'),
    avatarBtns: document.querySelectorAll('.avatar-btn'),

    // tugas
    taskForm: document.getElementById('taskForm'),
    taskTitleInput: document.getElementById('taskTitle'),
    taskCategoryInput: document.getElementById('taskCategory'),
    taskDeadlineInput: document.getElementById('taskDeadline'),
    taskPriorityInput: document.getElementById('taskPriority'),
    taskStatusInput: document.getElementById('taskStatus'),
    taskListContainer: document.getElementById('taskList'),
    taskCountBadge: document.getElementById('taskCountBadge'),
    progressBar: document.getElementById('progressBar'),
    progressText: document.getElementById('progressText'),
    filterCategory: document.getElementById('filterCategory'),
    filterStatus: document.getElementById('filterStatus'),
    filterPriority: document.getElementById('filterPriority'),
    editTaskForm: document.getElementById('editTaskForm'),
    editTaskId: document.getElementById('editTaskId'),
    editTaskTitle: document.getElementById('editTaskTitle'),
    editTaskCategory: document.getElementById('editTaskCategory'),
    editTaskDeadline: document.getElementById('editTaskDeadline'),
    editTaskPriority: document.getElementById('editTaskPriority'),

    // catatan cepat
    noteInputText: document.getElementById('noteInputText'),
    noteError: document.getElementById('noteError'),
    addNoteBtn: document.getElementById('addNoteBtn'),
    notesContainer: document.getElementById('notesContainer'),
    colorBtns: document.querySelectorAll('.color-btn'),

    // jadwal
    scheduleContainer: document.getElementById('scheduleContainer'),
    addDayBtn: document.getElementById('addDayBtn'),
    addDayForm: document.getElementById('addDayForm'),
    newDaySelect: document.getElementById('newDaySelect'),
    editScheduleForm: document.getElementById('editScheduleForm'),
    editSchedDay: document.getElementById('editSchedDay'),
    editSchedIndex: document.getElementById('editSchedIndex'),
    editSchedStartTime: document.getElementById('editSchedStartTime'),
    editSchedEndTime: document.getElementById('editSchedEndTime'),
    editSchedSubject: document.getElementById('editSchedSubject'),
    editSchedRoom: document.getElementById('editSchedRoom'),
    scheduleModalTitle: document.getElementById('scheduleModalTitle'),
    schedSubmitBtn: document.getElementById('schedSubmitBtn'),
    schedError: document.getElementById('schedError'),

    // versi
    verJs: document.getElementById('verJs')
};

const navItems = [
    { btn: el.navInput, page: el.pageInput },
    { btn: el.navList, page: el.pageList },
    { btn: el.navNotes, page: el.pageNotes },
    { btn: el.navSchedule, page: el.pageSchedule },
    { btn: el.navProfile, page: el.pageProfile }
];
export const daftarNavigasi = navItems;

// ==========================================
// UTILITAS
// ==========================================
function escapeHtml(str) {
    return String(str).replace(/[&<>'"]/g,
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}

function setError(inputEl, errorId, isError) {
    const errEl = document.getElementById(errorId);
    if (errEl) errEl.classList.toggle('show', isError);
    if (inputEl) inputEl.classList.toggle('input-error', isError);
}

// ==========================================
// NAVIGASI HALAMAN
// ==========================================
export function tampilkanHalaman(targetBtn, targetPage, playAudio = true) {
    if (playAudio) mainkanKlik();
    navItems.forEach(item => {
        if (item.btn) item.btn.classList.remove('active');
        if (item.page) item.page.classList.add('hidden');
    });
    if (targetBtn) targetBtn.classList.add('active');
    if (targetPage) targetPage.classList.remove('hidden');
}

// ==========================================
// TOAST
// ==========================================
let toastTimer = null;

export function tampilkanToast(msg) {
    if (el.toastMessage) el.toastMessage.textContent = msg;
    if (el.toastNotification) {
        el.toastNotification.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
            el.toastNotification.classList.remove('show');
        }, 3500);
    }
    mainkanNotifikasi();
}

export function tutupToast() {
    if (el.toastNotification) el.toastNotification.classList.remove('show');
}

// ==========================================
// MODAL & POP-UP KONFIRMASI (YA / TIDAK)
// ==========================================
const MODAL_IDS = ['editModal', 'editScheduleModal', 'addDayModal', 'confirmModal'];
let confirmCallback = null;

export function tutupSemuaModal() {
    confirmCallback = null;
    MODAL_IDS.forEach(id => UiPustaka.tutupModal(id));
}

export function adaModalTerbuka() {
    return !!document.querySelector('.modal.show');
}

export function tampilkanKonfirmasi(options, onYes) {
    const opts = options || {};
    if (el.confirmTitle) el.confirmTitle.textContent = opts.title || 'Konfirmasi';
    if (el.confirmMessage) el.confirmMessage.textContent = opts.message || 'Yakin ingin melanjutkan?';
    if (el.confirmYesBtn) el.confirmYesBtn.textContent = opts.yesText || 'Ya, Hapus';
    if (el.confirmNoBtn) el.confirmNoBtn.textContent = opts.noText || 'Tidak';
    confirmCallback = onYes;
    mainkanKlik();
    UiPustaka.bukaModal('confirmModal');
    if (el.confirmNoBtn) el.confirmNoBtn.focus(); // fokus ke "Tidak" supaya aman dari salah tekan
}

export function jawabKonfirmasiYa() {
    const callback = confirmCallback;
    confirmCallback = null;
    UiPustaka.tutupModal('confirmModal');
    if (typeof callback === 'function') callback();
}

export function jawabKonfirmasiTidak() {
    mainkanKlik();
    confirmCallback = null;
    UiPustaka.tutupModal('confirmModal');
}

// ==========================================
// FONT & TEMA
// ==========================================
export function terapkanFont(size) {
    el.root.setAttribute('data-font', size);
    el.fontBtns.forEach(b => b.classList.toggle('active', b.getAttribute('data-font') === size));
}

export function terapkanTema(isDark) {
    el.root.setAttribute('data-theme', isDark ? 'dark' : 'light');
    el.root.setAttribute('data-bs-theme', isDark ? 'dark' : 'light'); // supaya komponen Bootstrap ikut gelap
}

// ==========================================
// PROFIL
// ==========================================
let avatarTerpilih = State.ambilPengaturan().profile.avatar;

export function ambilAvatarTerpilih() { return avatarTerpilih; }

export function pilihAvatar(icon) {
    avatarTerpilih = icon;
    sorotAvatar(icon);
}

function sorotAvatar(icon) {
    el.avatarBtns.forEach(b => b.classList.toggle('active', b.getAttribute('data-icon') === icon));
}

export function renderProfil() {
    const p = State.ambilPengaturan().profile;
    if (el.headerName) el.headerName.textContent = `Hai ${p.name}!`;
    if (el.headerAvatarIcon) el.headerAvatarIcon.className = `fa-solid ${p.avatar}`;
    if (el.summaryAvatarIcon) el.summaryAvatarIcon.className = `fa-solid ${p.avatar}`;
    if (el.summaryName) el.summaryName.textContent = p.name;
    if (el.summaryCampus) el.summaryCampus.textContent = p.campus || 'Kampus / program studi belum diisi';
    if (el.profileNameInput) el.profileNameInput.value = p.name;
    if (el.profileCampusInput) el.profileCampusInput.value = p.campus;
    avatarTerpilih = p.avatar;
    sorotAvatar(avatarTerpilih);
}

export function setErrorNamaProfil(isError) {
    if (el.profileNameError) el.profileNameError.classList.toggle('show', isError);
    if (el.profileNameInput) el.profileNameInput.classList.toggle('input-error', isError);
}

// ==========================================
// TUGAS
// ==========================================
function perbaruiProgres() {
    const { total, persen } = State.hitungProgres();
    if (el.progressBar) el.progressBar.style.width = persen + '%';
    if (el.progressText) el.progressText.textContent = persen + '%';
    if (el.taskCountBadge) el.taskCountBadge.textContent = total;
}

export function renderTugas() {
    if (!el.taskListContainer) return;
    el.taskListContainer.innerHTML = '';

    const filtered = State.saringTugas({
        kategori: el.filterCategory ? el.filterCategory.value : 'Semua',
        status: el.filterStatus ? el.filterStatus.value : 'Semua',
        prioritas: el.filterPriority ? el.filterPriority.value : 'Semua'
    });

    if (filtered.length === 0) {
        const emptyText = State.jumlahTugas() === 0
            ? 'Belum ada tugas tersimpan. Silakan isi lewat menu "Input"!'
            : 'Tidak ada tugas yang sesuai dengan filter.';
        el.taskListContainer.innerHTML = `
            <div class="empty-state">
                <img src="assets/empty-task.png" alt="Ilustrasi Tugas Kosong" class="empty-img" width="70">
                <p>${emptyText}</p>
            </div>
        `;
        perbaruiProgres();
        return;
    }

    filtered.forEach((task) => {
        const card = document.createElement('div');
        card.className = 'task-card-item';
        card.innerHTML = `
            <div class="task-header-row">
                <span class="task-title-text">${escapeHtml(task.title)}</span>
                <div class="task-meta-tags">
                    <span class="tag-badge tag-mk">${escapeHtml(task.category)}</span>
                    <span class="tag-badge tag-date"><i class="fa-solid fa-calendar"></i> ${escapeHtml(task.deadline)}</span>
                    <span class="tag-badge tag-prio-${task.priority}">${escapeHtml(task.priority)}</span>
                </div>
            </div>
            <div class="task-footer-row" style="display: flex; justify-content: flex-end; align-items: center; gap: 8px; flex-wrap: wrap; border-top: 1px dashed var(--input-border); padding-top: 8px;">
                <select class="form-select form-select-sm" style="font-size: 0.75rem; padding: 4px 8px; border-radius: 8px; width: auto;" data-aksi="ubah-status" data-id="${task.id}">
                    <option value="Belum Selesai" ${task.status === 'Belum Selesai' ? 'selected' : ''}>Belum Selesai</option>
                    <option value="Sedang Dikerjakan" ${task.status === 'Sedang Dikerjakan' ? 'selected' : ''}>Sedang Dikerjakan</option>
                    <option value="Selesai" ${task.status === 'Selesai' ? 'selected' : ''}>Selesai</option>
                </select>
                <button type="button" class="btn-act btn-edit" data-aksi="edit-tugas" data-id="${task.id}"><i class="fa-solid fa-pen"></i> Edit</button>
                <button type="button" class="btn-act btn-del" data-aksi="hapus-tugas" data-id="${task.id}"><i class="fa-solid fa-trash"></i> Hapus</button>
            </div>
        `;
        el.taskListContainer.appendChild(card);
    });
    perbaruiProgres();
}

// ----- Validasi form tugas (pesan error merah) -----
export function validasiFormTugas() {
    const titleEmpty = !el.taskTitleInput.value.trim();
    const categoryEmpty = !el.taskCategoryInput.value;
    const deadlineEmpty = !el.taskDeadlineInput.value;

    setError(el.taskTitleInput, 'titleError', titleEmpty);
    setError(el.taskCategoryInput, 'categoryError', categoryEmpty);
    setError(el.taskDeadlineInput, 'deadlineError', deadlineEmpty);

    // Fokus ke kolom pertama yang masih kosong
    if (titleEmpty) el.taskTitleInput.focus();
    else if (categoryEmpty) el.taskCategoryInput.focus();
    else if (deadlineEmpty) el.taskDeadlineInput.focus();

    return !(titleEmpty || categoryEmpty || deadlineEmpty);
}

export function bersihkanErrorTugas() {
    setError(el.taskTitleInput, 'titleError', false);
    setError(el.taskCategoryInput, 'categoryError', false);
    setError(el.taskDeadlineInput, 'deadlineError', false);
}

export function hilangkanErrorJudul() { setError(el.taskTitleInput, 'titleError', false); }
export function hilangkanErrorKategori() { setError(el.taskCategoryInput, 'categoryError', false); }
export function hilangkanErrorDeadline() { setError(el.taskDeadlineInput, 'deadlineError', false); }

export function bacaFormTugas() {
    return {
        title: el.taskTitleInput.value.trim(),
        category: el.taskCategoryInput.value,
        deadline: el.taskDeadlineInput.value,
        priority: el.taskPriorityInput.value,
        status: el.taskStatusInput.value
    };
}

export function resetFormTugas() { el.taskForm.reset(); }

// ----- Modal edit tugas -----
export function bukaFormEditTugas(task) {
    el.editTaskId.value = task.id;
    el.editTaskTitle.value = task.title;
    el.editTaskCategory.value = task.category;
    el.editTaskDeadline.value = task.deadline;
    el.editTaskPriority.value = task.priority;
    UiPustaka.bukaModal('editModal');
}

export function bacaFormEditTugas() {
    return {
        id: el.editTaskId.value,
        title: el.editTaskTitle.value.trim(),
        category: el.editTaskCategory.value,
        deadline: el.editTaskDeadline.value,
        priority: el.editTaskPriority.value
    };
}

// ==========================================
// CATATAN CEPAT
// ==========================================
export function sorotWarna(btnAktif) {
    el.colorBtns.forEach(b => b.classList.remove('active'));
    btnAktif.classList.add('active');
}

export function renderCatatan() {
    if (!el.notesContainer) return;
    el.notesContainer.innerHTML = '';

    if (State.jumlahCatatan() === 0) {
        el.notesContainer.innerHTML = `
            <div class="empty-state">
                <img src="assets/empty-note.png" alt="Ilustrasi Catatan Kosong" class="empty-img" width="70">
                <p>Belum ada catatan cepat tersimpan.</p>
            </div>
        `;
        return;
    }

    State.catatanTerurut().forEach(note => {
        const card = document.createElement('div');
        card.className = `note-card-item note-${note.color} ${note.isPinned ? 'is-pinned' : ''}`;
        card.innerHTML = `
            <span class="note-text">${escapeHtml(note.text)}</span>
            <div style="display: flex; gap: 4px; align-items: center;">
                <button type="button" class="btn-pin ${note.isPinned ? 'active' : ''}" data-aksi="semat-catatan" data-id="${note.id}" title="Sematkan"><i class="fa-solid fa-thumbtack"></i></button>
                <button type="button" class="btn-act btn-del" data-aksi="hapus-catatan" data-id="${note.id}" title="Hapus"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;
        el.notesContainer.appendChild(card);
    });
}

export function setErrorCatatan(isError) {
    if (el.noteError) el.noteError.classList.toggle('show', isError);
    if (el.noteInputText) el.noteInputText.classList.toggle('input-error', isError);
}

// ==========================================
// JADWAL KULIAH
// ==========================================
export function renderJadwal() {
    if (!el.scheduleContainer) return;
    el.scheduleContainer.innerHTML = '';

    const activeDays = State.hariAktif();

    // Tombol "Tambah Hari" nonaktif kalau ke-7 hari sudah ada
    if (el.addDayBtn) el.addDayBtn.disabled = activeDays.length === State.DAY_ORDER.length;

    if (activeDays.length === 0) {
        el.scheduleContainer.innerHTML = `
            <div class="empty-state">
                <p>Belum ada hari di jadwal. Klik "Tambah Hari" untuk mulai!</p>
            </div>
        `;
        return;
    }

    activeDays.forEach(day => {
        const items = State.jadwalHari(day);
        const dayCard = document.createElement('div');
        dayCard.className = 'day-schedule-card';

        const rows = items.length === 0
            ? `<tr><td colspan="4" class="schedule-empty">Belum ada jadwal di hari ini.</td></tr>`
            : items.map((item, idx) => `
                <tr>
                    <td><strong>${escapeHtml(item.time)}</strong></td>
                    <td>${escapeHtml(item.subject)}</td>
                    <td><span class="room-badge">${escapeHtml(item.room)}</span></td>
                    <td>
                        <div class="schedule-actions-cell">
                            <button type="button" class="btn-act btn-edit" data-aksi="edit-jadwal" data-hari="${day}" data-idx="${idx}" title="Edit"><i class="fa-solid fa-pen"></i></button>
                            <button type="button" class="btn-act btn-del" data-aksi="hapus-jadwal" data-hari="${day}" data-idx="${idx}" title="Hapus"><i class="fa-solid fa-trash"></i></button>
                        </div>
                    </td>
                </tr>
            `).join('');

        dayCard.innerHTML = `
            <div class="day-header">
                <span><i class="fa-solid fa-calendar-day"></i> ${day}</span>
                <div class="day-actions">
                    <button type="button" class="btn-day-action" data-aksi="tambah-jadwal" data-hari="${day}"><i class="fa-solid fa-plus"></i> Jadwal</button>
                    <button type="button" class="btn-day-action" data-aksi="hapus-hari" data-hari="${day}" title="Hapus hari ini"><i class="fa-solid fa-trash"></i></button>
                </div>
            </div>
            <table class="schedule-table">
                <thead>
                    <tr>
                        <th>Waktu</th>
                        <th>Mata Kuliah</th>
                        <th>Ruang</th>
                        <th style="text-align: right;">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows}
                </tbody>
            </table>
        `;
        el.scheduleContainer.appendChild(dayCard);
    });
}

// ---------- Form tambah / edit jadwal ----------
const kolomJadwal = [el.editSchedStartTime, el.editSchedEndTime, el.editSchedSubject, el.editSchedRoom];

function tampilkanErrorJadwal(msg) {
    if (!el.schedError) return;
    el.schedError.textContent = msg;
    el.schedError.classList.add('show');
}

export function sembunyikanErrorJadwal() {
    if (el.schedError) el.schedError.classList.remove('show');
    kolomJadwal.forEach(k => { if (k) k.classList.remove('input-error'); });
}

export const daftarKolomJadwal = kolomJadwal;

export function bukaFormTambahJadwal(day) {
    sembunyikanErrorJadwal();
    el.editSchedDay.value = day;
    el.editSchedIndex.value = ''; // kosong = mode tambah
    el.editSchedStartTime.value = '';
    el.editSchedEndTime.value = '';
    el.editSchedSubject.value = '';
    el.editSchedRoom.value = '';
    el.scheduleModalTitle.textContent = 'Tambah Jadwal - ' + day;
    el.schedSubmitBtn.textContent = 'Tambah Jadwal';
    UiPustaka.bukaModal('editScheduleModal');
}

export function bukaFormEditJadwal(day, index, item) {
    sembunyikanErrorJadwal();
    const times = item.time.split(' - ');
    el.editSchedDay.value = day;
    el.editSchedIndex.value = index;
    el.editSchedStartTime.value = times[0] ? times[0].trim() : '';
    el.editSchedEndTime.value = times[1] ? times[1].trim() : '';
    el.editSchedSubject.value = item.subject;
    el.editSchedRoom.value = item.room;
    el.scheduleModalTitle.textContent = 'Edit Jadwal Kuliah - ' + day;
    el.schedSubmitBtn.textContent = 'Simpan Jadwal';
    UiPustaka.bukaModal('editScheduleModal');
}

// Mengembalikan data form kalau valid; kalau tidak, tampilkan error merah dan kembalikan null
export function bacaFormJadwal() {
    const data = {
        day: el.editSchedDay.value,
        isAddMode: el.editSchedIndex.value === '',
        indexText: el.editSchedIndex.value,
        start: el.editSchedStartTime.value,
        end: el.editSchedEndTime.value,
        subject: el.editSchedSubject.value.trim(),
        room: el.editSchedRoom.value.trim()
    };

    sembunyikanErrorJadwal();
    if (!data.start || !data.end || !data.subject || !data.room) {
        if (!data.start) el.editSchedStartTime.classList.add('input-error');
        if (!data.end) el.editSchedEndTime.classList.add('input-error');
        if (!data.subject) el.editSchedSubject.classList.add('input-error');
        if (!data.room) el.editSchedRoom.classList.add('input-error');
        tampilkanErrorJadwal('Semua kolom jadwal wajib diisi!');
        return null;
    }
    if (data.end <= data.start) {
        el.editSchedStartTime.classList.add('input-error');
        el.editSchedEndTime.classList.add('input-error');
        tampilkanErrorJadwal('Jam selesai harus lebih besar dari jam mulai!');
        return null;
    }
    return data;
}

// ---------- Tambah hari ----------
export function bukaModalTambahHari(hariTersedia) {
    el.newDaySelect.innerHTML = hariTersedia
        .map(d => `<option value="${d}">${d}</option>`)
        .join('');
    UiPustaka.bukaModal('addDayModal');
}

export function bacaHariBaru() { return el.newDaySelect.value; }

export function tutupModal(id) { UiPustaka.tutupModal(id); }

// ==========================================
// VERSI
// ==========================================
export function tampilkanVersi(teks) {
    if (el.verJs) el.verJs.textContent = teks;
}
