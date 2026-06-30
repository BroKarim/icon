<script lang="ts">
import { loadIcon } from 'iconify-icon'
import { LRUCache } from 'lru-cache'

const cache = new LRUCache<string, HTMLElement>({
  max: 1_000,
})

const mounted = new WeakSet<HTMLElement>()

function getIcon(name: string) {
  const el = cache.get(name)
  if (el) {
    if (!mounted.has(el)) {
      mounted.add(el)
      return el
    }
  }
  const icon = document.createElement('iconify-icon')
  icon.setAttribute('icon', name)
  cache.set(name, icon)
  mounted.add(icon)
  return icon
}

function unmountIcon(name: string, icon: HTMLElement) {
  mounted.delete(icon)
  cache.set(name, icon)
}
</script>

<script setup lang="ts">
const props = defineProps({
  icon: {
    type: String,
    required: true,
  },
  class: {
    type: String,
    default: '',
  },
  outerClass: {
    type: String,
    default: '',
  },
  pauseAnimations: {
    type: Boolean,
    default: false,
  },
})

const el = ref<HTMLDivElement>()
let node: HTMLElement | undefined
let svgEl: SVGSVGElement | null = null
let observer: MutationObserver | null = null
const widthStyle = ref<string | undefined>()

watchEffect(() => {
  if (node)
    node.className = props.class
})

function pauseIfNeeded() {
  if (!props.pauseAnimations || !svgEl)
    return
  if (typeof svgEl.pauseAnimations === 'function')
    svgEl.pauseAnimations()
}

function unpauseIfNeeded() {
  if (!props.pauseAnimations || !svgEl)
    return
  if (typeof svgEl.unpauseAnimations === 'function')
    svgEl.unpauseAnimations()
}

function onHover() {
  unpauseIfNeeded()
}

function onHoverLeave() {
  pauseIfNeeded()
}

onMounted(() => {
  const icon = props.icon
  node = getIcon(props.icon)
  el.value?.appendChild(node)
  loadIcon(icon).then((data) => {
    widthStyle.value = `width: ${(data.width ?? 16) / (data.height ?? 16)}em;`
  }).catch(console.error)

  if (props.pauseAnimations && node) {
    const iconEl = node as HTMLElement
    const existingSvg = iconEl.shadowRoot?.querySelector('svg') as SVGSVGElement | null
    if (existingSvg) {
      svgEl = existingSvg
      pauseIfNeeded()
    }
    observer = new MutationObserver(() => {
      const svg = iconEl.shadowRoot?.querySelector('svg') as SVGSVGElement | null
      if (svg && svg !== svgEl) {
        svgEl = svg
        pauseIfNeeded()
      }
    })
    observer.observe(iconEl.shadowRoot!, { childList: true })
  }
})

onBeforeUnmount(() => {
  if (observer) {
    observer.disconnect()
    observer = null
  }
  svgEl = null
  if (node)
    unmountIcon(props.icon, node)
})
</script>

<template>
  <div
    ref="el"
    class="icon-container"
    :class="[props.class, props.outerClass]"
    :style="widthStyle"
    @mouseenter="onHover"
    @mouseleave="onHoverLeave"
    @touchstart="onHover"
    @touchend="onHoverLeave"
    @touchcancel="onHoverLeave"
  />
</template>

<style>
iconify-icon {
  min-width: 1em;
  min-height: 1em;
  display: block;
}

.icon-container {
  display: inline-block;
  vertical-align: middle;
  line-height: 1em !important;
  box-sizing: content-box;
}
</style>
