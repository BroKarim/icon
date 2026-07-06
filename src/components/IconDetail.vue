<script setup lang='ts'>
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { collections } from '../data'
import {
  copyPreviewColor,
  previewColor,
  pushRecentIcon,
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

const tabIconMap: Record<string, string> = {
  'vue': 'logos:vue',
  'vue-ts': 'logos:vue',
  'jsx': 'logos:react',
  'tsx': 'logos:react',
  'svelte': 'logos:svelte-icon',
  'qwik': 'logos:qwik',
  'solid': 'logos:react',
  'astro': 'logos:react',
  'react-native': 'logos:react',
  'unplugin': 'logos:react',
  'unocss': 'logos:react',
  'unocss-attributify': 'logos:react',
}

const codeBlockRefs: Record<string, any> = {}
const copiedComponent = ref(false)

function setCodeBlockRef(type: string, el: any) {
  if (el)
    codeBlockRefs[type] = el
}

async function copyActiveComponentCode() {
  const block = codeBlockRefs[activeComponent.value]
  if (block?.onCopy) {
    block.onCopy()
    copiedComponent.value = true
    setTimeout(() => { copiedComponent.value = false }, 1500)
  }
}
</script>

<template>
  <div class="p-2 flex flex-col text-black">
    <!-- icon -->
    <div class="flex flex-col items-center gap-2 w-full pr-10">
      <div class="relative w-full aspect-square bg-foreground/[0.02] border border-foreground/[0.06] rounded-xl flex items-center justify-center overflow-hidden">
        <div
          class="absolute inset-0 pointer-events-none"
          :style="{
            backgroundImage: 'linear-gradient(to right, rgb(128 128 128 / 0.15) 1px, transparent 1px), linear-gradient(to bottom, rgb(128 128 128 / 0.15) 1px, transparent 1px)',
            backgroundSize: 'calc(100%/12) calc(100%/12)',
            maskImage: 'radial-gradient(circle at center, #000 62%, transparent 92%)',
            WebkitMaskImage: 'radial-gradient(circle at center, #000 62%, transparent 92%)',
          }"
        />
        <div
          class="absolute inset-0 pointer-events-none"
          :style="{ background: `radial-gradient(circle at center, ${iconColor}1F, transparent 58%)` }"
        />
        <svg class="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" fill="none">
          <rect x="9" y="9" width="82" height="82" rx="7" stroke="rgb(128 128 128 / 0.3)" stroke-width="0.5" stroke-dasharray="2.5 2.5" />
          <rect x="32" y="14" width="36" height="72" rx="7" :stroke="iconColor" stroke-opacity="0.16" stroke-width="0.5" />
          <rect x="14" y="32" width="72" height="36" rx="7" :stroke="iconColor" stroke-opacity="0.16" stroke-width="0.5" />
          <line x1="50" y1="5" x2="50" y2="95" :stroke="iconColor" stroke-opacity="0.28" stroke-width="0.4" />
          <line x1="5" y1="50" x2="95" y2="50" :stroke="iconColor" stroke-opacity="0.28" stroke-width="0.4" />
        </svg>
        <div class="absolute top-2 left-2 w-2.5 h-2.5 border-t border-l" :style="{ borderColor: `${iconColor}59` }" />
        <div class="absolute top-2 right-2 w-2.5 h-2.5 border-t border-r" :style="{ borderColor: `${iconColor}59` }" />
        <div class="absolute bottom-2 left-2 w-2.5 h-2.5 border-b border-l" :style="{ borderColor: `${iconColor}59` }" />
        <div class="absolute bottom-2 right-2 w-2.5 h-2.5 border-b border-r" :style="{ borderColor: `${iconColor}59` }" />
        <span class="absolute top-2 left-1/2 -translate-x-1/2 text-[7.5px] font-mono select-none tracking-wider" :style="{ color: `${iconColor}73` }">24<span class="opacity-20"> × </span>24</span>
        <span class="absolute bottom-2 right-3 text-[8px] font-mono select-none tabular-nums" style="color: rgb(128 128 128 / 0.3)">24px</span>
        <span class="absolute bottom-2 left-3 text-[8px] font-mono select-none lowercase" style="color: rgb(128 128 128 / 0.25)">default</span>
        <Icon :key="icon" outer-class="text-8xl" :icon="icon" />
      </div>
      <span class="text-sm font-mono text-black/60">{{ icon.split(':')[1] }}</span>
    </div>

    <div class="px-6 py-2 md:px-2 md:py-4 flex flex-col gap-4">
      <div v-if="collection" class="flex flex-col gap-2 text-sm">
        <div class="flex items-center justify-between">
          <span class="opacity-50">Collection</span>
          <RouterLink
            class="px-3 py-0.5 rounded-full text-xs font-medium hover:underline"
            style="background: #e0f2fe; color: #0369a1"
            :to="`/collection/${collection.id}`"
          >
            {{ collection.name }}
          </RouterLink>
        </div>
        <div v-if="collection.author" class="flex items-center justify-between">
          <span class="opacity-50">Author</span>
          <a
            class="px-3 py-0.5 rounded-full text-xs font-medium hover:underline"
            style="background: #fce7f3; color: #be185d"
            :href="collection.author.url"
            target="_blank"
          >{{ collection.author.name }}</a>
        </div>
        <div v-if="collection.license" class="flex items-center justify-between">
          <span class="opacity-50">License</span>
          <a
            class="px-3 py-0.5 rounded-full text-xs font-medium hover:underline"
            style="background: #dcfce7; color: #15803d"
            :href="collection.license.url"
            target="_blank"
          >{{ collection.license.title }}</a>
        </div>
      </div>

      <!-- <div class="flex flex-wrap items-center">
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
      </div> -->

      <!-- Section: Snippet -->
      <!-- <section class="flex flex-col gap-2">
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
      </section> -->

      <!-- Section: Components -->
      <section class="flex flex-col gap-2">
        <h3 class="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Components
        </h3>
        <div class="flex flex-col overflow-hidden">
          <div class="flex items-center justify-between w-full h-11 pl-3 pr-1.5 border-b border-foreground/8">
            <div class="flex-1 min-w-0 overflow-x-auto whitespace-nowrap self-stretch">
              <div class="flex items-center gap-1 pr-2 w-max h-full">
                <button
                  v-for="(snippet, type) in SnippetMap.Components"
                  :key="type"
                  class="relative flex items-center gap-1.5 h-full px-2.5 text-[13px] font-medium transition-colors cursor-pointer shrink-0"
                  :class="activeComponent === type ? 'text-foreground' : 'text-foreground/40 hover:text-foreground/70'"
                  @click="activeComponent = type"
                >
                  <Icon
                    :key="tabIconMap[type]"
                    :icon="tabIconMap[type]"
                    class="w-3.5 h-3.5 shrink-0"
                    :class="activeComponent === type ? '' : 'opacity-50'"
                  />
                  {{ snippet.name }}
                  <sup v-if="snippet.tag" class="opacity-50 text-[10px]">{{ snippet.tag }}</sup>
                  <span
                    v-if="activeComponent === type"
                    class="absolute bottom-0 left-2 right-2 h-[2px] rounded-t-full"
                    :style="{ background: iconColor, boxShadow: `0 0 8px ${iconColor}73` }"
                  />
                </button>
              </div>
            </div>
            <button
              class="inline-flex items-center justify-center w-7 h-7 rounded-md transition-colors cursor-pointer shrink-0 ml-1"
              :class="copiedComponent ? 'text-emerald-500' : 'text-foreground/40 hover:text-foreground hover:bg-foreground/8'"
              aria-label="Copy code"
              @click="copyActiveComponentCode"
            >
              <svg v-if="copiedComponent" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
              <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg>
            </button>
          </div>
          <div>
            <SnippetCodeBlock
              v-for="(snippet, type) in SnippetMap.Components"
              v-show="activeComponent === type"
              :key="type"
              :ref="(el: any) => setCodeBlockRef(type, el)"
              :collection="collection"
              :icon="icon"
              :snippet="snippet"
              :type="type"
              :color="color"
            />
          </div>
        </div>
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
