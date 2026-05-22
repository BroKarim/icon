<script setup lang='ts'>
import { computed, onMounted, ref } from 'vue'
import IconCanvas from '../components/IconCanvas.vue'
import IconDetail from '../components/IconDetail.vue'
import Modal from '../components/Modal.vue'
import { useGlobalSearch } from '../composables/useGlobalSearch'

const { query, results, browseResults, loading, ensureLoaded } = useGlobalSearch()

const showDetail = ref(false)
const selectedIcon = ref('')

const canvasResults = computed(() => query.value.trim() ? results.value : browseResults.value)
const resultLabel = computed(() => (
  query.value.trim()
    ? `${canvasResults.value.length} hasil`
    : `${canvasResults.value.length} ikon`
))

onMounted(() => {
  ensureLoaded()
})

function onSelect(iconFull: string) {
  selectedIcon.value = iconFull
  showDetail.value = true
}

function onClose() {
  showDetail.value = false
  selectedIcon.value = ''
}
</script>

<template>
  <div class="relative h-screen overflow-hidden bg-[#f7f3ec] text-slate-900">
    <div class="pointer-events-none absolute inset-x-0 top-0 z-20 px-4 pt-4">
      <div class="mx-auto flex w-full max-w-6xl items-center gap-3 rounded-[30px] bg-white/58 px-3 py-3 shadow-[0_20px_70px_rgba(120,106,82,0.12)] ring-1 ring-black/5 backdrop-blur-xl">
        <div class="pointer-events-auto flex min-w-0 flex-1 items-center gap-3 rounded-[24px] bg-[#e9e4dd]/92 px-4 py-3">
          <Icon icon="carbon:search" class="text-xl text-black/45" />
          <input
            v-model="query"
            type="text"
            placeholder="Search 10,000 Things"
            class="w-full min-w-0 border-none bg-transparent text-[15px] text-slate-800 outline-none placeholder:text-black/38"
          >
          <button
            v-if="query"
            type="button"
            class="rounded-full bg-black/6 px-3 py-1.5 text-xs font-medium text-black/55 transition hover:bg-black/10"
            @click="query = ''"
          >
            Clear
          </button>
        </div>

        <div class="pointer-events-auto hidden shrink-0 items-center rounded-full bg-[#c8b9a1]/82 px-4 py-3 text-sm font-medium text-white shadow-sm md:flex">
          {{ resultLabel }}
        </div>
      </div>
    </div>

    <IconCanvas
      :results="canvasResults"
      :loading="loading"
      @select="onSelect"
    />

    <Modal :value="showDetail" @close="onClose">
      <IconDetail
        v-if="selectedIcon"
        :icon="selectedIcon"
        :show-collection="true"
        @close="onClose"
      />
    </Modal>
  </div>
</template>
