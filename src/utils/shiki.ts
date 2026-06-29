import type { HighlighterCore } from 'shiki/core'
import { createHighlighterCore } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'

export const shiki = computedAsync<HighlighterCore>(async (onCancel) => {
  const shiki = await createHighlighterCore({
    engine: createJavaScriptRegexEngine(),
    themes: [
      () => import('@shikijs/themes/tokyo-night'),
      () => import('@shikijs/themes/github-light'),
    ],
    langs: [
      () => import('shiki/langs/html.mjs'),
      () => import('shiki/langs/jsx.mjs'),
      () => import('shiki/langs/tsx.mjs'),
      () => import('shiki/langs/vue.mjs'),
      () => import('shiki/langs/astro.mjs'),
      () => import('shiki/langs/svelte.mjs'),
    ],
  })

  onCancel(() => shiki?.dispose())
  return shiki
})

export function highlight(code: string, lang: string) {
  if (!shiki.value)
    return code
  return shiki.value.codeToHtml(code, {
    lang,
    defaultColor: false,
    themes: {
      dark: 'tokyo-night',
      light: 'github-light',
    },
  })
}
