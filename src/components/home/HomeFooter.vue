<script setup lang="ts">
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
</script>

<template>
  <footer class="absolute inset-x-0 bottom-0 z-10 flex flex-wrap items-center justify-between gap-x-1 gap-y-2 px-4 py-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] md:h-10 md:py-0 md:px-10">
    <nav class="flex flex-wrap items-center justify-center gap-1">
      <Popover>
        <PopoverTrigger
          class="relative inline-flex shrink-0 cursor-pointer items-center justify-center whitespace-nowrap rounded-lg border border-transparent font-medium outline-none hover:underline underline-offset-4 h-auto px-2 py-1 text-xs text-muted-foreground"
        >
          License
        </PopoverTrigger>
        <PopoverContent class="w-72 p-3 text-xs bg-white  leading-relaxed text-black">
          This project is MIT-licensed. The license does not apply to icons — each icon set may use its own open-source license. Refer to individual icon sets for details.
        </PopoverContent>
      </Popover>
      <span
        class="relative inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-lg border border-transparent font-medium h-auto px-2 py-1 text-xs text-muted-foreground"
      >
        Copyright © 2026 BroKarim
      </span>
    </nav>
    <div class="flex items-center gap-0.5">
      <a
        href="https://github.com/BroKarim"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Follow on github"
        class="relative inline-flex shrink-0 cursor-pointer items-center justify-center whitespace-nowrap rounded-lg border border-transparent font-medium outline-none hover:bg-accent h-auto px-2 py-1 text-muted-foreground"
      >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><!-- Icon from Unicons by Iconscout - https://github.com/Iconscout/unicons/blob/master/LICENSE --><path fill="currentColor" d="M12 2.247a10 10 0 0 0-3.162 19.487c.5.088.687-.212.687-.475c0-.237-.012-1.025-.012-1.862c-2.513.462-3.163-.613-3.363-1.175a3.64 3.64 0 0 0-1.025-1.413c-.35-.187-.85-.65-.013-.662a2 2 0 0 1 1.538 1.025a2.137 2.137 0 0 0 2.912.825a2.1 2.1 0 0 1 .638-1.338c-2.225-.25-4.55-1.112-4.55-4.937a3.9 3.9 0 0 1 1.025-2.688a3.6 3.6 0 0 1 .1-2.65s.837-.262 2.75 1.025a9.43 9.43 0 0 1 5 0c1.912-1.3 2.75-1.025 2.75-1.025a3.6 3.6 0 0 1 .1 2.65a3.87 3.87 0 0 1 1.025 2.688c0 3.837-2.338 4.687-4.562 4.937a2.37 2.37 0 0 1 .674 1.85c0 1.338-.012 2.413-.012 2.75c0 .263.187.575.687.475A10.005 10.005 0 0 0 12 2.247"/></svg>
      </a>
      <a
        href="https://www.threads.com/@brokariim"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Follow me on Thread"
        class="relative inline-flex shrink-0 cursor-pointer items-center justify-center whitespace-nowrap rounded-lg border border-transparent font-medium outline-none hover:bg-accent h-auto px-2 py-1 text-muted-foreground"
      >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><!-- Icon from Akar Icons by Arturo Wibawa - https://github.com/artcoholic/akar-icons/blob/master/LICENSE --><path fill="currentColor" d="M17.692 11.124a9 9 0 0 0-.315-.143c-.185-3.414-2.05-5.368-5.182-5.388h-.042c-1.873 0-3.431.8-4.39 2.255l1.722 1.181c.716-1.087 1.84-1.318 2.669-1.318h.028c1.031.006 1.81.306 2.313.89c.367.426.612 1.015.733 1.757a13.2 13.2 0 0 0-2.96-.143c-2.977.172-4.892 1.909-4.763 4.322c.065 1.223.675 2.277 1.717 2.964c.88.582 2.015.866 3.194.802c1.558-.085 2.78-.68 3.632-1.766c.647-.825 1.056-1.894 1.237-3.241c.742.448 1.292 1.037 1.596 1.745c.516 1.205.546 3.184-1.068 4.797c-1.415 1.414-3.116 2.025-5.686 2.044c-2.851-.02-5.008-.935-6.41-2.717c-1.313-1.67-1.991-4.08-2.016-7.165c.025-3.085.703-5.496 2.016-7.165c1.402-1.782 3.558-2.696 6.41-2.717c2.871.02 5.065.94 6.521 2.73c.714.879 1.252 1.983 1.607 3.27l2.018-.538c-.43-1.585-1.107-2.95-2.027-4.083C18.38 1.2 15.65.024 12.134 0h-.014C8.61.024 5.912 1.205 4.099 3.51c-1.614 2.05-2.446 4.904-2.474 8.482v.016c.028 3.578.86 6.431 2.474 8.482c1.813 2.305 4.511 3.486 8.02 3.51h.015c3.12-.022 5.319-.838 7.13-2.649c2.371-2.368 2.3-5.336 1.518-7.158c-.56-1.307-1.629-2.368-3.09-3.07m-5.387 5.064c-1.305.074-2.66-.512-2.728-1.766c-.05-.93.662-1.969 2.808-2.092q.369-.022.724-.021c.78 0 1.508.075 2.171.22c-.247 3.088-1.697 3.59-2.975 3.66"/></svg>
      </a>
    </div>
  </footer>
</template>
