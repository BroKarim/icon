import type { AdItem } from '../types/ad'

const AD_PROBABILITY = 0.03
const AD_COOLDOWN = 25

export function useAdPlacement() {
  const ads = ref<AdItem[]>([])
  const loaded = ref(false)

  const adDecisionCache = new Map<number, AdItem | null>()
  let lastAdGridIndex = -Infinity

  async function loadAds(): Promise<void> {
    if (loaded.value)
      return
    try {
      const res = await fetch('/ads.json')
      const data = await res.json()
      ads.value = (data?.ads as AdItem[]) ?? []
    }
    catch {
      ads.value = []
    }
    loaded.value = true
  }

  function getAdForGridIndex(gridIndex: number): AdItem | null {
    if (!loaded.value || ads.value.length === 0)
      return null

    if (adDecisionCache.has(gridIndex))
      return adDecisionCache.get(gridIndex) ?? null

    if (gridIndex - lastAdGridIndex < AD_COOLDOWN) {
      adDecisionCache.set(gridIndex, null)
      return null
    }

    if (Math.random() < AD_PROBABILITY) {
      const ad = ads.value[Math.floor(Math.random() * ads.value.length)]
      adDecisionCache.set(gridIndex, ad)
      lastAdGridIndex = gridIndex
      return ad
    }

    adDecisionCache.set(gridIndex, null)
    return null
  }

  function reset(): void {
    adDecisionCache.clear()
    lastAdGridIndex = -Infinity
  }

  onMounted(() => {
    loadAds()
  })

  return { ads, loaded, getAdForGridIndex, reset }
}
