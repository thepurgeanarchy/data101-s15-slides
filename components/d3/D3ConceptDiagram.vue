<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import * as d3 from 'd3'
import type { DiagramEdge, DiagramGroup, DiagramNode, DiagramSpec } from './concept-diagrams'
import { conceptDiagrams } from './concept-diagrams'
import { vizTheme } from './theme'

const props = defineProps<{
  diagram: string
  fullscreen?: boolean
}>()

const container = ref<HTMLDivElement | null>(null)
const uid = Math.random().toString(36).slice(2, 10)

type ResolvedNode = DiagramNode & {
  cx: number
  cy: number
  w: number
  h: number
  shape: 'rect' | 'pill' | 'circle'
}

type RenderedEdge = {
  edge: DiagramEdge
  source: ResolvedNode
  target: ResolvedNode
  markerId: string
}

function getSpec(name: string): DiagramSpec {
  const spec = conceptDiagrams[name]
  if (!spec) {
    return {
      height: 200,
      ariaLabel: `Unknown diagram: ${name}`,
      nodes: [
        { id: 'missing', label: `Unknown diagram:\n${name}`, x: 0.5, y: 0.5, w: 340, h: 90, variant: 'warn' },
      ],
      edges: [],
    }
  }
  return spec
}

const variantStyles = {
  primary: { fill: '#0F1B2D', stroke: vizTheme.primary, text: vizTheme.text, strokeWidth: 2 },
  note: { fill: '#111C2E', stroke: vizTheme.seqEnd, text: vizTheme.text, strokeWidth: 2 },
  ok: { fill: '#0B1220', stroke: vizTheme.cyan, text: vizTheme.text, strokeWidth: 2 },
  warn: { fill: '#1B0F19', stroke: vizTheme.redSoft, text: '#FEE2E2', strokeWidth: 2 },
  muted: { fill: vizTheme.panelFill, stroke: vizTheme.axis, text: vizTheme.textMuted, strokeWidth: 1.4 },
  accent: { fill: '#0B1220', stroke: vizTheme.primary, text: vizTheme.text, strokeWidth: 2.2 },
} as const

function drawTextCentered(
  selection: d3.Selection<SVGGElement, unknown, null, undefined>,
  node: ResolvedNode,
  fill: string,
) {
  const lines = node.label.split('\n')
  const fontSize = node.fontSize ?? 14
  const fontWeight = node.fontWeight ?? 700
  const lineHeight = Math.max(14, Math.round(fontSize * 1.15))
  const startY = node.cy - ((lines.length - 1) * lineHeight) / 2

  const text = selection
    .append('text')
    .attr('class', 'node-text')
    .attr('x', node.cx)
    .attr('y', startY)
    .attr('text-anchor', 'middle')
    .attr('fill', fill)
    // Use inline styles so theme/global CSS can’t accidentally override SVG text sizing.
    .style('font-size', `${fontSize}px`)
    .style('font-weight', `${fontWeight}`)
    .style('font-family', 'inherit')

  for (let i = 0; i < lines.length; i++) {
    text
      .append('tspan')
      .attr('x', node.cx)
      .attr('dy', i === 0 ? 0 : lineHeight)
      .text(lines[i])
  }
}

function drawMultilineTextCentered(
  selection: d3.Selection<SVGGElement, unknown, null, undefined>,
  {
    x,
    y,
    text,
    fontSize,
    fontWeight,
    fill,
  }: { x: number; y: number; text: string; fontSize: number; fontWeight: number; fill: string },
) {
  const lines = text.split('\n')
  const lineHeight = Math.max(14, Math.round(fontSize * 1.15))
  const startY = y - ((lines.length - 1) * lineHeight) / 2

  const t = selection
    .append('text')
    .attr('class', 'edge-label-text')
    .attr('x', x)
    .attr('y', startY)
    .attr('text-anchor', 'middle')
    .attr('fill', fill)
    // Use inline styles so theme/global CSS can’t accidentally override SVG text sizing.
    .style('font-size', `${fontSize}px`)
    .style('font-weight', `${fontWeight}`)
    .style('font-family', 'inherit')

  for (let i = 0; i < lines.length; i++) {
    t.append('tspan')
      .attr('x', x)
      .attr('dy', i === 0 ? 0 : lineHeight)
      .text(lines[i])
  }
}

