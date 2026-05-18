# Catatan File-File src/

## `src/App.vue`
Komponen akar Vue. Render full-height layout dengan `RouterView` (halaman berdasarkan route) dan `Progress` bar. Menggunakan `useThemeColor` hook untuk dynamic theme color via CSS variable.

## `src/auto-imports.d.ts`
File deklarasi TypeScript **auto-generated** oleh `unplugin-auto-import`. Mendefinisikan tipe global untuk semua API Vue (`ref`, `computed`, dll) dan VueUse (`useStorage`, `useDark`, dll) agar bisa dipakai tanpa import manual.

## `src/components.d.ts`
File deklarasi TypeScript **auto-generated** oleh `unplugin-vue-components`. Mendaftarkan semua komponen Vue di folder `components/` sebagai `GlobalComponents`, sehingga bisa dipakai di template tanpa import.

## `src/env.ts`
Deteksi environment: `electron`, `vscode-webview`, atau web biasa. Menentukan `basePath` dan `staticPath` sesuai platform — penting karena routing dan asset path berbeda tiap platform.

## `src/main.ts`
Entry point aplikasi. Membuat Vue app, menginisialisasi router (hash history untuk Electron, web history untuk web), mendaftarkan PWA service worker (kecuali di Electron), lalu mount ke `#app`.

## `src/shims.d.ts`
TypeScript declarations global. Mendefinisikan tipe `Window` (untuk VSCode API), `vscode`, `__BUILD_TIME__`, `PWA`, dan module `*.vue` agar TypeScript tidak error.

## `src/sw.ts`
Service Worker (PWA). Menggunakan Workbox untuk precache assets, handle navigation offline, dan **mengintercept fetch ikon** dari API Iconify — menyajikan dari cache/precache alih-alih jaringan agar loading ikon cepat dan tetap berfungsi offline.

---


# File Tree

📦src
 ┣ 📂data
 ┃ ┣ 📜index.ts
 ┃ ┣ 📜search-alias.ts
 ┃ ┗ 📜variant-category.ts
 ┣ 📂hooks
 ┃ ┣ 📜color.ts
 ┃ ┣ 📜index.ts
 ┃ ┗ 📜search.ts
 ┣ 📂pages
 ┃ ┣ 📂collection
 ┃ ┃ ┗ 📜[id].vue
 ┃ ┣ 📜[...all].vue
 ┃ ┣ 📜index.vue
 ┃ ┗ 📜settings.vue
 ┣ 📂store
 ┃ ┣ 📜collection.ts
 ┃ ┣ 📜dark.ts
 ┃ ┣ 📜dialog.ts
 ┃ ┣ 📜index.ts
 ┃ ┣ 📜indexedDB.ts
 ┃ ┣ 📜localstorage.ts
 ┃ ┣ 📜packing.ts
 ┃ ┗ 📜progress.ts
 ┣ 📂utils
 ┃ ┣ 📂svg
 ┃ ┃ ┣ 📜base64.ts
 ┃ ┃ ┣ 📜bufferToString.ts
 ┃ ┃ ┣ 📜helpers.ts
 ┃ ┃ ┣ 📜htmlToJsx.ts
 ┃ ┃ ┣ 📜index.ts
 ┃ ┃ ┣ 📜loader.ts
 ┃ ┃ ┗ 📜prettier.ts
 ┃ ┣ 📂worker
 ┃ ┃ ┣ 📜index.ts
 ┃ ┃ ┗ 📜types.ts
 ┃ ┣ 📜case.ts
 ┃ ┣ 📜dataUrlToBlob.ts
 ┃ ┣ 📜electron.ts
 ┃ ┣ 📜icons.ts
 ┃ ┣ 📜pack-worker-client.ts
 ┃ ┣ 📜pack.ts
 ┃ ┣ 📜query.ts
 ┃ ┣ 📜sample.ts
 ┃ ┣ 📜shiki.ts
 ┃ ┗ 📜svgToPng.ts
 ┣ 📜App.vue
 ┣ 📜auto-imports.d.ts
 ┣ 📜components.d.ts
 ┣ 📜env.ts
 ┣ 📜html.d.ts
 ┣ 📜main.css
 ┣ 📜main.ts
 ┣ 📜shims.d.ts
 ┗ 📜sw.ts

 ## `src/components/`
Semua komponen Vue UI: **Navbar**, **SearchBar**, **Icon** (render ikon), **IconDetail** (preview + snippet), **Bag** (ikon tersimpan), **Drawer**, **Modal**, **ColorPicker**, **Progress**, dll. Subfolder `electron/` berisi komponen spesifik untuk tampilan native Electron (title bar, search bar).

## `src/data/`
Data layer: daftar koleksi ikon (`collections-info.json`), search/filter collections, alias pencarian, kategori variant ikon, serta fungsi **load/install koleksi** dari lokal (indexedDB) maupun remote fetch.

## `src/hooks/`
Vue composables reusable: **`useThemeColor`** (warna tema dinamis), **`useSearch`** (logika pencarian debounced).

