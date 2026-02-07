<script setup lang="ts">
import * as d3 from 'd3'
import { computed, ref, watch } from 'vue'
import datasetCsv from '../../notebooks/data-task-abstraction-dataset.csv?raw'
import { vizTheme } from '../d3/theme'

type DataRow = {
  term: string
  week: number
  program: string
  section_id: string
  n_students: number
  n_pass: number
}

type AggRow = {
  term: string
  week: number
  program: string
  n_students: number
  n_pass: number
  pass_rate: number
}

let cachedAgg: AggRow[] | null = null
function getAggRows(): AggRow[] {
  if (cachedAgg) return cachedAgg

  const rows = d3
    .csvParse(datasetCsv, (d) => ({
      term: String(d.term),
      week: Number(d.week),
      program: String(d.program),
      section_id: String(d.section_id),
      n_students: Number(d.n_students),
      n_pass: Number(d.n_pass),
    }))
    .filter((r) => Number.isFinite(r.week) && Number.isFinite(r.n_students) && r.n_students > 0 && Number.isFinite(r.n_pass))

  const agg = d3.rollups(
    rows,
    (v) => ({
      n_students: d3.sum(v, (d) => d.n_students),
      n_pass: d3.sum(v, (d) => d.n_pass),
    }),
    (d) => d.term,
    (d) => d.program,
    (d) => d.week,
  )

  cachedAgg = agg.flatMap(([term, byProgram]) =>
    byProgram.flatMap(([program, byWeek]) =>
      byWeek.map(([week, a]) => ({
        term,
        week,
        program,
        n_students: a.n_students,
        n_pass: a.n_pass,
        pass_rate: a.n_students > 0 ? a.n_pass / a.n_students : NaN,
      })),
    ),
  )

  cachedAgg.sort((a, b) => (a.term === b.term ? (a.program === b.program ? a.week - b.week : a.program.localeCompare(b.program)) : a.term.localeCompare(b.term)))
  return cachedAgg
}

const allTerms = computed(() => Array.from(new Set(getAggRows().map((r) => r.term))).sort())
const term = ref(allTerms.value.at(-1) ?? 'unknown')

const allPrograms = computed(() =>
  Array.from(new Set(getAggRows().filter((r) => r.term === term.value).map((r) => r.program))).sort(),
)

const programColors = computed(() => {
  const programs = allPrograms.value
  return new Map<string, string>([
    [programs[0] ?? 'CS', vizTheme.primary],
    [programs[1] ?? 'DS', vizTheme.cyan],
    [programs[2] ?? 'IS', vizTheme.violet],
    [programs[3] ?? 'IT', vizTheme.orange],
  ])
})

const termRows = computed(() => getAggRows().filter((r) => r.term === term.value && Number.isFinite(r.pass_rate)))
const minWeek = computed(() => d3.min(termRows.value, (d) => d.week) ?? 1)
const maxWeek = computed(() => d3.max(termRows.value, (d) => d.week) ?? 1)

const weekStart = ref(minWeek.value)
const weekEnd = ref(maxWeek.value)

const selectedPrograms = ref<string[]>([])
if (selectedPrograms.value.length === 0) selectedPrograms.value = allPrograms.value.slice(0, 3)

watch(
  term,
  () => {
    weekStart.value = minWeek.value
    weekEnd.value = maxWeek.value
    selectedPrograms.value = allPrograms.value.slice(0, 3)
  },
  { flush: 'sync' },
)

const clampedWeekStart = computed(() => Math.min(weekStart.value, weekEnd.value))
const clampedWeekEnd = computed(() => Math.max(weekStart.value, weekEnd.value))

const filtered = computed(() =>
  termRows.value.filter(
    (r) =>
      selectedPrograms.value.includes(r.program) &&
      r.week >= clampedWeekStart.value &&
      r.week <= clampedWeekEnd.value,
  ),
)

