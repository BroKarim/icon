- [ ] Phase 1 - Samakan art direction dengan referensi `https://www.thiings.co/things`
  - [ ] Audit halaman eksperimen di `src/pages/test.vue` lalu jadikan halaman ini sebagai sandbox utama untuk UI baru.
  - [ ] Update `src/pages/test.vue` agar struktur atasnya menyerupai Thiings: sticky top search, pill actions/chips, spacing lebih lega, dan background warm/off-white.
  - [ ] Review `src/App.vue` dan `src/components/Navbar.vue`, lalu putuskan apakah navbar global lama perlu disembunyikan saat route `/test` agar tidak bentrok dengan top bar custom.
  - [ ] Tambahkan token visual khusus sandbox di file styling yang dipakai project sekarang (warna latar, radius pill, shadow, blur, spacing) supaya desain tidak hardcoded terus di `test.vue`.
  - [ ] Rapikan copywriting awal di `test.vue` agar senada dengan referensi: placeholder search, badge jumlah ikon, CTA ringan bila diperlukan.

- [ ] Phase 2 - Interaksi dasar ikon harus terasa seperti produk jadi
  - [ ] Pastikan klik/tap pada ikon di `src/components/IconCanvas.vue` selalu membuka `IconDetail` lewat event `select`, baik saat desktop hover maupun sentuhan mobile.
  - [ ] Review alur detail di `src/pages/test.vue`, `src/components/Modal.vue`, dan `src/components/IconDetail.vue` agar transisi buka/tutup terasa cepat dan tidak bentrok dengan drag canvas.
  - [ ] Tambahkan guard interaksi di `src/components/IconCanvas.vue` supaya tap kecil membuka detail, tetapi drag tetap dianggap navigasi canvas.
  - [ ] Uji perilaku sentuh untuk kasus: tap ikon, drag pelan, drag cepat, lalu tap lagi setelah scroll.

- [ ] Phase 3 - Hover state ikon
  - [ ] Update item renderer di `src/components/IconCanvas.vue` agar saat hover ikon membesar sekitar `scale(1.1)`.
  - [ ] Tambahkan easing, shadow, dan z-index sementara saat hover supaya ikon terasa “naik”, bukan sekadar membesar.
  - [ ] Cek collision visual antar ikon saat hover; bila perlu tambahkan spacing minimum atau active-layer agar ikon besar tidak terpotong.
  - [ ] Pastikan hover state graceful di touch device: tidak bergantung pada hover untuk fungsi utama.

- [ ] Phase 4 - Kontrol kustomisasi ala Phosphor Icons
  - [ ] Audit `src/components/IconDetail.vue` untuk melihat apa saja yang sudah ada dan apa yang perlu ditambah.
  - [ ] Tambahkan panel kontrol di `src/components/IconDetail.vue` untuk:
    - [ ] ukuran ikon
    - [ ] warna ikon
    - [ ] mungkin stroke/weight/variant bila didukung koleksi tertentu
    - [ ] copy/download snippet yang mengikuti state customisasi
  - [ ] Jika state kontrol dipakai lintas komponen, buat composable baru misalnya `src/composables/useIconCustomizer.ts`.
  - [ ] Pastikan preview utama di `IconDetail.vue` langsung reaktif saat user mengganti size/color.
  - [ ] Tambahkan fallback UX untuk koleksi yang tidak mendukung variant tertentu supaya panel tidak misleading.
  - [ ] Pertimbangkan menyimpan preferensi terakhir user di store/composable bila memang berguna.

- [ ] Phase 5 - Rapikan arsitektur halaman eksperimen jadi fondasi halaman final
  - [ ] Pecah top bar custom dari `src/pages/test.vue` menjadi komponen baru misalnya `src/components/ThingSearchHeader.vue` bila markup sudah mulai besar.
  - [ ] Pertimbangkan memecah card/chip/filter pill menjadi komponen reusable jika desain Thiings makin lengkap.
  - [ ] Tentukan apakah `test.vue` tetap jadi playground atau dipromosikan menjadi halaman utama setelah stabil.
  - [ ] Dokumentasikan dependency antar bagian: header, canvas, modal detail, search source.

- [ ] Phase 6 - Baru setelah itu haluskan infinite canvas scroll
  - [ ] Review ulang `src/components/IconCanvas.vue` untuk bottleneck: pointer handling, scroll sync, render count, dan virtualisasi.
  - [ ] Tambahkan smoothing pada pengalaman pan/scroll tanpa menghilangkan native feel.
  - [ ] Evaluasi apakah perlu inertial drag, hidden scrollbar, atau momentum tuning khusus desktop/mobile.
  - [ ] Review algoritma pengulangan ikon hasil search sedikit agar tetap penuh tetapi makin sulit terlihat repetitif.
  - [ ] Uji performa untuk 3 kondisi: hasil search sangat sedikit, sedang, dan ratusan.
  - [ ] Setelah stabil, baru polish kecil seperti fade edge, parallax halus, atau stagger reveal jika memang mendukung UX.

- [ ] Breakdown agent per task
  - [ ] Agent 1: fokus `test.vue` + layout visual Thiings.
  - [ ] Agent 2: fokus `IconCanvas.vue` interaksi klik/hover/drag.
  - [ ] Agent 3: fokus `IconDetail.vue` + customizer controls.
  - [ ] Agent 4: fokus final pass untuk smooth scrolling dan perf.

- [ ] Catatan referensi
  - [ ] Referensi visual utama: `https://www.thiings.co/things`
  - [ ] Referensi behavior canvas: `https://infinite-kanvas.com/`
  - [ ] Referensi detail controls: Phosphor Icons customizer behavior
