<script setup lang='ts'>
import { useHead } from '@unhead/vue'
import { LayoutGroup } from 'motion-v'
import { computed, onMounted, ref, watch } from 'vue'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import IconCanvas from '../components/IconCanvas.vue'
import IconDetail from '../components/IconDetail.vue'
import SearchCenter from '../components/SearchCenter.vue'
import SearchHeader from '../components/SearchHeader.vue'
import { useGlobalSearch } from '../composables/useGlobalSearch'

useHead({
  title: 'Igloo — Browse & Search Icon Sets',
  meta: [
    { name: 'description', content: 'Browse icons by collection, search across 200,000+ icons from Iconify with infinite canvas. Explore, customize, and download SVG icons.' },
    { property: 'og:title', content: 'Igloo — Browse & Search Icon Sets' },
    { property: 'og:description', content: 'Browse icons by collection, search across 200,000+ icons from Iconify with infinite canvas. Explore, customize, and download SVG icons.' },
    { property: 'og:url', content: 'https://igloo.brokarim.com/v1' },
    { property: 'og:image', content: 'https://igloo.brokarim.com/og-image.jpg' },
    { name: 'twitter:title', content: 'Igloo — Browse & Search Icon Sets' },
    { name: 'twitter:description', content: 'Browse icons by collection, search across 200,000+ icons from Iconify with infinite canvas. Explore, customize, and download SVG icons.' },
    { name: 'twitter:image', content: 'https://igloo.brokarim.com/og-image.jpg' },
  ],
  link: [
    { rel: 'canonical', href: 'https://igloo.brokarim.com/v1' },
  ],
})

const { query, results, browseResults, loading, ensureLoaded, runSearch, hasSearched } = useGlobalSearch()

const showDetail = ref(false)
const selectedIcon = ref('')
const iconScale = ref(1)
const iconColor = ref('#000000')
const bgColor = ref('#ffff')

const variant = computed<'center' | 'top'>(() => hasSearched.value ? 'top' : 'center')
const canvasResults = computed(() => {
  if (!hasSearched.value)
    return browseResults.value
  return results.value
})

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
      <SearchHeader
        v-model="query"
        v-model:icon-scale="iconScale"
        v-model:icon-color="iconColor"
        v-model:bg-color="bgColor"
        :results-count="canvasResults.length"
        :hide-search-input="!hasSearched"
        @submit="onSearchSubmit"
      />
      <IconCanvas
        :results="canvasResults"
        :loading="loading"
        :icon-scale="iconScale"
        :icon-color="iconColor"
        :bg-color="bgColor"
        :disable-center-clear-zone="hasSearched"
        @select="onSelect"
      >
        <template #center>
          <SearchCenter
            v-if="variant === 'center'"
            v-model="query"
            @submit="onSearchSubmit"
          />
        </template>
      </IconCanvas>
    </LayoutGroup>

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
