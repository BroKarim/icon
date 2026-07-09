<script setup lang="ts">
import BackgroundGrid from './BackgroundGrid.vue'
import HomeFooter from './HomeFooter.vue'

const emit = defineEmits<{
  submit: []
  reset: []
}>()

const query = defineModel<string>('query', { default: '' })

function onSubmit(e: Event) {
  e.preventDefault()
  if (!query.value.trim())
    return
  emit('submit')
}

function onLogoClick() {
  query.value = ''
  emit('reset')
}
</script>

<template>
  <div class="shoogle">
    <section class="relative w-full h-dvh overflow-hidden bg-secondary">
      <BackgroundGrid />

      <div class="relative h-full">
        <div class="mx-auto flex justify-center h-full max-w-7xl flex-col p-2 sm:p-4 transition-[justify-content] duration-300 ease-out">
          <div class="w-full max-w-[30rem] xs:max-w-[30rem] md:max-w-[33rem] lg:max-w-2xl mx-auto mb-8 sm:mb-12 lg:mb-24 px-2 md:px-0">
            <h1 class="sr-only">
              Your icon search engine.
            </h1>
            <h2 class="sr-only">
              Search 200,000+ icons across collections
            </h2>

            <div class="flex flex-col gap-4 items-center md:mb-4 transition-[opacity,height,margin-bottom] duration-300 ease-out">
              <button
                class="relative inline-flex items-center gap-2 max-w-[14rem] xs:max-w-[16rem] sm:max-w-md cursor-pointer"
                @click="onLogoClick"
              >
                <svg width="180" height="60" viewBox="0 0 180 60" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-auto">
                  <text x="50%" y="50%" dominant-baseline="central" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="40" font-weight="700" letter-spacing="2" fill="var(--primary)">icloo</text>
                </svg>
              </button>
            </div>

            <div class="transition-[order] duration-300 ease-out">
              <form class="w-full space-y-2" @submit="onSubmit">
                <div class="relative w-full min-w-0">
                  <input
                    ref="inputRef"
                    v-model="query"
                    type="text"
                    autocomplete="off"
                    autocorrect="off"
                    autocapitalize="none"
                    placeholder="Search 200,000 icons..."
                    class="w-full min-w-0 bg-input text-lg pl-4 focus-visible:ring-0 border-none rounded-full h-14 outline-none placeholder:text-muted-foreground"
                  >
                </div>
              </form>

              <div class="mt-4 flex flex-wrap justify-center items-center gap-2.5 lg:gap-3.5">
                <a href="/search?tab=explore">
                  <button
                    type="button"
                    class="[&_svg]:-mx-0.5 relative inline-flex shrink-0 cursor-pointer items-center justify-center whitespace-nowrap rounded-lg border font-medium text-base outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-64 sm:text-sm [&_svg:not([class*='opacity-'])]:opacity-80 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0 h-8 sm:h-7 border-input bg-popover text-foreground gap-2 active:scale-[0.97] transition-[background-color,transform] ease-out duration-150 px-2.5 sm:px-3 hover:bg-muted-foreground hover:text-background"
                    data-slot="button"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" color="currentColor" class="size-4 sm:size-3.5">
                      <path d="M19 22L14 13L9 22" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" />
                      <path d="M15.9196 4L7.02715 9.2559C6.04492 9.83645 5.70838 11.1222 6.27548 12.1278L7.30228 13.9485C7.86937 14.954 9.12535 15.2985 10.1076 14.718L19 9.46209" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5" />
                      <path d="M16.2195 4.45572C15.7677 3.67278 16.0358 2.67162 16.8184 2.21959C17.601 1.76755 18.6017 2.03581 19.0535 2.81876L21.7805 7.54428C22.2323 8.32723 21.9642 9.32838 21.1816 9.78042C20.399 10.2325 19.3983 9.96419 18.9465 9.18124L16.2195 4.45572Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" />
                      <path d="M2 14.2645L2.73817 15.6322M2.73817 15.6322L3.47634 17M2.73817 15.6322L6.5 13.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" />
                    </svg>
                    <span>Explore</span>
                  </button>
                </a>
                <a href="/search">
                  <button
                    type="button"
                    class="[&_svg]:-mx-0.5 relative inline-flex shrink-0 cursor-pointer items-center justify-center whitespace-nowrap rounded-lg border font-medium text-base outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-64 sm:text-sm [&_svg:not([class*='opacity-'])]:opacity-80 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0 h-8 sm:h-7 border-input bg-popover text-foreground gap-2 active:scale-[0.97] transition-[background-color,transform] ease-out duration-150 px-2.5 sm:px-3 hover:bg-muted-foreground hover:text-background"
                    data-slot="button"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" color="currentColor" class="size-4 sm:size-3.5">
                      <path d="M4.05025 10.0498C1.31658 12.7835 1.31658 17.2156 4.05025 19.9493C6.78392 22.683 11.2161 22.683 13.9497 19.9493L17.899 16M12.1001 2L6.5 7.60006M22 11.899L20 13.899" stroke="currentColor" stroke-linecap="round" stroke-width="1.5" />
                      <path d="M11.1213 12.8787C12.2929 14.0503 12.2929 15.9497 11.1213 17.1213C9.94975 18.2929 8.05025 18.2929 6.87868 17.1213C5.70711 15.9497 5.70711 14.0503 6.87868 12.8787C8.05025 11.7071 9.94975 11.7071 11.1213 12.8787Z" stroke="currentColor" stroke-linecap="round" stroke-width="1.5" />
                      <path d="M6.87869 12.8795L13.9998 5.75787M17.7574 2L15.9998 3.75772M21.9998 6.24338L15.3637 12.8795" stroke="currentColor" stroke-linecap="round" stroke-width="1.5" />
                    </svg>
                    <span>Fresh</span>
                  </button>
                </a>
                <a href="/search?tab=bookmarks">
                  <button
                    type="button"
                    class="[&_svg]:-mx-0.5 relative inline-flex shrink-0 cursor-pointer items-center justify-center whitespace-nowrap rounded-lg border font-medium text-base outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-64 sm:text-sm [&_svg:not([class*='opacity-'])]:opacity-80 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0 h-8 sm:h-7 border-input bg-popover text-foreground gap-2 active:scale-[0.97] transition-[background-color,transform] ease-out duration-150 px-2.5 sm:px-3 hover:bg-muted-foreground hover:text-background"
                    data-slot="button"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" color="currentColor" class="size-4 sm:size-3.5">
                      <path d="M4 13.0004L4 14.5446C4 17.7896 4 19.4121 4.88607 20.5111C5.06508 20.7331 5.26731 20.9354 5.48933 21.1144C6.58831 22.0004 8.21082 22.0004 11.4558 22.0004C12.1614 22.0004 12.5141 22.0004 12.8372 21.8864C12.9044 21.8627 12.9702 21.8354 13.0345 21.8047C13.3436 21.6569 13.593 21.4074 14.0919 20.9085L18.8284 16.172C19.4065 15.5939 19.6955 15.3049 19.8478 14.9374C20 14.5698 20 14.1611 20 13.3436V10.0004C20 6.22919 20 4.34358 18.8284 3.172C17.7693 2.11284 16.1265 2.01122 13.0345 2.00146M13 21.5004V21.0004C13 18.172 13 16.7578 13.8787 15.8791C14.7574 15.0004 16.1716 15.0004 19 15.0004H19.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" />
                      <path d="M4 8.4532V4.98748C4 3.57894 4 2.87467 4.43934 2.43709C4.87868 1.99951 5.58579 1.99951 7 1.99951C8.41421 1.99951 9.12132 1.99951 9.56066 2.43709C10 2.87467 10 3.57894 10 4.98748V8.4532C10 9.37314 10 9.83311 9.71208 9.96742C9.42416 10.1017 9.06938 9.80727 8.35982 9.21834L7.64018 8.62106C7.33408 8.36699 7.18103 8.23996 7 8.23996C6.81897 8.23996 6.66592 8.36699 6.35982 8.62106L5.64018 9.21834C4.93062 9.80727 4.57584 10.1017 4.28792 9.96742C4 9.83311 4 9.37314 4 8.4532Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" />
                    </svg>
                    <span>Bookmarks</span>
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <HomeFooter />
    </section>
  </div>
</template>
