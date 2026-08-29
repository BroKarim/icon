<!-- FlickeringGrid.vue -->
<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

interface Props {
  squareSize?: number
  gridGap?: number
  flickerChance?: number
  color?: string
  width?: number
  height?: number
  maxOpacity?: number
}

const props = withDefaults(defineProps<Props>(), {
  squareSize: 4,
  gridGap: 6,
  flickerChance: 0.3,
  color: 'rgb(0, 0, 0)',
  maxOpacity: 0.3,
})

const canvasRef = ref<HTMLCanvasElement | null>(null)
const containerRef = ref<HTMLDivElement | null>(null)
const isInView = ref(false)
const canvasSize = ref({ width: 0, height: 0 })

// Memoized Color to RGBA prefix
const memoizedColor = computed(() => {
  if (typeof window === 'undefined')
    return 'rgba(0, 0, 0,'
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 1
  const ctx = canvas.getContext('2d')
  if (!ctx)
    return 'rgba(255, 0, 0,'
  ctx.fillStyle = props.color
  ctx.fillRect(0, 0, 1, 1)
  const [r, g, b] = Array.from(ctx.getImageData(0, 0, 1, 1).data)
  return `rgba(${r}, ${g}, ${b},`
})

let gridParams: { cols: number, rows: number, squares: Float32Array, dpr: number } | null = null

function setupCanvas(canvas: HTMLCanvasElement, width: number, height: number) {
  const dpr = window.devicePixelRatio || 1
  canvas.width = width * dpr
  canvas.height = height * dpr
  canvas.style.width = `${width}px`
  canvas.style.height = `${height}px`
  const cols = Math.ceil(width / (props.squareSize + props.gridGap))
  const rows = Math.ceil(height / (props.squareSize + props.gridGap))

  const squares = new Float32Array(cols * rows)
  for (let i = 0; i < squares.length; i++) {
    squares[i] = Math.random() * props.maxOpacity
  }

  return { cols, rows, squares, dpr }
}

function updateSquares(squares: Float32Array, deltaTime: number) {
  for (let i = 0; i < squares.length; i++) {
    if (Math.random() < props.flickerChance * deltaTime) {
      squares[i] = Math.random() * props.maxOpacity
    }
  }
}

function drawGrid(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  cols: number,
  rows: number,
  squares: Float32Array,
  dpr: number,
) {
  ctx.clearRect(0, 0, width, height)

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const opacity = squares[i * rows + j]
      ctx.fillStyle = `${memoizedColor.value}${opacity})`
      ctx.fillRect(
        i * (props.squareSize + props.gridGap) * dpr,
        j * (props.squareSize + props.gridGap) * dpr,
        props.squareSize * dpr,
        props.squareSize * dpr,
      )
    }
  }
}

let animationFrameId: number | null = null
let resizeObserver: ResizeObserver | null = null
let intersectionObserver: IntersectionObserver | null = null
let lastTime = 0

function animate(time: number) {
  if (!isInView.value || !gridParams || !canvasRef.value)
    return

  const ctx = canvasRef.value.getContext('2d')
  if (!ctx)
    return

  const deltaTime = (time - lastTime) / 1000
  lastTime = time

  updateSquares(gridParams.squares, deltaTime)
  drawGrid(
    ctx,
    canvasRef.value.width,
    canvasRef.value.height,
    gridParams.cols,
    gridParams.rows,
    gridParams.squares,
    gridParams.dpr,
  )
  animationFrameId = requestAnimationFrame(animate)
}

function updateCanvasSize() {
  if (!containerRef.value || !canvasRef.value)
    return
  const newWidth = props.width || containerRef.value.clientWidth
  const newHeight = props.height || containerRef.value.clientHeight
  canvasSize.value = { width: newWidth, height: newHeight }
  gridParams = setupCanvas(canvasRef.value, newWidth, newHeight)
}

watch(isInView, (inView) => {
  if (inView) {
    lastTime = performance.now()
    animationFrameId = requestAnimationFrame(animate)
  }
  else if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }
})

onMounted(() => {
  if (!containerRef.value || !canvasRef.value)
    return

  updateCanvasSize()

  resizeObserver = new ResizeObserver(() => {
    updateCanvasSize()
  })
  resizeObserver.observe(containerRef.value)

  intersectionObserver = new IntersectionObserver(
    ([entry]) => {
      isInView.value = entry.isIntersecting
    },
    { threshold: 0 },
  )
  intersectionObserver.observe(canvasRef.value)
})

onUnmounted(() => {
  if (animationFrameId !== null)
    cancelAnimationFrame(animationFrameId)
  if (resizeObserver)
    resizeObserver.disconnect()
  if (intersectionObserver)
    intersectionObserver.disconnect()
})
</script>

<template>
  <div
    ref="containerRef"
    class="w-full h-full"
  >
    <canvas
      ref="canvasRef"
      class="pointer-events-none"
      :style="{
        width: `${canvasSize.width}px`,
        height: `${canvasSize.height}px`,
      }"
    />
  </div>
</template>
