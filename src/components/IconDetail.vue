<script setup lang='ts'>
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { collections } from '../data'
import {
  activeMode,
  copyPreviewColor,
  inBag,
  previewColor,
  pushRecentIcon,
  toggleBag,
} from '../store'
import { dataUrlToBlob } from '../utils/dataUrlToBlob'
import { Download, getIconSnippet, SnippetMap, toComponentName } from '../utils/icons'

const props = defineProps({
  icon: {
    type: String,
    required: true,
  },
  showCollection: {
    type: Boolean,
    required: true,
  },
  iconColor: {
    type: String,
    default: '#000000',
  },
})

const emit = defineEmits(['close', 'copy', 'next', 'prev'])

const color = computed(() => copyPreviewColor.value ? previewColor.value : 'currentColor')

const activeSnippet = ref('svg')
const activeComponent = ref('vue')
const activeLink = ref('url')
const activeViewOn = ref('iconify')

watch(() => props.icon, () => {
  activeSnippet.value = 'svg'
  activeComponent.value = 'vue'
  activeLink.value = 'url'
  activeViewOn.value = 'iconify'
})

onKeyStroke('ArrowLeft', (e) => {
  if (!props.icon)
    return
  emit('prev')
  e.preventDefault()
})

onKeyStroke('ArrowRight', (e) => {
  if (!props.icon)
    return
  emit('next')
  e.preventDefault()
})

async function copyText(text?: string) {
  if (text) {
    try {
      await navigator.clipboard.writeText(text)
      return true
    }
    catch {
    }
  }
  return false
}

async function download(type: string) {
  pushRecentIcon(props.icon)
  const text = await getIconSnippet(collections, props.icon, type, false, color.value)
  if (!text)
    return
  const ext = (type === 'solid' || type === 'qwik' || type === 'react-native') ? 'tsx' : type
  const name = `${toComponentName(props.icon)}.${ext}`
  const blob = type === 'png'
    ? dataUrlToBlob(text)
    : new Blob([text], { type: 'text/plain;charset=utf-8' })
  Download(blob, name)
}

function toggleSelectingMode() {
  switch (activeMode.value) {
    case 'select':
      activeMode.value = 'normal'
      break
    default:
      activeMode.value = 'select'
      emit('close')
      break
  }
}

const collection = computed(() => {
  const id = props.icon.split(':')[0]
  return collections.find(i => i.id === id)
})

const viewOnLinks = computed(() => {
  if (!collection.value)
    return [] as Array<{ key: string, name: string, href: string }>
  const iconName = props.icon.split(':')[1]
  return [
    {
      key: 'iconify',
      name: 'Iconify',
      href: `https://icon-sets.iconify.design/${collection.value.id}/?icon-filter=${iconName}`,
    },
    {
      key: 'unocss',
      name: 'UnoCSS',
      href: `https://uno.antfu.me/?s=i-${props.icon.replace(':', '-')}`,
    },
  ]
})

async function copyHref(href: string) {
  pushRecentIcon(props.icon)
  emit('copy', await copyText(href))
}
</script>