## `src/pages/`
Halaman aplikasi via **file-based routing** (`vite-plugin-pages`):
- `index.vue` — home (daftar koleksi per kategori)
- `collection/[id].vue` — detail koleksi (grid ikon + search)
- `settings.vue` — pengaturan
- `[...all].vue` — catch-all 404

## `src/store/`
State management dengan **Vue reactive stores**: collection state, dark mode, dialog, indexedDB persistence, localStorage, packing state, progress indicator.

## `src/utils/`
Utility functions:
- **`svg/`** — transformasi SVG ke berbagai format (JSX, Vue, Svelte, Solid, Qwik, Astro, React Native, dll)
- **`worker/`** — web worker types
- **`icons.ts`** — kumpulan snippet icon (SVG, React, Vue, dll) + download handler
- **`pack.ts`** — logika pack/download koleksi ikon
- **`query.ts`** — parsing query params
- **`shiki.ts`** — syntax highlighting
- **`svgToPng.ts`** — konversi SVG ke PNG
- **`electron.ts`** — inisialisasi IPC Electron
- **`case.ts`** — helper string case

## `src/components/electron/`
Komponen spesifik platform **Electron**: `NavElectron` (title bar dengan mac controls + back button), `NavPlaceholder` (spacer), `SearchElectron` (search bar versi native).

## `scripts/` (luar src)
Letak `scripts/prepare.ts` — script build time yang baca `@iconify/json` (npm package) lalu generate `collections-info.json`, `collections-meta.json`, dan `public/collections/*.json`. Dijalankan via `postinstall` di package.json.


# Flow aplikasi 

### App.Vue
adal root UI tempat aplikasi dimulai.
- Bagian <template> : klo d react kita tulis `return()` untuk mulai menulis struktur HTML/JSX yang akan dirender ke layar.

nah klo d vue kita pakai `template`
sisanya sama aja dgn react

### Main UI
ok next saya ingin memahi dlu apliaksi ini, say sudh paahm bahwa @src/App.vue itu root ui pertama, dan halam pertam yg di render adalah `@src/pages/index.vue` nah seharunya di halam ini akan ada header, search bar dan daftar koleksi lalu di `@src/pages/settings.vue` itu halam setting dan di `@src/pages/[...all].vue`  itu cacth all 404

### Asal data di `@src/pages/index.vue`
Datanya dari file lokal `src/data/collections-info.json`. File ini adalah hasil generate script `scripts/prepare.ts` (jalan otomatis pas bun install), yg membaca `@iconify/jso`n (npm package) lalu mengekstrak metadata semua koleksi Iconify. Jadi pas build, metadata semua koleksi udah dibundel.

Lalu svg drimana asalnya??
Ikon tidak ada di library. Icon SVG di-fetch real-time dari API Iconify pas user butuh:
- Pas klik koleksi → downloadAndInstall(id) fetch https://api.iconify.design/{collectionId}.json
- Pas preview ikon → utils/icons.ts fetch https://api.iconify.design/{collectionId}/{iconName}.svg
- Service Worker (sw.ts) mencegat request ini dan nge-cache biar loading kilat & tetap bisa offline

Jadi collections-info.json itu cuma katalog/buku telepon — isinya daftar "ada collection A namanya B punya C ikon". Ikon aslinya diambil dari API pas dipakai.

---

# Todo List Teknis — Project Baru (Vue + Vite + Bun + shadcn/vue)

**Konsep:** Search-first UI. Landing page cuma search bar. Ketika user ngetik, icon yg cocok muncul dgn **bubble reveal animation**. Klik icon → modal detail (sama persis kaya icones soal snippet/copy/download).

**Sumber ikon:** Iconify. Data koleksi dari `@iconify/json` (npm package, diproses di build time via script). SVG ikon di-render via `iconify-icon` web component (fetch dari API Iconify secara internal).

---

## Fase 1: Inisialisasi Project

- [ ] Init project Vue + Vite + TypeScript via `bun create vue` atau `bun create vite`
- [ ] Setup Bun sebagai package manager
- [ ] Install & setup **shadcn/vue** (`npx shadcn-vue@latest init`)
- [ ] Install **Tailwind CSS** (bundled dengan shadcn/vue)
- [ ] Install dependencies inti:
  ```bash
  bun add @iconify/json iconify-icon @vueuse/core vue-router fzf
  bun add -D vite-plugin-pages unplugin-auto-import unplugin-vue-components
  ```
- [ ] Setup **vue-router** (single page — search + detail modal)
- [ ] Setup `vite.config.ts` — register `iconify-icon` sebagai custom element (lihat catatan di bawah)
- [ ] Setup struktur folder:
  ```
  src/
    data/        — data layer (collections, icons, search alias)
    stores/      — state management (pinia)
    composables/ — reusable hooks (search)
    components/  — UI components (shadcn + custom)
    utils/       — helpers (SVG transform, snippet generation)
    types/       — TypeScript types
  scripts/
    prepare.ts   — generate collections-info.json dari @iconify/json
  ```

