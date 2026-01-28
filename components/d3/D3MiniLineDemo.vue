<script setup lang="ts">
import * as d3 from 'd3'
import { computed } from 'vue'
import { vizTheme } from './theme'

const width = 640
const height = 340
const margin = { top: 42, right: 24, bottom: 46, left: 56 }

const data = [
  { week: 1, pass_rate: 0.7 },
  { week: 2, pass_rate: 0.62 },
  { week: 3, pass_rate: 0.75 },
  { week: 4, pass_rate: 0.73 },
  { week: 5, pass_rate: 0.8 },
  { week: 6, pass_rate: 0.78 },
]

const x = computed(() =>
  d3
    .scaleLinear()
    .domain(d3.extent(data, (d) => d.week) as [number, number])
    .range([margin.left, width - margin.right]),
)

const y = computed(() =>
  d3.scaleLinear().domain([0.5, 0.9]).range([height - margin.bottom, margin.top]),
)

const linePath = computed(() => {
  const line = d3
    .line<(typeof data)[number]>()
    .x((d) => x.value(d.week))
    .y((d) => y.value(d.pass_rate))
    .curve(d3.curveMonotoneX)
  return line(data) || ''
})

const xTicks = computed(() => x.value.ticks(6).map((t) => ({ t, px: x.value(t) })))
const yTicks = computed(() => y.value.ticks(4).map((t) => ({ t, py: y.value(t) })))
</script>

<template>
  <div class="viz-frame">
    <svg :viewBox="`0 0 ${width} ${height}`" role="img" aria-label="Line chart demo (illustration)">
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

      <!-- y tick labels -->
      <g fill="none" :stroke="vizTheme.axis" stroke-width="1">
        <g v-for="tick in yTicks" :key="`yt-${tick.t}`">
          <line :x1="margin.left - 6" :x2="margin.left" :y1="tick.py" :y2="tick.py" />
          <text
            :x="margin.left - 10"
            :y="tick.py + 4"
            text-anchor="end"
            :fill="vizTheme.textMuted"
            font-size="12"
            font-weight="600"
          >
            {{ tick.t.toFixed(1) }}
          </text>
        </g>
      </g>

      <!-- x tick labels -->
      <g v-for="tick in xTicks" :key="`xt-${tick.t}`">
        <line :x1="tick.px" :x2="tick.px" :y1="height - margin.bottom" :y2="height - margin.bottom + 6" :stroke="vizTheme.axis" />
        <text :x="tick.px" :y="height - margin.bottom + 22" text-anchor="middle" :fill="vizTheme.textMuted" font-size="12" font-weight="600">
          {{ tick.t }}
        </text>
      </g>

      <!-- line -->
      <path :d="linePath" fill="none" :stroke="vizTheme.primary" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />

      <!-- points -->
      <g>
        <circle
          v-for="d in data"
          :key="d.week"
          :cx="x(d.week)"
          :cy="y(d.pass_rate)"
          r="6"
          :fill="vizTheme.bg"
          :stroke="vizTheme.seqEnd"
          stroke-width="2.5"
        />
      </g>

      <!-- title -->
      <text :x="margin.left" :y="26" :fill="vizTheme.text" font-size="16" font-weight="800">Pass rate over weeks</text>
      <text :x="width - margin.right" :y="26" :fill="vizTheme.textMuted" font-size="12" font-weight="600" text-anchor="end">SVG-ready</text>

      <!-- axis labels -->
      <text :x="(margin.left + width - margin.right) / 2" :y="height - 10" :fill="vizTheme.textMuted" font-size="12" font-weight="600" text-anchor="middle">
        Week
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
        Pass rate
      </text>
    </svg>
  </div>
</template>

