document.addEventListener('DOMContentLoaded', () => {
    let taskListArray = [];
    let notesListArray = [];
    let selectedNoteColor = 'kuning';
    let isSoundEnabled = true;

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

    // Toggle Sound Button Handler
    const soundToggleBtn = document.getElementById('soundToggleBtn');
    const soundIcon = document.getElementById('soundIcon');
    const soundText = document.getElementById('soundText');

    if (soundToggleBtn) {
        soundToggleBtn.addEventListener('click', () => {
            isSoundEnabled = !isSoundEnabled;
            if (isSoundEnabled) {
                soundIcon.className = 'fa-solid fa-volume-high';
                soundText.textContent = 'Sound On';
                soundToggleBtn.style.background = 'rgba(255, 255, 255, 0.25)';
                playClickSound();
            } else {
                soundIcon.className = 'fa-solid fa-volume-xmark';
                soundText.textContent = 'Sound Off';
                soundToggleBtn.style.background = 'rgba(0, 0, 0, 0.2)';
            }
        });
    }

    // Navigasi Halaman (Bottom Navigation)
    const navInputBtn = document.getElementById('navInput');
    const navListBtn = document.getElementById('navList');
    const navNotesBtn = document.getElementById('navNotes');
    const navScheduleBtn = document.getElementById('navSchedule');

    const pageInput = document.getElementById('pageInput');
    const pageList = document.getElementById('pageList');
    const pageNotes = document.getElementById('pageNotes');
    const pageSchedule = document.getElementById('pageSchedule');

    const navItems = [
        { btn: navInputBtn, page: pageInput },
        { btn: navListBtn, page: pageList },
        { btn: navNotesBtn, page: pageNotes },
        { btn: navScheduleBtn, page: pageSchedule }
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

    // Toast Notification Handler
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

    // Task Management Logic
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

        const filtered = taskListArray.filter(t => {
            const matchCat = (catFilter === 'Semua' || t.category === catFilter);
            const matchStat = (statFilter === 'Semua' || t.status === statFilter);
            return matchCat && matchStat;
        });

        if (filtered.length === 0) {
            taskListContainer.innerHTML = `
                <div class="empty-state">
                    <img src="assets/empty-task.png" alt="Ilustrasi Tugas Kosong" class="empty-img" width="70">
                    <p>Tidak ada tugas yang sesuai dengan filter.</p>
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

    function escapeHtml(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
        );
    }

    function processTaskSubmission() {
        const title = taskTitleInput.value.trim();
        const category = taskCategoryInput.value;
        const deadline = taskDeadlineInput.value;
        const priority = taskPriorityInput.value;
        const status = taskStatusInput.value;

        if (!title || !category || !deadline) {
            showToast("Harap isi semua data tugas dengan lengkap!");
            return;
        }

        const newTask = {
            id: 't_' + Date.now(),
            title,
            category,
            deadline,
            priority,
            status
        };

        taskListArray.push(newTask);
        taskForm.reset();
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

    if (filterCategory) filterCategory.addEventListener('change', renderTasks);
    if (filterStatus) filterStatus.addEventListener('change', renderTasks);

    window.changeTaskStatus = function(id, newStatus) {
        // playClickSound dihapus agar tidak dobel dengan suara toast
        taskListArray = taskListArray.map(t => t.id === id ? { ...t, status: newStatus } : t);
        renderTasks();
        showToast("Status tugas berhasil diperbarui!");
    };

    window.deleteTask = function(id) {
        // playClickSound dihapus agar tidak dobel dengan suara toast
        taskListArray = taskListArray.filter(t => t.id !== id);
        renderTasks();
        showToast("Tugas berhasil dihapus.");
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

    // Tombol Tutup / Close Modal
    document.querySelectorAll('[data-bs-dismiss="modal"], .btn-close').forEach(btn => {
        btn.addEventListener('click', () => {
            playClickSound();
            UiPustaka.tutupModal('editModal');
            UiPustaka.tutupModal('editScheduleModal');
        });
    });

    // Sticky Notes Logic
    const noteInputText = document.getElementById('noteInputText');
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

    function addNoteAction() {
        const text = noteInputText.value.trim();
        if (!text) {
            showToast("Tulis catatan terlebih dahulu!");
            return;
        }
        const newNote = {
            id: 'n_' + Date.now(),
            text,
            color: selectedNoteColor,
            isPinned: false
        };
        notesListArray.push(newNote);
        noteInputText.value = '';
        renderNotes();
        showToast("Catatan cepat berhasil ditambahkan!");
    }

    if (addNoteBtn) addNoteBtn.addEventListener('click', addNoteAction);

    window.deleteNote = function(id) {
        notesListArray = notesListArray.filter(n => n.id !== id);
        renderNotes();
        showToast("Catatan berhasil dihapus.");
    };

    window.togglePinNote = function(id) {
        playClickSound();
        notesListArray = notesListArray.map(n => n.id === id ? { ...n, isPinned: !n.isPinned } : n);
        renderNotes();
    };

    // ==========================================
    // JADWAL KULIAH RENDER & EDIT LOGIC
    // ==========================================
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

    function renderSchedule() {
        if (!scheduleContainer) return;
        scheduleContainer.innerHTML = '';

        for (const [day, items] of Object.entries(scheduleData)) {
            const dayCard = document.createElement('div');
            dayCard.className = 'day-schedule-card';

            let rows = items.map((item, idx) => `
                <tr>
                    <td><strong>${escapeHtml(item.time)}</strong></td>
                    <td>${escapeHtml(item.subject)}</td>
                    <td><span class="room-badge">${escapeHtml(item.room)}</span></td>
                    <td style="text-align: right;">
                        <button type="button" class="btn-act btn-edit" onclick="openEditSchedule('${day}', ${idx})"><i class="fa-solid fa-pen"></i></button>
                    </td>
                </tr>
            `).join('');

            dayCard.innerHTML = `
                <div class="day-header">
                    <span><i class="fa-solid fa-calendar-day"></i> ${day}</span>
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
        }
    }

    const editScheduleForm = document.getElementById('editScheduleForm');
    const editSchedDay = document.getElementById('editSchedDay');
    const editSchedIndex = document.getElementById('editSchedIndex');
    const editSchedStartTime = document.getElementById('editSchedStartTime');
    const editSchedEndTime = document.getElementById('editSchedEndTime');
    const editSchedSubject = document.getElementById('editSchedSubject');
    const editSchedRoom = document.getElementById('editSchedRoom');

    window.openEditSchedule = function(day, index) {
        playClickSound();
        const item = scheduleData[day][index];
        const times = item.time.split(' - ');
        editSchedDay.value = day;
        editSchedIndex.value = index;
        editSchedStartTime.value = times[0] ? times[0].trim() : '';
        editSchedEndTime.value = times[1] ? times[1].trim() : '';
        editSchedSubject.value = item.subject;
        editSchedRoom.value = item.room;

        UiPustaka.bukaModal('editScheduleModal');
    };

    if (editScheduleForm) {
        editScheduleForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const day = editSchedDay.value;
            const index = parseInt(editSchedIndex.value);
            const newTime = `${editSchedStartTime.value} - ${editSchedEndTime.value}`;
            const newSubject = editSchedSubject.value.trim();
            const newRoom = editSchedRoom.value.trim();

            if (scheduleData[day] && scheduleData[day][index]) {
                scheduleData[day][index] = {
                    time: newTime,
                    subject: newSubject,
                    room: newRoom
                };
                renderSchedule();
                UiPustaka.tutupModal('editScheduleModal');
                showToast("Jadwal kuliah berhasil diperbarui!");
            }
        });
    }

    renderTasks();
    renderNotes();
    renderSchedule();

    console.log("Sistem Manajemen Tugas Interaktif berhasil dimuat!");
});