> **Catatan vite.config.ts — custom element iconify-icon:**
> ```ts
> // Vue plugin
> Vue({
>   template: {
>     compilerOptions: {
>       isCustomElement: tag => tag === 'iconify-icon',
>     },
>   },
> }),
> ```

## Fase 2: Data Layer — Generate & Load Collections

### 2a. Script Generate (`scripts/prepare.ts`)

> **Pola ini persis seperti icones.** `@iconify/json` digunakan di **build time**, bukan runtime.

- [ ] Buat `scripts/prepare.ts` yang:
  - Baca `node_modules/@iconify/json/collections.json` (daftar semua collection + metadata)
  - Generate `src/data/collections-info.json` — subset metadata: `{ id, name, author, license, category, total, sampleIcons, prepacked }`
  - Simpan sample icons (9 icon pertama per collection + data SVG minimal) untuk preview di UI
  - Output `public/collections/{id}.json` — full data icon per collection (di-cache static)
  - Output `public/collections/{id}-meta.json` — daftar icon names + categories per collection
- [ ] Tambah script `"postinstall": "bun run scripts/prepare.ts"` di `package.json`
- [ ] Generate awal dengan `bun run scripts/prepare.ts`

### 2b. Data Runtime (`src/data/`)

- [ ] Buat `src/data/collections.ts` — import `collections-info.json`:
  - Tipe: `CollectionInfo { id, name, author, license, category, total, sampleIcons, prepacked }`
  - Export daftar semua collections (terbundel static di JS, zero network request)
  - Export helper: `getCollectionMeta(id)` — fetch `/{id}-meta.json` pas dibutuhkan
- [ ] Buat `src/data/icons.ts` — fungsi load ikon:
  - `downloadAndInstall(id)` — fetch `/collections/{id}.json`, register ke `iconify-icon` via `addCollection()`
  - Integrasi dengan `iconify-icon` web component untuk render SVG otomatis
- [ ] Buat `src/data/search-alias.ts` — **copy paste** dari icones (synonyms biar search kuat)
- [ ] Buat `src/data/variants.ts` — **copy paste** dari icones (mapping variant per collection)

> **⚠️ Perbedaan penting dari icones:**
> Icobiles pake prepare script untuk generate JSON ke folder `public/`. Di icones, file-file public ini di-deploy ke static hosting dan di-fetch runtime. Untuk project barumu, patternnya SAMA — file di `public/collections/` akan diakses via `fetch('/collections/{id}.json')` oleh kode frontend.

> **Fitur lanjutan (skip dulu):** IndexedDB caching, PWA service worker — tambah belakangan.

## Fase 3: Search Engine (Fokus Utama)

- [ ] Install library search: **`fzf`** (sama kaya icones, proven bagus) atau **`flexsearch`** (lebih modern, typo-tolerant)
- [ ] Buat `src/composables/useGlobalSearch.ts`:
  - Search **global** across ALL collections (beda sama icones yg per-collection)
  - Input query → fuzzy match di `icon.name`, `collection.name`, synonym alias dari search-alias
  - Output: flat results `{ collectionId, iconName, collectionName }[]`
  - Debounce 200-300ms
  - Support extended match syntax (spasi, kutip, dll)
  - Prioritaskan hasil: exact match > prefix match > fuzzy match
- [ ] Integrasi alias expansion dari `search-alias.ts`
- [ ] Saat search kosong → jangan tampilkan apa-apa (berbeda dgn icones yg show all)
- [ ] Optional: suggested keywords ketika hasil dikit

## Fase 4: State Management (Pinia)

- [ ] Install Pinia (`bun add pinia`)
- [ ] Buat `src/stores/collections.ts` — daftar collections + status load
- [ ] Buat `src/stores/search.ts` — query, results, loading state
- [ ] Buat `src/stores/preferences.ts` — dark mode, preview color, icon size, preferred case (persist ke localStorage pake `@vueuse/core` `useStorage`)
- [ ] Buat `src/stores/icons.ts` — recent icons, favorite icons

> **Fitur lanjutan:** Bag/multi-select, packing — skip dulu.

## Fase 5: UI Components

- [ ] **Landing Page** (`src/pages/index.vue`):
  - Fullscreen centered search bar (hero style)
  - Background subtle gradient/pattern
  - Placeholder: "Search 200,000+ icons..."
  - **Saat search kosong → landing page bersih** (hanya search bar)
  - Hasil muncul di bawah secara real-time
- [ ] **SearchBar** (`src/components/SearchBar.vue`) — shadcn Input + Command component
- [ ] **IconGrid** (`src/components/IconGrid.vue`) — grid hasil pencarian, pake `<TransitionGroup>` untuk animasi masuk/keluar
- [ ] **IconCard** (`src/components/IconCard.vue`) — render ikon via `iconify-icon` web component + label nama
- [ ] **IconDetail** (`src/components/IconDetail.vue`) — modal/dialog shadcn, isinya:
  - Preview SVG besar (color picker)
  - Nama ikon + case selector
  - Tombol copy: SVG, JSX, Vue, Svelte, URL, Data URL, PNG
  - Tombol download: SVG, PNG
  - Link ke Iconify
