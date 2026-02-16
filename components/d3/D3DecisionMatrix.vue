<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import * as d3 from 'd3'
import { vizTheme } from './theme'

type TableMode = 'comparison' | 'representation'

type ComparisonRow = {
  question: string
  best: string
  avoid: string
  rationale: string
}

type RepresentationRow = {
  question: string
  nodeLink: string
  matrix: string
  rationale: string
}

const props = defineProps<{
  mode?: TableMode
}>()

const mode = computed<TableMode>(() => props.mode ?? 'comparison')
const container = ref<HTMLDivElement | null>(null)

const comparisonRows: ComparisonRow[] = [
  {
    question: 'Which is largest / smallest?',
    best: 'Ordered bars, sorted dot marks',
    avoid: 'Pie charts, unlabelled donut',
    rationale: 'A ranking task needs explicit baseline and stable ordering.',
  },
  {
    question: 'Which changed most?',
    best: 'Paired bars, slope chart, dumbbells',
    avoid: 'Area fill without baseline labels',
    rationale: 'Change is a delta question; compare pre/post positions consistently.',
  },
  {
    question: 'How different are all pairs?',
    best: 'Heatmap, matrix of deltas, clustered small multiples',
    avoid: 'Single 2D scatter unless pairs are continuous',
    rationale: 'Pairwise structure needs explicit lattice or matrix semantics.',
  },
]

const representationRows: RepresentationRow[] = [
  {
    question: 'Need path trace',
    nodeLink: '✔',
    matrix: '✖',
    rationale: 'Path semantics are topological; matrix is edge-presence oriented.',
  },
  {
    question: 'Need cluster density',
    nodeLink: '△',
    matrix: '✔',
    rationale: 'Matrix makes dense blocks obvious under ordering transforms.',
  },
  {
    question: 'Need clear node labels',
    nodeLink: '✔',
    matrix: '✖ (many nodes)',
    rationale: 'Node-link reads local neighborhoods and names first.',
  },
  {
    question: 'Need weighted connectivity overview',
    nodeLink: '△',
    matrix: '✔',
    rationale: 'Weights are readable as cell intensity and bandwidth in a matrix.',
  },
]

function textLines(text: string, maxChars: number) {
  const words = text.split(' ')
  const lines: string[] = []
  let line = ''
  for (const word of words) {
    if ((line + word).length > maxChars && line.length > 0) {
      lines.push(line.trim())
      line = `${word} `
    }
    else {
      line += `${word} `
    }
  }
  if (line.trim()) lines.push(line.trim())
  return lines
}

