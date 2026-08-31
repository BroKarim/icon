<!-- src/components/BagModal.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogPortal,
} from '@/components/ui/dialog'
import { collections } from '../data'
import { bags, clearBag, removeFromBag } from '../store'
import { getIconSnippet } from '../utils/icons'
import { PackZip } from '../utils/pack'

const props = defineProps<{
  open: boolean
  iconColor?: string
}>()

const emit = defineEmits<{
  (e: 'update:open', val: boolean): void
  (e: 'close'): void
}>()

const copied = ref(false)
const copyLabel = ref('')
const showRawMenu = ref(false)
const showFrameworkMenu = ref(false)

const selectedActionType = ref('svg')
const selectedActionLabel = ref('Copy SVG')

const CHECKERBOARD = `url("data:image/svg+xml,%3Csvg width='8' height='8' viewBox='0 0 8 8' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='8' height='8' fill='%23ebe7fb'/%3E%3Crect width='4' height='4' fill='%23dfd8fa'/%3E%3Crect x='4' y='4' width='4' height='4' fill='%23dfd8fa'/%3E%3C/svg%3E")`

async function executeAction() {
  if (!bags.value.length)
    return

  if (selectedActionType.value === 'download-svg') {
    await PackZip(collections, bags.value, 'icones-bags', 'svg')
    return
  }

  const snippetType = selectedActionType.value
  const snippets = await Promise.all(
    bags.value.map(id => getIconSnippet(collections, id, snippetType, false, props.iconColor || 'currentColor')),
  )
  const joined = snippets.filter(Boolean).join('\n\n')
  if (joined) {
    try {
      await navigator.clipboard.writeText(joined)
      copied.value = true
      copyLabel.value = `Copied ${bags.value.length} icon${bags.value.length !== 1 ? 's' : ''}`
      setTimeout(() => {
        copied.value = false
      }, 1500)
    }
    catch {}
  }
}

function handleSelectRaw(value: string, label: string) {
  showRawMenu.value = false
  selectedActionType.value = value
  selectedActionLabel.value = label
}

function handleSelectFramework(value: string, label: string) {
  showFrameworkMenu.value = false
  selectedActionType.value = value
  selectedActionLabel.value = label
}

function toggleRaw() {
  showRawMenu.value = !showRawMenu.value
  showFrameworkMenu.value = false
}

function toggleFramework() {
  showFrameworkMenu.value = !showFrameworkMenu.value
  showRawMenu.value = false
}

function handleClose() {
  emit('update:open', false)
  emit('close')
}

