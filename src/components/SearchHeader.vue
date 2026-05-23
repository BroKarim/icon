<script setup lang='ts'>
interface Props {
  modelValue: string
  resultsCount: number
  iconScale?: number
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'update:iconScale', value: number): void
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
        <!-- Results badge -->
        <!-- <div
          v-if="query"
          class="hidden items-center rounded-full bg-[#c8b9a1]/82 px-4 py-3 text-sm font-medium text-white shadow-sm md:flex"
        >
          {{ resultsCount }} hasil
        </div> -->

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
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <button
              type="button"
              class="flex h-9 w-9 items-center justify-center rounded-full bg-white/60 text-black/55 transition hover:bg-white/80"
            >
              <Icon icon="carbon:color-palette" class="text-sm" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <div class="grid grid-cols-6 gap-1.5 p-3">
              <button
                v-for="color in [
                  '#000000', '#6b7280', '#ef4444', '#f97316', '#eab308',
                  '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899',
                  '#78716c', '#a8a29e', '#dc2626', '#d97706', '#ca8a04',
                  '#16a34a', '#0891b2', '#2563eb', '#7c3aed', '#db2777',
                ]"
                :key="color"
                class="h-7 w-7 cursor-pointer rounded-full border border-black/10 transition hover:scale-110"
                :style="{ backgroundColor: color }"
              />
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  </div>
</template>
