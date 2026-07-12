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

## Phase 5: Affiliate Content Between Icons

**Goal**: Insert affiliate/referral content between icons on the canvas grid. Setiap konten afiliasi memiliki: link URL, image URL, judul, deskripsi singkat. Frekuensi bisa diatur (misal tiap 15 icon).

### Implementation

#### 5a. Data Model

Create `src/types/ad.ts`:
```ts
interface AdItem {
  id: string
  link: string
  image: string
  title: string
  description: string
}
```

#### 5b. Ad Pool

Create `src/data/ads.ts`:
```ts
export const adPool: AdItem[] = [
  // ...provided links,
]
```

#### 5c. Ad Placement Logic

New composable atau fungsi `computeAdInsertions(gridCells: Position[]): Map<string, AdItem>`:

- Configurable frequency: every N cells (e.g., every 15 cells → insert 1 ad)
- Algorithm: when iterating over grid positions in `visibleItems`, at index % interval === 0, swap cell for ad
- Deduplicate: same ad shouldn't appear twice in same viewport
- Ad gets same grid cell dimensions as icon but renders `<AdCard>` instead of `<Icon>`

#### 5d. AdCard.vue Component

Create `src/components/AdCard.vue`:

```
Template: div (same size as icon cell) → img + title + desc + link
- Image rounded-top, desc below
- External link, target=_blank
- Subtle border/background to distinguish from icon cells
```

#### 5e. Integration

In `IconCanvas.vue` `visibleItems` computed:
- After computing icon items, merge ads at appropriate positions
- Grid items array becomes heterogeneous: `{ type: 'icon', ... } | { type: 'ad', data: AdItem }`
- Template: `v-for` renders either `<Icon>` or `<AdCard>` based on `item.type`

#### 5f. Frequency Config

Store ad interval in a reactive config:
```ts
const AD_INTERVAL = 15 // every 15th cell = ad
```

Can later be dynamic (A/B test, or from backend).

### Verification

- Load canvas → every N cells shows an ad card
- Ad card has image, title, desc, link → click opens new tab
- Scroll → new ads appear (different from previous)
- Performa: ads cached same as icons

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
| `src/components/SearchHeader.vue` | 7 (placeholder) |
| `src/components/IconDetail.vue` | 9 (SVG render) |
| `src/components/home/NewHome.vue` | 8 (new — hero page) |
| `src/components/home/BackgroundGrid.vue` | 8 (new — background grid) |
| `src/components/home/HomeFooter.vue` | 8 (new — footer) |
| `src/components/home/HomeIcons.vue` | 8 (new — inline SVG icons) |
| `index.html` | 7 (title, favicon) |
| `public/` | 7 (favicon/logo assets) |
| `src/types/ad.ts` | 5 (new — tipe data affiliate) |
| `src/data/ads.ts` | 5 (new — daftar konten affiliate) |
| `src/components/AdCard.vue` | 5 (new — komponen card affiliate) |
| `src/components/IconCanvas.vue` | 5 (integrasi affiliate di grid) |
| `src/composables/useAffiliate.ts` | 5 (new — logika placement) |

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
