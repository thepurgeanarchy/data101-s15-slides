<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import * as d3 from 'd3'
import { vizTheme } from './theme'

type MapMode = 'choropleth' | 'symbols' | 'both'

const props = withDefaults(
  defineProps<{
    startMode?: MapMode
    startNormalize?: boolean
  }>(),
  {
    startMode: 'choropleth',
    startNormalize: true,
  },
)

type Region = {
  id: string
  name: string
  x: number
  y: number
  w: number
  h: number
  population: number
  events: number
  color: string
}

const regions: Region[] = [
  { id: 'N', name: 'North Ridge', x: 52, y: 34, w: 130, h: 88, population: 8400, events: 142, color: 'rgba(59,130,246,0.62)' },
  { id: 'E', name: 'East Vale', x: 192, y: 60, w: 132, h: 86, population: 6900, events: 98, color: 'rgba(34,197,94,0.62)' },
  { id: 'S', name: 'South Gate', x: 58, y: 132, w: 170, h: 92, population: 12100, events: 201, color: 'rgba(236,72,153,0.6)' },
  { id: 'W', name: 'West Bay', x: 246, y: 124, w: 138, h: 90, population: 5600, events: 77, color: 'rgba(168,85,247,0.62)' },
  { id: 'C', name: 'Central', x: 408, y: 34, w: 138, h: 96, population: 15100, events: 284, color: 'rgba(14,165,233,0.62)' },
  { id: 'I', name: 'Island West', x: 556, y: 44, w: 102, h: 82, population: 2100, events: 58, color: 'rgba(251,191,36,0.62)' },
  { id: 'NE', name: 'Northeast', x: 408, y: 150, w: 118, h: 92, population: 7300, events: 117, color: 'rgba(14,165,233,0.62)' },
  { id: 'NW', name: 'Northwest', x: 532, y: 150, w: 122, h: 72, population: 4900, events: 64, color: 'rgba(16,185,129,0.62)' },
]

const mapMode = ref<MapMode>(props.startMode)
const normalize = ref(Boolean(props.startNormalize))
const container = ref<HTMLDivElement | null>(null)

const values = computed(() =>
  regions.map((r) => ({
    ...r,
    raw: r.events,
    rate: r.events / (r.population / 1000),
  })),
)

function toRate(v: { raw: number, rate: number }) {
  return normalize.value ? v.rate : v.raw
}

function format(v: number, unit: 'rate' | 'count') {
  return unit === 'rate' ? `${(v / 10).toFixed(1)} /1k` : `${Math.round(v)}`
}

