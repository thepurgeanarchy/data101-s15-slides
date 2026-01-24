<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import * as d3 from 'd3'
import { vizTheme } from './theme'

const container = ref<HTMLDivElement | null>(null)
const uid = Math.random().toString(36).slice(2, 10)

function drawAxis(axisGroup: d3.Selection<SVGGElement, unknown, null, undefined>) {
  axisGroup.selectAll('path').attr('stroke', vizTheme.axis).attr('stroke-width', 1)
  axisGroup.selectAll('line').attr('stroke', vizTheme.axis).attr('stroke-width', 1)
  axisGroup.selectAll('text').attr('fill', vizTheme.textMuted).attr('font-size', 12)
}

function render() {
  if (!container.value) return
  d3.select(container.value).selectAll('*').remove()

  const width = 960
  const height = 260
  const padding = 26

  const svg = d3
    .select(container.value)
    .append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('role', 'img')
    .attr('aria-label', 'Diverging color scale centered at a baseline with an example heatmap')
    .style('font-family', 'inherit')

  const divInterpolator = d3.interpolateRgbBasis([vizTheme.orange, vizTheme.neutral, vizTheme.primary])

  svg
    .append('text')
    .attr('x', padding)
    .attr('y', 34)
    .attr('fill', vizTheme.text)
    .attr('font-size', 16)
    .attr('font-weight', 700)
    .text('Centered midpoint (baseline = 0)')

  const rampX = padding
  const rampY = 52
  const rampW = width - padding * 2
  const rampH = 34

  const defs = svg.append('defs')
  const clipId = `div-clip-${uid}`
  defs
    .append('clipPath')
    .attr('id', clipId)
    .attr('clipPathUnits', 'userSpaceOnUse')
    .append('rect')
    .attr('x', rampX)
    .attr('y', rampY)
    .attr('width', rampW)
    .attr('height', rampH)
    .attr('rx', 16)
    .attr('ry', 16)

  const steps = 18
  const stepW = rampW / steps
  svg
    .append('g')
    .attr('clip-path', `url(#${clipId})`)
    .selectAll('rect.step')
    .data(d3.range(steps))
    .enter()
    .append('rect')
    .attr('class', 'step')
    .attr('x', (i) => rampX + i * stepW)
    .attr('y', rampY)
    .attr('width', Math.ceil(stepW) + 0.5)
    .attr('height', rampH)
    .attr('fill', (i) => divInterpolator((i + 0.5) / steps))

  svg
    .append('rect')
    .attr('x', rampX)
    .attr('y', rampY)
    .attr('width', rampW)
    .attr('height', rampH)
    .attr('rx', 16)
    .attr('ry', 16)
    .attr('fill', 'transparent')
    .attr('stroke', 'rgba(255,255,255,0.14)')
    .attr('stroke-width', 1)

  const scale = d3.scaleLinear().domain([-1, 1]).range([rampX, rampX + rampW])
  const axis = d3.axisBottom(scale).tickValues([-1, -0.5, 0, 0.5, 1]).tickSizeOuter(0)
  const axisG = svg.append('g').attr('class', 'axis').attr('transform', `translate(0,${rampY + rampH + 22})`).call(axis)
  drawAxis(axisG)

  svg
    .append('text')
    .attr('x', padding)
    .attr('y', 148)
    .attr('fill', vizTheme.textMuted)
    .attr('font-size', 12)
    .attr('font-weight', 600)
    .text('Example: negative vs positive differences around the baseline')

  const rows = 4
  const cols = 28
  const heatmapX = padding
  const heatmapY = 162
  const heatmapW = width - padding * 2
  const heatmapH = 72
  const cellW = heatmapW / cols
  const cellH = heatmapH / rows

  const values: number[] = []
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c / (cols - 1)
      const y = r / (rows - 1)
      const v = Math.sin(x * Math.PI * 2) * 0.7 + Math.cos(y * Math.PI) * 0.3
      values.push(Math.max(-1, Math.min(1, v)))
    }
  }

  const color = d3.scaleDiverging(divInterpolator).domain([-1, 0, 1])

  const grid = svg.append('g').attr('transform', `translate(${heatmapX},${heatmapY})`)
  grid
    .selectAll('rect.cell')
    .data(values)
    .enter()
    .append('rect')
    .attr('class', 'cell')
    .attr('x', (_, i) => (i % cols) * cellW)
    .attr('y', (_, i) => Math.floor(i / cols) * cellH)
    .attr('width', cellW)
    .attr('height', cellH)
    .attr('rx', 6)
    .attr('ry', 6)
    .attr('fill', (d) => color(d))
    .attr('stroke', 'rgba(255,255,255,0.06)')
    .attr('stroke-width', 1)
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
