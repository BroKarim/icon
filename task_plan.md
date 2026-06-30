# Task Plan: Pause SMIL animations on IconCanvas to prevent lag

## Goal
Stop icon SMIL animations on the IconCanvas grid to prevent website lag
(svg-spinners, line-md, meteocons, eos-icons, codex collections have animated icons
that cause CPU/GPU contention when hundreds render simultaneously).

When paused, users can preview animation by hovering a single icon.

## Phases

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Add `pauseAnimations` prop + MutationObserver + hover handlers to Icon.vue | complete |
| 2 | Pass `:pause-animations="true"` in IconCanvas.vue | complete |
| 3 | Verify build (lint + typecheck) | complete |

## Final Result
- `src/components/Icon.vue`: Added `pauseAnimations` prop (default false). On mount with prop=true, uses MutationObserver on iconify-icon's open shadowRoot to find `<svg>` and calls `pauseAnimations()`. Hover/mouseenter calls `unpauseAnimations()`, mouseleave/touchend calls `pauseAnimations()`.
- `src/components/IconCanvas.vue`: Passes `:pause-animations="true"` to `<Icon>` in the canvas grid.
- Typecheck: passes (pre-existing errors only).
- Lint: Icon.vue zero errors; remaining 22 errors are pre-existing in IconCanvas.vue and SearchHeader.vue.

## Verification
- Open /collection/svg-spinners or /collection/line-md
- All icons should be static (paused) by default
- Hover one icon: that single icon animates
- Leave hover: icon pauses again
- Drag/scroll: smooth, no lag
- Non-animated collections (lucide, etc.): no visual change
- IconDetail drawer (click to open): animation plays normally (pauseAnimations=false)
