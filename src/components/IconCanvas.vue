<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import Icon from './Icon.vue'

interface SearchResult {
  collectionId: string
  collectionName: string
  iconName: string
  iconFull: string
  matchType: 'exact' | 'prefix' | 'fuzzy' | 'alias'
}

interface Props {
  results: SearchResult[]
  loading: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{ (e: 'select', iconFull: string): void }>()

// ─── Canvas ref & viewport ───────────────────────────────────────────────────
const canvasRef = ref<HTMLElement | null>(null)
const vpW = ref(0)
const vpH = ref(0)

function measureViewport() {
  if (!canvasRef.value)
    return
  vpW.value = canvasRef.value.clientWidth
  vpH.value = canvasRef.value.clientHeight
}

// ─── Pan state ───────────────────────────────────────────────────────────────
const panX = ref(0)
const panY = ref(0)
const isDragging = ref(false)

let startX = 0
let startY = 0
let startPanX = 0
let startPanY = 0
let moved = false // distinguish click vs drag

function onPointerDown(e: PointerEvent) {
  if (e.button !== 0)
    return
  isDragging.value = true
  moved = false
  startX = e.clientX
  startY = e.clientY
  startPanX = panX.value
  startPanY = panY.value
  ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
}

function onPointerMove(e: PointerEvent) {
  if (!isDragging.value)
    return
  const dx = e.clientX - startX
  const dy = e.clientY - startY
  if (Math.abs(dx) > 3 || Math.abs(dy) > 3)
    moved = true
  // Math: new pan = startPan + delta mouse
  panX.value = startPanX + dx
  panY.value = startPanY + dy
}

function onPointerUp(e: PointerEvent) {
  isDragging.value = false
  ;(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId)
}

// ─── Icon layout ─────────────────────────────────────────────────────────────
const ICON_SIZE = 72 // px per cell
const COLS = 12 // icons per row → grid wraps every 12

/**
 * Grid layout: icons placed in a centered grid.
 * Row = Math.floor(i / COLS)
 * Col = i % COLS
 *
 * Center offset: shift grid so it starts centered in viewport
 * originX = -((COLS * ICON_SIZE) / 2)  → left edge of grid
 * originY = 0 → start from top, user pans up/down
 */
const positionedIcons = computed(() => {
  const totalWidth = COLS * ICON_SIZE
  const originX = -(totalWidth / 2)

  return props.results.map((icon, i) => {
    const col = i % COLS
    const row = Math.floor(i / COLS)
    return {
      ...icon,
      x: originX + col * ICON_SIZE,
      y: row * ICON_SIZE,
    }
  })
})

// ─── Virtualization (culling) ─────────────────────────────────────────────────
const BUFFER = 150

const visibleIcons = computed(() => {
  const px = panX.value
  const py = panY.value
  const w = vpW.value
  const h = vpH.value

  return positionedIcons.value.filter(({ x, y }) => {
    // screenX = icon.x + panX  →  visible if inside viewport + buffer
    const sx = x + px
    const sy = y + py
    return sx > -BUFFER && sx < w + BUFFER && sy > -BUFFER && sy < h + BUFFER
  })
})

// ─── Click guard (no select on drag) ─────────────────────────────────────────
function onIconClick(iconFull: string) {
  if (!moved)
    emit('select', iconFull)
}

// ─── Lifecycle ────────────────────────────────────────────────────────────────
onMounted(() => {
  measureViewport()
  // Center canvas horizontally so grid starts in middle
  panX.value = vpW.value / 2
  panY.value = 80 // small top padding
  window.addEventListener('resize', measureViewport)
})

onUnmounted(() => {
  window.removeEventListener('resize', measureViewport)
})
</script>

<template>
  <div
    ref="canvasRef"
    class="relative w-full h-full overflow-hidden bg-base select-none"
    :class="isDragging ? 'cursor-grabbing' : 'cursor-grab'"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
    @pointercancel="onPointerUp"
  >
    <!-- Loading -->
    <div v-if="loading" class="absolute inset-0 flex items-center justify-center">
      <Icon icon="carbon:circle-dash" class="text-2xl animate-spin op50" />
    </div>

    <!-- Empty -->
    <div
      v-else-if="!loading && results.length === 0"
      class="absolute inset-0 flex items-center justify-center op40 text-sm"
    >
      No icons found
    </div>

    <!-- Canvas: GPU-accelerated via translate3d -->
    <div
      v-else
      class="absolute top-0 left-0 will-change-transform"
      :style="{ transform: `translate3d(${panX}px, ${panY}px, 0)` }"
    >
      <div
        v-for="icon in visibleIcons"
        :key="icon.iconFull"
        class="absolute flex flex-col items-center justify-center gap-1 rounded-xl p-2 transition-colors duration-150 hover:bg-gray-100 dark:hover:bg-white/5"
        :style="{
          left: `${icon.x}px`,
          top: `${icon.y}px`,
          width: `${ICON_SIZE}px`,
          height: `${ICON_SIZE}px`,
        }"
        @click.stop="onIconClick(icon.iconFull)"
      >
        <Icon :icon="icon.iconFull" class="text-3xl pointer-events-none" />
        <span class="text-[10px] op50 truncate w-full text-center leading-tight pointer-events-none">
          {{ icon.iconName }}
        </span>
      </div>
    </div>

    <!-- Fade edges untuk nuansa infinite -->
    <div class="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-base to-transparent pointer-events-none" />
    <div class="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-base to-transparent pointer-events-none" />
    <div class="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-base to-transparent pointer-events-none" />
    <div class="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-base to-transparent pointer-events-none" />
  </div>
</template>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
