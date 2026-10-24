// ==========================================
// ui-pustaka.js - Pembungkus Pustaka UI (Direct Force Open)
// ==========================================

const UiPustaka = {
    bukaModal(modalId) {
        const modalElement = document.getElementById(modalId);
        if (modalElement) {
            // Memaksa modal tampil langsung di layar tanpa syarat ribet
            modalElement.style.display = 'block';
            modalElement.style.zIndex = '99999';
            modalElement.classList.add('show');
            document.body.classList.add('modal-open');
            
            // Membuat backdrop gelap manual
            if (!document.querySelector('.modal-backdrop')) {
                const backdrop = document.createElement('div');
                backdrop.className = 'modal-backdrop fade show';
                document.body.appendChild(backdrop);
            }
        }
    },

    tutupModal(modalId) {
        const modalElement = document.getElementById(modalId);
        if (modalElement) {
            modalElement.style.display = 'none';
            modalElement.classList.remove('show');
            document.body.classList.remove('modal-open');
            
            // Menghapus backdrop gelap
            const backdrop = document.querySelector('.modal-backdrop');
            if (backdrop) backdrop.remove();
        }
    }
};