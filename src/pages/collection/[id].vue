<script setup lang='ts'>
import type { SearchResult } from '../../composables/useGlobalSearch'
import IconCanvas from '../../components/IconCanvas.vue'
import IconDetail from '../../components/IconDetail.vue'
import ShDrawer from '../../components/ui/drawer/Drawer.vue'
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

onMounted(() => {
  pushRecentCollection(props.id)
})

const showDetail = ref(false)
const selectedIcon = ref('')
const iconScale = ref(1)
const iconColor = ref('#000000')
const bgColor = ref('#f7f3ec')
const query = ref('')

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
  if (!query.value.trim())
    return allIcons.value

  return allIcons.value.filter(item =>
    item.iconName.toLowerCase().includes(query.value.toLowerCase()),
  )
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
        :results-count="canvasResults.length"
      />

      <IconCanvas
        :results="canvasResults"
        :loading="false"
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

      <ShDrawer v-model:open="showDetail">
        <DrawerContent class="bg-white border-t-2 border-black">
          <IconDetail
            v-if="selectedIcon"
            :icon="selectedIcon"
            :show-collection="true"
            :icon-color="iconColor"
            @close="onClose"
          />
        </DrawerContent>
      </ShDrawer>
    </div>
  </WithNavbar>
</template>
