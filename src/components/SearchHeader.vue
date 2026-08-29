<script setup lang='ts'>
import type { GlassOptics } from '@samasante/liquid-glass'
import type { Root } from 'react-dom/client'

import { Glass } from '@samasante/liquid-glass'
import { Motion } from 'motion-v'
import { createElement } from 'react'
import { createRoot } from 'react-dom/client'
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { bags } from '../store'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import BagPopover from './BagPopover.vue'
import SettingsPopover from './SettingsPopover.vue'

interface Props {
  modelValue: string
  resultsCount: number
  iconScale?: number
  iconColor?: string
  bgColor?: string
  iconStyle?: string
  hideSearchInput?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'submit'): void
  (e: 'update:iconScale', value: number): void
  (e: 'update:iconColor', value: string): void
  (e: 'update:bgColor', value: string): void
  (e: 'update:iconStyle', value: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const mountRef = ref<HTMLDivElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)
let root: Root | null = null

const sliderGlassRef = ref<HTMLDivElement | null>(null)
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


</script>

<template>
  <div class="pointer-events-none absolute inset-x-0 top-0 z-[999] px-4 pt-4">
    <div class="mx-auto flex justify-between w-full items-center gap-3 rounded-[30px]">
      <div class="flex items-center gap-2 pointer-events-auto">
        <a href="/" class="flex-shrink-0" title="Home">
          <img src="/iglo.png" alt="Igloo" class="h-16 w-16 bg-transparent ">
        </a>
        <Motion v-if="!hideSearchInput" layout-id="search-input" class="flex-1 relative rounded-full  bg-background/80 border border-[#222]/20  shadow-sm backdrop-blur">
          <div ref="mountRef" class="h-10 w-full" />

        </Motion>
        <!-- <VersionSwitcher /> -->
      </div>

      <!-- Right section -->
      <div class="pointer-events-auto px-4 py-3 flex items-center gap-2 shrink-0">
        <!-- Bag popover -->
        <Popover>
          <PopoverTrigger class="relative inline-flex items-center justify-center h-10 w-10 rounded-full cursor-pointer rounded-full  bg-background/80 border border-[#222]/20 p-1 shadow-sm backdrop-blur hover:bg-white/20 transition-colors">
            <Icon icon="carbon:shopping-bag" class="text-lg text-black/60" />
            <span
              v-if="bags.length"
              class="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold px-1 leading-none"
            >
              {{ bags.length > 99 ? '99+' : bags.length }}
            </span>
          </PopoverTrigger>
          <PopoverContent align="end" :side-offset="8" class="w-[380px] border-none shadow-none p-0 overflow-hidden z-[1000]">
            <BagPopover :icon-color="iconColor" />
          </PopoverContent>
        </Popover>

        <!-- Icon size slider -->
        <!-- <div class="hidden relative items-center gap-3 overflow-hidden rounded-full px-4 h-10 md:flex">
          <span ref="sliderGlassRef" class="absolute inset-0 z-0 pointer-events-none" />
          <span class="relative z-10 min-w-[3ch] text-center text-xs font-medium tabular-nums text-black/60">            {{ Math.round(iconScaleModel[0] * 112) }}px</span>
          <Slider
            v-model="iconScaleModel"
            :min="0.5"
            :max="2.5"
            :step="0.01"
            class="relative z-10 w-32"
          />
        </div> -->
        <!-- Settings popover -->
        <Popover>
          <PopoverTrigger class="relative inline-flex items-center justify-center h-10 w-10 rounded-full  bg-background/80 border border-[#222]/20 p-1 shadow-sm backdrop-blur ">
            <Icon icon="carbon:settings" class="text-lg text-black" />
          </PopoverTrigger>
          <PopoverContent align="end" :side-offset="8" class="w-[300px] border-none shadow-none p-0 overflow-hidden z-[1000]">
            <SettingsPopover
              :icon-color="iconColor"
              :icon-style="iconStyle"
              @update:icon-color="emit('update:iconColor', $event)"
              @update:icon-style="emit('update:iconStyle', $event)"
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  </div>
</template>