- [ ] **ColorPicker** (`src/components/ColorPicker.vue`) — shadcn Popover + color input
- [ ] **Icon** (`src/components/Icon.vue`) — **wrapper component** untuk `iconify-icon`, mirip icones:
  ```vue
  <template>
    <iconify-icon :icon="icon" :style="{ color }" />
  </template>
  ```
- [ ] **Dark Mode** toggle — pake shadcn DropdownMenu atau toggle button

## Fase 6: Bubble Reveal Animation

*(completed, proceed to search integration)*

- [ ] CSS keyframes untuk bubble-in animation:
  ```css
  @keyframes bubble-in {
    0% { transform: scale(0); opacity: 0; }
    60% { transform: scale(1.1); }
    100% { transform: scale(1); opacity: 1; }
  }
  ```
- [ ] Setiap IconCard dapat `animation-delay` incremental (stagger) berdasarkan index
- [ ] `<TransitionGroup>` untuk animasi masuk/keluar grid
- [ ] `useAutoAnimate` dari `@vueuse/core` untuk smooth layout shift

---

## 🔴 Fase 7 (KRITIS): Integrasi Search Engine — Global Fuzzy Search

### 🧠 Kenapa Pendekatan Saat Ini Gagal?

**Problem:** Saat user ngetik "car" atau "card", hasil kosong atau tidak akurat.

**Akar masalah:** Project kamu saat ini cuma punya `collections-info.json` (metadata koleksi — nama koleksi, author, dll). Search engine jalan di atas array ini → jadinya cuma mencari **nama koleksi**, bukan **nama icon individual**.

Di icones asli, `hooks/search.ts` bisa menemukan "card" karena:
1. User masuk ke halaman `/collection/mdi` (satu koleksi spesifik)
2. `collection.value.icons` sudah terisi = `["card", "credit-card", "dot-card", ...]` (ribuan nama icon)
3. `fzf` mencari di array itu → "card" cocok dengan `credit-card`, `card`, dll

**Untuk global search (project barumu),** kamu butuh **FLAT INDEX** yang berisi semua nama icon dari SEMUA koleksi.

---

### 📊 Data Flow yang Benar

```
script/prepare.ts
  → @iconify/json/json/{id}.json (baca semua icon names per collection)
  → public/collections/{id}-meta.json (icon names per koleksi, total ~7.5MB)
  → public/collections-meta.json (GABUNGAN semua koleksi, ~7.5MB)

runtime:
  1. Browser fetch /collections-meta.json (sekali saja)
  2. Flatten jadi: { collectionId, collectionName, iconName }[]
  3. Fzf index di atas flatten array ini
  4. User search "car" → fuzzy match di ALL icon names
  5. Output: [{ collectionId: "mdi", collectionName: "Material Design Icons", iconName: "car" }, ...]
```

---

### ✅ Checklist Implementasi

#### Step 1: Generate `collections-meta.json` (script/prepare.ts)

- [ ] Pastikan `scripts/prepare.ts` sudah generate `public/collections-meta.json`:
  ```ts
  // Format: array of { id, name, icons: string[], categories? }
  // id = "mdi", name = "Material Design Icons", icons = ["account", "account-alert", ...]
  // Ini GABUNGAN semua koleksi jadi SATU file besar (~7.5MB)
  ```
- [ ] File diletakkan di `public/collections-meta.json` (bisa diakses via `/collections-meta.json`)
- [ ] Jika file terlalu besar (>10MB), pertimbangkan kompresi atau split per kategori

#### Step 2: Buat Global Search Hook

- [ ] Buat `src/composables/useGlobalSearch.ts`:
  ```ts
  export function useGlobalSearch() {
    const query = ref('')
    const results = ref<SearchResult[]>([])
    const loading = ref(false)
    const metaLoaded = ref(false)
    const flatIndex = ref<{ collectionId: string, collectionName: string, iconName: string }[]>([])
    const fzfInstance = ref<AsyncFzf<typeof flatIndex.value[0]>>()

    // 1. Load collections-meta.json (sekali saat pertama search)
    async function loadMeta() { ... }

    // 2. Build flat index (flatten per-collection icons → single array)
    function buildIndex(meta: CollectionMeta[]) { ... }

    // 3. Init fzf dengan flat index
    function initFzf() {
      fzfInstance.value = new AsyncFzf(flatIndex.value, {
        casing: 'case-insensitive',
        fuzzy: 'v1',
        selector: v => `${v.iconName} ${v.collectionName}`,
      })
    }

    // 4. Search function dengan alias expansion
    async function search(q: string) {
      if (!metaLoaded.value) await loadMeta()
      // Fuzzy match via fzf
      // Prioritaskan exact match > prefix > fuzzy
      // Apply alias expansion
      results.value = ...
    }

    // 5. Debounce 200ms
    const debouncedSearch = useDebounceFn(search, 200)
    watch(query, debouncedSearch)

    return { query, results, loading }
  }
  ```

