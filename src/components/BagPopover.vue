<script setup lang="ts">
import type { PackType } from '../utils/svg'
import { collections } from '../data'
import { bags, clearBag, removeFromBag } from '../store'
import { getIconSnippet } from '../utils/icons'
import { PackZip } from '../utils/pack'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

defineProps<{
  iconColor?: string
}>()

const copied = ref(false)
const copyLabel = ref('')

const CHECKERBOARD = `url("data:image/svg+xml,%3Csvg width='8' height='8' viewBox='0 0 8 8' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='8' height='8' fill='%23f0f0f0'/%3E%3Crect width='4' height='4' fill='%23e0e0e0'/%3E%3Crect x='4' y='4' width='4' height='4' fill='%23e0e0e0'/%3E%3C/svg%3E")`

async function copyAll(type: string) {
  if (!bags.value.length) return
  const snippets = await Promise.all(
    bags.value.map(id => getIconSnippet(collections, id, type, false, 'currentColor')),
  )
  const joined = snippets.filter(Boolean).join('\n\n')
  if (joined) {
    try {
      await navigator.clipboard.writeText(joined)
      copied.value = true
      copyLabel.value = `Copied ${bags.value.length} icon${bags.value.length !== 1 ? 's' : ''}`
      setTimeout(() => { copied.value = false }, 1500)
    }
    catch {}
  }
}

async function downloadZip(type: PackType) {
  if (!bags.value.length) return
  await PackZip(collections, bags.value, 'icones-bags', type)
}

function handleRawSelect(value: any) {
  if (!value) return
  const v = String(value)
  if (v === 'download-svg') downloadZip('svg')
  else copyAll(v)
}

function handleFrameworkSelect(value: any) {
  if (!value) return
  const v = String(value)
  if (v.startsWith('copy-')) copyAll(v.replace('copy-', ''))
  else copyAll(v)
}

function confirmClear() {
  if (confirm('Remove all icons from bag?')) {
    clearBag()
  }
}
</script>

<template>
  <div class="flex flex-col w-full relative">
    <!-- Top row: 2 Selects -->
    <div class="flex justify-end gap-2 p-3 pb-2 border-b border-border/50">
      <Select @update:model-value="handleRawSelect">
        <SelectTrigger size="sm" class="w-[155px]">
          <SelectValue placeholder="Copy as..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="svg">Copy as SVG</SelectItem>
          <SelectItem value="data_url">Copy as Data URL</SelectItem>
          <SelectItem value="download-svg">Download SVG (ZIP)</SelectItem>
        </SelectContent>
      </Select>

      <Select @update:model-value="handleFrameworkSelect">
        <SelectTrigger size="sm" class="w-[155px]">
          <SelectValue placeholder="Framework..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="copy-vue">Copy Vue</SelectItem>
          <SelectItem value="copy-jsx">Copy JSX</SelectItem>
          <SelectItem value="copy-tsx">Copy TSX</SelectItem>
          <SelectItem value="copy-svelte">Copy Svelte</SelectItem>
          <SelectItem value="copy-astro">Copy Astro</SelectItem>
          <SelectItem value="copy-names">Component Names</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <!-- Copied toast -->
    <Transition name="fade">
      <div v-if="copied" class="absolute top-14 left-1/2 -translate-x-1/2 z-50 bg-black text-white text-xs px-3 py-1.5 rounded-md shadow-lg whitespace-nowrap">
        {{ copyLabel }}
      </div>
    </Transition>

    <!-- Clear button -->
    <div v-if="bags.length" class="flex items-center justify-between px-3 py-2 border-b border-border/50">
      <span class="text-xs text-muted-foreground">
        {{ bags.length }} icon{{ bags.length !== 1 ? 's' : '' }} in bag
      </span>
      <button
        class="text-xs text-muted-foreground hover:text-destructive transition-colors"
        @click="confirmClear"
      >
        Clear all
      </button>
    </div>

    <!-- Icon list -->
    <div v-if="bags.length" class="relative h-[340px] overflow-y-auto rounded-xl border border-border bg-muted/40 p-3 mx-3 my-3">
      <div class="flex flex-col gap-3">
        <div
          v-for="(iconId, index) in bags"
          :key="iconId"
          class="flex items-center gap-3 rounded-lg border border-border bg-background/70 p-2 group"
        >
          <span class="w-6 shrink-0 text-center text-[10px] font-semibold tabular-nums text-muted-foreground">
            {{ index + 1 }}
          </span>
          <div
            class="h-12 w-12 shrink-0 overflow-hidden rounded-md ring-1 ring-black/5"
            :style="{ backgroundImage: CHECKERBOARD, backgroundSize: '8px 8px' }"
          >
            <Icon
              :icon="iconId"
              class="h-full w-full select-none object-contain"
              :style="{ color: iconColor || 'currentColor' }"
            />
          </div>
          <span class="min-w-0 flex-1 truncate text-[11px] font-medium text-foreground">
            {{ iconId.split(':')[1] || iconId }}
          </span>
          <button
            class="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-destructive/10 hover:text-destructive"
            title="Remove from bag"
            @click="removeFromBag(iconId)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else class="py-12 text-center text-sm italic text-muted-foreground">
      No icons yet ;)
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
