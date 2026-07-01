<script setup lang='ts'>
import { AnimatePresence, LayoutGroup } from 'motion-v'
import { computed, onMounted, ref, watch } from 'vue'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import IconCanvas from '../components/IconCanvas.vue'
import IconDetail from '../components/IconDetail.vue'
import SearchCenter from '../components/SearchCenter.vue'
import { useGlobalSearch } from '../composables/useGlobalSearch'

const { query, results, loading, ensureLoaded, runSearch } = useGlobalSearch()

const showDetail = ref(false)
const selectedIcon = ref('')
const iconScale = ref(1)
const iconColor = ref('#000000')
const bgColor = ref('#f7f3ec')

const hasSearched = ref(false)
const variant = computed<'center' | 'top'>(() => hasSearched.value ? 'top' : 'center')
const showCanvas = computed(() => variant.value === 'top' && query.value.trim().length > 0)

function onSearchSubmit() {
  if (!query.value.trim())
    return
  hasSearched.value = true
  runSearch()
}

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

watch(showDetail, (val) => {
  if (!val)
    selectedIcon.value = ''
})
</script>

<template>
  <div class="relative h-screen overflow-hidden text-slate-900" :style="{ backgroundColor: bgColor }">
    <LayoutGroup>
      <AnimatePresence mode="popLayout">
        <SearchCenter
          v-if="variant === 'center'"
          key="center"
          v-model="query"
          @submit="onSearchSubmit"
        />
        <SearchHeader
          v-else
          key="top"
          v-model="query"
          v-model:icon-scale="iconScale"
          v-model:icon-color="iconColor"
          v-model:bg-color="bgColor"
          :results-count="results.length"
        />
      </AnimatePresence>
    </LayoutGroup>

    <IconCanvas
      v-if="showCanvas"
      :results="results"
      :loading="loading"
      :icon-scale="iconScale"
      :icon-color="iconColor"
      :bg-color="bgColor"
      :disable-center-clear-zone="true"
      @select="onSelect"
    />

    <Sheet v-model:open="showDetail">
      <SheetContent
        class="bg-white p-0 gap-0 w-full sm:max-w-md overflow-y-auto"
      >
        <IconDetail
          v-if="selectedIcon"
          :icon="selectedIcon"
          :show-collection="true"
          :icon-color="iconColor"
          @close="onClose"
        />
      </SheetContent>
    </Sheet>
  </div>
</template>
