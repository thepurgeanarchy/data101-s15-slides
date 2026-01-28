<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import * as d3 from 'd3'
import { vizTheme } from './theme'

const container = ref<HTMLDivElement | null>(null)

function styleAxis(axisGroup: d3.Selection<SVGGElement, unknown, null, undefined>) {
  axisGroup.selectAll('path').attr('stroke', vizTheme.axis).attr('stroke-width', 1)
  axisGroup.selectAll('line').attr('stroke', vizTheme.axis).attr('stroke-width', 1)
  // Use inline styles so theme/global CSS can’t accidentally override SVG text sizing.
  axisGroup.selectAll('text').attr('fill', vizTheme.textMuted).style('font-size', '10.5px')
}

function render() {
  if (!container.value) return
  d3.select(container.value).selectAll('*').remove()

  const width = 960
  const height = 280
  const padding = 22
  const gap = 22
  const panelWidth = (width - padding * 2 - gap) / 2
  const panelHeight = height - padding * 2

  const svg = d3
    .select(container.value)
    .append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('role', 'img')
    .attr('aria-label', 'Dual-axis chart illusion with two different right-axis scalings')
    .style('font-family', 'inherit')

  const seriesA = [
    102, 105, 110, 108, 115, 120, 123, 127, 131, 138, 142, 150,
  ].map((v, i) => ({ t: i + 1, v }))

  const seriesB = [
    34, 33, 36, 35, 34, 38, 37, 41, 39, 42, 40, 45,
  ].map((v, i) => ({ t: i + 1, v }))

  const panels = [
    { title: 'Right axis squeezed', subtitle: 'Looks “correlated”', x: padding, rightDomain: [30, 46] },
    { title: 'Right axis expanded', subtitle: 'Looks “uncorrelated”', x: padding + panelWidth + gap, rightDomain: [0, 90] },
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

  const inner = { left: 44, right: 44, top: 66, bottom: 34 }
  const chartW = panelWidth - inner.left - inner.right
  const chartH = panelHeight - inner.top - inner.bottom

  const x = d3.scaleLinear().domain([1, 12]).range([0, chartW])
  const yLeft = d3.scaleLinear().domain([95, 155]).range([chartH, 0])

  const lineA = d3
    .line<{ t: number; v: number }>()
    .x((d) => x(d.t))
    .y((d) => yLeft(d.v))
    .curve(d3.curveMonotoneX)

  panel.each(function (panelData) {
    const g = d3.select(this).append('g').attr('transform', `translate(${inner.left},${inner.top})`)
    const yRight = d3.scaleLinear().domain(panelData.rightDomain).range([chartH, 0])

    const lineB = d3
      .line<{ t: number; v: number }>()
      .x((d) => x(d.t))
      .y((d) => yRight(d.v))
      .curve(d3.curveMonotoneX)

    const xAxis = d3.axisBottom(x).ticks(6).tickSizeOuter(0)
    const yAxisLeft = d3.axisLeft(yLeft).ticks(4).tickSizeOuter(0)
    const yAxisRight = d3.axisRight(yRight).ticks(4).tickSizeOuter(0)

    const yG = g.append('g').attr('class', 'axis').call(yAxisLeft)
    styleAxis(yG)
    const yrG = g.append('g').attr('class', 'axis').attr('transform', `translate(${chartW},0)`).call(yAxisRight)
    styleAxis(yrG)
    const xG = g.append('g').attr('class', 'axis').attr('transform', `translate(0,${chartH})`).call(xAxis)
    styleAxis(xG)

    yG.selectAll('g.tick line').attr('x2', chartW).attr('stroke', vizTheme.grid).attr('opacity', 0.9)

    g.append('path').attr('d', lineA(seriesA)!).attr('fill', 'none').attr('stroke', vizTheme.primary).attr('stroke-width', 3)
    g.append('path').attr('d', lineB(seriesB)!).attr('fill', 'none').attr('stroke', vizTheme.orange).attr('stroke-width', 3).attr('opacity', 0.95)

    g.append('text')
      .attr('x', 0)
      .attr('y', -10)
      .attr('fill', vizTheme.textMuted)
      .style('font-size', '11px')
      .style('font-weight', '700')
      .text('A (left axis)')

    g.append('text')
      .attr('x', chartW)
      .attr('y', -10)
      .attr('fill', vizTheme.textMuted)
      .style('font-size', '11px')
      .style('font-weight', '700')
      .attr('text-anchor', 'end')
      .text('B (right axis)')
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
