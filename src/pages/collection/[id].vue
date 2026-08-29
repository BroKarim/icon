<script setup lang='ts'>
import type { SearchResult } from '../../composables/useGlobalSearch'
import { useHead } from '@unhead/vue'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import IconCanvas from '../../components/IconCanvas.vue'
import IconDetail from '../../components/IconDetail.vue'
import SocialPill from '../../components/SocialPill.vue'
import { useGlobalSearch } from '../../composables/useGlobalSearch'
import { pushRecentCollection, setCurrentCollection, useCurrentCollection } from '../../store'

const props = defineProps<{
  id: string
}>()

watch(
  () => props.id,
  () => setCurrentCollection(props.id),
  { immediate: true },
)

onUnmounted(() => setCurrentCollection(''))

const collection = useCurrentCollection()

useHead(() => {
  if (!collection.value) {
    return {
      title: 'Collection — Igloo',
      link: [
        { rel: 'canonical', href: `https://igloo.brokarim.com/collection/${props.id}` },
      ],
      meta: [
        { property: 'og:image', content: 'https://igloo.brokarim.com/og-image.jpg' },
        { name: 'twitter:image', content: 'https://igloo.brokarim.com/og-image.jpg' },
      ],
    }
  }
  const name = `${collection.value.name} — Igloo`
  const description = `Browse ${collection.value.icons.length} icons from the ${collection.value.name} collection. Powered by Iconify.`
  const url = `https://igloo.brokarim.com/collection/${props.id}`
  return {
    title: name,
    meta: [
      { name: 'description', content: description },
      { property: 'og:title', content: name },
      { property: 'og:description', content: description },
      { property: 'og:url', content: url },
      { property: 'og:image', content: 'https://igloo.brokarim.com/og-image.jpg' },
      { name: 'twitter:title', content: name },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: 'https://igloo.brokarim.com/og-image.jpg' },
    ],
    link: [
      { rel: 'canonical', href: url },
    ],
  }
})

onMounted(() => {
  pushRecentCollection(props.id)
})

const { query, results, loading, runSearch, hasSearched } = useGlobalSearch()
hasSearched.value = true // disable auto-search watch; user submits manually

const showDetail = ref(false)
const selectedIcon = ref('')
const iconScale = ref(1)
const iconColor = ref('#000000')
const bgColor = ref('#ffff')
const iconStyle = ref('line')
const hasSubmitted = ref(false)

const allIcons = computed<SearchResult[]>(() => {
  const c = collection.value
  if (!c)
    return []
  return c.icons.map(name => ({
    collectionId: c.id,
    collectionName: c.name,
    iconName: name.includes(':') ? name.split(':')[1] : name,
    iconFull: name.includes(':') ? name : `${c.id}:${name}`,
    matchType: 'exact' as const,
  }))
})

const canvasResults = computed<SearchResult[]>(() => {
  let base: SearchResult[]
  if (hasSubmitted.value && query.value.trim()) {
    // Filter global results to only icons in this collection
    const collectionIconIds = new Set(allIcons.value.map(i => i.iconFull))
    const filtered = results.value.filter(r => collectionIconIds.has(r.iconFull))
    if (filtered.length > 0) {
      base = filtered
    }
    else {
      // Fallback: show random icons from collection
      const shuffled = [...allIcons.value].sort(() => Math.random() - 0.5)
      base = shuffled.slice(0, Math.max(filtered.length, 6))
    }
  }
  else {
    base = allIcons.value
  }
  // Filter by icon style
  if (iconStyle.value && iconStyle.value !== 'line') {
    const style = iconStyle.value.toLowerCase()
    const styled = base.filter(r =>
      r.iconName.toLowerCase().includes(style)
      || r.collectionId.toLowerCase().includes(style)
      || r.iconFull.toLowerCase().includes(style),
    )
    if (styled.length > 0)
      return styled
  }
  return base
})

function onSearchSubmit() {
  if (!query.value.trim())
    return
  hasSubmitted.value = true
  runSearch()
}

watch(query, () => {
  if (hasSubmitted.value && !query.value.trim())
    hasSubmitted.value = false
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
  <WithNavbar v-if="!collection" class="h-full">
    <div class="py-8 px-4 text-gray-700 text-center dark:text-dark-700">
      Loading...
    </div>
  </WithNavbar>
  <WithNavbar v-else class="h-full">
    <div class="relative flex-1 of-hidden">
      <SearchHeader
        v-model="query"
        v-model:icon-scale="iconScale"
        v-model:icon-color="iconColor"
        v-model:bg-color="bgColor"
        v-model:icon-style="iconStyle"
        :results-count="canvasResults.length"
        @submit="onSearchSubmit"
      />

      <IconCanvas
        :results="canvasResults"
        :loading="loading && hasSearched"
        :icon-scale="iconScale"
        :icon-color="iconColor"
        :bg-color="bgColor"
        @select="onSelect"
      >
        <template #center>
          <div class="text-center z-999 px-8 py-12">
            <h1 class="text-5xl font-bold tracking-tight text-black/80">
              {{ collection.name }}
            </h1>
            <div v-if="collection.author" class="mt-4 text-lg text-black/50">
              by {{ collection.author.name }}
            </div>
            <div v-if="collection.license" class="mt-2 text-sm text-black/40">
              <a :href="collection.license.url" target="_blank" class="underline hover:text-black/60">{{ collection.license.title }}</a>
            </div>
          </div>
        </template>
      </IconCanvas>

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
      <SocialPill />
    </div>
  </WithNavbar>
</template>
