document.addEventListener('DOMContentLoaded', () => {
    const APP_VERSION = 'v5';

    let taskListArray = [];
    let notesListArray = [];
    let selectedNoteColor = 'kuning';

    // ==========================================
    // PENGATURAN (profil, sound, font, dark mode)
    // Disimpan di localStorage supaya tidak reset saat refresh
    // ==========================================
    const STORAGE_KEY = 'smti_pengaturan';
    const ALLOWED_AVATARS = ['fa-user', 'fa-user-graduate', 'fa-cat', 'fa-ghost', 'fa-rocket', 'fa-heart'];
    const ALLOWED_FONTS = ['kecil', 'sedang', 'besar'];

    const defaultSettings = {
        sound: true,
        font: 'sedang',
        dark: false,
        profile: { name: 'Debo', campus: '', avatar: 'fa-user' }
    };

    function loadSettings() {
        try {
            const raw = JSON.parse(localStorage.getItem(STORAGE_KEY));
            if (raw && typeof raw === 'object') {
                const merged = {
                    ...defaultSettings,
                    ...raw,
                    profile: { ...defaultSettings.profile, ...(raw.profile || {}) }
                };
                if (!ALLOWED_FONTS.includes(merged.font)) merged.font = 'sedang';
                if (!ALLOWED_AVATARS.includes(merged.profile.avatar)) merged.profile.avatar = 'fa-user';
                return merged;
            }
        } catch (err) { /* abaikan, pakai bawaan */ }
        return JSON.parse(JSON.stringify(defaultSettings));
    }

    function saveSettings() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
        } catch (err) { /* penyimpanan tidak tersedia */ }
    }

    const settings = loadSettings();
    let isSoundEnabled = !!settings.sound;

    // Audio Elements
    const clickSound = document.getElementById('clickSound');
    const notificationSound = document.getElementById('notificationSound');

    function playClickSound() {
        if (!isSoundEnabled) return;
        if (clickSound) {
            clickSound.currentTime = 0;
            clickSound.volume = 0.4;
            clickSound.play().catch(err => console.log("Audio play blocked", err));
        }
    }

    function playNotificationSound() {
        if (!isSoundEnabled) return;
        if (notificationSound) {
            notificationSound.currentTime = 0;
            notificationSound.volume = 0.5;
            notificationSound.play().catch(err => console.log("Audio play blocked", err));
        }
    }

    // ==========================================
    // NAVIGASI HALAMAN (Bottom Navigation)
    // ==========================================
    const navInputBtn = document.getElementById('navInput');
    const navListBtn = document.getElementById('navList');
    const navNotesBtn = document.getElementById('navNotes');
    const navScheduleBtn = document.getElementById('navSchedule');
    const navProfileBtn = document.getElementById('navProfile');

    const pageInput = document.getElementById('pageInput');
    const pageList = document.getElementById('pageList');
    const pageNotes = document.getElementById('pageNotes');
    const pageSchedule = document.getElementById('pageSchedule');
    const pageProfile = document.getElementById('pageProfile');

    const navItems = [
        { btn: navInputBtn, page: pageInput },
        { btn: navListBtn, page: pageList },
        { btn: navNotesBtn, page: pageNotes },
        { btn: navScheduleBtn, page: pageSchedule },
        { btn: navProfileBtn, page: pageProfile }
    ];

    function switchPage(targetBtn, targetPage, playAudio = true) {
        if (playAudio) playClickSound();
        navItems.forEach(item => {
            if (item.btn) item.btn.classList.remove('active');
            if (item.page) item.page.classList.add('hidden');
        });
        if (targetBtn) targetBtn.classList.add('active');
        if (targetPage) targetPage.classList.remove('hidden');
    }

    navItems.forEach(item => {
        if (item.btn && item.page) {
            item.btn.addEventListener('click', () => {
                switchPage(item.btn, item.page, true);
            });
        }
    });

    // ==========================================
    // TOAST (hanya untuk konfirmasi BERHASIL)
    // ==========================================
    const toastNotification = document.getElementById('toastNotification');
    const toastMessage = document.getElementById('toastMessage');
    const closeToastBtn = document.getElementById('closeToastBtn');

    function showToast(msg) {
        if (toastMessage) toastMessage.textContent = msg;
        if (toastNotification) {
            toastNotification.classList.add('show');
            clearTimeout(window.toastTimer);
            window.toastTimer = setTimeout(() => {
                toastNotification.classList.remove('show');
            }, 3500);
        }
        playNotificationSound();
    }

    if (closeToastBtn) {
        closeToastBtn.addEventListener('click', () => {
            if (toastNotification) toastNotification.classList.remove('show');
        });
    }

    function escapeHtml(str) {
        return String(str).replace(/[&<>'"]/g, 
            tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
        );
    }

    // ==========================================
    // POP-UP KONFIRMASI (YA / TIDAK)
    // ==========================================
    const MODAL_IDS = ['editModal', 'editScheduleModal', 'addDayModal', 'confirmModal'];
    const confirmTitle = document.getElementById('confirmTitle');
    const confirmMessage = document.getElementById('confirmMessage');
    const confirmYesBtn = document.getElementById('confirmYesBtn');
    const confirmNoBtn = document.getElementById('confirmNoBtn');
    let confirmCallback = null;

    function closeAllModals() {
        confirmCallback = null;
        MODAL_IDS.forEach(id => UiPustaka.tutupModal(id));
    }

    // Contoh: confirmDialog({ title: 'Hapus Tugas', message: 'Yakin?' }, () => { ...dijalankan jika klik Ya... })
    function confirmDialog(options, onYes) {
        const opts = options || {};
        if (confirmTitle) confirmTitle.textContent = opts.title || 'Konfirmasi';
        if (confirmMessage) confirmMessage.textContent = opts.message || 'Yakin ingin melanjutkan?';
        if (confirmYesBtn) confirmYesBtn.textContent = opts.yesText || 'Ya, Hapus';
        if (confirmNoBtn) confirmNoBtn.textContent = opts.noText || 'Tidak';
        confirmCallback = onYes;
        playClickSound();
        UiPustaka.bukaModal('confirmModal');
        if (confirmNoBtn) confirmNoBtn.focus(); // fokus ke "Tidak" supaya aman dari salah tekan
    }

    if (confirmYesBtn) {
        confirmYesBtn.addEventListener('click', () => {
            const callback = confirmCallback;
            confirmCallback = null;
            UiPustaka.tutupModal('confirmModal');
            if (typeof callback === 'function') callback();
        });
    }

    if (confirmNoBtn) {
        confirmNoBtn.addEventListener('click', () => {
            playClickSound();
            confirmCallback = null;
            UiPustaka.tutupModal('confirmModal');
        });
    }

    // Tombol Tutup (X) di semua modal
    document.querySelectorAll('[data-bs-dismiss="modal"], .btn-close').forEach(btn => {
        btn.addEventListener('click', () => {
            playClickSound();
            closeAllModals();
        });
    });

    // Klik area gelap di luar kotak modal = tutup
    document.querySelectorAll('.modal').forEach(modalEl => {
        modalEl.addEventListener('mousedown', (e) => {
            if (e.target === modalEl) closeAllModals();
        });
    });

    // Tombol Esc = tutup modal yang sedang terbuka
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && document.querySelector('.modal.show')) closeAllModals();
    });

    // ==========================================
    // PENGATURAN: SOUND, FONT, DARK MODE
    // ==========================================
    const rootEl = document.documentElement;
    const soundSwitch = document.getElementById('soundSwitch');
    const darkSwitch = document.getElementById('darkSwitch');
    const fontBtns = document.querySelectorAll('.seg-btn[data-font]');

    function applyFont(size) {
        rootEl.setAttribute('data-font', size);
        fontBtns.forEach(b => b.classList.toggle('active', b.getAttribute('data-font') === size));
    }

    function applyTheme(isDark) {
        rootEl.setAttribute('data-theme', isDark ? 'dark' : 'light');
        rootEl.setAttribute('data-bs-theme', isDark ? 'dark' : 'light'); // supaya komponen Bootstrap ikut gelap
    }

    if (soundSwitch) {
        soundSwitch.checked = isSoundEnabled;
        soundSwitch.addEventListener('change', () => {
            isSoundEnabled = soundSwitch.checked;
            settings.sound = isSoundEnabled;
            saveSettings();
            playClickSound(); // hanya bunyi kalau sound baru dinyalakan
        });
    }

    if (darkSwitch) {
        darkSwitch.checked = !!settings.dark;
        darkSwitch.addEventListener('change', () => {
            settings.dark = darkSwitch.checked;
            applyTheme(settings.dark);
            saveSettings();
            playClickSound();
        });
    }

    fontBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const size = btn.getAttribute('data-font');
            if (!ALLOWED_FONTS.includes(size)) return;
            settings.font = size;
            applyFont(size);
            saveSettings();
            playClickSound();
        });
    });

    applyFont(settings.font);
    applyTheme(!!settings.dark);

    // ==========================================
    // PROFIL
    // ==========================================
    const headerName = document.getElementById('headerName');
    const headerAvatarIcon = document.getElementById('headerAvatarIcon');
    const summaryAvatarIcon = document.getElementById('summaryAvatarIcon');
    const summaryName = document.getElementById('summaryName');
    const summaryCampus = document.getElementById('summaryCampus');
    const profileForm = document.getElementById('profileForm');
    const profileNameInput = document.getElementById('profileName');
    const profileCampusInput = document.getElementById('profileCampus');
    const profileNameError = document.getElementById('profileNameError');
    const avatarBtns = document.querySelectorAll('.avatar-btn');
    let pendingAvatar = settings.profile.avatar;

    function highlightAvatar(icon) {
        avatarBtns.forEach(b => b.classList.toggle('active', b.getAttribute('data-icon') === icon));
    }

    function renderProfile() {
        const p = settings.profile;
        if (headerName) headerName.textContent = `Hai ${p.name}!`;
        if (headerAvatarIcon) headerAvatarIcon.className = `fa-solid ${p.avatar}`;
        if (summaryAvatarIcon) summaryAvatarIcon.className = `fa-solid ${p.avatar}`;
        if (summaryName) summaryName.textContent = p.name;
        if (summaryCampus) summaryCampus.textContent = p.campus || 'Kampus / program studi belum diisi';
        if (profileNameInput) profileNameInput.value = p.name;
        if (profileCampusInput) profileCampusInput.value = p.campus;
        pendingAvatar = p.avatar;
        highlightAvatar(pendingAvatar);
    }

    function setProfileNameError(isError) {
        if (profileNameError) profileNameError.classList.toggle('show', isError);
        if (profileNameInput) profileNameInput.classList.toggle('input-error', isError);
    }

    avatarBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const icon = btn.getAttribute('data-icon');
            if (!ALLOWED_AVATARS.includes(icon)) return;
            playClickSound();
            pendingAvatar = icon;
            highlightAvatar(icon);
        });
    });

    if (profileNameInput) {
        profileNameInput.addEventListener('input', () => setProfileNameError(false));
    }

    if (profileForm) {
        profileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = profileNameInput.value.trim();
            const campus = profileCampusInput.value.trim();

            // Jika nama kosong: error merah, TANPA toast sukses
            if (!name) {
                setProfileNameError(true);
                profileNameInput.focus();
                return;
            }

            setProfileNameError(false);
            settings.profile = { name, campus, avatar: pendingAvatar };
            saveSettings();
            renderProfile();
            showToast("Profil berhasil diperbarui!");
        });
    }

    renderProfile();

    // ==========================================
    // TUGAS (Task Management)
    // ==========================================
    const taskForm = document.getElementById('taskForm');
    const taskTitleInput = document.getElementById('taskTitle');
    const taskCategoryInput = document.getElementById('taskCategory');
    const taskDeadlineInput = document.getElementById('taskDeadline');
    const taskPriorityInput = document.getElementById('taskPriority');
    const taskStatusInput = document.getElementById('taskStatus');
    const taskListContainer = document.getElementById('taskList');
    const taskCountBadge = document.getElementById('taskCountBadge');
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    const filterCategory = document.getElementById('filterCategory');
    const filterStatus = document.getElementById('filterStatus');
    const filterPriority = document.getElementById('filterPriority');

    function updateProgress() {
        if (taskListArray.length === 0) {
            if (progressBar) progressBar.style.width = '0%';
            if (progressText) progressText.textContent = '0%';
            if (taskCountBadge) taskCountBadge.textContent = '0';
            return;
        }
        const completedCount = taskListArray.filter(t => t.status === 'Selesai').length;
        const percent = Math.round((completedCount / taskListArray.length) * 100);
        if (progressBar) progressBar.style.width = percent + '%';
        if (progressText) progressText.textContent = percent + '%';
        if (taskCountBadge) taskCountBadge.textContent = taskListArray.length;
    }

    function renderTasks() {
        if (!taskListContainer) return;
        taskListContainer.innerHTML = '';

        const catFilter = filterCategory ? filterCategory.value : 'Semua';
        const statFilter = filterStatus ? filterStatus.value : 'Semua';
        const prioFilter = filterPriority ? filterPriority.value : 'Semua';

        const filtered = taskListArray.filter(t => {
            const matchCat = (catFilter === 'Semua' || t.category === catFilter);
            const matchStat = (statFilter === 'Semua' || t.status === statFilter);
            const matchPrio = (prioFilter === 'Semua' || t.priority === prioFilter);
            return matchCat && matchStat && matchPrio;
        });

        if (filtered.length === 0) {
            const emptyText = taskListArray.length === 0
                ? 'Belum ada tugas tersimpan. Silakan isi lewat menu "Input"!'
                : 'Tidak ada tugas yang sesuai dengan filter.';
            taskListContainer.innerHTML = `
                <div class="empty-state">
                    <img src="assets/empty-task.png" alt="Ilustrasi Tugas Kosong" class="empty-img" width="70">
                    <p>${emptyText}</p>
                </div>
            `;
            updateProgress();
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
                    <select class="form-select form-select-sm" style="font-size: 0.75rem; padding: 4px 8px; border-radius: 8px; width: auto;" onchange="changeTaskStatus('${task.id}', this.value)">
                        <option value="Belum Selesai" ${task.status === 'Belum Selesai' ? 'selected' : ''}>Belum Selesai</option>
                        <option value="Sedang Dikerjakan" ${task.status === 'Sedang Dikerjakan' ? 'selected' : ''}>Sedang Dikerjakan</option>
                        <option value="Selesai" ${task.status === 'Selesai' ? 'selected' : ''}>Selesai</option>
                    </select>
                    <button type="button" class="btn-act btn-edit" onclick="openEditTaskModal('${task.id}')"><i class="fa-solid fa-pen"></i> Edit</button>
                    <button type="button" class="btn-act btn-del" onclick="deleteTask('${task.id}')"><i class="fa-solid fa-trash"></i> Hapus</button>
                </div>
            `;
            taskListContainer.appendChild(card);
        });
        updateProgress();
    }

    // ----- Validasi form tugas (pesan error merah) -----
    function setError(inputEl, errorId, isError) {
        const errEl = document.getElementById(errorId);
        if (errEl) errEl.classList.toggle('show', isError);
        if (inputEl) inputEl.classList.toggle('input-error', isError);
    }

    function validateTaskForm() {
        const titleEmpty = !taskTitleInput.value.trim();
        const categoryEmpty = !taskCategoryInput.value;
        const deadlineEmpty = !taskDeadlineInput.value;

        setError(taskTitleInput, 'titleError', titleEmpty);
        setError(taskCategoryInput, 'categoryError', categoryEmpty);
        setError(taskDeadlineInput, 'deadlineError', deadlineEmpty);

        // Fokus ke kolom pertama yang masih kosong
        if (titleEmpty) taskTitleInput.focus();
        else if (categoryEmpty) taskCategoryInput.focus();
        else if (deadlineEmpty) taskDeadlineInput.focus();

        return !(titleEmpty || categoryEmpty || deadlineEmpty);
    }

    function clearTaskErrors() {
        setError(taskTitleInput, 'titleError', false);
        setError(taskCategoryInput, 'categoryError', false);
        setError(taskDeadlineInput, 'deadlineError', false);
    }

    // Error hilang otomatis saat user mulai mengisi
    if (taskTitleInput) taskTitleInput.addEventListener('input', () => setError(taskTitleInput, 'titleError', false));
    if (taskCategoryInput) taskCategoryInput.addEventListener('change', () => setError(taskCategoryInput, 'categoryError', false));
    if (taskDeadlineInput) taskDeadlineInput.addEventListener('change', () => setError(taskDeadlineInput, 'deadlineError', false));

    function processTaskSubmission() {
        // Jika belum lengkap: tampilkan error merah, TANPA toast sukses
        if (!validateTaskForm()) return;

        const newTask = {
            id: 't_' + Date.now(),
            title: taskTitleInput.value.trim(),
            category: taskCategoryInput.value,
            deadline: taskDeadlineInput.value,
            priority: taskPriorityInput.value,
            status: taskStatusInput.value
        };

        taskListArray.push(newTask);
        taskForm.reset();
        clearTaskErrors();
        renderTasks();
        showToast("Yey! Tugas barumu berhasil ditambahkan!");

        // Pindah halaman otomatis tanpa memicu suara klik dobel (cukup suara toast)
        switchPage(navListBtn, pageList, false);
    }

    if (taskForm) {
        taskForm.addEventListener('submit', (e) => {
            e.preventDefault();
            processTaskSubmission();
        });
    }

    // ==========================================
    // TOMBOL ENTER UNTUK SEMUA FORM
    // Satu pendengar di level dokumen (fase capture), jadi tidak bergantung
    // pada kolom mana yang sedang fokus atau pada perilaku bawaan browser.
    // ==========================================
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

        if (form === taskForm) {
            processTaskSubmission();
        } else if (typeof form.requestSubmit === 'function') {
            form.requestSubmit();
        } else {
            form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
        }
    }, true);

    if (filterCategory) filterCategory.addEventListener('change', renderTasks);
    if (filterStatus) filterStatus.addEventListener('change', renderTasks);
    if (filterPriority) filterPriority.addEventListener('change', renderTasks);

    window.changeTaskStatus = function(id, newStatus) {
        taskListArray = taskListArray.map(t => t.id === id ? { ...t, status: newStatus } : t);
        renderTasks();
        showToast("Status tugas berhasil diperbarui!");
    };

    window.deleteTask = function(id) {
        const task = taskListArray.find(t => t.id === id);
        if (!task) return;
        confirmDialog({
            title: 'Hapus Tugas?',
            message: `Yakin mau menghapus tugas "${task.title}"?`
        }, () => {
            taskListArray = taskListArray.filter(t => t.id !== id);
            renderTasks();
            showToast("Tugas berhasil dihapus.");
        });
    };

    // Modal Edit Tugas Handlers
    const editModalForm = document.getElementById('editTaskForm');
    const editTaskId = document.getElementById('editTaskId');
    const editTaskTitle = document.getElementById('editTaskTitle');
    const editTaskCategory = document.getElementById('editTaskCategory');
    const editTaskDeadline = document.getElementById('editTaskDeadline');
    const editTaskPriority = document.getElementById('editTaskPriority');

    window.openEditTaskModal = function(id) {
        playClickSound();
        const task = taskListArray.find(t => String(t.id) === String(id));
        if (task) {
            editTaskId.value = task.id;
            editTaskTitle.value = task.title;
            editTaskCategory.value = task.category;
            editTaskDeadline.value = task.deadline;
            editTaskPriority.value = task.priority;
            UiPustaka.bukaModal('editModal');
        }
    };

    if (editModalForm) {
        editModalForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const id = editTaskId.value;
            taskListArray = taskListArray.map(t => {
                if (String(t.id) === String(id)) {
                    return {
                        ...t,
                        title: editTaskTitle.value.trim(),
                        category: editTaskCategory.value,
                        deadline: editTaskDeadline.value,
                        priority: editTaskPriority.value
                    };
                }
                return t;
            });
            renderTasks();
            UiPustaka.tutupModal('editModal');
            showToast("Tugas berhasil diperbarui!");
        });
    }

    // ==========================================
    // STICKY NOTES LOGIC
    // ==========================================
    const noteInputText = document.getElementById('noteInputText');
    const noteError = document.getElementById('noteError');
    const addNoteBtn = document.getElementById('addNoteBtn');
    const notesContainer = document.getElementById('notesContainer');
    const colorBtns = document.querySelectorAll('.color-btn');

    colorBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            playClickSound();
            colorBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedNoteColor = btn.getAttribute('data-color');
        });
    });

    function renderNotes() {
        if (!notesContainer) return;
        notesContainer.innerHTML = '';

        if (notesListArray.length === 0) {
            notesContainer.innerHTML = `
                <div class="empty-state">
                    <img src="assets/empty-note.png" alt="Ilustrasi Catatan Kosong" class="empty-img" width="70">
                    <p>Belum ada catatan cepat tersimpan.</p>
                </div>
            `;
            return;
        }

        const sortedNotes = [...notesListArray].sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));

        sortedNotes.forEach(note => {
            const card = document.createElement('div');
            card.className = `note-card-item note-${note.color} ${note.isPinned ? 'is-pinned' : ''}`;
            card.innerHTML = `
                <span class="note-text">${escapeHtml(note.text)}</span>
                <div style="display: flex; gap: 4px; align-items: center;">
                    <button type="button" class="btn-pin ${note.isPinned ? 'active' : ''}" onclick="togglePinNote('${note.id}')" title="Sematkan"><i class="fa-solid fa-thumbtack"></i></button>
                    <button type="button" class="btn-act btn-del" onclick="deleteNote('${note.id}')" title="Hapus"><i class="fa-solid fa-trash"></i></button>
                </div>
            `;
            notesContainer.appendChild(card);
        });
    }

    function setNoteError(isError) {
        if (noteError) noteError.classList.toggle('show', isError);
        if (noteInputText) noteInputText.classList.toggle('input-error', isError);
    }

    function addNoteAction() {
        const text = noteInputText.value.trim();

        // Jika kosong: tampilkan error merah, TANPA toast sukses
        if (!text) {
            setNoteError(true);
            noteInputText.focus();
            return;
        }

        setNoteError(false);
        notesListArray.push({
            id: 'n_' + Date.now(),
            text,
            color: selectedNoteColor,
            isPinned: false
        });
        noteInputText.value = '';
        renderNotes();
        showToast("Catatan cepat berhasil ditambahkan!");
    }

    if (addNoteBtn) addNoteBtn.addEventListener('click', addNoteAction);

    if (noteInputText) {
        // Error hilang otomatis saat user mulai mengetik
        noteInputText.addEventListener('input', () => setNoteError(false));

        // Tekan Enter untuk menambah catatan
        noteInputText.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                addNoteAction();
            }
        });
    }

    window.deleteNote = function(id) {
        const note = notesListArray.find(n => n.id === id);
        if (!note) return;
        const preview = note.text.length > 40 ? note.text.slice(0, 40) + '...' : note.text;
        confirmDialog({
            title: 'Hapus Catatan?',
            message: `Yakin mau menghapus catatan "${preview}"?`
        }, () => {
            notesListArray = notesListArray.filter(n => n.id !== id);
            renderNotes();
            showToast("Catatan berhasil dihapus.");
        });
    };

    window.togglePinNote = function(id) {
        playClickSound();
        notesListArray = notesListArray.map(n => n.id === id ? { ...n, isPinned: !n.isPinned } : n);
        renderNotes();
    };

    // ==========================================
    // JADWAL KULIAH: RENDER, TAMBAH, EDIT, HAPUS
    // ==========================================
    const DAY_ORDER = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

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

    const scheduleContainer = document.getElementById('scheduleContainer');
    const addDayBtn = document.getElementById('addDayBtn');

    function sortDayItems(day) {
        // Urutkan berdasarkan jam mulai (format HH:MM sudah rata, jadi aman dibandingkan sebagai teks)
        scheduleData[day].sort((a, b) => a.time.localeCompare(b.time));
    }

    function renderSchedule() {
        if (!scheduleContainer) return;
        scheduleContainer.innerHTML = '';

        const activeDays = DAY_ORDER.filter(d => scheduleData[d]);

        // Tombol "Tambah Hari" nonaktif kalau ke-7 hari sudah ada
        if (addDayBtn) addDayBtn.disabled = activeDays.length === DAY_ORDER.length;

        if (activeDays.length === 0) {
            scheduleContainer.innerHTML = `
                <div class="empty-state">
                    <p>Belum ada hari di jadwal. Klik "Tambah Hari" untuk mulai!</p>
                </div>
            `;
            return;
        }

        activeDays.forEach(day => {
            const items = scheduleData[day];
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
                                <button type="button" class="btn-act btn-edit" onclick="openEditSchedule('${day}', ${idx})" title="Edit"><i class="fa-solid fa-pen"></i></button>
                                <button type="button" class="btn-act btn-del" onclick="deleteScheduleItem('${day}', ${idx})" title="Hapus"><i class="fa-solid fa-trash"></i></button>
                            </div>
                        </td>
                    </tr>
                `).join('');

            dayCard.innerHTML = `
                <div class="day-header">
                    <span><i class="fa-solid fa-calendar-day"></i> ${day}</span>
                    <div class="day-actions">
                        <button type="button" class="btn-day-action" onclick="openAddSchedule('${day}')"><i class="fa-solid fa-plus"></i> Jadwal</button>
                        <button type="button" class="btn-day-action" onclick="deleteScheduleDay('${day}')" title="Hapus hari ini"><i class="fa-solid fa-trash"></i></button>
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
            scheduleContainer.appendChild(dayCard);
        });
    }

    // ---------- Form tambah / edit jadwal ----------
    const editScheduleForm = document.getElementById('editScheduleForm');
    const editSchedDay = document.getElementById('editSchedDay');
    const editSchedIndex = document.getElementById('editSchedIndex');
    const editSchedStartTime = document.getElementById('editSchedStartTime');
    const editSchedEndTime = document.getElementById('editSchedEndTime');
    const editSchedSubject = document.getElementById('editSchedSubject');
    const editSchedRoom = document.getElementById('editSchedRoom');
    const scheduleModalTitle = document.getElementById('scheduleModalTitle');
    const schedSubmitBtn = document.getElementById('schedSubmitBtn');
    const schedError = document.getElementById('schedError');

    function showSchedError(msg) {
        if (!schedError) return;
        schedError.textContent = msg;
        schedError.classList.add('show');
    }

    function hideSchedError() {
        if (schedError) schedError.classList.remove('show');
        [editSchedStartTime, editSchedEndTime, editSchedSubject, editSchedRoom].forEach(el => {
            if (el) el.classList.remove('input-error');
        });
    }

    [editSchedStartTime, editSchedEndTime, editSchedSubject, editSchedRoom].forEach(el => {
        if (el) el.addEventListener('input', hideSchedError);
    });

    // Tambah jadwal baru di hari tertentu
    window.openAddSchedule = function(day) {
        playClickSound();
        hideSchedError();
        editSchedDay.value = day;
        editSchedIndex.value = ''; // kosong = mode tambah
        editSchedStartTime.value = '';
        editSchedEndTime.value = '';
        editSchedSubject.value = '';
        editSchedRoom.value = '';
        scheduleModalTitle.textContent = 'Tambah Jadwal - ' + day;
        schedSubmitBtn.textContent = 'Tambah Jadwal';

        UiPustaka.bukaModal('editScheduleModal');
    };

    // Edit jadwal yang sudah ada
    window.openEditSchedule = function(day, index) {
        playClickSound();
        hideSchedError();
        const item = scheduleData[day][index];
        const times = item.time.split(' - ');
        editSchedDay.value = day;
        editSchedIndex.value = index;
        editSchedStartTime.value = times[0] ? times[0].trim() : '';
        editSchedEndTime.value = times[1] ? times[1].trim() : '';
        editSchedSubject.value = item.subject;
        editSchedRoom.value = item.room;
        scheduleModalTitle.textContent = 'Edit Jadwal Kuliah - ' + day;
        schedSubmitBtn.textContent = 'Simpan Jadwal';

        UiPustaka.bukaModal('editScheduleModal');
    };

    if (editScheduleForm) {
        editScheduleForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const day = editSchedDay.value;
            const isAddMode = editSchedIndex.value === '';
            const start = editSchedStartTime.value;
            const end = editSchedEndTime.value;
            const subject = editSchedSubject.value.trim();
            const room = editSchedRoom.value.trim();

            // Validasi: pesan error merah di dalam modal (bukan toast)
            hideSchedError();
            if (!start || !end || !subject || !room) {
                if (!start) editSchedStartTime.classList.add('input-error');
                if (!end) editSchedEndTime.classList.add('input-error');
                if (!subject) editSchedSubject.classList.add('input-error');
                if (!room) editSchedRoom.classList.add('input-error');
                showSchedError('Semua kolom jadwal wajib diisi!');
                return;
            }
            if (end <= start) {
                editSchedStartTime.classList.add('input-error');
                editSchedEndTime.classList.add('input-error');
                showSchedError('Jam selesai harus lebih besar dari jam mulai!');
                return;
            }

            if (!scheduleData[day]) return;
            const entry = { time: `${start} - ${end}`, subject, room };

            if (isAddMode) {
                scheduleData[day].push(entry);
            } else {
                const index = parseInt(editSchedIndex.value);
                if (!scheduleData[day][index]) return;
                scheduleData[day][index] = entry;
            }

            sortDayItems(day);
            renderSchedule();
            UiPustaka.tutupModal('editScheduleModal');
            showToast(isAddMode ? "Jadwal kuliah berhasil ditambahkan!" : "Jadwal kuliah berhasil diperbarui!");
        });
    }

    // ---------- Hapus jadwal / hapus hari (dengan konfirmasi Ya/Tidak) ----------
    window.deleteScheduleItem = function(day, index) {
        const item = scheduleData[day] && scheduleData[day][index];
        if (!item) return;
        confirmDialog({
            title: 'Hapus Jadwal?',
            message: `Yakin mau menghapus jadwal "${item.subject}" di hari ${day}?`
        }, () => {
            scheduleData[day].splice(index, 1);
            renderSchedule();
            showToast("Jadwal kuliah berhasil dihapus.");
        });
    };

    window.deleteScheduleDay = function(day) {
        if (!scheduleData[day]) return;
        const count = scheduleData[day].length;
        const message = count > 0
            ? `Yakin mau menghapus hari ${day} beserta ${count} jadwal di dalamnya?`
            : `Yakin mau menghapus hari ${day}?`;
        confirmDialog({
            title: 'Hapus Hari?',
            message
        }, () => {
            delete scheduleData[day];
            renderSchedule();
            showToast(`Hari ${day} berhasil dihapus.`);
        });
    };

    // ---------- Tambah hari (Sabtu, Minggu, dll.) ----------
    const addDayForm = document.getElementById('addDayForm');
    const newDaySelect = document.getElementById('newDaySelect');

    if (addDayBtn) {
        addDayBtn.addEventListener('click', () => {
            const missingDays = DAY_ORDER.filter(d => !scheduleData[d]);
            if (missingDays.length === 0) return;
            playClickSound();
            newDaySelect.innerHTML = missingDays
                .map(d => `<option value="${d}">${d}</option>`)
                .join('');
            UiPustaka.bukaModal('addDayModal');
        });
    }

    if (addDayForm) {
        addDayForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const day = newDaySelect.value;
            if (!day || scheduleData[day]) return;
            scheduleData[day] = [];
            renderSchedule();
            UiPustaka.tutupModal('addDayModal');
            showToast(`Hari ${day} berhasil ditambahkan!`);
        });
    }

    // ==========================================
    // INISIALISASI
    // ==========================================
    renderTasks();
    renderNotes();
    renderSchedule();

    const verJs = document.getElementById('verJs');
    if (verJs) verJs.textContent = 'script ' + APP_VERSION;

    console.log("Sistem Manajemen Tugas Interaktif " + APP_VERSION + " berhasil dimuat!");
});