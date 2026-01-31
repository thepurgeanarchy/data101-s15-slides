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

function render() {
  if (!container.value) return
  d3.select(container.value).selectAll('*').remove()

  const rows = getRows().filter((r) => Number.isFinite(r.week) && Number.isFinite(r.n_students) && r.n_students > 0)
  const terms = Array.from(new Set(rows.map((r) => r.term))).sort()
  const term = terms.at(-1) ?? 'unknown'
  const termRows = rows.filter((r) => r.term === term)

  const programs = Array.from(new Set(termRows.map((r) => r.program))).sort()
  const program = programs[0] ?? 'CS'

  const data = d3
    .rollups(
      termRows.filter((r) => r.program === program),
      (v) => ({
        n_pass: d3.sum(v, (d) => d.n_pass),
        n_students: d3.sum(v, (d) => d.n_students),
      }),
      (d) => d.week,
    )
    .map(([week, agg]) => ({ week, pass_rate: agg.n_students > 0 ? agg.n_pass / agg.n_students : NaN }))
    .filter((d) => Number.isFinite(d.pass_rate))
    .sort((a, b) => a.week - b.week)

  const width = 720
  const height = 320
  const margin = { top: 40, right: 20, bottom: 44, left: 58 }
  const plotW = width - margin.left - margin.right
  const plotH = height - margin.top - margin.bottom

  const [minWeek, maxWeek] = d3.extent(data, (d) => d.week) as [number, number]
  const passExtent = d3.extent(data, (d) => d.pass_rate) as [number, number]
  const yMin = Math.max(0, (passExtent[0] ?? 0.6) - 0.06)
  const yMax = Math.min(1, (passExtent[1] ?? 0.9) + 0.06)

  const x0 = d3.scaleLinear().domain([minWeek, maxWeek]).range([0, plotW])
  const y = d3.scaleLinear().domain([yMin, yMax]).nice().range([plotH, 0])

  const svg = d3
    .select(container.value)
    .append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('role', 'img')
    .attr('aria-label', 'Interactive line chart with tooltip and zoom')
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

  svg
    .append('text')
    .attr('x', margin.left)
    .attr('y', 24)
    .attr('fill', vizTheme.text)
    .style('font-size', '16px')
    .style('font-weight', '850')
    .text(`Interactive line (real data)`)

  svg
    .append('text')
    .attr('x', width - margin.right)
    .attr('y', 24)
    .attr('text-anchor', 'end')
    .attr('fill', vizTheme.textMuted)
    .style('font-size', '11px')
    .style('font-weight', '650')
    .text('Scroll to zoom · drag to pan')

  const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

  const axisStyle = (sel: d3.Selection<SVGGElement, unknown, null, undefined>) => {
    sel.selectAll('path').attr('stroke', vizTheme.axis).attr('stroke-width', 1.2)
    sel.selectAll('line').attr('stroke', vizTheme.axis).attr('stroke-width', 1.2)
    sel.selectAll('text').attr('fill', vizTheme.textMuted).style('font-size', '12px').style('font-weight', '650')
  }

  // Gridlines
  g.append('g')
    .selectAll('line')
    .data(y.ticks(4))
    .enter()
    .append('line')
    .attr('x1', 0)
    .attr('x2', plotW)
    .attr('y1', (t) => y(t))
    .attr('y2', (t) => y(t))
    .attr('stroke', vizTheme.grid)
    .attr('stroke-width', 1)

  const xAxisG = g.append('g').attr('transform', `translate(0,${plotH})`)
  const yAxisG = g.append('g')

  let x = x0

  const xAxis = (scale: d3.ScaleLinear<number, number>) => d3.axisBottom(scale).ticks(10).tickFormat(d3.format('d'))
  const yAxis = d3.axisLeft(y).ticks(4).tickFormat(d3.format('.2f'))

  xAxisG.call(xAxis(x))
  yAxisG.call(yAxis)
  axisStyle(xAxisG)
  axisStyle(yAxisG)

  // Clip path so zoomed marks don't draw into margins.
  const clipId = `clip-${Math.random().toString(36).slice(2, 10)}`
  svg
    .append('defs')
    .append('clipPath')
    .attr('id', clipId)
    .append('rect')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', plotW)
    .attr('height', plotH)

  const plot = g.append('g').attr('clip-path', `url(#${clipId})`)

  const line = d3
    .line<(typeof data)[number]>()
    .x((d) => x(d.week))
    .y((d) => y(d.pass_rate))
    .curve(d3.curveMonotoneX)

  const linePath = plot
    .append('path')
    .attr('fill', 'none')
    .attr('stroke', vizTheme.primary)
    .attr('stroke-width', 3)
    .attr('stroke-linecap', 'round')
    .attr('stroke-linejoin', 'round')
    .attr('d', line(data) || '')

  const points = plot
    .append('g')
    .selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('cx', (d) => x(d.week))
    .attr('cy', (d) => y(d.pass_rate))
    .attr('r', 5.8)
    .attr('fill', vizTheme.bg)
    .attr('stroke', vizTheme.seqEnd)
    .attr('stroke-width', 2.4)

  // Tooltip + focus
  const focus = plot.append('g').style('opacity', 0)
  const focusLine = focus
    .append('line')
    .attr('y1', 0)
    .attr('y2', plotH)
    .attr('stroke', 'rgba(34,211,238,0.55)')
    .attr('stroke-width', 1.8)
    .attr('stroke-dasharray', '5 5')

  const focusDot = focus
    .append('circle')
    .attr('r', 7.5)
    .attr('fill', vizTheme.bg)
    .attr('stroke', vizTheme.cyan)
    .attr('stroke-width', 2.4)

  const tip = focus.append('g')
  const tipBox = { w: 168, h: 52, rx: 14 } as const
  const tipBg = tip
    .append('rect')
    .attr('width', tipBox.w)
    .attr('height', tipBox.h)
    .attr('rx', tipBox.rx)
    .attr('ry', tipBox.rx)
    .attr('fill', 'rgba(11, 18, 32, 0.92)')
    .attr('stroke', 'rgba(255,255,255,0.18)')
    .attr('stroke-width', 1)

  const tipWeek = tip
    .append('text')
    .attr('x', 12)
    .attr('y', 20)
    .attr('fill', vizTheme.textMuted)
    .style('font-size', '12px')
    .style('font-weight', '700')

  const tipValue = tip
    .append('text')
    .attr('x', 12)
    .attr('y', 38)
    .attr('fill', vizTheme.text)
    .style('font-size', '13px')
    .style('font-weight', '850')

  const bisectWeek = d3.bisector<(typeof data)[number], number>((d) => d.week).center
  let lastHoveredWeek = data[0]?.week ?? minWeek

  function updateFocus(weekValue: number) {
    const week = Math.max(minWeek, Math.min(maxWeek, weekValue))
    const i = bisectWeek(data, week)
    const d = data[Math.max(0, Math.min(data.length - 1, i))]
    if (!d) return
    lastHoveredWeek = d.week

    const px = x(d.week)
    const py = y(d.pass_rate)

    focus.style('opacity', 1)
    focusLine.attr('x1', px).attr('x2', px)
    focusDot.attr('cx', px).attr('cy', py)

    const placeLeft = px > plotW * 0.62
    const tx = placeLeft ? px - tipBox.w - 10 : px + 10
    const ty = Math.max(6, Math.min(plotH - tipBox.h - 6, py - tipBox.h / 2))
    tip.attr('transform', `translate(${tx},${ty})`)

    tipWeek.text(`week ${d.week}`)
    tipValue.text(`pass_rate: ${d3.format('.2f')(d.pass_rate)}`)

    tipBg.attr('stroke', `rgba(148, 163, 184, 0.35)`)
  }

  function hideFocus() {
    focus.style('opacity', 0)
  }

  const overlay = g
    .append('rect')
    .attr('class', 'overlay')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', plotW)
    .attr('height', plotH)
    .attr('fill', 'transparent')
    .style('cursor', 'crosshair')
    .on('pointerenter', () => updateFocus(lastHoveredWeek))
    .on('pointermove', (event) => {
      const [px] = d3.pointer(event)
      updateFocus(x.invert(px))
    })
    .on('pointerleave', hideFocus)

  function redraw() {
    line.x((d) => x(d.week))
    linePath.attr('d', line(data) || '')
    points.attr('cx', (d) => x(d.week)).attr('cy', (d) => y(d.pass_rate))
    xAxisG.call(xAxis(x))
    axisStyle(xAxisG)
    if (Number.isFinite(lastHoveredWeek)) updateFocus(lastHoveredWeek)
  }

  const zoom = d3
    .zoom<SVGRectElement, unknown>()
    .scaleExtent([1, 8])
    .translateExtent([
      [0, 0],
      [plotW, plotH],
    ])
    .extent([
      [0, 0],
      [plotW, plotH],
    ])
    .on('zoom', (event) => {
      x = event.transform.rescaleX(x0)
      redraw()
    })

  overlay.call(zoom as any)

  // Footer label
  svg
    .append('text')
    .attr('x', margin.left)
    .attr('y', height - 10)
    .attr('fill', vizTheme.textMuted)
    .style('font-size', '11px')
    .style('font-weight', '600')
    .text(`Data: ${term} · ${program} (aggregated)`)
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

