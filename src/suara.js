// suara.js - memutar suara klik dan notifikasi.
// Membaca status suara dari state.js, tidak menyimpan status sendiri.
import { suaraAktif } from './state.js';

const clickSound = document.getElementById('clickSound');
const notificationSound = document.getElementById('notificationSound');

export function mainkanKlik() {
    if (!suaraAktif()) return;
    if (clickSound) {
        clickSound.currentTime = 0;
        clickSound.volume = 0.4;
        clickSound.play().catch(err => console.log("Audio play blocked", err));
    }
}

export function mainkanNotifikasi() {
    if (!suaraAktif()) return;
    if (notificationSound) {
        notificationSound.currentTime = 0;
        notificationSound.volume = 0.5;
        notificationSound.play().catch(err => console.log("Audio play blocked", err));
    }
}