function resolveNodes(spec: DiagramSpec, width: number, height: number, margin: number): ResolvedNode[] {
  const innerW = width - margin * 2
  const innerH = height - margin * 2

  return spec.nodes.map((n) => ({
    ...n,
    w: n.w ?? 200,
    h: n.h ?? 62,
    shape: n.shape ?? 'rect',
    cx: margin + n.x * innerW,
    cy: margin + n.y * innerH,
  }))
}

function relaxOverlaps(nodes: ResolvedNode[], width: number, height: number, margin: number, gap: number) {
  if (nodes.length < 2) return

  const iterations = 14
  for (let iter = 0; iter < iterations; iter++) {
    let moved = false
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i]
        const b = nodes[j]
        const dx = b.cx - a.cx
        const dy = b.cy - a.cy

        const overlapX = a.w / 2 + b.w / 2 + gap - Math.abs(dx)
        const overlapY = a.h / 2 + b.h / 2 + gap - Math.abs(dy)

        if (overlapX <= 0 || overlapY <= 0) continue

        moved = true
        if (overlapX < overlapY) {
          const shift = overlapX / 2
          const sign = dx >= 0 ? 1 : -1
          a.cx -= shift * sign
          b.cx += shift * sign
        }
        else {
          const shift = overlapY / 2
          const sign = dy >= 0 ? 1 : -1
          a.cy -= shift * sign
          b.cy += shift * sign
        }
      }
    }

    for (const n of nodes) {
      n.cx = Math.max(margin + n.w / 2, Math.min(width - margin - n.w / 2, n.cx))
      n.cy = Math.max(margin + n.h / 2, Math.min(height - margin - n.h / 2, n.cy))
    }

    if (!moved) break
  }
}

function resolveGroups(groups: DiagramGroup[] | undefined, width: number, height: number, margin: number) {
  if (!groups?.length) return []
  const innerW = width - margin * 2
  const innerH = height - margin * 2
  return groups.map((g) => ({
    ...g,
    rx: 18,
    x: margin + g.x * innerW,
    y: margin + g.y * innerH,
    w: g.w * innerW,
    h: g.h * innerH,
  }))
}

function nodeHalfAxis(node: ResolvedNode, axis: 'x' | 'y') {
  if (node.shape === 'circle') {
    const r = nodeRadius(node)
    return axis === 'x' ? r : r
  }
  return axis === 'x' ? node.w / 2 : node.h / 2
}

function nodeRadius(node: ResolvedNode) {
  return Math.min(node.w, node.h) / 2
}

