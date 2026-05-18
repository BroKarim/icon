<script setup lang='ts'>
import { useThemeColor } from './hooks'

const { style } = useThemeColor()
</script>

<template>
  <div class="flex flex-col h-screen overflow-hidden bg-base" :style="style">
    <div class="flex-auto overflow-overlay min-h-0">
      <!-- hapus h-full -->
      <RouterView />
    </div>
    <Progress />
  </div>
</template>
