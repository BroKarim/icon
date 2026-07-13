<script setup lang="ts">
import type { AdItem } from '../types/ad'

const props = defineProps<{
  ad: AdItem
  gridSize: number
  iconSize: number
  iconColor: string
}>()

function onClick() {
  window.open(props.ad.link, '_blank')
}
</script>

<template>
  <div
    class="group/ad relative flex flex-col items-center justify-center rounded-[32px] cursor-pointer transition-transform duration-200 ease-out hover:-translate-y-1 hover:scale-[1.03]"
    @click.stop="onClick"
  >
    <img
      :src="ad.logo"
      :alt="ad.name"
      class="pointer-events-none object-contain drop-shadow-[0_16px_20px_rgba(0,0,0,0.10)]"
      :style="{ width: `${iconSize}px`, height: `${iconSize}px` }"
      loading="lazy"
    >
    <span
      class="pointer-events-none mt-1.5 rounded-full bg-white/84 px-2.5 py-0.5 text-[10px] font-medium text-black/52 opacity-0 shadow-[0_10px_30px_rgba(0,0,0,0.08)] backdrop-blur-sm transition-opacity duration-200 group-hover/ad:opacity-100 whitespace-nowrap"
    >
      {{ ad.name }}
    </span>

    <div
      class="pointer-events-none absolute bottom-full left-1/2 mb-3 w-64 -translate-x-1/2 opacity-0 transition-opacity duration-200 group-hover/ad:opacity-100"
    >
      <div class="rounded-xl bg-white/90 px-4 py-3 text-center shadow-[0_10px_30px_rgba(0,0,0,0.12)] backdrop-blur-md">
        <p class="text-xs text-black/60 leading-relaxed">
          {{ ad.description }}
        </p>
        <span
          class="mt-2 inline-block rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wide"
          :style="{ backgroundColor: `${iconColor}20`, color: iconColor }"
        >
          {{ ad.cta || 'Learn More' }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
