<script setup lang='ts'>
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import IconBackground from './IconBackground.vue'
import { collections } from '../data'
import {
  copyPreviewColor,
  previewColor,
  pushRecentIcon,
} from '../store'
import { dataUrlToBlob } from '../utils/dataUrlToBlob'
import { Download, getIconSnippet, SnippetMap, toComponentName } from '../utils/icons'

const customIconSvgs: Record<string, string> = {
  'astro': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" style="width:100%;height:100%"><path fill="#7c4dff" d="M12.106 25.849c-1.262-1.156-1.63-3.586-1.105-5.346a5.18 5.18 0 0 0 3.484 1.66a9.68 9.68 0 0 0 5.882-.734c.215-.106.413-.247.648-.39a3.5 3.5 0 0 1 .16 1.555a4.26 4.26 0 0 1-1.798 3.021c-.404.3-.832.569-1.25.852a2.613 2.613 0 0 0-1.15 3.372l.048.161a3.4 3.4 0 0 1-1.5-1.285a3.6 3.6 0 0 1-.578-1.962a9 9 0 0 0-.05-1.037c-.114-.831-.504-1.204-1.238-1.225a1.45 1.45 0 0 0-1.507 1.18c-.012.056-.028.112-.046.178M4.901 20a17.75 17.75 0 0 1 7.4-2l2.913-8.38a.765.765 0 0 1 1.527 0L19.7 18a14.24 14.24 0 0 1 7.399 2S20.704 2.877 20.692 2.842C20.51 2.33 20.202 2 19.787 2h-7.619c-.415 0-.71.33-.904.842z"/></svg>',
  'solid': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" style="width:100%;height:100%"><defs><linearGradient id="sj1" x1="27.5" x2="152" y1="3" y2="63.5" gradientTransform="translate(-3.22 1.507)scale(.80503)" gradientUnits="userSpaceOnUse"><stop offset=".1" stop-color="#76b3e1"/><stop offset=".3" stop-color="#dcf2fd"/><stop offset="1" stop-color="#76b3e1"/></linearGradient><linearGradient id="sj2" x1="95.8" x2="74" y1="32.6" y2="105.2" gradientTransform="translate(-3.22 1.507)scale(.80503)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#76b3e1"/><stop offset=".5" stop-color="#4377bb"/><stop offset="1" stop-color="#1f3b77"/></linearGradient><linearGradient id="sj3" x1="18.4" x2="144.3" y1="64.2" y2="149.8" gradientTransform="translate(-3.22 1.507)scale(.80503)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#315aa9"/><stop offset=".5" stop-color="#518ac8"/><stop offset="1" stop-color="#315aa9"/></linearGradient><linearGradient id="sj4" x1="75.2" x2="24.4" y1="74.5" y2="260.8" gradientTransform="translate(-3.22 1.507)scale(.80503)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#4377bb"/><stop offset=".5" stop-color="#1a336b"/><stop offset="1" stop-color="#1a336b"/></linearGradient></defs><path fill="#76b3e1" d="M128 29.683S85.333-1.713 52.327 5.532l-2.415.805c-4.83 1.61-8.855 4.025-11.27 7.245l-1.61 2.415l-12.076 20.931l20.93 4.025c8.856 5.636 20.127 8.05 30.592 5.636l37.031 7.245z"/><path fill="url(#sj1)" d="M128 29.683S85.333-1.713 52.327 5.532l-2.415.805c-4.83 1.61-8.855 4.025-11.27 7.245l-1.61 2.415l-12.076 20.931l20.93 4.025c8.856 5.636 20.127 8.05 30.592 5.636l37.031 7.245z" opacity=".3"/><path fill="#518ac8" d="m38.642 29.683l-3.22.805C21.735 34.513 17.71 47.394 24.955 58.664c8.05 10.465 24.956 16.1 38.641 12.076l49.912-16.906S70.843 22.438 38.642 29.683"/><path fill="url(#sj2)" d="m38.642 29.683l-3.22.805C21.735 34.513 17.71 47.394 24.955 58.664c8.05 10.465 24.956 16.1 38.641 12.076l49.912-16.906S70.843 22.438 38.642 29.683" opacity=".3"/><path fill="url(#sj3)" d="M104.654 65.91a36.23 36.23 0 0 0-38.641-12.076L16.1 69.934L0 98.111l90.164 15.295l16.1-28.981c3.22-5.635 2.415-12.075-1.61-18.516z"/><path fill="url(#sj4)" d="M88.553 94.085A36.23 36.23 0 0 0 49.912 82.01L0 98.11s42.667 32.202 75.673 24.152l2.415-.806c13.686-4.025 18.516-16.905 10.465-27.37z"/></svg>',
  'unocss': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" style="width:100%;height:100%"><circle cx="24" cy="24" r="6" fill="#78909c"/><path fill="#546e7a" d="M2 18v6a6 6 0 0 0 12 0v-6Z"/><path fill="#b0bec5" d="M30 14V8a6 6 0 0 0-12 0v6Z"/></svg>',
  'unocss-attributify': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" style="width:100%;height:100%"><circle cx="24" cy="24" r="6" fill="#78909c"/><path fill="#546e7a" d="M2 18v6a6 6 0 0 0 12 0v-6Z"/><path fill="#b0bec5" d="M30 14V8a6 6 0 0 0-12 0v6Z"/></svg>',
  'snippet-svg': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72" style="width:100%;height:100%"><defs><path id="SVGoKD6HdOR" d="M53.404 44.132a5.556 5.556 0 0 0-9.242 4.157v4.444a5.556 5.556 0 0 0 11.11 0V50.48h-4.444m-10.741-7.748L35.643 58.29L31.2 42.732m-4.81 3.101c-.455-1.772-2.423-3.102-4.781-3.102c-2.696 0-4.88 1.739-4.88 3.886c0 2.145 2.184 3.886 4.88 3.886l-.1.013c2.696 0 4.881 1.741 4.881 3.886c0 2.148-2.185 3.886-4.88 3.886c-2.36 0-4.327-1.332-4.782-3.104"/></defs><g stroke="#000"><g stroke-width="8" transform="translate(-134.7 18.68)scale(.8851)"><path stroke-linecap="round" stroke-linejoin="round" d="M192.9-2.429v22m15.6-15.556l-15.6 15.56m22-.005h-44m22 0L177.3 4.01"/><ellipse cx="192.9" cy="-3.328" rx=".87" ry=".899"/><ellipse cx="150.2" cy="-145.5" rx=".87" ry=".899" transform="rotate(45)"/><ellipse cx="19.57" cy="-170" rx=".87" ry=".899" transform="rotate(90)"/><ellipse cx="19.57" cy="-215.8" rx=".87" ry=".899" transform="rotate(90)"/><ellipse cx="-122.6" cy="-127.3" rx=".87" ry=".899" transform="rotate(135)"/></g><use href="#SVGoKD6HdOR" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="3" clip-rule="evenodd"/></g><g transform="translate(4.97 4.974)scale(.8621)"><g class="UnoptimicedTransforms" transform="translate(-134.7 -44.62)scale(.8851)"><path stroke="#000" stroke-linejoin="round" stroke-width="18" d="m192.9 69.08l-.04 22.01" class="UnoptimicedTransforms"/><path d="m170.9 82.08l-.002 9h44v-9z" color="#000"/><path d="M160.027 91.09c0-5.435 4.432-9.841 9.9-9.841s9.902 4.406 9.902 9.841zm45.753 0c0-5.435 4.432-9.841 9.9-9.841s9.902 4.406 9.902 9.841z" class="UnoptimicedTransforms"/><circle cx="176.7" cy="74.88" r="9.83"/><circle cx="209.1" cy="74.88" r="9.83"/><circle cx="192.9" cy="68.19" r="9.83"/><rect width="22.56" height="3.551" x="182.1" y="80.08" rx="3.482" ry="3.482"/></g><g fill="#f1b31c" stroke="#f1b31c" stroke-width="8" transform="translate(-134.7 18.68)scale(.8851)"><path stroke-linecap="round" stroke-linejoin="round" d="M192.9-2.429V41.57m15.6-37.555L177.3 35.13m37.6-15.56h-44m37.6 15.56L177.3 4.015"/><ellipse cx="192.9" cy="42.47" rx=".87" ry=".899"/><ellipse cx="192.9" cy="-3.328" rx=".87" ry=".899"/><ellipse cx="150.2" cy="-99.67" rx=".87" ry=".899" transform="rotate(45)"/><ellipse cx="150.2" cy="-145.5" rx=".87" ry=".899" transform="rotate(45)"/><ellipse cx="19.57" cy="-170" rx=".87" ry=".899" transform="rotate(90)"/><ellipse cx="19.57" cy="-215.8" rx=".87" ry=".899" transform="rotate(90)"/><ellipse cx="-122.6" cy="-127.3" rx=".87" ry=".899" transform="rotate(135)"/><ellipse cx="-122.6" cy="-173.1" rx=".87" ry=".899" transform="rotate(135)"/></g><ellipse cx="56.43" cy="35.93" fill="#f1b31c" rx="4.206" ry="4.238"/><ellipse cx="15.64" cy="35.93" fill="#f1b31c" rx="4.206" ry="4.238"/><rect width="58.1" height="29.02" x="6.95" y="36" rx="4.698" ry="5"/><rect width="56.94" height="12.72" x="7.524" y="35.99" stroke="#000" stroke-linecap="square" stroke-width="1.149" rx="0" ry="0"/><use href="#SVGoKD6HdOR" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="3" clip-rule="evenodd"/><ellipse cx="21.61" cy="21.56" fill="#f1b31c" rx="4.206" ry="4.238"/><ellipse cx="36.04" cy="15.42" fill="#f1b31c" rx="4.206" ry="4.238"/><ellipse cx="50.46" cy="21.56" fill="#f1b31c" rx="4.206" ry="4.238"/></g></svg>',
  'snippet-svg-symbol': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" style="width:100%;height:100%"><path d="M245.235 153.524c14.012-14.012 14.011-36.811 0-50.823c-6.787-6.788-15.812-10.525-25.411-10.525c-2.28 0-4.523.208-6.712.617c9.538-6.524 15.72-17.495 15.72-29.694c0-19.816-16.122-35.937-35.938-35.937c-12.223 0-23.213 6.205-29.733 15.776c2.157-11.377-1.226-23.537-9.87-32.18C146.506 3.97 137.48.232 127.882.232S109.258 3.97 102.47 10.758C93.826 19.4 90.443 31.56 92.6 42.938c-6.519-9.57-17.509-15.776-29.733-15.776c-19.815 0-35.936 16.12-35.936 35.937c0 12.2 6.18 23.17 15.718 29.694a36.5 36.5 0 0 0-6.711-.617c-9.6 0-18.624 3.738-25.411 10.526C3.738 109.489 0 118.514 0 128.112c0 9.6 3.738 18.624 10.526 25.412c6.787 6.787 15.812 10.526 25.41 10.526c2.28 0 4.523-.208 6.712-.618c-9.538 6.525-15.718 17.496-15.718 29.695c0 19.815 16.12 35.936 35.936 35.936c12.224 0 23.215-6.206 29.734-15.776c-2.157 11.378 1.226 23.538 9.87 32.18c6.787 6.788 15.812 10.526 25.41 10.526c9.6 0 18.625-3.738 25.412-10.526c8.643-8.643 12.026-20.803 9.869-32.18c6.52 9.57 17.51 15.776 29.733 15.776c19.816 0 35.937-16.12 35.937-35.936c0-12.2-6.18-23.17-15.719-29.695c2.189.41 4.433.618 6.712.618c9.599 0 18.624-3.739 25.411-10.526"/><path fill="#ffb13b" d="M234.391 113.538c-8.049-8.048-21.099-8.048-29.148 0h-42.184l29.829-29.828c11.383 0 20.61-9.228 20.61-20.611s-9.227-20.612-20.61-20.612c-11.384 0-20.611 9.229-20.611 20.612l-29.829 29.829V50.743c8.049-8.049 8.049-21.099 0-29.148c-8.05-8.05-21.1-8.05-29.149 0s-8.049 21.1 0 29.148v42.185l-29.828-29.83c0-11.382-9.228-20.61-20.611-20.61s-20.611 9.228-20.611 20.61c0 11.384 9.228 20.612 20.61 20.612l29.83 29.828H50.504c-8.05-8.049-21.1-8.048-29.15 0c-8.048 8.05-8.048 21.1 0 29.15c8.05 8.048 21.1 8.048 29.15 0h42.183L62.86 172.515c-11.383 0-20.611 9.227-20.611 20.61c0 11.384 9.228 20.612 20.61 20.612c11.384 0 20.612-9.228 20.612-20.611l29.828-29.829v42.184c-8.049 8.049-8.049 21.1 0 29.149c8.05 8.049 21.1 8.049 29.15 0c8.048-8.05 8.048-21.1 0-29.15v-42.183l29.828 29.829c0 11.383 9.227 20.61 20.61 20.61c11.384 0 20.612-9.227 20.612-20.61c0-11.384-9.228-20.611-20.611-20.611l-29.83-29.829h42.185c8.05 8.05 21.1 8.05 29.148 0c8.05-8.049 8.05-21.1 0-29.149"/></svg>',
  'snippet-png': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="width:100%;height:100%;color:#ffb13b"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M14 3v4a1 1 0 0 0 1 1h4"/><path d="M5 12V5a2 2 0 0 1 2-2h7l5 5v4m1 3h-1a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h1v-3M5 18h1.5a1.5 1.5 0 0 0 0-3H5v6m6 0v-6l3 6v-6"/></g></svg>',
  'snippet-iconify': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style="width:100%;height:100%"><g fill="none" stroke="currentColor" stroke-linejoin="round"><path stroke-linecap="round" d="M24 3.5c-2.501 0-13.5 10.942-15.878 18.888h.035a16.8 16.8 0 0 0-.915 5.357C7.242 36.998 14.745 44.5 24 44.5s16.758-7.502 16.758-16.755a16.7 16.7 0 0 0-.882-5.357h.004C37.502 14.442 26.5 3.5 24 3.5"/><circle cx="24" cy="18.023" r="3.852" stroke-linecap="round"/><path d="M18.403 23.785c2.297.096 3.044 3.357 5.598 3.788s3.834-.772 3.834-.772A5.7 5.7 0 0 1 24 36.719c-3.148 0-5.7-2.552-5.7-5.676z"/></g></svg>',
  'snippet-jsx': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style="width:100%;height:100%;color:#61dafb"><path fill="currentColor" d="M300.703 254.826c0-35.044-37.946-57.065-68.14-39.543c-30.192 17.521-30.192 61.564 0 79.086c30.194 17.521 68.14-4.5 68.14-39.543m104.01-84.17c30.06-143.69-36.073-188.782-148.5-84.772c-105.814-99.2-181.166-67.937-149.102 84.17c-147.86 44.576-138.064 128.486 1.203 171.347c-31.864 140.083 27.656 191.186 147.899 85.372C372.848 531.384 434.75 482.405 402.909 340.8c151.907-51.504 138.28-126.054 1.804-170.143m-20.441-5.411c-23.831-5.376-46.89-9.289-70.343-11.424c-12.356-18.067-26.748-36.115-43.287-52.906c90.138-86.46 143.263-59.445 113.63 64.33M151.602 282.48c8.917 19.039 20.641 36.474 29.459 51.104c-14.359-1.469-29.827-3.699-46.294-6.614a1307 1307 0 0 1 16.834-44.49m-1.203-51.704c-6.56-15.746-12.545-30.943-17.435-45.091c16.998-3.524 33.656-6.723 48.097-7.816c-10.748 16.884-20.957 34.537-30.662 52.907m12.625 26.453c14.702-29.443 30.254-57.391 47.496-82.366c30.594-1.76 60.863-1.604 90.784.601c16.781 23.383 32.443 51.33 47.496 81.765c-11.264 23.278-27.259 50.104-45.692 78.76c-30.778 2.33-62.336 2.008-94.391 0c-16.247-24.89-31.505-51.107-45.693-78.76m197.199 25.251c5.838 14.167 11.233 28.606 16.233 43.288a455 455 0 0 1-45.693 7.215c10.295-15.95 20.06-32.885 29.46-50.503m-29.46-104.61c16.393 2.243 32.229 5.045 47.496 8.416a484 484 0 0 1-17.435 44.49c-9.306-18.354-19.297-36.019-30.06-52.907m-46.293-26.454c-18.725-.735-37.773-.711-57.116 0c8.468-11.137 17.906-22.77 28.258-34.87c10.087 10.888 19.645 22.608 28.858 34.87m-43.288-50.502c-16.539 16.791-30.93 34.238-43.287 52.305c-23.453 2.135-47.113 6.048-70.943 11.423c-28.258-125.654 24.093-150.189 114.23-63.728M113.725 321.56c-125.253-37.676-119.241-96.394-1.203-131.064c7.221 21.91 15.962 44.163 25.853 65.532c-9.61 22.1-18.119 44.797-24.65 65.532m15.631 25.251c21.243 5.211 43.755 7.712 67.337 10.221c14.188 20.024 28.882 38.64 44.49 54.71c-91.786 87.978-142.953 56.014-111.827-64.93m126.256 49.901c-10.877-11.263-21.032-24.025-30.662-37.876c21.467.452 42.2.502 61.925 0a322 322 0 0 1-31.263 37.876m15.03 15.03c16.747-18.195 31.51-36.64 44.49-55.311c22.154-1.63 44.6-5.034 67.336-10.22c31.408 128.733-25.62 147.742-111.826 65.532m126.856-91.384c-6.44-20.735-14.572-42.23-24.048-64.33a611 611 0 0 0 25.25-64.931c115.234 34.87 124.452 90.583-1.202 129.261"/></svg>',
}

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
const viewMode = ref<'preview' | 'svg'>('preview')
const svgSource = ref('')
const svgLoading = ref(false)

