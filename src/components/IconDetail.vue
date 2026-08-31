<!-- src/components/IconDetail.vue -->
<script setup lang="ts">
import { computed, ref } from 'vue'
import { collections } from '../data'
import { inBag, inFavorites, toggleBag, toggleFavorite } from '../store'
import { getIconSnippet } from '../utils/icons'

const props = defineProps<{
  icon: string
  showCollection?: boolean
  iconColor?: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const copied = ref(false)
const copyLabel = ref('')
const selectedColor = ref(props.iconColor || '#000000')

const COLOR_PRESETS = [
  '#000000',
  '#2563EB',
  '#7C3AED',
  '#DB2777',
  '#DC2626',
  '#D97706',
  '#059669',
  '#4B5563',
]

const collection = computed(() => {
  if (!props.icon) return null
  const prefix = props.icon.split(':')[0]
  return collections.find(c => c.id === prefix) || null
})

const iconName = computed(() => {
  if (!props.icon) return ''
  return props.icon.split(':')[1] || props.icon
})

const CHECKERBOARD = `url("data:image/svg+xml,%3Csvg width='8' height='8' viewBox='0 0 8 8' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='8' height='8' fill='%23f4f4f5'/%3E%3Crect width='4' height='4' fill='%23e4e4e7'/%3E%3Crect x='4' y='4' width='4' height='4' fill='%23e4e4e7'/%3E%3C/svg%3E")`

async function copySnippet(type: string, label: string) {
  try {
    const snippet = await getIconSnippet(collections, props.icon, type, false, selectedColor.value)
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

async function downloadAsset(type: 'svg' | 'png') {
  const snippet = await getIconSnippet(collections, props.icon, 'svg', false, selectedColor.value)
  if (!snippet) return

  if (type === 'svg') {
    const blob = new Blob([snippet], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${iconName.value}.svg`
    a.click()
    URL.revokeObjectURL(url)
  }
  else if (type === 'png') {
    const img = new Image()
    const svgBlob = new Blob([snippet], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(svgBlob)
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = 256
      canvas.height = 256
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(img, 0, 0, 256, 256)
        const pngUrl = canvas.toDataURL('image/png')
        const a = document.createElement('a')
        a.href = pngUrl
        a.download = `${iconName.value}.png`
        a.click()
      }
      URL.revokeObjectURL(url)
    }
    img.src = url
  }
}
</script>

<template>
  <div class="flex flex-col w-full h-full p-5 text-zinc-900 select-none">
    <!-- Header: Meta & Actions -->
    <div class="flex items-center justify-between pb-4 border-b border-zinc-200/80">
      <div class="flex flex-col min-w-0 pr-2">
        <h3 class="text-base font-bold truncate">
          {{ iconName }}
        </h3>
        <RouterLink
          v-if="showCollection && collection"
          :to="`/collection/${collection.id}`"
          class="text-xs text-zinc-500 hover:text-zinc-900 transition-colors truncate"
        >
          {{ collection.name }}
        </RouterLink>
      </div>

      <!-- Favorites & Bag Controls -->
      <div class="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          class="p-2 rounded-xl border border-zinc-200 hover:bg-zinc-100 transition-colors"
          :class="inFavorites(icon) ? 'text-red-500 bg-red-50 border-red-200' : 'text-zinc-600'"
          title="Favorite"
          @click="toggleFavorite(icon)"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" :fill="inFavorites(icon) ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
        </button>

        <button
          type="button"
          class="p-2 rounded-xl border border-zinc-200 hover:bg-zinc-100 transition-colors"
          :class="inBag(icon) ? 'text-indigo-600 bg-indigo-50 border-indigo-200' : 'text-zinc-600'"
          title="Bag"
          @click="toggleBag(icon)"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
        </button>
      </div>
    </div>

    <!-- Preview Container -->
    <div
      class="my-5 w-full h-48 rounded-2xl border border-zinc-200 flex items-center justify-center relative overflow-hidden"
      :style="{ backgroundImage: CHECKERBOARD, backgroundSize: '8px 8px' }"
    >
      <Icon
        :icon="icon"
        class="text-7xl select-none transition-transform active:scale-95"
        :style="{ color: selectedColor }"
      />
    </div>

    <!-- Section: Color Presets -->
    <div class="flex flex-col gap-2 mb-6">
      <span class="text-xs font-bold uppercase tracking-wider text-zinc-400">Color Presets</span>
      <div class="flex items-center gap-2 flex-wrap">
        <button
          v-for="c in COLOR_PRESETS"
          :key="c"
          type="button"
          class="w-7 h-7 rounded-full border-2 transition-all"
          :class="selectedColor === c ? 'border-zinc-900 scale-110 shadow-sm' : 'border-transparent hover:scale-105'"
          :style="{ backgroundColor: c }"
          @click="selectedColor = c"
        />
        <div class="relative flex items-center">
          <input
            v-model="selectedColor"
            type="color"
            class="w-7 h-7 rounded-full border-0 p-0 cursor-pointer overflow-hidden opacity-0 absolute inset-0"
          >
          <div
            class="w-7 h-7 rounded-full border-2 border-dashed border-zinc-300 flex items-center justify-center text-xs text-zinc-500 pointer-events-none"
          >
            +
          </div>
        </div>
      </div>
    </div>

    <!-- Section: Quick Copy Buttons -->
    <div class="flex flex-col gap-2 mb-6">
      <span class="text-xs font-bold uppercase tracking-wider text-zinc-400">Copy Code</span>
      <div class="grid grid-cols-2 gap-2">
        <button
          type="button"
          class="flex items-center justify-center py-2.5 px-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-xs font-bold text-zinc-800 transition-colors"
          @click="copySnippet('svg', 'SVG')"
        >
          Copy SVG
        </button>
        <button
          type="button"
          class="flex items-center justify-center py-2.5 px-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-xs font-bold text-zinc-800 transition-colors"
          @click="copySnippet('vue', 'Vue')"
        >
          Copy Vue
        </button>
        <button
          type="button"
          class="flex items-center justify-center py-2.5 px-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-xs font-bold text-zinc-800 transition-colors"
          @click="copySnippet('jsx', 'JSX')"
        >
          Copy JSX
        </button>
        <button
          type="button"
          class="flex items-center justify-center py-2.5 px-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-xs font-bold text-zinc-800 transition-colors"
          @click="copySnippet('data_url', 'Data URL')"
        >
          Copy Data URL
        </button>
      </div>
    </div>

    <!-- Section: Download Actions (Footer) -->
    <div class="mt-auto flex flex-col gap-2 pt-4 border-t border-zinc-200/80">
      <span class="text-xs font-bold uppercase tracking-wider text-zinc-400">Export Asset</span>
      <div class="grid grid-cols-2 gap-2">
        <button
          type="button"
          class="flex items-center justify-center gap-1.5 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold transition-all active:scale-[0.98]"
          @click="downloadAsset('svg')"
        >
          <span>Download SVG</span>
          <span>&darr;</span>
        </button>
        <button
          type="button"
          class="flex items-center justify-center gap-1.5 py-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-900 text-xs font-bold transition-all active:scale-[0.98]"
          @click="downloadAsset('png')"
        >
          <span>Download PNG</span>
          <span>&darr;</span>
        </button>
      </div>
    </div>

    <!-- Toast Notification -->
    <Transition name="fade">
      <div
        v-if="copied"
        class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-black text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg pointer-events-none"
      >
        {{ copyLabel }}
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translate(-50%, 6px);
}
</style>
