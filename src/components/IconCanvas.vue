<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
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

const scrollRef = ref<HTMLElement | null>(null)
const vpW = ref(0)
const vpH = ref(0)
const scrollX = ref(0)
const scrollY = ref(0)

function measureViewport() {
  if (!scrollRef.value)
    return
  vpW.value = scrollRef.value.clientWidth
  vpH.value = scrollRef.value.clientHeight
}

function syncScroll() {
  if (!scrollRef.value)
    return
  scrollX.value = scrollRef.value.scrollLeft
  scrollY.value = scrollRef.value.scrollTop
}

const isDragging = ref(false)
let startX = 0
let startY = 0
let startScrollX = 0
let startScrollY = 0
let moved = false

function onPointerDown(e: PointerEvent) {
  if (e.button !== 0 || !scrollRef.value)
    return
  isDragging.value = true
  moved = false
  startX = e.clientX
  startY = e.clientY
  startScrollX = scrollRef.value.scrollLeft
  startScrollY = scrollRef.value.scrollTop
  scrollRef.value.setPointerCapture(e.pointerId)
}

function onPointerMove(e: PointerEvent) {
  if (!isDragging.value || !scrollRef.value)
    return
  const dx = e.clientX - startX
  const dy = e.clientY - startY
  if (Math.abs(dx) > 3 || Math.abs(dy) > 3)
    moved = true
  scrollRef.value.scrollLeft = startScrollX - dx
  scrollRef.value.scrollTop = startScrollY - dy
  syncScroll()
}

function onPointerUp(e: PointerEvent) {
  isDragging.value = false
  if (scrollRef.value?.hasPointerCapture(e.pointerId))
    scrollRef.value.releasePointerCapture(e.pointerId)
}

const ICON_BOX = 170
const ICON_SIZE = 88
const COLUMN_GAP = 240
const ROW_GAP = 230
const BUFFER = 300

// Infinite surface: besar sekali, scroll mulai di tengah
const SURFACE_SIZE = 200_000

// Jumlah kolom yang konsisten (tidak bergantung vpW agar grid stabil)
const GRID_COLUMNS = 30

function iconAt(col: number, row: number, source: SearchResult[]) {
  if (!source.length)
    return null
  const len = source.length

  if (len === 1)
    return source[0]

  // Distribusi 2D agar tidak ada pola stripe
  // Gunakan coprime shift supaya setiap baris versatz
  const rowShift = getCoprimeShift(len, 2)
  const colShift = getCoprimeShift(len, 1, rowShift)
  const index = ((row * rowShift + col * colShift + (row % len)) % len + len) % len
  return source[index]
}

// Virtual grid: hanya render icon yang visible berdasarkan scroll position
const visibleIcons = computed(() => {
  if (!props.results.length)
    return []

  const source = props.results
  const left = scrollX.value - BUFFER
  const right = scrollX.value + vpW.value + BUFFER
  const top = scrollY.value - BUFFER
  const bottom = scrollY.value + vpH.value + BUFFER

  // Hitung range kolom & baris yang visible
  const colStart = Math.floor(left / COLUMN_GAP)
  const colEnd = Math.ceil(right / COLUMN_GAP)
  const rowStart = Math.floor(top / ROW_GAP)
  const rowEnd = Math.ceil(bottom / ROW_GAP)

  const icons = []
  for (let row = rowStart; row <= rowEnd; row++) {
    for (let col = colStart; col <= colEnd; col++) {
      const icon = iconAt(col, row, source)
      if (!icon)
        continue

      // Jitter deterministik berdasarkan posisi grid
      const idx = Math.abs(row * GRID_COLUMNS + col)
      const xJitter = ((idx * 37) % 28) - 14
      const yJitter = ((idx * 53) % 24) - 12

      icons.push({
        ...icon,
        repeatKey: `${col}-${row}`,
        x: col * COLUMN_GAP + ICON_BOX / 2 + xJitter,
        y: row * ROW_GAP + ICON_BOX / 2 + yJitter,
      })
    }
  }
  return icons
})

function onIconClick(iconFull: string) {
  if (!moved)
    emit('select', iconFull)
}

function centerCanvas() {
  if (!scrollRef.value)
    return
  // Scroll ke tengah surface
  scrollRef.value.scrollLeft = SURFACE_SIZE / 2 - vpW.value / 2
  scrollRef.value.scrollTop = SURFACE_SIZE / 2 - vpH.value / 2
  syncScroll()
}

onMounted(() => {
  measureViewport()
  syncScroll()
  nextTick(centerCanvas)
  window.addEventListener('resize', measureViewport)
})

onUnmounted(() => {
  window.removeEventListener('resize', measureViewport)
})

watch(() => [props.results.length, props.results[0]?.iconFull], async () => {
  await nextTick()
  measureViewport()
  centerCanvas()
})

function getCoprimeShift(length: number, preferred: number, avoid?: number) {
  for (let shift = preferred; shift < length; shift++) {
    if (shift !== avoid && gcd(shift, length) === 1)
      return shift
  }
  for (let shift = 1; shift < length; shift++) {
    if (shift !== avoid)
      return shift
  }
  return 1
}

function gcd(a: number, b: number): number {
  let x = Math.abs(a)
  let y = Math.abs(b)
  while (y !== 0) { const t = y; y = x % y; x = t }
  return x
}
</script>

<template>
  <div
    ref="scrollRef"
    class="absolute inset-0 overflow-auto select-none overscroll-contain"
    :class="isDragging ? 'cursor-grabbing' : 'cursor-grab'"
    @scroll="syncScroll"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
    @pointercancel="onPointerUp"
    @dragstart.prevent
  >
    <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.72),_rgba(247,243,236,0.96)_56%,_rgba(244,238,228,1)_100%)]" />

    <div v-if="loading" class="absolute inset-0 flex items-center justify-center z-20">
      <Icon icon="carbon:circle-dash" class="text-2xl animate-spin op50" />
    </div>

    <div
      v-else-if="!loading && results.length === 0"
      class="absolute inset-0 flex items-center justify-center op40 text-sm z-20"
    >
      No icons found
    </div>

    <!-- Surface besar untuk infinite scroll -->
    <div
      v-else
      class="relative"
      :style="{ width: `${SURFACE_SIZE}px`, height: `${SURFACE_SIZE}px` }"
    >
      <div
        v-for="icon in visibleIcons"
        :key="icon.repeatKey"
        class="group absolute flex items-center justify-center rounded-[32px] transition duration-200 ease-out hover:-translate-y-1 hover:scale-[1.03]"
        :style="{
          left: `${icon.x}px`,
          top: `${icon.y}px`,
          marginLeft: `-${ICON_BOX / 2}px`,
          marginTop: `-${ICON_BOX / 2}px`,
          width: `${ICON_BOX}px`,
          height: `${ICON_BOX}px`,
        }"
        @click.stop="onIconClick(icon.iconFull)"
      >
        <Icon
          :icon="icon.iconFull"
          class="pointer-events-none drop-shadow-[0_16px_20px_rgba(0,0,0,0.10)]"
          :style="{ fontSize: `${ICON_SIZE}px` }"
        />
        <span class="pointer-events-none absolute top-full mt-3 rounded-full bg-white/84 px-3 py-1 text-[11px] font-medium text-black/52 opacity-0 shadow-[0_10px_30px_rgba(0,0,0,0.08)] backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100">
          {{ icon.iconName }}
        </span>
      </div>
    </div>
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
