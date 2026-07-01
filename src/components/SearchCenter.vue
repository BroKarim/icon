<script setup lang='ts'>
import { Motion } from 'motion-v'

interface Props {
  modelValue: string
}
interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'submit'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const query = computed({
  get: () => props.modelValue,
  set: v => emit('update:modelValue', v),
})
</script>

<template>
  <div class="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-4">
    <Motion layout-id="search-input" class="w-full max-w-xl">
      <Input
        v-model="query"
        placeholder="Search 200,000 icons..."
        class="pointer-events-auto h-14 w-full rounded-full border-0 bg-white/30 px-6 text-base text-black placeholder:text-black/50 shadow-lg backdrop-blur-md transition focus-within:bg-white/50 focus:outline-none focus:ring-0"
        @keydown.enter="emit('submit')"
      />
    </Motion>
  </div>
</template>
