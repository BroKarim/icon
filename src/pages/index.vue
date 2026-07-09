<script setup lang='ts'>
import { useHead } from '@unhead/vue'
import { AnimatePresence, LayoutGroup } from 'motion-v'
import { computed, onMounted, ref, watch } from 'vue'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import IconCanvas from '../components/IconCanvas.vue'
import IconDetail from '../components/IconDetail.vue'
import SearchCenter from '../components/SearchCenter.vue'
import VersionSwitcher from '../components/VersionSwitcher.vue'
import { useGlobalSearch } from '../composables/useGlobalSearch'

useHead({
  title: 'Icons — Icon Explorer with Infinite Canvas',
  meta: [
    { name: 'description', content: 'Browse and search 200,000+ icons from Iconify with an intuitive infinite canvas interface. Search, customize, and download SVG icons for any project.' },
    { property: 'og:title', content: 'Icons — Icon Explorer with Infinite Canvas' },
    { property: 'og:description', content: 'Browse and search 200,000+ icons from Iconify with an intuitive infinite canvas interface. Search, customize, and download SVG icons for any project.' },
    { property: 'og:url', content: 'https://icons.brokarim.com/' },
    { property: 'og:image', content: 'https://icons.brokarim.com/og-image.jpg' },
    { name: 'twitter:title', content: 'Icons — Icon Explorer with Infinite Canvas' },
    { name: 'twitter:description', content: 'Browse and search 200,000+ icons from Iconify with an intuitive infinite canvas interface. Search, customize, and download SVG icons for any project.' },
    { name: 'twitter:image', content: 'https://icons.brokarim.com/og-image.jpg' },
  ],
  link: [
    { rel: 'canonical', href: 'https://icons.brokarim.com/' },
  ],
})

const { query, results, loading, ensureLoaded, runSearch, hasSearched } = useGlobalSearch()

const showDetail = ref(false)
const selectedIcon = ref('')
const iconScale = ref(1)
const iconColor = ref('#000000')
const bgColor = ref('#ffff')

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
          @submit="onSearchSubmit"
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
        class="p-0 gap-0 w-full sm:max-w-md overflow-y-auto"
        :style="{ backgroundColor: bgColor }"
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
