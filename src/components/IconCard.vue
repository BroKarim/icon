<script setup lang="ts">
import type { SearchResult } from '../composables/useGlobalSearch'
import { Tooltip } from 'floating-vue'

defineProps<{
  result: SearchResult
  index: number
}>()

defineEmits<{
  select: [value: string]
}>()
</script>

<template>
  <div
    class="bubble-item flex flex-col items-center gap-1 p-2 rounded cursor-pointer select-none"
    hover="bg-gray-50 dark:bg-dark-200"
    :style="{ '--i': index }"
    @click="$emit('select', result.iconFull)"
  >
    <Tooltip placement="top" :delay="500">
      <Icon
        :icon="result.iconFull"
        class="text-2xl leading-none"
      />
      <template #popper>
        <div class="text-xs op75">
          {{ result.collectionName }}
        </div>
      </template>
    </Tooltip>
    <span class="text-xs op50 truncate w-full text-center leading-tight">
      {{ result.iconName }}
    </span>
  </div>
</template>

<style scoped>
.bubble-item {
  animation: bubble-in 0.35s ease-out both;
  animation-delay: calc(var(--i) * 25ms);
}

@keyframes bubble-in {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  60% {
    transform: scale(1.08);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
