<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import * as d3 from 'd3'
import type { DiagramEdge, DiagramGroup, DiagramNode, DiagramSpec } from './concept-diagrams'
import { conceptDiagrams } from './concept-diagrams'
import { vizTheme } from './theme'

const props = defineProps<{
  diagram: string
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

function edgeEndpoints(source: ResolvedNode, target: ResolvedNode) {
  const dx = target.cx - source.cx
  const dy = target.cy - source.cy
  const gapH = Math.abs(dx) - (source.w / 2 + target.w / 2)
  const gapV = Math.abs(dy) - (source.h / 2 + target.h / 2)

  // Prefer the dominant direction, but avoid choosing an orientation where marks overlap on that axis.
  // This keeps arrowheads outside nodes and preserves a visible line segment.
  const preferH = Math.abs(dx) >= Math.abs(dy)
  const minGap = 10
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

  if (orient === 'h') {
    const sign = dx >= 0 ? 1 : -1
    return {
      x1: source.cx + sign * (source.w / 2),
      y1: source.cy,
      x2: target.cx - sign * (target.w / 2),
      y2: target.cy,
      orient,
    }
  }

  const sign = dy >= 0 ? 1 : -1
  return {
    x1: source.cx,
    y1: source.cy + sign * (source.h / 2),
    x2: target.cx,
    y2: target.cy - sign * (target.h / 2),
    orient,
  }
}

function edgePath(source: ResolvedNode, target: ResolvedNode) {
  const { x1, y1, x2, y2, orient } = edgeEndpoints(source, target)
  if (orient === 'h') {
    const mx = (x1 + x2) / 2
    return `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`
  }
  const my = (y1 + y2) / 2
  return `M ${x1} ${y1} C ${x1} ${my}, ${x2} ${my}, ${x2} ${y2}`
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
    const { x1, y1, x2, y2 } = edgeEndpoints(source, target)
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
  d3.select(container.value).selectAll('*').remove()

  const spec = getSpec(props.diagram)
  const width = spec.width ?? 960
  const height = spec.height
  const isCompact = container.value.classList.contains('viz-compact')
  const margin = isCompact ? 16 : 18
  const collisionGap = isCompact ? 10 : 14

  const nodes = resolveNodes(spec, width, height, margin)
  relaxOverlaps(nodes, width, height, margin, collisionGap)
  const nodeById = new Map(nodes.map((n) => [n.id, n]))
  const groups = resolveGroups(spec.groups, width, height, margin)
  const edges = spec.edges ?? []

  const svg = d3
    .select(container.value)
    .append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('preserveAspectRatio', 'xMidYMid meet')
    .attr('role', 'img')
    .attr('aria-label', spec.ariaLabel)
    .style('font-family', 'inherit')

  const defs = svg.append('defs')

  const arrowId = `arrow-${uid}`
  defs
    .append('marker')
    .attr('id', arrowId)
    .attr('markerUnits', 'userSpaceOnUse')
    .attr('viewBox', '0 0 10 10')
    .attr('refX', 10)
    .attr('refY', 5)
    .attr('markerWidth', 8)
    .attr('markerHeight', 8)
    .attr('orient', 'auto-start-reverse')
    .append('path')
    .attr('d', 'M 0 0 L 10 5 L 0 10 z')
    .attr('fill', 'rgba(147,197,253,0.92)')

  const scene = svg.append('g').attr('class', 'scene')
  const layerGroups = scene.append('g').attr('class', 'groups')
  const layerEdges = scene.append('g').attr('class', 'edges').style('pointer-events', 'none')
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
        .attr('y', g.y + 18)
        .attr('text-anchor', 'middle')
        .attr('fill', vizTheme.textMuted)
        .style('font-size', '12px')
        .style('font-weight', '650')
        .style('font-family', 'inherit')
        .text(g.label)
    }
  }

  // Edge lines/arrows (behind nodes to avoid drawing over marks).
  for (const edge of edges) {
    const source = nodeById.get(edge.from)
    const target = nodeById.get(edge.to)
    if (!source || !target) continue

    const stroke = edge.stroke ?? 'rgba(147,197,253,0.76)'
    const strokeWidth = edge.strokeWidth ?? 2.2
    const arrow = edge.arrow ?? true

    layerEdges
      .append('path')
      .attr('d', edgePath(source, target))
      .attr('fill', 'none')
      .attr('stroke', stroke)
      .attr('stroke-width', strokeWidth)
      .attr('stroke-linecap', 'round')
      .attr('stroke-linejoin', 'round')
      .attr('stroke-dasharray', edge.dashed ? '6 6' : null)
      .attr('marker-end', arrow ? `url(#${arrowId})` : null)
      .attr('opacity', edge.dashed ? 0.85 : 1)
  }

  // Edge labels (above lines, still behind nodes).
  for (const edge of edges) {
    const source = nodeById.get(edge.from)
    const target = nodeById.get(edge.to)
    if (!source || !target) continue
    if (!edge.label) continue

    const { x1, y1, x2, y2 } = edgeEndpoints(source, target)
    const mx = (x1 + x2) / 2
    const my = (y1 + y2) / 2
    const label = edge.label
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

    const p = layerEdgeLabels.append('g').attr('class', 'edge-label')
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
  }

  // Nodes
  const nodeG = layerNodes
    .selectAll('g.node')
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
      const r = Math.min(node.w, node.h) / 2
      g.append('circle')
        .attr('cx', node.cx)
        .attr('cy', node.cy)
        .attr('r', r)
        .attr('fill', fill)
        .attr('stroke', stroke)
        .attr('stroke-width', strokeWidth)

      drawTextCentered(g, node, text)
      return
    }

    const rx = node.shape === 'pill' ? Math.min(node.h / 2, 24) : 16
    const x = node.cx - node.w / 2
    const y = node.cy - node.h / 2

    g.append('rect')
      .attr('x', x)
      .attr('y', y)
      .attr('width', node.w)
      .attr('height', node.h)
      .attr('rx', rx)
      .attr('ry', rx)
      .attr('fill', fill)
      .attr('stroke', stroke)
      .attr('stroke-width', strokeWidth)

    drawTextCentered(g, node, text)
  })

  // Auto-fit: scale and center using deterministic bounds (avoids getBBox flicker on hidden slides).
  const bounds = computeSceneBounds(nodes, groups, edges, nodeById)
  if (bounds) {
    const pad = isCompact ? 8 : 10
    const safeW = Math.max(1, width - pad * 2)
    const safeH = Math.max(1, height - pad * 2)

    const scaleX = safeW / bounds.w
    const scaleY = safeH / bounds.h
    // Never scale up. This avoids huge/overlapping text when fonts are still loading and
    // computed bounds are underestimated on first render (common during Slidev export).
    const scale = Math.min(scaleX, scaleY, 1)

    const cx = bounds.x + bounds.w / 2
    const cy = bounds.y + bounds.h / 2
    const tx = width / 2 - cx * scale
    const ty = height / 2 - cy * scale

    scene.attr('transform', `translate(${tx},${ty}) scale(${scale})`)
  }
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
  <div ref="container" class="viz-frame" />
</template>
