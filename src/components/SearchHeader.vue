<script setup lang='ts'>
import type { GlassOptics } from '@samasante/liquid-glass'
import type { Root } from 'react-dom/client'

import { Dice5 } from '@lucide/vue'
import { Glass } from '@samasante/liquid-glass'
import { Motion } from 'motion-v'
import { createElement } from 'react'
import { createRoot } from 'react-dom/client'
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

interface Props {
  modelValue: string
  resultsCount: number
  iconScale?: number
  iconColor?: string
  bgColor?: string
  hideSearchInput?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'submit'): void
  (e: 'update:iconScale', value: number): void
  (e: 'update:iconColor', value: string): void
  (e: 'update:bgColor', value: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const mountRef = ref<HTMLDivElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)
let root: Root | null = null

const sliderGlassRef = ref<HTMLDivElement | null>(null)
const randomGlassRef = ref<HTMLDivElement | null>(null)
const colorPickerGlassRef = ref<HTMLDivElement | null>(null)
const roots: Root[] = []

const CONTROL_OPTICS: Partial<GlassOptics> = {
  mapSize: 256,
  clipToShape: true,
  softEdge: true,
  strength: 0.08,
  depth: 0.4,
  curvature: 0.35,
  bend: 0.12,
  bendWidth: 0.06,
  dispersion: 0.1,
  specular: 1.2,
  sheenAngle: 50,
  glow: 0.25,
  glowSpread: 1,
  glowFalloff: 1.5,
  sheen: 0.7,
  sheenWidth: 2,
  sheenFalloff: 1.5,
  frost: 2,
  brightness: 0.03,
  saturate: 1.1,
}

function mountGlassControls() {
  const mounts = [
    { ref: sliderGlassRef, radius: '32px' },
    { ref: randomGlassRef, radius: '9999px' },
    { ref: colorPickerGlassRef, radius: '32px' },
  ]
  for (const { ref: mref, radius } of mounts) {
    if (!mref.value)
      continue
    const r = createRoot(mref.value)
    r.render(
      createElement(
        Glass,
        {
          optics: CONTROL_OPTICS,
          style: {
            width: '100%',
            height: '100%',
            borderRadius: radius,
            overflow: 'hidden',
          },
        },
        createElement('div', {
          style: {
            width: '100%',
            height: '100%',
            background: 'rgba(255,255,255,0.2)',
          },
        }),
      ),
    )
    roots.push(r)
  }
}

function unmountAllGlass() {
  for (const r of roots) r.unmount()
  roots.length = 0
}

const HEADER_OPTICS: Partial<GlassOptics> = {
  mapSize: 512,
  clipToShape: true,
  softEdge: true,
  strength: 0.12,
  depth: 0.55,
  curvature: 0.4,
  bend: 0.18,
  bendWidth: 0.08,
  dispersion: 0.15,
  specular: 1,
  sheenAngle: 50,
  glow: 0.2,
  glowSpread: 1,
  glowFalloff: 1.5,
  sheen: 0.85,
  sheenWidth: 2,
  sheenFalloff: 1.5,
  frost: 4,
  brightness: 0.05,
  saturate: 1.2,
}

function renderHeaderGlass() {
  if (!root)
    return
  root.render(
    createElement(
      Glass,
      {
        optics: HEADER_OPTICS,
        style: {
          width: '100%',
          height: '100%',
          borderRadius: '9999px',
          overflow: 'hidden',
        },
      },
      createElement('input', {
        ref: (el: HTMLInputElement | null) => {
          inputRef.value = el
          if (el && el.value !== props.modelValue)
            el.value = props.modelValue
        },
        defaultValue: props.modelValue,
        placeholder: 'Search 10,000 Things',
        onInput: (e: Event) =>
          emit('update:modelValue', (e.target as HTMLInputElement).value),
        onKeyDown: (e: KeyboardEvent) => {
          if (e.key === 'Enter') emit('submit')
        },
        style: {
          width: '100%',
          height: '100%',
          padding: '0 16px',
          fontSize: '14px',
          color: '#000',
          background: 'transparent',
          border: 'none',
          outline: 'none',
          borderRadius: 9999,
          fontFamily: '-apple-system, SF Pro Text, system-ui, sans-serif',
        },
      }),
    ),
  )
}

function initHeaderGlass() {
  if (mountRef.value && !root) {
    root = createRoot(mountRef.value)
    renderHeaderGlass()
  }
}



onMounted(() => {
  initHeaderGlass()
  mountGlassControls()
})

watch(mountRef, (el) => {
  if (el && !root) {
    nextTick(() => {
      initHeaderGlass()
    })
  }
}, { flush: 'post' })

onBeforeUnmount(() => {
  root?.unmount()
  root = null
  unmountAllGlass()
})

watch(
  () => props.modelValue,
  (v) => {
    if (inputRef.value && inputRef.value.value !== v)
      inputRef.value.value = v
  },
)

const booped = ref(false)

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
  <div class="pointer-events-none absolute inset-x-0 top-0 z-[999] px-4 pt-4">
    <div class="mx-auto flex justify-between w-full items-center gap-3 rounded-[30px]">
      <div class="flex items-center gap-2 pointer-events-auto">
        <a href="/" class="flex-shrink-0" title="Home">
          <img src="/favicon.svg" alt="Icons" class="h-10 w-10 bg-transparent ">
        </a>
        <Motion v-if="!hideSearchInput" layout-id="search-input" class="flex-1">
          <div ref="mountRef" class="h-10 w-full" />
        </Motion>
        <!-- <VersionSwitcher /> -->
      </div>

      <!-- Right section -->
      <div class="pointer-events-auto px-4 py-3 flex items-center gap-2 shrink-0">
        <!-- Icon size slider -->
        <div class="hidden relative items-center gap-3 overflow-hidden rounded-full px-4 h-10 md:flex">
          <span ref="sliderGlassRef" class="absolute inset-0 z-0 pointer-events-none" />
          <span class="relative z-10 min-w-[3ch] text-center text-xs font-medium tabular-nums text-black/60">            {{ Math.round(iconScaleModel[0] * 112) }}px</span>
          <Slider
            v-model="iconScaleModel"
            :min="0.5"
            :max="2.5"
            :step="0.01"
            class="relative z-10 w-32"
          />
        </div>

        <!-- Randomize button -->
        <div class="relative overflow-hidden rounded-full h-10 w-10">
          <span ref="randomGlassRef" class="absolute inset-0 z-0 rounded-full pointer-events-none" />
          <button
            class="relative z-10 inline-flex items-center justify-center h-10 w-10 rounded-full cursor-pointer border-0 bg-transparent"
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
        </div>

        <!-- Color picker -->
        <div class="relative overflow-hidden rounded-full">
          <span ref="colorPickerGlassRef" class="absolute inset-0 z-0 pointer-events-none" />
          <ColorPicker
            :value="currentIconColor"
            class="relative z-10 inline-flex"
            @update:value="emit('update:iconColor', $event)"
          >
            <Button
              as="div"
              variant="outline"
              class="relative z-10 h-10 rounded-full px-3 transition hover:brightness-[1.03]"
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
  </div>
</template>
