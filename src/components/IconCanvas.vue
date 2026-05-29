<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
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
  iconColor?: string
  iconScale?: number
}

const props = withDefaults(defineProps<Props>(), {
  iconColor: '#000000',
  iconScale: 1,
})

const emit = defineEmits<{ (e: 'select', iconFull: string): void }>()

// ─── constants ───────────────────────────────────────────────────────────────
const MIN_VELOCITY = 0.05
const UPDATE_INTERVAL = 16
const VELOCITY_HISTORY_SIZE = 5
const FRICTION = 0.997
const VELOCITY_SCALE = 16
const BUFFER = 1

// ─── center clear zone ───────────────────────────────────────────────────────
const CENTER_CLEAR_RADIUS_X = 220
const CENTER_CLEAR_RADIUS_Y = 140

// ─── refs ────────────────────────────────────────────────────────────────────
const containerRef = ref<HTMLElement | null>(null)
const offset = ref({ x: 0, y: 0 })
const isDragging = ref(false)
const isMoving = ref(false)
const gridItems = ref<{ position: { x: number, y: number }, gridIndex: number }[]>([])

let startPos = { x: 0, y: 0 }
let velocity = { x: 0, y: 0 }
let velocityHistory: { x: number, y: number }[] = []
let lastPos = { x: 0, y: 0 }
let lastMoveTime = 0
let lastUpdateTime = 0
let animationFrame: number | null = null
let cachedWidth = 0
let cachedHeight = 0
let lastGridCenter = { x: Infinity, y: Infinity }
let restPos = { x: 0, y: 0 }
let moved = false
let stopMovingTimer: ReturnType<typeof setTimeout> | null = null

// ─── computed grid size ───────────────────────────────────────────────────────
const GRID_SIZE = computed(() => Math.round(130 * (props.iconScale ?? 1)))
const ICON_SIZE = computed(() => Math.round(88 * (props.iconScale ?? 1)))

// ─── grid index via spiral ────────────────────────────────────────────────────
function getItemIndexForPosition(x: number, y: number): number {
  if (x === 0 && y === 0)
    return 0
  const layer = Math.max(Math.abs(x), Math.abs(y))
  const innerLayersSize = (2 * layer - 1) ** 2
  let positionInLayer = 0
  if (y === 0 && x === layer)
    positionInLayer = 0
  else if (y < 0 && x === layer)
    positionInLayer = -y
  else if (y === -layer && x > -layer)
    positionInLayer = layer + (layer - x)
  else if (x === -layer && y < layer)
    positionInLayer = 3 * layer + (layer + y)
  else if (y === layer && x < layer)
    positionInLayer = 5 * layer + (layer + x)
  else positionInLayer = 7 * layer + (layer - y)
  return innerLayersSize + positionInLayer
}

// ─── icon selection with coprime distribution + jitter ───────────────────────
function gcd(a: number, b: number): number {
  let x = Math.abs(a); let y = Math.abs(b)
  while (y !== 0) { const t = y; y = x % y; x = t }
  return x
}

function getCoprimeShift(length: number, preferred: number, avoid?: number): number {
  for (let s = preferred; s < length; s++) {
    if (s !== avoid && gcd(s, length) === 1)
      return s
  }
  for (let s = 1; s < length; s++) {
    if (s !== avoid)
      return s
  }
  return 1
}

function iconForIndex(gridIndex: number): SearchResult | null {
  const source = props.results
  if (!source.length)
    return null
  if (source.length === 1)
    return source[0]
  if (source.length === 2)
    return source[gridIndex % 2]
  const len = source.length
  const rowShift = getCoprimeShift(len, 2)
  const colShift = getCoprimeShift(len, 1, rowShift)
  const idx = ((gridIndex * colShift + Math.floor(gridIndex / 10) * rowShift) % len + len) % len
  return source[idx]
}

function jitterForIndex(_gridIndex: number) {
  return { xJitter: 0, yJitter: 0 }
}

// ─── visible items ────────────────────────────────────────────────────────────
const visibleItems = computed(() => {
  return gridItems.value
    .map((item) => {
      const icon = iconForIndex(item.gridIndex)
      if (!icon)
        return null
      const { xJitter, yJitter } = jitterForIndex(item.gridIndex)
      const x = item.position.x * GRID_SIZE.value + cachedWidth / 2 + xJitter
      const y = item.position.y * GRID_SIZE.value + cachedHeight / 2 + yJitter
      return { ...icon, x, y, gridIndex: item.gridIndex, position: item.position }
    })
    .filter(Boolean)
    .filter((icon) => {
      // skip icon yang berada di area center agar slot center tidak tertimpa
      const relX = Math.abs(icon!.x - cachedWidth / 2)
      const relY = Math.abs(icon!.y - cachedHeight / 2)
      return relX > CENTER_CLEAR_RADIUS_X || relY > CENTER_CLEAR_RADIUS_Y
    }) as (SearchResult & { x: number, y: number, gridIndex: number, position: { x: number, y: number } })[]
})

