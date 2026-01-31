<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import * as d3 from 'd3'
import { okabeIto, vizTheme } from './theme'

const container = ref<HTMLDivElement | null>(null)
const uid = Math.random().toString(36).slice(2, 10)

function drawAxis(axisGroup: d3.Selection<SVGGElement, unknown, null, undefined>) {
  axisGroup.selectAll('path').attr('stroke', vizTheme.axis).attr('stroke-width', 1)
  axisGroup.selectAll('line').attr('stroke', vizTheme.axis).attr('stroke-width', 1)
  // Use inline styles so theme/global CSS can’t accidentally override SVG text sizing.
  axisGroup.selectAll('text').attr('fill', vizTheme.textMuted).style('font-size', '12px')
}

function render() {
  if (!container.value) return
  d3.select(container.value).selectAll('*').remove()

  const width = 960
  const height = 260
  const padding = 26
  const gap = 22
  const panelWidth = (width - padding * 2 - gap * 2) / 3
  const panelHeight = height - padding * 2

  const svg = d3
    .select(container.value)
    .append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('role', 'img')
    .attr('aria-label', 'Examples of qualitative, sequential, and diverging color palettes')
    .style('font-family', 'inherit')

  const seqInterpolator = d3.interpolateRgb(vizTheme.seqStart, vizTheme.seqEnd)
  const divInterpolator = d3.interpolateRgbBasis([vizTheme.orange, vizTheme.neutral, vizTheme.primary])

  const panels = [
    { key: 'qual', title: 'Qualitative', subtitle: 'Categories', x: padding },
    { key: 'seq', title: 'Sequential', subtitle: 'Low → High', x: padding + panelWidth + gap },
    { key: 'div', title: 'Diverging', subtitle: 'Below ↔ Above', x: padding + (panelWidth + gap) * 2 },
  ] as const

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
    .attr('y', 34)
    .attr('fill', vizTheme.text)
    .style('font-size', '18px')
    .style('font-weight', '700')
    .text((d) => d.title)

  panel
    .append('text')
    .attr('x', 18)
    .attr('y', 56)
    .attr('fill', vizTheme.textMuted)
    .style('font-size', '12px')
    .style('font-weight', '600')
    .text((d) => d.subtitle)

  const qual = panel.filter((d) => d.key === 'qual')
  const swatches = okabeIto.slice(0, 6)
  const swatchCols = 3
  const swatchGapX = 12
  const swatchW = (panelWidth - 18 * 2 - (swatchCols - 1) * swatchGapX) / swatchCols
  const swatchH = 34
  const rowStride = 64
  const swatchY = 82

  const swatchX = (i: number) => {
    const col = i % swatchCols
    return 18 + col * (swatchW + swatchGapX)
  }

  const swatchRow = (i: number) => Math.floor(i / swatchCols)
  const swatchTop = (i: number) => swatchY + swatchRow(i) * rowStride
  const swatchLabel = (name: string) => (name === 'Vermillion' ? 'Vermil.' : name)

  qual
    .selectAll('rect.swatch')
    .data(swatches)
    .enter()
    .append('rect')
    .attr('class', 'swatch')
    .attr('x', (_, i) => swatchX(i))
    .attr('y', (_, i) => swatchTop(i))
    .attr('width', swatchW)
    .attr('height', swatchH)
    .attr('rx', 14)
    .attr('ry', 14)
    .attr('fill', (d) => d.hex)
    .attr('stroke', 'rgba(255,255,255,0.14)')
    .attr('stroke-width', 1)

  qual
    .selectAll('text.swatch-label')
    .data(swatches)
    .enter()
    .append('text')
    .attr('class', 'swatch-label')
    .attr('x', (_, i) => swatchX(i) + swatchW / 2)
    .attr('y', (_, i) => swatchTop(i) + swatchH + 18)
    .attr('text-anchor', 'middle')
    .attr('fill', vizTheme.textMuted)
    .style('font-size', '10.5px')
    .style('font-weight', '650')
    .text((d) => swatchLabel(d.name))

  const seq = panel.filter((d) => d.key === 'seq')
  const rampX = 18
  const rampY = 96
  const rampW = panelWidth - 36
  const rampH = 42

  const seqClipId = `seq-clip-${uid}`
  seq
    .append('defs')
    .append('clipPath')
    .attr('id', seqClipId)
    .attr('clipPathUnits', 'userSpaceOnUse')
    .append('rect')
    .attr('x', rampX)
    .attr('y', rampY)
    .attr('width', rampW)
    .attr('height', rampH)
    .attr('rx', 16)
    .attr('ry', 16)

  const rampSteps = 14
  const stepW = rampW / rampSteps
  seq
    .append('g')
    .attr('clip-path', `url(#${seqClipId})`)
    .selectAll('rect.step')
    .data(d3.range(rampSteps))
    .enter()
    .append('rect')
    .attr('class', 'step')
    .attr('x', (i) => rampX + i * stepW)
    .attr('y', rampY)
    .attr('width', Math.ceil(stepW) + 0.5)
    .attr('height', rampH)
    .attr('fill', (i) => seqInterpolator((i + 0.5) / rampSteps))

  seq
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

  const seqScale = d3.scaleLinear().domain([0, 100]).range([rampX, rampX + rampW])
  const seqAxis = d3.axisBottom(seqScale).ticks(3).tickSizeOuter(0)
  const seqAxisG = seq.append('g').attr('class', 'axis').attr('transform', `translate(0,${rampY + rampH + 24})`).call(seqAxis)
  drawAxis(seqAxisG)

  const div = panel.filter((d) => d.key === 'div')
  const divClipId = `div-clip-${uid}`
  div
    .append('defs')
    .append('clipPath')
    .attr('id', divClipId)
    .attr('clipPathUnits', 'userSpaceOnUse')
    .append('rect')
    .attr('x', rampX)
    .attr('y', rampY)
    .attr('width', rampW)
    .attr('height', rampH)
    .attr('rx', 16)
    .attr('ry', 16)

  div
    .append('g')
    .attr('clip-path', `url(#${divClipId})`)
    .selectAll('rect.step')
    .data(d3.range(rampSteps))
    .enter()
    .append('rect')
    .attr('class', 'step')
    .attr('x', (i) => rampX + i * stepW)
    .attr('y', rampY)
    .attr('width', Math.ceil(stepW) + 0.5)
    .attr('height', rampH)
    .attr('fill', (i) => divInterpolator((i + 0.5) / rampSteps))

  div
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

  const divScale = d3.scaleLinear().domain([-1, 0, 1]).range([rampX, rampX + rampW / 2, rampX + rampW])
  const divAxis = d3.axisBottom(divScale).tickValues([-1, 0, 1]).tickSizeOuter(0)
  const divAxisG = div.append('g').attr('class', 'axis').attr('transform', `translate(0,${rampY + rampH + 24})`).call(divAxis)
  drawAxis(divAxisG)
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
