<script setup lang="ts">
import * as d3 from 'd3'
import { computed } from 'vue'
import { vizTheme } from './theme'

const uid = Math.random().toString(36).slice(2, 10)
const calloutArrowId = `callout-arrow-${uid}`

const width = 960
const height = 460
const margin = { top: 56, right: 28, bottom: 56, left: 74 }

const data = [
  { week: 1, rate: 0.68 },
  { week: 2, rate: 0.62 },
  { week: 3, rate: 0.74 },
  { week: 4, rate: 0.72 },
  { week: 5, rate: 0.80 },
  { week: 6, rate: 0.78 },
]

const x = computed(() =>
  d3
    .scaleLinear()
    .domain([1, 6])
    .range([margin.left, width - margin.right]),
)

const y = computed(() =>
  d3
    .scaleLinear()
    .domain([0.5, 0.9])
    .nice()
    .range([height - margin.bottom, margin.top]),
)

const linePath = computed(() => {
  const line = d3
    .line<(typeof data)[number]>()
    .x((d) => x.value(d.week))
    .y((d) => y.value(d.rate))
    .curve(d3.curveMonotoneX)
  return line(data) || ''
})

const yTicks = computed(() => y.value.ticks(4).map((t) => ({ t, py: y.value(t) })))
const xTicks = computed(() => x.value.ticks(6).map((t) => ({ t, px: x.value(t) })))

const calloutBox = { w: 156, h: 44, rx: 14 } as const

function calloutAnchor(c: { x0: number; y0: number; x1: number; y1: number }) {
  const hw = calloutBox.w / 2
  const hh = calloutBox.h / 2
  const dx = c.x0 - c.x1
  const dy = c.y0 - c.y1
  const adx = Math.max(1e-6, Math.abs(dx))
  const ady = Math.max(1e-6, Math.abs(dy))
  const s = Math.min(hw / adx, hh / ady)
  return { x: c.x1 + dx * s, y: c.y1 + dy * s }
}

function calloutPath(c: { x0: number; y0: number; x1: number; y1: number }) {
  // Arrow should point *to* the chart element (x0,y0), so start at the callout box edge.
  const start = calloutAnchor(c)
  const mx = (c.x0 + start.x) / 2
  return `M ${start.x} ${start.y} C ${mx} ${start.y}, ${mx} ${c.y0}, ${c.x0} ${c.y0}`
}

const callouts = [
  {
    label: 'Axes',
    sub: 'Readable scales',
    color: vizTheme.axis,
    x0: margin.left + 2,
    y0: height - margin.bottom,
    x1: margin.left + 130,
    y1: height - margin.bottom - 44,
  },
  {
    label: 'Marks',
    sub: 'Lines + points',
    color: vizTheme.primary,
    x0: x.value(4),
    y0: y.value(0.72),
    x1: width - margin.right - 248,
    y1: height - margin.bottom - 128,
  },
  {
    label: 'Scales',
    sub: 'Domain + range',
    color: vizTheme.seqEnd,
    x0: x.value(6),
    y0: y.value(0.78),
    x1: width - margin.right - 96,
    y1: margin.top + 54,
  },
  {
    label: 'Guides',
    sub: 'Grid + legend',
    color: vizTheme.grid,
    x0: x.value(2),
    y0: y.value(0.7),
    x1: margin.left + 150,
    y1: margin.top + 44,
  },
  {
    label: 'Annotation',
    sub: 'Callout + rule',
    color: vizTheme.cyan,
    x0: x.value(5),
    y0: y.value(0.8),
    x1: width - margin.right - 248,
    y1: margin.top + 140,
  },
]
</script>