const series = computed(() => {
  const byProgram = d3.group(filtered.value, (d) => d.program)
  return Array.from(byProgram, ([program, rows]) => ({
    program,
    values: rows
      .slice()
      .sort((a, b) => a.week - b.week)
      .map((r) => ({ week: r.week, pass_rate: r.pass_rate })),
  })).sort((a, b) => a.program.localeCompare(b.program))
})

const overall = computed(() => {
  const n_students = d3.sum(filtered.value, (d) => d.n_students)
  const n_pass = d3.sum(filtered.value, (d) => d.n_pass)
  return {
    n_students,
    n_pass,
    pass_rate: n_students > 0 ? n_pass / n_students : NaN,
  }
})

const yDomain = computed(() => {
  const extent = d3.extent(filtered.value, (d) => d.pass_rate) as [number | undefined, number | undefined]
  const lo = extent[0] ?? 0.6
  const hi = extent[1] ?? 0.9
  const pad = Math.max(0.02, (hi - lo) * 0.15)
  return [Math.max(0, lo - pad), Math.min(1, hi + pad)] as [number, number]
})

const width = 860
const height = 360
const margin = { top: 46, right: 24, bottom: 48, left: 62 }
const plotW = width - margin.left - margin.right
const plotH = height - margin.top - margin.bottom
const viewPad = 24

const x = computed(() =>
  d3
    .scaleLinear()
    .domain([clampedWeekStart.value, clampedWeekEnd.value])
    .range([margin.left, width - margin.right]),
)

const y = computed(() =>
  d3
    .scaleLinear()
    .domain(yDomain.value)
    .nice()
    .range([height - margin.bottom, margin.top]),
)

const xTicks = computed(() =>
  x.value.ticks(Math.min(10, Math.max(3, Math.floor(plotW / 90)))).map((t) => ({ t, px: x.value(t) })),
)
const yTicks = computed(() => y.value.ticks(4).map((t) => ({ t, py: y.value(t) })))

const line = computed(() =>
  d3
    .line<{ week: number; pass_rate: number }>()
    .x((d) => x.value(d.week))
    .y((d) => y.value(d.pass_rate))
    .curve(d3.curveMonotoneX),
)

const paths = computed(() =>
  series.value.map((s) => ({
    program: s.program,
    d: line.value(s.values) || '',
    stroke: programColors.value.get(s.program) ?? vizTheme.primary,
    values: s.values,
  })),
)

function toggleProgram(program: string) {
  const set = new Set(selectedPrograms.value)
  if (set.has(program)) set.delete(program)
  else set.add(program)
  selectedPrograms.value = Array.from(set).sort()
}
</script>

