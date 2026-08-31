<!-- src/components/SettingsModal.vue -->
<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogPortal,
} from '@/components/ui/dialog'
import { favoriteIcons } from '../store'

const props = defineProps<{
  open: boolean
  iconColor?: string
  iconStyle?: string
}>()

const emit = defineEmits<{
  (e: 'update:open', val: boolean): void
  (e: 'update:iconColor', value: string): void
  (e: 'update:iconStyle', value: string): void
  (e: 'close'): void
}>()

const router = useRouter()

const PRESET_COLORS = [
  '#000000',
  '#ef4444',
  '#f97316',
  '#eab308',
  '#22c55e',
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
]

const ICON_STYLES = [
  { id: 'line', label: 'Line', icon: 'carbon:circle-dash' },
  { id: 'solid', label: 'Solid', icon: 'carbon:circle-filled' },
  { id: 'filled', label: 'Filled', icon: 'carbon:circle' },
  { id: 'outlined', label: 'Outlined', icon: 'carbon:ellipse' },
]

const selectedColor = computed(() => props.iconColor || '#000000')
const selectedStyle = ref(props.iconStyle || 'line')
const customColor = ref(props.iconColor || '#000000')

watch(() => props.iconStyle, (v) => {
  if (v)
    selectedStyle.value = v
})

watch(() => props.iconColor, (v) => {
  if (v)
    customColor.value = v
})

function selectPreset(color: string) {
  emit('update:iconColor', color)
  customColor.value = color
}

function onCustomColorChange(e: Event) {
  const value = (e.target as HTMLInputElement).value
  customColor.value = value
  emit('update:iconColor', value)
}

function selectStyle(styleId: string) {
  selectedStyle.value = styleId
  emit('update:iconStyle', styleId)
}

function handleClose() {
  emit('update:open', false)
  emit('close')
}

function goToFavorites() {
  handleClose()
  router.push('/favorites')
}
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogPortal>
      <!-- Backdrop Blur Intens (Light Mode Focused) -->
      <DialogOverlay class="fixed inset-0 z-50 bg-white/70 backdrop-blur-md transition-all duration-200" />

      <DialogContent class="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 border-0 bg-transparent p-0 shadow-none outline-none max-w-[440px] w-[90vw]">
        <!-- Floating Toolbar (Above Modal) -->
        <div class="flex items-center justify-between mb-3 px-1 font-mono text-xs select-none">
          <!-- Left: Title & Counter -->
          <div class="flex items-center gap-2">
            <span class="rounded-full bg-white/90 px-3.5 py-1.5 font-bold text-zinc-800 shadow-sm border border-black/5 backdrop-blur-sm">
              Settings
            </span>
            <span class="rounded-full bg-white/90 px-3.5 py-1.5 text-zinc-600 shadow-sm border border-black/5 backdrop-blur-sm">
              {{ favoriteIcons.length }} fav
            </span>
          </div>

          <!-- Right: Close Button -->
          <button
            type="button"
            class="flex items-center gap-1 rounded-full bg-white/90 px-3.5 py-1.5 text-zinc-600 shadow-sm border border-black/5 backdrop-blur-sm hover:text-black transition-colors"
            @click="handleClose"
          >
            <span>Close</span>
            <span class="text-sm leading-none">&times;</span>
          </button>
        </div>

        <!-- Main Studio Box -->
        <div class="flex flex-col bg-white rounded-[32px] p-7 shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-black/5 font-mono select-none">
          <div class="flex flex-col gap-6">
            <!-- Section: Color Presets -->
            <div class="flex flex-col gap-3">
              <span class="text-xs text-zinc-500">Color Presets</span>
              <div class="grid grid-cols-4 gap-2.5">
                <button
                  v-for="color in PRESET_COLORS"
                  :key="color"
                  type="button"
                  class="h-9 w-full rounded-2xl border-2 transition-all hover:scale-105 active:scale-95"
                  :class="selectedColor.toUpperCase() === color.toUpperCase() ? 'border-zinc-900 shadow-sm ring-2 ring-zinc-900/10' : 'border-transparent'"
                  :style="{ backgroundColor: color }"
                  @click="selectPreset(color)"
                />
              </div>
            </div>

            <!-- Section: Custom Color (Picker + Hex Input) -->
            <div class="flex items-center justify-between text-xs text-zinc-600 pt-1">
              <span>Custom Color</span>
              <div class="flex items-center bg-sky-50 rounded-xl p-1 gap-2">
                <div class="relative w-6 h-6 rounded-lg overflow-hidden shrink-0 border border-sky-200">
                  <input
                    type="color"
                    :value="customColor"
                    class="absolute -inset-2 w-10 h-10 cursor-pointer border-0 p-0"
                    @input="onCustomColorChange"
                  >
                </div>
                <input
                  type="text"
                  :value="customColor"
                  class="w-20 bg-transparent text-xs font-mono font-bold text-sky-950 focus:outline-none uppercase"
                  placeholder="#000000"
                  maxlength="7"
                  @input="onCustomColorChange"
                >
              </div>
            </div>

            <!-- Section: Icon Style (Segmented Pill Grid) -->
            <div class="flex flex-col gap-3 pt-1">
              <span class="text-xs text-zinc-500">Icon Style</span>
              <div class="grid grid-cols-2 gap-2 bg-sky-50 rounded-2xl p-1.5">
                <button
                  v-for="style in ICON_STYLES"
                  :key="style.id"
                  type="button"
                  class="flex items-center justify-center gap-2 h-9 px-3 rounded-xl text-xs font-semibold transition-all active:scale-95"
                  :class="selectedStyle === style.id ? 'bg-sky-500 text-white shadow-sm' : 'text-sky-800/60 hover:text-sky-950 hover:bg-sky-100/50'"
                  @click="selectStyle(style.id)"
                >
                  <Icon :icon="style.icon" class="w-3.5 h-3.5" />
                  <span>{{ style.label }}</span>
                </button>
              </div>
            </div>

            <!-- Section: Navigation to Favorites -->
            <div class="pt-3 border-t border-zinc-100">
              <button
                type="button"
                class="flex items-center justify-between w-full py-3 px-4 rounded-2xl bg-zinc-50 hover:bg-zinc-100 text-xs font-bold text-zinc-900 transition-all active:scale-[0.98]"
                @click="goToFavorites"
              >
                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-red-500" viewBox="0 0 24 24" fill="currentColor"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>
                  <span>My Favorites</span>
                </div>
                <div class="flex items-center gap-1.5">
                  <span class="px-2 py-0.5 rounded-full bg-white text-[11px] text-zinc-500 border border-black/5 font-semibold">
                    {{ favoriteIcons.length }}
                  </span>
                  <svg class="w-3.5 h-3.5 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m9 18 6-6-6-6" /></svg>
                </div>
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </DialogPortal>
  </Dialog>
</template>
