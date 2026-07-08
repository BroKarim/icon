<script setup lang="ts">
import { Send } from '@lucide/vue'
import { Motion } from 'motion-v'
import { Button } from '@/components/ui/button'

interface Props {
  modelValue: string
}
interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'submit'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
</script>

<template>
  <div class="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-4">
    <Motion
      layout-id="search-input"
      class="h-14 w-full max-w-xl rounded-full"
    >
      <!-- <h1 className="text-balance mb-8 mx-auto max-w-2xl text-center text-2xl font-semibold leading-9 text-foreground px-1 text-pretty whitespace-pre-wrap">
        How can I help you today?
      </h1> -->
      <div class="pointer-events-auto flex h-14 w-full items-center justify-between rounded-3xl border border-border bg-[#EBEBEB] bg-clip-padding p-2.5 cursor-text overflow-clip shadow-lg  transition-[border-radius] duration-200 ease-out">
        <input
          :value="props.modelValue"
          placeholder="Search 200,000 icons..."
          class="h-full flex-1 rounded-full bg-[#EBEBEB] px-6 text-base text-black outline-none"
          style="font-family: -apple-system, SF Pro Text, system-ui, sans-serif"
          @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
          @keydown.enter="emit('submit')"
        >
        <Button
          type="button"
          size="icon"
          class="mr-1.5 h-9 w-9 bg-black flex items-center  justify-center relative rounded-full"
          aria-label="Send message"
        >
          <Send class="size-5 text-white" />
        </Button>
      </div>
    </Motion>
  </div>
</template>
