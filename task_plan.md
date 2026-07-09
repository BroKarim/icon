# Task Plan: Visual & Theme Overhaul + Ad System

## Overview

Six features building on each other. Order matters — later tasks depend on earlier infrastructure.

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

## Phase 3: Hover Background Square

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

## Phase 5: Ad/Referral System Between Icons

**Goal**: Insert ads between icons on the canvas grid. Ad count unlimited, configurable system. Each ad has: link URL, image URL, short description.

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
Phase 1 (stagger)   Phase 2 (sheet anim)   Phase 3 (hover bg)
        \                    |                    /
         \                   |                   /
          v                  v                  v
               Phase 4 (dark theme)
                      |
                      v
               Phase 5 (ad system)
                      |
                      v
               Phase 6 (remove slider)
```

Phases 1, 2, 3 are independent → can be done in parallel.

Phase 4 needs Phase 3 (hover uses dark: variant).

Phase 5 depends on Phases 1/3 for stable grid infrastructure.

Phase 6 depends on Phase 5 (ads ready before removing slider).

---

## Files Touched

| File | Phases |
|------|--------|
| `src/components/IconCanvas.vue` | 1, 3, 4, 5 |
| `src/components/Icon.vue` | 1 (if forwarding props needed) |
| `src/components/ui/sheet/SheetContent.vue` | 2 |
| `src/pages/index.vue` | 4, 6 |
| `src/pages/v1.vue` | 4, 6 |
| `src/components/SearchHeader.vue` | 4, 6 |
| `src/components/DarkSwitcher.vue` | 4 (already exists) |
| `src/store/dark.ts` | 4 (already exists) |
| `src/types/ad.ts` | 5 (new) |
| `src/data/ads.ts` | 5 (new) |
| `src/components/AdCard.vue` | 5 (new) |
| `src/main.css` | 4 (already exists) |


ZLsT_7cAVK9.Y.Y
- update ui sikit lagi
- iconbuddy jdi patokan
