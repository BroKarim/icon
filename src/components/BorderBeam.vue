<script setup lang="ts">
interface Props {
  size?: number
  duration?: number
  delay?: number
  colorFrom?: string
  colorTo?: string
  reverse?: boolean
  initialOffset?: number
  borderWidth?: number
}

const props = withDefaults(defineProps<Props>(), {
  size: 50,
  duration: 6,
  delay: 0,
  colorFrom: '#ffaa40',
  colorTo: '#9c40ff',
  reverse: false,
  initialOffset: 0,
  borderWidth: 1,
})

const animationStyle = {
  animationDuration: `${props.duration}s`,
  animationDelay: `${-props.delay}s`,
}
</script>

<template>
  <div class="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
    <div
      class="pointer-events-none absolute inset-0 rounded-[inherit]"
      :style="{
        border: `${props.borderWidth}px solid transparent`,
        mask: 'linear-gradient(transparent, transparent), linear-gradient(#000, #000)',
        maskClip: 'padding-box, border-box',
        maskComposite: 'exclude',
        WebkitMask: 'linear-gradient(transparent, transparent), linear-gradient(#000, #000)',
        WebkitMaskClip: 'padding-box, border-box',
        WebkitMaskComposite: 'xor',
      }"
    >
      <div
        class="absolute aspect-square border-beam-animate"
        :class="{ 'border-beam-reverse': props.reverse }"
        :style="{
          width: `${props.size}px`,
          background: `linear-gradient(to left, ${props.colorFrom}, ${props.colorTo}, transparent)`,
          offsetPath: `rect(0 auto auto 0 round ${props.size}px)`,
          offsetDistance: `${props.initialOffset}%`,
          ...animationStyle,
        }"
      />
    </div>
  </div>
</template>

<style scoped>
@keyframes border-beam {
  from {
    offset-distance: 0%;
  }
  to {
    offset-distance: 100%;
  }
}

@keyframes border-beam-reverse {
  from {
    offset-distance: 100%;
  }
  to {
    offset-distance: 0%;
  }
}

.border-beam-animate {
  animation-name: border-beam;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

.border-beam-reverse {
  animation-name: border-beam-reverse;
}
</style>