#### Step 3: Alias Expansion

- [ ] Copy pattern dari icones `hooks/search.ts` (baris 41-56):
  ```ts
  // "car" → juga search "vehicle", "transport", "taxi"
  const aliasedCandidates = computed(() => {
    const parts = query.value.toLowerCase().split(' ').filter(Boolean)
    const options = new Set([parts.join(' ')])
    parts.forEach((word, idx, arr) => {
      const alias = searchAlias.find(a => a.includes(word))
      alias?.forEach(a => options.add([...arr.slice(0, idx), a, arr.slice(idx + 1)].filter(Boolean).join(' ')))
    })
    return [...options]
  })
  ```
- [ ] Gabung multiple candidates dengan OR syntax: `"car | vehicle | transport | taxi"`

#### Step 4: Hasilkan Search Result

- [ ] Format output:
  ```ts
  interface SearchResult {
    collectionId: string    // "mdi"
    collectionName: string  // "Material Design Icons"
    iconName: string        // "car"
    iconFull: string        // "mdi:car" (format untuk iconify-icon)
    matchType: 'exact' | 'prefix' | 'fuzzy' | 'alias'
  }
  ```
- [ ] Sort: exact match > prefix match > fuzzy match > alias match
- [ ] Limit hasil (misal 200 item pertama)

#### Step 5: Integrasi dengan Komponen

- [ ] Di `src/pages/index.vue`, ganti search logic lama dengan `useGlobalSearch()`:
  ```ts
  const { query, results, loading } = useGlobalSearch()
  ```
- [ ] Bind `query` ke SearchBar component
- [ ] Pass `results` ke IconGrid component
- [ ] Saat query kosong → tampilkan landing page bersih
- [ ] Saat loading → tunjukkan spinner/skeleton
- [ ] Gunakan `TransitionGroup` + bubble reveal untuk memunculkan hasil

#### Step 6: Optimasi (setelah berfungsi)

- [ ] **Lazy load collections-meta.json** — fetch hanya saat user mulai mengetik (bukan pas startup)
- [ ] **Cache di memory** — simpan hasil fetch di store agar tidak fetch ulang
- [ ] **Progress indicator** — karena file ~7.5MB, tunjukkan loading bar
- [ ] **Web Worker** (opsional) — pindahkan fuzzy search ke worker agar UI tetap responsif
- [ ] **Incremental search** — hasil pertama dari sample icons dulu, lalu full search setelah meta loaded

---

### 🔍 Verifikasi

Setelah implementasi, test case berikut harus berfungsi:

| Input | Expected |
|-------|----------|
| `"car"` | Muncul icon `car`, `car-side`, `car-wash`, dll dari berbagai collection |
| `"card"` | Muncul icon `card`, `credit-card`, `card-bulleted`, dll |
| `"dot"` | Muncul icon dengan kata "dot" di namanya |
| `"search"` | Juga muncul icon dengan kata "magnify", "find" (alias) |
| `"mdi:car"` | Filter hanya dari collection mdi (extended match) |
| `""` (kosong) | Landing page bersih, tidak ada icon |

---

## Fase 8: SVG Utility & Snippet Generation

- [ ] Buat `src/utils/svg/` — **copy paste dari icones**:
  - `helpers.ts` — clear SVG, set attributes
  - `htmlToJsx.ts` — SVG string → JSX string
  - `loader.ts` — helper fetch SVG dari API Iconify (untuk generate snippet)
  - SvgToVue, SvgToSvelte, SvgToSolid, SvgToQwik, SvgToAstro, dll
  - `bufferToString.ts`, `base64.ts`, `prettier.ts`
- [ ] Buat `src/utils/snippets.ts` — simplifikasi dari `icons.ts`:
  - Mapping tipe format → fungsi generator
  - `getIconSnippet(collections, icon, type, color)` — generate code snippet
  - `Download(blob, name)` — trigger download file
  - `svgToPngDataUrl(svg)` — konversi via canvas

> **Catatan:** Kode transformasi SVG ini **bisa dicopy mentah-mentah** dari icones karena logikanya murni string transformation. Tidak ada dependencies khusus selain `prettier` (opsional).

## Fase 8: Polishing

- [ ] **Keyboard shortcuts**: `/` fokus search, `Escape` tutup modal, arrow keys navigasi
- [ ] **Infinite scroll** / Load More di hasil search
- [ ] **Recent searches** di localStorage
- [ ] **Responsive** — mobile friendly
- [ ] **Deploy** ke Vercel / Netlify / Cloudflare Pages

---

## Fitur Lanjutan (skip dulu, tambah belakangan)

- [ ] **PWA + Service Worker** — Workbox untuk cache API Iconify (biar offline)
- [ ] **IndexedDB** — cache collection data pake Dexie (biar loading lebih cepet setelah kunjungan pertama)
- [ ] **Bag / Multi-select** — kumpulin icon, copy/download batch
- [ ] **Packing** — download koleksi kustom sebagai ZIP
- [ ] **Shiki syntax highlighting** — untuk preview code snippet