function render() {
  if (!container.value) return
  const spec = mode.value === 'comparison'
    ? {
        columns: ['Question', 'Best primary encoding', 'Avoid'],
        rows: comparisonRows,
      }
    : {
        columns: ['Question', 'Prefer node-link', 'Prefer matrix'],
        rows: representationRows,
      }

  d3.select(container.value).selectAll('*').remove()

  const width = 940
  const headerHeight = 56
  const detailHeight = 112
  const rowHeight = 78
  const contentHeight = headerHeight + rowHeight * spec.rows.length + detailHeight
  const height = contentHeight
  const pad = 18
  const colWidths = [0.36, 0.33, 0.31]

  let activeIndex = 0
  let hoverIndex = -1

  const svg = d3
    .select(container.value)
    .append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('role', 'img')
    .attr('aria-label', `Interactive decision matrix for ${mode.value}`)
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
    .attr('stroke-width', 1.1)

  svg
    .append('text')
    .attr('x', 24)
    .attr('y', 26)
    .attr('fill', vizTheme.text)
    .style('font-size', '16px')
    .style('font-weight', '850')
    .text(spec.columns.join('  →  '))

  const colX: number[] = []
  let acc = 0
  for (let i = 0; i < colWidths.length; i++) {
    colX.push(acc)
    acc += colWidths[i]
  }
  const innerW = width - pad * 2
  const x = (i: number) => pad + colX[i] * innerW
  const cw = (i: number) => colWidths[i] * innerW - 12

  const headerG = svg.append('g').attr('class', 'header')
  headerG
    .selectAll('rect')
    .data(spec.columns)
    .enter()
    .append('rect')
    .attr('x', (_, i) => x(i))
    .attr('y', 42)
    .attr('width', (_, i) => cw(i))
    .attr('height', 26)
    .attr('rx', 12)
    .attr('fill', 'rgba(148,163,184,0.18)')

  headerG
    .selectAll('text')
    .data(spec.columns)
    .enter()
    .append('text')
    .attr('x', (_, i) => x(i) + 12)
    .attr('y', 60)
    .attr('fill', vizTheme.textMuted)
    .style('font-size', '12px')
    .style('font-weight', '750')
    .text((d) => d)

  const rowsG = svg
    .append('g')
    .attr('class', 'rows')
    .attr('transform', `translate(0,${headerHeight + 22})`)

  const rows = rowsG
    .selectAll<SVGGElement, ComparisonRow | RepresentationRow>('g.row')
    .data(spec.rows as Array<ComparisonRow & RepresentationRow>)
    .enter()
    .append('g')
    .attr('class', 'row')

  rows.attr('transform', (_, i) => `translate(0, ${i * rowHeight})`)

  rows
    .append('rect')
    .attr('x', pad)
    .attr('y', 6)
    .attr('width', width - pad * 2)
    .attr('height', rowHeight - 10)
    .attr('rx', 14)
    .attr('fill', 'rgba(255,255,255,0.015)')
    .attr('stroke', 'rgba(255,255,255,0.08)')

  rows.each(function (row, rowIndex) {
    const g = d3.select(this)
    const item = row as ComparisonRow & RepresentationRow
    const values =
      mode.value === 'comparison'
        ? [
            item.question,
            item.best,
            item.avoid,
          ]
        : [
            item.question,
            item.nodeLink ?? item.best,
            item.matrix ?? item.avoid,
          ]

    g.selectAll('text')
      .data(values)
      .enter()
      .append('g')
      .each(function (value, colIndex) {
        const tx = x(colIndex) + 12
        const ty = 30
        const maxChars = 42
        const lines = textLines(value, maxChars)
        const text = d3.select(this)
          .attr('opacity', 1)

        lines.forEach((line, lineIndex) => {
          text
            .append('text')
            .attr('x', tx)
            .attr('y', ty + lineIndex * 18)
            .attr('fill', vizTheme.textMuted)
            .style('font-size', colIndex === 0 ? '12px' : '11px')
            .style('font-weight', colIndex === 0 ? 650 : 600)
            .text(line)
        })
      })

    g.style('cursor', 'pointer')
      .on('pointerenter', () => {
        hoverIndex = rowIndex
        updateState()
      })
      .on('pointerleave', () => {
        hoverIndex = -1
        updateState()
      })
      .on('click', () => {
        activeIndex = rowIndex
        updateState()
      })
  })

  const detailG = svg.append('g').attr('transform', `translate(${pad},${height - detailHeight + 24})`)
  detailG
    .append('text')
    .attr('x', 0)
    .attr('y', 0)
    .attr('fill', vizTheme.textMuted)
    .style('font-size', '11px')
    .style('font-weight', '650')
    .text('Hover and click rows to compare rationale and trade-offs.')

  const title = detailG
    .append('text')
    .attr('x', 0)
    .attr('y', 26)
    .attr('fill', vizTheme.text)
    .style('font-size', '15px')
    .style('font-weight', '800')

  const rationale = detailG
    .append('g')
    .attr('transform', 'translate(0,38)')
  const rationaleText = rationale
    .append('text')
    .attr('x', 0)
    .attr('y', 0)
    .attr('fill', vizTheme.textMuted)
    .style('font-size', '12px')
    .style('font-weight', '650')

  const legend = svg.append('g').attr('transform', `translate(${width - 280},${60})`)
  const legendItems = mode.value === 'comparison'
    ? [
        ['● ordered / ranked', vizTheme.primary],
        ['● avoid overloaded scale', vizTheme.orange],
      ]
    : [
        ['node-link', vizTheme.primary],
        ['matrix', vizTheme.cyan],
      ]

  legend
    .selectAll('g')
    .data(legendItems)
    .enter()
    .append('g')
    .attr('transform', (_, i) => `translate(0,${i * 16})`)
    .each(function (d, i) {
      const g = d3.select(this)
      g.append('circle')
        .attr('cx', 0)
        .attr('cy', -2)
        .attr('r', 4)
        .attr('fill', d[1])

      g.append('text')
        .attr('x', 10)
        .attr('y', 2)
        .attr('fill', vizTheme.textMuted)
        .style('font-size', '11px')
        .style('font-weight', '700')
        .text(d[0])
    })

  function updateState() {
    const current = hoverIndex >= 0 ? hoverIndex : activeIndex
    const active = spec.rows[current]!

    rows.each(function (_, i) {
      const g = d3.select(this)
      const isActive = i === activeIndex || i === hoverIndex
      g.select('rect')
        .attr('fill', isActive ? 'rgba(34, 211, 238, 0.14)' : 'rgba(255,255,255,0.015)')
        .attr('stroke', isActive ? 'rgba(34, 211, 238, 0.55)' : 'rgba(255,255,255,0.08)')
        .attr('stroke-width', isActive ? 1.4 : 1)
    })

    title.text(active.question)
    rationaleText.selectAll('*').remove()

    const lines = textLines(active.rationale, 84)
    lines.forEach((line, i) => {
      rationaleText
        .append('tspan')
        .attr('x', 0)
        .attr('y', 16 + i * 17)
        .text(line)
    })
  }

  updateState()
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
