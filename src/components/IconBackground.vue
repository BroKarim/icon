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
    <slot name="icon" />
  </div>
</template>
