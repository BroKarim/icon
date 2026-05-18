<script setup lang='ts'>
import { useGlobalSearch } from '../composables/useGlobalSearch'
import MainSearch from '../components/MainSearch.vue'

const { query, results, loading } = useGlobalSearch()

const showDetail = ref(false)
const selectedIcon = ref('')

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
  <div class="flex flex-col h-screen overflow-hidden bg-base">
    <!-- Search area -->
    <div
      class="flex flex-col items-center transition-all duration-500 ease-in-out"
      :class="query ? 'justify-start pt-8 pb-4' : 'justify-center flex-1'"
    >
      <div class="w-full max-w-3xl px-4">
        <MainSearch
          v-model="query"
          @submit="() => {}"
        />
      </div>
    </div>

    <!-- Results -->
    <div v-if="query" class="flex-1 overflow-y-auto min-h-0">
      <IconGrid
        :results="results"
        :loading="loading"
        @select="onSelect"
      />
    </div>

    <!-- Detail modal -->
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
