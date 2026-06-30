<script setup lang='ts'>
import { Dice5 } from '@lucide/vue'
import { Motion } from 'motion-v'

interface Props {
  modelValue: string
  resultsCount: number
  iconScale?: number
  iconColor?: string
  bgColor?: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'update:iconScale', value: number): void
  (e: 'update:iconColor', value: string): void
  (e: 'update:bgColor', value: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const booped = ref(false)

const query = computed({
  get: () => props.modelValue,
  set: v => emit('update:modelValue', v),
})

const iconScaleModel = computed({
  get: () => [props.iconScale ?? 1],
  set: v => emit('update:iconScale', v[0]),
})

function normalizeHexColor(color?: string) {
  const value = color?.trim() ?? ''

  if (/^#[\da-f]{6}$/i.test(value))
    return value.toUpperCase()

  if (/^#[\da-f]{3}$/i.test(value)) {
    const [r, g, b] = value.slice(1).split('')
    return `#${r}${r}${g}${g}${b}${b}`.toUpperCase()
  }

  return '#000000'
}

function shortenHexColor(color: string) {
  const normalized = normalizeHexColor(color)

  if (
    normalized[1] === normalized[2]
    && normalized[3] === normalized[4]
    && normalized[5] === normalized[6]
  ) {
    return `#${normalized[1]}${normalized[3]}${normalized[5]}`
  }

  return normalized
}

function getRgbChannels(color: string) {
  const normalized = normalizeHexColor(color)
  return {
    r: Number.parseInt(normalized.slice(1, 3), 16),
    g: Number.parseInt(normalized.slice(3, 5), 16),
    b: Number.parseInt(normalized.slice(5, 7), 16),
  }
}

function randomHexColor() {
  return `#${Math.floor(Math.random() * 0xFFFFFF + 1).toString(16).padStart(6, '0')}`
}

function randomLightColor() {
  const h = Math.floor(Math.random() * 360)
  const s = 20 + Math.floor(Math.random() * 30)
  const l = 85 + Math.floor(Math.random() * 10)
  return hslToHex(h, s, l)
}

function hslToHex(h: number, s: number, l: number) {
  s /= 100
  l /= 100
  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs((h / 60) % 2 - 1))
  const m = l - c / 2
  let r = 0; let g = 0; let b = 0

  if (h < 60) { r = c; g = x; b = 0 }
  else if (h < 120) { r = x; g = c; b = 0 }
  else if (h < 180) { r = 0; g = c; b = x }
  else if (h < 240) { r = 0; g = x; b = c }
  else if (h < 300) { r = x; g = 0; b = c }
  else { r = c; g = 0; b = x }

  const toHex = (v: number) => Math.round((v + m) * 255).toString(16).padStart(2, '0')
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase()
}

const currentIconColor = computed(() => normalizeHexColor(props.iconColor))

const displayIconColor = computed(() => shortenHexColor(currentIconColor.value))

const colorIsLight = computed(() => {
  const { r, g, b } = getRgbChannels(currentIconColor.value)
  return (r * 299 + g * 587 + b * 114) / 1000 >= 160
})

const colorButtonText = computed(() => colorIsLight.value ? '#111827' : '#FFFFFF')
const colorButtonBorder = computed(() => colorIsLight.value ? 'rgba(17, 24, 39, 0.14)' : 'rgba(255, 255, 255, 0.26)')

function randomizeTheme() {
  booped.value = true
  const newIconColor = randomHexColor()
  const newBgColor = randomLightColor()
  emit('update:iconColor', newIconColor)
  emit('update:bgColor', newBgColor)
}

function onBoopEnd() {
  booped.value = false
}
</script>

<template>
  <div class="pointer-events-none absolute inset-x-0 top-0 z-20 px-4 pt-4">
    <div class="mx-auto flex justify-between w-full items-center gap-3 rounded-[30px]">
      <div class="flex items-center gap-2 pointer-events-auto">
        <a href="/" class="flex-shrink-0" title="Home">
          <img src="/favicon.svg" alt="Icons" class="h-10 w-10 bg-transparent ">
        </a>
        <Input
          v-model="query"
          placeholder="Search 10,000 Things"
          class="h-10 w-full rounded-full border-0 bg-white/30 px-4 text-sm text-black placeholder:text-black/50 shadow-sm backdrop-blur-md transition focus-within:bg-white/50 focus:outline-none focus:ring-0"
        />
      </div>

      <!-- Right section -->
      <div class="pointer-events-auto px-4 py-3 flex items-center gap-2 shrink-0">
        <!-- Icon size slider -->
        <div class="hidden items-center gap-3 rounded-full bg-white/30 px-4 h-10 backdrop-blur-md transition hover:bg-white/50 md:flex">
          <span class="min-w-[3ch] text-center text-xs font-medium tabular-nums text-black/60">{{ Math.round(iconScaleModel[0] * 32) }}px</span>
          <Slider
            v-model="iconScaleModel"
            :min="0.5"
            :max="2"
            :step="0.01"
            class="w-32"
          />
        </div>

        <!-- Randomize button -->
        <button
          class="inline-flex items-center justify-center h-10 w-10 rounded-full bg-white/30 shadow-sm backdrop-blur-md transition hover:bg-white/50 cursor-pointer"
          title="Randomize theme"
          @click="randomizeTheme"
        >
          <Motion
            :animate="booped
              ? { y: [0, -6, 0], rotate: [0, -10, 10, -10, 0] }
              : {}"
            :transition="{ duration: 0.5 }"
            @animation-end="onBoopEnd"
          >
            <Dice5 :size="20" class="text-black/60" />
          </Motion>
        </button>

        <!-- Color picker -->
        <ColorPicker
          :value="currentIconColor"
          class="inline-flex"
          @update:value="emit('update:iconColor', $event)"
        >
          <Button
            as="div"
            variant="outline"
            class="h-10 rounded-full px-3 shadow-sm backdrop-blur-md transition hover:brightness-[1.03]"
            :style="{
              backgroundColor: currentIconColor,
              color: colorButtonText,
              borderColor: colorButtonBorder,
            }"
          >
            <span class="font-mono text-xs font-semibold tracking-[0.18em]">
              {{ displayIconColor }}
            </span>
          </Button>
        </ColorPicker>
      </div>
    </div>
  </div>
</template>
