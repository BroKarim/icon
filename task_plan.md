# Task Plan: Rebrand → Affiliate System

## Overview

Next features after v2:

1. **Branding** — rename website ke "icloo" (name, title, manifest, PWA)
2. **Affiliate konten** — sisipkan konten afiliasi/referral di antara icon di canvas grid

---

> **Catatan**: Phase 1–6 adalah fitur dari task plan sebelumnya (visual & theme overhaul). Sudah selesai/ditunda. Fokus saat ini adalah **Branding** dan **Affiliate System**.

## Phase 7: Branding — Rebrand ke "icloo"

**Goal**: Ganti semua referensi brand dari "Icons"/"Icones" → "icloo". Website, PWA, meta tags, semuanya.

### Scope

| Area | File | Perubahan |
|------|------|-----------|
| PWA Manifest | `vite.config.ts` | `name: 'icloo'`, `short_name: 'icloo'` |
| PWA Manifest icons | `public/` | Update icon files kalau perlu |
| Page title | `src/pages/index.vue` | `useHead` → title "icloo" |
| Page title | `src/pages/v1.vue` | Sama |
| Page title | `src/pages/collection/[id].vue` | Title template `... — icloo` |
| OG meta | Semua file `useHead` | `og:title`, `og:description`, `og:url`, `twitter:*` |
| Canonical URL | Semua file `useHead` | `canonical` href |
| Favicon | `index.html` + `public/` | Update favicon link kalau ganti logo |
| Domain | Di mana aja | Update `icons.brokarim.com` → domain baru kalau ada |
| Search placeholder | `src/components/SearchHeader.vue` | Placeholder text (optional) |
| Hardcoded "Icons" | Seluruh codebase | Grep `Icons` / `icones` → ganti dengan `icloo` |

### Implementation Steps

1. **Grep dulu** — cari semua kemunculan `Icons`, `icones`, `ICONS` di `src/` dan `public/`
2. **Update vite.config.ts** — nama PWA manifest
3. **Update tiap page** — `useHead` title, meta, link
4. **Update favicon/logo** kalau ada aset baru
5. **Verify** — build, cek title bar, PWA install name, OG preview

### Verification

- Tab browser: title "icloo"
- PWA install prompt: name "icloo"
- Share link OG preview: title "icloo"
- Collection page: "Browse ... icons from the ... collection — icloo"
- Build: `npm run build` sukses, typecheck OK

---

## Phase 1: Staggered Icon Entry Animation

**Goal**: Icons fade + scale in on first mount with staggered delay, using `motion-v`.

### Implementation

| File | Change |
|------|--------|
| `src/components/IconCanvas.vue` | Add `staggerDelay = 15` constant. In template, wrap each icon div with `<Motion>` component from `motion-v`. `v-for` item gets: `:initial="{ opacity: 0, scale: 0.5 }"` `:animate="{ opacity: 1, scale: 1 }"` `:transition="{ delay: gridIndex % 30 * staggerDelay, duration: 0.3, ease: 'easeOut' }"`. |
| Sama file | Add `ref hasAnimated = false`. On first `updateGridItems()` after `onMounted`, set `hasAnimated.value = true`. Animation only on initial mount, not on scroll/drag. Use `v-if="hasAnimated"` or guard logic. |
| Sama file | Import `Motion` from `motion-v` |

### Details

- Delay = `gridIndex % 30 * 15ms` → max stagger = 29 × 15 = 435ms. First 30 icons animate in ~0.5s.
- Ikon baru yang muncul saat scroll/drag **tidak** perlu di-animasi ulang (penuh memory). Gunakan flag agar efek only on first population.
- Scale 0.5 → 1.0 with opacity 0 → 1.

### Verification

- Load page → icons sweep in with ripple effect
- No animation on scroll/new icons entering viewport (performa)

---

## Phase 2: Sheet Slide Animation via motion-v

**Goal** `SheetContent.vue`: sliding animation using `motion-v` instead of `tw-animate-css`.

### Implementation

| File | Change |
|------|--------|
| `src/components/ui/sheet/SheetContent.vue` | Replace `animate-in`/`animate-out` CSS classes. Import `Motion` from `motion-v`. Wrap `<DialogContent>` content in `<Motion>` with `:initial` / `:animate` / `:exit` based on `side` prop. Or use reka-ui's built-in `data-state` → watch to drive motion-v. |

### Approach

Since reka-ui's `DialogContent` controls its own mount/unmount, best approach:

1. Inside `<DialogContent>`, wrap slot content in `<Motion>` that reads `$attrs` or `data-state`
2. Animation:
   - `right` side: initial `{ x: '100%' }`, animate `{ x: 0 }`, exit `{ x: '100%' }`
   - `left` side: initial `{ x: '-100%' }`, animate `{ x: 0 }`, exit `{ x: '-100%' }`
   - `top`: initial `{ y: '-100%' }`, animate `{ y: 0 }`, exit `{ y: '-100%' }`
   - `bottom`: initial `{ y: '100%' }`, animate `{ y: 0 }`, exit `{ y: '100%' }`
