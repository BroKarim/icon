# Findings: SMIL Animation Performance on IconCanvas

## Problem

- `src/pages/collection/[id].vue` loads IconCanvas which renders a grid of icons.
- Collections with animated SVGs (svg-spinners, line-md, meteocons, eos-icons, codex) cause lag.
- Hundreds of icons in viewport each running SMIL `<animate>`/`<animateTransform>` loops.

## Root Cause

- iconify-icon v3.0.2 forces SVG render mode for animated icons (detected via `body.indexOf('<a')`).
- No built-in "disable animation" API. Only `restartAnimation()` exists.
- `loadIcon()` does not return an `animated` flag.
- `mode="style"/"bg"/"mask"` would freeze animations but breaks `stroke-width` CSS for line-md.

## Solution

- iconify-icon uses `attachShadow({ mode: 'open' })` — we can access `<svg>` inside.
- Native SVG `pauseAnimations()` / `unpauseAnimations()` API freezes SMIL clock.
- `pauseAnimations()` is no-op for non-animated SVGs — safe to call on all icons.
- MutationObserver on shadow root detects SVG render completion.

## Key Files

| File                                              | Role                                                      |
| ------------------------------------------------- | --------------------------------------------------------- |
| `src/components/Icon.vue`                         | Creates iconify-icon element, LRU cache, loadIcon wrapper |
| `src/components/IconCanvas.vue`                   | Infinite grid rendering icons via `<Icon>` in v-for       |
| `src/pages/collection/[id].vue`                   | Collection page using IconCanvas                          |
| `node_modules/iconify-icon/dist/iconify-icon.mjs` | v3.0.2; shadow root at l.1939, renderIcon at l.2207       |

## Animated Collections

| Collection   | `<animate>` count | Has tag |
| ------------ | ----------------- | ------- |
| svg-spinners | 224               | yes     |
| line-md      | 4526              | yes     |
| meteocons    | 776+1545          | yes     |
| eos-icons    | present           | no      |
| codex        | present           | no      |
