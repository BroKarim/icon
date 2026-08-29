<script setup lang='ts'>
import type { SearchResult } from '../composables/useGlobalSearch'
import { useHead } from '@unhead/vue'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import IconCanvas from '../components/IconCanvas.vue'
import IconDetail from '../components/IconDetail.vue'
import SearchHeader from '../components/SearchHeader.vue'
import SocialPill from '../components/SocialPill.vue'
import { favoriteIcons } from '../store'

useHead({
  title: 'Favorites — Igloo',
  meta: [
    { name: 'description', content: 'Your favorite icons collection on Igloo.' },
    { property: 'og:title', content: 'Favorites — Igloo' },
    { property: 'og:description', content: 'Your favorite icons collection on Igloo.' },
    { property: 'og:url', content: 'https://igloo.brokarim.com/favorites' },
    { property: 'og:image', content: 'https://igloo.brokarim.com/og-image.jpg' },
    { name: 'twitter:title', content: 'Favorites — Igloo' },
    { name: 'twitter:description', content: 'Your favorite icons collection on Igloo.' },
    { name: 'twitter:image', content: 'https://igloo.brokarim.com/og-image.jpg' },
  ],
  link: [
    { rel: 'canonical', href: 'https://igloo.brokarim.com/favorites' },
  ],
})

const showDetail = ref(false)
const selectedIcon = ref('')
const iconScale = ref(1)
const iconColor = ref('#000000')
const bgColor = ref('#ffff')
const iconStyle = ref('line')
const query = ref('')

// Pattern repeat favorites to fill canvas
const canvasResults = computed<SearchResult[]>(() => {
  const favs = favoriteIcons.value
  if (favs.length === 0)
    return []
  if (favs.length >= 20) {
    return favs.map(id => ({
      collectionId: id.split(':')[0],
      collectionName: '',
      iconName: id.split(':')[1] || id,
      iconFull: id,
      matchType: 'exact' as const,
    }))
  }
  // Repeat pattern to have at least 20 icons
  const repeated: string[] = []
  while (repeated.length < 20) {
    repeated.push(...favs)
  }
  return repeated.slice(0, 40).map(id => ({
    collectionId: id.split(':')[0],
    collectionName: '',
    iconName: id.split(':')[1] || id,
    iconFull: id,
    matchType: 'exact' as const,
  }))
})

const filteredCanvasResults = computed<SearchResult[]>(() => {
  let list = canvasResults.value
  if (query.value.trim()) {
    const q = query.value.toLowerCase()
    list = list.filter(r => r.iconName.toLowerCase().includes(q) || r.iconFull.toLowerCase().includes(q))
  }
  if (iconStyle.value && iconStyle.value !== 'line') {
    const style = iconStyle.value.toLowerCase()
    list = list.filter(r =>
      r.iconName.toLowerCase().includes(style)
      || r.collectionId.toLowerCase().includes(style)
      || r.iconFull.toLowerCase().includes(style),
    )
  }
  return list
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
  <div class="relative h-screen overflow-hidden" :style="{ backgroundColor: bgColor }">
    <SearchHeader
      v-model="query"
      v-model:icon-scale="iconScale"
      v-model:icon-color="iconColor"
      v-model:bg-color="bgColor"
      v-model:icon-style="iconStyle"
      :results-count="filteredCanvasResults.length"
    />
    <IconCanvas
      :results="filteredCanvasResults"
      :loading="false"
      :icon-scale="iconScale"
      :icon-color="iconColor"
      :bg-color="bgColor"
      @select="onSelect"
    >
      <template #center>
        <div class="text-center z-999 px-8 py-12">
          <h1 class="text-5xl font-bold tracking-tight text-black/80">
            My Favorites
          </h1>
          <div class="mt-4 text-lg text-black/50">
            {{ favoriteIcons.length }} icon{{ favoriteIcons.length !== 1 ? 's' : '' }} saved
          </div>
          <div v-if="favoriteIcons.length === 0" class="mt-6">
            <p class="text-sm text-black/40">
              No favorites yet. Browse icons and click "add to favorite" to save them here.
            </p>
            <RouterLink
              to="/"
              class="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full bg-black text-white text-sm font-medium hover:bg-black/80 transition-colors"
            >
              Browse Icons
            </RouterLink>
          </div>
        </div>
      </template>
    </IconCanvas>

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
    <SocialPill />
  </div>
</template>
