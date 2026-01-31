<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import * as d3 from 'd3'
import { vizTheme } from './theme'

const container = ref<HTMLDivElement | null>(null)

const termLabel = '2025-T1'
const bins = [73.84, 76.02, 78.2, 80.38, 82.56, 84.74, 86.92, 89.1, 91.28, 93.46, 95.64, 97.82, 100.0]
const countsByProgram = {
  CS: [0, 0, 0, 1, 5, 13, 38, 78, 154, 263, 352, 896],
  DS: [1, 0, 3, 11, 26, 69, 117, 182, 255, 285, 264, 587],
  IS: [0, 0, 0, 3, 8, 27, 67, 134, 204, 254, 278, 825],
  IT: [1, 4, 4, 13, 24, 74, 126, 214, 251, 289, 267, 533],
} as const

const programs = Object.keys(countsByProgram) as Array<keyof typeof countsByProgram>

function styleAxis(axisGroup: d3.Selection<SVGGElement, unknown, null, undefined>) {
  axisGroup.selectAll('path').attr('stroke', vizTheme.axis).attr('stroke-width', 1)
  axisGroup.selectAll('line').attr('stroke', vizTheme.axis).attr('stroke-width', 1)
  axisGroup.selectAll('text').attr('fill', vizTheme.textMuted).style('font-size', '10.5px')
}

function render() {
  if (!container.value) return
  d3.select(container.value).selectAll('*').remove()

  const width = 960
  const height = 320
  const padding = 22
  const gap = 20
  const cols = 2
  const rows = 2
  const panelWidth = (width - padding * 2 - gap * (cols - 1)) / cols
  const panelHeight = (height - padding * 2 - gap * (rows - 1)) / rows

  const svg = d3
    .select(container.value)
    .append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('role', 'img')
    .attr('aria-label', 'Distribution of average scores by program (DATA101 class dataset)')
    .style('font-family', 'inherit')

  const panels = programs.map((program, i) => ({
    program,
    x: padding + (i % cols) * (panelWidth + gap),
    y: padding + Math.floor(i / cols) * (panelHeight + gap),
  }))

  const panel = svg
    .selectAll('g.panel')
    .data(panels)
    .enter()
    .append('g')
    .attr('transform', (d) => `translate(${d.x},${d.y})`)

  panel
    .append('rect')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', panelWidth)
    .attr('height', panelHeight)
    .attr('rx', 16)
    .attr('ry', 16)
    .attr('fill', vizTheme.panelFill)
    .attr('stroke', vizTheme.panelStroke)
    .attr('stroke-width', 1.1)

  const inner = { left: 40, right: 18, top: 36, bottom: 26 }
  const chartW = panelWidth - inner.left - inner.right
  const chartH = panelHeight - inner.top - inner.bottom

  const x = d3.scaleLinear().domain([bins[0], bins[bins.length - 1]]).range([0, chartW])
  const maxCount = Math.max(...programs.flatMap((p) => countsByProgram[p]))
  const y = d3.scaleLinear().domain([0, maxCount]).nice().range([chartH, 0])

  panel.each(function (panelData) {
    const g = d3.select(this).append('g').attr('transform', `translate(${inner.left},${inner.top})`)
    const counts = countsByProgram[panelData.program]

    const xAxis = d3.axisBottom(x).ticks(4).tickSizeOuter(0)
    const yAxis = d3.axisLeft(y).ticks(3).tickSizeOuter(0)

    g.append('g').attr('class', 'axis').call(yAxis).call(styleAxis)
    g.append('g').attr('class', 'axis').attr('transform', `translate(0,${chartH})`).call(xAxis).call(styleAxis)

    g.selectAll('g.tick line')
      .attr('x2', chartW)
      .attr('stroke', vizTheme.grid)
      .attr('opacity', 0.75)

    const barW = chartW / (bins.length - 1)
    g.selectAll('rect.bar')
      .data(counts)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (_, i) => i * barW + 1)
      .attr('y', (d) => y(d))
      .attr('width', barW - 2)
      .attr('height', (d) => chartH - y(d))
      .attr('fill', vizTheme.cyan)
      .attr('opacity', 0.85)

    g.append('text')
      .attr('x', 0)
      .attr('y', -10)
      .attr('fill', vizTheme.text)
      .style('font-size', '12px')
      .style('font-weight', '800')
      .text(panelData.program)
  })

  svg.append('text')
    .attr('x', padding + 8)
    .attr('y', padding - 6)
    .attr('fill', vizTheme.textMuted)
    .style('font-size', '12px')
    .style('font-weight', '650')
    .text(`Avg score distribution by program (${termLabel})`)
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
