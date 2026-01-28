<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import * as d3 from 'd3'
import { vizTheme } from './theme'

const container = ref<HTMLDivElement | null>(null)

function styleAxis(axisGroup: d3.Selection<SVGGElement, unknown, null, undefined>) {
  axisGroup.selectAll('path').attr('stroke', vizTheme.axis).attr('stroke-width', 1)
  axisGroup.selectAll('line').attr('stroke', vizTheme.axis).attr('stroke-width', 1)
  // Use inline styles so theme/global CSS can’t accidentally override SVG text sizing.
  axisGroup.selectAll('text').attr('fill', vizTheme.textMuted).style('font-size', '11px')
}

function render() {
  if (!container.value) return
  d3.select(container.value).selectAll('*').remove()

  const width = 960
  const height = 250
  const padding = 22
  const gap = 22
  const panelWidth = (width - padding * 2 - gap) / 2
  const panelHeight = height - padding * 2

  const svg = d3
    .select(container.value)
    .append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('role', 'img')
    .attr('aria-label', 'Bar chart with baseline at zero compared to a dot plot with a zoomed axis')
    .style('font-family', 'inherit')

  const data = [
    { label: 'Group A', value: 96 },
    { label: 'Group B', value: 100 },
  ]

  const panels = [
    { title: 'Bar chart (baseline = 0)', subtitle: 'Honest magnitude', x: padding, kind: 'bar' },
    { title: 'Dot plot (zoomed axis)', subtitle: 'OK to zoom for differences', x: padding + panelWidth + gap, kind: 'dot' },
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

  const inner = { left: 44, right: 24, top: 62, bottom: 30 }
  const chartW = panelWidth - inner.left - inner.right
  const chartH = panelHeight - inner.top - inner.bottom

  panel.each(function (panelData) {
    const g = d3.select(this).append('g').attr('transform', `translate(${inner.left},${inner.top})`)

    const x = d3.scaleBand<string>().domain(data.map((d) => d.label)).range([0, chartW]).padding(0.35)
    const xAxis = d3.axisBottom(x).tickSizeOuter(0)

    const yDomain = panelData.kind === 'bar' ? [0, 100] : [94, 101]
    const y = d3.scaleLinear().domain(yDomain).nice().range([chartH, 0])
    const yAxis = d3.axisLeft(y).ticks(4).tickSizeOuter(0)

    g.append('g').attr('class', 'axis').call(yAxis).call(styleAxis)
    g.append('g').attr('class', 'axis').attr('transform', `translate(0,${chartH})`).call(xAxis).call(styleAxis)

    g.selectAll('g.tick line')
      .attr('x2', chartW)
      .attr('stroke', vizTheme.grid)
      .attr('stroke-width', 1)
      .attr('opacity', 0.9)

    if (panelData.kind === 'bar') {
      g.selectAll('rect.bar')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', (d) => x(d.label)!)
        .attr('y', (d) => y(d.value))
        .attr('width', x.bandwidth())
        .attr('height', (d) => y(0) - y(d.value))
        .attr('rx', 10)
        .attr('fill', vizTheme.primary)
        .attr('opacity', 0.9)
    }
    else {
      g.selectAll('line.stem')
        .data(data)
        .enter()
        .append('line')
        .attr('class', 'stem')
        .attr('x1', (d) => x(d.label)! + x.bandwidth() / 2)
        .attr('x2', (d) => x(d.label)! + x.bandwidth() / 2)
        .attr('y1', chartH)
        .attr('y2', (d) => y(d.value))
        .attr('stroke', 'rgba(255,255,255,0.10)')
        .attr('stroke-width', 2)

      g.selectAll('circle.dot')
        .data(data)
        .enter()
        .append('circle')
        .attr('class', 'dot')
        .attr('cx', (d) => x(d.label)! + x.bandwidth() / 2)
        .attr('cy', (d) => y(d.value))
        .attr('r', 7)
        .attr('fill', vizTheme.cyan)
        .attr('stroke', 'rgba(255,255,255,0.16)')
        .attr('stroke-width', 1)
    }

    g.selectAll('text.value')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'value')
      .attr('x', (d) => x(d.label)! + x.bandwidth() / 2)
      .attr('y', (d) => y(d.value) - 10)
      .attr('text-anchor', 'middle')
      .attr('fill', vizTheme.text)
      .style('font-size', '12px')
      .style('font-weight', '700')
      .text((d) => d.value.toFixed(0))
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
