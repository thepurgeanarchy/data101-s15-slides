<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import * as d3 from 'd3'
import { vizTheme } from './theme'
import datasetCsv from '../../notebooks/data-task-abstraction-dataset.csv?raw'

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
let loop: d3.Timer | null = null

function render() {
  if (!container.value) return
  d3.select(container.value).selectAll('*').remove()

  const rows = getRows().filter((r) => Number.isFinite(r.week) && Number.isFinite(r.n_students) && r.n_students > 0)
  const terms = Array.from(new Set(rows.map((r) => r.term))).sort()
  const term = terms.at(-1) ?? 'unknown'
  const termRows = rows.filter((r) => r.term === term)

  const programs = Array.from(new Set(termRows.map((r) => r.program))).sort()
  const [minWeek, maxWeek] = d3.extent(termRows, (d) => d.week) as [number, number]
  const weeks = d3.range(minWeek, maxWeek + 1)

  const byProgramWeek = d3.rollup(
    termRows,
    (v) => ({ n_pass: d3.sum(v, (d) => d.n_pass), n_students: d3.sum(v, (d) => d.n_students) }),
    (d) => d.program,
    (d) => d.week,
  )

  const byWeek = new Map<number, Map<string, number>>()
  const allRates: number[] = []
  for (const week of weeks) {
    const m = new Map<string, number>()
    for (const program of programs) {
      const agg = byProgramWeek.get(program)?.get(week)
      const rate = agg && agg.n_students > 0 ? agg.n_pass / agg.n_students : NaN
      m.set(program, rate)
      if (Number.isFinite(rate)) allRates.push(rate)
    }
    byWeek.set(week, m)
  }

  const extent = d3.extent(allRates) as [number, number]
  const xMin = Math.max(0, Math.min(0.6, (extent[0] ?? 0.6) - 0.04))
  const xMax = Math.min(1, Math.max(0.9, (extent[1] ?? 0.9) + 0.04))

  const width = 720
  const height = 320
  const margin = { top: 44, right: 26, bottom: 44, left: 72 }
  const plotW = width - margin.left - margin.right
  const plotH = height - margin.top - margin.bottom

  const x = d3.scaleLinear().domain([xMin, xMax]).nice().range([0, plotW])
  const y = d3.scaleBand<string>().domain(programs).range([0, plotH]).padding(0.35)

  const svg = d3
    .select(container.value)
    .append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('role', 'img')
    .attr('aria-label', 'Animated dot plot showing pass rate by program across weeks')
    .style('font-family', 'inherit')

  svg
    .append('rect')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', width)
    .attr('height', height)
    .attr('rx', 18)
    .attr('ry', 18)
    .attr('fill', vizTheme.panelFill)
    .attr('stroke', vizTheme.panelStroke)
    .attr('stroke-width', 1.2)

  svg
    .append('text')
    .attr('x', margin.left)
    .attr('y', 26)
    .attr('fill', vizTheme.text)
    .style('font-size', '15px')
    .style('font-weight', '850')
    .text('Animation = transitions between states')

  const weekLabel = svg
    .append('text')
    .attr('x', width - margin.right)
    .attr('y', 26)
    .attr('text-anchor', 'end')
    .attr('fill', vizTheme.textMuted)
    .style('font-size', '11px')
    .style('font-weight', '700')

  const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

  // Gridlines
  g.append('g')
    .selectAll('line')
    .data(x.ticks(4))
    .enter()
    .append('line')
    .attr('x1', (t) => x(t))
    .attr('x2', (t) => x(t))
    .attr('y1', 0)
    .attr('y2', plotH)
    .attr('stroke', vizTheme.grid)
    .attr('stroke-width', 1)

  const axisStyle = (sel: d3.Selection<SVGGElement, unknown, null, undefined>) => {
    sel.selectAll('path').attr('stroke', vizTheme.axis).attr('stroke-width', 1.2)
    sel.selectAll('line').attr('stroke', vizTheme.axis).attr('stroke-width', 1.2)
    sel.selectAll('text').attr('fill', vizTheme.textMuted).style('font-size', '12px').style('font-weight', '650')
  }

  const xAxisG = g.append('g').attr('transform', `translate(0,${plotH})`).call(d3.axisBottom(x).ticks(4).tickFormat(d3.format('.2f')))
  axisStyle(xAxisG)
  const yAxisG = g.append('g').call(d3.axisLeft(y).tickSizeOuter(0))
  axisStyle(yAxisG)

  g.append('text')
    .attr('x', plotW / 2)
    .attr('y', plotH + 36)
    .attr('text-anchor', 'middle')
    .attr('fill', vizTheme.textMuted)
    .style('font-size', '12px')
    .style('font-weight', '650')
    .text('pass_rate')

  const dots = g.append('g').attr('class', 'dots')
  const vals = g.append('g').attr('class', 'vals')

  const fmt = d3.format('.2f')
  const last = new Map<string, number>()

  function frameForWeek(week: number) {
    const m = byWeek.get(week)
    return programs.map((program) => ({ program, pass_rate: m?.get(program) ?? NaN }))
  }

  function tweenText(this: SVGTextElement, next: number) {
    if (!Number.isFinite(next)) {
      return function () {
        this.textContent = '—'
      }
    }
    const prev = Number(last.get(this.dataset.program || '') ?? next)
    const interp = d3.interpolateNumber(prev, next)
    return function (t: number) {
      const v = interp(t)
      this.textContent = Number.isFinite(v) ? fmt(v) : '—'
    }
  }

  function update(week: number, animate = true) {
    weekLabel.text(`Term ${term} · Week ${week}`)
    const frame = frameForWeek(week)

    const t = animate ? svg.transition().duration(650).ease(d3.easeCubicOut) : svg.transition().duration(0)
    const safeRate = (v: number) => (Number.isFinite(v) ? v : xMin)

    const c = dots.selectAll<SVGCircleElement, { program: string; pass_rate: number }>('circle').data(frame, (d) => d.program)
    const cEnter = c
      .enter()
      .append('circle')
      .attr('cy', (d) => (y(d.program) ?? 0) + y.bandwidth() / 2)
      .attr('cx', x(xMin))
      .attr('r', 7)
      .attr('fill', vizTheme.bg)
      .attr('stroke', vizTheme.cyan)
      .attr('stroke-width', 2.4)
      .attr('opacity', (d) => (Number.isFinite(d.pass_rate) ? 1 : 0.28))

    cEnter
      .merge(c as any)
      .transition(t as any)
      .attr('cy', (d) => (y(d.program) ?? 0) + y.bandwidth() / 2)
      .attr('cx', (d) => x(safeRate(d.pass_rate)))
      .attr('opacity', (d) => (Number.isFinite(d.pass_rate) ? 1 : 0.28))

    c.exit().remove()

    const tx = vals.selectAll<SVGTextElement, { program: string; pass_rate: number }>('text').data(frame, (d) => d.program)
    const txEnter = tx
      .enter()
      .append('text')
      .attr('data-program', (d) => d.program)
      .attr('x', x(xMin) + 12)
      .attr('y', (d) => (y(d.program) ?? 0) + y.bandwidth() / 2 + 4)
      .attr('fill', vizTheme.textMuted)
      .style('font-size', '12px')
      .style('font-weight', '700')
      .text('—')

    txEnter
      .merge(tx as any)
      .each(function (d) {
        this.dataset.program = d.program
      })
      .transition(t as any)
      .attr('x', (d) => Math.min(plotW - 30, x(safeRate(d.pass_rate)) + 12))
      .attr('y', (d) => (y(d.program) ?? 0) + y.bandwidth() / 2 + 4)
      .tween('text', function (d) {
        return tweenText.call(this, d.pass_rate)
      })

    tx.exit().remove()

    for (const d of frame) {
      if (Number.isFinite(d.pass_rate)) last.set(d.program, d.pass_rate)
    }
  }

  let i = Math.max(0, Math.floor(weeks.length / 4))
  update(weeks[i] ?? minWeek, false)

  const prefersReduced = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
  if (!prefersReduced) {
    loop = d3.interval(() => {
      i = (i + 1) % weeks.length
      update(weeks[i] ?? minWeek)
    }, 900)
  }
}

onMounted(render)
onBeforeUnmount(() => {
  loop?.stop()
  loop = null
  if (!container.value) return
  d3.select(container.value).selectAll('*').remove()
})
</script>

<template>
  <div ref="container" class="viz-frame" />
</template>
