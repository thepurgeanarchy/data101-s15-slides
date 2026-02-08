<script setup lang="ts">
import { computed } from 'vue'
import { vizTheme } from './theme'

type Pattern = 'tooltips' | 'zoom-pan' | 'legend-filter' | 'brush' | 'linked-views'

const props = defineProps<{
  pattern: Pattern
}>()

const W = 900
const H = 200

function mulberry32(seed: number) {
  let t = seed >>> 0
  return () => {
    t += 0x6D2B79F5
    let x = Math.imul(t ^ (t >>> 15), 1 | t)
    x ^= x + Math.imul(x ^ (x >>> 7), 61 | x)
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296
  }
}

function linePath(points: Array<{ x: number; y: number }>) {
  return points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
    .join(' ')
}

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v))
}

const ariaLabel = computed(() => {
  switch (props.pattern) {
    case 'tooltips':
      return 'Tooltip interaction: a highlighted point with a tooltip callout showing exact values.'
    case 'zoom-pan':
      return 'Zoom and pan interaction: a dense time series with a selected zoom window and a zoomed inset view.'
    case 'legend-filter':
      return 'Legend filtering interaction: multiple groups with legend toggles to isolate or hide groups.'
    case 'brush':
      return 'Selection brush interaction: a highlighted range with handles and a visible selection state card.'
    case 'linked-views':
      return 'Linked views interaction: an overview with a brush selection updating a detail distribution view.'
    default:
      return 'Interaction pattern diagram.'
  }
})

const scatter = computed(() => {
  const rand = mulberry32(101)
  const left = 58
  const top = 34
  const width = 470
  const height = 136

  const pts = Array.from({ length: 26 }, () => {
    const x = left + rand() * width
    const y = top + rand() * height
    return { x, y, r: 3.4 + rand() * 1.2 }
  })

  const hx = left + width * 0.64
  const hy = top + height * 0.36
  return { left, top, width, height, pts, highlight: { x: hx, y: hy } }
})

const zoomScene = computed(() => {
  const left = 48
  const top = 34
  const width = 470
  const height = 136
  const bottom = top + height

  const n = 48
  const pts = Array.from({ length: n }, (_, i) => {
    const t = i / (n - 1)
    const yv =
      0.58 +
      0.18 * Math.sin(t * Math.PI * 2 * 1.25) +
      0.07 * Math.sin(t * Math.PI * 2 * 4.2)
    const x = left + t * width
    const y = top + (1 - clamp(yv, 0.06, 0.94)) * height
    return { x, y, t }
  })

  const selA = 0.46
  const selB = 0.70
  const selX1 = left + selA * width
  const selX2 = left + selB * width

  const inset = {
    x: 560,
    y: 44,
    w: 320,
    h: 126,
  }

  const selected = pts.filter((p) => p.t >= selA && p.t <= selB)
  const minY = Math.min(...selected.map((p) => p.y))
  const maxY = Math.max(...selected.map((p) => p.y))
  const insetPts = selected.map((p) => {
    const tt = (p.t - selA) / (selB - selA)
    const xx = inset.x + 28 + tt * (inset.w - 56)
    const yy = inset.y + 30 + ((p.y - minY) / Math.max(1, maxY - minY)) * (inset.h - 64)
    return { x: xx, y: yy }
  })

  return {
    chart: { left, top, width, height, bottom },
    pts,
    selection: { x1: selX1, x2: selX2 },
    inset,
    insetPts,
  }
})

const legendScene = computed(() => {
  const left = 48
  const top = 34
  const width = 540
  const height = 136

  const n = 34
  const base = Array.from({ length: n }, (_, i) => {
    const t = i / (n - 1)
    const x = left + t * width
    const y0 = 0.58 + 0.16 * Math.sin(t * Math.PI * 2 * 1.05)
    return { x, t, y0 }
  })

  const mk = (shift: number) =>
    base.map((p) => ({
      x: p.x,
      y: top + (1 - clamp(p.y0 + shift, 0.10, 0.92)) * height,
    }))

  const series = [
    { id: 'CS', color: vizTheme.primary, on: true, pts: mk(0.00) },
    { id: 'DS', color: vizTheme.cyan, on: false, pts: mk(0.06) },
    { id: 'IS', color: vizTheme.violet, on: false, pts: mk(-0.07) },
    { id: 'IT', color: vizTheme.orange, on: false, pts: mk(0.11) },
  ]

  const legendBox = { x: 620, y: 50, w: 250, h: 120 }
  return { chart: { left, top, width, height }, series, legendBox }
})

