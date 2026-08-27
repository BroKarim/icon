# Task Plan: Rebrand → New Home → Affiliate System

## Overview

Fokus saat ini (setelah v2):

| Phase | Fitur | Status |
|-------|-------|--------|
| 7 | **Branding** — rename ke "Igloo" | Belum mulai |
| 8 | **New Home Page** — hero section clone shoogle.dev | Belum mulai |
| 9 | **IconDetail SVG Render** — tampilkan SVG icon di detail | Belum mulai |
| 10 | **Global Search di Collection** — search gak terbatas collection | Belum mulai |
| 5 | **Affiliate Content** — konten afiliasi di antara icon | Belum mulai |
| 11 | **Icon Bag** — kumpulkan icon, bulk copy/export | Selesai |

> **Catatan**: Phase 1–6 adalah fitur dari task plan sebelumnya (visual & theme overhaul). Sudah selesai/ditunda — tidak lagi relevan untuk dilanjutkan. Fokus saat ini adalah **branding, new home page, IconDetail, global search, affiliate**.

---

## Phase 7: Branding — Rebrand ke "Igloo"

**Goal**: Ganti semua referensi brand dari "Icons"/"Icones" → "Igloo". Website, PWA, meta tags, semuanya.

### Scope

| Area | File | Perubahan |
|------|------|-----------|
| PWA Manifest | `vite.config.ts` | `name: 'Igloo'`, `short_name: 'Igloo'` |
| PWA Manifest icons | `public/` | Update icon files kalau perlu |
| Page title | `src/pages/index.vue` | `useHead` → title "Igloo" |
| Page title | `src/pages/v1.vue` | Sama |
| Page title | `src/pages/collection/[id].vue` | Title template `... — Igloo` |
| OG meta | Semua file `useHead` | `og:title`, `og:description`, `og:url`, `twitter:*` |
| Canonical URL | Semua file `useHead` | `canonical` href |
| Favicon | `index.html` + `public/` | Update favicon link kalau ganti logo |
| Domain | Di mana aja | Update `icons.brokarim.com` → domain baru kalau ada |
| Search placeholder | `src/components/SearchHeader.vue` | Placeholder text (optional) |
| Hardcoded "Icons" | Seluruh codebase | Grep `Icons` / `icones` → ganti dengan `Igloo` |

### Implementation Steps

1. **Grep dulu** — cari semua kemunculan `Icons`, `icones`, `ICONS` di `src/` dan `public/`
2. **Update vite.config.ts** — nama PWA manifest
3. **Update tiap page** — `useHead` title, meta, link
4. **Update favicon/logo** kalau ada aset baru
5. **Verify** — build, cek title bar, PWA install name, OG preview

### Verification

- Tab browser: title "Igloo"
- PWA install prompt: name "Igloo"
- Share link OG preview: title "Igloo"
- Collection page: "Browse ... icons from the ... collection — Igloo"
- Build: `npm run build` sukses, typecheck OK

---

## Phase 8: New Home Page (Hero Section)

