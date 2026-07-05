<script setup lang='ts'>
import type { GlassOptics } from '@samasante/liquid-glass'
import type { Root } from 'react-dom/client'

import { ChevronDown } from '@lucide/vue'
import { Glass } from '@samasante/liquid-glass'
import { createElement } from 'react'
import { createRoot } from 'react-dom/client'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const route = useRoute()
const router = useRouter()

type Version = 'v1' | 'v2'

const versions: { id: Version, label: string, to: string }[] = [
  { id: 'v1', label: 'v1', to: '/v1' },
  { id: 'v2', label: 'v2', to: '/' },
]

const current = computed<Version>(() => route.path === '/v1' ? 'v1' : 'v2')
const currentLabel = computed(() => versions.find(v => v.id === current.value)!.label)

const triggerGlassRef = ref<HTMLDivElement | null>(null)
const dropdownGlassRef = ref<HTMLDivElement | null>(null)
let triggerRoot: Root | null = null
let dropdownRoot: Root | null = null

const SWITCHER_OPTICS: Partial<GlassOptics> = {
  mapSize: 256,
  clipToShape: true,
  softEdge: true,
  strength: 0.06,
  depth: 0.35,
  curvature: 0.3,
  bend: 0.1,
  bendWidth: 0.06,
  dispersion: 0.08,
  specular: 1.1,
  sheenAngle: 50,
  glow: 0.2,
  glowSpread: 1,
  glowFalloff: 1.5,
  sheen: 0.6,
  sheenWidth: 2,
  sheenFalloff: 1.5,
  frost: 2,
  brightness: 0.02,
  saturate: 1.1,
}

function glassElement(optics: Partial<GlassOptics>, radius = '9999px') {
  return createElement(
    Glass,
    {
      optics,
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
  )
}

onMounted(() => {
  if (triggerGlassRef.value) {
    triggerRoot = createRoot(triggerGlassRef.value)
    triggerRoot.render(glassElement(SWITCHER_OPTICS, '32px'))
  }
})

onBeforeUnmount(() => {
  triggerRoot?.unmount()
  dropdownRoot?.unmount()
  triggerRoot = null
  dropdownRoot = null
})

watch(dropdownGlassRef, (el) => {
  if (el) {
    dropdownRoot = createRoot(el)
    dropdownRoot.render(glassElement(SWITCHER_OPTICS, '12px'))
  }
  else {
    dropdownRoot?.unmount()
    dropdownRoot = null
  }
})

function go(to: string) {
  if (route.path === to)
    return
  router.push(to)
}
</script>

<template>
  <div class="pointer-events-auto">
    <DropdownMenu>
      <div class="relative overflow-hidden rounded-full">
        <span ref="triggerGlassRef" class="absolute inset-0 z-0 pointer-events-none" />
        <DropdownMenuTrigger
          class="pointer-events-auto relative z-10 inline-flex h-10 items-center gap-1 rounded-full border-0 bg-transparent px-3 text-xs font-medium text-slate-700 transition-colors hover:bg-black/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/10"
        >
          <span class="text-slate-400">Design</span>
          <span class="text-slate-900">{{ currentLabel }}</span>
          <ChevronDown class="size-3.5 text-slate-400" />
        </DropdownMenuTrigger>
      </div>
      <DropdownMenuContent align="end" class="min-w-32 overflow-hidden bg-transparent border-0 shadow-none">
        <span ref="dropdownGlassRef" class="absolute inset-0 z-0 pointer-events-none" />
        <DropdownMenuItem
          v-for="v in versions"
          :key="v.id"
          :class="current === v.id ? 'bg-slate-100 h-10' : ''"
          class="relative z-10"
          @select="go(v.to)"
        >
          <span class="flex-1">{{ v.label }}</span>
          <span v-if="current === v.id" class="text-slate-400 text-xs">current</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
</template>
