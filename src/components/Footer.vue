<script setup lang="ts">
const buildTime = __BUILD_TIME__

const timeAgo = useTimeAgo(new Date(buildTime))
</script>

<template>
  <div class="relative">
    <!-- Social pill — bottom left -->
    <div class="absolute bottom-4 left-4 hidden md:flex items-center gap-0.5 rounded-full border bg-background/80 p-1 shadow-sm backdrop-blur">
      <a
        href="https://www.threads.com/@brokariim"
        target="_blank"
        rel="noreferrer"
        aria-label="Follow on Threads"
        class="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-[color,background-color] hover:bg-accent hover:text-foreground"
      >
        <svg
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644Z" />
        </svg>
      </a>
      <a
        href="https://github.com/BroKarim"
        target="_blank"
        rel="noreferrer"
        aria-label="View source on GitHub"
        class="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-[color,background-color] hover:bg-accent hover:text-foreground"
      >
        <svg
          viewBox="0 0 16 16"
          width="18"
          height="18"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.42 7.42 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
        </svg>
      </a>
    </div>

    <footer class="text-center text-sm pt-8 pb-6">
      <p class="color-fade">
        maintained by
        <a
          class="opacity-75 hover:opacity-100"
          href="https://github.com/BroKarim"
          target="_blank"
        >Brokarim</a>,
        powered by
        <a
          class="opacity-75 hover:opacity-100"
          href="https://iconify.design"
          target="_blank"
        >Iconify</a>
      </p>
      <div color-fade mt-1 op50 italic>
        Last update: {{ buildTime }} ({{ timeAgo }})
      </div>
    </footer>
  </div>
</template>