3. Duration ~0.3s, ease `easeInOut`

Alternatively: use `<Presence>` from `motion-v` if reka-ui exposes `open` state.

### Verification

- Open sheet → slides in from right
- Close → slides out to right
- Other sides (left/top/bottom) work too

---

## Phase 3: Hover Background Square✅✅✅✅✅

**Goal**: On icon hover, show rounded background square behind icon (not lift/translate).

### Implementation

| File | Change |
|------|--------|
| `src/components/IconCanvas.vue` | In icon div template (line 429), replace `hover:-translate-y-1 hover:scale-[1.03]` with `hover:bg-white/15 dark:hover:bg-white/[0.06] hover:backdrop-blur-sm`. Add `transition-colors` duration. Keep `rounded-2xl` on parent. Add inner `<div>` as background layer or use `::before` pseudo-element. |

### Design

Simplest: apply background directly on the grid cell div:

```
class="group absolute flex flex-col items-center justify-center rounded-2xl transition-all duration-200 ease-out hover:bg-white/15 dark:hover:bg-white/[0.06]"
```

Remove `hover:-translate-y-1 hover:scale-[1.03]`. No lift, just background fill.

The icon label (`.opacity-0 group-hover:opacity-100`) stays.

### Verification

- Hover icon → subtle white/translucent square background appears
- No icon lift
- Works in both light & dark

---

## Phase 4: Light & Dark Theme

**Goal**: Wire existing dark mode CSS to the new canvas-based pages (index.vue, v1.vue). DarkSwitcher.vue already exists — just place in header.

### Implementation

| File | Change |
|------|--------|
| `src/pages/index.vue` | Change `iconColor` ref to computed: `isDark.value ? '#ffffff' : '#000000'`. Same for `bgColor`: `isDark.value ? '#141414' : '#f7f3ec'`. Import `isDark` from `@/store/dark`. |
| `src/pages/v1.vue` | Same as above. |
| `src/components/SearchHeader.vue` | Add DarkSwitcher button in right section (before color picker). Update hardcoded `text-black/60` → `dark:text-white/60`. Glass backgrounds may need dark variant. |
| `src/components/IconCanvas.vue` | `bgStyle` computed: when dark, adjust gradient (keep dark background, more subtle radial). |
| `src/components/IconCanvas.vue` | Icon label `bg-white/84` → `dark:bg-black/50 dark:text-white/70`. |

### DarkSwitcher Placement

In `SearchHeader.vue` right section (before color picker):
```html
<DarkSwitcher />
```

### isDark reactivity

- User toggles dark → `isDark` changes → computed bgColor/iconColor react
- `IconCanvas` re-renders with new colors
- `SearchHeader` glass backgrounds re-render

### Verification

- Toggle dark mode → page bg, icon color, controls all switch
- Refresh → dark mode persists (localStorage `icones-schema`)
- Randomize still works independently

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

New composable or function `computeAdInsertions(gridCells: Position[]): Map<string, AdItem>`:

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

## Phase 6: Remove Icon Size Slider (When Ads Ready)

**Goal**: Once ad system is live, remove icon size slider from SearchHeader. Set fixed icon size.

### Implementation

| File | Change |
|------|--------|
| `src/components/SearchHeader.vue` | Delete slider div block (lines 304-315). Remove `Slider` import (if no longer used). Remove `iconScaleModel` computed. Remove `iconScale` from props interface & emits. |
| `src/pages/index.vue` | Remove `icon-scale` v-model from `<SearchHeader>`. Remove `iconScale` ref. Set `iconScale` to `1` constant in `<IconCanvas>` call. |
| `src/pages/v1.vue` | Same as above. |
| `src/pages/index.vue` | If `iconScale` removed, `watch(showDetail...` still works. Just hardcode `:icon-scale="1"` on IconCanvas. |

### Result

- Icon size fixed at 112px (current default at scale=1)
- No resize control for user
- Consistent grid layout

---

## Dependency Graph

```
Phase 7 (branding)       Phase 5 (affiliate)
        \                       /
         \                     /
          v                   v
              Phase 6 (remove slider — opsional, setelah affiliate jalan)
```

Phase 7 (branding) dan Phase 5 (affiliate) independen → bisa dikerjakan paralel.

Phase 6 opsional — hapus slider ikon setelah affiliate system stabil dan ikon size udah fixed.

---

## Files Touched

