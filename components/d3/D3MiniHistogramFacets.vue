<script setup lang="ts">
import { vizTheme } from './theme'

type Bin = { x0: number; x1: number; n: number }

const panels: Array<{ label: string; color: string; bins: Bin[] }> = [
  {
    label: 'Program A',
    color: vizTheme.primary,
    bins: [
      { x0: 55, x1: 60, n: 2 },
      { x0: 60, x1: 65, n: 8 },
      { x0: 65, x1: 70, n: 18 },
      { x0: 70, x1: 75, n: 30 },
      { x0: 75, x1: 80, n: 24 },
      { x0: 80, x1: 85, n: 12 },
      { x0: 85, x1: 90, n: 6 },
    ],
  },
  {
    label: 'Program B',
    color: vizTheme.cyan,
    bins: [
      { x0: 45, x1: 50, n: 6 },
      { x0: 50, x1: 55, n: 10 },
      { x0: 55, x1: 60, n: 14 },
      { x0: 60, x1: 65, n: 16 },
      { x0: 65, x1: 70, n: 18 },
      { x0: 70, x1: 75, n: 18 },
      { x0: 75, x1: 80, n: 16 },
      { x0: 80, x1: 85, n: 12 },
      { x0: 85, x1: 90, n: 8 },
    ],
  },
  {
    label: 'Program C',
    color: vizTheme.violet,
    bins: [
      { x0: 50, x1: 55, n: 4 },
      { x0: 55, x1: 60, n: 10 },
      { x0: 60, x1: 65, n: 16 },
      { x0: 65, x1: 70, n: 24 },
      { x0: 70, x1: 75, n: 22 },
      { x0: 75, x1: 80, n: 14 },
      { x0: 80, x1: 85, n: 8 },
    ],
  },
]

const width = 640
const height = 340
const pad = 18
const panelW = (width - pad * 4) / 3
const panelH = height - 70
const viewPad = 24

function barHeight(n: number) {
  const max = 30
  return (n / max) * (panelH - 60)
}
</script>

<template>
  <div class="viz-frame">
    <svg
      :viewBox="`${-viewPad} ${-viewPad} ${width + viewPad * 2} ${height + viewPad * 2}`"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label="Faceted histograms demo (illustration)"
    >
      <rect x="0" y="0" :width="width" :height="height" :fill="vizTheme.panelFill" rx="18" />

      <text x="24" y="28" :fill="vizTheme.text" font-size="14" font-weight="800">Score distributions (small multiples)</text>
      <text x="24" y="48" :fill="vizTheme.textMuted" font-size="11" font-weight="650">Aligned panels reveal spread differences</text>

      <g v-for="(p, idx) in panels" :key="p.label" :transform="`translate(${pad + idx * (panelW + pad)}, 64)`">
        <rect x="0" y="0" :width="panelW" :height="panelH" rx="16" :fill="vizTheme.bg" opacity="0.25" :stroke="vizTheme.panelStroke" />
        <text x="12" y="22" :fill="vizTheme.text" font-size="13" font-weight="800">{{ p.label }}</text>

        <!-- baseline -->
        <line x1="12" :x2="panelW - 12" :y1="panelH - 26" :y2="panelH - 26" :stroke="vizTheme.axis" />

        <!-- bars -->
        <g>
          <template v-for="(b, j) in p.bins" :key="j">
            <rect
              :x="14 + j * ((panelW - 28) / p.bins.length)"
              :y="panelH - 26 - barHeight(b.n)"
              :width="((panelW - 28) / p.bins.length) - 4"
              :height="barHeight(b.n)"
              :fill="p.color"
              opacity="0.75"
              rx="6"
            />
          </template>
        </g>

        <!-- x ticks -->
        <text x="12" :y="panelH - 6" :fill="vizTheme.textMuted" font-size="11" font-weight="700">low</text>
        <text :x="panelW - 12" :y="panelH - 6" text-anchor="end" :fill="vizTheme.textMuted" font-size="11" font-weight="700">high</text>
      </g>
    </svg>
  </div>
</template>
