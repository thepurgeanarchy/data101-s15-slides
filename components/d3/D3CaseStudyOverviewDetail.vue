<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import * as d3 from 'd3'
import { vizTheme } from './theme'
import datasetCsv from '../../notebooks/data-task-abstraction-dataset.csv?raw'

type DataRow = {
  term: string
  week: number
  program: string
  section_id: string
  n_students: number
  n_pass: number
  avg_score: number
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
    avg_score: Number(d.avg_score),
  }))
  return cachedRows
}

const container = ref<HTMLDivElement | null>(null)

function render() {
  if (!container.value) return
  d3.select(container.value).selectAll('*').remove()

  const rows = getRows().filter((r) => Number.isFinite(r.week) && Number.isFinite(r.avg_score))
  const terms = Array.from(new Set(rows.map((r) => r.term))).sort()
  const term = terms.at(-1) ?? 'unknown'
  const termRows = rows.filter((r) => r.term === term)

  const programs = Array.from(new Set(termRows.map((r) => r.program))).sort()
  const colors = new Map<string, string>([
    [programs[0] ?? 'A', vizTheme.primary],
    [programs[1] ?? 'B', vizTheme.cyan],
    [programs[2] ?? 'C', vizTheme.violet],
    [programs[3] ?? 'D', vizTheme.orange],
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

  const passRateExtent = d3.extent(series.flatMap((s) => s.values.map((d) => d.pass_rate))) as [number, number]
  const yMin = Math.max(0, Math.min(0.6, passRateExtent[0] - 0.03))
  const yMax = Math.min(1, Math.max(0.9, passRateExtent[1] + 0.03))

  const width = 960
  const height = 460
  const pad = 22
  const gap = 22

  const leftW = 610
  const rightW = width - pad * 2 - gap - leftW
  const panelH = height - pad * 2

  const left = { x: pad, y: pad, w: leftW, h: panelH }
  const right = { x: pad + leftW + gap, y: pad, w: rightW, h: panelH }

  const svg = d3
    .select(container.value)
    .append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('role', 'img')
    .attr('aria-label', 'Case study: brush week range to see distribution changes by program')
    .style('font-family', 'inherit')

  svg
    .append('rect')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', width)
    .attr('height', height)
    .attr('rx', 20)
    .attr('ry', 20)
    .attr('fill', vizTheme.panelFill)
    .attr('stroke', vizTheme.panelStroke)
    .attr('stroke-width', 1.2)

  svg
    .append('text')
    .attr('x', pad)
    .attr('y', 30)
    .attr('fill', vizTheme.text)
    .style('font-size', '18px')
    .style('font-weight', '850')
    .text('Case study (real data): overview → brush → distribution')

  svg
    .append('text')
    .attr('x', pad)
    .attr('y', 50)
    .attr('fill', vizTheme.textMuted)
    .style('font-size', '12px')
    .style('font-weight', '650')
    .text(`Term: ${term} · Drag on the chart to select a week range`)

  const leftG = svg.append('g').attr('transform', `translate(${left.x},${left.y})`)
  const rightG = svg.append('g').attr('transform', `translate(${right.x},${right.y})`)

  const leftMargin = { top: 54, right: 18, bottom: 46, left: 56 }
  const leftPlotW = left.w - leftMargin.left - leftMargin.right
  const leftPlotH = left.h - leftMargin.top - leftMargin.bottom

  const x = d3.scaleLinear().domain([minWeek, maxWeek]).range([0, leftPlotW])
  const y = d3.scaleLinear().domain([yMin, yMax]).nice().range([leftPlotH, 0])

  leftG
    .append('rect')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', left.w)
    .attr('height', left.h)
    .attr('rx', 18)
    .attr('ry', 18)
    .attr('fill', 'rgba(255,255,255,0.02)')
    .attr('stroke', 'rgba(255,255,255,0.10)')
    .attr('stroke-width', 1)

  leftG
    .append('text')
    .attr('x', 18)
    .attr('y', 34)
    .attr('fill', vizTheme.text)
    .style('font-size', '14px')
    .style('font-weight', '800')
    .text('Overview: pass_rate by program')

  const leftPlot = leftG.append('g').attr('transform', `translate(${leftMargin.left},${leftMargin.top})`)

  // Gridlines
  leftPlot
    .append('g')
    .selectAll('line')
    .data(y.ticks(4))
    .enter()
    .append('line')
    .attr('x1', 0)
    .attr('x2', leftPlotW)
    .attr('y1', (t) => y(t))
    .attr('y2', (t) => y(t))
    .attr('stroke', vizTheme.grid)
    .attr('stroke-width', 1)

  const axisStyle = (sel: d3.Selection<SVGGElement, unknown, null, undefined>) => {
    sel.selectAll('path').attr('stroke', vizTheme.axis).attr('stroke-width', 1.2)
    sel.selectAll('line').attr('stroke', vizTheme.axis).attr('stroke-width', 1.2)
    sel.selectAll('text').attr('fill', vizTheme.textMuted).style('font-size', '12px').style('font-weight', '650')
  }

  const xAxisG = leftPlot.append('g').attr('transform', `translate(0,${leftPlotH})`).call(d3.axisBottom(x).ticks(10).tickFormat(d3.format('d')))
  axisStyle(xAxisG)
  const yAxisG = leftPlot.append('g').call(d3.axisLeft(y).ticks(4).tickFormat(d3.format('.2f')))
  axisStyle(yAxisG)

  leftPlot
    .append('text')
    .attr('x', leftPlotW / 2)
    .attr('y', leftPlotH + 38)
    .attr('text-anchor', 'middle')
    .attr('fill', vizTheme.textMuted)
    .style('font-size', '12px')
    .style('font-weight', '650')
    .text('Week')

  leftPlot
    .append('text')
    .attr('x', -40)
    .attr('y', leftPlotH / 2)
    .attr('transform', `rotate(-90 -40 ${leftPlotH / 2})`)
    .attr('text-anchor', 'middle')
    .attr('fill', vizTheme.textMuted)
    .style('font-size', '12px')
    .style('font-weight', '650')
    .text('pass_rate')

  // Legend
  const legend = leftG.append('g').attr('transform', `translate(${left.w - leftMargin.right - 10},${20})`)
  const legendItem = legend
    .selectAll('g.item')
    .data(programs)
    .enter()
    .append('g')
    .attr('class', 'item')
    .attr('transform', (_, i) => `translate(${-110 * (programs.length - 1 - i)},0)`)

  legendItem
    .append('line')
    .attr('x1', 0)
    .attr('x2', 26)
    .attr('y1', 10)
    .attr('y2', 10)
    .attr('stroke', (d) => colors.get(d) ?? vizTheme.primary)
    .attr('stroke-width', 3)
    .attr('stroke-linecap', 'round')

  legendItem
    .append('text')
    .attr('x', 32)
    .attr('y', 14)
    .attr('fill', vizTheme.textMuted)
    .style('font-size', '12px')
    .style('font-weight', '700')
    .text((d) => d)

  const line = d3
    .line<{ week: number; pass_rate: number }>()
    .x((d) => x(d.week))
    .y((d) => y(d.pass_rate))
    .curve(d3.curveMonotoneX)

  const lines = leftPlot
    .append('g')
    .selectAll('path.series')
    .data(series)
    .enter()
    .append('path')
    .attr('class', 'series')
    .attr('fill', 'none')
    .attr('stroke', (d) => colors.get(d.program) ?? vizTheme.primary)
    .attr('stroke-width', 3)
    .attr('stroke-linecap', 'round')
    .attr('stroke-linejoin', 'round')
    .attr('d', (d) => line(d.values) || '')

  // Brush selection
  const selectedText = leftG
    .append('text')
    .attr('x', 18)
    .attr('y', left.h - 14)
    .attr('fill', vizTheme.textMuted)
    .style('font-size', '12px')
    .style('font-weight', '650')

  const brush = d3
    .brushX()
    .extent([
      [0, 0],
      [leftPlotW, leftPlotH],
    ])

  const brushG = leftPlot.append('g').attr('class', 'brush').call(brush)
  brushG.selectAll('rect.overlay').attr('cursor', 'crosshair')
  brushG.selectAll('rect.selection').attr('fill', 'rgba(147,197,253,0.18)').attr('stroke', 'rgba(147,197,253,0.6)')
  brushG.selectAll('rect.handle').attr('fill', 'rgba(147,197,253,0.32)')

  const rightMargin = { top: 54, right: 18, bottom: 46, left: 44 }
  const rightPlotW = right.w - rightMargin.left - rightMargin.right
  const rightPlotH = right.h - rightMargin.top - rightMargin.bottom

  rightG
    .append('rect')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', right.w)
    .attr('height', right.h)
    .attr('rx', 18)
    .attr('ry', 18)
    .attr('fill', 'rgba(255,255,255,0.02)')
    .attr('stroke', 'rgba(255,255,255,0.10)')
    .attr('stroke-width', 1)

  rightG
    .append('text')
    .attr('x', 18)
    .attr('y', 34)
    .attr('fill', vizTheme.text)
    .style('font-size', '14px')
    .style('font-weight', '800')
    .text('Details: avg_score distribution')

  const rightPlot = rightG.append('g').attr('transform', `translate(${rightMargin.left},${rightMargin.top})`)

  const scoreExtent = d3.extent(termRows, (d) => d.avg_score) as [number, number]
  const yScore = d3
    .scaleLinear()
    .domain([Math.max(0, scoreExtent[0] - 1), Math.min(100, scoreExtent[1] + 1)])
    .nice()
    .range([rightPlotH, 0])

  const xBand = d3.scaleBand<string>().domain(programs).range([0, rightPlotW]).padding(0.25)

  const yScoreAxis = rightPlot.append('g').call(d3.axisLeft(yScore).ticks(4))
  axisStyle(yScoreAxis)
  rightPlot
    .append('text')
    .attr('x', rightPlotW / 2)
    .attr('y', rightPlotH + 38)
    .attr('text-anchor', 'middle')
    .attr('fill', vizTheme.textMuted)
    .style('font-size', '12px')
    .style('font-weight', '650')
    .text('Program')

  rightPlot
    .append('text')
    .attr('x', -34)
    .attr('y', rightPlotH / 2)
    .attr('transform', `rotate(-90 -34 ${rightPlotH / 2})`)
    .attr('text-anchor', 'middle')
    .attr('fill', vizTheme.textMuted)
    .style('font-size', '12px')
    .style('font-weight', '650')
    .text('avg_score')

  const xBandAxis = rightPlot.append('g').attr('transform', `translate(0,${rightPlotH})`).call(d3.axisBottom(xBand))
  axisStyle(xBandAxis)

  function computeBoxStats(week0: number, week1: number) {
    const inRange = termRows.filter((r) => r.week >= week0 && r.week <= week1)
    const byProgram = d3.group(inRange, (d) => d.program)

    return programs.map((program) => {
      const vals = (byProgram.get(program) ?? []).map((d) => d.avg_score).filter(Number.isFinite).sort(d3.ascending)
      const q1 = d3.quantileSorted(vals, 0.25) ?? NaN
      const q2 = d3.quantileSorted(vals, 0.5) ?? NaN
      const q3 = d3.quantileSorted(vals, 0.75) ?? NaN
      const mean = d3.mean(vals) ?? NaN
      const iqr = q3 - q1
      const lo = q1 - 1.5 * iqr
      const hi = q3 + 1.5 * iqr
      const whiskerMin = vals.find((v) => v >= lo) ?? vals[0] ?? NaN
      const whiskerMax = [...vals].reverse().find((v) => v <= hi) ?? vals.at(-1) ?? NaN

      return { program, n: vals.length, q1, q2, q3, mean, whiskerMin, whiskerMax }
    })
  }

  const boxesG = rightPlot.append('g').attr('class', 'boxes')

  function renderBoxes(stats: ReturnType<typeof computeBoxStats>) {
    const bw = xBand.bandwidth()
    const boxes = boxesG.selectAll<SVGGElement, (typeof stats)[number]>('g.box').data(stats, (d) => d.program)

    const enter = boxes.enter().append('g').attr('class', 'box')
    enter.append('line').attr('class', 'whisker')
    enter.append('line').attr('class', 'cap-min')
    enter.append('line').attr('class', 'cap-max')
    enter.append('rect').attr('class', 'iqr')
    enter.append('line').attr('class', 'median')
    enter.append('circle').attr('class', 'mean')

    const all = enter.merge(boxes)

    all.attr('transform', (d) => `translate(${xBand(d.program) ?? 0},0)`)

    all.select('line.whisker')
      .attr('x1', bw / 2)
      .attr('x2', bw / 2)
      .attr('y1', (d) => yScore(d.whiskerMin))
      .attr('y2', (d) => yScore(d.whiskerMax))
      .attr('stroke', (d) => colors.get(d.program) ?? vizTheme.axis)
      .attr('stroke-width', 2.2)
      .attr('opacity', 0.9)

    all.select('line.cap-min')
      .attr('x1', bw * 0.22)
      .attr('x2', bw * 0.78)
      .attr('y1', (d) => yScore(d.whiskerMin))
      .attr('y2', (d) => yScore(d.whiskerMin))
      .attr('stroke', (d) => colors.get(d.program) ?? vizTheme.axis)
      .attr('stroke-width', 2.2)
      .attr('opacity', 0.9)

    all.select('line.cap-max')
      .attr('x1', bw * 0.22)
      .attr('x2', bw * 0.78)
      .attr('y1', (d) => yScore(d.whiskerMax))
      .attr('y2', (d) => yScore(d.whiskerMax))
      .attr('stroke', (d) => colors.get(d.program) ?? vizTheme.axis)
      .attr('stroke-width', 2.2)
      .attr('opacity', 0.9)

    all.select('rect.iqr')
      .attr('x', bw * 0.22)
      .attr('y', (d) => yScore(d.q3))
      .attr('width', bw * 0.56)
      .attr('height', (d) => Math.max(1, yScore(d.q1) - yScore(d.q3)))
      .attr('rx', 10)
      .attr('fill', (d) => `${colors.get(d.program) ?? vizTheme.primary}22`)
      .attr('stroke', (d) => colors.get(d.program) ?? vizTheme.primary)
      .attr('stroke-width', 2)

    all.select('line.median')
      .attr('x1', bw * 0.22)
      .attr('x2', bw * 0.78)
      .attr('y1', (d) => yScore(d.q2))
      .attr('y2', (d) => yScore(d.q2))
      .attr('stroke', vizTheme.text)
      .attr('stroke-width', 2)
      .attr('opacity', 0.85)

    all.select('circle.mean')
      .attr('cx', bw / 2)
      .attr('cy', (d) => yScore(d.mean))
      .attr('r', 4.2)
      .attr('fill', vizTheme.bg)
      .attr('stroke', vizTheme.textMuted)
      .attr('stroke-width', 1.6)

    boxes.exit().remove()
  }

  const defaultRange: [number, number] = [
    Math.max(minWeek, minWeek + 4),
    Math.min(maxWeek, minWeek + 12),
  ]

  function setSelectedRange(range: [number, number]) {
    const [a, b] = range
    selectedText.text(`Selected weeks: ${a}–${b}  (n≈${termRows.filter((r) => r.week >= a && r.week <= b).length} rows)`)
    renderBoxes(computeBoxStats(a, b))
  }

  brush.on('end', (event) => {
    const sel = event.selection as [number, number] | null
    if (!sel) {
      setSelectedRange([minWeek, maxWeek])
      return
    }
    const a = Math.max(minWeek, Math.round(x.invert(sel[0])))
    const b = Math.min(maxWeek, Math.round(x.invert(sel[1])))
    const lo = Math.min(a, b)
    const hi = Math.max(a, b)
    setSelectedRange([lo, Math.max(lo, hi)])
  })

  // Initial selection
  brushG.call(brush.move as any, [x(defaultRange[0]), x(defaultRange[1])])
  setSelectedRange(defaultRange)
}

onMounted(render)
onBeforeUnmount(() => {
  if (!container.value) return
  d3.select(container.value).selectAll('*').remove()
})
</script>

<template>
  <div ref="container" class="viz-frame" />
</template>