---

---

# 🧪 Checklist: Halaman Testing (Playground) — di Project icones Ini

**Tujuan:** Buat halaman `/test` di project icones yang sudah jalan. Halaman ini akan jadi playground untuk fitur baru tanpa mengganggu halaman existing. Nanti setelah fitur siap, halaman lama bisa dihapus.

**Mengapa ini lebih mudah:**
- Semua data (`collections-meta.json`, `collections-info.json`) SUDAH siap
- `iconify-icon` web component SUDAH terkonfigurasi di vite.config.ts
- `fzf` SUDAH ada di dependencies
- Auto-import Vue/VueUse SUDAH jalan via `unplugin-auto-import`
- Components SUDAH ada: `Icon.vue`, `SearchBar.vue`, `IconDetail.vue`, `Modal.vue`, `ColorPicker.vue`
- File-based routing SUDAH via `vite-plugin-pages` — tinggal bikin `src/pages/test.vue`

**Akses halaman:** `http://localhost:3333/test`

---

## ✅ Step 1: Buat Global Search Hook

**File dibuat:** `src/composables/useGlobalSearch.ts`

```ts
interface SearchResult {
  collectionId: string   // "mdi"
  collectionName: string // "Material Design Icons"
  iconName: string       // "car"
  iconFull: string       // "mdi:car"
  matchType: 'exact' | 'prefix' | 'fuzzy' | 'alias'
}
```

- [x] Fetch `/collections-meta.json` — via `getFullMeta()` dari `src/data/index.ts`
- [x] Flatten jadi array `{ collectionId, collectionName, iconName }[]`
- [x] Init `AsyncFzf` dengan selector `iconName + collectionName`
- [x] Alias expansion (copy pattern dari `hooks/search.ts`)
- [x] Prioritaskan hasil: exact > prefix > fuzzy > alias
- [x] Debounce 200ms via `useDebounceFn`
- [x] Cache hasil fetch di memory (ref `metaLoaded`)
- [x] Loading state

---

## ✅ Step 2: Buat Halaman `/test`

**File dibuat:** `src/pages/test.vue`

- [x] Full viewport (h-screen)
- [x] Search bar di tengah vertikal saat kosong, pindah ke atas saat ngetik
- [x] Hasil muncul di bawah search bar
- [x] Saat field kosong → landing page bersih
- [x] Dark mode support (pake class `bg-base` yang sudah ada)
- [x] Import `useGlobalSearch` dari composables
- [x] Reuse `Icon` component
- [x] Reuse `IconDetail` + `Modal` untuk preview detail

**Reuse (no changes):** `src/components/SearchBar.vue`, `src/components/Icon.vue`, `src/components/IconDetail.vue`, `src/components/Modal.vue`

---

## ✅ Step 3: Buat IconGrid + IconCard

**File dibuat:**
- `src/components/IconGrid.vue`
- `src/components/IconCard.vue`

- [x] `<TransitionGroup>` untuk animasi masuk/keluar
- [x] Grid responsive: `grid-template-columns: repeat(auto-fill, minmax(80px, 1fr))`
- [x] Render ikon via `<Icon :icon="iconFull" />`
- [x] Label nama icon di bawah (truncated)
- [x] Tooltip nama collection via `floating-vue` Tooltip
- [x] Click → emit `select` ke parent

---

## ⏭️ Step 4: Sample Icons (Skip)

Langsung pake full `collections-meta.json` via `getFullMeta()`. Sample icons dari `collections-info.json` tidak dipakai.

---

## ✅ Step 5: Bubble Reveal Animation

- [x] CSS keyframes `bubble-in` (scale 0 → 1.08 → 1, fade in)
- [x] Stagger delay per item: `animation-delay: calc(var(--i) * 25ms)`
- [x] `<TransitionGroup name="bubble">` di IconGrid
- [ ] `useAutoAnimate` — skip, CSS animation sudah cukup

---

## ✅ Step 6: Integrasi dengan IconDetail

- [x] Modal `IconDetail` terbuka saat icon diklik
- [x] Collections info di-import dari `src/data/index.ts`
- [x] Copy snippet, download, color picker — semua reuse existing `IconDetail.vue`

---

## ✅ Step 7: Isolasi dari Halaman Existing

- [x] Route `/test` milik sendiri — tidak sentuh `index.vue`, `collection/[id].vue`, dll
- [x] Tidak ada perubahan ke `store/`, `Navbar`, `WithNavbar`
- [x] Nanti setelah fitur siap: rename `test.vue` → `index.vue`, hapus pages lain

---

### 🎯 Ringkasan File (Final)