function confirmClear(e: MouseEvent) {
  e.stopPropagation()
  // eslint-disable-next-line no-alert
  if (confirm('Remove all icons from bag?')) {
    clearBag()
  }
}
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogPortal>
      <!-- Backdrop Blur Intens (Light Mode Focused) -->
      <DialogOverlay class="fixed inset-0 z-50 bg-white/70 backdrop-blur-md transition-all duration-200" />

      <DialogContent class="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 border-0 bg-transparent p-0 shadow-none outline-none max-w-[440px] w-[90vw]" @click="showRawMenu = false; showFrameworkMenu = false">
        <template #close-icon />

        <!-- Floating Toolbar (Above Modal) -->
        <div class="flex items-center justify-between px-1 font-mono text-xs select-none">
          <!-- Left: Title & Counter Badge -->
          <div class="flex items-center gap-2">
            <span class="rounded-full bg-white/90 px-3.5 py-1.5 font-bold text-zinc-800 shadow-sm border border-black/5 backdrop-blur-sm">
              Icon Bag
            </span>
            <span class="rounded-full bg-white/90 px-3.5 py-1.5 text-zinc-600 shadow-sm border border-black/5 backdrop-blur-sm">
              {{ bags.length }} items
            </span>
          </div>

          <!-- Right: Close Button -->
          <button
            type="button"
            class="flex items-center justify-center h-8 w-8 rounded-full bg-white/90 text-zinc-500 shadow-sm border border-black/5 backdrop-blur-sm hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
            @click="handleClose"
          >
            <Icon icon="lucide:x" class="w-4 h-4" />
          </button>
        </div>

        <!-- Main Studio Box -->
        <div class="flex flex-col bg-white rounded-[32px] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-black/5 font-mono select-none">
          <!-- Actions: Custom Dropdown Pills -->
          <div class="grid grid-cols-2 gap-2 mb-4 relative z-30">
            <!-- Dropdown Raw / Assets -->
            <div class="relative">
              <button
                type="button"
                class="flex items-center justify-between w-full h-9 px-3 rounded-xl bg-sky-50 hover:bg-sky-100/70 text-xs font-semibold text-sky-950 transition-colors"
                @click.stop="toggleRaw"
              >
                <span class="truncate">Copy asset</span>
                <svg class="w-3.5 h-3.5 shrink-0 ml-1 text-sky-800/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m6 9 6 6 6-6" /></svg>
              </button>

              <div
                v-if="showRawMenu"
                class="absolute left-0 top-full mt-1.5 w-44 rounded-2xl bg-white p-1.5 shadow-xl border border-zinc-100 z-50 flex flex-col gap-0.5"
                @click.stop
              >
                <button type="button" class="w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-700 hover:bg-zinc-100 transition-colors" @click="handleSelectRaw('svg', 'Copy SVG')">
                  Copy SVG
                </button>
                <button type="button" class="w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-700 hover:bg-zinc-100 transition-colors" @click="handleSelectRaw('data_url', 'Copy Data URL')">
                  Copy Data URL
                </button>
                <button type="button" class="w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-700 hover:bg-zinc-100 transition-colors" @click="handleSelectRaw('download-svg', 'Download ZIP')">
                  Download ZIP
                </button>
              </div>
            </div>

            <!-- Dropdown Frameworks -->
            <div class="relative">
              <button
                type="button"
                class="flex items-center justify-between w-full h-9 px-3 rounded-xl bg-sky-50 hover:bg-sky-100/70 text-xs font-semibold text-sky-950 transition-colors"
                @click.stop="toggleFramework"
              >
                <span class="truncate">Framework</span>
                <svg class="w-3.5 h-3.5 shrink-0 ml-1 text-sky-800/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m6 9 6 6 6-6" /></svg>
              </button>

              <div
                v-if="showFrameworkMenu"
                class="absolute right-0 top-full mt-1.5 w-40 rounded-2xl bg-white p-1.5 shadow-xl border border-zinc-100 z-50 flex flex-col gap-0.5"
                @click.stop
              >
                <button type="button" class="w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-700 hover:bg-zinc-100 transition-colors" @click="handleSelectFramework('vue', 'Copy Vue')">
                  Vue
                </button>
                <button type="button" class="w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-700 hover:bg-zinc-100 transition-colors" @click="handleSelectFramework('jsx', 'Copy JSX')">
                  JSX
                </button>
                <button type="button" class="w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-700 hover:bg-zinc-100 transition-colors" @click="handleSelectFramework('tsx', 'Copy TSX')">
                  TSX
                </button>
                <button type="button" class="w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-700 hover:bg-zinc-100 transition-colors" @click="handleSelectFramework('svelte', 'Copy Svelte')">
                  Svelte
                </button>
                <button type="button" class="w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-700 hover:bg-zinc-100 transition-colors" @click="handleSelectFramework('astro', 'Copy Astro')">
                  Astro
                </button>
                <button type="button" class="w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-700 hover:bg-zinc-100 transition-colors" @click="handleSelectFramework('names', 'Copy Names')">
                  Names only
                </button>
              </div>
            </div>
          </div>

          <!-- Icon List -->
          <div v-if="bags.length" class="flex flex-col gap-1.5 max-h-[280px] overflow-y-auto pr-1 relative z-10 mb-4">
            <div
              v-for="(iconId, index) in bags"
              :key="iconId"
              class="group flex items-center justify-between rounded-2xl bg-zinc-50 border border-black/5 p-2 transition-colors hover:bg-zinc-100/70"
            >
              <div class="flex items-center gap-2.5 min-w-0">
                <div
                  class="h-9 w-9 shrink-0 overflow-hidden rounded-xl flex items-center justify-center border border-black/5"
                  :style="{ backgroundImage: CHECKERBOARD, backgroundSize: '8px 8px' }"
                >
                  <Icon
                    :icon="iconId"
                    class="h-5 w-5 select-none object-contain"
                    :style="{ color: iconColor || 'currentColor' }"
                  />
                </div>
                <div class="flex flex-col min-w-0">
                  <span class="truncate text-xs font-bold text-zinc-800">
                    {{ iconId.split(':')[1] || iconId }}
                  </span>
                  <span class="text-[10px] text-zinc-400">
                    #{{ index + 1 }}
                  </span>
                </div>
              </div>

              <button
                type="button"
                class="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 hover:bg-zinc-200/60"
                title="Remove from bag"
                @click.stop="removeFromBag(iconId)"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
              </button>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="flex flex-col items-center justify-center py-10 rounded-2xl bg-zinc-50 border border-black/5 text-zinc-400 mb-4">
            <p class="text-xs font-semibold">
              No icons in bag
            </p>
          </div>

          <!-- Footer Actions (Bottom Right) -->
          <div v-if="bags.length" class="flex items-center justify-between pt-3 border-t border-zinc-100">
            <button
              type="button"
              class="text-xs text-zinc-500 hover:text-zinc-900 transition-colors px-1 py-1 rounded-md"
              @click="confirmClear"
            >
              Clear all
            </button>
            <button
              type="button"
              class="rounded-xl bg-zinc-900 hover:bg-zinc-800 active:scale-95 px-4 py-2 text-xs font-bold text-white tracking-wide shadow-sm transition-all"
              @click.stop="executeAction"
            >
              {{ selectedActionLabel }}
            </button>
          </div>
        </div>

        <!-- Toast Feedback -->
        <Transition name="fade">
          <div
            v-if="copied"
            class="absolute top-16 left-1/2 -translate-x-1/2 z-50 bg-black text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-xl pointer-events-none"
          >
            {{ copyLabel }}
          </div>
        </Transition>
      </DialogContent>
    </DialogPortal>
  </Dialog>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translate(-50%, -6px);
}
</style>
