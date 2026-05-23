<script setup lang='ts'>
import { computed, onMounted, ref } from 'vue'
import IconCanvas from '../components/IconCanvas.vue'
import IconDetail from '../components/IconDetail.vue'
import Modal from '../components/Modal.vue'
import { useGlobalSearch } from '../composables/useGlobalSearch'

const { query, results, browseResults, loading, ensureLoaded } = useGlobalSearch()

const showDetail = ref(false)
const selectedIcon = ref('')
const iconScale = ref(1)

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
</script>

<template>
  <div class="relative h-screen overflow-hidden bg-[#f7f3ec] text-slate-900">
    <SearchHeader
      v-model="query"
      v-model:icon-scale="iconScale"
      :results-count="canvasResults.length"
    />

    <IconCanvas
      :results="canvasResults"
      :loading="loading"
      :icon-scale="iconScale"
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
