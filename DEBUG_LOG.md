Debug Log: Sistem Manajemen Tugas Interaktif
1. c4396dd: fix: implement inline red border validation
Gejala: Saat form belum lengkap, muncul toast yang tampilannya mirip notifikasi sukses, jadi user bisa mengira tugas sudah tersimpan.
Akar masalah:
processTaskSubmission() memanggil showToast() untuk kasus input kosong.
Elemen .error-message merah sebenarnya sudah ada di HTML, tapi tidak pernah ditampilkan karena display: none tidak pernah diubah oleh JS.
Catatan cepat yang kosong juga memakai toast.
Solusi:
Menambah fungsi setError() dan validateTaskForm() yang menampilkan teks merah dan border merah per kolom, lalu memindahkan fokus ke kolom pertama yang kosong.
Error hilang otomatis saat user mulai mengisi.
Toast dipakai hanya untuk konfirmasi yang berhasil.
Menambah class .error-message.show dan .input-error di CSS.
File: script.js, style.css, index.html (div noteError).
Verifikasi: Submit dengan kolom kosong menampilkan error merah tanpa toast dan tanpa suara notifikasi.

2. 7b00dc1: fix: enable form submission via enter key
Gejala: Menekan Enter tidak menyimpan tugas. Anehnya, Enter bisa berjalan saat DevTools (F12) terbuka, tapi tidak saat ditutup.
Akar masalah (ada tiga):
Blok if (taskTitleInput && taskForm) {...} ada di luar DOMContentLoaded, sehingga variabelnya tidak dikenali dan menimbulkan ReferenceError di console.
Enter di dropdown dan kolom tanggal tidak otomatis men-submit form.
Cache browser: script.js lama tetap dipakai, dan opsi “Disable cache” di DevTools menutupi masalah ini selama F12 terbuka.
Solusi:
Menghapus blok yang nyasar itu.
Menambah novalidate pada form supaya popup validasi bawaan browser tidak bentrok dengan error merah buatan sendiri.
Memasang pendengar keydown Enter di level dokumen (fase capture) yang memanggil proses simpan.
Menambah cache-busting ?v=3 pada style.css, script.js, dan ui-pustaka.js di index.html.
File: script.js, index.html.
Verifikasi: Enter menyimpan tugas dengan F12 tertutup, setelah hard refresh.
Catatan: Setiap kali file CSS/JS diubah, nomor versi di ?v= perlu dinaikkan.

3. bfb9123: feat: add schedule management & filters
Gejala: Jadwal hanya bisa diedit. Belum ada hapus jadwal, tambah jadwal, atau tambah hari (Sabtu/Minggu). Daftar tugas juga belum bisa difilter menurut prioritas.
Akar masalah: Data jadwal berupa objek tetap Senin-Jumat dan form modal hanya mendukung mode edit.
Solusi:
Menambah DAY_ORDER agar hari selalu terurut. Tombol “Tambah Hari” hanya menawarkan hari yang belum ada dan dinonaktifkan kalau semua hari sudah terisi.
Modal jadwal dipakai ganda untuk tambah dan edit (editSchedIndex kosong berarti mode tambah). Jadwal otomatis diurutkan menurut jam mulai.
Validasi di dalam modal: kolom kosong, atau jam selesai ≤ jam mulai, menampilkan error merah.
Menambah dropdown filterPriority yang bisa dikombinasikan dengan filter mata kuliah dan status. .filter-section diberi flex-wrap agar tiga dropdown rapi di layar sempit.
Teks daftar kosong dibedakan: “belum ada tugas” vs “tidak sesuai filter”.
File: index.html, style.css, script.js.
Verifikasi: Tambah, edit, dan hapus jadwal berjalan. Sabtu/Minggu bisa ditambahkan. Filter prioritas menyaring daftar.

4. bb69250: feat: profile, sound, accessibility & popup
Gejala / kebutuhan: Tombol sound menempel di header, belum ada halaman profil, belum ada pilihan font dan dark mode, dan penghapusan langsung terjadi tanpa konfirmasi.
Akar masalah / tantangan:
Banyak warna di CSS ditulis langsung (hard-coded), sehingga dark mode tidak cukup hanya dengan mengganti variabel.
Modal Bootstrap dibuka manual lewat UiPustaka, jadi popup konfirmasi harus memakai mekanisme yang sama.
Setelah update ini, Enter sempat terasa tidak jalan lagi. Penyebab yang paling mungkin adalah cache script.js lama (gejalanya sama dengan bug no. 2).
Solusi:
Tab Profil dengan form edit profil (nama, kampus, avatar). Sound dipindah menjadi saklar di halaman Profil.
Ukuran font diatur lewat html[data-font] karena seluruh CSS memakai satuan rem.
Dark mode lewat data-theme="dark" dan data-bs-theme="dark", ditambah override untuk warna yang hard-coded.
Pengaturan disimpan di localStorage agar tidak reset saat refresh.
Fungsi confirmDialog() (popup Ya/Tidak) menggantikan penghapusan langsung untuk tugas, catatan, jadwal, dan hari. Fokus awal di tombol “Tidak”, dan Esc atau klik area gelap membatalkan.
Pendengar Enter dibuat generik untuk semua form.
Menambah penanda versi (HTML v5 · script v5) di halaman Profil untuk mendeteksi cache lama tanpa membuka F12.
Versi cache-busting dinaikkan ke ?v=5.
File: index.html, style.css, script.js.
Verifikasi: Semua pengaturan tersimpan setelah refresh. Konfirmasi muncul sebelum setiap penghapusan. Enter berjalan di semua form setelah hard refresh.