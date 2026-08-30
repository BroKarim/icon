<script setup lang='ts'>
import { useHead } from '@unhead/vue'
import { AnimatePresence, LayoutGroup } from 'motion-v'
import { computed, onMounted, ref, watch } from 'vue'
// import IconDetail from '../components/IconDetail.vue'
import IconDetailModal from '@/components/IconDetailModal.vue'
// import { Sheet, SheetContent } from '@/components/ui/sheet'
import NewHome from '../components/home/NewHome.vue'
import IconCanvas from '../components/IconCanvas.vue'
import SocialPill from '../components/SocialPill.vue'
import { useGlobalSearch } from '../composables/useGlobalSearch'

useHead({
  title: 'Igloo — Icon Search Engine with Infinite Canvas',
  meta: [
    { name: 'description', content: 'Browse and search 200,000+ icons from Iconify with an intuitive infinite canvas interface. Search, customize, and download SVG icons for any project.' },
    { property: 'og:title', content: 'Igloo — Icon Search Engine with Infinite Canvas' },
    { property: 'og:description', content: 'Browse and search 200,000+ icons from Iconify with an intuitive infinite canvas interface. Search, customize, and download SVG icons for any project.' },
    { property: 'og:url', content: 'https://igloo.brokarim.com/' },
    { property: 'og:image', content: 'https://igloo.brokarim.com/og-image.jpg' },
    { name: 'twitter:title', content: 'Igloo — Icon Search Engine with Infinite Canvas' },
    { name: 'twitter:description', content: 'Browse and search 200,000+ icons from Iconify with an intuitive infinite canvas interface. Search, customize, and download SVG icons for any project.' },
    { name: 'twitter:image', content: 'https://igloo.brokarim.com/og-image.jpg' },
  ],
  link: [
    { rel: 'canonical', href: 'https://igloo.brokarim.com/' },
  ],
})

const { query, results, loading, ensureLoaded, runSearch, hasSearched } = useGlobalSearch()

const showDetail = ref(false)
const selectedIcon = ref('')
const iconScale = ref(1)
const iconColor = ref('#000000')
const bgColor = ref('#ffff')
const iconStyle = ref('line')

const variant = computed<'center' | 'top'>(() => hasSearched.value ? 'top' : 'center')
const showCanvas = computed(() => variant.value === 'top' && query.value.trim().length > 0)

const filteredResults = computed(() => {
  if (!iconStyle.value || iconStyle.value === 'line')
    return results.value
  const style = iconStyle.value.toLowerCase()
  return results.value.filter(r =>
    r.iconName.toLowerCase().includes(style)
    || r.collectionId.toLowerCase().includes(style)
    || r.iconFull.toLowerCase().includes(style),
  )
})

function onSearchSubmit() {
  if (!query.value.trim())
    return
  hasSearched.value = true
  runSearch()
}

function onHomeReset() {
  hasSearched.value = false
  query.value = ''
  results.value = []
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
        <NewHome
          v-if="!hasSearched"
          key="center"
          v-model:query="query"
          @submit="onSearchSubmit"
          @reset="onHomeReset"
        />
        <SearchHeader
          v-else
          key="top"
          v-model="query"
          v-model:icon-scale="iconScale"
          v-model:icon-color="iconColor"
          v-model:bg-color="bgColor"
          v-model:icon-style="iconStyle"
          :results-count="filteredResults.length"
          @submit="onSearchSubmit"
        />
      </AnimatePresence>
    </LayoutGroup>

    <IconCanvas
      v-if="showCanvas"
      :results="filteredResults"
      :loading="loading"
      :icon-scale="iconScale"
      :icon-color="iconColor"
      :bg-color="bgColor"
      :disable-center-clear-zone="true"
      @select="onSelect"
    />

    <SocialPill v-if="hasSearched" />

    <IconDetailModal
      v-if="selectedIcon"
      v-model:open="showDetail"
      v-model:icon-color="iconColor"
      :icon="selectedIcon"
      @close="onClose"
    />
    <!-- <Sheet v-model:open="showDetail">
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
    </Sheet> -->
  </div>
</template>
