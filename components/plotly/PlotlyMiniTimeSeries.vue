<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import Plotly from 'plotly.js-basic-dist-min'
import * as d3 from 'd3'
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

let cachedRows: DataRow[] | null = null
function getRows(): DataRow[] {
  if (cachedRows) return cachedRows
  cachedRows = d3.csvParse(datasetCsv, (d) => ({
    term: String(d.term),
    week: Number(d.week),
    program: String(d.program),
    section_id: String(d.section_id),
    n_students: Number(d.n_students),
    n_pass: Number(d.n_pass),
  }))
  return cachedRows
}

const container = ref<HTMLDivElement | null>(null)
let resizeObserver: ResizeObserver | null = null

function buildFigure() {
  const rows = getRows().filter((r) => Number.isFinite(r.week) && Number.isFinite(r.n_students) && r.n_students > 0)
  const terms = Array.from(new Set(rows.map((r) => r.term))).sort()
  const term = terms.at(-1) ?? 'unknown'
  const termRows = rows.filter((r) => r.term === term)

  const programs = Array.from(new Set(termRows.map((r) => r.program))).sort()
  const colors = new Map<string, string>([
    [programs[0] ?? 'CS', vizTheme.primary],
    [programs[1] ?? 'DS', vizTheme.cyan],
    [programs[2] ?? 'IS', vizTheme.violet],
    [programs[3] ?? 'IT', vizTheme.orange],
  ])

  const byProgramWeek = d3.rollup(
    termRows,
    (v) => ({
      n_pass: d3.sum(v, (d) => d.n_pass),
      n_students: d3.sum(v, (d) => d.n_students),
    }),
    (d) => d.program,
    (d) => d.week,
  )

  const weeks = Array.from(new Set(termRows.map((r) => r.week))).filter(Number.isFinite).sort((a, b) => a - b)
  const series = programs.map((program) => {
    const m = byProgramWeek.get(program) ?? new Map<number, { n_pass: number; n_students: number }>()
    const values = weeks
      .map((week) => {
        const agg = m.get(week)
        const pass_rate = agg && agg.n_students > 0 ? agg.n_pass / agg.n_students : NaN
        return { week, pass_rate }
      })
      .filter((d) => Number.isFinite(d.pass_rate))
    return { program, values }
  })

  const traces = series.map((s) => ({
    type: 'scatter',
    mode: 'lines+markers',
    name: s.program,
    x: s.values.map((d) => d.week),
    y: s.values.map((d) => d.pass_rate),
    line: { color: colors.get(s.program) ?? vizTheme.primary, width: 3.2 },
    marker: {
      size: 8,
      color: vizTheme.bg,
      line: { color: colors.get(s.program) ?? vizTheme.primary, width: 2.4 },
    },
    hovertemplate: `<b>${s.program}</b><br>week=%{x}<br>pass_rate=%{y:.3f}<extra></extra>`,
  }))

  const layout = {
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    height: 420,
    margin: { l: 58, r: 20, t: 46, b: 46 },
    hovermode: 'x unified',
    font: {
      family: 'inherit',
      size: 12,
      color: 'rgba(245,247,250,0.88)',
    },
    title: {
      text: `<b>Plotly-style interaction (real data)</b> <span style="opacity:0.72;font-size:12px">term: ${term}</span>`,
      x: 0.02,
      y: 0.98,
      xanchor: 'left',
      yanchor: 'top',
      font: { size: 16, color: 'rgba(255,255,255,0.92)' },
    },
    legend: {
      orientation: 'h',
      x: 0.01,
      y: 1.14,
      font: { size: 12, color: 'rgba(245,247,250,0.78)' },
      itemclick: 'toggle',
      itemdoubleclick: 'toggleothers',
    },
    xaxis: {
      title: { text: 'Week', standoff: 8, font: { size: 12, color: 'rgba(245,247,250,0.72)' } },
      tickfont: { size: 12, color: 'rgba(245,247,250,0.72)' },
      gridcolor: 'rgba(255,255,255,0.10)',
      zeroline: false,
      linecolor: 'rgba(255,255,255,0.14)',
      ticks: 'outside',
      tickcolor: 'rgba(255,255,255,0.14)',
      ticklen: 6,
    },
    yaxis: {
      title: { text: 'pass_rate', standoff: 8, font: { size: 12, color: 'rgba(245,247,250,0.72)' } },
      tickfont: { size: 12, color: 'rgba(245,247,250,0.72)' },
      gridcolor: 'rgba(255,255,255,0.10)',
      zeroline: false,
      linecolor: 'rgba(255,255,255,0.14)',
      ticks: 'outside',
      tickcolor: 'rgba(255,255,255,0.14)',
      ticklen: 6,
      tickformat: '.2f',
    },
    hoverlabel: {
      bgcolor: 'rgba(11, 18, 32, 0.92)',
      bordercolor: 'rgba(255,255,255,0.18)',
      font: { color: 'rgba(255,255,255,0.92)' },
    },
  } as const

  const config = {
    displayModeBar: false,
    responsive: true,
    scrollZoom: true,
    doubleClick: 'reset',
  } as const

  return { traces, layout, config }
}

async function render() {
  if (!container.value) return
  const { traces, layout, config } = buildFigure()
  await Plotly.newPlot(container.value, traces as any, layout as any, config as any)
}

onMounted(async () => {
  await render()
  if (container.value) {
    resizeObserver = new ResizeObserver(() => {
      if (!container.value) return
      Plotly.Plots.resize(container.value)
    })
    resizeObserver.observe(container.value)
  }
})

onBeforeUnmount(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
  if (container.value) Plotly.purge(container.value)
})
</script>

<template>
  <div class="viz-frame">
    <div ref="container" aria-label="Interactive Plotly chart demo" style="width: 100%; height: 420px" />
  </div>
</template>
