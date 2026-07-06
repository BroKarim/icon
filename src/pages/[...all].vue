<script setup lang='ts'>
import { useHead } from '@unhead/vue'

useHead({
  title: '404 — Page Not Found | Icons',
  meta: [
    { name: 'description', content: 'The page you are looking for does not exist.' },
    { name: 'robots', content: 'noindex, follow' },
    { property: 'og:title', content: '404 — Page Not Found | Icons' },
    { property: 'og:description', content: 'The page you are looking for does not exist.' },
    { property: 'og:image', content: 'https://icons.brokarim.com/og-image.jpg' },
    { name: 'twitter:image', content: 'https://icons.brokarim.com/og-image.jpg' },
  ],
})
</script>

<template>
  <div>
    Not found
  </div>
</template>
