<script setup lang="ts">
// BackgroundGrid - no props/state needed
</script>

<template>
  <div class="pointer-events-none absolute inset-0 md:px-10 md:py-10">
    <div
      class="h-full w-full bg-background"
      :style="{
        backgroundImage:
          'repeating-linear-gradient(45deg, transparent, transparent 2px, var(--secondary) 2px, var(--secondary) 4px)',
      }"
    />
  </div>
  <div class="pointer-events-none absolute inset-0 hidden md:flex justify-between px-4 md:px-10">
    <div class="h-full w-px bg-border" />
    <div class="h-full w-px bg-border" />
  </div>
  <div class="pointer-events-none absolute inset-0 hidden md:flex flex-col justify-between py-4 md:py-10">
    <div class="h-px w-full bg-border" />
    <div class="h-px w-full bg-border" />
  </div>
  <div class="pointer-events-none absolute inset-0 hidden md:block">
    <div class="absolute left-4 top-10 md:left-10 md:top-10 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-border bg-background" />
    <div class="absolute right-4 top-10 md:right-10 md:top-10 size-2 translate-x-1/2 -translate-y-1/2 rounded-full border border-border bg-background" />
    <div class="absolute left-4 bottom-10 md:left-10 md:bottom-10 size-2 -translate-x-1/2 translate-y-1/2 rounded-full border border-border bg-background" />
    <div class="absolute right-4 bottom-10 md:right-10 md:bottom-10 size-2 translate-x-1/2 translate-y-1/2 rounded-full border border-border bg-background" />
  </div>
</template>
