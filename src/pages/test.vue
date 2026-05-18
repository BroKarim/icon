<script setup lang='ts'>
import { collections } from '../data'
import { useGlobalSearch } from '../composables/useGlobalSearch'

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
      class="flex-none flex flex-col items-center justify-center transition-all duration-500"
      :class="query ? 'pt-12 pb-4' : 'flex-1'"
    >
      <div class="w-full max-w-xl px-4">
        <div
          class="flex items-center gap-3 px-5 py-3 rounded-2xl border border-base shadow-sm bg-base"
          hover="shadow-md"
          transition="all duration-200"
        >
          <Icon icon="carbon:search" class="text-lg op40 flex-none" />
          <input
            v-model="query"
            type="text"
            placeholder="Search 200,000+ icons..."
            class="flex-auto text-base bg-transparent outline-none"
            autofocus
            autocomplete="off"
          />
          <button
            v-if="query"
            class="flex-none op40 hover:op70"
            @click="query = ''"
          >
            <Icon icon="carbon:close" class="text-lg" />
          </button>
        </div>

        <div v-if="!query" class="text-center mt-4 op30 text-sm">
          Start typing to search icons across all collections
        </div>
      </div>
    </div>

    <!-- Results -->
    <IconGrid
      v-if="query"
      :results="results"
      :loading="loading"
      @select="onSelect"
    />

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
