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
const SURFACE_PADDING_X = 900
const SURFACE_PADDING_Y = 520
const TOP_OFFSET = 150

const positionedIcons = computed(() => {
  const columns = Math.max(6, Math.ceil(Math.sqrt(Math.max(props.results.length, 1) * 1.75)))
  const contentOffsetX = SURFACE_PADDING_X + ICON_BOX / 2
  const contentOffsetY = SURFACE_PADDING_Y + TOP_OFFSET

  return props.results.map((icon, i) => {
    const col = i % columns
    const row = Math.floor(i / columns)
    const xJitter = ((i * 37) % 28) - 14
    const yJitter = ((i * 53) % 24) - 12

    return {
      ...icon,
      x: contentOffsetX + col * COLUMN_GAP + xJitter,
      y: contentOffsetY + row * ROW_GAP + yJitter,
    }
  })
})

const surfaceWidth = computed(() => {
  const maxX = positionedIcons.value.length
    ? Math.max(...positionedIcons.value.map(icon => icon.x))
    : 0

  return Math.max(vpW.value + SURFACE_PADDING_X * 2, maxX + SURFACE_PADDING_X)
})

const surfaceHeight = computed(() => {
  const maxY = positionedIcons.value.length
    ? Math.max(...positionedIcons.value.map(icon => icon.y))
    : 0

  return Math.max(vpH.value + SURFACE_PADDING_Y * 2, maxY + SURFACE_PADDING_Y)
})

const BUFFER = 150

const visibleIcons = computed(() => {
  const left = scrollX.value - BUFFER
  const right = scrollX.value + vpW.value + BUFFER
  const top = scrollY.value - BUFFER
  const bottom = scrollY.value + vpH.value + BUFFER

  return positionedIcons.value.filter(({ x, y }) => {
    const iconLeft = x - ICON_BOX / 2
    const iconRight = x + ICON_BOX / 2
    const iconTop = y - ICON_BOX / 2
    const iconBottom = y + ICON_BOX / 2

    return iconRight > left && iconLeft < right && iconBottom > top && iconTop < bottom
  })
})

function onIconClick(iconFull: string) {
  if (!moved)
    emit('select', iconFull)
}

function centerCanvas() {
  if (!scrollRef.value || !positionedIcons.value.length)
    return

  const columns = Math.max(6, Math.ceil(Math.sqrt(Math.max(props.results.length, 1) * 1.75)))
  const contentWidth = Math.max(0, (columns - 1) * COLUMN_GAP)
  const left = SURFACE_PADDING_X + contentWidth / 2 - vpW.value / 2
  const top = SURFACE_PADDING_Y + TOP_OFFSET - 70

  scrollRef.value.scrollLeft = Math.max(0, left)
  scrollRef.value.scrollTop = Math.max(0, top)
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

    <div
      v-else
      class="relative"
      :style="{
        width: `${surfaceWidth}px`,
        height: `${surfaceHeight}px`,
      }"
    >
      <div
        v-for="icon in visibleIcons"
        :key="icon.iconFull"
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