<template>
  <div class="p-2 flex flex-col text-black">
    <div class="flex items-end gap-1 w-full pr-10" :style="{ color: iconColor }">
      <Icon :key="icon" outer-class="text-8xl" :icon="icon" />
      <span class="text-sm font-mono text-black/60">{{ icon.split(':')[1] }}</span>
    </div>

    <div class="px-6 py-2 md:px-2 md:py-4 flex flex-col gap-4">
      <div v-if="collection" class="flex flex-wrap items-center gap-4 text-sm">
        <div>
          <span class="opacity-50">Collection: </span>
          <RouterLink
            class="text-primary hover:underline"
            :to="`/collection/${collection.id}`"
          >
            {{ collection.name }}
          </RouterLink>
        </div>
        <div v-if="collection.author">
          <span class="opacity-50">Author: </span>
          <a
            class="text-primary hover:underline"
            :href="collection.author.url"
            target="_blank"
          >{{ collection.author.name }}</a>
        </div>
        <div v-if="collection.license">
          <span class="opacity-50">License: </span>
          <a
            class="text-primary hover:underline"
            :href="collection.license.url"
            target="_blank"
          >{{ collection.license.title }}</a>
        </div>
      </div>

      <div class="flex flex-wrap items-center">
        <button
          class="
            inline-flex items-center gap-1 text-black leading-none border-2 border-black my-1 mr-2 font-sans pl-2 pr-3 py-1 rounded-full text-sm cursor-pointer
            hover:bg-gray-50 dark:hover:bg-dark-200
          " :class="inBag(icon) ? 'text-black' : 'opacity-50'" @click="toggleBag(icon)"
        >
          <Icon class="inline-block text-lg align-middle" icon="carbon:shopping-bag" />
          <span class="inline-block align-middle">{{ inBag(icon) ? 'in bag' : 'add to bag' }}</span>
        </button>

        <button
          v-if="inBag(icon)" class="
            inline-flex items-center gap-1 leading-none border-2 border-black my-1 mr-2 font-sans pl-2 pr-3 py-1 rounded-full text-sm cursor-pointer
            hover:bg-gray-50 dark:hover:bg-dark-200
          " :class="activeMode === 'select' ? 'text-black' : 'opacity-50'" @click="toggleSelectingMode"
        >
          <Icon class="inline-block text-lg align-middle" icon="carbon:list-checked" />
          <span class="inline-block align-middle">multiple select</span>
        </button>

        <button
          class="
            inline-flex items-center gap-1 leading-none border-2 border-black my-1 mr-2 font-sans pl-2 pr-3 py-1 rounded-full text-sm cursor-pointer
            hover:bg-gray-50 dark:hover:bg-dark-200
          " :class="copyPreviewColor ? 'text-primary' : 'opacity-50'" @click="copyPreviewColor = !copyPreviewColor"
        >
          <Icon v-if="!copyPreviewColor" class="inline-block text-lg align-middle" icon="carbon:checkbox" />
          <Icon v-else class="inline-block text-lg align-middle" icon="carbon:checkbox-checked" />
          <span class="inline-block align-middle">copy with color</span>
        </button>
      </div>

      <!-- Section: Snippet -->
      <section class="flex flex-col gap-2">
        <h3 class="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Snippet
        </h3>
        <Tabs v-model="activeSnippet" default-value="svg" class="w-full">
          <ScrollArea class="w-full whitespace-nowrap rounded-lg">
            <TabsList>
              <TabsTrigger v-for="(snippet, type) in SnippetMap.Snippets" :key="type" :value="type">
                {{ snippet.name }}<sup v-if="snippet.tag" class="opacity-50 -mr-1 ml-0.5 text-[10px]">{{ snippet.tag }}</sup>
              </TabsTrigger>
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
          <TabsContent v-for="(snippet, type) in SnippetMap.Snippets" :key="type" :value="type" class="mt-2">
            <SnippetCodeBlock
              :collection="collection"
              :icon="icon"
              :snippet="snippet"
              :type="type"
              :color="color"
            />
          </TabsContent>
        </Tabs>
      </section>

      <!-- Section: Components -->
      <section class="flex flex-col gap-2">
        <h3 class="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Components
        </h3>
        <Tabs v-model="activeComponent" default-value="vue" class="w-full">
          <ScrollArea class="w-full whitespace-nowrap rounded-lg">
            <TabsList>
              <TabsTrigger v-for="(snippet, type) in SnippetMap.Components" :key="type" :value="type">
                {{ snippet.name }}<sup v-if="snippet.tag" class="opacity-50 -mr-1 ml-0.5 text-[10px]">{{ snippet.tag }}</sup>
              </TabsTrigger>
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
          <TabsContent v-for="(snippet, type) in SnippetMap.Components" :key="type" :value="type" class="mt-2">
            <SnippetCodeBlock
              :collection="collection"
              :icon="icon"
              :snippet="snippet"
              :type="type"
              :color="color"
            />
          </TabsContent>
        </Tabs>
      </section>

      <!-- Section: Link -->
      <section class="flex flex-col gap-2">
        <h3 class="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Link
        </h3>
        <Tabs v-model="activeLink" default-value="url" class="w-full">
          <TabsList>
            <TabsTrigger v-for="(snippet, type) in SnippetMap.Links" :key="type" :value="type">
              {{ snippet.name }}
            </TabsTrigger>
          </TabsList>
          <TabsContent v-for="(snippet, type) in SnippetMap.Links" :key="type" :value="type" class="mt-2">
            <SnippetCodeBlock
              :collection="collection"
              :icon="icon"
              :snippet="snippet"
              :type="type"
              :color="color"
            />
          </TabsContent>
        </Tabs>
      </section>

      <!-- Section: Download (no tabs) -->
      <section class="flex flex-col gap-2">
        <h3 class="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Download
        </h3>
        <div class="flex flex-wrap gap-1">
          <button class="btn small opacity-75" @click="download('svg')">
            SVG
          </button>
          <button class="btn small opacity-75" @click="download('png')">
            PNG
          </button>
          <button class="btn small opacity-75" @click="download('vue')">
            Vue
          </button>
          <button class="btn small opacity-75" @click="download('jsx')">
            React
          </button>
          <button class="btn small opacity-75" @click="download('tsx')">
            React<sup class="opacity-50 -mr-1">TS</sup>
          </button>
          <button class="btn small opacity-75" @click="download('svelte')">
            Svelte
          </button>
          <button class="btn small opacity-75" @click="download('qwik')">
            Qwik
          </button>
          <button class="btn small opacity-75" @click="download('solid')">
            Solid
          </button>
          <button class="btn small opacity-75" @click="download('astro')">
            Astro
          </button>
          <button class="btn small opacity-75" @click="download('react-native')">
            React Native
          </button>
        </div>
      </section>

      <!-- Section: View on -->
      <section v-if="collection" class="flex flex-col gap-2">
        <h3 class="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          View on
        </h3>
        <Tabs v-model="activeViewOn" default-value="iconify" class="w-full">
          <TabsList>
            <TabsTrigger v-for="link in viewOnLinks" :key="link.key" :value="link.key">
              {{ link.name }}
            </TabsTrigger>
          </TabsList>
          <TabsContent v-for="link in viewOnLinks" :key="link.key" :value="link.key" class="mt-2">
            <div class="relative rounded-lg border bg-zinc-50 dark:bg-zinc-900 p-4 flex flex-col gap-3">
              <code class="block text-xs font-mono break-all text-zinc-700 dark:text-zinc-300">
                {{ link.href }}
              </code>
              <div class="flex gap-2">
                <button
                  type="button"
                  class="inline-flex items-center gap-1.5 rounded-md text-white border bg-background px-2.5 py-1 text-xs font-medium hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  @click="copyHref(link.href)"
                >
                  Copy URL
                </button>
                <a
                  :href="link.href"
                  target="_blank"
                  rel="noopener"
                  class="inline-flex items-center gap-1.5 rounded-md border bg-background px-2.5 text-white py-1 text-xs font-medium hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  Open ↗
                </a>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  </div>
</template>
