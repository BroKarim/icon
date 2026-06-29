<script lang='ts' setup>
import type { CollectionInfo } from '../data'
import type { Snippet } from '../utils/icons'
import { Check, Copy, Loader2 } from '@lucide/vue'
import { cn } from '@/lib/utils'
import { collections } from '../data'
import { pushRecentIcon } from '../store'
import { dataUrlToBlob } from '../utils/dataUrlToBlob'
import { getIconSnippet } from '../utils/icons'
import { highlight } from '../utils/shiki'
import { prettierCode } from '../utils/svg'

const props = defineProps<{
  collection?: CollectionInfo
  icon: string
  snippet: Snippet
  type: string
  color: string
}>()

const emit = defineEmits<{
  (e: 'copy', success: boolean): void
}>()

const code = ref<string>('')
const isFetching = ref(false)
const fetched = ref(false)
const copied = ref(false)
let copyTimer: ReturnType<typeof setTimeout> | null = null

async function fetchCode() {
  if (fetched.value || isFetching.value || !props.icon)
    return
  isFetching.value = true
  try {
    const result = await getIconSnippet(
      props.collection ? [props.collection] : collections,
      props.icon,
      props.type,
      true,
      props.color,
    )
    code.value = result || ''
    fetched.value = true
  }
  finally {
    isFetching.value = false
  }
}

watch(
  () => [props.icon, props.type, props.color],
  () => {
    code.value = ''
    fetched.value = false
    copied.value = false
    fetchCode()
  },
  { immediate: true },
)

const highlightedCode = computedAsync(async () => {
  if (!code.value)
    return ''
  const formatted = (await prettierCode(code.value, props.snippet.prettierParser)).trim()
  return highlight(formatted, props.snippet.lang)
})

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  }
  catch {
    return false
  }
}

async function copyPng(dataUrl: string) {
  try {
    const blob = dataUrlToBlob(dataUrl)
    const item = new ClipboardItem({ 'image/png': blob })
    await navigator.clipboard.write([item])
    return true
  }
  catch (e) {
    console.error('Failed to copy png', e)
    return false
  }
}

async function onCopy() {
  if (!code.value)
    return
  pushRecentIcon(props.icon)
  const success = props.type === 'png'
    ? await copyPng(code.value)
    : await copyText(code.value)
  if (success) {
    copied.value = true
    if (copyTimer)
      clearTimeout(copyTimer)
    copyTimer = setTimeout(() => {
      copied.value = false
    }, 1500)
  }
  emit('copy', success)
}

onBeforeUnmount(() => {
  if (copyTimer)
    clearTimeout(copyTimer)
})
</script>

<template>
  <div class="relative rounded-lg border bg-zinc-50 dark:bg-zinc-900 overflow-hidden">
    <button
      type="button"
      :disabled="isFetching || !code"
      :class="cn(
        'absolute top-2 right-2 z-10 inline-flex items-center justify-center gap-1.5 rounded-md border bg-background px-2.5 py-1 text-xs font-medium transition-colors',
        'hover:bg-accent hover:text-accent-foreground',
        'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
        'disabled:pointer-events-none disabled:opacity-50',
      )"
      @click="onCopy"
    >
      <Check v-if="copied" class="size-3.5 text-emerald-500" />
      <Copy v-else class="size-3.5 text-white" />
    </button>

    <div v-if="isFetching" class="flex items-center gap-2 p-4 text-sm text-muted-foreground">
      <Loader2 class="size-4 animate-spin" />
      Loading snippet...
    </div>

    <div
      v-else-if="highlightedCode"
      class="max-h-80 overflow-auto p-4 pr-12 text-sm [&_pre]:!bg-transparent [&_pre]:p-0 [&_pre]:m-0"
      v-html="highlightedCode"
    />
  </div>
</template>
