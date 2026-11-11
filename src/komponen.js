// src/komponen.js

/**
 * Komponen Reusable untuk Kartu Tugas
 * Menggunakan textContent untuk mengamankan teks dari injeksi HTML (XSS)
 */
export function KartuTugas(task) {
    const card = document.createElement('div');
    card.className = 'task-card-item';
    
    card.innerHTML = `
        <div class="task-header-row">
            <span class="task-title-text"></span>
            <div class="task-meta-tags">
                <span class="tag-badge tag-mk"></span>
                <span class="tag-badge tag-date"><i class="fa-solid fa-calendar"></i> <span></span></span>
                <span class="tag-badge"></span>
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

    // Mengisi teks menggunakan textContent agar aman dari injeksi HTML
    card.querySelector('.task-title-text').textContent = task.title;
    card.querySelector('.tag-mk').textContent = task.category;
    card.querySelector('.tag-date span').textContent = task.deadline;
    
    const prioBadge = card.querySelectorAll('.tag-badge')[2];
    prioBadge.className = `tag-badge tag-prio-${task.priority}`;
    prioBadge.textContent = task.priority;

    return card;
}

/**
 * Komponen Reusable untuk Pesan Kosong / Empty State
 */
export function PesanKosong(pesan) {
    const emptyDiv = document.createElement('div');
    emptyDiv.className = 'empty-state';
    
    const p = document.createElement('p');
    p.textContent = pesan;
    
    emptyDiv.appendChild(p);
    return emptyDiv;
}