const brushScene = computed(() => {
  const left = 48
  const top = 34
  const width = 580
  const height = 136

  const n = 44
  const pts = Array.from({ length: n }, (_, i) => {
    const t = i / (n - 1)
    const yv = 0.55 + 0.22 * Math.sin(t * Math.PI * 2 * 0.9) + 0.04 * Math.sin(t * Math.PI * 2 * 3.1)
    return {
      x: left + t * width,
      y: top + (1 - clamp(yv, 0.08, 0.94)) * height,
      t,
    }
  })

  const selA = 0.30
  const selB = 0.62
  const sel = { x1: left + selA * width, x2: left + selB * width }

  const card = { x: 660, y: 54, w: 220, h: 112 }
  return { chart: { left, top, width, height }, pts, sel, card }
})

const linkedScene = computed(() => {
  const panels = {
    left: { x: 44, y: 34, w: 390, h: 136 },
    right: { x: 466, y: 34, w: 390, h: 136 },
  }

  const n = 34
  const overview = Array.from({ length: n }, (_, i) => {
    const t = i / (n - 1)
    const yv = 0.58 + 0.16 * Math.sin(t * Math.PI * 2 * 1.1) + 0.06 * Math.sin(t * Math.PI * 2 * 3.5)
    return {
      x: panels.left.x + 34 + t * (panels.left.w - 68),
      y: panels.left.y + 26 + (1 - clamp(yv, 0.12, 0.92)) * (panels.left.h - 52),
      t,
    }
  })

  const selA = 0.44
  const selB = 0.72
  const sel = {
    x1: panels.left.x + 34 + selA * (panels.left.w - 68),
    x2: panels.left.x + 34 + selB * (panels.left.w - 68),
  }

  const bars = Array.from({ length: 10 }, (_, i) => {
    const x = panels.right.x + 44 + i * 30
    const h = 18 + (i % 4) * 18 + (i > 6 ? 12 : 0)
    return { x, h }
  })

  const dataset = { x: 450, y: 184, w: 260, h: 30 }
  return { panels, overview, sel, bars, dataset }
})
</script>