**Goal**: Ganti `SearchCenter.vue` dengan halaman hero baru yang di-clone dari [shoogle.dev](https://shoogle.dev/). Background hero hilang setelah user melakukan pencarian & masuk ke mode search.

### Desain

- **Before search**: Hero section full-screen (logo + search input + action buttons + background grid)
- **After search**: Background hero hilang, tampil `SearchHeader` + `IconCanvas` seperti sekarang
- **Transisi**: motion-v layout animation
- **Kembali ke home**: Click logo → reset ke hero section

### Keputusan

| Aspek | Pilihan |
|-------|---------|
| Search behavior | Search on Enter (bukan live search) |
| Desain | Clone dari shoogle.dev (Tailwind classes) |
| URL | Clean URL (tidak pakai query params dulu) |
| Transisi | motion-v layout animation (existing) |
| Kembali ke home | Click logo |
| File format | Semua file di `src/components/new-home/` dikonversi ke `.vue` (Vue SFC) |

### Implementation

#### 1. Convert new-home/ dari TSX ke Vue SFC

Buat folder `src/components/home/` dan konversi semua file:

| File TSX | File Vue |
|----------|----------|
| `new-home/page.tsx` | `home/NewHome.vue` |
| `new-home/background-grid.tsx` | `home/BackgroundGrid.vue` |
| `new-home/footer.tsx` | `home/HomeFooter.vue` |
| `new-home/icons.tsx` | `home/HomeIcons.vue` (atau inline SVG di komponen masing-masing) |

`NewHome.vue`:
- Search input dengan `@submit` emit on Enter
- Logo click → emit `@reset` ke parent (reset `hasSearched`)
- BackgroundGrid sebagai background
- Action buttons (Explore, Fresh, Bookmarks) → bisa diisi link nanti
- Footer dengan link Terms/Privacy + social

#### 2. Update `src/pages/index.vue`

- Import `NewHome` dari `./components/home/NewHome.vue`
- Ganti kondisi render:
  - `v-if="!hasSearched"` → `<NewHome @submit="onSearchSubmit" @reset="onHomeReset" />`
  - `v-else` → `SearchHeader` + `IconCanvas` (existing code)
- `onSearchSubmit`: set `hasSearched = true`, `runSearch()`
- `onHomeReset`: set `hasSearched = false`, clear `query`, `results`

#### 3. Background hilang pas search

- `NewHome` hanya di-render saat `!hasSearched`
- Begitu `hasSearched` jadi `true`, `NewHome` di-unmount (bareng animasi motion-v)
- Background (BackgroundGrid) ikut hilang karena satu komponen

### Verification

- First load: hero section dengan background grid, logo besar, search input
- Type + Enter: transisi ke search mode, background hilang
- Click logo: kembali ke hero section
- Action buttons visible di hero
- Footer visible di hero
- Clean URL sepanjang waktu

---

## Phase 9: IconDetail SVG Render

**Goal**: Di `IconDetail.vue`, bagian preview icon menampilkan SVG asli dari icon (bukan cuma `<iconify-icon>` element) agar bisa di-copy/di-download SVG mentahnya.

### Masalah Saat Ini

`IconDetail.vue:162-164`:
```vue
<IconBackground :icon-color="iconColor">
  <template #icon>
    <Icon :key="icon" outer-class="text-8xl" :icon="icon" />
  </template>
</IconBackground>
```

Hanya menampilkan icon via `<Icon>` component (render iconify-icon web component). User tidak bisa melihat/mengcopy SVG source.

### Solusi

- Tambahkan tab/view toggle di area preview: **"Preview"** (existing) dan **"SVG"** (raw SVG code)
- Fetch SVG source dari Iconify API atau dari cached icon data
- Tampilkan SVG dalam `<pre><code>` block atau viewer
- Tombol copy SVG source

### Implementation

| File | Change |
|------|--------|
| `src/components/IconDetail.vue` | Tambah state `activeView: 'preview' \| 'svg'` |
| Sama file | Tambah fungsi `async fetchSvgSource(icon: string): Promise<string>` |
| Sama file | Tambah tab/view toggle di area preview |
| Sama file | Tampilkan raw SVG di `<pre><code>` dengan syntax highlight |
| Sama file | Tombol "Copy SVG" |

### Data Flow

```
iconFull ("mdi:home")
  → fetch SVG dari Iconify API: https://api.iconify.design/mdi/home.svg
  → atau ambil dari cached collection data (collection.icons[iconName])
  → render sebagai raw SVG string
```

### Verification

- Buka IconDetail → tab Preview tetap default
- Switch ke tab SVG → lihat source code SVG
- Copy SVG → paste di editor, valid
- Download SVG → file valid

---

## Phase 10: Global Search di Collection Page

**Goal**: Sistem pencarian di `src/pages/collection/[id].vue` saat ini hanya filter icon dalam collection itu saja (`includes`). Ubah jadi global search yang bisa mencari seluruh icon dari semua collection (pakai `useGlobalSearch`).

### Masalah

```ts
// collection/[id].vue:81-88 — search terbatas dalam collection
const canvasResults = computed<SearchResult[]>(() => {
  if (!query.value.trim())
    return allIcons.value
  return allIcons.value.filter(item =>
    item.iconName.toLowerCase().includes(query.value.toLowerCase()),
  )
})
```

### Solusi

- Ganti `canvasResults` computed → pakai `useGlobalSearch()` seperti di `index.vue`
- Collection page tetap menampilkan semua icon collection saat `query` kosong (via `allIcons`)
- Saat user mengetik & submit, search dilakukan secara global (`runSearch`)
- Hasil search global ditampilkan di canvas (bukan terbatas collection)
- Tambahkan label/indicator "Searching all icons..." atau "Showing results from all collections"

### Implementation

| File | Change |
|------|--------|
| `src/pages/collection/[id].vue` | Import & gunakan `useGlobalSearch()` |
| Sama file | Ganti `canvasResults` logic: jika `query` kosong → `allIcons`, jika ada query → `results` dari global search |
| Sama file | Tambah `@submit` handler yang panggil `runSearch()` |
| Sama file | Update `@submit` di SearchHeader |

### Verification

- Buka collection page → lihat semua icon collection
- Search "home" → lihat hasil global dari semua collection
- Clear search → kembali ke icon collection
- Hasil search relevan (tidak terbatas satu collection)

---

## Phase 5: Affiliate Content Between Icons (Revised)

**Goal**: Insert affiliate/referral content between icons on the canvas grid. Setiap konten afiliasi memiliki: logo (URL), name, description, optional CTA. Frekuensi moderat (~1:40 ikon), tidak berdekatan, acak.

### Keputusan (Hasil Grilling)

| Aspek | Keputusan |
|-------|-----------|
| **Penempatan** | Inject ke grid cell `IconCanvas.vue`, ikut spiral layout |
| **Pendekatan** | Satu algoritma uniform: probability-based (3%) + cool-down ~25 cells |
| **Data storage** | `public/ads.json`, di-gitignore, di-fetch saat runtime |
| **Schema** | `{ id, name, description, logo (URL), link (URL), cta? }` |
| **Seleksi ad** | Random pick dari pool setiap kali cell menjadi ad |
| **Visual** | Logo centered + name di bawah, seperti tampilan ikon |
| **Hover** | Description + CTA di tooltip |
| **Klik** | Redirect langsung ke affiliate link, `target="_blank"` |
| **Tracking** | Tidak ada, link langsung |
| **Toggle** | Selalu tampil, tanpa opsi hide |
| **Density** | ~3% chance per cell, cool-down ~25 cells |
| **Fallback** | Silent — fetch gagal → tidak ada ads |

### Implementation

#### 5a. Data & Loading

- File: `public/ads.json` (ditambahkan ke `.gitignore`)
- Load: `fetch('/ads.json')` saat app mount, silent fallback (empty array) kalau gagal
- Tidak ada retry, tidak ada cache strategy khusus

```json
{
  "ads": [
    {
      "id": "coolvps",
      "name": "CoolVPS",
      "description": "Hosting murah mulai $5/bulan",
      "logo": "https://cdn.example.com/logo.svg",
      "link": "https://coolvps.com?ref=icones",
      "cta": "Coba Sekarang"
    }
  ]
}
```

#### 5b. AdCard.vue Component

Create `src/components/AdCard.vue`:

- Props: `ad` (AdItem object)
- Visual: Mirip ikon di grid — logo besar (centered), name di bawah
- Hover: Tooltip menampilkan description + CTA button
- Click: Event `@click` → `window.open(ad.link, '_blank')`
- Tidak ada tracking atau impression logging

#### 5c. Ad Placement (composable)

Create `src/composables/useAdPlacement.ts`:

- Fetch ads dari `/ads.json` saat composable di-mount
- Expose function `shouldPlaceAd(gridIndex: number, coolDownRemaining: Ref<number>): boolean`
  - Jika `coolDownRemaining > 0` → decrement, return false
  - Random chance (~3%) → jika true, set `coolDownRemaining = 25`, return true
  - Jika false, return false
- Expose function `pickRandomAd(ads: AdItem[]): AdItem | null`
  - Random pick dari pool
  - Jika pool kosong → return null

#### 5d. Integration di IconCanvas.vue

- Saat render visible items di spiral grid:
  - Panggil `shouldPlaceAd(gridIndex)` — jika true, render `<AdCard>` di cell itu
  - Jika false, render `<Icon>` seperti biasa
  - Grid item type: `{ type: 'icon', icon: string } | { type: 'ad', ad: AdItem }`
- Hover behavior: Ads pakai tooltip seperti ikon bedanya tooltip ads menampilkan description + CTA
- Drag/Pan behavior: Ad ikut scroll seperti ikon biasa (karena dalam grid cell yang sama)
- Search: Ads tidak masuk dalam search results — murni injected di layer rendering

#### 5e. Files Touched

| File | Perubahan |
|------|-----------|
| `public/ads.json` | NEW — data affiliate (gitignored) |
| `.gitignore` | Add `public/ads.json` |
| `src/composables/useAdPlacement.ts` | NEW — fetch & logic placement ads |
| `src/components/AdCard.vue` | NEW — komponen card affiliate |
| `src/components/IconCanvas.vue` | Inject ad cell di grid rendering |
| `src/types/ad.ts` | NEW — tipe data AdItem |

### Verification

- Load canvas → sesekali melihat ad card di antara ikon
- Ad card menampilkan logo + nama (sama besar dengan ikon)
- Hover → tooltip dengan description + CTA
- Klik → redirect ke affiliate link di tab baru
- Scroll → ad baru muncul secara acak (cool-down terpenuhi)
- Tidak ada error jika `ads.json` tidak ada atau gagal fetch
- Search → hasil pencarian normal tanpa ads
- Performa tidak terpengaruh (ads statis, fetch sekali)

---

## Phase 11: Icon Bag — Kumpulkan & Bulk Export

**Goal**: User bisa mengumpulkan icon ke dalam "bag" (local storage), lalu bulk copy atau download sekaligus. Termasuk tombol bag di SearchHeader dengan popover list, 2 Select untuk copy/download, dan list icon dengan remove per-item.

### Keputusan (Hasil Grilling)

| Aspek | Keputusan |
|-------|-----------|
| **Cara isi bag** | Hanya via `IconDetail` (tombol "add to bag"), tidak dari canvas |
| **Trigger di header** | 1 tombol bag di `SearchHeader` right section, buka `Popover` |
| **Badge** | Angka count `bags.length` di pojok tombol, hijau/merah |
| **Popover layout** | `w-[380px]`, `align="end"`, `z-[1000]` di atas header `z-[999]` |
| **2 Select di atas** | Kiri: Raw (SVG, Data URL, Download SVG ZIP). Kanan: Framework (Vue, JSX, TSX, Svelte, Astro, Component Names) |
| **List** | `h-[340px]` scrollable, row: `[index | checkerboard + Icon | name | × remove]` |
| **Copy logic** | Loop `getIconSnippet` → join `\n\n` → `navigator.clipboard.writeText` → toast |
| **Download** | Pakai `PackZip` (web worker) untuk SVG ZIP |
| **Warna** | Ikut `iconColor` dari `SearchHeader` prop |
| **Komponen** | `BagPopover.vue` terpisah dari `SearchHeader` |

### Files Changed

| File | Action | Detail |
|------|--------|--------|
| `src/components/ui/select/*` | **Create** (6 files) | Select, SelectTrigger, SelectContent, SelectItem, SelectValue, index.ts — wrapper reka-ui, pattern sama dengan Popover |
| `src/components/BagPopover.vue` | **Create** (~160 LOC) | Popover content: 2 Select + scrollable list + clear all + copied toast |
| `src/components/SearchHeader.vue` | **Modify** (+25 LOC) | Import Popover + BagPopover + bags. Tambah PopoverTrigger button + PopoverContent di right section |
| `src/components/IconDetail.vue` | **Modify** (+15 LOC) | Un-comment "add to bag" + "copy with color" buttons. Import `inBag, toggleBag, copyPreviewColor` dari store |

### Data Flow

```
pages/index.vue (iconColor)
  └─ SearchHeader.vue
       ├─ PopoverTrigger (bag button + badge)
       └─ PopoverContent (z-[1000])
            └─ BagPopover.vue (:icon-color)
                 ├─ store: bags, removeFromBag, clearBag
                 ├─ Select 1 → copyAll(type) / downloadZip('svg')
                 ├─ Select 2 → copyAll(type)
                 └─ List: v-for bags → checkerboard + <Icon> + remove

IconDetail.vue
  └─ toggleBag(icon) → bags.push/pop → reactive di BagPopover
```

### Verification

- Buka detail icon → klik "add to bag" → badge di header bertambah
- Klik tombol bag → popover muncul, icon terlihat di list
- Klik × remove → icon hilang dari list, badge update
- Select Raw → "Copy as SVG" → paste di editor, valid SVG gabungan
- Select Framework → "Copy Vue" → paste, valid Vue component code
- Download SVG (ZIP) → file terdownload
- "Clear all" → bag kosong, empty state tampil
- Build: `pnpm build` sukses tanpa error baru

---

## Future: Search Query in URL

**Goal**: Setelah fitur-fitur di atas stabil, tambahkan dukungan query params di URL (`/?q=icon`) agar:

- User bisa bookmark/share link hasil pencarian
- Ketika load page dengan `?q=icon`, auto-search
- Browser back/forward navigation works dengan search state

### Implementation (nanti)

| File | Change |
|------|--------|
| `src/composables/useGlobalSearch.ts` | Sync `query` dengan `useRoute().query.q` via `watch` |
| `src/pages/index.vue` | On mount, baca `route.query.q` → set `query` → auto `hasSearched = true` + `runSearch()` |
| `src/pages/v1.vue` | Sama |

### Verification (nanti)

- Buka `/?q=home` → langsung search "home"
- URL berubah jadi `/?q=...` saat user mengetik
- Share link → orang lain buka → hasil sama

---

## Files Touched

| File | Phases |
|------|--------|
| `vite.config.ts` | 7 (manifest name) |
| `src/pages/index.vue` | 7, 8 (title + hero section) |
| `src/pages/v1.vue` | 7 (title, meta) |
| `src/pages/collection/[id].vue` | 7, 10 (title + global search) |
| `src/components/SearchHeader.vue` | 7 (placeholder), 11 (bag button + popover) |
| `src/components/IconDetail.vue` | 9 (SVG render), 11 (add-to-bag button) |
| `src/components/BagPopover.vue` | 11 (new — popover content) |
| `src/components/ui/select/*` | 11 (new — Select UI components) |
| `src/components/home/NewHome.vue` | 8 (new — hero page) |
| `src/components/home/BackgroundGrid.vue` | 8 (new — background grid) |
| `src/components/home/HomeFooter.vue` | 8 (new — footer) |
| `src/components/home/HomeIcons.vue` | 8 (new — inline SVG icons) |
| `index.html` | 7 (title, favicon) |
| `public/` | 7 (favicon/logo assets) |
| `public/ads.json` | 5 (new — data affiliate, gitignored) |
| `.gitignore` | 5 (tambah public/ads.json) |
| `src/types/ad.ts` | 5 (new — tipe data AdItem) |
| `src/composables/useAdPlacement.ts` | 5 (new — fetch & logic placement) |
| `src/components/AdCard.vue` | 5 (new — komponen card affiliate) |
| `src/components/IconCanvas.vue` | 5 (inject ad di grid rendering) |

---

## Dependency Graph

```
Phase 7 (branding)          Phase 8 (new home)
        |                          |
        v                          v
Phase 10 (global search)    Phase 9 (IconDetail SVG)
        |                          |
        +-----------+--------------+
                    |
                    v
           Phase 5 (affiliate)
```

Phase 7 (branding) dan Phase 8 (new home) independen → bisa paralel.

Phase 10 (global search) perlu branding selesai dulu (nama page).
Phase 9 (IconDetail SVG) bisa dikerjakan kapan saja.

Phase 5 (affiliate) paling akhir — perlu canvas grid yang stabil.

---

## Version Tagging Workflow

### Why Tags

Setiap rilis besar disimpan sebagai **tag Git** — kode lama tetap bisa diakses kapan saja via `git checkout v1`, tanpa perlu branch abadi.

### Cara Bikin Tag untuk Rilis Baru

```bash
# 1. Sync main lokal
git checkout main
git pull origin main

# 2. Tag versi lama sebelum merge (simpan kode sebelum perubahan)
git tag -a v2 -m "Current before new features"
git push origin v2

# 3. Merge branch fitur ke main
git merge v2-build       # ganti dengan nama branch fitur
# selesaikan conflict kalau ada
git push origin main

# 4. Tag versi baru setelah merge
git tag -a v3 -m "New home page + branding"
git push origin v3

# 5. Lihat kode lama (detached HEAD)
git checkout v2

# Atau bikin branch dari tag kalau mau develop dari versi lama
git checkout -b hotfix-v2 v2
```

### Cara Akses Kode Lama/Liat Isi Tag

```bash
git tag                           # list semua tag
git show v2                       # lihat detail tag + message
git checkout v2                   # detached HEAD — lihat kode versi v2
git diff v2..v3                    # lihat perubahan antar versi
```

### Skema Versi ke Depan

| Tag | Isi |
|-----|-----|
| `v1` | Kode main sebelum merge branch v2-build |
| `v2` | Main setelah merge v2-build (fix search + race condition + chunk fix) |
| `v3` | Branding + new home page + fitur besar berikutnya |
| `v3.1` | Fitur/bug kecil berikutnya |
| `v4` | Rilis besar berikutnya (breaking changes) |

### Aturan

- **Jangan hapus tag yang sudah di-push** — tag adalah sejarah
- Setiap sebelum merge branch besar, tag dulu main yang existing
- Setelah merge, tag versi baru
- Untuk bug kecil: `git tag -a v3.1 -m "..."` langsung di main (tanpa branching)
- Untuk fitur besar: buat branch → merge → tag seperti workflow di atas
