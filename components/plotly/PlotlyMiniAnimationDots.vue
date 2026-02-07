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
    n_students: Number(d.n_students),
    n_pass: Number(d.n_pass),
  }))
  return cachedRows
}

const container = ref<HTMLDivElement | null>(null)
let resizeObserver: ResizeObserver | null = null

function build() {
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

  const [minWeek, maxWeek] = d3.extent(termRows, (d) => d.week) as [number, number]
  const weeks = d3.range(minWeek, maxWeek + 1)

  const byProgramWeek = d3.rollup(
    termRows,
    (v) => ({
      n_pass: d3.sum(v, (d) => d.n_pass),
      n_students: d3.sum(v, (d) => d.n_students),
    }),
    (d) => d.program,
    (d) => d.week,
  )

  const byWeek = new Map<number, { x: number[]; y: string[]; text: string[]; c: string[] }>()
  const allRates: number[] = []
  for (const week of weeks) {
    const x: number[] = []
    const y: string[] = []
    const text: string[] = []
    const c: string[] = []
    for (const program of programs) {
      const agg = byProgramWeek.get(program)?.get(week)
      const rate = agg && agg.n_students > 0 ? agg.n_pass / agg.n_students : NaN
      x.push(Number.isFinite(rate) ? rate : NaN)
      y.push(program)
      text.push(Number.isFinite(rate) ? rate.toFixed(2) : '—')
      c.push(colors.get(program) ?? vizTheme.primary)
      if (Number.isFinite(rate)) allRates.push(rate)
    }
    byWeek.set(week, { x, y, text, c })
  }

  const extent = d3.extent(allRates) as [number, number]
  const xMin = Math.max(0, Math.min(0.6, (extent[0] ?? 0.6) - 0.04))
  const xMax = Math.min(1, Math.max(0.9, (extent[1] ?? 0.9) + 0.04))

  const startWeek = weeks[Math.max(0, Math.floor(weeks.length / 4))] ?? minWeek
  const start = byWeek.get(startWeek) ?? { x: [], y: [], text: [], c: [] }

  const trace = {
    type: 'scatter',
    mode: 'markers+text',
    x: start.x,
    y: start.y,
    text: start.text,
    textposition: 'middle right',
    textfont: { size: 12, color: 'rgba(245,247,250,0.78)' },
    marker: {
      size: 12,
      color: start.c,
      line: { color: 'rgba(11,15,23,0.95)', width: 2.4 },
    },
    hovertemplate: `<b>%{y}</b><br>week=${startWeek}<br>pass_rate=%{x:.3f}<extra></extra>`,
  } as const

  const sliderSteps = weeks.map((week) => ({
    label: String(week),
    method: 'animate',
    args: [[String(week)], { mode: 'immediate', frame: { duration: 500, redraw: true }, transition: { duration: 300 } }],
  }))

  const layout = {
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    height: 460,
    margin: { l: 80, r: 24, t: 52, b: 96 },
    font: { family: 'inherit', size: 12, color: 'rgba(245,247,250,0.88)' },
    title: {
      text: `<b>Plotly animation (frames)</b> <span style="opacity:0.70;font-size:12px">term: ${term}</span>`,
      x: 0.02,
      y: 0.98,
      xanchor: 'left',
      yanchor: 'top',
      font: { size: 16, color: 'rgba(255,255,255,0.92)' },
    },
    xaxis: {
      title: { text: 'pass_rate', standoff: 6, font: { size: 12, color: 'rgba(245,247,250,0.72)' } },
      tickfont: { size: 12, color: 'rgba(245,247,250,0.72)' },
      gridcolor: 'rgba(255,255,255,0.10)',
      zeroline: false,
      range: [xMin, xMax],
      tickformat: '.2f',
    },
    yaxis: {
      title: { text: 'Program', standoff: 6, font: { size: 12, color: 'rgba(245,247,250,0.72)' } },
      tickfont: { size: 12, color: 'rgba(245,247,250,0.72)' },
      gridcolor: 'rgba(255,255,255,0.06)',
      zeroline: false,
      categoryorder: 'array',
      categoryarray: programs,
    },
    showlegend: false,
    hoverlabel: {
      bgcolor: 'rgba(11, 18, 32, 0.92)',
      bordercolor: 'rgba(255,255,255,0.18)',
      font: { color: 'rgba(255,255,255,0.92)' },
    },
    updatemenus: [
      {
        type: 'buttons',
        direction: 'left',
        x: 0.02,
        // Keep controls away from the rounded frame edge so they never clip.
        y: 0.03,
        xanchor: 'left',
        yanchor: 'bottom',
        pad: { r: 10, t: 0, b: 0, l: 0 },
        showactive: false,
        bgcolor: 'rgba(255,255,255,0.06)',
        bordercolor: 'rgba(255,255,255,0.14)',
        buttons: [
          {
            label: 'Play',
            method: 'animate',
            args: [null, { fromcurrent: true, frame: { duration: 650, redraw: true }, transition: { duration: 300 } }],
          },
          {
            label: 'Pause',
            method: 'animate',
            args: [[null], { mode: 'immediate', frame: { duration: 0, redraw: false }, transition: { duration: 0 } }],
          },
        ],
      },
    ],
    sliders: [
      {
        // Leave room so the slider handle doesn't clip at Week 1 / Week N.
        x: 0.26,
        y: 0.03,
        xanchor: 'left',
        yanchor: 'bottom',
        len: 0.70,
        pad: { t: 0, b: 0 },
        active: Math.max(0, weeks.indexOf(startWeek)),
        currentvalue: {
          prefix: 'Week ',
          font: { size: 12, color: 'rgba(245,247,250,0.78)' },
        },
        steps: sliderSteps,
      },
    ],
  } as const

  const frames = weeks.map((week) => {
    const f = byWeek.get(week) ?? { x: [], y: [], text: [], c: [] }
    return {
      name: String(week),
      data: [
        {
          x: f.x,
          y: f.y,
          text: f.text,
          marker: { color: f.c },
          hovertemplate: `<b>%{y}</b><br>week=${week}<br>pass_rate=%{x:.3f}<extra></extra>`,
        },
      ],
    }
  })

  const config = { displayModeBar: false, responsive: true } as const

  return { trace, frames, layout, config }
}

async function render() {
  if (!container.value) return
  const { trace, frames, layout, config } = build()
  await Plotly.newPlot(container.value, [trace] as any, layout as any, config as any)
  await Plotly.addFrames(container.value, frames as any)
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
    <div ref="container" aria-label="Plotly animation demo" style="width: 100%; height: 460px" />
  </div>
</template>
