<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import * as d3 from 'd3'
import { vizTheme } from './theme'

const container = ref<HTMLDivElement | null>(null)

const lineData = [
  { term: '2024-T3', week: 1, pass_rate: 0.8823 },
  { term: '2024-T3', week: 2, pass_rate: 0.8828 },
  { term: '2024-T3', week: 3, pass_rate: 0.8749 },
  { term: '2024-T3', week: 4, pass_rate: 0.8897 },
  { term: '2024-T3', week: 5, pass_rate: 0.8778 },
  { term: '2024-T3', week: 6, pass_rate: 0.881 },
  { term: '2024-T3', week: 7, pass_rate: 0.8828 },
  { term: '2024-T3', week: 8, pass_rate: 0.8695 },
  { term: '2024-T3', week: 9, pass_rate: 0.8692 },
  { term: '2024-T3', week: 10, pass_rate: 0.8607 },
  { term: '2024-T3', week: 11, pass_rate: 0.8695 },
  { term: '2024-T3', week: 12, pass_rate: 0.869 },
  { term: '2024-T3', week: 13, pass_rate: 0.8713 },
  { term: '2024-T3', week: 14, pass_rate: 0.8778 },
  { term: '2024-T3', week: 15, pass_rate: 0.8497 },
  { term: '2024-T3', week: 16, pass_rate: 0.8668 },
  { term: '2024-T3', week: 17, pass_rate: 0.8673 },
  { term: '2024-T3', week: 18, pass_rate: 0.8711 },
  { term: '2024-T3', week: 19, pass_rate: 0.8702 },
  { term: '2024-T3', week: 20, pass_rate: 0.8578 },
  { term: '2025-T1', week: 1, pass_rate: 0.8544 },
  { term: '2025-T1', week: 2, pass_rate: 0.8528 },
  { term: '2025-T1', week: 3, pass_rate: 0.8658 },
  { term: '2025-T1', week: 4, pass_rate: 0.8559 },
  { term: '2025-T1', week: 5, pass_rate: 0.8529 },
  { term: '2025-T1', week: 6, pass_rate: 0.8581 },
  { term: '2025-T1', week: 7, pass_rate: 0.8537 },
  { term: '2025-T1', week: 8, pass_rate: 0.8496 },
  { term: '2025-T1', week: 9, pass_rate: 0.8424 },
  { term: '2025-T1', week: 10, pass_rate: 0.835 },
  { term: '2025-T1', week: 11, pass_rate: 0.8416 },
  { term: '2025-T1', week: 12, pass_rate: 0.8404 },
  { term: '2025-T1', week: 13, pass_rate: 0.8488 },
  { term: '2025-T1', week: 14, pass_rate: 0.8476 },
  { term: '2025-T1', week: 15, pass_rate: 0.8328 },
  { term: '2025-T1', week: 16, pass_rate: 0.8363 },
  { term: '2025-T1', week: 17, pass_rate: 0.8416 },
  { term: '2025-T1', week: 18, pass_rate: 0.8211 },
  { term: '2025-T1', week: 19, pass_rate: 0.8191 },
  { term: '2025-T1', week: 20, pass_rate: 0.8146 },
]

const deltaData = [
  { program: 'IT', delta: -0.0649 },
  { program: 'DS', delta: -0.0602 },
  { program: 'IS', delta: -0.0376 },
  { program: 'CS', delta: -0.0289 },
]

function styleAxis(axisGroup: d3.Selection<SVGGElement, unknown, null, undefined>) {
  axisGroup.selectAll('path').attr('stroke', vizTheme.axis).attr('stroke-width', 1)
  axisGroup.selectAll('line').attr('stroke', vizTheme.axis).attr('stroke-width', 1)
  axisGroup.selectAll('text').attr('fill', vizTheme.textMuted).style('font-size', '11px')
}