| File | Status | Untuk dibersihkan nanti? |
|------|--------|--------------------------|
| `src/composables/useGlobalSearch.ts` | **BARU** ✅ | **TETAP** — komponen inti |
| `src/pages/test.vue` | **BARU** ✅ | rename jadi `index.vue` |
| `src/components/IconGrid.vue` | **BARU** ✅ | **TETAP** |
| `src/components/IconCard.vue` | **BARU** ✅ | **TETAP** |
| `src/pages/index.vue` | **EXISTING** | **HAPUS** — ganti test.vue |
| `src/pages/settings.vue` | **EXISTING** | **HAPUS** — ga dipake |
| `src/pages/[...all].vue` | **EXISTING** | **HAPUS** — ga dipake |
| `src/pages/collection/[id].vue` | **EXISTING** | **HAPUS** — ga dipake |
| `src/components/Navbar.vue` | **EXISTING** | **HAPUS** — ga dipake |
| `src/components/WithNavbar.vue` | **EXISTING** | **HAPUS** — ga dipake |
| `src/components/CollectionEntries.vue` | **EXISTING** | **HAPUS** — ga dipake |
| `src/components/CollectionEntry.vue` | **EXISTING** | **HAPUS** — ga dipake |
| `src/components/Footer.vue` | **EXISTING** | **HAPUS** — ga dipake |
| `src/components/Drawer.vue` | **EXISTING** | **HAPUS** — ga dipake |
| `src/components/IconSet.vue` | **EXISTING** | **HAPUS** — ga dipake |
| `src/components/FAB.vue` | **EXISTING** | **HAPUS** — ga dipake |
| `src/components/Bag.vue` | **EXISTING** | **HAPUS** — ga dipake |
| `src/components/ActionsMenu.vue` | **EXISTING** | **HAPUS** — ga dipake |
| `src/components/InstallIconSet.vue` | **EXISTING** | **HAPUS** — ga dipake |
| `src/components/HelpPage.vue` | **EXISTING** | **HAPUS** — ga dipake |
| `src/components/SettingsCollectionsList.vue` | **EXISTING** | **HAPUS** — ga dipake |
| `src/components/SnippetPreview.vue` | **EXISTING** | **HAPUS** — ga dipake |
| `src/components/electron/` (all) | **EXISTING** | **HAPUS** — ga dipake |
| `src/hooks/search.ts` | **EXISTING** | **TETAP** — dipake useGlobalSearch (referensi) |
| `src/hooks/color.ts` | **EXISTING** | **HAPUS** (?) — kalo `useThemeColor` ga dipake |
| `src/store/indexedDB.ts` | **EXISTING** | **HAPUS** — fitur lanjutan |
| `src/store/packing.ts` | **EXISTING** | **HAPUS** — fitur lanjutan |
| `src/store/dialog.ts` | **EXISTING** | **HAPUS** — fitur lanjutan |
| `src/store/progress.ts` | **EXISTING** | **HAPUS** — fitur lanjutan |
| `src/store/collection.ts` | **EXISTING** | **HAPUS** — per-collection logic |
| `src/store/dark.ts` | **EXISTING** | **HAPUS** — ganti preferensi manual |
| `src/utils/pack.ts` | **EXISTING** | **HAPUS** — fitur lanjutan |
| `src/utils/pack-worker-client.ts` | **EXISTING** | **HAPUS** — fitur lanjutan |
| `src/utils/electron.ts` | **EXISTING** | **HAPUS** — electron only |
| `src/utils/shiki.ts` | **EXISTING** | **HAPUS** — fitur lanjutan |
| `src/env.ts` | **EXISTING** | **TETAP** (?) — maybe simplify |
| `src/sw.ts` | **EXISTING** | **HAPUS** — fitur lanjutan |
| `src/main.css` | **EXISTING** | **TETAP** — styling global |
| `public/collections-meta.json` | **SUDAH ADA** | **TETAP** — data inti |
| `scripts/prepare.ts` | **EXISTING** | **TETAP** — generator data |

---

# 🧪 Infinite Canvas — Fitur Baru di `/test`

**Konsep:** Setelah user search, icon tidak muncul di grid biasa, tapi tersebar di infinite 2D canvas. User bisa pan/drag untuk explore hasil search.

**Requirements:**
- Icons muncul hanya setelah search (`query` aktif)
- Icons tersebar di X/Y axis (random atau grid-based)
- Pan/drag smooth 4 arah (atas, bawah, kiri, kanan)
- Performant untuk ratusan/ribuan icon
- `cursor-grab` / `cursor-grabbing`
- Tetap pakai `@select="onSelect"` untuk modal detail
- Canvas container: `flex-1 overflow-hidden`

---

## ✅ Checklist Implementasi

### Step 1: Pilih Library / Approach ✅

**Dipilih:** **Opsi B — `@vueuse/core` `useDraggable`**

- [x] Install: sudah ada di `package.json` (`@vueuse/core`)
- [x] Pakai `useDraggable` untuk pan logic
- [x] Return `x`, `y` refs → apply ke `transform`
- [x] **Pros:** Sudah tested, touch support, smooth, zero new deps

### Step 2: Buat Canvas Container Component ✅

**File dibuat:** `src/components/IconCanvas.vue` ✅

