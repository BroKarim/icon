<!-- src/components/IconDetailModal.vue -->
<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogPortal,
} from '@/components/ui/dialog'
import { collections } from '../data'
import { inBag, pushRecentIcon, toggleBag } from '../store'
import { dataUrlToBlob } from '../utils/dataUrlToBlob'
import { Download, getIconSnippet, toComponentName } from '../utils/icons'

const props = defineProps<{
  open: boolean
  icon: string
  iconColor?: string
}>()

const emit = defineEmits<{
  (e: 'update:open', val: boolean): void
  (e: 'update:iconColor', val: string): void
  (e: 'close'): void
}>()

// State
const copied = ref(false)
const copyLabel = ref('')
const showCopyMenu = ref(false)
const selectedCopyFormat = ref('SVG')

// Visual Controls
const isFill = ref(false)
const direction = ref<'Left' | 'Top' | 'Right'>('Right')
const edge = ref<'sharp' | 'round'>('sharp')
const stroke = ref('1px')
const iconSize = ref(96)

// Color presets
const colorPresets = [
  '#000000',
  '#FFFFFF',
  '#6B7280',
  '#EF4444',
  '#3B82F6',
  '#22C55E',
  '#EAB308',
  '#A855F7',
  '#F97316',
]

// Raw SVG for manipulation
const rawSvg = ref('')

async function fetchRawSvg() {
  rawSvg.value = await getIconSnippet(collections, props.icon, 'svg', false, 'currentColor') || ''
}

watch(() => props.icon, () => {
  fetchRawSvg()
}, { immediate: true })

// Customized SVG computed
const customizedSvg = computed(() => {
  if (!rawSvg.value)
    return ''
  let svg = rawSvg.value

  // Stroke width manipulation
  if (stroke.value !== '1px') {
    const sw = stroke.value.replace('px', '')
    svg = svg.replace(/stroke-width="[^"]*"/g, `stroke-width="${sw}"`)
  }

  // Fill mode
  if (isFill.value) {
    svg = svg.replace(/fill="none"/g, `fill="${props.iconColor || 'currentColor'}"`)
    // Handle paths with no fill attribute
    svg = svg.replace(/<path(?![^>]*fill=)/g, `<path fill="${props.iconColor || 'currentColor'}"`)
    svg = svg.replace(/<circle(?![^>]*fill=)/g, `<circle fill="${props.iconColor || 'currentColor'}"`)
    svg = svg.replace(/<rect(?![^>]*fill=)/g, `<rect fill="${props.iconColor || 'currentColor'}"`)
  }
  else {
    // Reset: set fill to none for shapes that had the custom fill applied
    const color = props.iconColor || 'currentColor'
    const escapedColor = color.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const fillRegex = new RegExp(`fill="${escapedColor}"`, 'g')
    svg = svg.replace(fillRegex, 'fill="none"')
  }

  // Color: replace currentColor with iconColor if specified
  if (props.iconColor && props.iconColor !== 'currentColor') {
    svg = svg.replace(/color:\s*currentColor/g, `color: ${props.iconColor}`)
  }

  return svg
})

// Direction transform
const directionTransform = computed(() => {
  switch (direction.value) {
    case 'Left': return 'scaleX(-1)'
    case 'Top': return 'scaleY(-1)'
    default: return 'none'
  }
})

// Computed
const collection = computed(() => {
  if (!props.icon)
    return null
  const prefix = props.icon.split(':')[0]
  return collections.find(c => c.id === prefix) || null
})

const iconName = computed(() => {
  if (!props.icon)
    return ''
  return props.icon.split(':')[1] || props.icon
})

// Dot Matrix Background
const DOT_GRID = `radial-gradient(circle, rgba(99, 102, 241, 0.25) 1.5px, transparent 1.5px)`

// Copy formats
const copyFormats = [
  { label: 'SVG', key: 'svg' },
  { label: 'JSX', key: 'jsx' },
  { label: 'TSX', key: 'tsx' },
  { label: 'Vue', key: 'vue' },
  { label: 'Svelte', key: 'svelte' },
  { label: 'Astro', key: 'astro' },
  { label: 'Data URL', key: 'data_url' },
]

function handleClose() {
  emit('update:open', false)
  emit('close')
}

async function executeCopy(type: string, label: string) {
  selectedCopyFormat.value = label
  showCopyMenu.value = false

  try {
    const snippet = await getIconSnippet(collections, props.icon, type.toLowerCase(), false, props.iconColor || 'currentColor')
    if (snippet) {
      await navigator.clipboard.writeText(snippet)
      copied.value = true
      copyLabel.value = `Copied as ${label}!`
      setTimeout(() => {
        copied.value = false
      }, 1500)
    }
  }
  catch {}
}

