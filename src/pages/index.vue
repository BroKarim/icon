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
const bgColor = ref('#f7f3ec')

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
  <div class="relative h-screen overflow-hidden text-slate-900" :style="{ backgroundColor: bgColor }">
    <SearchHeader
      v-model="query"
      v-model:icon-scale="iconScale"
      v-model:icon-color="iconColor"
      v-model:bg-color="bgColor"
      :results-count="canvasResults.length"
    />

    <IconCanvas
      :results="canvasResults"
      :loading="loading"
      :icon-scale="iconScale"
      :icon-color="iconColor"
      :bg-color="bgColor"
      @select="onSelect"
    >
      <template #center>
        <div class="w-full max-w-[420px]">
          <div class="grid grid-cols-4 gap-2 md:gap-3">
            <!-- Row 1: 200k+ + Icons -->
            <div class="col-span-2">
              <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl md:rounded-3xl p-4 md:p-5 h-full flex items-center justify-center">
                <h1 class="text-3xl md:text-4xl lg:text-5xl font-black text-white text-balance">
                  200k+
                </h1>
              </div>
            </div>

            <div class="col-span-2">
              <div class="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl md:rounded-3xl p-4 md:p-5 h-full flex items-center justify-center">
                <h1 class="text-3xl md:text-4xl lg:text-5xl font-black text-white text-balance">
                  Icons
                </h1>
              </div>
            </div>

            <!-- Row 2: Explore + Logo -->
            <div class="col-span-3">
              <div class="bg-yellow-300 rounded-2xl md:rounded-3xl p-4 md:p-5 h-full flex items-center justify-center">
                <h2 class="text-2xl md:text-3xl lg:text-4xl font-black text-black text-balance">
                  Explore
                </h2>
              </div>
            </div>

            <div class="col-span-1 flex items-center justify-center">
              <div class="rounded-2xl md:rounded-3xl w-full aspect-square overflow-hidden">
                <img
                  src="/favicon.svg"
                  alt="Icons Logo"
                  class="w-full h-full object-cover"
                >
              </div>
            </div>

            <!-- Row 3: Infinite Canvas -->
            <div class="col-span-4">
              <div class="bg-pink-200 rounded-2xl md:rounded-3xl p-4 md:p-5 h-full flex items-center justify-center">
                <h2 class="text-2xl md:text-3xl lg:text-4xl font-black text-black text-balance">
                  Infinite Canvas
                </h2>
              </div>
            </div>
          </div>

          <div class="flex items-center justify-center gap-2 mt-3 pointer-events-auto">
            <a href="https://github.com/BroKarim/icon" target="_blank" rel="noopener">
              <Badge class="gap-1.5 px-3 py-1 text-sm cursor-pointer hover:opacity-80 transition-opacity">
                <img src="https://www.google.com/s2/favicons?sz=96&domain_url=github.com" alt="" class="w-4 h-4 rounded-full">
                GitHub
              </Badge>
            </a>
            <a href="https://brokarim.com/" target="_blank" rel="noopener">
              <Badge class="gap-1.5 px-3 py-1 text-sm bg-red-400 cursor-pointer hover:opacity-80 transition-opacity">
                <img src="https://www.google.com/s2/favicons?sz=96&domain_url=brokarim.com" alt="" class="w-4 h-4 rounded-full">
                Website
              </Badge>
            </a>
            <a href="https://www.threads.net/@brokariim" target="_blank" rel="noopener">
              <Badge class="gap-1.5 px-3 py-1 text-sm cursor-pointer bg-amber-300 hover:opacity-80 transition-opacity">
                <img src="https://www.google.com/s2/favicons?sz=96&domain_url=threads.net" alt="" class="w-4 h-4 rounded-full">
                Thread
              </Badge>
            </a>
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
</template>