| File | Phases |
|------|--------|
| `vite.config.ts` | 7 (manifest name) |
| `src/pages/index.vue` | 7 (title, meta) |
| `src/pages/v1.vue` | 7 (title, meta) |
| `src/pages/collection/[id].vue` | 7 (title, meta) |
| `src/components/SearchHeader.vue` | 7 (placeholder) |
| `index.html` | 7 (title, favicon) |
| `public/` | 7 (favicon/logo assets) |
| `src/types/ad.ts` | 5 (new — tipe data affiliate) |
| `src/data/ads.ts` | 5 (new — daftar konten affiliate) |
| `src/components/AdCard.vue` | 5 (new — komponen card affiliate) |
| `src/components/IconCanvas.vue` | 5 (integrasi affiliate di grid) |
| `src/composables/useAffiliate.ts` | 5 (new — logika placement) |


---

## Phase 0: Search Fix — Explicit Submit + Race Condition Guard

**Goal**: Fix SearchHeader yang gak punya submit mechanism, auto-search yang bentrok sama explicit search, dan race condition di `runSearch()`.

### Diagnosis

| # | Problem | Root Cause |
|---|---------|------------|
| 1 | SearchHeader gak trigger search on Enter | Input React cuma `onInput`, gak ada `onKeyDown` Enter |
| 2 | `index.vue` gak listen `@submit` di SearchHeader | Hanya SearchCenter yg punya `@submit="onSearchSubmit"` |
| 3 | Auto-search jalan sendiri setelah layout switch ke top | `watch(query)` di composable trigger debouncedSearch tiap keystroke |
| 4 | Hasil lama overwrite hasil baru | `runSearch()` tanpa AbortController/search token |

### Changes

#### A. `src/components/SearchHeader.vue`
- Tambah `submit` ke `Emits` interface
- Tambah `onKeyDown` di React input: `e.key === 'Enter' → emit('submit')`

#### B. `src/composables/useGlobalSearch.ts`
- Pindahkan `hasSearched` ref ke dalam composable (dari local ref di tiap page)
- Export `hasSearched` dari return value
- Tambah `let searchToken = 0` + guard di `runSearch()` — discard stale responses
- Modifikasi `watch(query)`: skip auto-search kalau `hasSearched.value === true`

#### C. `src/pages/index.vue`
- Destructure `hasSearched` dari composable (hapus local `const hasSearched = ref(false)`)
- Tambah `@submit="onSearchSubmit"` di `<SearchHeader>`

#### D. `src/pages/v1.vue`
- Sama seperti index.vue

#### E. `src/pages/collection/[id].vue`
- Tambah `@submit` handler di `<SearchHeader>` (no-op — search di sini computed-based)

### Behavior After

| State | SearchCenter | SearchHeader |
|-------|-------------|--------------|
| Before first search | Live search via watch (as before) | N/A (hidden) |
| After first search | N/A (hidden) | Search only on Enter/klik — watch skip auto-search, token guard cegah race |

### Files Touched

| File | Change |
|------|--------|
| `src/components/SearchHeader.vue` | Emits + onKeyDown |
| `src/composables/useGlobalSearch.ts` | hasSearched + token guard + conditional watch |
| `src/pages/index.vue` | @submit binding |
| `src/pages/v1.vue` | @submit binding |
| `src/pages/collection/[id].vue` | @submit binding |





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
git tag -a v1 -m "Stable version before search branch merge"
git push origin v1

# 3. Merge branch fitur ke main
git merge v2-build       # ganti v2-build dengan nama branch fitur
# selesaikan conflict kalau ada
git push origin main

# 4. Tag versi baru setelah merge
git tag -a v2 -m "Merged search branch: fix search trigger + race condition"
git push origin v2

# 5. Lihat kode lama (detached HEAD)
git checkout v1

# Atau bikin branch dari tag kalau mau develop dari versi lama
git checkout -b hotfix-v1 v1
```

### Cara Akses Kode Lama/Liat Isi Tag

```bash
git tag                           # list semua tag
git show v1                       # lihat detail tag + message
git checkout v1                   # detached HEAD — lihat kode versi v1
git diff v1..v2                    # lihat perubahan antar versi
```

### Skema Versi ke Depan

| Tag | Isi |
|-----|-----|
| `v1` | Kode main sebelum merge branch v2-build |
| `v2` | Main setelah merge v2-build (fix search + race condition) |
| `v2.1` | Fitur/bug kecil berikutnya |
| `v2.2` | Fitur/bug berikutnya |
| `v3` | Rilis besar berikutnya (breaking changes) |

### Aturan

- **Jangan hapus tag yang sudah di-push** — tag adalah sejarah
- Setiap sebelum merge branch besar, tag dulu main yang existing
- Setelah merge, tag versi baru
- Untuk bug kecil: `git tag -a v2.1 -m "..."` langsung di main (tanpa branching)
- Untuk fitur besar: buat branch → merge → tag seperti workflow di atas





- branding jdi icloo
- di Icondetai bagain icon da svg yg bs di render
- sistem pencarian di src/pages/collection/[id].vue itu buat public aja jgn terbatas d collection
- hero section clone dari dia aja : https://shoogle.dev/ tpi background hilang pas udh mask ke pencarian