async function handleDownload(format: 'svg' | 'png') {
  pushRecentIcon(props.icon)
  const text = await getIconSnippet(collections, props.icon, format, false, props.iconColor || 'currentColor')
  if (!text)
    return
  const name = `${toComponentName(props.icon)}.${format}`
  const blob = format === 'png'
    ? dataUrlToBlob(text)
    : new Blob([text], { type: 'text/plain;charset=utf-8' })
  Download(blob, name)
}
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogPortal>
      <DialogOverlay class="fixed inset-0 z-50 bg-white/70 backdrop-blur-md transition-all duration-200" />

      <DialogContent class="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 border-0 bg-transparent p-0 shadow-none outline-none max-w-[880px] w-[92vw]">
        <!-- Floating Toolbar -->
        <div class="flex items-center justify-between mb-3 px-1 font-mono text-xs">
          <div class="flex items-center gap-2">
            <span class="rounded-full bg-white/90 px-3.5 py-1.5 font-bold text-zinc-800 shadow-sm border border-black/5 backdrop-blur-sm">
              {{ iconName }}
            </span>
            <RouterLink
              v-if="collection"
              :to="`/collection/${collection.id}`"
              class="rounded-full bg-white/90 px-3.5 py-1.5 text-zinc-600 shadow-sm border border-black/5 backdrop-blur-sm hover:text-black transition-colors"
            >
              {{ collection.name }}
            </RouterLink>
            <button
              type="button"
              class="flex items-center gap-1.5 rounded-full bg-white/90 px-3.5 py-1.5 text-zinc-600 shadow-sm border border-black/5 backdrop-blur-sm hover:text-black transition-all"
              :class="inBag(icon) ? '!text-indigo-600 !border-indigo-200 font-semibold' : ''"
              @click="toggleBag(icon)"
            >
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
              <span>{{ inBag(icon) ? 'In bag' : 'Add to bag' }}</span>
            </button>
          </div>
          <button
            type="button"
            class="flex items-center gap-1 rounded-full bg-white/90 px-3.5 py-1.5 text-zinc-600 shadow-sm border border-black/5 backdrop-blur-sm hover:text-black transition-colors"
            @click="handleClose"
          >
            <span>Close</span>
            <span class="text-sm leading-none">&times;</span>
          </button>
        </div>

        <!-- Main Dialog Box -->
        <div class="relative flex flex-col md:flex-row bg-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-black/5 overflow-hidden">
          <!-- Left: Preview -->
          <div
            class="flex-1 min-h-[320px] md:min-h-[460px] relative flex items-center justify-center border-b md:border-b-0 md:border-r border-zinc-100"
            :style="{
              backgroundImage: DOT_GRID,
              backgroundSize: '20px 20px',
              backgroundColor: '#FAFAFC',
            }"
          >
            <div
              class="relative z-10 transition-transform duration-200"
              :class="edge === 'round' ? 'rounded-full overflow-hidden' : ''"
              :style="{ transform: directionTransform }"
            >
              <div
                v-if="customizedSvg"
                class="transition-all select-none"
                :style="{ width: `${iconSize}px`, height: `${iconSize}px`, color: iconColor || 'currentColor' }"
                v-html="customizedSvg"
              />
              <Icon
                v-else
                :icon="icon"
                class="transition-all select-none"
                :style="{
                  fontSize: `${iconSize}px`,
                  color: iconColor || 'currentColor',
                }"
              />
            </div>
          </div>

          <!-- Right: Controls -->
          <div class="w-full md:w-[380px] p-7 flex flex-col justify-between font-mono bg-white">
            <div class="flex flex-col gap-5">
              <!-- Fill Toggle -->
              <div class="flex items-center justify-between text-xs text-zinc-600">
                <span>Fill</span>
                <button
                  type="button"
                  class="w-10 h-6 rounded-full p-1 transition-colors relative"
                  :class="isFill ? 'bg-sky-500' : 'bg-zinc-200'"
                  @click="isFill = !isFill"
                >
                  <div
                    class="w-4 h-4 rounded-full bg-white transition-transform"
                    :class="isFill ? 'translate-x-4' : 'translate-x-0'"
                  />
                </button>
              </div>

              <!-- Direction -->
              <div class="flex items-center justify-between text-xs text-zinc-600">
                <span>Direction</span>
                <div class="flex bg-sky-50 rounded-xl p-1 gap-1">
                  <button
                    v-for="d in ['Left', 'Top', 'Right'] as const"
                    :key="d"
                    type="button"
                    class="px-3 py-1 rounded-lg text-xs font-semibold transition-all"
                    :class="direction === d ? 'bg-sky-500 text-white shadow-sm' : 'text-sky-800/60 hover:text-sky-900'"
                    @click="direction = d"
                  >
                    {{ d }}
                  </button>
                </div>
              </div>

              <!-- Edge -->
              <div class="flex items-center justify-between text-xs text-zinc-600">
                <span>Edge</span>
                <div class="flex bg-sky-50 rounded-xl p-1 gap-1">
                  <button
                    type="button"
                    class="px-4 py-1 rounded-lg text-xs font-semibold transition-all"
                    :class="edge === 'sharp' ? 'bg-sky-500 text-white shadow-sm' : 'text-sky-800/60 hover:text-sky-900'"
                    @click="edge = 'sharp'"
                  >
                    <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M4 20V4h16" /></svg>
                  </button>
                  <button
                    type="button"
                    class="px-4 py-1 rounded-lg text-xs font-semibold transition-all"
                    :class="edge === 'round' ? 'bg-sky-500 text-white shadow-sm' : 'text-sky-800/60 hover:text-sky-900'"
                    @click="edge = 'round'"
                  >
                    <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M4 20v-8a8 8 0 0 1 8-8h8" /></svg>
                  </button>
                </div>
              </div>

              <!-- Stroke -->
              <div class="flex items-center justify-between text-xs text-zinc-600">
                <span>Stroke</span>
                <div class="flex bg-sky-50 rounded-xl p-1 gap-1 items-center">
                  <button
                    type="button"
                    class="px-3 py-1 rounded-lg text-xs font-semibold transition-all"
                    :class="stroke === '1px' ? 'bg-sky-500 text-white shadow-sm' : 'text-sky-800/60'"
                    @click="stroke = '1px'"
                  >
                    1px
                  </button>
                  <button
                    type="button"
                    class="px-3 py-1 rounded-lg text-xs font-semibold transition-all"
                    :class="stroke === '2px' ? 'bg-sky-500 text-white shadow-sm' : 'text-sky-800/60'"
                    @click="stroke = '2px'"
                  >
                    2px
                  </button>
                </div>
              </div>

              <!-- Size -->
              <div class="flex items-center justify-between text-xs text-zinc-600">
                <span>Size</span>
                <div class="flex items-center bg-sky-50 rounded-xl p-1">
                  <button
                    type="button"
                    class="w-7 h-7 flex items-center justify-center rounded-lg bg-sky-500 text-white text-sm font-bold shadow-sm active:scale-95 transition-all"
                    @click="iconSize = Math.max(32, iconSize - 16)"
                  >
                    -
                  </button>
                  <span class="px-3 text-xs font-bold text-sky-950 tabular-nums">{{ iconSize }}px</span>
                  <button
                    type="button"
                    class="w-7 h-7 flex items-center justify-center rounded-lg bg-sky-500 text-white text-sm font-bold shadow-sm active:scale-95 transition-all"
                    @click="iconSize = Math.min(256, iconSize + 16)"
                  >
                    +
                  </button>
                </div>
              </div>

              <!-- Color Presets + Copy -->
              <div class="flex items-center justify-between pt-3 border-t border-zinc-100 relative">
                <div class="flex items-center gap-1.5">
                  <button
                    v-for="c in colorPresets"
                    :key="c"
                    type="button"
                    class="w-5 h-5 rounded-full ring-2 transition-all"
                    :class="(iconColor || '#000000') === c ? 'ring-sky-500 ring-offset-1' : 'ring-zinc-200 hover:ring-zinc-400'"
                    :style="{ backgroundColor: c }"
                    @click="emit('update:iconColor', c)"
                  />
                </div>

                <div class="relative">
                  <button
                    type="button"
                    class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-xs font-semibold text-zinc-800 transition-colors"
                    @click="showCopyMenu = !showCopyMenu"
                  >
                    <span>Copy {{ selectedCopyFormat }}</span>
                    <svg class="w-3 h-3 text-zinc-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6" /></svg>
                  </button>

                  <div
                    v-if="showCopyMenu"
                    class="absolute right-0 bottom-full mb-2 w-36 rounded-2xl bg-white p-1.5 shadow-xl border border-zinc-100 flex flex-col gap-0.5 z-30"
                  >
                    <button
                      v-for="fmt in copyFormats"
                      :key="fmt.key"
                      type="button"
                      class="w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-700 hover:bg-zinc-100 transition-colors"
                      @click="executeCopy(fmt.key, fmt.label)"
                    >
                      Copy {{ fmt.label }}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Download Buttons -->
            <div class="grid grid-cols-2 gap-2.5 pt-6">
              <button
                type="button"
                class="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-xs font-bold text-zinc-900 transition-all active:scale-[0.98]"
                @click="handleDownload('svg')"
              >
                <span>Download SVG</span>
                <span>&darr;</span>
              </button>
              <button
                type="button"
                class="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-xs font-bold text-zinc-900 transition-all active:scale-[0.98]"
                @click="handleDownload('png')"
              >
                <span>Download PNG</span>
                <svg class="w-3.5 h-3.5 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Toast -->
        <Transition name="fade">
          <div
            v-if="copied"
            class="absolute top-16 left-1/2 -translate-x-1/2 z-50 bg-black text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-xl pointer-events-none"
          >
            {{ copyLabel }}
          </div>
        </Transition>
      </DialogContent>
    </DialogPortal>
  </Dialog>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translate(-50%, -6px);
}
</style>
