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

const copied = ref(false)
const copyLabel = ref('')
const showCopyMenu = ref(false)
const selectedCopyFormat = ref('SVG')

const isFill = ref(false)
const direction = ref<'none' | 'horizontal' | 'vertical'>('none')
const stroke = ref('1px')
const iconSize = ref(96)
const checkerboard = ref(false)

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

const rawSvg = ref('')

async function fetchRawSvg() {
  rawSvg.value = await getIconSnippet(collections, props.icon, 'svg', false, 'currentColor') || ''
}

watch(() => props.icon, () => {
  fetchRawSvg()
}, { immediate: true })

const directionTransform = computed(() => {
  switch (direction.value) {
    case 'horizontal': return 'scaleX(-1)'
    case 'vertical': return 'scaleY(-1)'
    default: return 'none'
  }
})

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
            :class="checkerboard ? 'preview-checker' : ''"
            :style="checkerboard ? {} : { backgroundColor: '#FAFAFC' }"
          >
            <div
              class="relative z-10 transition-transform duration-200 select-none"
              :style="{ transform: directionTransform }"
            >
              <iconify-icon
                v-if="rawSvg"
                :icon="icon"
                class="svg-preview"
                :style="{ width: `${iconSize}px`, height: `${iconSize}px`, color: iconColor || 'currentColor' }"
              />
              <iconify-icon
                v-else
                :icon="icon"
                class="transition-all select-none"
                :style="{ fontSize: `${iconSize}px`, color: iconColor || 'currentColor' }"
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
                    v-for="d in ['none', 'horizontal', 'vertical'] as const"
                    :key="d"
                    type="button"
                    class="px-3 py-1 rounded-lg text-xs font-semibold transition-all"
                    :class="direction === d ? 'bg-sky-500 text-white shadow-sm' : 'text-sky-800/60 hover:text-sky-900'"
                    @click="direction = d"
                  >
                    {{ d === 'none' ? 'None' : d === 'horizontal' ? 'Flip H' : 'Flip V' }}
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

              <!-- Background -->
              <div class="flex items-center justify-between text-xs text-zinc-600">
                <span>Background</span>
                <div class="flex bg-sky-50 rounded-xl p-1 gap-1">
                  <button
                    type="button"
                    class="px-3 py-1 rounded-lg text-xs font-semibold transition-all"
                    :class="!checkerboard ? 'bg-sky-500 text-white shadow-sm' : 'text-sky-800/60 hover:text-sky-900'"
                    @click="checkerboard = false"
                  >
                    Solid
                  </button>
                  <button
                    type="button"
                    class="px-3 py-1 rounded-lg text-xs font-semibold transition-all"
                    :class="checkerboard ? 'bg-sky-500 text-white shadow-sm' : 'text-sky-800/60 hover:text-sky-900'"
                    @click="checkerboard = true"
                  >
                    Checkered
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

.preview-checker {
  background-color: #fff;
  background-image:
    linear-gradient(45deg, #e5e5e5 25%, transparent 25%), linear-gradient(-45deg, #e5e5e5 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #e5e5e5 75%), linear-gradient(-45deg, transparent 75%, #e5e5e5 75%);
  background-size: 16px 16px;
  background-position:
    0 0,
    0 8px,
    8px -8px,
    -8px 0px;
}

/* CSS-driven SVG manipulation */

/* Override SVG sizing to fill container */
:deep(svg) {
  width: 100%;
  height: 100%;
}

/* Fill mode ON: fill shapes that have fill="none", hide stroke */
:deep(svg [fill='none']) {
  fill: currentColor;
}
:deep(svg [stroke]) {
  stroke: none;
}

/* Stroke width override */
:deep(svg *) {
  stroke-width: v-bind(stroke);
}
</style>
