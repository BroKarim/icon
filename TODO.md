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

---

## Dokumentasi: Pendekatan Collection Detail Page

### Masalah Awal
Halaman detail collection (`src/pages/collection/[id].vue`) sebelumnya menggunakan komponen `IconSet` (grid tradisional) untuk menampilkan icon. User ingin pendekatan infinite canvas seperti homepage, tapi dengan:
1. Hanya menampilkan icon dari collection tersebut
2. Info collection (nama, author, license) di tengah canvas
3. Search bar untuk filter icon dalam collection
4. Icon tidak boleh menimpa info collection

### Pendekatan 1: Buat Komponen Canvas Baru
Membuat komponen `CollectionCanvas.vue` terpisah dari `IconCanvas.vue`.

**Kelebihan:**
- Kontrol penuh atas perilaku khusus collection

**Kekurangan:**
- Duplikasi kode ~400 baris (physics, spiral, drag handling)
- Maintenance dua file dengan logic mirip
- Sulit sync perubahan UI/UX lintas halaman

### Pendekatan 2: Reuse IconCanvas + Slot (DIPILIH)
Modifikasi `IconCanvas.vue` dengan menambahkan slot `#center`, lalu gunakan komponen yang sama di halaman collection.

**Kelebihan:**
- Zero duplikasi kode — satu komponen untuk homepage DAN collection
- Perubahan physics/scroll/hover otomatis berlaku di semua halaman
- API bersih: parent tinggal isi `#center` slot dengan konten apapun
- Maintenance lebih mudah karena logic canvas di satu tempat

**Kekurangan:**
- Perlu tambahan filtering logic di parent (collection page) untuk search
- Slot center harus hati-hati agar tidak conflict dengan icon positioning

### Implementasi

**1. Center Slot di `IconCanvas.vue`**
```
IconCanvas.vue:380-396
```
- Slot `#center` ditempatkan di dalam canvas div (yang punya `transform: translate3d`)
- Posisi: `left: 50%; top: 50%; transform: translate(-50%, -50%)`
- Background: radial gradient yang match dengan canvas background (#f7f3ec) — memastikan icon tidak terlihat di belakang text

**2. Center Clear Zone**
```
IconCanvas.vue:35-37, 136-141
```
- Constants `CENTER_CLEAR_RADIUS_X = 220` dan `CENTER_CLEAR_RADIUS_Y = 140`
- Filter di `visibleItems` computed: skip icon yang berada di area center
- Ini mencegah icon muncul di area info collection tanpa perlu mengubah algoritma spiral

**3. Collection Page (`collection/[id].vue`)**
- Convert `collection.icons[]` ke format `SearchResult[]`
- Search filtering pakai `includes()` case-insensitive
- `SearchHeader` ditambahkan dengan icon scale/color controls
- `ShDrawer` + `IconDetail` untuk detail view (sama seperti homepage)

### Hasil
- Halaman collection menampilkan infinite canvas dengan icon dari collection tersebut
- Info collection (nama, author, license) muncul di tengah dengan background yang menyembunyikan icon
- User bisa search, zoom, dan ganti warna icon
- Klik icon membuka drawer detail (sama seperti homepage)
- Semua physics dan interaction otomatis sama dengan homepage