function render() {
  if (!container.value) return
  d3.select(container.value).selectAll('*').remove()

  const width = 940
  const height = 360
  const chart = d3.select(container.value)
    .append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('role', 'img')
    .attr('aria-label', 'Interactive choropleth and symbol map with toggle controls')
    .style('font-family', 'inherit')

  chart
    .append('rect')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', width)
    .attr('height', height)
    .attr('rx', 18)
    .attr('fill', vizTheme.panelFill)
    .attr('stroke', vizTheme.panelStroke)
    .attr('stroke-width', 1.2)

  chart
    .append('text')
    .attr('x', 20)
    .attr('y', 24)
    .attr('fill', vizTheme.text)
    .style('font-size', '16px')
    .style('font-weight', '850')
    .text('Spatial mode: choropleth, symbols, or both')

  const tooltip = d3
    .select(container.value)
    .append('div')
    .style('position', 'absolute')
    .style('left', '0px')
    .style('top', '0px')
    .style('pointer-events', 'none')
    .style('padding', '0.45rem 0.65rem')
    .style('border-radius', '10px')
    .style('font-size', '12px')
    .style('line-height', '1.25')
    .style('background', 'rgba(11,18,32,0.95)')
    .style('color', '#f8fafc')
    .style('border', '1px solid rgba(148,163,184,0.36)')
    .style('max-width', '230px')
    .style('opacity', 0)

  const moveTip = (event: PointerEvent, text: string) => {
    const bounds = container.value!.getBoundingClientRect()
    tooltip
      .style('opacity', 1)
      .html(text)
      .style('left', `${Math.min(event.offsetX + 12, bounds.width - 230)}px`)
      .style('top', `${Math.min(event.offsetY + 8, bounds.height - 86)}px`)
  }
  const hideTip = () => tooltip.style('opacity', 0)

  const modeRow = chart.append('g').attr('transform', 'translate(20,40)')
  const modeButtons: Array<{ id: MapMode; label: string }> = [
    { id: 'choropleth', label: 'Choropleth' },
    { id: 'symbols', label: 'Symbol only' },
    { id: 'both', label: 'Overlay' },
  ]
  const nrmButton = [{ id: 'rate' as const, label: 'Normalize' }, { id: 'count' as const, label: 'Raw count' }] as const

  modeRow
    .selectAll('g.mode')
    .data(modeButtons)
    .enter()
    .append('g')
    .attr('transform', (_, i) => `translate(${i * 140},0)`)
    .style('cursor', 'pointer')
    .on('click', (_event, d) => {
      mapMode.value = d.id
      render()
    })
    .append('rect')
    .attr('width', 126)
    .attr('height', 30)
    .attr('rx', 10)
    .attr('fill', (d) => (d.id === mapMode.value ? vizTheme.primary : 'rgba(148,163,184,0.16)'))
    .attr('stroke', (d) => (d.id === mapMode.value ? 'rgba(34,211,238,0.55)' : 'rgba(148,163,184,0.32)'))

  modeRow
    .selectAll('g.mode text')
    .data(modeButtons)
    .enter()
    .append('text')
    .attr('x', (_, i) => i * 140 + 64)
    .attr('y', 20)
    .attr('text-anchor', 'middle')
    .attr('fill', vizTheme.text)
    .style('font-size', '11px')
    .style('font-weight', 750)
    .text((d) => d.label)

  modeRow
    .append('g')
    .attr('transform', 'translate(470,0)')
    .selectAll('g.norm')
    .data(nrmButton)
    .enter()
    .append('g')
    .attr('transform', (_, i) => `translate(${i * 108},0)`)
    .style('cursor', 'pointer')
    .on('click', (_event, d) => {
      normalize.value = d.id === 'rate'
      render()
    })
    .append('rect')
    .attr('width', 94)
    .attr('height', 30)
    .attr('rx', 10)
    .attr('fill', (d) => (d.id === 'rate') === normalize.value ? vizTheme.primary : 'rgba(148,163,184,0.16)')
    .attr('stroke', (d) => ((d.id === 'rate') === normalize.value ? 'rgba(34,211,238,0.55)' : 'rgba(148,163,184,0.32)'))

  modeRow
    .selectAll('g.norm text')
    .data(nrmButton)
    .enter()
    .append('text')
    .attr('x', (_, i) => 470 + i * 108 + 47)
    .attr('y', 20)
    .attr('text-anchor', 'middle')
    .attr('fill', vizTheme.text)
    .style('font-size', '11px')
    .style('font-weight', 720)
    .text((d) => d.label)

  const mapW = 660
  const mapH = 250
  const mapX = 18
  const mapY = 86

  const valuesList = values.value
  const extent = d3.extent(valuesList.map(toRate))
  const minVal = extent[0] ?? 0
  const maxVal = extent[1] ?? 1
  const fill = d3
    .scaleLinear<string>()
    .domain([Math.max(0, minVal), maxVal])
    .range([normalize.value ? 'rgba(34,211,238,0.14)' : 'rgba(14,165,233,0.14)', normalize.value ? vizTheme.primary : vizTheme.cyan])

  const radius = d3.scaleSqrt().domain(d3.extent(valuesList, (d) => toRate(d)) as [number, number]).range([0, 24])

  const panel = chart.append('g').attr('transform', `translate(${mapX},${mapY})`)

  panel
    .append('rect')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', mapW)
    .attr('height', mapH)
    .attr('rx', 14)
    .attr('fill', 'rgba(255,255,255,0.02)')
    .attr('stroke', 'rgba(255,255,255,0.14)')

  const regionGroup = panel.append('g')

  regionGroup
    .selectAll('g.region')
    .data(valuesList)
    .enter()
    .append('g')
    .attr('class', 'region')
    .attr('transform', (d) => `translate(${d.x},${d.y})`)
    .style('cursor', 'pointer')
    .on('pointermove', (event, d) => {
      const val = toRate(d)
      const unit = normalize.value ? 'rate' : 'count'
      moveTip(
        event,
        `<strong>${d.name}</strong><br/>${unit === 'rate' ? 'events/1k' : 'events'}: ${format(val, unit)}<br/>population: ${d.population.toLocaleString()}`,
      )
    })
    .on('pointerleave', hideTip)

  const regionsG = regionGroup
    .selectAll<SVGGElement, Region>('g.region')
    .on('click', (_event, d) => {
      moveTip(_event, `<strong>${d.name}</strong>: ${d.population.toLocaleString()} pop`)
    })

  if (mapMode.value === 'choropleth' || mapMode.value === 'both') {
    regionsG
      .append('rect')
      .attr('width', (d) => d.w)
      .attr('height', (d) => d.h)
      .attr('rx', 10)
      .attr('ry', 10)
      .attr('fill', (d) => {
        const val = toRate(d)
        return fill(val)
      })
      .attr('stroke', 'rgba(255,255,255,0.26)')
      .attr('stroke-width', 1)
  }

  if (mapMode.value === 'symbols' || mapMode.value === 'both') {
    regionsG
      .append('circle')
      .attr('cx', (d) => d.w / 2)
      .attr('cy', (d) => d.h / 2)
      .attr('r', (d) => radius(toRate(d)))
      .attr('fill', 'rgba(236,72,153,0.35)')
      .attr('stroke', 'rgba(236,72,153,0.8)')
      .attr('stroke-width', 1.2)
  }

  regionsG
    .append('text')
    .attr('x', (d) => d.w / 2)
    .attr('y', (d) => d.h / 2 + 3)
    .attr('text-anchor', 'middle')
    .attr('fill', vizTheme.text)
    .style('font-size', '10px')
    .style('font-weight', '750')
    .text((d) => d.id)

  const legend = chart.append('g').attr('transform', `translate(700, 102)`)
  legend
    .append('text')
    .attr('x', 0)
    .attr('y', 0)
    .attr('fill', vizTheme.textMuted)
    .style('font-size', '11px')
    .style('font-weight', '700')
    .text(`Value scale ${normalize.value ? '(rates)' : '(counts)'}`)

  const swatches = 8
  const gradW = 150
  const gradH = 12
  const grad = d3.range(swatches).map((i) => i / (swatches - 1))

  legend
    .selectAll('rect')
    .data(grad)
    .enter()
    .append('rect')
    .attr('x', (_, i) => (gradW / swatches) * i)
    .attr('y', 12)
    .attr('width', gradW / swatches + 1)
    .attr('height', gradH)
    .attr('fill', (d) => fill(minVal + d * (maxVal - minVal)))

  legend
    .append('text')
    .attr('x', 0)
    .attr('y', 40)
    .attr('fill', vizTheme.textMuted)
    .style('font-size', '10px')
    .text(`${minVal.toFixed(1)} ${normalize.value ? 'per 1k' : 'events'}`)
  legend
    .append('text')
    .attr('x', gradW)
    .attr('y', 40)
    .attr('text-anchor', 'end')
    .attr('fill', vizTheme.textMuted)
    .style('font-size', '10px')
    .text(`${maxVal.toFixed(1)} ${normalize.value ? 'per 1k' : 'events'}`)

  const note = chart
    .append('text')
    .attr('x', mapX)
    .attr('y', mapY + mapH + 32)
    .attr('fill', vizTheme.textMuted)
    .style('font-size', '11px')
    .style('font-weight', '650')
    .text('Interactive hint: normalize for MAUP-safe rates, raw for absolute burden checks.')
}

onMounted(render)
watch([mapMode, normalize], () => render())

onBeforeUnmount(() => {
  if (!container.value) return
  d3.select(container.value).selectAll('*').remove()
})
</script>

<template>
  <div ref="container" class="viz-frame" />
</template>
