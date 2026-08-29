<script setup lang="ts">
import { ref } from 'vue'
import { collections } from '../data'
import { bags, clearBag, removeFromBag } from '../store'
import { getIconSnippet } from '../utils/icons'
import { PackZip } from '../utils/pack'

defineProps<{
  iconColor?: string
}>()

const copied = ref(false)
const copyLabel = ref('')
const showRawMenu = ref(false)
const showFrameworkMenu = ref(false)

// State untuk melacak pilihan aktif user
const selectedActionType = ref('svg')
const selectedActionLabel = ref('Copy SVG')

const CHECKERBOARD = `url("data:image/svg+xml,%3Csvg width='8' height='8' viewBox='0 0 8 8' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='8' height='8' fill='%23ebe7fb'/%3E%3Crect width='4' height='4' fill='%23dfd8fa'/%3E%3Crect x='4' y='4' width='4' height='4' fill='%23dfd8fa'/%3E%3C/svg%3E")`

async function executeAction() {
  if (!bags.value.length) return

  if (selectedActionType.value === 'download-svg') {
    await PackZip(collections, bags.value, 'icones-bags', 'svg')
    return
  }

  // Jika formatnya framework atau raw asset
  const snippetType = selectedActionType.value
  const snippets = await Promise.all(
    bags.value.map(id => getIconSnippet(collections, id, snippetType, false, 'currentColor')),
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

function confirmClear(e: MouseEvent) {
  e.stopPropagation()
  if (confirm('Remove all icons from bag?')) {
    clearBag()
  }
}
</script>

<template>
  <div class="relative flex flex-col w-full bg-[#EBE4FF] p-4 rounded-[28px] text-black select-none" @click="showRawMenu = false; showFrameworkMenu = false">
    <!-- Header -->
    <div class="flex items-center justify-between mb-3 px-1">
      <div class="flex items-center gap-2">
        <h3 class="text-lg font-black tracking-tight text-black">
          Icon Bag
        </h3>
        <span class="rounded-full bg-[#DDD2FC] px-2 py-0.5 text-[11px] font-bold text-black/70">
          {{ bags.length }}
        </span>
      </div>
    </div>

    <!-- Actions: Custom Dropdown Pills -->
    <div class="grid grid-cols-2 gap-2 mb-3 relative z-30">
      <!-- Dropdown Raw / Assets -->
      <div class="relative">
        <button
          type="button"
          class="flex items-center justify-between w-full h-9 px-3 rounded-xl bg-[#DDD2FC] hover:bg-[#D4C7FA] text-xs font-bold text-black transition-colors"
          @click.stop="toggleRaw"
        >
          <span class="truncate">Copy asset</span>
          <svg class="w-3.5 h-3.5 shrink-0 ml-1 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m6 9 6 6 6-6"/></svg>
        </button>

        <div
          v-if="showRawMenu"
          class="absolute left-0 top-full mt-1.5 w-44 rounded-2xl bg-[#DDD2FC] p-1.5 shadow-xl border border-white/20 z-50 flex flex-col gap-0.5"
          @click.stop
        >
          <button class="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold text-black hover:bg-[#C9B9F8] transition-colors" @click="handleSelectRaw('svg', 'Copy SVG')">Copy SVG</button>
          <button class="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold text-black hover:bg-[#C9B9F8] transition-colors" @click="handleSelectRaw('data_url', 'Copy Data URL')">Copy Data URL</button>
          <button class="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold text-black hover:bg-[#C9B9F8] transition-colors" @click="handleSelectRaw('download-svg', 'Download ZIP')">Download ZIP</button>
        </div>
      </div>

      <!-- Dropdown Frameworks -->
      <div class="relative">
        <button
          type="button"
          class="flex items-center justify-between w-full h-9 px-3 rounded-xl bg-[#DDD2FC] hover:bg-[#D4C7FA] text-xs font-bold text-black transition-colors"
          @click.stop="toggleFramework"
        >
          <span class="truncate">Framework</span>
          <svg class="w-3.5 h-3.5 shrink-0 ml-1 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m6 9 6 6 6-6"/></svg>
        </button>

        <div
          v-if="showFrameworkMenu"
          class="absolute right-0 top-full mt-1.5 w-40 rounded-2xl bg-[#DDD2FC] p-1.5 shadow-xl border border-white/20 z-50 flex flex-col gap-0.5"
          @click.stop
        >
          <button class="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold text-black hover:bg-[#C9B9F8] transition-colors" @click="handleSelectFramework('vue', 'Copy Vue')">Vue</button>
          <button class="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold text-black hover:bg-[#C9B9F8] transition-colors" @click="handleSelectFramework('jsx', 'Copy JSX')">JSX</button>
          <button class="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold text-black hover:bg-[#C9B9F8] transition-colors" @click="handleSelectFramework('tsx', 'Copy TSX')">TSX</button>
          <button class="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold text-black hover:bg-[#C9B9F8] transition-colors" @click="handleSelectFramework('svelte', 'Copy Svelte')">Svelte</button>
          <button class="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold text-black hover:bg-[#C9B9F8] transition-colors" @click="handleSelectFramework('astro', 'Copy Astro')">Astro</button>
          <button class="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold text-black hover:bg-[#C9B9F8] transition-colors" @click="handleSelectFramework('names', 'Copy Names')">Names only</button>
        </div>
      </div>
    </div>

    <!-- Toast Feedback -->
    <Transition name="fade">
      <div v-if="copied" class="absolute top-3 left-1/2 -translate-x-1/2 z-50 bg-black text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg whitespace-nowrap pointer-events-none">
        {{ copyLabel }}
      </div>
    </Transition>

    <!-- Icon List -->
    <div v-if="bags.length" class="flex flex-col gap-1.5 max-h-[260px] overflow-y-auto pr-0.5 relative z-10 mb-3">
      <div
        v-for="(iconId, index) in bags"
        :key="iconId"
        class="group flex items-center justify-between rounded-xl bg-[#DDD2FC] p-2 transition-colors hover:bg-[#D4C7FA]"
      >
        <div class="flex items-center gap-2.5 min-w-0">
          <div
            class="h-9 w-9 shrink-0 overflow-hidden rounded-lg flex items-center justify-center"
            :style="{ backgroundImage: CHECKERBOARD, backgroundSize: '8px 8px' }"
          >
            <Icon
              :icon="iconId"
              class="h-5 w-5 select-none object-contain"
              :style="{ color: iconColor || 'currentColor' }"
            />
          </div>
          <div class="flex flex-col min-w-0">
            <span class="truncate text-xs font-bold text-black">
              {{ iconId.split(':')[1] || iconId }}
            </span>
            <span class="text-[10px] font-semibold text-black/40">
              #{{ index + 1 }}
            </span>
          </div>
        </div>

        <button
          type="button"
          class="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg text-black/40 hover:text-black hover:bg-[#C9B9F8]"
          title="Remove from bag"
          @click.stop="removeFromBag(iconId)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="flex flex-col items-center justify-center py-8 rounded-xl bg-[#DDD2FC]/50 text-black/40 mb-2">
      <p class="text-xs font-bold">No icons selected</p>
    </div>

    <!-- Footer Controls (Bottom Right) -->
    <div v-if="bags.length" class="flex items-center justify-end gap-2 pt-1 border-t border-black/5">
      <button
        type="button"
        class="text-[11px] font-semibold text-black/50 hover:text-black transition-colors px-2 py-1 rounded-md"
        @click="confirmClear"
      >
        Clear all
      </button>
      <button
        type="button"
        class="rounded-full bg-black px-3.5 py-1 text-[11px] font-bold text-white tracking-wide shadow-sm hover:bg-black/80 active:scale-95 transition-all"
        @click.stop="executeAction"
      >
        {{ selectedActionLabel }}
      </button>
    </div>
  </div>
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