function edgeEndpoints(source: ResolvedNode, target: ResolvedNode, edge: DiagramEdge) {
  const arrow = edge.arrow ?? true

  const dx = target.cx - source.cx
  const dy = target.cy - source.cy
  const gapH = Math.abs(dx) - (nodeHalfAxis(source, 'x') + nodeHalfAxis(target, 'x'))
  const gapV = Math.abs(dy) - (nodeHalfAxis(source, 'y') + nodeHalfAxis(target, 'y'))

  // Prefer the dominant direction, but avoid choosing an orientation where marks overlap on that axis.
  // This keeps arrowheads outside nodes and preserves a visible line segment.
  const preferH = Math.abs(dx) >= Math.abs(dy)
  // Arrowheads are drawn behind nodes, so we need extra clearance to keep them visible.
  const minGap = arrow ? 14 : 0
  const okH = gapH >= minGap
  const okV = gapV >= minGap

  let orient: 'h' | 'v'
  if (okH && okV)
    orient = preferH ? 'h' : 'v'
  else if (okH)
    orient = 'h'
  else if (okV)
    orient = 'v'
  else
    orient = gapH >= gapV ? 'h' : 'v'

  const gapAxis = orient === 'h' ? gapH : gapV

  // Edges are drawn behind nodes. Arrowheads must end *outside* the target node
  // and we must avoid degenerate/crossing segments when nodes are close.
  const available = Math.max(0, gapAxis)
  const minSegment = arrow ? 30 : 0
  const padBudget = Math.max(0, available - minSegment)
  // Prioritize the end pad: arrowheads are easy to lose when drawn behind nodes.
  const endPadWanted = arrow ? 22 : 0
  const startPadWanted = arrow ? 12 : 0
  const endPad = arrow ? Math.min(endPadWanted, padBudget) : 0
  const startPad = arrow ? Math.min(startPadWanted, Math.max(0, padBudget - endPad)) : 0

  if (orient === 'h') {
    const sign = dx >= 0 ? 1 : -1
    return {
      x1: source.cx + sign * (nodeHalfAxis(source, 'x') + startPad),
      y1: source.cy,
      x2: target.cx - sign * (nodeHalfAxis(target, 'x') + endPad + 4),
      y2: target.cy,
      orient,
    }
  }

  const sign = dy >= 0 ? 1 : -1
  return {
    x1: source.cx,
    y1: source.cy + sign * (nodeHalfAxis(source, 'y') + startPad),
    x2: target.cx,
    y2: target.cy - sign * (nodeHalfAxis(target, 'y') + endPad + 3),
    orient,
  }
}

function edgePath(source: ResolvedNode, target: ResolvedNode, edge: DiagramEdge) {
  const { x1, y1, x2, y2 } = edgeEndpoints(source, target, edge)
  return `M ${x1} ${y1} L ${x2} ${y2}`
}

function computeSceneBounds(
  nodes: ResolvedNode[],
  groups: Array<{ x: number; y: number; w: number; h: number }>,
  edges: DiagramEdge[],
  nodeById: Map<string, ResolvedNode>,
) {
  let minX = Number.POSITIVE_INFINITY
  let minY = Number.POSITIVE_INFINITY
  let maxX = Number.NEGATIVE_INFINITY
  let maxY = Number.NEGATIVE_INFINITY

  const expand = (x0: number, y0: number, x1: number, y1: number) => {
    minX = Math.min(minX, x0)
    minY = Math.min(minY, y0)
    maxX = Math.max(maxX, x1)
    maxY = Math.max(maxY, y1)
  }

  for (const g of groups) {
    expand(g.x, g.y, g.x + g.w, g.y + g.h)
  }

  for (const n of nodes) {
    if (n.shape === 'circle') {
      const r = Math.min(n.w, n.h) / 2
      expand(n.cx - r, n.cy - r, n.cx + r, n.cy + r)
      continue
    }
    expand(n.cx - n.w / 2, n.cy - n.h / 2, n.cx + n.w / 2, n.cy + n.h / 2)
  }

  for (const e of edges) {
    if (!e.label) continue
    const source = nodeById.get(e.from)
    const target = nodeById.get(e.to)
    if (!source || !target) continue
    const { x1, y1, x2, y2 } = edgeEndpoints(source, target, e)
    const mx = (x1 + x2) / 2
    const my = (y1 + y2) / 2
    const label = e.label
    const lines = label.split('\n')
    const padX = 10
    const padY = 6
    const fontSize = 12
    const lineHeight = Math.max(14, Math.round(fontSize * 1.15))
    const approxW = Math.min(
      260,
      Math.max(72, Math.max(...lines.map((line) => Math.max(1, line.length))) * 7 + padX * 2),
    )
    const approxH = lines.length * lineHeight + padY * 2
    expand(mx - approxW / 2, my - approxH / 2, mx + approxW / 2, my + approxH / 2)
  }

  if (!Number.isFinite(minX) || !Number.isFinite(minY) || !Number.isFinite(maxX) || !Number.isFinite(maxY))
    return null

  const extra = 10
  return {
    x: minX - extra,
    y: minY - extra,
    w: Math.max(1, maxX - minX + extra * 2),
    h: Math.max(1, maxY - minY + extra * 2),
  }
}