<template>
  <div class="grid grid-cols-2 gap-4 items-stretch">
    <div class="card">
      <div class="kicker">Dash mindset</div>
      <div class="text-xl font-800 mt-1">Inputs → callback → outputs</div>
      <div class="op70 mt-2">
        Change an input, recompute, and redraw. The mechanics are the same in a Vue demo and a Dash app.
      </div>

      <div class="mt-5 grid grid-cols-2 gap-3">
        <div class="card !p-3">
          <div class="kicker">Term</div>
          <select v-model="term" class="w-full mt-2 px-2 py-1.5 rounded-md bg-white/5 border border-white/10">
            <option v-for="t in allTerms" :key="t" :value="t">{{ t }}</option>
          </select>
        </div>
        <div class="card !p-3">
          <div class="kicker">Week range</div>
          <div class="mt-2 text-sm op70">Start: <span class="font-700">{{ clampedWeekStart }}</span></div>
          <input v-model.number="weekStart" :min="minWeek" :max="maxWeek" type="range" class="w-full mt-2" />
          <div class="mt-3 text-sm op70">End: <span class="font-700">{{ clampedWeekEnd }}</span></div>
          <input v-model.number="weekEnd" :min="minWeek" :max="maxWeek" type="range" class="w-full mt-2" />
        </div>
      </div>

      <div class="mt-4 card !p-3">
        <div class="kicker">Programs</div>
        <div class="mt-3 grid grid-cols-2 gap-2">
          <button
            v-for="p in allPrograms"
            :key="p"
            type="button"
            class="px-2.5 py-2 rounded-lg border border-white/10 bg-white/5 text-left"
            :class="selectedPrograms.includes(p) ? 'ring-1 ring-white/20' : 'op70 hover:op90'"
            @click="toggleProgram(p)"
          >
            <span class="inline-flex items-center gap-2">
              <span class="inline-block w-2.5 h-2.5 rounded-full" :style="{ background: programColors.get(p) || vizTheme.primary }" />
              <span class="font-700">{{ p }}</span>
            </span>
          </button>
        </div>
      </div>

      <div class="mt-4 grid grid-cols-2 gap-3">
        <div class="card !p-3">
          <div class="kicker">Rows</div>
          <div class="text-2xl font-900 mt-1">{{ filtered.length }}</div>
          <div class="text-sm op70 mt-1">Aggregated program-week points</div>
        </div>
        <div class="card !p-3">
          <div class="kicker">Overall pass_rate</div>
          <div class="text-2xl font-900 mt-1">
            {{ Number.isFinite(overall.pass_rate) ? overall.pass_rate.toFixed(3) : '—' }}
          </div>
          <div class="text-sm op70 mt-1">{{ overall.n_pass }} / {{ overall.n_students }} students</div>
        </div>
      </div>
    </div>

    <div class="viz-frame viz-fill">
      <svg
        :viewBox="`${-viewPad} ${-viewPad} ${width + viewPad * 2} ${height + viewPad * 2}`"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Mini dashboard: interactive inputs drive an updated line chart"
      >
        <rect x="0" y="0" :width="width" :height="height" :fill="vizTheme.panelFill" rx="20" />

        <text :x="margin.left" :y="26" :fill="vizTheme.text" :style="{ fontSize: '16px', fontWeight: 850 }">
          Live mini dashboard (callback behavior)
        </text>
        <text :x="width - margin.right" :y="26" text-anchor="end" :fill="vizTheme.textMuted" :style="{ fontSize: '11px', fontWeight: 650 }">
          Legend-like toggles on the left
        </text>

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
            stroke-width="1"
          />
        </g>

        <!-- axes -->
        <g :stroke="vizTheme.axis" stroke-width="1.4">
          <line :x1="margin.left" :x2="width - margin.right" :y1="height - margin.bottom" :y2="height - margin.bottom" />
          <line :x1="margin.left" :x2="margin.left" :y1="margin.top" :y2="height - margin.bottom" />
        </g>

        <!-- ticks -->
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
        <g v-for="tick in yTicks" :key="`yt-${tick.t}`">
          <line :x1="margin.left - 6" :x2="margin.left" :y1="tick.py" :y2="tick.py" :stroke="vizTheme.axis" />
          <text
            :x="margin.left - 10"
            :y="tick.py + 4"
            text-anchor="end"
            :fill="vizTheme.textMuted"
            :style="{ fontSize: '12px', fontWeight: 650 }"
          >
            {{ tick.t.toFixed(2) }}
          </text>
        </g>

        <!-- labels -->
        <text
          :x="(margin.left + width - margin.right) / 2"
          :y="height - 10"
          :fill="vizTheme.textMuted"
          :style="{ fontSize: '12px', fontWeight: 650 }"
          text-anchor="middle"
        >
          Week
        </text>
        <text
          :x="14"
          :y="(margin.top + height - margin.bottom) / 2"
          :fill="vizTheme.textMuted"
          :style="{ fontSize: '12px', fontWeight: 650 }"
          text-anchor="middle"
          transform="rotate(-90 14 180)"
        >
          pass_rate
        </text>

        <!-- lines + points -->
        <g v-for="p in paths" :key="p.program">
          <path :d="p.d" fill="none" :stroke="p.stroke" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" />
          <circle
            v-for="(pt, i) in p.values"
            :key="`${p.program}-${i}`"
            :cx="x(pt.week)"
            :cy="y(pt.pass_rate)"
            r="5.5"
            :fill="vizTheme.bg"
            :stroke="p.stroke"
            stroke-width="2.4"
          />
        </g>
      </svg>
    </div>
  </div>
</template>
