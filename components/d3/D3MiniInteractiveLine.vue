<script setup lang="ts">
import * as d3 from 'd3'
import { computed, ref } from 'vue'
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
  d3.scaleLinear().domain([1, 6]).range([margin.left, width - margin.right]),
)
const y = computed(() => d3.scaleLinear().domain([0.5, 0.9]).range([height - margin.bottom, margin.top]))

const linePath = computed(() => {
  const line = d3
    .line<(typeof data)[number]>()
    .x((d) => x.value(d.week))
    .y((d) => y.value(d.pass_rate))
    .curve(d3.curveMonotoneX)
  return line(data) || ''
})

const hoverWeek = ref<number | null>(5)
const hover = computed(() => data.find((d) => d.week === hoverWeek.value) ?? null)
</script>

<template>
  <div class="viz-frame">
    <svg :viewBox="`0 0 ${width} ${height}`" role="img" aria-label="Interactive line chart illustration">
      <rect x="0" y="0" :width="width" :height="height" :fill="vizTheme.panelFill" rx="18" />

      <!-- axes -->
      <g :stroke="vizTheme.axis" stroke-width="1.5">
        <line :x1="margin.left" :x2="width - margin.right" :y1="height - margin.bottom" :y2="height - margin.bottom" />
        <line :x1="margin.left" :x2="margin.left" :y1="margin.top" :y2="height - margin.bottom" />
      </g>

      <!-- line -->
      <path :d="linePath" fill="none" :stroke="vizTheme.primary" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />

      <!-- points (clickable for demo) -->
      <g>
        <circle
          v-for="d in data"
          :key="d.week"
          :cx="x(d.week)"
          :cy="y(d.pass_rate)"
          r="7"
          :fill="vizTheme.bg"
          :stroke="d.week === hoverWeek ? vizTheme.cyan : vizTheme.seqEnd"
          stroke-width="3"
          style="cursor:pointer"
          @click="hoverWeek = d.week"
        />
      </g>

      <!-- tooltip bubble (static illustration) -->
      <g v-if="hover">
        <path
          :d="`M ${x(hover.week) + 18} ${y(hover.pass_rate) - 40} h 150 a 14 14 0 0 1 14 14 v 42 a 14 14 0 0 1 -14 14 h -150 a 14 14 0 0 1 -14 -14 v -42 a 14 14 0 0 1 14 -14 z`"
          :fill="vizTheme.bg"
          opacity="0.92"
          :stroke="vizTheme.panelStroke"
        />
        <text :x="x(hover.week) + 30" :y="y(hover.pass_rate) - 16" :fill="vizTheme.text" :style="{ fontSize: '12px', fontWeight: 800 }">
          week {{ hover.week }}
        </text>
        <text :x="x(hover.week) + 30" :y="y(hover.pass_rate) + 6" :fill="vizTheme.textMuted" :style="{ fontSize: '12px', fontWeight: 700 }">
          pass_rate: {{ hover.pass_rate.toFixed(2) }}
        </text>
        <text :x="x(hover.week) + 30" :y="y(hover.pass_rate) + 26" :fill="vizTheme.textMuted" :style="{ fontSize: '11px', fontWeight: 600 }">
          click points to “hover”
        </text>
      </g>

      <text :x="margin.left" :y="26" :fill="vizTheme.text" :style="{ fontSize: '16px', fontWeight: 800 }">Interactive line (HTML)</text>
      <text
        :x="width - margin.right"
        :y="26"
        :fill="vizTheme.textMuted"
        text-anchor="end"
        :style="{ fontSize: '12px', fontWeight: 700 }"
      >
        tooltip + zoom
      </text>
    </svg>
  </div>
</template>
