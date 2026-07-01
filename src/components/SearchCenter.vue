<script setup lang="ts">
import type { GlassOptics } from '@samasante/liquid-glass'
import type { KeyboardEvent as ReactKeyboardEvent } from 'react'
import type { Root } from 'react-dom/client'
import { Glass } from '@samasante/liquid-glass'
import { Motion } from 'motion-v'
import { createElement } from 'react'
import { createRoot } from 'react-dom/client'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

interface Props {
  modelValue: string
}
interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'submit'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const mountRef = ref<HTMLDivElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)
let root: Root | null = null

const SEARCH_OPTICS: Partial<GlassOptics> = {
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

function render() {
  if (!root)
    return
  root.render(
    createElement(
      Glass,
      {
        optics: SEARCH_OPTICS,
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
        placeholder: 'Search 200,000 icons...',
        onInput: (e: Event) =>
          emit('update:modelValue', (e.target as HTMLInputElement).value),
        onKeyDown: (e: ReactKeyboardEvent<HTMLInputElement>) => {
          if (e.key === 'Enter')
            emit('submit')
        },
        style: {
          width: '100%',
          height: '100%',
          padding: '0 24px',
          fontSize: '16px',
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

onMounted(() => {
  if (!mountRef.value)
    return
  root = createRoot(mountRef.value)
  render()
})

onBeforeUnmount(() => {
  root?.unmount()
  root = null
})

watch(
  () => props.modelValue,
  (v) => {
    if (inputRef.value && inputRef.value.value !== v) {
      inputRef.value.value = v
    }
  },
)
</script>

<template>
  <div class="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-4">
    <Motion
      layout-id="search-input"
      class="h-14 w-full max-w-xl rounded-full"
    >
      <div ref="mountRef" class="pointer-events-auto h-14 w-full" />
    </Motion>
  </div>
</template>
