<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { favoriteIcons } from '../store'

const props = defineProps<{
  iconColor?: string
  iconStyle?: string
}>()

const emit = defineEmits<{
  (e: 'update:iconColor', value: string): void
  (e: 'update:iconStyle', value: string): void
}>()

const router = useRouter()

const PRESET_COLORS = [
  '#ef4444',
  '#f97316',
  '#eab308',
  '#22c55e',
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
  '#64748b',
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

function goToFavorites() {
  router.push('/favorites')
}
</script>

<template>
  <div class="relative flex flex-col w-full bg-[#B2EBF2] p-4 rounded-[28px] text-black select-none">
    <!-- Header -->
    <div class="flex items-center justify-between mb-3 px-1">
      <div class="flex items-center gap-2">
        <h3 class="text-lg font-black tracking-tight text-black">
          Settings
        </h3>
        <span class="rounded-full bg-[#B2EBF2] px-2 py-0.5 text-[11px] font-bold text-black/70">
          {{ favoriteIcons.length }} fav
        </span>
      </div>
    </div>

    <!-- Color Presets -->
    <div class="mb-3">
      <label class="block text-xs font-semibold text-black/60 mb-2 px-1">Color Presets</label>
      <div class="grid grid-cols-4 gap-2">
        <button
          v-for="color in PRESET_COLORS"
          :key="color"
          class="h-8 w-8 rounded-full border-2 transition-all cursor-pointer hover:scale-110"
          :class="selectedColor.toUpperCase() === color.toUpperCase() ? 'border-black scale-110' : 'border-transparent'"
          :style="{ backgroundColor: color }"
          @click="selectPreset(color)"
        />
      </div>
    </div>

    <!-- Custom Color Picker -->
    <div class="mb-3">
      <label class="block text-xs font-semibold text-black/60 mb-2 px-1">Custom Color</label>
      <div class="flex items-center gap-3">
        <input
          type="color"
          :value="customColor"
          class="aspect-square h-8 w-8 cursor-pointer rounded-md border p-0"
          @input="onCustomColorChange"
        >
        <input
          type="text"
          :value="customColor"
          class="flex-1 h-8 px-2 rounded-lg bg-[#B2EBF2] border-none text-xs font-mono text-black placeholder-black/30 focus:outline-none focus:ring-2 focus:ring-black/20"
          placeholder="#000000"
          @input="onCustomColorChange"
        >
      </div>
    </div>

    <!-- Icon Styles -->
    <div class="mb-3">
      <label class="block text-xs font-semibold text-black/60 mb-2 px-1">Icon Style</label>
      <div class="grid grid-cols-2 gap-1.5">
        <button
          v-for="style in ICON_STYLES"
          :key="style.id"
          class="flex items-center gap-1.5 h-8 px-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          :class="selectedStyle === style.id ? 'bg-[#00ACC1] text-white' : 'bg-[#B2EBF2] text-black hover:bg-[#80DEEA]'"
          @click="selectStyle(style.id)"
        >
          <Icon :icon="style.icon" class="w-3.5 h-3.5" />
          {{ style.label }}
        </button>
      </div>
    </div>

    <!-- Favorites Link -->
    <div class="mb-1">
      <button
        class="w-full flex items-center justify-between h-10 px-3 rounded-xl bg-[#B2EBF2] hover:bg-[#80DEEA] text-xs font-bold text-black transition-colors cursor-pointer"
        @click="goToFavorites"
      >
        <span class="flex items-center gap-2">
          <Icon icon="carbon:favorite" class="w-4 h-4 text-red-500" />
          My Favorites
        </span>
        <span class="text-black/50">{{ favoriteIcons.length }}</span>
      </button>
    </div>
  </div>
</template>
