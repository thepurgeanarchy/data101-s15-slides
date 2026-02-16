<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import * as d3 from 'd3'
import { vizTheme } from './theme'

type NetworkMode = 'node-link' | 'matrix'

type NetNode = { id: string; label: string; group: number; x?: number; y?: number }
type NetLink = {
  source: string
  target: string
  weight: number
  directed: boolean
  sign: 1 | -1
}
type MatrixCell = {
  row: number
  col: number
  source: string
  target: string
  value: number
  sign: 1 | -1
  directed: boolean
}

const container = ref<HTMLDivElement | null>(null)
const mode = ref<NetworkMode>('node-link')
const focusNode = ref<string | null>(null)
const focusCell = ref<string | null>(null)

const nodes: NetNode[] = [
  { id: 'A', label: 'Academy', group: 0 },
  { id: 'B', label: 'Clinic', group: 1 },
  { id: 'C', label: 'Library', group: 0 },
  { id: 'D', label: 'Housing', group: 1 },
  { id: 'E', label: 'Career', group: 2 },
  { id: 'F', label: 'Research', group: 2 },
  { id: 'G', label: 'Events', group: 3 },
  { id: 'H', label: 'Mentor', group: 1 },
  { id: 'I', label: 'Learning', group: 0 },
  { id: 'J', label: 'Support', group: 3 },
]

const links: NetLink[] = [
  { source: 'A', target: 'B', weight: 3, directed: true, sign: 1 },
  { source: 'A', target: 'C', weight: 2, directed: true, sign: 1 },
  { source: 'B', target: 'D', weight: 4, directed: false, sign: 1 },
  { source: 'B', target: 'E', weight: 1, directed: true, sign: -1 },
  { source: 'C', target: 'F', weight: 5, directed: false, sign: 1 },
  { source: 'C', target: 'H', weight: 3, directed: true, sign: 1 },
  { source: 'D', target: 'J', weight: 2, directed: true, sign: 1 },
  { source: 'E', target: 'F', weight: 3, directed: false, sign: -1 },
  { source: 'E', target: 'G', weight: 2, directed: true, sign: 1 },
  { source: 'F', target: 'H', weight: 2, directed: false, sign: 1 },
  { source: 'G', target: 'I', weight: 4, directed: true, sign: 1 },
  { source: 'H', target: 'I', weight: 3, directed: false, sign: 1 },
  { source: 'I', target: 'J', weight: 2, directed: true, sign: 1 },
  { source: 'J', target: 'A', weight: 1, directed: false, sign: -1 },
]

const nodeRadius = 16

const nodeIndex = computed(() => new Map(nodes.map((n) => [n.id, n])))
const neighbors = (id: string) => {
  const set = new Set<string>([id])
  for (const l of links) {
    if (l.source === id) set.add(l.target)
    if (l.target === id) set.add(l.source)
  }
  return set
}

const matrixData = computed<MatrixCell[]>(() => {
  const idx = new Map(nodes.map((n, i) => [n.id, i]))
  const n = nodes.length
  const data: MatrixCell[] = []

  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      data.push({
        row: r,
        col: c,
        source: nodes[r]!.id,
        target: nodes[c]!.id,
        value: 0,
        sign: 1,
        directed: false,
      })
    }
  }

  for (const l of links) {
    const r = idx.get(l.source)
    const c = idx.get(l.target)
    if (r === undefined || c === undefined) continue
    const fwd = data.find((d) => d.row === r && d.col === c)
    if (fwd) {
      fwd.value = l.weight
      fwd.directed = l.directed
      fwd.sign = l.sign
    }
    if (!l.directed) {
      const rev = data.find((d) => d.row === c && d.col === r)
      if (rev) {
        rev.value = l.weight
        rev.directed = false
        rev.sign = l.sign
      }
    }
  }

  return data
})

function splitRows(text: string, maxChars: number) {
  const words = text.split(' ')
  const out: string[] = []
  let line = ''
  for (const w of words) {
    if ((line + w).length > maxChars && line.length > 0) {
      out.push(line.trim())
      line = `${w} `
    }
    else {
      line += `${w} `
    }
  }
  if (line.trim()) out.push(line.trim())
  return out
}