// ─── grid calculation ─────────────────────────────────────────────────────────
function calculateVisiblePositions() {
  const w = cachedWidth; const h = cachedHeight
  if (!w && !h)
    return null

  const gs = GRID_SIZE.value
  const centerX = -Math.round(offset.value.x / gs)
  const centerY = -Math.round(offset.value.y / gs)

  if (centerX === lastGridCenter.x && centerY === lastGridCenter.y)
    return null
  lastGridCenter = { x: centerX, y: centerY }

  const cellsX = Math.ceil(w / gs)
  const cellsY = Math.ceil(h / gs)
  const halfX = Math.ceil(cellsX / 2) + BUFFER
  const halfY = Math.ceil(cellsY / 2) + BUFFER

  const positions: { x: number, y: number }[] = []
  for (let y = centerY - halfY; y <= centerY + halfY; y++) {
    for (let x = centerX - halfX; x <= centerX + halfX; x++)
      positions.push({ x, y })
  }

  return positions
}

function updateGridItems() {
  const positions = calculateVisiblePositions()
  if (positions === null) {
    const dx = offset.value.x - restPos.x
    const dy = offset.value.y - restPos.y
    const dist = Math.sqrt(dx * dx + dy * dy)
    if (dist > 5 !== isMoving.value)
      isMoving.value = dist > 5
    scheduleStopMoving()
    return
  }
  gridItems.value = positions.map(pos => ({
    position: pos,
    gridIndex: getItemIndexForPosition(pos.x, pos.y),
  }))
  const dx = offset.value.x - restPos.x
  const dy = offset.value.y - restPos.y
  isMoving.value = Math.sqrt(dx * dx + dy * dy) > 5
  scheduleStopMoving()
}

function scheduleStopMoving() {
  if (stopMovingTimer)
    clearTimeout(stopMovingTimer)
  stopMovingTimer = setTimeout(() => {
    isMoving.value = false
    restPos = { ...offset.value }
  }, 200)
}

// ─── animation loop ───────────────────────────────────────────────────────────
function animate() {
  const now = performance.now()
  const dt = now - lastUpdateTime

  if (dt >= UPDATE_INTERVAL) {
    const speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y)
    if (speed < MIN_VELOCITY) {
      velocity = { x: 0, y: 0 }
      animationFrame = null
      return
    }
    const decel = FRICTION ** dt
    const frameDt = dt / UPDATE_INTERVAL
    offset.value = {
      x: offset.value.x + velocity.x * frameDt,
      y: offset.value.y + velocity.y * frameDt,
    }
    velocity = { x: velocity.x * decel, y: velocity.y * decel }
    lastUpdateTime = now
    updateGridItems()
  }

  animationFrame = requestAnimationFrame(animate)
}

// ─── pointer handlers ─────────────────────────────────────────────────────────
function handleDown(p: { x: number, y: number }) {
  if (animationFrame) { cancelAnimationFrame(animationFrame); animationFrame = null }
  isDragging.value = true
  moved = false
  startPos = { x: p.x - offset.value.x, y: p.y - offset.value.y }
  velocity = { x: 0, y: 0 }
  velocityHistory = []
  lastMoveTime = performance.now()
  lastPos = { ...p }
}

function handleMove(p: { x: number, y: number }) {
  if (!isDragging.value)
    return
  const now = performance.now()
  const timeDelta = now - lastMoveTime || 1

  const dx = p.x - lastPos.x
  const dy = p.y - lastPos.y
  if (Math.abs(dx) > 2 || Math.abs(dy) > 2)
    moved = true

  const rawVel = { x: (p.x - lastPos.x) / timeDelta, y: (p.y - lastPos.y) / timeDelta }
  velocityHistory.push(rawVel)
  if (velocityHistory.length > VELOCITY_HISTORY_SIZE)
    velocityHistory.shift()

  let totalWeight = 0
  const smoothed = velocityHistory.reduce((acc, v, i) => {
    const w = 2 ** i
    totalWeight += w
    return { x: acc.x + v.x * w, y: acc.y + v.y * w }
  }, { x: 0, y: 0 })
  smoothed.x /= totalWeight
  smoothed.y /= totalWeight

  velocity = smoothed
  offset.value = { x: p.x - startPos.x, y: p.y - startPos.y }
  lastMoveTime = now
  lastPos = { ...p }
  updateGridItems()
}

function handleUp() {
  const timeSince = performance.now() - lastMoveTime
  if (timeSince > 100)
    velocity = { x: 0, y: 0 }
  else velocity = { x: velocity.x * VELOCITY_SCALE, y: velocity.y * VELOCITY_SCALE }
  isDragging.value = false
  lastUpdateTime = performance.now()
  animationFrame = requestAnimationFrame(animate)
}

