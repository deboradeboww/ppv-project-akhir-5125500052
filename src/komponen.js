// src/komponen.js - komponen reusable. Semua teks pengguna masuk lewat textContent
// (tanpa innerHTML), sehingga judul seperti <b>tebal</b> tampil sebagai teks biasa.

function buat(tag, kelas, teks) {
    const e = document.createElement(tag);
    if (kelas) e.className = kelas;
    if (teks !== undefined) e.textContent = teks;
    return e;
}

function tombolAksi(aksi, id, kelas, ikon, label) {
    const b = buat('button', `btn-act ${kelas}`);
    b.type = 'button';
    b.dataset.aksi = aksi;
    b.dataset.id = id;
    b.append(buat('i', ikon), ` ${label}`);
    return b;
}

const STATUS_TUGAS = ['Belum Selesai', 'Sedang Dikerjakan', 'Selesai'];

/**
 * KartuTugas(task) -> HTMLElement
 * task: { id, title, category, deadline, priority, status }
 * Aksi ditandai lewat data-aksi ('ubah-status' | 'edit-tugas' | 'hapus-tugas') + data-id;
 * penanganannya lewat delegasi event di main.js.
 */
export function KartuTugas(task) {
    const kartu = buat('div', 'task-card-item');

    // Baris atas: judul + label
    const header = buat('div', 'task-header-row');
    const judul = buat('span', 'task-title-text', task.title);

    const meta = buat('div', 'task-meta-tags');
    const tagMk = buat('span', 'tag-badge tag-mk', task.category);
    const tagTgl = buat('span', 'tag-badge tag-date');
    tagTgl.append(buat('i', 'fa-solid fa-calendar'), ` ${task.deadline}`);
    // Nilai prioritas hanya dipakai sebagai nama kelas CSS: buang karakter selain huruf/angka/_/-
    const kelasPrio = String(task.priority).replace(/[^\w-]/g, '');
    const tagPrio = buat('span', `tag-badge tag-prio-${kelasPrio}`, task.priority);
    meta.append(tagMk, tagTgl, tagPrio);
    header.append(judul, meta);

    // Baris bawah: ubah status, edit, hapus
    const footer = buat('div', 'task-footer-row');
    footer.style.cssText = 'display: flex; justify-content: flex-end; align-items: center; gap: 8px; flex-wrap: wrap; border-top: 1px dashed var(--input-border); padding-top: 8px;';

    const pilih = buat('select', 'form-select form-select-sm');
    pilih.style.cssText = 'font-size: 0.75rem; padding: 4px 8px; border-radius: 8px; width: auto;';
    pilih.dataset.aksi = 'ubah-status';
    pilih.dataset.id = task.id;
    STATUS_TUGAS.forEach((s) => {
        const opsi = buat('option', '', s);
        opsi.value = s;
        opsi.selected = task.status === s;
        pilih.append(opsi);
    });

    footer.append(
        pilih,
        tombolAksi('edit-tugas', task.id, 'btn-edit', 'fa-solid fa-pen', 'Edit'),
        tombolAksi('hapus-tugas', task.id, 'btn-del', 'fa-solid fa-trash', 'Hapus')
    );

    kartu.append(header, footer);
    return kartu;
}

/**
 * PesanKosong(pesan, { gambar, alt }?) -> HTMLElement
 * Keadaan kosong (.empty-state). Gambar bersifat opsional.
 */
export function PesanKosong(pesan, { gambar, alt = '' } = {}) {
    const kotak = buat('div', 'empty-state');
    if (gambar) {
        const img = buat('img', 'empty-img');
        img.src = gambar;
        img.alt = alt;
        img.width = 70;
        kotak.append(img);
    }
    kotak.append(buat('p', '', pesan));
    return kotak;
}