<script setup lang='ts'>
import { onClickOutside } from '@vueuse/core'

interface Props {
  modelValue: string
  resultsCount: number
  iconScale?: number
  iconColor?: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'update:iconScale', value: number): void
  (e: 'update:iconColor', value: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const query = computed({
  get: () => props.modelValue,
  set: v => emit('update:modelValue', v),
})

const iconScaleModel = computed({
  get: () => [props.iconScale ?? 1],
  set: v => emit('update:iconScale', v[0]),
})

const colorPickerOpen = ref(false)
const colorPickerRef = ref<HTMLElement | null>(null)

onClickOutside(colorPickerRef, () => {
  colorPickerOpen.value = false
})

const presetColors = [
  '#000000', '#6b7280', '#ef4444', '#f97316', '#eab308',
  '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899',
  '#78716c', '#a8a29e', '#dc2626', '#d97706', '#ca8a04',
  '#16a34a', '#0891b2', '#2563eb', '#7c3aed', '#db2777',
]
</script>

<template>
  <div class="pointer-events-none absolute inset-x-0 top-0 z-20 px-4 pt-4">
    <div class="mx-auto flex justify-between w-full items-center gap-3 rounded-[30px]">
      <div class=" pointer-events-auto">
        <Input
          v-model="query"
          placeholder="Search 10,000 Things"
          class="h-10 w-full"
        />
      </div>

      <!-- Right section -->
      <div class="pointer-events-auto px-4 py-3 flex items-center gap-2 shrink-0">
        <!-- Icon size slider -->
        <div class="hidden items-center gap-3 rounded-full bg-white/60 px-4 py-2 md:flex">
          <Icon icon="carbon:collapse-all" class="text-sm text-black/45" />
          <Slider
            v-model="iconScaleModel"
            :min="0.5"
            :max="2"
            :step="0.01"
            class="w-32"
          />
          <Icon icon="carbon:expand-all" class="text-sm text-black/45" />
        </div>

        <!-- Color picker -->
        <div ref="colorPickerRef" class="relative">
          <button
            type="button"
            class="flex h-9 w-9 items-center justify-center rounded-full bg-white/60 transition hover:bg-white/80"
            @click="colorPickerOpen = !colorPickerOpen"
          >
            <div
              class="h-5 w-5 rounded-full border-2 border-white shadow-sm"
              :style="{ backgroundColor: iconColor }"
            />
          </button>

          <Transition
            enter-active-class="transition duration-150 ease-out"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition duration-100 ease-in"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
          >
            <div
              v-if="colorPickerOpen"
              class="absolute right-0 top-12 z-50 w-52 rounded-2xl bg-white p-3 shadow-xl ring-1 ring-black/5"
            >
              <div class="grid grid-cols-5 gap-1.5">
                <button
                  v-for="color in presetColors"
                  :key="color"
                  class="h-7 w-7 cursor-pointer rounded-full border border-black/10 transition hover:scale-110"
                  :class="iconColor === color ? 'ring-2 ring-black/40 ring-offset-1' : ''"
                  :style="{ backgroundColor: color }"
                  @click="emit('update:iconColor', color)"
                />
              </div>

              <div class="mt-3 flex items-center gap-2">
                <input
                  type="color"
                  :value="iconColor"
                  class="h-8 w-8 cursor-pointer rounded border border-black/10"
                  @input="emit('update:iconColor', ($event.target as HTMLInputElement).value)"
                >
                <input
                  type="text"
                  :value="iconColor"
                  class="h-8 flex-1 rounded-lg border border-black/10 px-2 text-xs font-mono"
                  maxlength="7"
                  @change="emit('update:iconColor', ($event.target as HTMLInputElement).value)"
                >
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </div>
</template>