<script setup lang="ts">
import type { SearchResult } from '../composables/useGlobalSearch'

defineProps<{
  results: SearchResult[]
  loading: boolean
}>()

defineEmits<{
  select: [value: string]
}>()
</script>

<template>
  <div class="flex-auto of-y-auto">
    <div v-if="loading" class="flex justify-center py-8 op50 text-sm">
      Loading icons...
    </div>

    <TransitionGroup
      v-else
      name="bubble"
      tag="div"
      class="grid gap-3 p-6"
      style="grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));"
    >
      <IconCard
        v-for="(r, i) of results"
        :key="r.iconFull"
        :result="r"
        :index="i"
        @select="$emit('select', $event)"
      />
    </TransitionGroup>

    <div
      v-if="!loading && results.length === 0"
      class="flex flex-col items-center py-12 op40"
    >
      <Icon icon="ph:magnifying-glass-bold" class="text-4xl mb-3" />
      <span class="text-sm">Type something to search icons</span>
    </div>
  </div>
</template>

<style scoped>
.bubble-enter-active {
  animation: bubble-in 0.35s ease-out both;
  animation-delay: calc(var(--i) * 25ms);
}

.bubble-leave-active {
  transition: all 0.2s ease-in;
}

.bubble-leave-to {
  transform: scale(0);
  opacity: 0;
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
