<script setup lang="ts">
</script>

<template>
  <div class="pointer-events-none absolute inset-0 z-[999]">
    <!-- handwritten note; the arrow tip lands on the X icon in the pill -->
    <a
      href="https://www.threads.com/@brokariim"
      target="_blank"
      rel="noreferrer"
      aria-label="Follow jalcowastaken on X"
      class="group pointer-events-auto absolute bottom-16 right-[5.5rem] hidden flex-col items-end select-none text-orange-500 transition-colors hover:text-orange-700 md:flex"
    >
      <span
        class="block -rotate-6 pr-8 text-lg transition-transform group-hover:-rotate-3 group-hover:scale-105"
        :style="{ fontFamily: '\'Bradley Hand\', \'Segoe Script\', \'Comic Sans MS\', cursive' }"
      >
        follow me on thread
      </span>
      <svg
        viewBox="0 0 48 40"
        width="48"
        height="40"
        fill="none"
        stroke="currentColor"
        :stroke-width="1.8"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="-mr-4 transition-transform group-hover:translate-y-0.5"
      >
        <path d="M6 4c18 4 32 14 36 30" />
        <path d="M35 28l7 7 3-10" />
      </svg>
    </a>
    <div class="pointer-events-auto absolute right-4 bottom-4 flex items-center gap-0.5 rounded-full border bg-background/80 p-1 shadow-sm backdrop-blur">
      <a
        href="https://www.threads.com/@brokariim"
        target="_blank"
        rel="noreferrer"
        aria-label="Follow jalcowastaken on X"
        class="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-[color,background-color] hover:bg-accent hover:text-foreground"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg" width="18"
          height="18" viewBox="0 0 256 256"
        ><path fill="currentColor" d="M188.84 120.46a68 68 0 0 0-10-6.23c-3.72-21.68-16.41-37.41-35.52-43.2c-21.38-6.48-46.03 1.39-57.32 18.31a12 12 0 0 0 20 13.32c5.47-8.2 19.11-12.08 30.41-8.66a24.72 24.72 0 0 1 14.88 12.24a87 87 0 0 0-8.86-.45C108.56 105.79 84 125.22 84 152c0 22.9 17.54 39.52 41.71 39.52a52 52 0 0 0 37.23-16c6-6.23 12.88-16.46 15.72-32.07c6.2 6.42 9.34 14.67 9.34 24.59c0 17.74-19.07 44-60 44c-45.76 0-68-27.48-68-84s22.24-84 68-84c31.08 0 51 12.42 60.8 38a12 12 0 0 0 22.4-8.62C197.77 38.44 169 20 128 20c-59.33 0-92 38.35-92 108s32.67 108 92 108c31.36 0 51.08-12.05 62.11-22.15C203.81 201.28 212 184.14 212 168c0-19.64-8-36.08-23.16-47.54m-43.2 38.39a27.9 27.9 0 0 1-19.93 8.67c-8.17 0-17.71-4.06-17.71-15.52c0-15.26 17.84-22.21 34.41-22.21a60.2 60.2 0 0 1 13.51 1.52c-.56 11.62-4.08 21.1-10.28 27.54" /></svg>
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
  </div>
</template>