watch(viewMode, async (mode) => {
  if (mode === 'svg' && !svgSource.value) {
    svgLoading.value = true
    const svg = await getIconSnippet(collections, props.icon, 'svg', false, color.value)
    if (svg)
      svgSource.value = svg
    svgLoading.value = false
  }
})

watch(() => props.icon, () => {
  activeSnippet.value = 'svg'
  activeComponent.value = 'vue'
  activeLink.value = 'url'
  activeViewOn.value = 'iconify'
  viewMode.value = 'preview'
  svgSource.value = ''
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
    return [] as Array<{ key: string, name: string, icon: string, href: string }>
  const iconName = props.icon.split(':')[1]
  return [
    {
      key: 'iconify',
      name: 'Iconify',
      icon: 'snippet-iconify',
      href: `https://icon-sets.iconify.design/${collection.value.id}/?icon-filter=${iconName}`,
    },
    {
      key: 'unocss',
      name: 'UnoCSS',
      icon: 'logos:unocss',
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
      <div class="flex items-center gap-1.5 mb-1">
        <button
          class="text-xs font-medium rounded-md px-2 py-0.5 transition-colors"
          :class="viewMode === 'preview' ? 'bg-zinc-200 text-zinc-900' : 'text-zinc-500 hover:text-zinc-700'"
          @click="viewMode = 'preview'"
        >
          Icon
        </button>
        <button
          class="text-xs font-medium rounded-md px-2 py-0.5 transition-colors"
          :class="viewMode === 'svg' ? 'bg-zinc-200 text-zinc-900' : 'text-zinc-500 hover:text-zinc-700'"
          @click="viewMode = 'svg'"
        >
          SVG
        </button>
      </div>
      <IconBackground v-if="viewMode === 'preview'" :icon-color="iconColor">
        <template #icon>
          <Icon :key="icon" outer-class="text-8xl" :icon="icon" />
        </template>
      </IconBackground>
      <div
        v-else
        class="flex items-center justify-center w-32 h-32"
      >
        <div
          v-if="svgLoading"
          class="text-xs text-zinc-400"
        >
          Loading...
        </div>
        <div
          v-else-if="svgSource"
          v-html="svgSource"
          class="w-20 h-20 flex items-center justify-center"
        />
        <div
          v-else
          class="text-xs text-zinc-400"
        >
          No SVG
        </div>
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
      <section class="flex flex-col gap-2">
        <h3 class="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Snippet
        </h3>
        <Tabs v-model="activeSnippet" default-value="svg" class="w-full">
          <ScrollArea class="w-full whitespace-nowrap rounded-lg">
            <TabsList>
              <TabsTrigger v-for="(snippet, type) in SnippetMap.Snippets" :key="type" :value="type" class="gap-1.5">
                <span
                  v-if="snippet.icon && customIconSvgs[snippet.icon]"
                  class="w-3.5 h-3.5 shrink-0 inline-flex items-center justify-center opacity-60"
                  v-html="customIconSvgs[snippet.icon]"
                />
                <Icon
                  v-else-if="snippet.icon"
                  :icon="snippet.icon"
                  class="w-3.5 h-3.5 shrink-0 opacity-60"
                />
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
                  <span
                    v-if="customIconSvgs[type]"
                    class="w-3.5 h-3.5 shrink-0 inline-flex items-center justify-center"
                    :class="activeComponent === type ? '' : 'opacity-50'"
                    v-html="customIconSvgs[type]"
                  />
                  <Icon
                    v-else
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
            <TabsTrigger v-for="(snippet, type) in SnippetMap.Links" :key="type" :value="type" class="gap-1.5">
              <Icon v-if="snippet.icon" :icon="snippet.icon" class="w-3.5 h-3.5 shrink-0 opacity-60" />
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
            <TabsTrigger v-for="link in viewOnLinks" :key="link.key" :value="link.key" class="gap-1.5">
              <span
                v-if="customIconSvgs[link.icon]"
                class="w-3.5 h-3.5 shrink-0 inline-flex items-center justify-center opacity-60"
                v-html="customIconSvgs[link.icon]"
              />
              <Icon
                v-else
                :icon="link.icon"
                class="w-3.5 h-3.5 shrink-0 opacity-60"
              />
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