function render() {
  if (!container.value) return
  d3.select(container.value).selectAll('*').remove()

  const width = 960
  const height = 320
  const padding = 22
  const gap = 22
  const panelWidth = (width - padding * 2 - gap) / 2
  const panelHeight = height - padding * 2

  const svg = d3
    .select(container.value)
    .append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('role', 'img')
    .attr('aria-label', 'D3 examples from the DATA101 class dataset')
    .style('font-family', 'inherit')

  const panels = [
    { title: 'Pass rate by week (CS)', subtitle: 'DATA101 class dataset', x: padding, kind: 'line' },
    { title: 'Change in pass rate by program', subtitle: '2025-T1 minus 2024-T3', x: padding + panelWidth + gap, kind: 'bar' },
  ] as const

  const panel = svg
    .selectAll('g.panel')
    .data(panels)
    .enter()
    .append('g')
    .attr('transform', (d) => `translate(${d.x},${padding})`)

  panel
    .append('rect')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', panelWidth)
    .attr('height', panelHeight)
    .attr('rx', 18)
    .attr('ry', 18)
    .attr('fill', vizTheme.panelFill)
    .attr('stroke', vizTheme.panelStroke)
    .attr('stroke-width', 1.2)

  panel
    .append('text')
    .attr('x', 18)
    .attr('y', 30)
    .attr('fill', vizTheme.text)
    .style('font-size', '15px')
    .style('font-weight', '800')
    .text((d) => d.title)

  panel
    .append('text')
    .attr('x', 18)
    .attr('y', 50)
    .attr('fill', vizTheme.textMuted)
    .style('font-size', '12px')
    .style('font-weight', '600')
    .text((d) => d.subtitle)

  const inner = { left: 46, right: 28, top: 68, bottom: 34 }
  const chartW = panelWidth - inner.left - inner.right
  const chartH = panelHeight - inner.top - inner.bottom

  panel.each(function (panelData) {
    const g = d3.select(this).append('g').attr('transform', `translate(${inner.left},${inner.top})`)

    if (panelData.kind === 'line') {
      const terms = Array.from(new Set(lineData.map((d) => d.term)))
      const x = d3.scaleLinear().domain([1, 20]).range([0, chartW])
      const y = d3.scaleLinear().domain([0.80, 0.90]).range([chartH, 0])
      const line = d3
        .line<(typeof lineData)[number]>()
        .x((d) => x(d.week))
        .y((d) => y(d.pass_rate))
        .curve(d3.curveMonotoneX)

      const yAxis = d3.axisLeft(y).ticks(4).tickSizeOuter(0)
      const xAxis = d3.axisBottom(x).ticks(5).tickSizeOuter(0)

      g.append('g').attr('class', 'axis').call(yAxis).call(styleAxis)
      g.append('g').attr('class', 'axis').attr('transform', `translate(0,${chartH})`).call(xAxis).call(styleAxis)
      g.selectAll('g.tick line')
        .attr('x2', chartW)
        .attr('stroke', vizTheme.grid)
        .attr('opacity', 0.9)

      const color = d3.scaleOrdinal<string, string>().domain(terms).range([vizTheme.primary, vizTheme.cyan])
      for (const term of terms) {
        const series = lineData.filter((d) => d.term === term)
        g.append('path')
          .attr('d', line(series)!)
          .attr('fill', 'none')
          .attr('stroke', color(term))
          .attr('stroke-width', 3)
      }

      const legend = g.append('g').attr('transform', `translate(${chartW - 120},-8)`)
      terms.forEach((term, i) => {
        const row = legend.append('g').attr('transform', `translate(0,${i * 16})`)
        row.append('line').attr('x1', 0).attr('x2', 18).attr('y1', 6).attr('y2', 6).attr('stroke', color(term)).attr('stroke-width', 3)
        row.append('text').attr('x', 24).attr('y', 10).attr('fill', vizTheme.textMuted).style('font-size', '11px').style('font-weight', '700').text(term)
      })

      g.append('text')
        .attr('x', chartW / 2)
        .attr('y', chartH + 28)
        .attr('text-anchor', 'middle')
        .attr('fill', vizTheme.textMuted)
        .style('font-size', '11px')
        .style('font-weight', '600')
        .text('Week')
    }
    else {
      const y = d3.scaleBand<string>().domain(deltaData.map((d) => d.program)).range([0, chartH]).padding(0.35)
      const x = d3.scaleLinear().domain([-0.08, 0.02]).range([0, chartW])

      const xAxis = d3.axisBottom(x).ticks(4).tickSizeOuter(0).tickFormat((d) => `${(Number(d) * 100).toFixed(0)}%`)
      const yAxis = d3.axisLeft(y).tickSizeOuter(0)

      g.append('g').attr('class', 'axis').call(yAxis).call(styleAxis)
      g.append('g').attr('class', 'axis').attr('transform', `translate(0,${chartH})`).call(xAxis).call(styleAxis)

      g.selectAll('g.tick line')
        .attr('x2', chartW)
        .attr('stroke', vizTheme.grid)
        .attr('opacity', 0.9)

      g.append('line')
        .attr('x1', x(0))
        .attr('x2', x(0))
        .attr('y1', 0)
        .attr('y2', chartH)
        .attr('stroke', 'rgba(255,255,255,0.2)')
        .attr('stroke-width', 1.2)

      g.selectAll('rect.bar')
        .data(deltaData)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', (d) => x(Math.min(0, d.delta)))
        .attr('y', (d) => y(d.program)!)
        .attr('width', (d) => Math.abs(x(d.delta) - x(0)))
        .attr('height', y.bandwidth())
        .attr('rx', 10)
        .attr('fill', (d) => (d.delta < 0 ? vizTheme.redSoft : vizTheme.cyan))
        .attr('opacity', 0.85)

      g.selectAll('text.val')
        .data(deltaData)
        .enter()
        .append('text')
        .attr('class', 'val')
        .attr('x', (d) => x(d.delta) + (d.delta < 0 ? -6 : 6))
        .attr('y', (d) => y(d.program)! + y.bandwidth() / 2 + 4)
        .attr('text-anchor', (d) => (d.delta < 0 ? 'end' : 'start'))
        .attr('fill', vizTheme.text)
        .style('font-size', '11px')
        .style('font-weight', '700')
        .text((d) => `${(d.delta * 100).toFixed(1)}%`)

      g.append('text')
        .attr('x', chartW / 2)
        .attr('y', chartH + 28)
        .attr('text-anchor', 'middle')
        .attr('fill', vizTheme.textMuted)
        .style('font-size', '11px')
        .style('font-weight', '600')
        .text('Δ pass_rate')
    }
  })
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