- [x] Props: `results: SearchResult[]`, `loading: boolean`
- [x] Emit: `select(iconFull: string)`
- [x] Container: `flex-1 overflow-hidden relative`
- [x] Canvas layer: `absolute inset-0` dengan `transform: translate3d(x, y, 0)`
- [x] Draggable via `useDraggable` dari `@vueuse/core`
- [x] Apply `x`, `y` ke style: `transform: translate3d(${x}px, ${y}px, 0)`
- [x] Cursor: `cursor-grab` / `cursor-grabbing` (vueuse auto handle)
- [x] Scatter icons randomly di 2D space (pseudo-random untuk stable positions)
- [x] Virtualization: hanya render icon di dalam viewport + buffer
- [x] Loading state + empty state
- [x] Click icon → emit `select`

### Step 3: Integrasi dengan `/test` Page ✅

**File diupdate:** `src/pages/test.vue` ✅

- [x] Ganti `<IconGrid>` dengan `<IconCanvas>`
- [x] Hapus logic lama (IconGrid tidak dipakai)
- [x] Modal detail tetap berfungsi

---

### ⏭️ Step 4: Icon Positioning Logic (Sudah di IconCanvas.vue)

- [x] Scatter icons di 2D space dengan pseudo-random untuk stable positions
- [x] Position tidak berubah saat pan/drag

---

### Step 7: UX Polish

- [ ] **Bounds limiting:** Prevent pan terlalu jauh (optional):
  ```ts
  const boundedX = computed(() => Math.min(0, Math.max(-2000, x.value)))
  const boundedY = computed(() => Math.min(0, Math.max(-2000, y.value)))
  ```
- [ ] **Zoom support (opsional):** Ctrl + scroll untuk zoom in/out
- [ ] **Reset position button:** Double click canvas → reset ke (0, 0)
- [ ] **Loading skeleton:** Show spinner saat `loading === true`
- [ ] **Empty state:** "No icons found" saat results kosong
- [ ] **Inertia / momentum (opsional):** Smooth deceleration setelah drag

---

### Step 8: Performance Optimization

- [ ] **Debounce virtualization:** Jangan filter setiap frame (use `useDebounceFn`)
- [ ] **`will-change: transform`:** Apply ke canvas layer
- [ ] **`content-visibility: auto`:** Apply ke icon container (browser optimization)
- [ ] **Web Worker (opsional):** Pindahkan fuzzy search + positioning logic ke worker
- [ ] **Memoize positioned icons:** Jangan recalculate position setiap render

---

## 📦 Library Suggestions

| Library | Bundle Size | Touch Support | Zoom | Virtualization | Recommendation |
|---------|-------------|---------------|------|----------------|----------------|
| **Vanilla JS + @vueuse** | ~0KB (vueuse sudah ada) | ✅ | ❌ (manual) | Manual | ⭐⭐⭐⭐⭐ Best |
| `@panzoom/panzoom` | ~5KB | ✅ | ✅ | ❌ | ⭐⭐⭐⭐ Good |
| `vue-panzoom` | ~6KB | ✅ | ✅ | ❌ | ⭐⭐⭐ OK |
| `vue-virtual-scroller` | ~15KB | ❌ | ❌ | ✅ | ⭐⭐ (1D only) |
| `konva` / `fabric.js` | ~100KB+ | ✅ | ✅ | ❌ | ⭐ (Overkill) |

**👉 Final pick:** **`@vueuse/core` `useDraggable`** + manual virtualization. Zero new deps, full control, performant.

---

## 🎯 Acceptance Criteria

Test case setelah implementasi:

| Action | Expected |
|--------|----------|
| Ketik "car" → results muncul | Icons tersebar di canvas (random/grid) |
| Drag canvas ke kiri/kanan/atas/bawah | Smooth pan, cursor grab/grabbing |
| Scroll hasil banyak (500+ icon) | No lag, hanya render visible icons |
| Klik icon | Modal detail terbuka |
| Close modal → drag lagi | Canvas position tetap (tidak reset) |
| Resize window | Viewport bounds update, visible icons recalculate |
| Double click canvas (optional) | Reset position ke (0, 0) |

---

## 🔧 File Changes Summary

| File | Action | Notes |
|------|--------|-------|
| `src/components/IconCanvas.vue` | **BARU** | Main canvas component |
| `src/composables/useCanvasPan.ts` | **BARU** (optional) | Extract pan logic |
| `src/composables/useCanvasVirtualization.ts` | **BARU** (optional) | Extract virtualization logic |
| `src/pages/test.vue` | **UPDATE** | Ganti IconGrid → IconCanvas |
| `src/components/IconGrid.vue` | **HAPUS** (optional) | Tidak dipakai lagi |

---

## 🚀 Next Steps

1. [ ] **Pilih approach:** Vanilla JS vs vueuse vs panzoom
2. [ ] **Buat `IconCanvas.vue`:** Container + pan logic
3. [ ] **Implement virtualization:** Filter visible icons
4. [ ] **Test performance:** 500+ icons, smooth pan
5. [ ] **Polish UX:** Bounds, reset button, loading state
6. [ ] **Cleanup:** Hapus IconGrid, refactor code