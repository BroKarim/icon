<script setup lang="ts">
defineProps<{
  iconColor?: string
}>()
</script>

<template>
  <div class="relative w-full aspect-square bg-foreground/[0.02] border border-foreground/[0.06] rounded-xl flex items-center justify-center overflow-hidden">
    <div
      class="absolute inset-0 pointer-events-none"
      :style="{
        backgroundImage: 'linear-gradient(to right, rgb(128 128 128 / 0.15) 1px, transparent 1px), linear-gradient(to bottom, rgb(128 128 128 / 0.15) 1px, transparent 1px)',
        backgroundSize: 'calc(100%/12) calc(100%/12)',
        maskImage: 'radial-gradient(circle at center, #000 62%, transparent 92%)',
        WebkitMaskImage: 'radial-gradient(circle at center, #000 62%, transparent 92%)',
      }"
    />
    <div
      class="absolute inset-0 pointer-events-none"
      :style="{ background: `radial-gradient(circle at center, ${iconColor || '#000'}1F, transparent 58%)` }"
    />
    <svg class="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" fill="none">
      <rect x="9" y="9" width="82" height="82" rx="7" stroke="rgb(128 128 128 / 0.3)" stroke-width="0.5" stroke-dasharray="2.5 2.5" />
      <rect x="32" y="14" width="36" height="72" rx="7" :stroke="iconColor || '#000'" stroke-opacity="0.16" stroke-width="0.5" />
      <rect x="14" y="32" width="72" height="36" rx="7" :stroke="iconColor || '#000'" stroke-opacity="0.16" stroke-width="0.5" />
      <line x1="50" y1="5" x2="50" y2="95" :stroke="iconColor || '#000'" stroke-opacity="0.28" stroke-width="0.4" />
      <line x1="5" y1="50" x2="95" y2="50" :stroke="iconColor || '#000'" stroke-opacity="0.28" stroke-width="0.4" />
    </svg>
    <div class="absolute top-2 left-2 w-2.5 h-2.5 border-t border-l" :style="{ borderColor: `${iconColor || '#000'}59` }" />
    <div class="absolute top-2 right-2 w-2.5 h-2.5 border-t border-r" :style="{ borderColor: `${iconColor || '#000'}59` }" />
    <div class="absolute bottom-2 left-2 w-2.5 h-2.5 border-b border-l" :style="{ borderColor: `${iconColor || '#000'}59` }" />
    <div class="absolute bottom-2 right-2 w-2.5 h-2.5 border-b border-r" :style="{ borderColor: `${iconColor || '#000'}59` }" />
    <span class="absolute top-2 left-1/2 -translate-x-1/2 text-[7.5px] font-mono select-none tracking-wider" :style="{ color: `${iconColor || '#000'}73` }">24<span class="opacity-20"> × </span>24</span>
    <span class="absolute bottom-2 right-3 text-[8px] font-mono select-none tabular-nums" style="color: rgb(128 128 128 / 0.3)">24px</span>
    <span class="absolute bottom-2 left-3 text-[8px] font-mono select-none lowercase" style="color: rgb(128 128 128 / 0.25)">default</span>
    <slot name="icon" />
  </div>
</template>
