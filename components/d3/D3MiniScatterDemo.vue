<script setup lang="ts">
import * as d3 from 'd3'
import { computed } from 'vue'
import { vizTheme } from './theme'

const width = 640
const height = 340
const margin = { top: 42, right: 24, bottom: 46, left: 56 }
const viewPad = 24

const data = [
  { x: 1, y: 0.7, term: 'baseline' },
  { x: 2, y: 0.62, term: 'baseline' },
  { x: 3, y: 0.75, term: 'baseline' },
  { x: 4, y: 0.73, term: 'current' },
  { x: 5, y: 0.8, term: 'current' },
  { x: 6, y: 0.78, term: 'current' },
]

const x = computed(() =>
  d3
    .scaleLinear()
    .domain([1, 6])
    .range([margin.left, width - margin.right]),
)

const y = computed(() => d3.scaleLinear().domain([0.5, 0.9]).range([height - margin.bottom, margin.top]))

const color = (term: string) => (term === 'current' ? vizTheme.cyan : vizTheme.primary)

const xTicks = computed(() => x.value.ticks(6).map((t) => ({ t, px: x.value(t) })))
const yTicks = computed(() => y.value.ticks(4).map((t) => ({ t, py: y.value(t) })))
</script>

<template>
  <div class="viz-frame">
    <svg
      :viewBox="`${-viewPad} ${-viewPad} ${width + viewPad * 2} ${height + viewPad * 2}`"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label="Scatter plot demo (illustration)"
    >
      <rect x="0" y="0" :width="width" :height="height" :fill="vizTheme.panelFill" rx="18" />

      <!-- grid -->
      <g>
        <line
          v-for="tick in yTicks"
          :key="tick.t"
          :x1="margin.left"
          :x2="width - margin.right"
          :y1="tick.py"
          :y2="tick.py"
          :stroke="vizTheme.grid"
        />
      </g>

      <!-- axes -->
      <g :stroke="vizTheme.axis" stroke-width="1.5">
        <line :x1="margin.left" :x2="width - margin.right" :y1="height - margin.bottom" :y2="height - margin.bottom" />
        <line :x1="margin.left" :x2="margin.left" :y1="margin.top" :y2="height - margin.bottom" />
      </g>

      <!-- ticks -->
      <g v-for="tick in xTicks" :key="`xt-${tick.t}`">
        <line :x1="tick.px" :x2="tick.px" :y1="height - margin.bottom" :y2="height - margin.bottom + 6" :stroke="vizTheme.axis" />
        <text :x="tick.px" :y="height - margin.bottom + 22" text-anchor="middle" :fill="vizTheme.textMuted" font-size="12" font-weight="600">
          {{ tick.t }}
        </text>
      </g>
      <g v-for="tick in yTicks" :key="`yt-${tick.t}`">
        <line :x1="margin.left - 6" :x2="margin.left" :y1="tick.py" :y2="tick.py" :stroke="vizTheme.axis" />
        <text :x="margin.left - 10" :y="tick.py + 4" text-anchor="end" :fill="vizTheme.textMuted" font-size="12" font-weight="600">
          {{ tick.t.toFixed(1) }}
        </text>
      </g>

      <!-- points -->
      <g>
        <circle
          v-for="(d, i) in data"
          :key="i"
          :cx="x(d.x)"
          :cy="y(d.y)"
          r="8"
          :fill="vizTheme.bg"
          :stroke="color(d.term)"
          stroke-width="3"
        />
      </g>

      <!-- legend -->
      <g>
        <circle :cx="width - margin.right - 120" :cy="margin.top + 8" r="6" :fill="vizTheme.bg" :stroke="vizTheme.primary" stroke-width="3" />
        <text :x="width - margin.right - 106" :y="margin.top + 12" :fill="vizTheme.textMuted" font-size="12" font-weight="700">baseline</text>
        <circle :cx="width - margin.right - 42" :cy="margin.top + 8" r="6" :fill="vizTheme.bg" :stroke="vizTheme.cyan" stroke-width="3" />
        <text :x="width - margin.right - 28" :y="margin.top + 12" :fill="vizTheme.textMuted" font-size="12" font-weight="700">current</text>
      </g>

      <text :x="margin.left" :y="26" :fill="vizTheme.text" font-size="14" font-weight="800">Encoded scatter</text>
      <text :x="(margin.left + width - margin.right) / 2" :y="height - 10" :fill="vizTheme.textMuted" font-size="12" font-weight="600" text-anchor="middle">
        x
      </text>
      <text
        :x="14"
        :y="(margin.top + height - margin.bottom) / 2"
        :fill="vizTheme.textMuted"
        font-size="12"
        font-weight="600"
        text-anchor="middle"
        transform="rotate(-90 14 170)"
      >
        y
      </text>
    </svg>
  </div>
</template>
