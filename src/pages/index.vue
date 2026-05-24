<script setup lang='ts'>
import { computed, onMounted, ref, watch } from 'vue'
import IconCanvas from '../components/IconCanvas.vue'
import IconDetail from '../components/IconDetail.vue'
import ShDrawer from '../components/ui/drawer/Drawer.vue'
import { useGlobalSearch } from '../composables/useGlobalSearch'

const { query, results, browseResults, loading, ensureLoaded } = useGlobalSearch()

const showDetail = ref(false)
const selectedIcon = ref('')
const iconScale = ref(1)
const iconColor = ref('#000000')

const canvasResults = computed(() => query.value.trim() ? results.value : browseResults.value)

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
  <div class="relative h-screen overflow-hidden bg-[#f7f3ec] text-slate-900">
    <SearchHeader
      v-model="query"
      v-model:icon-scale="iconScale"
      v-model:icon-color="iconColor"
      :results-count="canvasResults.length"
    />

    <IconCanvas
      :results="canvasResults"
      :loading="loading"
      :icon-scale="iconScale"
      :icon-color="iconColor"
      @select="onSelect"
    />

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
</template>
