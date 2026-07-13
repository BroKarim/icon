<script setup lang="ts">
import type { AdItem } from '../types/ad'
// import FlickeringGrid from './FlickeringBg.vue'

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
    class="relative flex flex-col items-center justify-center rounded-[32px] p-3   cursor-pointer transition-transform duration-200 ease-out hover:-translate-y-1 hover:scale-[1.03] border border-white/50"
    @click.stop="onClick"
  >
    <!-- 1. Logo -->
    <img
      :src="ad.logo"
      :alt="ad.name"
      class="pointer-events-none object-contain  mb-2"
      :style="{ width: `${iconSize * 0.8}px`, height: `${iconSize * 0.8}px` }"
      loading="lazy"
    >

    <!-- 2. Description (Selalu Tampil & Dibatasi 2 baris agar rapi) -->
    <p class="pointer-events-none text-[10px] text-black/60 leading-tight text-center mb-2 line-clamp-2">
      {{ ad.description }}
    </p>

    <!-- 3. Colorful CTA Button (Warna Cerah) -->
    <span
      class="pointer-events-none mt-auto inline-block rounded-full bg-yellow-400 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-black/90 shadow-sm"
    >
      {{ ad.cta || 'Learn More' }}
    </span>
  </div>
</template>

<style scoped>
/* Opsional: Line clamp jika kamu belum mengaktifkan plugin line-clamp di tailwind */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>