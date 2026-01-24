<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import * as d3 from 'd3'
import { vizTheme } from './theme'

const container = ref<HTMLDivElement | null>(null)
const uid = Math.random().toString(36).slice(2, 10)

function render() {
  if (!container.value) return
  d3.select(container.value).selectAll('*').remove()

  const width = 960
  const height = 230
  const padding = 22
  const gap = 22
  const panelWidth = (width - padding * 2 - gap) / 2
  const panelHeight = height - padding * 2

  const svg = d3
    .select(container.value)
    .append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('role', 'img')
    .attr('aria-label', 'Same data shown with a rainbow color scale and a perceptual color scale')
    .style('font-family', 'inherit')

  const panels = [
    { title: 'Rainbow-like', subtitle: 'Creates false boundaries', x: padding, interpolator: d3.interpolateTurbo },
    { title: 'Perceptual', subtitle: 'Order visible in lightness', x: padding + panelWidth + gap, interpolator: d3.interpolateViridis },
  ] as const

  const rows = 8
  const cols = 28
  const gridTop = 56
  const legendH = 16
  const legendGap = 14
  const gridH = panelHeight - gridTop - legendGap - legendH - 8

  const values: number[] = []
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c / (cols - 1)
      const y = r / (rows - 1)
      const v = 0.55 * Math.sin(x * Math.PI * 2) + 0.35 * Math.cos(y * Math.PI * 2) + 0.1 * Math.sin((x + y) * Math.PI * 4)
      values.push((v + 1) / 2)
    }
  }

  const cellW = panelWidth / cols
  const cellH = gridH / rows

  const panel = svg
    .selectAll('g.panel')
    .data(panels)
    .enter()
    .append('g')
    .attr('class', 'panel')
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
    .attr('font-size', 16)
    .attr('font-weight', 800)
    .text((d) => d.title)

  panel
    .append('text')
    .attr('x', 18)
    .attr('y', 50)
    .attr('fill', vizTheme.textMuted)
    .attr('font-size', 12)
    .attr('font-weight', 600)
    .text((d) => d.subtitle)

  panel.each(function (panelData) {
    const group = d3.select(this)
    const color = d3.scaleSequential(panelData.interpolator).domain([0, 1])

    group
      .append('g')
      .attr('transform', `translate(0,${gridTop})`)
      .selectAll('rect.cell')
      .data(values)
      .enter()
      .append('rect')
      .attr('class', 'cell')
      .attr('x', (_, i) => (i % cols) * cellW)
      .attr('y', (_, i) => Math.floor(i / cols) * cellH)
      .attr('width', cellW)
      .attr('height', cellH)
      .attr('rx', 5)
      .attr('ry', 5)
      .attr('fill', (d) => color(d))
      .attr('stroke', 'rgba(255,255,255,0.05)')
      .attr('stroke-width', 1)

    const legendY = gridTop + gridH + legendGap
    const legendX = 18
    const legendW = panelWidth - 36
    const legendSteps = 16
    const legendStepW = legendW / legendSteps
    const legendClipId = `legend-${panelData.title.replace(/\W+/g, '').toLowerCase()}-${uid}`

    group
      .append('defs')
      .append('clipPath')
      .attr('id', legendClipId)
      .attr('clipPathUnits', 'userSpaceOnUse')
      .append('rect')
      .attr('x', legendX)
      .attr('y', legendY)
      .attr('width', legendW)
      .attr('height', legendH)
      .attr('rx', 10)
      .attr('ry', 10)

    group
      .append('g')
      .attr('clip-path', `url(#${legendClipId})`)
      .selectAll('rect.legend-step')
      .data(d3.range(legendSteps))
      .enter()
      .append('rect')
      .attr('class', 'legend-step')
      .attr('x', (i) => legendX + i * legendStepW)
      .attr('y', legendY)
      .attr('width', Math.ceil(legendStepW) + 0.5)
      .attr('height', legendH)
      .attr('fill', (i) => color((i + 0.5) / legendSteps))

    group
      .append('rect')
      .attr('x', legendX)
      .attr('y', legendY)
      .attr('width', legendW)
      .attr('height', legendH)
      .attr('rx', 10)
      .attr('ry', 10)
      .attr('fill', 'transparent')
      .attr('stroke', 'rgba(255,255,255,0.14)')
      .attr('stroke-width', 1)

    group
      .append('text')
      .attr('x', 18)
      .attr('y', legendY + legendH + 14)
      .attr('fill', vizTheme.textMuted)
      .attr('font-size', 11)
      .text('Low')

    group
      .append('text')
      .attr('x', panelWidth - 18)
      .attr('y', legendY + legendH + 14)
      .attr('fill', vizTheme.textMuted)
      .attr('font-size', 11)
      .attr('text-anchor', 'end')
      .text('High')
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
