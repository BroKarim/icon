<script setup lang='ts'>
import { AnimatePresence, Motion } from 'motion-v'
import { computed, onMounted, onUnmounted, ref } from 'vue'

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: 'Search 200,000+ icons...',
})

const emit = defineEmits<Emits>()

const PLACEHOLDERS = [
  'Generate website with HextaUI',
  'Create a new project with Next.js',
  'What is the meaning of life?',
  'What is the best way to learn React?',
  'How to cook a delicious meal?',
  'Summarize this article',
]

interface Props {
  modelValue?: string
  placeholder?: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'submit', value: string): void
}

const showPlaceholder = ref(true)
const placeholderIndex = ref(0)
const wrapperRef = ref<HTMLDivElement | null>(null)

const inputValue = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

const isInputEmpty = computed(() => !inputValue.value)

// Cycle placeholder text
let placeholderInterval: ReturnType<typeof setInterval> | undefined

function startPlaceholderCycle() {
  if (placeholderInterval)
    clearInterval(placeholderInterval)

  placeholderInterval = setInterval(() => {
    if (!isInputEmpty.value)
      return

    showPlaceholder.value = false
    setTimeout(() => {
      placeholderIndex.value = (placeholderIndex.value + 1) % PLACEHOLDERS.length
      showPlaceholder.value = true
    }, 400)
  }, 3000)
}

onMounted(() => {
  startPlaceholderCycle()
})

onUnmounted(() => {
  if (placeholderInterval)
    clearInterval(placeholderInterval)
})

function handleSubmit() {
  if (inputValue.value) {
    emit('submit', inputValue.value)
  }
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    handleSubmit()
  }
}

// Animation variants
const placeholderContainerVariants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.025 } },
  exit: { transition: { staggerChildren: 0.015, staggerDirection: -1 } },
}

const letterVariants = {
  initial: {
    opacity: 0,
    filter: 'blur(12px)',
    y: 10,
  },
  animate: {
    opacity: 1,
    filter: 'blur(0px)',
    y: 0,
    transition: {
      opacity: { duration: 0.25 },
      filter: { duration: 0.4 },
      y: { type: 'spring', stiffness: 80, damping: 20 },
    },
  },
  exit: {
    opacity: 0,
    filter: 'blur(12px)',
    y: -10,
    transition: {
      opacity: { duration: 0.2 },
      filter: { duration: 0.3 },
      y: { type: 'spring', stiffness: 80, damping: 20 },
    },
  },
} as const
</script>

<template>
  <div
    ref="wrapperRef"
    class="w-full max-w-3xl"
  >
    <div class="flex items-center gap-2 p-3 rounded-full bg-base w-full shadow-sm hover:shadow-md transition-shadow">
      <button
        class="p-3 rounded-full hover:bg-gray-100 dark:hover:bg-dark-100 transition"
        title="Attach file"
        type="button"
        tabindex="-1"
      >
        <Icon icon="carbon:paperclip" class="text-lg" />
      </button>

      <!-- Text Input & Placeholder -->
      <div class="relative flex-1">
        <input
          v-model="inputValue"
          type="text"
          class="flex-1 border-0 outline-none rounded-md py-2 ring-0 text-base bg-transparent w-full font-normal focus:outline-none focus:ring-0 focus:border-0"
          :style="{ position: 'relative', zIndex: 1 }"
          @keydown="handleKeydown"
        >
        <div class="absolute left-0 top-0 w-full h-full pointer-events-none flex items-center px-3 py-2">
          <AnimatePresence mode="wait">
            <Motion
              v-if="showPlaceholder && isInputEmpty"
              :key="placeholderIndex"
              class="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 select-none pointer-events-none"
              :style="{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                zIndex: 0,
              }"
              :variants="placeholderContainerVariants"
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <span
                v-for="(char, i) in PLACEHOLDERS[placeholderIndex]"
                :key="i"
                class="inline-block"
              >
                <Motion
                  :variants="letterVariants"
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  {{ char === ' ' ? '\u00A0' : char }}
                </Motion>
              </span>
            </Motion>
          </AnimatePresence>
        </div>
      </div>

      <button
        class="flex items-center gap-1 bg-primary hover:bg-primary/80 text-white p-3 rounded-full font-medium justify-center"
        title="Send"
        type="button"
        tabindex="-1"
        @click.stop="handleSubmit"
      >
        <Icon icon="carbon:send" class="text-lg" />
      </button>
    </div>
  </div>
</template>
