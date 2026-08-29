import type { AsyncFzf as AsyncFzfType } from 'fzf'
import type { CollectionMeta } from '../data'
import { collections } from '../data'
import { searchAlias } from '../data/search-alias'

export interface SearchResult {
  collectionId: string
  collectionName: string
  iconName: string
  iconFull: string
  matchType: 'exact' | 'prefix' | 'fuzzy' | 'alias'
}

export function useGlobalSearch() {
  const query = ref('')
  const results = ref<SearchResult[]>([])
  const browseResults = ref<SearchResult[]>([])
  const loading = ref(false)
  const metaLoaded = ref(false)
  const flatIndex = ref<{ collectionId: string, collectionName: string, iconName: string }[]>([])
  const fzfInstance = ref<AsyncFzfType<{ collectionId: string, collectionName: string, iconName: string }[]>>()
  const hasSearched = ref(false)
  let searchToken = 0

  const searchParts = computed(() => query.value.trim().toLowerCase().split(' ').filter(Boolean))

  const aliasedCandidates = computed(() => {
    const options = new Set([searchParts.value.join(' ')])
    searchParts.value.forEach((word, idx, arr) => {
      const alias = searchAlias.find(a => a.includes(word))
      if (alias?.length) {
        alias.forEach(a => options.add(
          [...arr.slice(0, idx), a, arr.slice(idx + 1)].filter(Boolean).join(' ').trim(),
        ))
      }
    })
    return [...options]
  })

  const useExtendedMatch = computed(() => /[ '^$!]/.test(query.value))

  async function loadMeta() {
    if (metaLoaded.value)
      return

    loading.value = true
    try {
      const { getFullMeta } = await import('../data')
      const meta = await getFullMeta()
      const flat: { collectionId: string, collectionName: string, iconName: string }[] = []
      for (const col of meta) {
        for (const icon of col.icons) {
          flat.push({
            collectionId: col.id,
            collectionName: col.name,
            iconName: icon,
          })
        }
      }
      flatIndex.value = flat
      const { AsyncFzf } = await import('fzf')
      fzfInstance.value = new AsyncFzf(flat, {
        casing: 'case-insensitive',
        fuzzy: 'v1',
        selector: v => `${v.iconName} ${v.collectionName}`,
      })
      browseResults.value = buildBrowseResults(meta)
      metaLoaded.value = true
    }
    finally {
      loading.value = false
    }
  }

  async function ensureLoaded() {
    if (!metaLoaded.value)
      await loadMeta()

    return browseResults.value
  }

  async function runSearch() {
    const token = ++searchToken

    if (!query.value) {
      results.value = []
      return
    }

    if (!metaLoaded.value)
      await loadMeta()

    if (!fzfInstance.value)
      return

    if (token !== searchToken)
      return

    loading.value = true
    try {
      const searchString = aliasedCandidates.value.join(' | ')
      let matched: { collectionId: string, collectionName: string, iconName: string }[]

      if (useExtendedMatch.value || aliasedCandidates.value.length > 1) {
        const { AsyncFzf, asyncExtendedMatch } = await import('fzf')
        if (token !== searchToken)
          return
        const fzfExtended = new AsyncFzf(flatIndex.value, {
          casing: 'case-insensitive',
          match: asyncExtendedMatch,
          selector: v => `${v.iconName} ${v.collectionName}`,
        })
        matched = (await fzfExtended.find(searchString)).map(r => r.item)
      }
      else {
        matched = (await fzfInstance.value.find(searchString)).map(r => r.item)
      }

      if (token !== searchToken)
        return

      const q = query.value.toLowerCase().trim()
      results.value = matched
        .map(r => ({
          ...r,
          iconFull: `${r.collectionId}:${r.iconName}`,
          matchType: classifyMatch(r.iconName, q, aliasedCandidates.value) as SearchResult['matchType'],
        }))
        .sort(sortByMatchType)
        .slice(0, 200)
    }
    finally {
      if (token === searchToken)
        loading.value = false
    }
  }

  const debouncedSearch = useDebounceFn(runSearch, 200)

  watch(query, (val) => {
    if (hasSearched.value)
      return
    if (!val) {
      results.value = []
      return
    }
    debouncedSearch()
  })

  return { query, results, browseResults, loading, ensureLoaded, runSearch, hasSearched }
}

function classifyMatch(iconName: string, query: string, aliased: string[]): string {
  const lower = iconName.toLowerCase()

  if (lower === query)
    return 'exact'

  if (lower.startsWith(query))
    return 'prefix'

  if (aliased.length > 1 && aliased.some(a => lower.includes(a)))
    return 'alias'

  return 'fuzzy'
}

function sortByMatchType(a: SearchResult, b: SearchResult) {
  const order = { exact: 0, prefix: 1, fuzzy: 2, alias: 3 }
  return order[a.matchType] - order[b.matchType]
}

function buildBrowseResults(meta: CollectionMeta[]) {
  const metaMap = new Map(meta.map(collection => [collection.id, collection]))
  const seen = new Set<string>()
  const items: SearchResult[] = []
  const limit = 480
  let iconIndex = 0

  while (items.length < limit) {
    let addedThisRound = false

    for (const collectionInfo of collections) {
      const collectionMeta = metaMap.get(collectionInfo.id)
      if (!collectionMeta)
        continue

      const candidates = collectionInfo.sampleIcons?.length
        ? collectionInfo.sampleIcons
        : collectionMeta.icons

      const iconName = candidates[iconIndex]
      if (!iconName)
        continue

      const iconFull = `${collectionMeta.id}:${iconName}`
      if (seen.has(iconFull))
        continue

      items.push({
        collectionId: collectionMeta.id,
        collectionName: collectionMeta.name,
        iconName,
        iconFull,
        matchType: 'fuzzy',
      })

      seen.add(iconFull)
      addedThisRound = true

      if (items.length >= limit)
        break
    }

    if (!addedThisRound)
      break

    iconIndex += 1
  }

  return items
}