<template>
  <svg
    :width="W"
    :height="H"
    viewBox="0 0 900 200"
    preserveAspectRatio="xMidYMid meet"
    role="img"
    :aria-label="ariaLabel"
  >
    <defs>
      <linearGradient id="fadeGrid" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" :stop-color="vizTheme.grid" stop-opacity="0.55" />
        <stop offset="1" :stop-color="vizTheme.grid" stop-opacity="0.25" />
      </linearGradient>
    </defs>

    <!-- Pattern: Tooltips -->
    <g v-if="pattern === 'tooltips'">
      <!-- grid -->
      <g :stroke="vizTheme.grid" stroke-width="1">
        <line
          v-for="i in 4"
          :key="`vx-${i}`"
          :x1="scatter.left + (scatter.width * i) / 5"
          :x2="scatter.left + (scatter.width * i) / 5"
          :y1="scatter.top"
          :y2="scatter.top + scatter.height"
        />
        <line
          v-for="i in 3"
          :key="`hy-${i}`"
          :x1="scatter.left"
          :x2="scatter.left + scatter.width"
          :y1="scatter.top + (scatter.height * i) / 4"
          :y2="scatter.top + (scatter.height * i) / 4"
        />
      </g>

      <!-- axes -->
      <g :stroke="vizTheme.axis" stroke-width="1.4">
        <line :x1="scatter.left" :x2="scatter.left" :y1="scatter.top" :y2="scatter.top + scatter.height" />
        <line :x1="scatter.left" :x2="scatter.left + scatter.width" :y1="scatter.top + scatter.height" :y2="scatter.top + scatter.height" />
      </g>

      <!-- points -->
      <g>
        <circle
          v-for="(p, i) in scatter.pts"
          :key="`pt-${i}`"
          :cx="p.x"
          :cy="p.y"
          :r="p.r"
          fill="rgba(234, 242, 255, 0.14)"
          stroke="rgba(234, 242, 255, 0.32)"
          stroke-width="1.2"
        />
      </g>

      <!-- highlight + crosshair -->
      <g>
        <line
          :x1="scatter.highlight.x"
          :x2="scatter.highlight.x"
          :y1="scatter.top"
          :y2="scatter.top + scatter.height"
          :stroke="vizTheme.primary"
          stroke-width="1.6"
          stroke-dasharray="6 6"
          opacity="0.75"
        />
        <line
          :x1="scatter.left"
          :x2="scatter.left + scatter.width"
          :y1="scatter.highlight.y"
          :y2="scatter.highlight.y"
          :stroke="vizTheme.primary"
          stroke-width="1.6"
          stroke-dasharray="6 6"
          opacity="0.65"
        />

        <circle :cx="scatter.highlight.x" :cy="scatter.highlight.y" r="8.6" :fill="vizTheme.bg" :stroke="vizTheme.primary" stroke-width="2.8" />
        <circle :cx="scatter.highlight.x" :cy="scatter.highlight.y" r="3.6" :fill="vizTheme.primary" opacity="0.95" />
      </g>

      <!-- connector -->
      <path
        :d="`M ${scatter.highlight.x + 10} ${scatter.highlight.y - 10} C ${scatter.highlight.x + 70} ${scatter.highlight.y - 56}, 548 92, 560 92`"
        :stroke="vizTheme.primary"
        stroke-width="2.2"
        fill="none"
        stroke-linecap="round"
        stroke-dasharray="7 7"
        opacity="0.85"
      />

      <!-- tooltip box -->
      <g transform="translate(560 48)">
        <rect width="312" height="98" rx="16" ry="16" fill="rgba(11, 18, 32, 0.92)" :stroke="vizTheme.primary" stroke-width="1.8" opacity="0.98" />
        <text x="16" y="26" :fill="vizTheme.textMuted" style="font-size: 12px; font-weight: 750; font-family: inherit">
          Week 9 · Program CS
        </text>
        <text x="16" y="52" :fill="vizTheme.text" style="font-size: 16px; font-weight: 900; font-family: inherit">
          pass_rate: 0.87
        </text>
        <text x="16" y="76" :fill="vizTheme.textMuted" style="font-size: 12px; font-weight: 650; font-family: inherit">
          Tooltip replaces labels until you ask.
        </text>
      </g>

      <text x="58" y="24" :fill="vizTheme.textMuted" style="font-size: 12px; font-weight: 700; font-family: inherit">
        Hover → exact value (no clutter)
      </text>
    </g>

    <!-- Pattern: Zoom and Pan -->
    <g v-else-if="pattern === 'zoom-pan'">
      <g :stroke="vizTheme.grid" stroke-width="1">
        <line
          v-for="i in 4"
          :key="`zx-${i}`"
          :x1="zoomScene.chart.left + (zoomScene.chart.width * i) / 5"
          :x2="zoomScene.chart.left + (zoomScene.chart.width * i) / 5"
          :y1="zoomScene.chart.top"
          :y2="zoomScene.chart.top + zoomScene.chart.height"
        />
        <line
          v-for="i in 3"
          :key="`zy-${i}`"
          :x1="zoomScene.chart.left"
          :x2="zoomScene.chart.left + zoomScene.chart.width"
          :y1="zoomScene.chart.top + (zoomScene.chart.height * i) / 4"
          :y2="zoomScene.chart.top + (zoomScene.chart.height * i) / 4"
        />
      </g>
      <g :stroke="vizTheme.axis" stroke-width="1.4">
        <line :x1="zoomScene.chart.left" :x2="zoomScene.chart.left" :y1="zoomScene.chart.top" :y2="zoomScene.chart.bottom" />
        <line :x1="zoomScene.chart.left" :x2="zoomScene.chart.left + zoomScene.chart.width" :y1="zoomScene.chart.bottom" :y2="zoomScene.chart.bottom" />
      </g>

      <path :d="linePath(zoomScene.pts)" :stroke="vizTheme.primary" stroke-width="2.8" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="0.92" />
      <g>
        <circle
          v-for="(p, i) in zoomScene.pts.filter((_, idx) => idx % 6 === 0)"
          :key="`zp-${i}`"
          :cx="p.x"
          :cy="p.y"
          r="3.8"
          :fill="vizTheme.bg"
          :stroke="vizTheme.primary"
          stroke-width="2"
          opacity="0.9"
        />
      </g>

      <!-- selection window -->
      <g>
        <rect
          :x="zoomScene.selection.x1"
          :y="zoomScene.chart.top"
          :width="zoomScene.selection.x2 - zoomScene.selection.x1"
          :height="zoomScene.chart.height"
          rx="10"
          ry="10"
          fill="rgba(34, 211, 238, 0.14)"
          stroke="rgba(34, 211, 238, 0.85)"
          stroke-width="2"
        />
        <rect :x="zoomScene.selection.x1 - 3" :y="zoomScene.chart.top + 6" width="6" :height="zoomScene.chart.height - 12" rx="3" fill="rgba(34, 211, 238, 0.85)" opacity="0.95" />
        <rect :x="zoomScene.selection.x2 - 3" :y="zoomScene.chart.top + 6" width="6" :height="zoomScene.chart.height - 12" rx="3" fill="rgba(34, 211, 238, 0.85)" opacity="0.95" />
      </g>

      <!-- inset panel -->
      <g>
        <rect :x="zoomScene.inset.x" :y="zoomScene.inset.y" :width="zoomScene.inset.w" :height="zoomScene.inset.h" rx="16" ry="16" fill="rgba(255,255,255,0.02)" :stroke="vizTheme.axis" stroke-width="1.4" />
        <text :x="zoomScene.inset.x + 18" :y="zoomScene.inset.y + 24" :fill="vizTheme.textMuted" style="font-size: 12px; font-weight: 750; font-family: inherit">
          Zoomed view (same scale)
        </text>
        <path :d="linePath(zoomScene.insetPts)" :stroke="vizTheme.cyan" stroke-width="3.0" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="0.95" />

        <!-- reset icon -->
        <g :transform="`translate(${zoomScene.inset.x + zoomScene.inset.w - 28} ${zoomScene.inset.y + 22})`" opacity="0.75">
          <circle cx="0" cy="0" r="9" fill="rgba(255,255,255,0.04)" :stroke="vizTheme.axis" stroke-width="1.2" />
          <path d="M -3 -1 A 4 4 0 1 1 2 4" fill="none" :stroke="vizTheme.textMuted" stroke-width="1.6" stroke-linecap="round" />
          <path d="M 2 4 L 5 4 L 5 1" fill="none" :stroke="vizTheme.textMuted" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
        </g>
      </g>

      <!-- mapping arrow -->
      <path
        :d="`M ${zoomScene.selection.x2 + 10} ${zoomScene.chart.top + 22} C ${zoomScene.selection.x2 + 80} ${zoomScene.chart.top - 2}, 540 66, ${zoomScene.inset.x + 10} 66`"
        stroke="rgba(34, 211, 238, 0.85)"
        stroke-width="2.2"
        fill="none"
        stroke-linecap="round"
        stroke-dasharray="7 7"
      />

      <text x="48" y="24" :fill="vizTheme.textMuted" style="font-size: 12px; font-weight: 700; font-family: inherit">
        Drag window to zoom, drag chart to pan
      </text>
    </g>

    <!-- Pattern: Legend Filtering -->
    <g v-else-if="pattern === 'legend-filter'">
      <g :stroke="vizTheme.grid" stroke-width="1">
        <line
          v-for="i in 4"
          :key="`lx-${i}`"
          :x1="legendScene.chart.left + (legendScene.chart.width * i) / 5"
          :x2="legendScene.chart.left + (legendScene.chart.width * i) / 5"
          :y1="legendScene.chart.top"
          :y2="legendScene.chart.top + legendScene.chart.height"
        />
        <line
          v-for="i in 3"
          :key="`ly-${i}`"
          :x1="legendScene.chart.left"
          :x2="legendScene.chart.left + legendScene.chart.width"
          :y1="legendScene.chart.top + (legendScene.chart.height * i) / 4"
          :y2="legendScene.chart.top + (legendScene.chart.height * i) / 4"
        />
      </g>
      <g :stroke="vizTheme.axis" stroke-width="1.4">
        <line :x1="legendScene.chart.left" :x2="legendScene.chart.left" :y1="legendScene.chart.top" :y2="legendScene.chart.top + legendScene.chart.height" />
        <line :x1="legendScene.chart.left" :x2="legendScene.chart.left + legendScene.chart.width" :y1="legendScene.chart.top + legendScene.chart.height" :y2="legendScene.chart.top + legendScene.chart.height" />
      </g>

      <g>
        <path
          v-for="s in legendScene.series"
          :key="s.id"
          :d="linePath(s.pts)"
          :stroke="s.on ? s.color : 'rgba(148,163,184,0.35)'"
          :opacity="s.on ? 0.95 : 0.35"
          stroke-width="2.8"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </g>

      <!-- legend box -->
      <g>
        <rect :x="legendScene.legendBox.x" :y="legendScene.legendBox.y" :width="legendScene.legendBox.w" :height="legendScene.legendBox.h" rx="16" ry="16" fill="rgba(255,255,255,0.02)" :stroke="vizTheme.axis" stroke-width="1.4" />
        <text :x="legendScene.legendBox.x + 16" :y="legendScene.legendBox.y + 24" :fill="vizTheme.textMuted" style="font-size: 12px; font-weight: 800; font-family: inherit">
          Legend (click to toggle)
        </text>

        <g v-for="(s, i) in legendScene.series" :key="`leg-${s.id}`" :transform="`translate(${legendScene.legendBox.x + 16} ${legendScene.legendBox.y + 44 + i * 20})`" :opacity="s.on ? 1 : 0.45">
          <circle cx="7" cy="7" r="6" :fill="vizTheme.bg" :stroke="s.color" stroke-width="2.2" />
          <circle cx="7" cy="7" r="2.6" :fill="s.color" opacity="0.95" />
          <text x="20" y="12" :fill="s.on ? vizTheme.text : vizTheme.textMuted" style="font-size: 12px; font-weight: 800; font-family: inherit">
            {{ s.id }}
          </text>
          <line v-if="!s.on" x1="18" y1="7" x2="78" y2="7" stroke="rgba(148,163,184,0.55)" stroke-width="2" stroke-linecap="round" />
        </g>

        <!-- cursor hint -->
        <path
          :d="`M ${legendScene.legendBox.x + legendScene.legendBox.w - 26} ${legendScene.legendBox.y + 58} l 0 18 l 6 -4 l 5 10 l 6 -3 l -6 -10 l 7 0 z`"
          fill="rgba(34, 211, 238, 0.70)"
          stroke="rgba(255,255,255,0.18)"
          stroke-width="1"
          opacity="0.95"
        />
      </g>

      <text x="48" y="24" :fill="vizTheme.textMuted" style="font-size: 12px; font-weight: 700; font-family: inherit">
        Many groups → click legend to isolate comparisons
      </text>
    </g>

    <!-- Pattern: Selection / Brush -->
    <g v-else-if="pattern === 'brush'">
      <g :stroke="vizTheme.grid" stroke-width="1">
        <line
          v-for="i in 4"
          :key="`bx-${i}`"
          :x1="brushScene.chart.left + (brushScene.chart.width * i) / 5"
          :x2="brushScene.chart.left + (brushScene.chart.width * i) / 5"
          :y1="brushScene.chart.top"
          :y2="brushScene.chart.top + brushScene.chart.height"
        />
        <line
          v-for="i in 3"
          :key="`by-${i}`"
          :x1="brushScene.chart.left"
          :x2="brushScene.chart.left + brushScene.chart.width"
          :y1="brushScene.chart.top + (brushScene.chart.height * i) / 4"
          :y2="brushScene.chart.top + (brushScene.chart.height * i) / 4"
        />
      </g>
      <g :stroke="vizTheme.axis" stroke-width="1.4">
        <line :x1="brushScene.chart.left" :x2="brushScene.chart.left" :y1="brushScene.chart.top" :y2="brushScene.chart.top + brushScene.chart.height" />
        <line :x1="brushScene.chart.left" :x2="brushScene.chart.left + brushScene.chart.width" :y1="brushScene.chart.top + brushScene.chart.height" :y2="brushScene.chart.top + brushScene.chart.height" />
      </g>

      <path :d="linePath(brushScene.pts)" :stroke="vizTheme.primary" stroke-width="2.8" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="0.92" />

      <!-- brush band + handles -->
      <g>
        <rect
          :x="brushScene.sel.x1"
          :y="brushScene.chart.top"
          :width="brushScene.sel.x2 - brushScene.sel.x1"
          :height="brushScene.chart.height"
          rx="10"
          ry="10"
          fill="rgba(167, 139, 250, 0.16)"
          stroke="rgba(167, 139, 250, 0.92)"
          stroke-width="2"
        />
        <rect :x="brushScene.sel.x1 - 4" :y="brushScene.chart.top + 8" width="8" :height="brushScene.chart.height - 16" rx="4" fill="rgba(167, 139, 250, 0.92)" opacity="0.95" />
        <rect :x="brushScene.sel.x2 - 4" :y="brushScene.chart.top + 8" width="8" :height="brushScene.chart.height - 16" rx="4" fill="rgba(167, 139, 250, 0.92)" opacity="0.95" />
        <text :x="brushScene.sel.x1 + 10" :y="brushScene.chart.top + 18" fill="rgba(245,247,250,0.9)" style="font-size: 11px; font-weight: 850; font-family: inherit">
          Weeks 5–13
        </text>
      </g>

      <!-- selection state card -->
      <g>
        <rect :x="brushScene.card.x" :y="brushScene.card.y" :width="brushScene.card.w" :height="brushScene.card.h" rx="16" ry="16" fill="rgba(11, 18, 32, 0.92)" :stroke="vizTheme.violet" stroke-width="1.6" opacity="0.98" />
        <text :x="brushScene.card.x + 16" :y="brushScene.card.y + 24" :fill="vizTheme.textMuted" style="font-size: 12px; font-weight: 850; font-family: inherit">
          Selection state
        </text>
        <text :x="brushScene.card.x + 16" :y="brushScene.card.y + 52" :fill="vizTheme.text" style="font-size: 16px; font-weight: 900; font-family: inherit">
          Weeks 5–13
        </text>
        <text :x="brushScene.card.x + 16" :y="brushScene.card.y + 76" :fill="vizTheme.textMuted" style="font-size: 12px; font-weight: 750; font-family: inherit">
          Rows: 124
        </text>

        <!-- clear button -->
        <g :transform="`translate(${brushScene.card.x + brushScene.card.w - 26} ${brushScene.card.y + 24})`" opacity="0.9">
          <circle cx="0" cy="0" r="10" fill="rgba(255,255,255,0.06)" :stroke="vizTheme.axis" stroke-width="1.2" />
          <path d="M -4 -4 L 4 4 M 4 -4 L -4 4" stroke="rgba(245,247,250,0.82)" stroke-width="2.0" stroke-linecap="round" />
        </g>
      </g>

      <!-- mapping arrow -->
      <path
        :d="`M ${brushScene.sel.x2 + 10} ${brushScene.chart.top + 26} C ${brushScene.sel.x2 + 80} ${brushScene.chart.top - 2}, 632 74, ${brushScene.card.x + 4} 74`"
        stroke="rgba(167, 139, 250, 0.92)"
        stroke-width="2.2"
        fill="none"
        stroke-linecap="round"
        stroke-dasharray="7 7"
      />

      <text x="48" y="24" :fill="vizTheme.textMuted" style="font-size: 12px; font-weight: 700; font-family: inherit">
        Brush selects a range; show the state and how to clear it
      </text>
    </g>

    <!-- Pattern: Linked Views -->
    <g v-else-if="pattern === 'linked-views'">
      <!-- panels -->
      <rect :x="linkedScene.panels.left.x" :y="linkedScene.panels.left.y" :width="linkedScene.panels.left.w" :height="linkedScene.panels.left.h" rx="16" ry="16" fill="rgba(255,255,255,0.02)" :stroke="vizTheme.axis" stroke-width="1.2" />
      <rect :x="linkedScene.panels.right.x" :y="linkedScene.panels.right.y" :width="linkedScene.panels.right.w" :height="linkedScene.panels.right.h" rx="16" ry="16" fill="rgba(255,255,255,0.02)" :stroke="vizTheme.axis" stroke-width="1.2" />

      <text :x="linkedScene.panels.left.x + 16" :y="linkedScene.panels.left.y + 24" :fill="vizTheme.textMuted" style="font-size: 12px; font-weight: 850; font-family: inherit">
        Overview (brush)
      </text>
      <text :x="linkedScene.panels.right.x + 16" :y="linkedScene.panels.right.y + 24" :fill="vizTheme.textMuted" style="font-size: 12px; font-weight: 850; font-family: inherit">
        Detail (updates)
      </text>

      <!-- overview line -->
      <path :d="linePath(linkedScene.overview)" :stroke="vizTheme.primary" stroke-width="2.8" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="0.92" />
      <rect
        :x="linkedScene.sel.x1"
        :y="linkedScene.panels.left.y + 30"
        :width="linkedScene.sel.x2 - linkedScene.sel.x1"
        :height="linkedScene.panels.left.h - 52"
        rx="10"
        ry="10"
        fill="rgba(34, 211, 238, 0.14)"
        stroke="rgba(34, 211, 238, 0.88)"
        stroke-width="2"
      />

      <!-- detail bars -->
      <g>
        <line
          :x1="linkedScene.panels.right.x + 34"
          :x2="linkedScene.panels.right.x + linkedScene.panels.right.w - 34"
          :y1="linkedScene.panels.right.y + linkedScene.panels.right.h - 30"
          :y2="linkedScene.panels.right.y + linkedScene.panels.right.h - 30"
          :stroke="vizTheme.axis"
          stroke-width="1.3"
        />
        <g v-for="(b, i) in linkedScene.bars" :key="`bar-${i}`">
          <rect
            :x="b.x"
            :y="linkedScene.panels.right.y + linkedScene.panels.right.h - 30 - b.h"
            width="18"
            :height="b.h"
            rx="6"
            ry="6"
            fill="rgba(245, 158, 11, 0.85)"
            stroke="rgba(245, 158, 11, 0.95)"
            stroke-width="1.2"
          />
        </g>
        <text
          :x="linkedScene.panels.right.x + 16"
          :y="linkedScene.panels.right.y + linkedScene.panels.right.h - 10"
          :fill="vizTheme.textMuted"
          style="font-size: 11px; font-weight: 750; font-family: inherit"
        >
          Distribution for selected weeks
        </text>
      </g>

      <!-- linking arrow -->
      <path
        :d="`M ${linkedScene.sel.x2 + 10} ${linkedScene.panels.left.y + 62} C ${linkedScene.sel.x2 + 80} ${linkedScene.panels.left.y + 36}, 438 66, ${linkedScene.panels.right.x + 8} 66`"
        stroke="rgba(34, 211, 238, 0.88)"
        stroke-width="2.4"
        fill="none"
        stroke-linecap="round"
        stroke-dasharray="7 7"
      />

      <!-- dataset pill -->
      <g>
        <rect :x="linkedScene.dataset.x - linkedScene.dataset.w / 2" :y="linkedScene.dataset.y - linkedScene.dataset.h / 2" :width="linkedScene.dataset.w" :height="linkedScene.dataset.h" rx="14" ry="14" fill="rgba(77, 163, 255, 0.10)" :stroke="vizTheme.primary" stroke-width="1.6" />
        <text :x="linkedScene.dataset.x" :y="linkedScene.dataset.y + 5" text-anchor="middle" :fill="vizTheme.text" style="font-size: 12px; font-weight: 850; font-family: inherit">
          One filtered dataset drives both views
        </text>
      </g>

      <text x="44" y="24" :fill="vizTheme.textMuted" style="font-size: 12px; font-weight: 700; font-family: inherit">
        A selection in one view updates another view
      </text>
    </g>
  </svg>
</template>

