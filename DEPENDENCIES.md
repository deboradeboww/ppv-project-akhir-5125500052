#DEPENDENCIES.md

## 1. Informasi Pustaka
* **Nama Pustaka**: Bootstrap
* **Versi**: v5.3.2 (Versi terkunci / locked version)
* **Sumber / CDN**: [jsDelivr](https://www.jsdelivr.com/package/npm/bootstrap) / [Official Bootstrap CDN](https://getbootstrap.com/)

## 2. Ukuran Transfer (Tab Network)
* **CSS (`bootstrap.min.css`)**: ~28.2 KB (Transfer) / ~225 KB (Uncompressed) *[Illustrative working assumption berdasarkan rata-rata ukuran CDN minified & gzipped]*
* **JS (`bootstrap.bundle.min.js`)**: ~65.4 KB (Transfer) / ~180 KB (Uncompressed) *[Illustrative working assumption berdasarkan rata-rata ukuran CDN minified & gzipped]*

## 3. Komponen UI yang Digunakan
* **Navbar / Bottom Navigation**: Menu navigasi utama aplikasi antar halaman.
* **Card**: Wadah kontainer untuk item tugas (Task Card), catatan (Sticky Notes), dan kartu jadwal kuliah.
* **Modal**: Komponen pop-up interaktif untuk form *Edit Tugas* dan *Edit Jadwal*.
* **Form Controls & Select**: Elemen masukan data, pemilihan kategori mata kuliah, dan pengaturan status tugas.
* **Progress Bar**: Indikator visual progres penyelesaian tugas.

## 4. Jawaban Empat Pertanyaan Sebelum Memasang Pustaka (Deck P09)
1. **Apakah pustaka ini benar-benar dibutuhkan atau dapat dibuat sendiri secara native?**
   * *Jawaban*: Dibutuhkan untuk mempercepat pengembangan tata letak responsif (Grid system) serta menyediakan komponen interaktif kompleks (seperti Modal dialog dan manajemen fader/backdrop) yang konsisten di berbagai jenis peramban tanpa harus menulis ulang kode dari awal.
2. **Bagaimana dampak ukuran file terhadap performa aplikasi?**
   * *Jawaban*: Dampak terhadap performa sangat minim karena pustaka dimuat secara eksternal melalui jaringan CDN global yang teroptimasi dengan kompresi cepat (Gzip/Brotli) serta sistem *browser caching*.
3. **Apakah dokumentasi, dukungan, dan pemeliharaan (maintenance) pustaka ini aktif?**
   * *Jawaban*: Sangat aktif. Bootstrap merupakan salah satu pustaka front-end paling populer di dunia dengan komunitas yang besar, dokumentasi resmi yang sangat lengkap, serta pemeliharaan keamanan yang rutin oleh pengembang aslinya.
4. **Apakah lisensi pustaka kompatibel dengan ketentuan proyek?**
   * *Jawaban*: Ya, Bootstrap menggunakan **Lisensi MIT** yang memperbolehkan penggunaan, modifikasi, dan distribusi secara bebas untuk kebutuhan akademik maupun komersial.