function onMouseDown(e: MouseEvent) { handleDown({ x: e.clientX, y: e.clientY }) }
function onMouseMove(e: MouseEvent) { e.preventDefault(); handleMove({ x: e.clientX, y: e.clientY }) }
function onMouseUp() { handleUp() }

function onTouchStart(e: TouchEvent) {
  const t = e.touches[0]; if (!t)
    return
  handleDown({ x: t.clientX, y: t.clientY })
}
function onTouchMove(e: TouchEvent) {
  const t = e.touches[0]; if (!t)
    return
  e.preventDefault(); handleMove({ x: t.clientX, y: t.clientY })
}
function onTouchEnd() { handleUp() }

function onWheel(e: WheelEvent) {
  e.preventDefault()
  offset.value = { x: offset.value.x - e.deltaX, y: offset.value.y - e.deltaY }
  velocity = { x: 0, y: 0 }
  lastGridCenter = { x: Infinity, y: Infinity }
  updateGridItems()
}

function onIconClick(iconFull: string) {
  if (!moved)
    emit('select', iconFull)
}

// ─── resize ───────────────────────────────────────────────────────────────────
function cacheSize() {
  if (!containerRef.value)
    return
  const r = containerRef.value.getBoundingClientRect()
  cachedWidth = r.width
  cachedHeight = r.height
}

function handleResize() {
  cacheSize()
  lastGridCenter = { x: Infinity, y: Infinity }
  updateGridItems()
}

// ─── lifecycle ────────────────────────────────────────────────────────────────
onMounted(() => {
  cacheSize()
  updateGridItems()
  containerRef.value?.addEventListener('wheel', onWheel, { passive: false })
  containerRef.value?.addEventListener('touchmove', onTouchMove, { passive: false })
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (animationFrame)
    cancelAnimationFrame(animationFrame)
  if (stopMovingTimer)
    clearTimeout(stopMovingTimer)
  containerRef.value?.removeEventListener('wheel', onWheel)
  containerRef.value?.removeEventListener('touchmove', onTouchMove)
  window.removeEventListener('resize', handleResize)
})

watch(() => props.iconScale, () => {
  lastGridCenter = { x: Infinity, y: Infinity }
  updateGridItems()
})
</script>

<template>
  <div
    ref="containerRef"
    class="absolute inset-0 select-none overflow-hidden"
    :style="{ touchAction: 'none', cursor: isDragging ? 'grabbing' : 'grab' }"
    @mousedown="onMouseDown"
    @mousemove="onMouseMove"
    @mouseup="onMouseUp"
    @mouseleave="onMouseUp"
    @touchstart="onTouchStart"
    @touchend="onTouchEnd"
    @touchcancel="onTouchEnd"
    @dragstart.prevent
  >
    <!-- background -->
    <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.72),_rgba(247,243,236,0.96)_56%,_rgba(244,238,228,1)_100%)]" />

    <!-- loading -->
    <div v-if="loading" class="absolute inset-0 flex items-center justify-center z-20">
      <Icon icon="carbon:circle-dash" class="text-2xl animate-spin op50" />
    </div>

    <!-- empty -->
    <div
      v-else-if="!loading && results.length === 0"
      class="absolute inset-0 flex items-center justify-center op40 text-sm z-20"
    >
      No icons found
    </div>

    <!-- canvas -->
    <div
      v-else
      class="absolute inset-0"
      :style="{
        transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
        willChange: 'transform',
      }"
    >
      <!-- center content slot — moves with the canvas -->
      <div
        class="absolute pointer-events-none flex flex-col items-center justify-center text-center select-none"
        style="left: 50%; top: 50%; transform: translate(-50%, -50%); min-width: 400px; min-height: 250px; "
      >
        <slot name="center" />
      </div>
      <div
        v-for="icon in visibleItems"
        :key="`${icon.position.x}-${icon.position.y}`"
        class="group absolute flex flex-col items-center justify-center rounded-[32px] transition-transform duration-200 ease-out hover:-translate-y-1 hover:scale-[1.03]"
        :style="{
          width: `${GRID_SIZE}px`,
          height: `${GRID_SIZE}px`,
          transform: `translate3d(${icon.x}px, ${icon.y}px, 0)`,
          marginLeft: `-${GRID_SIZE / 2}px`,
          marginTop: `-${GRID_SIZE / 2}px`,
          color: iconColor,
        }"
        @click.stop="onIconClick(icon.iconFull)"
      >
        <Icon
          :icon="icon.iconFull"
          class="pointer-events-none drop-shadow-[0_16px_20px_rgba(0,0,0,0.10)]"
          :style="{ fontSize: `${ICON_SIZE}px` }"
        />
        <span class="pointer-events-none mt-1.5 rounded-full bg-white/84 px-2.5 py-0.5 text-[10px] font-medium text-black/52 opacity-0 shadow-[0_10px_30px_rgba(0,0,0,0.08)] backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100 whitespace-nowrap">
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
