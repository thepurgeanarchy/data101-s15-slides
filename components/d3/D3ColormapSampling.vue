<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import * as d3 from 'd3'
import { vizTheme } from './theme'

const container = ref<HTMLDivElement | null>(null)

function render() {
  if (!container.value) return
  d3.select(container.value).selectAll('*').remove()

  const width = 720
  const height = 220
  const pad = 22

  const svg = d3
    .select(container.value)
    .append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('role', 'img')
    .attr('aria-label', 'Colormap sampling example using a sequential palette (Viridis)')
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
    .attr('stroke', vizTheme.panelStroke)
    .attr('stroke-width', 1.2)

  svg
    .append('text')
    .attr('x', pad)
    .attr('y', 34)
    .attr('fill', vizTheme.text)
    .style('font-size', '16px')
    .style('font-weight', '850')
    .text('Colormap = function (t → color)')

  svg
    .append('text')
    .attr('x', pad)
    .attr('y', 54)
    .attr('fill', vizTheme.textMuted)
    .style('font-size', '12px')
    .style('font-weight', '650')
    .text('Example: Viridis (sequential, order visible via lightness)')

  const barX = pad
  const barY = 78
  const barW = width - pad * 2
  const barH = 22

  const n = 180
  const stepW = barW / n
  const interp = d3.interpolateViridis

  const bar = svg.append('g').attr('transform', `translate(${barX},${barY})`)
  bar
    .selectAll('rect')
    .data(d3.range(n))
    .enter()
    .append('rect')
    .attr('x', (i) => i * stepW)
    .attr('y', 0)
    .attr('width', stepW + 0.6)
    .attr('height', barH)
    .attr('fill', (i) => interp(i / (n - 1)))

  bar
    .append('rect')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', barW)
    .attr('height', barH)
    .attr('rx', 10)
    .attr('ry', 10)
    .attr('fill', 'none')
    .attr('stroke', 'rgba(255,255,255,0.18)')
    .attr('stroke-width', 1)

  const samples = [0, 0.25, 0.5, 0.75, 1]
  const fmt = d3.format('.2f')

  const swatchY = 124
  const swatchW = 120
  const swatchH = 34
  const swatchGap = (barW - swatchW * samples.length) / (samples.length - 1)

  const swatches = svg.append('g').attr('transform', `translate(${barX},${swatchY})`)
  const sw = swatches.selectAll('g.sw').data(samples).enter().append('g').attr('class', 'sw')

  sw.append('rect')
    .attr('x', (_, i) => i * (swatchW + swatchGap))
    .attr('y', 0)
    .attr('width', swatchW)
    .attr('height', swatchH)
    .attr('rx', 12)
    .attr('ry', 12)
    .attr('fill', (t) => interp(t))
    .attr('stroke', 'rgba(255,255,255,0.14)')
    .attr('stroke-width', 1)

  sw.append('text')
    .attr('x', (_, i) => i * (swatchW + swatchGap) + swatchW / 2)
    .attr('y', -10)
    .attr('text-anchor', 'middle')
    .attr('fill', vizTheme.textMuted)
    .style('font-size', '11px')
    .style('font-weight', '700')
    .text((t) => `t=${fmt(t)}`)

  sw.append('text')
    .attr('x', (_, i) => i * (swatchW + swatchGap) + swatchW / 2)
    .attr('y', swatchH + 18)
    .attr('text-anchor', 'middle')
    .attr('fill', vizTheme.textMuted)
    .style('font-size', '11px')
    .style('font-weight', '650')
    .text((t) => d3.color(interp(t))?.formatHex() ?? '')

  svg
    .append('text')
    .attr('x', pad)
    .attr('y', height - 18)
    .attr('fill', vizTheme.textMuted)
    .style('font-size', '11px')
    .style('font-weight', '600')
    .text('Tip: choose palettes by semantics (categorical vs sequential vs diverging), then sample consistently.')
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

