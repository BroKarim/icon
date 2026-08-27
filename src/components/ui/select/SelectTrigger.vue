<script setup lang="ts">
import type { SelectTriggerProps } from "reka-ui"
import { SelectTrigger } from "reka-ui"
import { cn } from "@/lib/utils"

const props = withDefaults(
  defineProps<SelectTriggerProps & { class?: string, size?: "default" | "sm" | "lg" }>(),
  { size: "default" },
)
</script>

<template>
  <SelectTrigger
    data-slot="select-trigger"
    :class="
      cn(
        'flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:truncate',
        size === 'sm' && 'h-8 text-xs',
        size === 'lg' && 'h-10 text-base',
        props.class,
      )
    "
    v-bind="props"
  >
    <slot />
    <SelectIcon as-child>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-50 shrink-0">
        <path d="m6 9 6 6 6-6"/>
      </svg>
    </SelectIcon>
  </SelectTrigger>
</template>