function render() {
  if (!container.value) return
  const root = d3.select(container.value)
  root.style('position', 'relative')
  root.selectAll('*').remove()

  const spec = getSpec(props.diagram)
  const baseW = spec.width ?? 960
  const baseH = spec.height
  const isCompact = container.value.classList.contains('viz-compact')
  const margin = isCompact ? 16 : 18
  const collisionGap = isCompact ? 10 : 14

  const nodes = resolveNodes(spec, baseW, baseH, margin)
  if (spec.relax !== false)
    relaxOverlaps(nodes, baseW, baseH, margin, collisionGap)
  const nodeById = new Map(nodes.map((n) => [n.id, n]))
  const groups = resolveGroups(spec.groups, baseW, baseH, margin)
  const edges = spec.edges ?? []

  const tooltip = root
    .append('div')
    .attr('class', 'viz-tooltip')
    .style('position', 'absolute')
    .style('left', '0px')
    .style('top', '0px')
    .style('padding', '0.5rem 0.65rem')
    .style('border-radius', '10px')
    .style('background', 'rgba(11, 18, 32, 0.95)')
    .style('color', '#f8fafc')
    .style('font-size', '12px')
    .style('line-height', '1.25')
    .style('border', '1px solid rgba(148,163,184,0.38)')
    .style('backdrop-filter', 'blur(4px)')
    .style('pointer-events', 'none')
    .style('max-width', '280px')
    .style('box-shadow', '0 8px 20px rgba(0,0,0,0.32)')
    .style('opacity', 0)
    .style('white-space', 'pre-line')

  const showTextTooltip = (event: PointerEvent, lines: string[]) => {
    const rootBounds = container.value!.getBoundingClientRect()
    tooltip
      .style('opacity', 1)
      .html(lines.join('<br />'))
      .style('left', `${Math.min(event.offsetX + 12, rootBounds.width - 240)}px`)
      .style('top', `${Math.min(event.offsetY + 10, rootBounds.height - 64)}px`)
  }

  const showNodeTooltip = (event: PointerEvent, node: ResolvedNode) => {
    const neighbors = connected.get(node.id) ?? new Set<string>()
    const preview = [...neighbors].slice(0, 4)
    const more = neighbors.size > 4 ? ` (+${neighbors.size - 4})` : ''
    showTextTooltip(event, [
      `${node.label}`,
      neighbors.size ? `Connected: ${preview.join(', ')}${more}` : 'No links',
    ])
  }

  const showEdgeTooltip = (event: PointerEvent, d: RenderedEdge) => {
    showTextTooltip(event, [
      `${d.source.label} → ${d.target.label}`,
      d.edge.label ? `Relation: ${d.edge.label}` : 'Direct relation',
      `Stroke: ${edgeStyle(d.edge.stroke) ?? 'default'}`,
    ])
  }

  const svg = root
    .append('svg')
    .attr('viewBox', `0 0 ${baseW} ${baseH}`)
    .attr('preserveAspectRatio', 'xMidYMid meet')
    .attr('role', 'img')
    .attr('aria-label', spec.ariaLabel)
    .style('font-family', 'inherit')

  const defs = svg.append('defs')

  function edgeMarkerColor(stroke: string) {
    const parsed = d3.color(stroke)
    if (!parsed) return '#E2E8F0'
    const rgb = parsed.rgb()
    const alpha = Number.isFinite(parsed.opacity) ? parsed.opacity : 1
    if (alpha < 1) {
      return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${Math.min(1, Math.max(0, alpha + 0.04))})`
    }
    return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
  }

  const scene = svg.append('g').attr('class', 'scene')
  const layerGroups = scene.append('g').attr('class', 'groups')
  const layerEdges = scene.append('g').attr('class', 'edges')
  const layerEdgeLabels = scene.append('g').attr('class', 'edge-labels')
  const layerNodes = scene.append('g').attr('class', 'nodes')

  // Groups (background clusters)
  for (const g of groups) {
    layerGroups
      .append('rect')
      .attr('x', g.x)
      .attr('y', g.y)
      .attr('width', g.w)
      .attr('height', g.h)
      .attr('rx', 22)
      .attr('ry', 22)
      .attr('fill', g.fill ?? 'rgba(11, 18, 32, 0.32)')
      .attr('stroke', g.stroke ?? vizTheme.primary)
      .attr('stroke-width', 1.6)

    if (g.label) {
      layerGroups
        .append('text')
        .attr('x', g.x + g.w / 2)
        .attr('y', g.y + 10)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'hanging')
        .attr('fill', vizTheme.textMuted)
        .style('font-size', '12px')
        .style('font-weight', '650')
        .style('font-family', 'inherit')
        .text(g.label)
    }
  }

  const connected = new Map<string, Set<string>>()
  const edgeList = edges
    .map((edge, edgeIndex) => {
      const source = nodeById.get(edge.from)
      const target = nodeById.get(edge.to)
      if (!source || !target) return null

      if (!connected.has(edge.from))
        connected.set(edge.from, new Set())
      if (!connected.has(edge.to))
        connected.set(edge.to, new Set())
      connected.get(edge.from)!.add(edge.to)
      connected.get(edge.to)!.add(edge.from)

      const markerId = `${uid}-arrow-${edgeIndex}`
      const arrow = edge.arrow ?? true
      const stroke = edge.stroke ?? 'rgba(147,197,253,1)'

      if (arrow) {
        const markerSize = 22
        defs
          .append('marker')
          .attr('id', markerId)
          .attr('markerUnits', 'userSpaceOnUse')
          .attr('viewBox', `0 0 ${markerSize} ${markerSize}`)
          .attr('refX', markerSize - 0.4)
          .attr('refY', markerSize / 2)
          .attr('markerWidth', 18)
          .attr('markerHeight', 16)
          .attr('overflow', 'visible')
          .attr('orient', 'auto')
          .append('path')
          .attr('d', `M 2 2 L ${markerSize - 2} ${markerSize / 2} L 2 ${markerSize - 2} z`)
          .attr('fill', edgeMarkerColor(stroke))
          .attr('stroke', edgeMarkerColor(stroke))
          .attr('stroke-width', 2.2)
          .attr('stroke-linejoin', 'round')
      }

      return {
        edge,
        source,
        target,
        markerId,
      }
    })
    .filter(Boolean) as RenderedEdge[]

  const edgeSelection = layerEdges
    .selectAll<SVGPathElement, RenderedEdge>('path.edge-link')
    .data(edgeList)
    .enter()
    .append('path')
    .attr('class', 'edge-link')
    .attr('d', (d) => edgePath(d.source, d.target, d.edge))
    .attr('fill', 'none')
    .attr('stroke', (d) => d.edge.stroke ?? 'rgba(147,197,253,1)')
    .attr('stroke-width', (d) => d.edge.strokeWidth ?? 2.6)
    .attr('stroke-linecap', 'round')
    .attr('stroke-linejoin', 'round')
    .attr('stroke-dasharray', (d) => (d.edge.dashed ? '6 6' : null))
    .attr('marker-end', (d) => (d.edge.arrow === false ? null : `url(#${d.markerId})`))

  const edgeLabelSelection = layerEdgeLabels
    .selectAll<SVGGElement, RenderedEdge>('.edge-label')
    .data(edgeList.filter((d) => d.edge.label))
    .enter()
    .append('g')
    .attr('class', 'edge-label')

  edgeLabelSelection.each(function (d) {
    const source = d.source
    const target = d.target
    const { x1, y1, x2, y2 } = edgeEndpoints(source, target, d.edge)
    const mx = (x1 + x2) / 2
    const my = (y1 + y2) / 2
    const label = d.edge.label!
    const lines = label.split('\n')
    const padX = 10
    const padY = 6
    const fontSize = 12
    const fontWeight = 700
    const lineHeight = Math.max(14, Math.round(fontSize * 1.15))
    const approxW = Math.min(
      260,
      Math.max(
        76,
        Math.max(...lines.map((line) => Math.max(1, line.length))) * 7 + padX * 2,
      ),
    )
    const approxH = lines.length * lineHeight + padY * 2

    const p = d3.select(this)
    p.append('rect')
      .attr('x', mx - approxW / 2)
      .attr('y', my - approxH / 2)
      .attr('width', approxW)
      .attr('height', approxH)
      .attr('rx', 14)
      .attr('ry', 14)
      .attr('fill', 'rgba(11, 18, 32, 0.88)')
      .attr('stroke', 'rgba(255,255,255,0.16)')
      .attr('stroke-width', 1)

    drawMultilineTextCentered(p, {
      x: mx,
      y: my,
      text: label,
      fontSize,
      fontWeight,
      fill: vizTheme.textMuted,
    })
  })

  const textLineHeight = (fontSize: number) => Math.max(14, Math.round(fontSize * 1.15))

  const clampNodeToCanvas = (node: ResolvedNode) => {
    const xPad = nodeHalfAxis(node, 'x') + 6
    const yPad = nodeHalfAxis(node, 'y') + 6
    node.cx = Math.max(margin + xPad, Math.min(baseW - margin - xPad, node.cx))
    node.cy = Math.max(margin + yPad, Math.min(baseH - margin - yPad, node.cy))
  }

  const syncNodeGeometry = (node: ResolvedNode, g: d3.Selection<SVGGElement, ResolvedNode, SVGGElement, unknown>) => {
    const v = node.variant ?? 'primary'
    const defaults = variantStyles[v]
    const text = node.text ?? defaults.text
    const fontSize = node.fontSize ?? 14
    const lineHeight = textLineHeight(fontSize)
    const lines = node.label.split('\n')
    const startY = node.cy - ((lines.length - 1) * lineHeight) / 2

    const shape = g.select('.node-shape')
    const label = g.select('.node-text')

    if (node.shape === 'circle') {
      shape
        .attr('cx', node.cx)
        .attr('cy', node.cy)
      label
        .attr('fill', text)
        .attr('x', node.cx)
        .attr('y', startY)
    }
    else {
      const x = node.cx - node.w / 2
      const y = node.cy - node.h / 2
      shape
        .attr('x', x)
        .attr('y', y)
      label
        .attr('fill', text)
        .attr('x', node.cx)
        .attr('y', startY)
    }

    const labels = g.selectAll('tspan')
    labels.each((_, i, tspans) => {
      d3.select(tspans[i]).text(lines[i] ?? '')
    })
  }

  const syncLabelGeometry = (d: RenderedEdge, g: d3.Selection<SVGGElement, RenderedEdge, SVGGElement, unknown>) => {
    const { x1, y1, x2, y2 } = edgeEndpoints(d.source, d.target, d.edge)
    const mx = (x1 + x2) / 2
    const my = (y1 + y2) / 2
    const label = d.edge.label ?? ''
    const lines = label.split('\n')
    const padX = 10
    const padY = 6
    const fontSize = 12
    const lineHeight = textLineHeight(fontSize)
    const approxW = Math.min(
      260,
      Math.max(
        76,
        Math.max(...lines.map((line) => Math.max(1, line.length))) * 7 + padX * 2,
      ),
    )
    const approxH = lines.length * lineHeight + padY * 2

    const box = g.select('rect')
    const text = g.select('text')

    box
      .attr('x', mx - approxW / 2)
      .attr('y', my - approxH / 2)
      .attr('width', approxW)
      .attr('height', approxH)

    text
      .attr('x', mx)
      .attr('y', my - ((lines.length - 1) * lineHeight) / 2)

    const labels = text.selectAll('tspan')
    labels.each((_, i, tspans) => {
      d3.select(tspans[i]).text(lines[i] ?? '')
    })
  }

  const refreshGraphGeometry = () => {
    nodeG.each(function (node) {
      syncNodeGeometry(node, d3.select(this))
    })
    edgeSelection
      .attr('d', (d) => edgePath(d.source, d.target, d.edge))
    edgeLabelSelection.each(function (d) {
      syncLabelGeometry(d, d3.select(this))
    })
  }

  // Nodes
  const nodeG = layerNodes
    .selectAll<SVGGElement, ResolvedNode>('g.node')
    .data(nodes)
    .enter()
    .append('g')
    .attr('class', 'node')

  nodeG.each(function (node: ResolvedNode) {
    const v = node.variant ?? 'primary'
    const defaults = variantStyles[v]
    const fill = node.fill ?? defaults.fill
    const stroke = node.stroke ?? defaults.stroke
    const text = node.text ?? defaults.text
    const strokeWidth = defaults.strokeWidth

    const g = d3.select(this)

    if (node.shape === 'circle') {
      g
        .append('circle')
        .attr('class', 'node-shape')
        .attr('cx', node.cx)
        .attr('cy', node.cy)
        .attr('r', Math.min(node.w, node.h) / 2)
        .attr('fill', fill)
        .attr('stroke', stroke)
        .attr('stroke-width', strokeWidth)
        .attr('data-base-stroke-width', strokeWidth.toString())

      drawTextCentered(g, node, text)
      return
    }

    const rx = node.shape === 'pill' ? Math.min(node.h / 2, 24) : 16
    const x = node.cx - node.w / 2
    const y = node.cy - node.h / 2

    g
      .append('rect')
      .attr('class', 'node-shape')
      .attr('x', x)
      .attr('y', y)
      .attr('width', node.w)
      .attr('height', node.h)
      .attr('rx', rx)
      .attr('ry', rx)
      .attr('fill', fill)
      .attr('stroke', stroke)
      .attr('stroke-width', strokeWidth)
      .attr('data-base-stroke-width', strokeWidth.toString())

    drawTextCentered(g, node, text)
  })

  nodeG.each((node) => {
    clampNodeToCanvas(node)
  })
  refreshGraphGeometry()

  const showTooltip = (event: PointerEvent, node: ResolvedNode) => {
    const neighbors = connected.get(node.id) ?? new Set<string>()
    const preview = [...neighbors].slice(0, 4)
    const more = neighbors.size > 4 ? ` (+${neighbors.size - 4})` : ''
    const lines = [`${node.label}`, preview.length ? `Connected: ${preview.join(', ')}${more}` : 'No links']
    const rootBounds = container.value!.getBoundingClientRect()
    tooltip
      .style('opacity', 1)
      .html(lines.join('\\n'))
      .style('left', `${Math.min(event.offsetX + 12, rootBounds.width - 210)}px`)
      .style('top', `${Math.min(event.offsetY + 10, rootBounds.height - 56)}px`)
  }
  const hideTooltip = () => tooltip.style('opacity', 0)

  let pinnedNodeId: string | null = null
  const edgeStyle = (value?: string) => value ?? '#8BA3B8'

  const focus = (nodeId: string | null, edgeFocus: RenderedEdge | null = null) => {
    const activeNeighbors = nodeId ? connected.get(nodeId) ?? new Set() : null
    const activeEdgeNeighbors = edgeFocus ? new Set([edgeFocus.source.id, edgeFocus.target.id]) : null
    const isActive = !!nodeId || !!edgeFocus

    nodeG.each(function (node) {
      const isPrimary = node.id === nodeId
      const isNeighbor = activeNeighbors
        ? activeNeighbors.has(node.id)
        : activeEdgeNeighbors
          ? activeEdgeNeighbors.has(node.id)
          : false
      const keepVisible = !isActive || isPrimary || isNeighbor
      const shape = d3.select(this).select('.node-shape')
      const label = d3.select(this).select('.node-text')
      const baseWidth = Number(shape.attr('data-base-stroke-width') ?? 2)

      shape
        .attr('opacity', keepVisible ? 1 : 0.22)
        .attr('stroke-width', isPrimary ? baseWidth + 1.5 : isNeighbor ? baseWidth + 0.5 : baseWidth)
      label.attr('opacity', keepVisible ? 1 : 0.4)
    })

    edgeSelection.each(function (d) {
      const isConnected = !isActive
        || d.source.id === nodeId
        || d.target.id === nodeId
        || d === edgeFocus
      d3.select(this)
        .attr('opacity', isConnected ? 1 : 0.18)
        .attr('stroke-width', (d.edge.strokeWidth ?? 2.6) + (isConnected && isActive ? 1.1 : 0))
    })

    edgeLabelSelection.attr('opacity', isActive ? 0.18 : 1)
    if (isActive) {
      edgeLabelSelection.each(function (d) {
        const isConnected = d === edgeFocus || (nodeId ? d.source.id === nodeId || d.target.id === nodeId : false)
        d3.select(this).attr('opacity', isConnected ? 1 : 0.18)
      })
    }
  }

  nodeG
    .style('cursor', 'grab')
    .on('mouseover', (event, node) => {
      if (!pinnedNodeId) {
        focus(node.id)
      }
      showNodeTooltip(event as PointerEvent, node)
    })
    .on('mousemove', (event, node) => {
      if (tooltip.style('opacity') !== '0') {
        showNodeTooltip(event as PointerEvent, node)
      }
    })
    .on('mouseleave', () => {
      if (!pinnedNodeId) {
        focus(null)
      }
      hideTooltip()
    })
    .on('click', (_event, node) => {
      pinnedNodeId = pinnedNodeId === node.id ? null : node.id
      focus(pinnedNodeId)
      if (!pinnedNodeId)
        hideTooltip()
    })
    .call(
      d3
        .drag<SVGGElement, ResolvedNode, SVGGElement>()
        .on('start', (event) => {
          pinnedNodeId = null
          focus(null)
          hideTooltip()
          d3.select(event.sourceEvent.currentTarget as SVGElement).attr('cursor', 'grabbing')
        })
        .on('drag', (event, d) => {
          d.cx = event.x
          d.cy = event.y
          clampNodeToCanvas(d)
          refreshGraphGeometry()
          if (tooltip.style('opacity') !== '0') {
            showNodeTooltip(event.sourceEvent as PointerEvent, d)
          }
        })
        .on('end', (event) => {
          d3.select(event.sourceEvent.currentTarget as SVGElement).attr('cursor', 'grab')
        }),
    )

  edgeSelection
    .style('cursor', 'pointer')
    .on('mouseover', (event, d) => {
      if (!pinnedNodeId) {
        focus(null, d)
      }
      showEdgeTooltip(event as PointerEvent, d)
    })
    .on('mousemove', (event, d) => {
      if (tooltip.style('opacity') !== '0') {
        showEdgeTooltip(event as PointerEvent, d)
      }
    })
    .on('mouseleave', () => {
      if (!pinnedNodeId) {
        focus(null)
      }
      hideTooltip()
    })

  // Auto-fit: scale and center using deterministic bounds (avoids getBBox flicker on hidden slides).
  const bounds = computeSceneBounds(nodes, groups, edges, nodeById)
  const viewportH = container.value?.clientHeight ?? 0
  const viewportW = container.value?.clientWidth ?? 0
  const hasSlackHeight = viewportH <= 0 || viewportH >= baseH + 110
  const hasSlackWidth = viewportW <= 0 || viewportW >= baseW + 100
  const hasBoundsSlack = (bounds?.h ?? 0) <= baseH - 56
  const shouldFit = !!bounds
    && !isCompact
    && hasSlackHeight
    && hasSlackWidth
    && hasBoundsSlack

  if (shouldFit) {
    const pad = isCompact ? 22 : 30

    // Fit tightly to content bounds (maximizes readability). We intentionally do NOT
    // expand to match viewport ratio, because that shrinks marks and makes arrows hard to see.
    const x = bounds.x - pad
    const y = bounds.y - pad
    const w = bounds.w + pad * 2
    const h = bounds.h + pad * 2
    svg.attr('viewBox', `${x} ${y} ${Math.max(1, w)} ${Math.max(1, h)}`)
  }

  focus(null)
}

onMounted(render)
watch(
  () => props.diagram,
  () => render(),
)
onBeforeUnmount(() => {
  if (!container.value) return
  d3.select(container.value).selectAll('*').remove()
})
</script>

<template>
  <div ref="container" :class="['viz-frame', { 'viz-fill': fullscreen }]" />
</template>