<template>
  <div class="viz-frame">
    <svg :viewBox="`0 0 ${width} ${height}`" role="img" aria-label="Annotated chart showing modern chart components">
      <defs>
        <marker
          :id="calloutArrowId"
          markerUnits="userSpaceOnUse"
          viewBox="0 0 12 12"
          refX="10.5"
          refY="6"
          markerWidth="12"
          markerHeight="12"
          orient="auto"
        >
          <path d="M 1 1 L 10.5 6 L 1 11 z" fill="context-stroke" />
        </marker>
      </defs>

      <rect x="0" y="0" :width="width" :height="height" rx="20" :fill="vizTheme.panelFill" />

      <!-- grid -->
      <g>
        <line
          v-for="tick in yTicks"
          :key="`g-${tick.t}`"
          :x1="margin.left"
          :x2="width - margin.right"
          :y1="tick.py"
          :y2="tick.py"
          :stroke="vizTheme.grid"
          stroke-width="1"
        />
      </g>

      <!-- axes -->
      <g :stroke="vizTheme.axis" stroke-width="1.6">
        <line :x1="margin.left" :x2="width - margin.right" :y1="height - margin.bottom" :y2="height - margin.bottom" />
        <line :x1="margin.left" :x2="margin.left" :y1="margin.top" :y2="height - margin.bottom" />
      </g>

      <!-- ticks -->
      <g>
        <g v-for="tick in yTicks" :key="`yt-${tick.t}`">
          <line :x1="margin.left - 6" :x2="margin.left" :y1="tick.py" :y2="tick.py" :stroke="vizTheme.axis" />
          <text
            :x="margin.left - 10"
            :y="tick.py + 4"
            text-anchor="end"
            :fill="vizTheme.textMuted"
            :style="{ fontSize: '12px', fontWeight: 650 }"
          >
            {{ tick.t.toFixed(1) }}
          </text>
        </g>

        <g v-for="tick in xTicks" :key="`xt-${tick.t}`">
          <line :x1="tick.px" :x2="tick.px" :y1="height - margin.bottom" :y2="height - margin.bottom + 6" :stroke="vizTheme.axis" />
          <text
            :x="tick.px"
            :y="height - margin.bottom + 22"
            text-anchor="middle"
            :fill="vizTheme.textMuted"
            :style="{ fontSize: '12px', fontWeight: 650 }"
          >
            {{ tick.t }}
          </text>
        </g>
      </g>

      <!-- line -->
      <path :d="linePath" fill="none" :stroke="vizTheme.primary" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" />

      <!-- points -->
      <g>
        <circle
          v-for="d in data"
          :key="`p-${d.week}`"
          :cx="x(d.week)"
          :cy="y(d.rate)"
          r="6"
          :fill="vizTheme.bg"
          :stroke="vizTheme.seqEnd"
          stroke-width="2.6"
        />
      </g>

      <!-- annotation (reference line) -->
      <g>
        <line
          :x1="margin.left"
          :x2="width - margin.right"
          :y1="y(0.75)"
          :y2="y(0.75)"
          stroke="rgba(34,211,238,0.55)"
          stroke-dasharray="6 6"
          stroke-width="2"
        />
        <text
          :x="width - margin.right"
          :y="y(0.75) - 10"
          text-anchor="end"
          fill="rgba(34,211,238,0.85)"
          :style="{ fontSize: '12px', fontWeight: 700 }"
        >
          Reference: 0.75
        </text>
      </g>

      <!-- legend -->
      <g>
        <rect :x="width - margin.right - 168" :y="margin.top - 34" width="168" height="28" rx="12" fill="rgba(11,18,32,0.65)" />
        <line :x1="width - margin.right - 150" :x2="width - margin.right - 120" :y1="margin.top - 20" :y2="margin.top - 20" :stroke="vizTheme.primary" stroke-width="3" />
        <circle :cx="width - margin.right - 102" :cy="margin.top - 20" r="5.5" :fill="vizTheme.bg" :stroke="vizTheme.seqEnd" stroke-width="2.4" />
        <text :x="width - margin.right - 88" :y="margin.top - 16" :fill="vizTheme.textMuted" :style="{ fontSize: '12px', fontWeight: 650 }">pass_rate</text>
      </g>

      <!-- titles + axis labels -->
      <text :x="margin.left" :y="30" :fill="vizTheme.text" :style="{ fontSize: '18px', fontWeight: 850 }">A chart is a set of components</text>
      <text :x="margin.left" :y="48" :fill="vizTheme.textMuted" :style="{ fontSize: '12px', fontWeight: 600 }">
        Data → scales → marks → guides (plus annotation + interaction)
      </text>

      <text
        :x="(margin.left + width - margin.right) / 2"
        :y="height - 12"
        text-anchor="middle"
        :fill="vizTheme.textMuted"
        :style="{ fontSize: '12px', fontWeight: 650 }"
      >
        Week
      </text>
      <text
        :x="18"
        :y="(margin.top + height - margin.bottom) / 2"
        text-anchor="middle"
        :fill="vizTheme.textMuted"
        transform="rotate(-90 18 230)"
        :style="{ fontSize: '12px', fontWeight: 650 }"
      >
        Pass rate
      </text>

      <!-- component callouts -->
      <g v-for="c in callouts" :key="c.label">
        <path
          :d="calloutPath(c)"
          fill="none"
          :stroke="c.color"
          stroke-width="2.2"
          stroke-linecap="round"
          opacity="0.9"
          :marker-end="`url(#${calloutArrowId})`"
        />
        <rect
          :x="c.x1 - calloutBox.w / 2"
          :y="c.y1 - calloutBox.h / 2"
          :width="calloutBox.w"
          :height="calloutBox.h"
          :rx="calloutBox.rx"
          fill="rgba(11,18,32,0.88)"
          stroke="rgba(255,255,255,0.14)"
        />
        <text :x="c.x1" :y="c.y1 - 2" text-anchor="middle" :fill="vizTheme.text" :style="{ fontSize: '12px', fontWeight: 800 }">
          {{ c.label }}
        </text>
        <text :x="c.x1" :y="c.y1 + 14" text-anchor="middle" :fill="vizTheme.textMuted" :style="{ fontSize: '11px', fontWeight: 650 }">
          {{ c.sub }}
        </text>
      </g>
    </svg>
  </div>
</template>
