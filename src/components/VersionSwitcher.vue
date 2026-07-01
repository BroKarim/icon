<script setup lang='ts'>
import { ChevronDown } from '@lucide/vue'
import { useRoute, useRouter } from 'vue-router'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const route = useRoute()
const router = useRouter()

type Version = 'v1' | 'v2'

const versions: { id: Version, label: string, to: string }[] = [
  { id: 'v1', label: 'v1', to: '/v1' },
  { id: 'v2', label: 'v2', to: '/' },
]

const current = computed<Version>(() => route.path === '/v1' ? 'v1' : 'v2')
const currentLabel = computed(() => versions.find(v => v.id === current.value)!.label)

function go(to: string) {
  if (route.path === to)
    return
  router.push(to)
}
</script>

<template>
  <div class="pointer-events-none fixed right-4 top-4 z-50">
    <DropdownMenu>
      <DropdownMenuTrigger
        class="pointer-events-auto inline-flex h-8 items-center gap-1 rounded-full border border-black/10 bg-white/60 px-3 text-xs font-medium text-slate-700 backdrop-blur-md transition-colors hover:bg-white/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/10"
      >
        <span class="text-slate-400">Design</span>
        <span class="text-slate-900">{{ currentLabel }}</span>
        <ChevronDown class="size-3.5 text-slate-400" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" class="min-w-32">
        <DropdownMenuItem
          v-for="v in versions"
          :key="v.id"
          :class="current === v.id ? 'bg-slate-100' : ''"
          @select="go(v.to)"
        >
          <span class="flex-1">{{ v.label }}</span>
          <span v-if="current === v.id" class="text-slate-400 text-xs">current</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
</template>
