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
  const height = 260
  const padding = 22
  const gap = 22
  const panelWidth = (width - padding * 2 - gap) / 2
  const panelHeight = height - padding * 2

  const svg = d3
    .select(container.value)
    .append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('role', 'img')
    .attr('aria-label', 'Area encoding compared to length encoding')
    .style('font-family', 'inherit')

  const data = [
    { label: 'A', value: 10 },
    { label: 'B', value: 20 },
    { label: 'C', value: 40 },
  ]

  const panels = [
    { title: 'Bubbles (area)', subtitle: 'Hard to compare precisely', x: padding, kind: 'bubble' },
    { title: 'Bars (length)', subtitle: 'Aligned comparisons', x: padding + panelWidth + gap, kind: 'bar' },
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

  const inner = { left: 48, right: 24, top: 66, bottom: 34 }
  const chartW = panelWidth - inner.left - inner.right
  const chartH = panelHeight - inner.top - inner.bottom

  panel.each(function (panelData) {
    const g = d3.select(this).append('g').attr('transform', `translate(${inner.left},${inner.top})`)

    if (panelData.kind === 'bubble') {
      const r = d3.scaleSqrt<number, number>().domain([0, d3.max(data, (d) => d.value)!]).range([0, 42])
      const x = d3.scalePoint<string>().domain(data.map((d) => d.label)).range([0, chartW]).padding(0.6)
      const y = chartH / 2

      g.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', (d) => x(d.label)!)
        .attr('cy', y)
        .attr('r', (d) => r(d.value))
        .attr('fill', vizTheme.primary)
        .attr('opacity', 0.35)
        .attr('stroke', 'rgba(255,255,255,0.16)')
        .attr('stroke-width', 1.2)

      g.selectAll('text.lbl')
        .data(data)
        .enter()
        .append('text')
        .attr('class', 'lbl')
        .attr('x', (d) => x(d.label)!)
        .attr('y', y + 64)
        .attr('text-anchor', 'middle')
        .attr('fill', vizTheme.textMuted)
        .style('font-size', '12px')
        .text((d) => `${d.label}: ${d.value}`)
    }
    else {
      const y = d3.scaleBand<string>().domain(data.map((d) => d.label)).range([0, chartH]).padding(0.35)
      const x = d3.scaleLinear().domain([0, 40]).range([0, chartW])
      const xAxis = d3.axisBottom(x).ticks(4).tickSizeOuter(0)
      const yAxis = d3.axisLeft(y).tickSizeOuter(0)

      const xG = g.append('g').attr('class', 'axis').attr('transform', `translate(0,${chartH})`).call(xAxis)
      styleAxis(xG)
      const yG = g.append('g').attr('class', 'axis').call(yAxis)
      styleAxis(yG)

      g.selectAll('rect.bar')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', 0)
        .attr('y', (d) => y(d.label)!)
        .attr('width', (d) => x(d.value))
        .attr('height', y.bandwidth())
        .attr('rx', 10)
        .attr('fill', vizTheme.cyan)
        .attr('opacity', 0.85)

      g.selectAll('text.val')
        .data(data)
        .enter()
        .append('text')
        .attr('class', 'val')
        .attr('x', (d) => x(d.value) + 8)
        .attr('y', (d) => y(d.label)! + y.bandwidth() / 2 + 4)
        .attr('fill', vizTheme.text)
        .style('font-size', '12px')
        .style('font-weight', '700')
        .text((d) => d.value)
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