function edgeEndpoints(source: NetNode, target: NetNode) {
  const sx = source.x ?? 0
  const sy = source.y ?? 0
  const tx = target.x ?? 0
  const ty = target.y ?? 0
  const dx = tx - sx
  const dy = ty - sy
  const len = Math.max(1, Math.hypot(dx, dy))
  const nx = dx / len
  const ny = dy / len
  const pad = nodeRadius + 7

  return {
    x1: sx + nx * pad,
    y1: sy + ny * pad,
    x2: tx - nx * pad,
    y2: ty - ny * pad,
  }
}

function render() {
  if (!container.value) return
  d3.select(container.value).selectAll('*').remove()

  const width = 940
  const height = 400
  const margin = { left: 16, right: 16, top: 76, bottom: 28 }
  const innerW = width - margin.left - margin.right
  const innerH = height - margin.top - margin.bottom

  const svg = d3
    .select(container.value)
    .append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('role', 'img')
    .attr('aria-label', 'Interactive network view for node-link vs matrix tasks')
    .style('font-family', 'inherit')

  svg
    .append('rect')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', width)
    .attr('height', height)
    .attr('rx', 18)
    .attr('fill', vizTheme.panelFill)
    .attr('stroke', vizTheme.panelStroke)

  svg
    .append('text')
    .attr('x', 22)
    .attr('y', 26)
    .attr('fill', vizTheme.text)
    .style('font-size', '16px')
    .style('font-weight', 850)
    .text('Interactive network decision: node-link or matrix')

  const tooltip = d3
    .select(container.value)
    .append('div')
    .style('position', 'absolute')
    .style('left', '0px')
    .style('top', '0px')
    .style('padding', '0.42rem 0.66rem')
    .style('border-radius', '10px')
    .style('background', 'rgba(11,18,32,0.95)')
    .style('color', '#f8fafc')
    .style('font-size', '12px')
    .style('line-height', '1.3')
    .style('border', '1px solid rgba(148,163,184,0.36)')
    .style('pointer-events', 'none')
    .style('max-width', '250px')
    .style('opacity', 0)

  const showTip = (event: PointerEvent, text: string) => {
    const rect = container.value!.getBoundingClientRect()
    tooltip
      .style('opacity', 1)
      .html(text)
      .style('left', `${Math.min(event.offsetX + 10, rect.width - 250)}px`)
      .style('top', `${Math.min(event.offsetY + 10, rect.height - 82)}px`)
  }
  const hideTip = () => tooltip.style('opacity', 0)

  const controls = svg
    .append('g')
    .attr('transform', 'translate(16,42)')
    .selectAll('g.mode')
    .data([
      { id: 'node-link', label: 'Node-link' },
      { id: 'matrix', label: 'Matrix' },
    ] as const)
    .enter()
    .append('g')
    .attr('transform', (_, i) => `translate(${i * 126},0)`)
    .style('cursor', 'pointer')
    .on('click', (_event, d) => {
      mode.value = d.id
      render()
    })

  controls
    .append('rect')
    .attr('width', 112)
    .attr('height', 28)
    .attr('rx', 9)
    .attr('ry', 9)
    .attr('fill', (d) => (d.id === mode.value ? vizTheme.primary : 'rgba(148,163,184,0.14)'))
    .attr('stroke', (d) => (d.id === mode.value ? 'rgba(34,211,238,0.6)' : 'rgba(148,163,184,0.35)'))

  controls
    .append('text')
    .attr('x', 56)
    .attr('y', 18)
    .attr('text-anchor', 'middle')
    .attr('fill', vizTheme.text)
    .style('font-size', '11px')
    .style('font-weight', 720)
    .text((d) => d.label)

  const root = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)
  const status = root.append('g').attr('transform', `translate(${innerW - 226}, -48)`)
  status.append('text').attr('x', 0).attr('y', 0).attr('fill', vizTheme.textMuted).style('font-size', '11px').style('font-weight', 700).text('Task-oriented readout')
  status.append('text').attr('x', 0).attr('y', 16).attr('fill', vizTheme.textMuted).style('font-size', '10.5px').text(`Mode: ${mode.value}`)
  status.append('text').attr('x', 0).attr('y', 30).attr('fill', vizTheme.textMuted).style('font-size', '10.5px').text(`Nodes: ${nodes.length}  |  Links: ${links.length}`)

  const panelW = innerW - 20
  const panelH = innerH - 16

  if (mode.value === 'node-link') {
    const centerX = panelW / 2 - 30
    const centerY = panelH / 2 + 6
    const radius = Math.min(panelW, panelH) * 0.32
    const angleStep = (Math.PI * 2) / nodes.length
    nodes.forEach((node, i) => {
      node.x = centerX + radius * Math.cos(angleStep * i - Math.PI / 2)
      node.y = centerY + radius * Math.sin(angleStep * i - Math.PI / 2)
    })

    const linkScale = d3.scaleSqrt().domain(d3.extent(links, (d) => d.weight) as [number, number]).range([1.6, 4.8])
    const plot = root.append('g').attr('transform', 'translate(14,10)')
    const markerId = `arrow-${mode.value}-${Date.now()}`
    const nodeById = new Map(nodes.map((node) => [node.id, node]))

    const clampNode = (node: NetNode) => {
      node.x = Math.max(8 + nodeRadius, Math.min(panelW - 8 - nodeRadius, node.x ?? 0))
      node.y = Math.max(8 + nodeRadius, Math.min(panelH - 8 - nodeRadius, node.y ?? 0))
    }

    const refreshLinks = (
      selection?: d3.Selection<SVGLineElement, NetLink, SVGGElement | null, undefined>,
    ) => {
      const lines = selection ?? linkSel
      lines
        .attr('x1', (d) => edgeEndpoints(
          nodeById.get(d.source) ?? { x: 0, y: 0 },
          nodeById.get(d.target) ?? { x: 0, y: 0 },
        ).x1)
        .attr('y1', (d) => edgeEndpoints(
          nodeById.get(d.source) ?? { x: 0, y: 0 },
          nodeById.get(d.target) ?? { x: 0, y: 0 },
        ).y1)
        .attr('x2', (d) => edgeEndpoints(
          nodeById.get(d.source) ?? { x: 0, y: 0 },
          nodeById.get(d.target) ?? { x: 0, y: 0 },
        ).x2)
        .attr('y2', (d) => edgeEndpoints(
          nodeById.get(d.source) ?? { x: 0, y: 0 },
          nodeById.get(d.target) ?? { x: 0, y: 0 },
        ).y2)
    }

    const dragBehavior = d3
      .drag<SVGGElement, NetNode, SVGGElement>()
      .on('start', (event, node) => {
        clampNode(node)
        d3.select(event.sourceEvent.currentTarget as SVGGElement).style('cursor', 'grabbing')
      })
      .on('drag', (event, node) => {
        node.x = event.x
        node.y = event.y
        clampNode(node)
        nodeG.attr('transform', (d) => `translate(${d.x ?? 0},${d.y ?? 0})`)
        refreshLinks()
        refresh()
      })
      .on('end', (event) => {
        d3.select(event.sourceEvent.currentTarget as SVGGElement).style('cursor', 'pointer')
      })

    svg
      .append('defs')
      .append('marker')
          .attr('id', markerId)
          .attr('viewBox', '0 0 14 14')
          .attr('markerWidth', 20)
          .attr('markerHeight', 20)
          .attr('refX', 12.6)
          .attr('refY', 7)
          .attr('orient', 'auto')
          .attr('markerUnits', 'userSpaceOnUse')
          .append('path')
          .attr('d', 'M 2 2 L 12 7 L 2 12 z')
          .attr('fill', vizTheme.primary)
          .attr('stroke', vizTheme.primary)
          .attr('stroke-width', 1.8)
      .attr('stroke-linejoin', 'round')

    const linkSel = plot
      .append('g')
      .selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .call((selection) => refreshLinks(selection))
      .attr('stroke', (d) => (d.sign === 1 ? vizTheme.primary : vizTheme.violet))
      .attr('stroke-width', (d) => linkScale(d.weight))
      .attr('stroke-opacity', 0.85)
      .attr('marker-end', (d) => (d.directed ? `url(#${markerId})` : null))

  const nodeG = plot
      .append('g')
      .selectAll<SVGGElement, NetNode>('g')
      .data(nodes)
      .enter()
      .append('g')
      .attr('transform', (d) => `translate(${d.x ?? 0},${d.y ?? 0})`)
      .style('cursor', 'pointer')
      .on('pointerenter', (_e, d) => {
        focusNode.value = d.id
        const deg = links.filter((l) => l.source === d.id || l.target === d.id).length
        const negative = links.filter((l) => (l.source === d.id || l.target === d.id) && l.sign < 0).length
        showTip(_e, `<div><strong>${d.label}</strong></div><div>degree: ${deg}</div><div>negative links: ${negative}</div><div>Focus by path questions.</div>`)
        refresh()
      })
      .on('pointermove', (_e, d) => {
        const deg = links.filter((l) => l.source === d.id || l.target === d.id).length
        showTip(_e, `<div><strong>${d.label}</strong></div><div>degree: ${deg}</div><div>click to pin</div>`)
      })
      .on('pointerleave', () => {
        focusNode.value = null
        hideTip()
        refresh()
      })
      .on('click', (_e, d) => {
        focusNode.value = focusNode.value === d.id ? null : d.id
        refresh()
      })
      .call(dragBehavior)

    nodeG
      .append('circle')
      .attr('r', nodeRadius)
      .attr('fill', (d) => (d.group === 0 ? 'rgba(77,163,255,0.2)' : d.group === 1 ? 'rgba(34,211,238,0.2)' : 'rgba(167,139,250,0.2)'))
      .attr('stroke', vizTheme.primary)
      .attr('stroke-width', 2)

    nodeG
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('fill', vizTheme.text)
      .style('font-size', '10px')
      .style('font-weight', '750')
      .text((d) => d.id)

    function refresh() {
      const active = focusNode.value
      const connected = active ? neighbors(active) : null
      nodeG
        .select('circle')
        .attr('fill', (d) => {
          if (!connected) return d.group === 0 ? 'rgba(77,163,255,0.2)' : d.group === 1 ? 'rgba(34,211,238,0.2)' : 'rgba(167,139,250,0.2)'
          return connected.has(d.id) ? 'rgba(34,211,238,0.3)' : 'rgba(148,163,184,0.13)'
        })
        .attr('stroke-width', (d) => (d.id === active ? 2.8 : 1.8))

      linkSel
        .attr('stroke', (d) => {
          if (!active) return d.sign === 1 ? vizTheme.primary : vizTheme.violet
          const keep = connected?.has(d.source) && connected?.has(d.target)
          return keep ? (d.sign === 1 ? vizTheme.primary : vizTheme.violet) : 'rgba(148,163,184,0.3)'
        })
        .attr('stroke-opacity', (d) => {
          if (!active) return 0.85
          return connected?.has(d.source) && connected?.has(d.target) ? 1 : 0.18
        })
    }

    nodes.forEach(clampNode)
    nodeG.attr('transform', (d) => `translate(${d.x ?? 0},${d.y ?? 0})`)
    refreshLinks()
    refresh()
  }

  if (mode.value === 'matrix') {
    const data = matrixData.value
    const n = nodes.length
    const cell = Math.min(panelW * 0.62, panelH - 24) / n
    const offsetX = 26
    const offsetY = 20
    const maxW = d3.max(data, (d) => d.value) ?? 5
    const color = d3
      .scaleSequential()
      .domain([0, maxW])
      .interpolator((t) => d3.interpolateRgb('rgba(34,211,238,0.1)', vizTheme.primary)(t))

    const matrix = root.append('g').attr('transform', `translate(4,8)`)
    const idx = new Map(nodes.map((n, i) => [n.id, i]))

    matrix
      .append('text')
      .attr('x', offsetX)
      .attr('y', 8)
      .attr('fill', vizTheme.textMuted)
      .style('font-size', '11px')
      .style('font-weight', 700)
      .text('Rows = source · Columns = target')

    matrix
      .append('g')
      .attr('transform', `translate(${offsetX},${offsetY + cell * n + 2})`)
      .selectAll('text')
      .data(nodes)
      .enter()
      .append('text')
      .attr('x', (_, i) => (i + 0.5) * cell)
      .attr('y', 14)
      .attr('text-anchor', 'middle')
      .attr('fill', vizTheme.textMuted)
      .style('font-size', '10px')
      .text((d) => d.id)

    matrix
      .append('g')
      .attr('transform', `translate(${offsetX - 5},${offsetY})`)
      .selectAll('text')
      .data(nodes)
      .enter()
      .append('text')
      .attr('x', -8)
      .attr('y', (_, i) => (i + 0.65) * cell)
      .attr('text-anchor', 'end')
      .attr('fill', vizTheme.textMuted)
      .style('font-size', '10px')
      .text((d) => d.label)

    const matrixCells = matrix
      .append('g')
      .attr('transform', `translate(${offsetX},${offsetY})`)
      .selectAll('g')
      .data(data)
      .enter()
      .append('g')
      .attr('transform', (d) => `translate(${d.col * cell},${d.row * cell})`)
      .style('cursor', 'pointer')
      .on('pointerenter', (_event, d) => {
        focusCell.value = `${d.source}:${d.target}`
        showTip(
          _event,
          `<div><strong>${d.source} → ${d.target}</strong></div>`
            + `<div>weight: ${d.value || '0'}</div>`
            + `<div>directed: ${d.directed ? 'yes' : 'no'}</div>`
            + `<div>sign: ${d.sign > 0 ? 'positive' : 'negative'}</div>`,
        )
        refresh()
      })
      .on('pointermove', (_event, d) => {
        if (d.value > 0)
          showTip(_event, `<strong>${d.source} → ${d.target}</strong><div>weight ${d.value}</div>`)
      })
      .on('pointerleave', () => {
        focusCell.value = null
        hideTip()
        refresh()
      })

    matrixCells
      .append('rect')
      .attr('width', cell - 2)
      .attr('height', cell - 2)
      .attr('x', 1)
      .attr('y', 1)
      .attr('rx', 6)
      .attr('stroke', 'rgba(148,163,184,0.22)')
      .attr('fill', (d) => (d.value ? color(d.value / maxW) : 'rgba(255,255,255,0.03)'))

    matrixCells
      .append('text')
      .attr('x', (cell - 2) / 2)
      .attr('y', (cell - 2) / 2 + 4)
      .attr('text-anchor', 'middle')
      .attr('fill', vizTheme.text)
      .style('font-size', '8.8px')
      .style('font-weight', '700')
      .text((d) => (d.value ? d.value : ''))

    const highlight = matrix.append('g').attr('class', 'hl')

    function refresh() {
      const activeNode = focusNode.value
      const activeCell = focusCell.value
      matrixCells
        .select('rect')
        .attr('opacity', (d) => {
          if (!activeNode && !activeCell) return 1
          if (activeCell && `${d.source}:${d.target}` === activeCell) return 1
          if (activeNode && (d.source === activeNode || d.target === activeNode)) return 1
          return 0.22
        })

      highlight.selectAll('*').remove()
      if (activeNode) {
        const i = idx.get(activeNode)
        if (i !== undefined) {
          highlight
            .append('rect')
            .attr('x', offsetX + 1)
            .attr('y', offsetY + i * cell + 1)
            .attr('width', cell * n - 2)
            .attr('height', cell - 2)
            .attr('fill', 'none')
            .attr('stroke', 'rgba(34,211,238,0.55)')
            .attr('stroke-width', 1.4)

          highlight
            .append('rect')
            .attr('x', offsetX + i * cell + 1)
            .attr('y', offsetY + 1)
            .attr('width', cell - 2)
            .attr('height', cell * n - 2)
            .attr('fill', 'none')
            .attr('stroke', 'rgba(34,211,238,0.45)')
            .attr('stroke-width', 1.4)
        }
      }
    }

    refresh()
  }

  status
    .append('text')
    .attr('x', 0)
    .attr('y', 52)
    .attr('fill', vizTheme.textMuted)
    .style('font-size', '10px')
    .text('Tip: node-link for route tasks, matrix for dense overlap patterns.')
}

onMounted(render)
watch(mode, () => render())
onBeforeUnmount(() => {
  if (!container.value) return
  d3.select(container.value).selectAll('*').remove()
})
</script>

<template>
  <div ref="container" class="viz-frame" />
</template>
