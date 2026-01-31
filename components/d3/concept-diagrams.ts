import { vizTheme } from './theme'

export type DiagramNode = {
  id: string
  label: string
  x: number
  y: number
  w?: number
  h?: number
  shape?: 'rect' | 'pill' | 'circle'
  variant?: 'primary' | 'note' | 'ok' | 'warn' | 'muted' | 'accent'
  fill?: string
  stroke?: string
  text?: string
  fontSize?: number
  fontWeight?: number
}

export type DiagramEdge = {
  from: string
  to: string
  label?: string
  dashed?: boolean
  arrow?: boolean
  stroke?: string
  strokeWidth?: number
}

export type DiagramGroup = {
  id: string
  label?: string
  x: number
  y: number
  w: number
  h: number
  fill?: string
  stroke?: string
}

export type DiagramSpec = {
  width?: number
  height: number
  ariaLabel: string
  relax?: boolean
  nodes: DiagramNode[]
  edges?: DiagramEdge[]
  groups?: DiagramGroup[]
}

const boxFill = '#0F1B2D'
const noteFill = '#111C2E'
const warnFill = '#1B0F19'

export const conceptDiagrams: Record<string, DiagramSpec> = {
  'viz-pipeline': {
    height: 460,
    ariaLabel: 'Visualization pipeline showing where errors enter: data, encoding, perception, interpretation, action.',
    nodes: [
      { id: 'D', label: 'Data\n(measurements)', x: 0.09, y: 0.30, w: 140, h: 62, variant: 'primary' },
      { id: 'E', label: 'Encoding\n(marks + channels)', x: 0.28, y: 0.30, w: 160, h: 62, variant: 'primary' },
      { id: 'P', label: 'Perception\n(attention + comparison)', x: 0.49, y: 0.30, w: 175, h: 62, variant: 'primary' },
      { id: 'I', label: 'Interpretation\n(meaning + story)', x: 0.71, y: 0.30, w: 175, h: 62, variant: 'primary' },
      { id: 'A', label: 'Action\n(decision)', x: 0.91, y: 0.30, w: 140, h: 62, variant: 'primary' },
      { id: 'Y', label: 'Wrong transform\n(counts vs rates)', x: 0.09, y: 0.78, w: 200, h: 62, variant: 'warn' },
      { id: 'X', label: 'Wrong channel\nor wrong scale', x: 0.28, y: 0.78, w: 200, h: 62, variant: 'warn' },
      { id: 'Z', label: 'Overload\n(too much to compare)', x: 0.49, y: 0.78, w: 220, h: 62, variant: 'warn' },
    ],
    edges: [
      { from: 'D', to: 'E' },
      { from: 'E', to: 'P' },
      { from: 'P', to: 'I' },
      { from: 'I', to: 'A' },
      { from: 'D', to: 'Y', dashed: true, label: 'common failures' },
      { from: 'E', to: 'X', dashed: true, label: 'common failures' },
      { from: 'P', to: 'Z', dashed: true, label: 'common failures' },
    ],
  },

  'preattentive-ranking': {
    height: 280,
    ariaLabel: 'Ranking of channel effectiveness for magnitude comparison from position to hue.',
    nodes: [
      { id: 'T', label: 'More precise → less precise\n(for magnitude)', x: 0.50, y: 0.18, w: 470, h: 54, shape: 'pill', variant: 'primary' },

      { id: 'P', label: 'Position\n(common scale)', x: 0.10, y: 0.52, w: 150, h: 56, shape: 'pill', variant: 'note' },
      { id: 'L', label: 'Length', x: 0.30, y: 0.52, w: 130, h: 56, shape: 'pill', variant: 'note' },
      { id: 'AA', label: 'Angle / Area', x: 0.50, y: 0.52, w: 140, h: 56, shape: 'pill', variant: 'note' },
      { id: 'CL', label: 'Color lightness', x: 0.70, y: 0.52, w: 150, h: 56, shape: 'pill', variant: 'note' },
      { id: 'H', label: 'Hue\n(for groups)', x: 0.90, y: 0.52, w: 150, h: 56, shape: 'pill', variant: 'ok' },

      { id: 'B', label: 'Use hue for grouping,\nnot “how much”', x: 0.50, y: 0.84, w: 470, h: 54, shape: 'pill', variant: 'ok' },
    ],
    edges: [
      { from: 'P', to: 'L' },
      { from: 'L', to: 'AA' },
      { from: 'AA', to: 'CL' },
      { from: 'CL', to: 'H' },
    ],
  },

  'gestalt-mindmap': {
    height: 480,
    ariaLabel: 'Mindmap of Gestalt grouping principles: proximity, similarity, enclosure, connection, continuity, and figure-ground.',
    nodes: [
      { id: 'root', label: 'Grouping', x: 0.50, y: 0.52, w: 120, h: 120, shape: 'circle', fill: '#223B6B', stroke: '#223B6B', text: vizTheme.text },

      { id: 'prox', label: 'Proximity', x: 0.50, y: 0.22, w: 150, h: 46, shape: 'pill', stroke: vizTheme.primary },
      { id: 'proxQ', label: '“Near = same group”', x: 0.50, y: 0.08, w: 240, h: 46, shape: 'pill', stroke: vizTheme.primary },

      { id: 'cont', label: 'Continuity', x: 0.73, y: 0.38, w: 160, h: 46, shape: 'pill', stroke: '#B91C1C' },
      { id: 'contQ', label: '“Follow smooth paths”', x: 0.83, y: 0.28, w: 250, h: 46, shape: 'pill', stroke: '#B91C1C' },

      { id: 'sim', label: 'Similarity', x: 0.72, y: 0.62, w: 160, h: 46, shape: 'pill', stroke: '#6B21A8' },
      { id: 'simQ', label: '“Same color/shape = same\ncategory”', x: 0.86, y: 0.66, w: 300, h: 56, shape: 'pill', stroke: '#6B21A8' },

      { id: 'conn', label: 'Connection', x: 0.50, y: 0.76, w: 170, h: 46, shape: 'pill', stroke: '#B45309' },
      { id: 'connQ', label: '“Line/link = relationship”', x: 0.50, y: 0.92, w: 300, h: 46, shape: 'pill', stroke: '#B45309' },

      { id: 'fig', label: 'Figure–ground', x: 0.28, y: 0.60, w: 190, h: 46, shape: 'pill', stroke: '#6B21A8' },
      { id: 'figQ', label: '“Foreground vs background”', x: 0.18, y: 0.58, w: 300, h: 46, shape: 'pill', stroke: '#6B21A8' },

      { id: 'enc', label: 'Enclosure', x: 0.33, y: 0.36, w: 170, h: 46, shape: 'pill', stroke: '#475569', fill: 'rgba(148,163,184,0.18)' },
      { id: 'encQ', label: '“Box/region = subgroup”', x: 0.16, y: 0.26, w: 280, h: 46, shape: 'pill', stroke: '#475569', fill: 'rgba(148,163,184,0.18)' },
    ],
    edges: [
      { from: 'root', to: 'prox', stroke: vizTheme.primary, strokeWidth: 8, arrow: false },
      { from: 'prox', to: 'proxQ', stroke: vizTheme.primary, strokeWidth: 4, arrow: false },

      { from: 'root', to: 'cont', stroke: '#B91C1C', strokeWidth: 8, arrow: false },
      { from: 'cont', to: 'contQ', stroke: '#B91C1C', strokeWidth: 4, arrow: false },

      { from: 'root', to: 'sim', stroke: '#6B21A8', strokeWidth: 8, arrow: false },
      { from: 'sim', to: 'simQ', stroke: '#6B21A8', strokeWidth: 4, arrow: false },

      { from: 'root', to: 'conn', stroke: '#B45309', strokeWidth: 8, arrow: false },
      { from: 'conn', to: 'connQ', stroke: '#B45309', strokeWidth: 4, arrow: false },

      { from: 'root', to: 'fig', stroke: '#6B21A8', strokeWidth: 8, arrow: false },
      { from: 'fig', to: 'figQ', stroke: '#6B21A8', strokeWidth: 4, arrow: false },

      { from: 'root', to: 'enc', stroke: '#64748B', strokeWidth: 8, arrow: false },
      { from: 'enc', to: 'encQ', stroke: '#64748B', strokeWidth: 4, arrow: false },
    ],
  },

  'proximity-grouping': {
    height: 320,
    ariaLabel: 'Example of proximity grouping with three clusters A, B, and C.',
    groups: [
      { id: 'GA', label: 'Group A', x: 0.08, y: 0.38, w: 0.50, h: 0.32, stroke: vizTheme.primary },
      { id: 'GC', label: 'Group C', x: 0.46, y: 0.10, w: 0.46, h: 0.22, stroke: vizTheme.primary },
      { id: 'GB', label: 'Group B', x: 0.38, y: 0.72, w: 0.56, h: 0.22, stroke: vizTheme.primary },
    ],
    nodes: [
      { id: 'a1', label: '', x: 0.16, y: 0.52, w: 84, h: 46, variant: 'note' },
      { id: 'a2', label: '', x: 0.30, y: 0.52, w: 84, h: 46, variant: 'note' },
      { id: 'a3', label: '', x: 0.44, y: 0.52, w: 84, h: 46, variant: 'note' },

      { id: 'c1', label: '', x: 0.54, y: 0.20, w: 84, h: 46, variant: 'note' },
      { id: 'c2', label: '', x: 0.69, y: 0.20, w: 84, h: 46, variant: 'note' },
      { id: 'c3', label: '', x: 0.84, y: 0.20, w: 84, h: 46, variant: 'note' },

      { id: 'b1', label: '', x: 0.50, y: 0.80, w: 84, h: 46, variant: 'note' },
      { id: 'b2', label: '', x: 0.65, y: 0.80, w: 84, h: 46, variant: 'note' },
      { id: 'b3', label: '', x: 0.80, y: 0.80, w: 84, h: 46, variant: 'note' },
    ],
    edges: [
      { from: 'a1', to: 'a2', arrow: false, stroke: 'rgba(147,197,253,0.6)' },
      { from: 'a2', to: 'a3', arrow: false, stroke: 'rgba(147,197,253,0.6)' },
      { from: 'c1', to: 'c2', arrow: false, stroke: 'rgba(147,197,253,0.6)' },
      { from: 'c2', to: 'c3', arrow: false, stroke: 'rgba(147,197,253,0.6)' },
      { from: 'b1', to: 'b2', arrow: false, stroke: 'rgba(147,197,253,0.6)' },
      { from: 'b2', to: 'b3', arrow: false, stroke: 'rgba(147,197,253,0.6)' },
    ],
  },

  'similarity-categories': {
    height: 280,
    ariaLabel: 'Example of similarity grouping where color creates categories A, B, and C.',
    nodes: [
      { id: 'A1', label: 'Category A', x: 0.18, y: 0.22, w: 160, h: 54, fill: '#1D4ED8', stroke: '#93C5FD', text: vizTheme.text },
      { id: 'A2', label: 'Category A', x: 0.42, y: 0.22, w: 160, h: 54, fill: '#1D4ED8', stroke: '#93C5FD', text: vizTheme.text },
      { id: 'A3', label: 'Category A', x: 0.66, y: 0.22, w: 160, h: 54, fill: '#1D4ED8', stroke: '#93C5FD', text: vizTheme.text },

      { id: 'B1', label: 'Category B', x: 0.18, y: 0.52, w: 160, h: 54, fill: '#0F766E', stroke: '#5EEAD4', text: vizTheme.text },
      { id: 'B2', label: 'Category B', x: 0.42, y: 0.52, w: 160, h: 54, fill: '#0F766E', stroke: '#5EEAD4', text: vizTheme.text },

      { id: 'C1', label: 'Category C', x: 0.18, y: 0.82, w: 160, h: 54, fill: '#7C3AED', stroke: '#C4B5FD', text: vizTheme.text },
      { id: 'C2', label: 'Category C', x: 0.42, y: 0.82, w: 160, h: 54, fill: '#7C3AED', stroke: '#C4B5FD', text: vizTheme.text },
    ],
    edges: [
      { from: 'A1', to: 'A2', arrow: false, stroke: 'rgba(148,163,184,0.55)' },
      { from: 'A2', to: 'A3', arrow: false, stroke: 'rgba(148,163,184,0.55)' },
      { from: 'B1', to: 'B2', arrow: false, stroke: 'rgba(148,163,184,0.55)' },
      { from: 'C1', to: 'C2', arrow: false, stroke: 'rgba(148,163,184,0.55)' },
    ],
  },

  'connection-enclosure': {
    height: 440,
    ariaLabel: 'Diagram showing enclosure as a panel and connection as a line implying continuity.',
    groups: [
      { id: 'panel', label: 'Enclosure: a panel creates a subgroup', x: 0.08, y: 0.20, w: 0.72, h: 0.46, stroke: vizTheme.primary },
    ],
    nodes: [
      { id: 'w8', label: 'Week 8', x: 0.18, y: 0.41, w: 120, h: 52, variant: 'note' },
      { id: 'w9', label: 'Week 9', x: 0.34, y: 0.41, w: 120, h: 52, variant: 'note' },
      { id: 'w10', label: 'Week 10', x: 0.50, y: 0.41, w: 130, h: 52, variant: 'note' },
      { id: 'w11', label: 'Week 11', x: 0.66, y: 0.41, w: 130, h: 52, variant: 'note' },
      {
        id: 'note',
        label: 'Connection: a line implies continuity\n(only connect when meaningful)',
        x: 0.84,
        y: 0.72,
        w: 330,
        h: 76,
        variant: 'primary',
      },
    ],
    edges: [
      { from: 'w8', to: 'w9', stroke: vizTheme.primary },
      { from: 'w9', to: 'w10', stroke: vizTheme.primary },
      { from: 'w10', to: 'w11', stroke: vizTheme.primary },
      { from: 'w11', to: 'note', arrow: false, stroke: 'rgba(148,163,184,0.55)' },
    ],
  },

  'visual-hierarchy': {
    height: 210,
    ariaLabel: 'Visual hierarchy from headline to highlighted marks to background details.',
    nodes: [
      { id: 'H', label: 'Headline:\nwhat matters', x: 0.22, y: 0.55, w: 250, h: 64, variant: 'primary' },
      { id: 'K', label: 'Key marks\nhighlighted', x: 0.52, y: 0.55, w: 230, h: 64, variant: 'primary' },
      { id: 'D', label: 'Details\n(background context)', x: 0.84, y: 0.55, w: 250, h: 64, variant: 'muted' },
    ],
    edges: [
      { from: 'H', to: 'K' },
      { from: 'K', to: 'D', stroke: 'rgba(148,163,184,0.55)' },
    ],
  },

  'color-dimensions': {
    height: 260,
    ariaLabel: 'Three useful dimensions of color: hue, lightness, and chroma/saturation.',
    nodes: [
      { id: 'H', label: 'Hue\n(which color)', x: 0.18, y: 0.36, w: 210, h: 64, variant: 'primary' },
      { id: 'H2', label: 'Best for categories', x: 0.18, y: 0.72, w: 220, h: 58, variant: 'note' },
      { id: 'L', label: 'Lightness\n(how bright/dark)', x: 0.50, y: 0.36, w: 250, h: 64, variant: 'primary' },
      { id: 'L2', label: 'Best for ordered\nmagnitude', x: 0.50, y: 0.72, w: 240, h: 58, variant: 'note' },
      { id: 'C', label: 'Chroma / Saturation\n(how intense)', x: 0.82, y: 0.36, w: 270, h: 64, variant: 'primary' },
      { id: 'C2', label: 'Best for emphasis,\nnot scale', x: 0.82, y: 0.72, w: 240, h: 58, variant: 'note' },
    ],
    edges: [
      { from: 'H', to: 'H2' },
      { from: 'L', to: 'L2' },
      { from: 'C', to: 'C2' },
    ],
  },

  'color-match-tree': {
    height: 360,
    ariaLabel: 'Decision tree mapping variable type to palette type and common mistakes to avoid.',
    nodes: [
      { id: 'Q', label: 'What is the\nvariable type?', x: 0.10, y: 0.52, w: 180, h: 64, variant: 'primary' },

      { id: 'C', label: 'Categorical', x: 0.34, y: 0.20, w: 180, h: 56, variant: 'ok' },
      { id: 'CH', label: 'Use distinct hues', x: 0.62, y: 0.20, w: 200, h: 56, variant: 'ok' },
      { id: 'BAD1', label: 'Avoid:\ntoo many categories\n→ legend overload', x: 0.90, y: 0.20, w: 210, h: 76, variant: 'warn' },

      { id: 'O', label: 'Ordered /\nQuantitative', x: 0.34, y: 0.52, w: 200, h: 64, variant: 'ok' },
      { id: 'SEQ', label: 'Sequential\nlightness ramp', x: 0.62, y: 0.52, w: 210, h: 64, variant: 'ok' },
      { id: 'BAD2', label: 'Avoid:\nrainbow / nonuniform\nscales', x: 0.90, y: 0.52, w: 210, h: 70, variant: 'warn' },

      { id: 'B', label: 'Baseline\ndifference', x: 0.34, y: 0.84, w: 200, h: 64, variant: 'ok' },
      { id: 'DIV', label: 'Diverging scale\ncentered at\n0/baseline', x: 0.62, y: 0.84, w: 220, h: 76, variant: 'ok' },
      { id: 'BAD3', label: 'Avoid:\nmidpoint not meaningful', x: 0.90, y: 0.84, w: 210, h: 64, variant: 'warn' },
    ],
    edges: [
      { from: 'Q', to: 'C' },
      { from: 'C', to: 'CH' },
      { from: 'CH', to: 'BAD1', stroke: 'rgba(252,165,165,0.8)' },

      { from: 'Q', to: 'O' },
      { from: 'O', to: 'SEQ' },
      { from: 'SEQ', to: 'BAD2', stroke: 'rgba(252,165,165,0.8)' },

      { from: 'Q', to: 'B' },
      { from: 'B', to: 'DIV' },
      { from: 'DIV', to: 'BAD3', stroke: 'rgba(252,165,165,0.8)' },
    ],
  },

  'accessibility-redundancy': {
    width: 720,
    height: 480,
    ariaLabel: 'Accessibility flow: don’t rely on color alone; add redundant encoding such as labels, shape, position, and contrast checks.',
    nodes: [
      { id: 'A', label: 'Assume some viewers\ncannot rely on red/green', x: 0.50, y: 0.12, w: 410, h: 64, shape: 'pill', variant: 'primary' },
      { id: 'B', label: 'Don’t encode meaning\nwith color alone', x: 0.50, y: 0.34, w: 380, h: 64, shape: 'pill', variant: 'primary' },
      { id: 'C', label: 'Add redundancy', x: 0.50, y: 0.56, w: 240, h: 56, shape: 'pill', variant: 'ok' },

      { id: 'C1', label: 'Direct labels', x: 0.30, y: 0.78, w: 240, h: 54, shape: 'pill', variant: 'ok' },
      { id: 'C2', label: 'Shape / markers', x: 0.70, y: 0.78, w: 240, h: 54, shape: 'pill', variant: 'ok' },
      { id: 'C3', label: 'Position / facets', x: 0.30, y: 0.92, w: 240, h: 54, shape: 'pill', variant: 'ok' },
      { id: 'D', label: 'Check contrast + legend', x: 0.70, y: 0.92, w: 260, h: 54, shape: 'pill', variant: 'ok' },
    ],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
      { from: 'C', to: 'C1', arrow: false, stroke: 'rgba(34,211,238,0.65)' },
      { from: 'C', to: 'C2', arrow: false, stroke: 'rgba(34,211,238,0.65)' },
      { from: 'C', to: 'C3', arrow: false, stroke: 'rgba(34,211,238,0.65)' },
      { from: 'C', to: 'D', arrow: false, stroke: 'rgba(34,211,238,0.65)' },
    ],
  },

  'legend-diverging': {
    height: 180,
    ariaLabel: 'Example of a diverging legend with a labeled midpoint at zero.',
    nodes: [
      { id: 'A', label: '-0.10', x: 0.18, y: 0.55, w: 130, h: 54, variant: 'note' },
      { id: 'B', label: '-0.05', x: 0.36, y: 0.55, w: 130, h: 54, variant: 'note' },
      { id: 'C', label: '0', x: 0.50, y: 0.55, w: 120, h: 54, variant: 'accent' },
      { id: 'D', label: '+0.05', x: 0.64, y: 0.55, w: 130, h: 54, variant: 'note' },
      { id: 'E', label: '+0.10', x: 0.82, y: 0.55, w: 130, h: 54, variant: 'note' },
    ],
    edges: [
      { from: 'A', to: 'B', arrow: false, stroke: 'rgba(148,163,184,0.55)' },
      { from: 'B', to: 'C', arrow: false, stroke: 'rgba(148,163,184,0.55)' },
      { from: 'C', to: 'D', arrow: false, stroke: 'rgba(148,163,184,0.55)' },
      { from: 'D', to: 'E', arrow: false, stroke: 'rgba(148,163,184,0.55)' },
    ],
  },

  'missing-vs-zero': {
    height: 440,
    ariaLabel: 'Decision flow showing that missing data should not be mapped to zero.',
    nodes: [
      { id: 'Q', label: 'Is the value\nmissing?', x: 0.50, y: 0.16, w: 240, h: 64, variant: 'primary' },
      { id: 'M', label: 'Show as “No data”\n(separate color/pattern)', x: 0.28, y: 0.48, w: 320, h: 76, variant: 'ok' },
      { id: 'V', label: 'Encode the value\nwith your scale', x: 0.72, y: 0.48, w: 270, h: 64, variant: 'ok' },
      { id: 'Z', label: 'Do NOT map missing\nto 0', x: 0.28, y: 0.82, w: 240, h: 64, variant: 'warn' },
    ],
    edges: [
      { from: 'Q', to: 'M', label: 'Yes' },
      { from: 'Q', to: 'V', label: 'No' },
      { from: 'M', to: 'Z', dashed: true, label: 'avoid', stroke: 'rgba(252,165,165,0.8)' },
    ],
  },

  'emphasis-highlight': {
    height: 180,
    ariaLabel: 'Example of using one accent series while other series remain neutral.',
    nodes: [
      { id: 'A', label: 'Series A', x: 0.18, y: 0.55, w: 160, h: 54, variant: 'muted' },
      { id: 'B', label: 'Series B', x: 0.38, y: 0.55, w: 160, h: 54, variant: 'muted' },
      { id: 'C', label: 'Series C', x: 0.58, y: 0.55, w: 160, h: 54, fill: '#1D4ED8', stroke: '#93C5FD', text: vizTheme.text },
      { id: 'D', label: 'Series D', x: 0.78, y: 0.55, w: 160, h: 54, variant: 'muted' },
    ],
    edges: [
      { from: 'A', to: 'B', arrow: false, stroke: 'rgba(148,163,184,0.55)' },
      { from: 'B', to: 'C', arrow: false, stroke: 'rgba(148,163,184,0.55)' },
      { from: 'C', to: 'D', arrow: false, stroke: 'rgba(148,163,184,0.55)' },
    ],
  },

  'need-color': {
    height: 260,
    ariaLabel: 'Decision flow for whether color is needed based on the task.',
    nodes: [
      { id: 'Q', label: 'Do you need\ncolor?', x: 0.50, y: 0.14, w: 220, h: 64, variant: 'primary' },
      { id: 'A', label: 'Yes:\nqualitative hues', x: 0.18, y: 0.68, w: 230, h: 64, variant: 'ok' },
      { id: 'B', label: 'Maybe not:\nuse position', x: 0.50, y: 0.68, w: 240, h: 64, variant: 'ok' },
      { id: 'C', label: 'Avoid:\nfacet or filter', x: 0.82, y: 0.68, w: 230, h: 64, variant: 'warn' },
    ],
    edges: [
      { from: 'Q', to: 'A', label: 'Grouping a few\ncategories' },
      { from: 'Q', to: 'B', label: 'Precise magnitude\ncomparison' },
      { from: 'Q', to: 'C', label: 'Many categories' },
    ],
  },

  'chart-reading-checklist': {
    height: 360,
    ariaLabel: 'An 8-step chart reading checklist from title through conclusion.',
    groups: [
      { id: 'L', label: '1–4: framing + axes', x: 0.06, y: 0.06, w: 0.42, h: 0.88, stroke: 'rgba(255,255,255,0.12)' },
      { id: 'R', label: '5–8: encoding + inference', x: 0.52, y: 0.06, w: 0.42, h: 0.88, stroke: 'rgba(255,255,255,0.12)' },
    ],
    nodes: [
      { id: 'A', label: '1. Title:\nwhat claim is being made?', x: 0.27, y: 0.22, w: 300, h: 64, variant: 'primary' },
      { id: 'B', label: '2. Data:\nwhat is measured + missing?', x: 0.27, y: 0.44, w: 300, h: 64, variant: 'primary' },
      { id: 'C', label: '3. Units:\ncounts vs rates vs %', x: 0.27, y: 0.66, w: 300, h: 64, variant: 'primary' },
      { id: 'D', label: '4. Axes:\nscale + baseline + truncation', x: 0.27, y: 0.88, w: 320, h: 64, variant: 'primary' },

      { id: 'E', label: '5. Encoding:\nposition vs area vs color', x: 0.73, y: 0.22, w: 320, h: 64, variant: 'primary' },
      { id: 'F', label: '6. Grouping:\naggregation + subgroups', x: 0.73, y: 0.44, w: 320, h: 64, variant: 'primary' },
      { id: 'G', label: '7. Uncertainty:\nsample size + variability', x: 0.73, y: 0.66, w: 320, h: 64, variant: 'primary' },
      { id: 'H', label: '8. Conclusion:\ndoes the chart support the claim?', x: 0.73, y: 0.88, w: 340, h: 64, variant: 'note' },
    ],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
      { from: 'C', to: 'D' },
      { from: 'E', to: 'F' },
      { from: 'F', to: 'G' },
      { from: 'G', to: 'H', stroke: 'rgba(147,197,253,0.7)' },
      { from: 'D', to: 'E' },
    ],
  },

  'average-distribution': {
    height: 200,
    ariaLabel: 'Flow showing that the same average can hide very different distributions and lead to different interventions.',
    nodes: [
      { id: 'A', label: 'Same average', x: 0.20, y: 0.55, w: 200, h: 64, variant: 'primary' },
      { id: 'B', label: 'Very different\nspread', x: 0.50, y: 0.55, w: 230, h: 64, variant: 'note' },
      { id: 'C', label: 'Different story for\nintervention', x: 0.80, y: 0.55, w: 260, h: 64, variant: 'note' },
    ],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
    ],
  },

  'counts-vs-rates': {
    height: 340,
    ariaLabel: 'Counts vs rates: comparing different group sizes requires normalization.',
    nodes: [
      { id: 'A', label: 'Comparing groups\nwith different sizes', x: 0.50, y: 0.18, w: 340, h: 74, variant: 'warn' },
      { id: 'B', label: 'Counts can\nmislead', x: 0.50, y: 0.40, w: 240, h: 64, variant: 'warn' },
      { id: 'C', label: 'Use rates or\nper-capita measures', x: 0.50, y: 0.62, w: 300, h: 64, variant: 'ok' },
      { id: 'D', label: 'Always show\ndenominator (n)', x: 0.50, y: 0.84, w: 280, h: 64, variant: 'ok' },
    ],
    edges: [
      { from: 'A', to: 'B', stroke: 'rgba(252,165,165,0.8)' },
      { from: 'B', to: 'C' },
      { from: 'C', to: 'D' },
    ],
  },

  'bins-scales': {
    height: 220,
    ariaLabel: 'Binning affects resolution; scale affects contrast; both change perceived patterns.',
    nodes: [
      { id: 'A', label: 'Bins', x: 0.20, y: 0.36, w: 150, h: 58, variant: 'primary' },
      { id: 'B', label: 'Resolution', x: 0.45, y: 0.36, w: 190, h: 58, variant: 'note' },
      { id: 'C', label: 'Perceived\nstructure', x: 0.70, y: 0.36, w: 210, h: 64, variant: 'note' },

      { id: 'D', label: 'Scale', x: 0.20, y: 0.74, w: 150, h: 58, variant: 'primary' },
      { id: 'E', label: 'Contrast', x: 0.45, y: 0.74, w: 190, h: 58, variant: 'note' },
      { id: 'F', label: 'Perceived\ndifferences', x: 0.70, y: 0.74, w: 220, h: 64, variant: 'note' },
    ],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
      { from: 'D', to: 'E' },
      { from: 'E', to: 'F' },
    ],
  },

  'smoothing': {
    height: 260,
    ariaLabel: 'Smoothing can hide spikes, shift timing, or invent trends; if you smooth, show raw data and label the method.',
    nodes: [
      { id: 'A', label: 'Smoothing /\nmoving average', x: 0.30, y: 0.22, w: 250, h: 64, variant: 'warn' },
      { id: 'B', label: 'Can hide spikes and\nshift timing', x: 0.30, y: 0.46, w: 280, h: 64, variant: 'warn' },
      { id: 'C', label: 'Can invent trends\nif window is large', x: 0.30, y: 0.70, w: 280, h: 64, variant: 'warn' },
      { id: 'D', label: 'If you smooth', x: 0.72, y: 0.22, w: 200, h: 58, variant: 'ok' },
      { id: 'E', label: 'Show raw data\nfaintly', x: 0.72, y: 0.50, w: 220, h: 58, variant: 'ok' },
      { id: 'F', label: 'Label the window\n+ method', x: 0.72, y: 0.74, w: 240, h: 58, variant: 'ok' },
    ],
    edges: [
      { from: 'A', to: 'B', stroke: 'rgba(252,165,165,0.8)' },
      { from: 'A', to: 'C', stroke: 'rgba(252,165,165,0.8)' },
      { from: 'D', to: 'E', stroke: 'rgba(34,211,238,0.72)' },
      { from: 'D', to: 'F', stroke: 'rgba(34,211,238,0.72)' },
    ],
  },

  'cherry-picked-windows': {
    height: 220,
    ariaLabel: 'Cherry-picked time windows can exaggerate trends; show context and annotate why the window matters.',
    nodes: [
      { id: 'A', label: 'Pick a short\nwindow', x: 0.24, y: 0.34, w: 230, h: 64, variant: 'warn' },
      { id: 'B', label: 'Trend looks\ndramatic', x: 0.50, y: 0.34, w: 230, h: 64, variant: 'warn' },
      { id: 'C', label: 'Show context\nwindow', x: 0.24, y: 0.74, w: 230, h: 64, variant: 'ok' },
      { id: 'D', label: 'Trend becomes\ninterpretable', x: 0.50, y: 0.74, w: 250, h: 64, variant: 'ok' },
      { id: 'E', label: 'Best practice', x: 0.80, y: 0.60, w: 220, h: 58, variant: 'ok' },
      { id: 'F', label: 'Annotate why\nthe window matters', x: 0.80, y: 0.86, w: 270, h: 64, variant: 'ok' },
    ],
    edges: [
      { from: 'A', to: 'B', stroke: 'rgba(252,165,165,0.8)' },
      { from: 'C', to: 'D', stroke: 'rgba(34,211,238,0.72)' },
      { from: 'E', to: 'F', stroke: 'rgba(34,211,238,0.72)' },
    ],
  },

  'choropleth-counts': {
    height: 230,
    ariaLabel: 'Choropleths of raw counts are misleading; use rates and show the denominator.',
    nodes: [
      { id: 'A', label: 'Choropleth\nmap', x: 0.18, y: 0.34, w: 170, h: 64, variant: 'warn' },
      { id: 'B', label: 'Coloring by\nraw counts', x: 0.44, y: 0.34, w: 200, h: 64, variant: 'warn' },
      { id: 'C', label: 'Large regions\ndominate', x: 0.70, y: 0.34, w: 190, h: 64, variant: 'warn' },
      { id: 'D', label: 'Fix', x: 0.18, y: 0.74, w: 160, h: 58, variant: 'ok' },
      { id: 'E', label: 'Use rates /\nper-capita', x: 0.44, y: 0.74, w: 200, h: 64, variant: 'ok' },
      { id: 'F', label: 'Show\ndenominator', x: 0.70, y: 0.74, w: 190, h: 64, variant: 'ok' },
    ],
    edges: [
      { from: 'A', to: 'B', stroke: 'rgba(252,165,165,0.8)' },
      { from: 'B', to: 'C', stroke: 'rgba(252,165,165,0.8)' },
      { from: 'D', to: 'E', stroke: 'rgba(34,211,238,0.72)' },
      { from: 'E', to: 'F', stroke: 'rgba(34,211,238,0.72)' },
    ],
  },

  'inconsistent-scales': {
    height: 230,
    ariaLabel: 'Inconsistent scales across panels break comparisons; share axes or label clearly.',
    nodes: [
      { id: 'A', label: 'Small\nmultiples', x: 0.20, y: 0.34, w: 200, h: 64, variant: 'ok' },
      { id: 'B', label: 'If scales\ndiffer', x: 0.46, y: 0.34, w: 200, h: 64, variant: 'warn' },
      { id: 'C', label: 'Comparisons become\ninvalid', x: 0.76, y: 0.34, w: 260, h: 64, variant: 'warn' },
      { id: 'D', label: 'Best\npractice', x: 0.20, y: 0.74, w: 200, h: 64, variant: 'ok' },
      { id: 'E', label: 'Share axes\nfor comparison', x: 0.46, y: 0.74, w: 240, h: 64, variant: 'ok' },
      { id: 'F', label: 'If not,\nlabel clearly', x: 0.76, y: 0.74, w: 220, h: 64, variant: 'ok' },
    ],
    edges: [
      { from: 'A', to: 'B', stroke: 'rgba(34,211,238,0.72)' },
      { from: 'B', to: 'C', stroke: 'rgba(252,165,165,0.8)' },
      { from: 'D', to: 'E', stroke: 'rgba(34,211,238,0.72)' },
      { from: 'E', to: 'F', stroke: 'rgba(34,211,238,0.72)' },
    ],
  },

  'category-order': {
    height: 200,
    ariaLabel: 'Sorting categories makes ranking and comparison easier.',
    nodes: [
      { id: 'A', label: 'Sort rule', x: 0.16, y: 0.55, w: 180, h: 58, variant: 'ok' },
      { id: 'B', label: 'Rank by value', x: 0.40, y: 0.55, w: 180, h: 58, variant: 'note' },
      { id: 'C', label: 'Or use domain\norder', x: 0.64, y: 0.55, w: 190, h: 64, variant: 'note' },
      { id: 'D', label: 'Or group + sort\nwithin group', x: 0.90, y: 0.55, w: 220, h: 64, variant: 'note' },
    ],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
      { from: 'C', to: 'D' },
    ],
  },

  'color-system': {
    height: 280,
    ariaLabel: 'A simple project color system: neutrals, category colors, one highlight, and optional status colors.',
    nodes: [
      { id: 'A', label: 'Define tokens', x: 0.50, y: 0.18, w: 220, h: 64, variant: 'primary' },
      { id: 'N', label: 'Neutrals:\nbackground, surface, text', x: 0.20, y: 0.62, w: 260, h: 76, variant: 'note' },
      { id: 'C', label: 'Category colors:\n4–6 max', x: 0.50, y: 0.62, w: 240, h: 64, variant: 'note' },
      { id: 'H', label: 'Highlight:\none accent', x: 0.80, y: 0.62, w: 220, h: 64, variant: 'note' },
      { id: 'S', label: 'Status:\ngood / warning / bad\n(optional)', x: 0.50, y: 0.86, w: 280, h: 76, variant: 'note' },
    ],
    edges: [
      { from: 'A', to: 'N' },
      { from: 'A', to: 'C' },
      { from: 'A', to: 'H' },
      { from: 'A', to: 'S' },
    ],
  },

  // Data & Task Abstraction (Week: Abstraction)
  'chart-first-trap': {
    height: 220,
    ariaLabel: 'Comparison of chart-first thinking versus abstraction-first thinking.',
    groups: [
      {
        id: 'G',
        label: 'Abstraction-first (defensible)',
        x: 0.08,
        y: 0.10,
        w: 0.84,
        h: 0.36,
        stroke: vizTheme.primary,
        fill: 'rgba(11, 18, 32, 0.35)',
      },
      {
        id: 'B',
        label: 'Chart-first (fragile)',
        x: 0.16,
        y: 0.58,
        w: 0.68,
        h: 0.30,
        stroke: 'rgba(255,255,255,0.16)',
        fill: 'rgba(17, 24, 39, 0.18)',
      },
    ],
    nodes: [
      { id: 'G1', label: 'Question', x: 0.20, y: 0.28, w: 160, h: 54, variant: 'primary' },
      { id: 'G2', label: 'Tasks', x: 0.38, y: 0.28, w: 150, h: 54, variant: 'primary' },
      { id: 'G3', label: 'Data + transforms', x: 0.58, y: 0.28, w: 190, h: 54, variant: 'primary' },
      { id: 'G4', label: 'Encoding + interaction', x: 0.82, y: 0.28, w: 210, h: 54, variant: 'primary' },
      { id: 'B1', label: 'Pick a chart', x: 0.32, y: 0.72, w: 170, h: 54, variant: 'muted' },
      { id: 'B2', label: 'Force the data', x: 0.50, y: 0.72, w: 180, h: 54, variant: 'muted' },
      { id: 'B3', label: 'Weak story', x: 0.68, y: 0.72, w: 160, h: 54, variant: 'muted' },
    ],
    edges: [
      { from: 'G1', to: 'G2', stroke: 'rgba(147,197,253,0.72)' },
      { from: 'G2', to: 'G3', stroke: 'rgba(147,197,253,0.72)' },
      { from: 'G3', to: 'G4', stroke: 'rgba(147,197,253,0.72)' },
      { from: 'B1', to: 'B2', stroke: 'rgba(148,163,184,0.55)' },
      { from: 'B2', to: 'B3', stroke: 'rgba(148,163,184,0.55)' },
    ],
  },

  'munzner-nested': {
    height: 360,
    ariaLabel: 'Munzner’s nested model showing where data and task abstraction sits between the domain problem and encoding choices.',
    nodes: [
      { id: 'A', label: 'Domain problem\n(people + goals)', x: 0.50, y: 0.16, w: 360, h: 70, variant: 'primary' },
      { id: 'B', label: 'Data & task\nabstraction', x: 0.50, y: 0.40, w: 320, h: 70, variant: 'primary' },
      { id: 'C', label: 'Visual encoding\n& interaction', x: 0.50, y: 0.64, w: 340, h: 70, variant: 'primary' },
      { id: 'D', label: 'Algorithm /\nimplementation', x: 0.50, y: 0.88, w: 340, h: 70, variant: 'primary' },
    ],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
      { from: 'C', to: 'D' },
      { from: 'B', to: 'A', dashed: true, label: 'evaluate', stroke: 'rgba(148,163,184,0.65)' },
      { from: 'C', to: 'B', dashed: true, label: 'evaluate', stroke: 'rgba(148,163,184,0.65)' },
      { from: 'D', to: 'C', dashed: true, label: 'evaluate', stroke: 'rgba(148,163,184,0.65)' },
    ],
  },

  'why-how-what-simple': {
    width: 440,
    height: 210,
    ariaLabel: 'Task abstraction chain: why, how, what.',
    nodes: [
      { id: 'W', label: 'Why (goal)', x: 0.50, y: 0.22, w: 260, h: 58, variant: 'primary' },
      { id: 'H', label: 'How (actions)', x: 0.50, y: 0.52, w: 260, h: 58, variant: 'primary' },
      { id: 'T', label: 'What (targets)', x: 0.50, y: 0.82, w: 260, h: 58, variant: 'primary' },
    ],
    edges: [
      { from: 'W', to: 'H' },
      { from: 'H', to: 'T' },
    ],
  },

  'data-spec-chain': {
    width: 480,
    height: 220,
    ariaLabel: 'Data abstraction chain: dataset types lead to variables and transforms, producing derived measures and requiring keys.',
    nodes: [
      { id: 'DT', label: 'Dataset type(s)', x: 0.50, y: 0.16, w: 280, h: 60, variant: 'primary' },
      { id: 'V', label: 'Variables + types', x: 0.50, y: 0.40, w: 280, h: 60, variant: 'primary' },
      { id: 'TR', label: 'Transforms', x: 0.26, y: 0.66, w: 190, h: 56, variant: 'note' },
      { id: 'K', label: 'Keys / IDs', x: 0.74, y: 0.66, w: 190, h: 56, variant: 'note' },
      { id: 'D', label: 'Derived measures', x: 0.26, y: 0.86, w: 210, h: 56, variant: 'note' },
    ],
    edges: [
      { from: 'DT', to: 'V' },
      { from: 'V', to: 'TR' },
      { from: 'V', to: 'K' },
      { from: 'TR', to: 'D' },
    ],
  },

  'dataset-types-menu': {
    height: 360,
    ariaLabel: 'Dataset types mindmap: table, temporal, spatial, network, hierarchy, and sets.',
    nodes: [
      { id: 'root', label: 'Dataset types', x: 0.58, y: 0.52, w: 150, h: 150, shape: 'circle', fill: '#223B6B', stroke: '#223B6B', text: vizTheme.text, fontSize: 14 },

      { id: 'Table', label: 'Table', x: 0.24, y: 0.26, w: 170, h: 54, variant: 'primary' },
      { id: 'Temporal', label: 'Temporal', x: 0.24, y: 0.52, w: 170, h: 54, variant: 'primary' },
      { id: 'Spatial', label: 'Spatial', x: 0.24, y: 0.78, w: 170, h: 54, variant: 'primary' },

      { id: 'Network', label: 'Network', x: 0.86, y: 0.30, w: 180, h: 54, variant: 'primary' },
      { id: 'Hierarchy', label: 'Hierarchy', x: 0.86, y: 0.56, w: 180, h: 54, variant: 'primary' },
      { id: 'Sets', label: 'Sets', x: 0.86, y: 0.82, w: 180, h: 54, variant: 'primary' },

      { id: 'TS', label: 'Time series', x: 0.08, y: 0.46, w: 170, h: 50, variant: 'note' },
      { id: 'ES', label: 'Event sequence', x: 0.08, y: 0.60, w: 190, h: 50, variant: 'note' },

      { id: 'Geo', label: 'Geometry', x: 0.08, y: 0.70, w: 160, h: 50, variant: 'note' },
      { id: 'Reg', label: 'Regions', x: 0.08, y: 0.82, w: 160, h: 50, variant: 'note' },
      { id: 'Fld', label: 'Fields', x: 0.08, y: 0.94, w: 160, h: 50, variant: 'note' },
    ],
    edges: [
      { from: 'root', to: 'Table', stroke: 'rgba(147,197,253,0.72)', strokeWidth: 6, arrow: false },
      { from: 'root', to: 'Temporal', stroke: 'rgba(147,197,253,0.72)', strokeWidth: 6, arrow: false },
      { from: 'root', to: 'Spatial', stroke: 'rgba(147,197,253,0.72)', strokeWidth: 6, arrow: false },
      { from: 'root', to: 'Network', stroke: 'rgba(147,197,253,0.72)', strokeWidth: 6, arrow: false },
      { from: 'root', to: 'Hierarchy', stroke: 'rgba(147,197,253,0.72)', strokeWidth: 6, arrow: false },
      { from: 'root', to: 'Sets', stroke: 'rgba(147,197,253,0.72)', strokeWidth: 6, arrow: false },

      { from: 'Temporal', to: 'TS', stroke: 'rgba(148,163,184,0.55)', arrow: false },
      { from: 'Temporal', to: 'ES', stroke: 'rgba(148,163,184,0.55)', arrow: false },

      { from: 'Spatial', to: 'Geo', stroke: 'rgba(148,163,184,0.55)', arrow: false },
      { from: 'Spatial', to: 'Reg', stroke: 'rgba(148,163,184,0.55)', arrow: false },
      { from: 'Spatial', to: 'Fld', stroke: 'rgba(148,163,184,0.55)', arrow: false },
    ],
  },

  'hierarchy-example': {
    width: 440,
    height: 240,
    ariaLabel: 'Hierarchy example: college to programs to sections.',
    nodes: [
      { id: 'A', label: 'College', x: 0.50, y: 0.18, w: 190, h: 58, variant: 'primary' },
      { id: 'B', label: 'Program', x: 0.32, y: 0.46, w: 180, h: 56, variant: 'note' },
      { id: 'C', label: 'Program', x: 0.68, y: 0.46, w: 180, h: 56, variant: 'note' },
      { id: 'D', label: 'Section', x: 0.24, y: 0.78, w: 170, h: 56, variant: 'muted' },
      { id: 'E', label: 'Section', x: 0.40, y: 0.78, w: 170, h: 56, variant: 'muted' },
      { id: 'F', label: 'Section', x: 0.60, y: 0.78, w: 170, h: 56, variant: 'muted' },
      { id: 'G', label: 'Section', x: 0.76, y: 0.78, w: 170, h: 56, variant: 'muted' },
    ],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'A', to: 'C' },
      { from: 'B', to: 'D', arrow: false, stroke: 'rgba(148,163,184,0.55)' },
      { from: 'B', to: 'E', arrow: false, stroke: 'rgba(148,163,184,0.55)' },
      { from: 'C', to: 'F', arrow: false, stroke: 'rgba(148,163,184,0.55)' },
      { from: 'C', to: 'G', arrow: false, stroke: 'rgba(148,163,184,0.55)' },
    ],
  },

  'network-example': {
    width: 440,
    height: 240,
    ariaLabel: 'Network example: peer links between students.',
    nodes: [
      { id: 'S1', label: 'Student', x: 0.26, y: 0.32, w: 120, h: 120, shape: 'circle', variant: 'primary' },
      { id: 'S2', label: 'Student', x: 0.62, y: 0.22, w: 120, h: 120, shape: 'circle', variant: 'primary' },
      { id: 'S3', label: 'Student', x: 0.74, y: 0.62, w: 120, h: 120, shape: 'circle', variant: 'primary' },
      { id: 'S4', label: 'Student', x: 0.36, y: 0.72, w: 120, h: 120, shape: 'circle', variant: 'primary' },
    ],
    edges: [
      { from: 'S1', to: 'S2', arrow: false, stroke: 'rgba(147,197,253,0.65)', strokeWidth: 3 },
      { from: 'S2', to: 'S3', arrow: false, stroke: 'rgba(147,197,253,0.65)', strokeWidth: 3 },
      { from: 'S3', to: 'S4', arrow: false, stroke: 'rgba(147,197,253,0.65)', strokeWidth: 3 },
      { from: 'S1', to: 'S4', arrow: false, stroke: 'rgba(147,197,253,0.65)', strokeWidth: 3 },
    ],
  },

  'binning-pipeline': {
    height: 200,
    ariaLabel: 'Binning pipeline from raw events to field/heatmap-ready data.',
    nodes: [
      { id: 'A', label: 'Raw events', x: 0.18, y: 0.55, w: 200, h: 64, variant: 'primary' },
      { id: 'B', label: 'Choose bin size', x: 0.44, y: 0.55, w: 240, h: 64, variant: 'note' },
      { id: 'C', label: 'Aggregate per bin', x: 0.70, y: 0.55, w: 240, h: 64, variant: 'note' },
      { id: 'D', label: 'Field/heatmap-ready\ndata', x: 0.88, y: 0.55, w: 250, h: 64, variant: 'primary' },
    ],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
      { from: 'C', to: 'D' },
    ],
  },

  'hybrid-datasets': {
    height: 280,
    ariaLabel: 'Hybrid dataset decision: choose the primary organizing key, then attach the rest as attributes.',
    nodes: [
      { id: 'Q', label: 'What is the primary\norganizing key?', x: 0.50, y: 0.16, w: 360, h: 74, variant: 'primary' },
      { id: 'T', label: 'Records (table)', x: 0.15, y: 0.54, w: 190, h: 62, variant: 'note' },
      { id: 'TS', label: 'Time (ordered)', x: 0.39, y: 0.54, w: 190, h: 62, variant: 'note' },
      { id: 'S', label: 'Space\n(coordinates/regions)', x: 0.63, y: 0.54, w: 220, h: 70, variant: 'note' },
      { id: 'N', label: 'Links (network)', x: 0.87, y: 0.54, w: 190, h: 62, variant: 'note' },
      { id: 'R', label: 'Attach the rest\nas attributes', x: 0.50, y: 0.86, w: 320, h: 74, variant: 'primary' },
    ],
    edges: [
      { from: 'Q', to: 'T' },
      { from: 'Q', to: 'TS' },
      { from: 'Q', to: 'S' },
      { from: 'Q', to: 'N' },
      { from: 'T', to: 'R' },
      { from: 'TS', to: 'R' },
      { from: 'S', to: 'R' },
      { from: 'N', to: 'R' },
    ],
  },

  'granularity-ladders': {
    height: 260,
    ariaLabel: 'Granularity ladders for entities and time: event to program and day to term.',
    nodes: [
      { id: 'A', label: 'Event-level\n(each quiz attempt)', x: 0.18, y: 0.34, w: 260, h: 74, variant: 'primary' },
      { id: 'B', label: 'Student-level', x: 0.40, y: 0.34, w: 210, h: 64, variant: 'note' },
      { id: 'C', label: 'Section-level', x: 0.62, y: 0.34, w: 210, h: 64, variant: 'note' },
      { id: 'D', label: 'Program-level', x: 0.84, y: 0.34, w: 210, h: 64, variant: 'note' },

      { id: 'E', label: 'Day-level', x: 0.40, y: 0.74, w: 190, h: 60, variant: 'note' },
      { id: 'F', label: 'Week-level', x: 0.62, y: 0.74, w: 190, h: 60, variant: 'note' },
      { id: 'G', label: 'Term-level', x: 0.84, y: 0.74, w: 190, h: 60, variant: 'note' },
    ],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
      { from: 'C', to: 'D' },
      { from: 'A', to: 'E' },
      { from: 'E', to: 'F' },
      { from: 'F', to: 'G' },
    ],
  },

  'why-how-what-framework': {
    height: 260,
    ariaLabel: 'WHY/HOW/WHAT framework showing why influences both actions and targets.',
    nodes: [
      { id: 'W', label: 'WHY (goal)', x: 0.40, y: 0.20, w: 240, h: 64, variant: 'primary' },
      { id: 'H', label: 'HOW (actions)', x: 0.60, y: 0.50, w: 260, h: 64, variant: 'primary' },
      { id: 'T', label: 'WHAT (targets)', x: 0.40, y: 0.80, w: 260, h: 64, variant: 'primary' },
    ],
    edges: [
      { from: 'W', to: 'H' },
      { from: 'H', to: 'T' },
      { from: 'W', to: 'T', stroke: 'rgba(148,163,184,0.55)' },
    ],
  },

  'subtasks-mindmap': {
    height: 380,
    ariaLabel: 'Mindmap decomposing the domain question into compare, detect, locate, and explain subtasks.',
    nodes: [
      {
        id: 'root',
        label: 'Are students\nstruggling more?',
        x: 0.50,
        y: 0.55,
        w: 170,
        h: 170,
        shape: 'circle',
        fill: '#223B6B',
        stroke: '#223B6B',
        text: vizTheme.text,
        fontSize: 13,
      },

      { id: 'Compare', label: 'Compare', x: 0.78, y: 0.52, w: 150, h: 46, shape: 'pill', fill: 'rgba(34,211,238,0.18)', stroke: vizTheme.cyan, text: vizTheme.text },
      { id: 'C1', label: 'this term vs baseline', x: 0.86, y: 0.42, w: 240, h: 46, shape: 'pill', fill: 'rgba(34,211,238,0.12)', stroke: vizTheme.cyan, text: vizTheme.text },
      { id: 'C2', label: 'sections / programs', x: 0.86, y: 0.62, w: 240, h: 46, shape: 'pill', fill: 'rgba(34,211,238,0.12)', stroke: vizTheme.cyan, text: vizTheme.text },

      { id: 'Detect', label: 'Detect', x: 0.50, y: 0.88, w: 150, h: 46, shape: 'pill', fill: 'rgba(77,163,255,0.18)', stroke: vizTheme.primary, text: vizTheme.text },
      { id: 'D1', label: 'drop points', x: 0.34, y: 0.94, w: 190, h: 46, shape: 'pill', fill: 'rgba(77,163,255,0.12)', stroke: vizTheme.primary, text: vizTheme.text },
      { id: 'D2', label: 'unusually low groups', x: 0.66, y: 0.94, w: 240, h: 46, shape: 'pill', fill: 'rgba(77,163,255,0.12)', stroke: vizTheme.primary, text: vizTheme.text },

      { id: 'Locate', label: 'Locate', x: 0.22, y: 0.52, w: 150, h: 46, shape: 'pill', fill: 'rgba(148,163,184,0.16)', stroke: 'rgba(148,163,184,0.7)', text: vizTheme.text },
      { id: 'L1', label: 'when it started', x: 0.08, y: 0.52, w: 200, h: 46, shape: 'pill', fill: 'rgba(148,163,184,0.10)', stroke: 'rgba(148,163,184,0.65)', text: vizTheme.text },

      { id: 'Explain', label: 'Explain (if possible)', x: 0.50, y: 0.18, w: 220, h: 46, shape: 'pill', fill: 'rgba(245,158,11,0.18)', stroke: vizTheme.orange, text: vizTheme.text },
      { id: 'E1', label: 'related events', x: 0.34, y: 0.08, w: 190, h: 46, shape: 'pill', fill: 'rgba(245,158,11,0.12)', stroke: vizTheme.orange, text: vizTheme.text },
      { id: 'E2', label: 'workload changes', x: 0.66, y: 0.08, w: 210, h: 46, shape: 'pill', fill: 'rgba(245,158,11,0.12)', stroke: vizTheme.orange, text: vizTheme.text },
    ],
    edges: [
      { from: 'root', to: 'Compare', arrow: false, stroke: vizTheme.cyan, strokeWidth: 8 },
      { from: 'Compare', to: 'C1', arrow: false, stroke: vizTheme.cyan, strokeWidth: 4 },
      { from: 'Compare', to: 'C2', arrow: false, stroke: vizTheme.cyan, strokeWidth: 4 },

      { from: 'root', to: 'Detect', arrow: false, stroke: vizTheme.primary, strokeWidth: 8 },
      { from: 'Detect', to: 'D1', arrow: false, stroke: vizTheme.primary, strokeWidth: 4 },
      { from: 'Detect', to: 'D2', arrow: false, stroke: vizTheme.primary, strokeWidth: 4 },

      { from: 'root', to: 'Locate', arrow: false, stroke: 'rgba(148,163,184,0.85)', strokeWidth: 8 },
      { from: 'Locate', to: 'L1', arrow: false, stroke: 'rgba(148,163,184,0.65)', strokeWidth: 4 },

      { from: 'root', to: 'Explain', arrow: false, stroke: vizTheme.orange, strokeWidth: 8 },
      { from: 'Explain', to: 'E1', arrow: false, stroke: vizTheme.orange, strokeWidth: 4 },
      { from: 'Explain', to: 'E2', arrow: false, stroke: vizTheme.orange, strokeWidth: 4 },
    ],
  },

  'search-tasks-spectrum': {
    height: 200,
    ariaLabel: 'Search tasks spectrum from lookup to explore.',
    nodes: [
      { id: 'A', label: 'Lookup\n(known item,\nknown place)', x: 0.18, y: 0.55, w: 240, h: 74, variant: 'primary' },
      { id: 'B', label: 'Locate\n(known item,\nunknown place)', x: 0.42, y: 0.55, w: 240, h: 74, variant: 'primary' },
      { id: 'C', label: 'Browse\n(unknown item,\nknown place)', x: 0.66, y: 0.55, w: 240, h: 74, variant: 'primary' },
      { id: 'D', label: 'Explore\n(unknown item,\nunknown place)', x: 0.88, y: 0.55, w: 250, h: 74, variant: 'note' },
    ],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
      { from: 'C', to: 'D' },
    ],
  },

  'tasks-to-interactions': {
    height: 260,
    ariaLabel: 'Mapping from common tasks to interaction techniques.',
    nodes: [
      { id: 'T1', label: 'Compare / rank', x: 0.26, y: 0.22, w: 240, h: 58, variant: 'primary' },
      { id: 'I1', label: 'Sort • align • small multiples', x: 0.74, y: 0.22, w: 340, h: 58, variant: 'note' },
      { id: 'T2', label: 'Find outliers', x: 0.26, y: 0.44, w: 240, h: 58, variant: 'primary' },
      { id: 'I2', label: 'Highlight • annotate • tooltips', x: 0.74, y: 0.44, w: 340, h: 58, variant: 'note' },
      { id: 'T3', label: 'Explore', x: 0.26, y: 0.66, w: 240, h: 58, variant: 'primary' },
      { id: 'I3', label: 'Filter • facet • drill down', x: 0.74, y: 0.66, w: 340, h: 58, variant: 'note' },
      { id: 'T4', label: 'Monitor over time', x: 0.26, y: 0.88, w: 240, h: 58, variant: 'primary' },
      { id: 'I4', label: 'Time brush • range slider', x: 0.74, y: 0.88, w: 340, h: 58, variant: 'note' },
    ],
    edges: [
      { from: 'T1', to: 'I1' },
      { from: 'T2', to: 'I2' },
      { from: 'T3', to: 'I3' },
      { from: 'T4', to: 'I4' },
    ],
  },

  'abstraction-worksheet': {
    height: 220,
    ariaLabel: 'Abstraction worksheet: domain question to data abstraction to task abstraction to design, with evaluation loop.',
    nodes: [
      { id: 'A', label: '1) Domain question', x: 0.16, y: 0.55, w: 220, h: 64, variant: 'primary' },
      { id: 'B', label: '2) Data abstraction', x: 0.38, y: 0.55, w: 240, h: 64, variant: 'primary' },
      { id: 'C', label: '3) Task abstraction', x: 0.60, y: 0.55, w: 240, h: 64, variant: 'primary' },
      { id: 'D', label: '4) Design\n(views + interactions)', x: 0.84, y: 0.55, w: 260, h: 76, variant: 'primary' },
    ],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
      { from: 'C', to: 'D' },
      { from: 'D', to: 'A', dashed: true, label: 'check', stroke: 'rgba(148,163,184,0.65)' },
    ],
  },

  'channel-effectiveness': {
    width: 440,
    height: 280,
    ariaLabel: 'Channel effectiveness ladder from position to color/shape.',
    nodes: [
      { id: 'P', label: 'Position\n(common scale)', x: 0.50, y: 0.20, w: 280, h: 64, variant: 'primary' },
      { id: 'L', label: 'Length', x: 0.50, y: 0.44, w: 240, h: 58, variant: 'note' },
      { id: 'AA', label: 'Angle / Area', x: 0.50, y: 0.66, w: 240, h: 58, variant: 'note' },
      { id: 'CS', label: 'Color / Shape', x: 0.50, y: 0.88, w: 240, h: 58, variant: 'note' },
    ],
    edges: [
      { from: 'P', to: 'L' },
      { from: 'L', to: 'AA' },
      { from: 'AA', to: 'CS' },
    ],
  },

  'type-to-channels': {
    width: 520,
    height: 300,
    ariaLabel: 'Mapping from attribute types to best channels for encoding.',
    groups: [
      { id: 'Types', label: 'Attribute type', x: 0.06, y: 0.10, w: 0.42, h: 0.80, stroke: 'rgba(255,255,255,0.14)', fill: 'rgba(11, 18, 32, 0.22)' },
      { id: 'Ch', label: 'Best channels', x: 0.52, y: 0.10, w: 0.42, h: 0.80, stroke: 'rgba(255,255,255,0.14)', fill: 'rgba(11, 18, 32, 0.22)' },
    ],
    nodes: [
      { id: 'Q', label: 'Quantitative', x: 0.26, y: 0.24, w: 170, h: 54, variant: 'primary' },
      { id: 'O', label: 'Ordinal', x: 0.26, y: 0.42, w: 170, h: 54, variant: 'primary' },
      { id: 'C', label: 'Categorical', x: 0.26, y: 0.60, w: 170, h: 54, variant: 'primary' },
      { id: 'T', label: 'Temporal', x: 0.26, y: 0.78, w: 170, h: 54, variant: 'primary' },
      { id: 'Q1', label: 'Position / length', x: 0.74, y: 0.24, w: 220, h: 54, variant: 'note' },
      { id: 'O1', label: 'Position /\nordered lightness', x: 0.74, y: 0.42, w: 240, h: 64, variant: 'note' },
      { id: 'C1', label: 'Hue / shape /\ngrouping', x: 0.74, y: 0.60, w: 220, h: 64, variant: 'note' },
      { id: 'T1', label: 'Position on x\n+ ordering', x: 0.74, y: 0.78, w: 220, h: 64, variant: 'note' },
    ],
    edges: [
      { from: 'Q', to: 'Q1' },
      { from: 'O', to: 'O1' },
      { from: 'C', to: 'C1' },
      { from: 'T', to: 'T1' },
    ],
  },

  'iteration-cycle': {
    height: 100,
    ariaLabel: 'Iteration cycle: design draft, test tasks, fix gaps, repeat.',
    nodes: [
      { id: 'D', label: 'Design draft', x: 0.18, y: 0.55, w: 240, h: 52, variant: 'primary', fontSize: 12 },
      { id: 'T', label: 'Test tasks', x: 0.50, y: 0.55, w: 240, h: 52, variant: 'note', fontSize: 12 },
      { id: 'G', label: 'Fix gaps', x: 0.82, y: 0.55, w: 240, h: 52, variant: 'note', fontSize: 12 },
    ],
    edges: [
      { from: 'D', to: 'T' },
      { from: 'T', to: 'G' },
      { from: 'G', to: 'D', dashed: true, stroke: 'rgba(148,163,184,0.55)' },
    ],
  },

  'case-study-student-flow': {
    height: 260,
    ariaLabel: 'Case study workflow: overview to brush to details to lookup.',
    relax: false,
    nodes: [
      { id: 'O', label: 'Overview:\nsection trends', x: 0.15, y: 0.56, w: 220, h: 78, variant: 'primary' },
      { id: 'B', label: 'Brush a week\nrange', x: 0.39, y: 0.56, w: 200, h: 78, variant: 'note' },
      { id: 'D', label: 'Details:\ndistributions by\nsection', x: 0.63, y: 0.56, w: 220, h: 88, variant: 'note' },
      { id: 'L', label: 'Lookup:\nstudent-level records\n(on demand)', x: 0.89, y: 0.56, w: 220, h: 88, variant: 'note' },
    ],
    edges: [
      { from: 'O', to: 'B' },
      { from: 'B', to: 'D' },
      { from: 'D', to: 'L' },
    ],
  },

  'collaboration-network': {
    height: 300,
    ariaLabel: 'Collaboration network example with organizations connected by links.',
    nodes: [
      { id: 'A', label: 'Org A', x: 0.22, y: 0.30, w: 110, h: 110, shape: 'circle', variant: 'primary' },
      { id: 'B', label: 'Org B', x: 0.45, y: 0.20, w: 110, h: 110, shape: 'circle', variant: 'primary' },
      { id: 'C', label: 'Org C', x: 0.68, y: 0.30, w: 110, h: 110, shape: 'circle', variant: 'primary' },
      { id: 'D', label: 'Org D', x: 0.78, y: 0.56, w: 110, h: 110, shape: 'circle', variant: 'primary' },
      { id: 'E', label: 'Org E', x: 0.55, y: 0.72, w: 110, h: 110, shape: 'circle', variant: 'primary' },
      { id: 'F', label: 'Org F', x: 0.28, y: 0.60, w: 110, h: 110, shape: 'circle', variant: 'primary' },
    ],
    edges: [
      { from: 'A', to: 'B', arrow: false, stroke: 'rgba(147,197,253,0.7)', strokeWidth: 3 },
      { from: 'B', to: 'C', arrow: false, stroke: 'rgba(147,197,253,0.7)', strokeWidth: 3 },
      { from: 'C', to: 'D', arrow: false, stroke: 'rgba(147,197,253,0.7)', strokeWidth: 3 },
      { from: 'B', to: 'E', arrow: false, stroke: 'rgba(147,197,253,0.7)', strokeWidth: 3 },
      { from: 'E', to: 'F', arrow: false, stroke: 'rgba(147,197,253,0.7)', strokeWidth: 3 },
      { from: 'A', to: 'F', arrow: false, stroke: 'rgba(147,197,253,0.7)', strokeWidth: 3 },
    ],
  },

  'assignment-workflow': {
    height: 110,
    ariaLabel: 'Assignment workflow from domain question to tasks, data abstraction, transforms, and visual design.',
    nodes: [
      { id: 'Q', label: 'Domain\nquestion', x: 0.14, y: 0.55, w: 200, h: 52, variant: 'primary', fontSize: 12 },
      { id: 'TA', label: 'Tasks\n(3+)', x: 0.33, y: 0.55, w: 170, h: 52, variant: 'note', fontSize: 12 },
      { id: 'DA', label: 'Data abstraction\n(types + vars)', x: 0.52, y: 0.55, w: 210, h: 58, variant: 'note', fontSize: 12 },
      { id: 'TR', label: 'Transforms\n(clean · tidy · derive)', x: 0.71, y: 0.55, w: 230, h: 58, variant: 'note', fontSize: 12 },
      { id: 'V', label: 'Visual design\n(2 charts + justification)', x: 0.88, y: 0.55, w: 250, h: 58, variant: 'primary', fontSize: 12 },
    ],
    edges: [
      { from: 'Q', to: 'TA' },
      { from: 'TA', to: 'DA' },
      { from: 'DA', to: 'TR' },
      { from: 'TR', to: 'V' },
    ],
  },

  // -----------------------------
  // Python + web visualization deck
  // -----------------------------

  'web-viz-stack': {
    height: 420,
    ariaLabel: 'Web visualization stack for charts: HTML structure, CSS styling, SVG drawing.',
    relax: false,
    nodes: [
      { id: 'H', label: 'HTML\nstructure', x: 0.50, y: 0.13, w: 560, h: 86, shape: 'pill', variant: 'primary', fontSize: 15 },
      { id: 'C', label: 'CSS\ntypography · spacing · layout', x: 0.50, y: 0.53, w: 760, h: 106, shape: 'pill', variant: 'note', fontSize: 15 },
      { id: 'S', label: 'SVG\nmarks · axes · labels', x: 0.50, y: 0.92, w: 600, h: 90, shape: 'pill', variant: 'ok', fontSize: 15 },
    ],
    edges: [
      { from: 'H', to: 'C', stroke: 'rgba(147,197,253,0.92)', strokeWidth: 4.0 },
      { from: 'C', to: 'S', stroke: 'rgba(147,197,253,0.92)', strokeWidth: 4.0 },
    ],
  },

  'svg-coordinates': {
    height: 460,
    ariaLabel: 'SVG coordinate system: origin at top-left, x increases to the right, y increases downward.',
    relax: false,
    groups: [
      {
        id: 'vp',
        label: 'viewBox: coordinate space → pixels',
        x: 0.07,
        y: 0.12,
        w: 0.86,
        h: 0.78,
        stroke: 'rgba(147,197,253,0.62)',
        fill: 'rgba(11, 18, 32, 0.22)',
      },
    ],
    nodes: [
      { id: 'O', label: '(0, 0)\norigin', x: 0.20, y: 0.28, w: 210, h: 82, shape: 'pill', variant: 'muted', fontSize: 14 },
      { id: 'X', label: 'x increases →', x: 0.74, y: 0.28, w: 300, h: 74, shape: 'pill', variant: 'note', fontSize: 16 },
      { id: 'Y', label: 'y increases ↓', x: 0.20, y: 0.72, w: 300, h: 74, shape: 'pill', variant: 'note', fontSize: 16 },
      { id: 'TL', label: 'Top-left is the origin\n(y grows downward)', x: 0.20, y: 0.50, w: 320, h: 70, shape: 'pill', variant: 'muted', fontSize: 12 },
      { id: 'VB', label: 'viewBox maps\ncoordinates → pixels', x: 0.74, y: 0.50, w: 340, h: 78, shape: 'pill', variant: 'primary', fontSize: 14 },
      { id: 'M', label: 'Marks drawn inside\nwidth × height', x: 0.74, y: 0.76, w: 380, h: 92, shape: 'pill', variant: 'ok', fontSize: 14 },
    ],
    edges: [
      { from: 'O', to: 'X', stroke: 'rgba(147,197,253,0.86)', strokeWidth: 3.4 },
      { from: 'O', to: 'Y', stroke: 'rgba(147,197,253,0.86)', strokeWidth: 3.4 },
    ],
  },

  'css-for-charts': {
    height: 420,
    ariaLabel: 'CSS for charts: typography, spacing, contrast, and layout around the visualization.',
    nodes: [
      { id: 'root', label: 'CSS', x: 0.50, y: 0.52, w: 160, h: 160, shape: 'circle', variant: 'primary' },
      { id: 'typo', label: 'Typography\n(type scale)', x: 0.22, y: 0.26, w: 260, h: 78, variant: 'note' },
      { id: 'space', label: 'Spacing\n(margins, grid)', x: 0.22, y: 0.80, w: 260, h: 78, variant: 'note' },
      { id: 'layout', label: 'Layout\n(responsive)', x: 0.78, y: 0.26, w: 260, h: 78, variant: 'note' },
      { id: 'contrast', label: 'Contrast\n(readability)', x: 0.78, y: 0.80, w: 260, h: 78, variant: 'note' },
    ],
    edges: [
      { from: 'root', to: 'typo', arrow: false, stroke: 'rgba(147,197,253,0.72)', strokeWidth: 3.6 },
      { from: 'root', to: 'space', arrow: false, stroke: 'rgba(147,197,253,0.72)', strokeWidth: 3.6 },
      { from: 'root', to: 'layout', arrow: false, stroke: 'rgba(147,197,253,0.72)', strokeWidth: 3.6 },
      { from: 'root', to: 'contrast', arrow: false, stroke: 'rgba(147,197,253,0.72)', strokeWidth: 3.6 },
    ],
  },

  'python-viz-pipeline': {
    height: 460,
    ariaLabel: 'Python visualization pipeline from data loading to transforms, chart, export, and publish.',
    relax: false,
    nodes: [
      { id: 'L', label: 'Load', x: 0.12, y: 0.34, w: 170, h: 76, shape: 'pill', variant: 'note', fontSize: 15 },
      { id: 'V', label: 'Validate\n(types/units)', x: 0.35, y: 0.34, w: 220, h: 88, shape: 'pill', variant: 'note', fontSize: 15 },
      { id: 'T', label: 'Transform\n(group/derive/tidy)', x: 0.62, y: 0.34, w: 240, h: 92, shape: 'pill', variant: 'primary', fontSize: 15 },
      { id: 'P', label: 'Plot', x: 0.86, y: 0.34, w: 150, h: 76, shape: 'pill', variant: 'ok', fontSize: 15 },
      { id: 'E', label: 'Export\nSVG · PNG · HTML', x: 0.86, y: 0.68, w: 220, h: 92, shape: 'pill', variant: 'ok', fontSize: 15 },
      { id: 'S', label: 'Ship\n(slides/report/web)', x: 0.86, y: 0.88, w: 220, h: 64, shape: 'pill', variant: 'muted', fontSize: 13 },
    ],
    edges: [
      { from: 'L', to: 'V', stroke: 'rgba(147,197,253,0.92)', strokeWidth: 3.6 },
      { from: 'V', to: 'T', stroke: 'rgba(147,197,253,0.92)', strokeWidth: 3.6 },
      { from: 'T', to: 'P', stroke: 'rgba(147,197,253,0.92)', strokeWidth: 3.6 },
      { from: 'P', to: 'E', stroke: 'rgba(147,197,253,0.92)', strokeWidth: 3.2 },
      { from: 'E', to: 'S', dashed: true, stroke: 'rgba(148,163,184,0.68)', strokeWidth: 3.0 },
    ],
  },

  'tidy-to-chart': {
    height: 380,
    ariaLabel: 'From raw data to tidy table to encoding and chart.',
    relax: false,
    nodes: [
      { id: 'R', label: 'Raw data\n(messy)', x: 0.16, y: 0.54, w: 250, h: 104, variant: 'warn', fontSize: 15 },
      { id: 'TD', label: 'Tidy table\n(one row = one observation)', x: 0.50, y: 0.54, w: 340, h: 112, variant: 'primary', fontSize: 15 },
      { id: 'EN', label: 'Encode\n(field → channel)', x: 0.84, y: 0.50, w: 250, h: 104, variant: 'note', fontSize: 15 },
      { id: 'CH', label: 'Chart\n(legible)', x: 0.84, y: 0.80, w: 250, h: 96, variant: 'ok', fontSize: 15 },
    ],
    edges: [
      { from: 'R', to: 'TD', stroke: 'rgba(147,197,253,0.9)', strokeWidth: 3.4 },
      { from: 'TD', to: 'EN', stroke: 'rgba(147,197,253,0.9)', strokeWidth: 3.4 },
      { from: 'EN', to: 'CH', stroke: 'rgba(147,197,253,0.9)', strokeWidth: 3.4 },
    ],
  },

  'matplotlib-anatomy': {
    height: 400,
    ariaLabel: 'Matplotlib mental model: figure contains axes; axes contain marks and guides.',
    groups: [
      { id: 'fig', label: 'Figure', x: 0.10, y: 0.16, w: 0.80, h: 0.68, stroke: vizTheme.primary, fill: 'rgba(77,163,255,0.06)' },
      { id: 'ax', label: 'Axes', x: 0.18, y: 0.28, w: 0.64, h: 0.42, stroke: 'rgba(147,197,253,0.65)', fill: 'rgba(255,255,255,0.02)' },
    ],
    nodes: [
      { id: 'm', label: 'Marks\n(lines/points/bars)', x: 0.34, y: 0.50, w: 300, h: 86, variant: 'note' },
      { id: 'sc', label: 'Scales', x: 0.66, y: 0.42, w: 200, h: 70, shape: 'pill', variant: 'ok' },
      { id: 'axl', label: 'Axes\n(ticks/labels)', x: 0.66, y: 0.64, w: 220, h: 76, shape: 'pill', variant: 'ok' },
      { id: 'ex', label: 'Export:\nSVG/PNG/PDF', x: 0.88, y: 0.82, w: 240, h: 78, variant: 'primary' },
    ],
    edges: [
      { from: 'm', to: 'sc', dashed: true, arrow: false, stroke: 'rgba(148,163,184,0.62)', strokeWidth: 2.6 },
      { from: 'm', to: 'axl', dashed: true, arrow: false, stroke: 'rgba(148,163,184,0.62)', strokeWidth: 2.6 },
      { from: 'axl', to: 'ex', stroke: 'rgba(147,197,253,0.9)', strokeWidth: 3.0 },
    ],
  },

  'seaborn-when': {
    height: 250,
    ariaLabel: 'When to use Seaborn: distributions, category comparisons, small multiples, quick statistical views.',
    nodes: [
      { id: 'S', label: 'Seaborn', x: 0.50, y: 0.30, w: 220, h: 70, shape: 'pill', variant: 'primary' },
      { id: 'D', label: 'Distributions', x: 0.22, y: 0.66, w: 200, h: 62, shape: 'pill', variant: 'note' },
      { id: 'C', label: 'Category\ncomparisons', x: 0.50, y: 0.66, w: 220, h: 70, shape: 'pill', variant: 'note' },
      { id: 'F', label: 'Small multiples\n(FacetGrid)', x: 0.78, y: 0.66, w: 240, h: 70, shape: 'pill', variant: 'note' },
    ],
    edges: [
      { from: 'S', to: 'D', arrow: false, stroke: 'rgba(147,197,253,0.7)', strokeWidth: 3 },
      { from: 'S', to: 'C', arrow: false, stroke: 'rgba(147,197,253,0.7)', strokeWidth: 3 },
      { from: 'S', to: 'F', arrow: false, stroke: 'rgba(147,197,253,0.7)', strokeWidth: 3 },
    ],
  },

  'chart-components': {
    height: 300,
    ariaLabel: 'Modern chart components: data, transforms, scales, axes, marks, guides, annotations, interaction, layout.',
    relax: false,
    nodes: [
      { id: 'D', label: 'Data', x: 0.12, y: 0.46, w: 120, h: 54, shape: 'pill', variant: 'note' },
      { id: 'T', label: 'Transforms', x: 0.28, y: 0.46, w: 150, h: 54, shape: 'pill', variant: 'primary' },
      { id: 'S', label: 'Scales', x: 0.44, y: 0.46, w: 120, h: 54, shape: 'pill', variant: 'note' },
      { id: 'A', label: 'Axes', x: 0.57, y: 0.46, w: 110, h: 54, shape: 'pill', variant: 'note' },
      { id: 'M', label: 'Marks', x: 0.70, y: 0.46, w: 120, h: 54, shape: 'pill', variant: 'ok' },
      { id: 'G', label: 'Guides', x: 0.84, y: 0.46, w: 120, h: 54, shape: 'pill', variant: 'ok' },
      { id: 'N', label: 'Annotations', x: 0.92, y: 0.22, w: 170, h: 56, shape: 'pill', variant: 'accent' },
      { id: 'I', label: 'Interaction', x: 0.92, y: 0.70, w: 170, h: 56, shape: 'pill', variant: 'accent' },
      { id: 'L', label: 'Layout', x: 0.50, y: 0.82, w: 220, h: 60, shape: 'pill', variant: 'muted' },
    ],
    edges: [
      { from: 'D', to: 'T' },
      { from: 'T', to: 'S' },
      { from: 'S', to: 'A' },
      { from: 'A', to: 'M' },
      { from: 'M', to: 'G' },
      { from: 'G', to: 'N', dashed: true, stroke: 'rgba(148,163,184,0.55)' },
      { from: 'G', to: 'I', dashed: true, stroke: 'rgba(148,163,184,0.55)' },
      { from: 'T', to: 'L', dashed: true, stroke: 'rgba(148,163,184,0.55)' },
    ],
  },

  'binding-to-spec': {
    height: 240,
    ariaLabel: 'Data binding idea in spec-based tools: dataframe to encoding spec to renderer to output.',
    nodes: [
      { id: 'DF', label: 'DataFrame\n(rows)', x: 0.20, y: 0.55, w: 210, h: 76, variant: 'primary' },
      { id: 'SP', label: 'Spec\n(field → channel)', x: 0.50, y: 0.55, w: 240, h: 76, variant: 'note' },
      { id: 'RE', label: 'Renderer\n(Vega/JS)', x: 0.74, y: 0.55, w: 200, h: 76, variant: 'note' },
      { id: 'OUT', label: 'Output\nSVG/HTML', x: 0.92, y: 0.55, w: 180, h: 66, variant: 'ok' },
    ],
    edges: [
      { from: 'DF', to: 'SP' },
      { from: 'SP', to: 'RE' },
      { from: 'RE', to: 'OUT' },
    ],
  },

  'tooltip-rule': {
    height: 220,
    ariaLabel: 'Tooltip rule: tooltips confirm values; chart should remain readable without hovering.',
    nodes: [
      { id: 'C', label: 'Chart', x: 0.22, y: 0.52, w: 200, h: 70, variant: 'primary' },
      { id: 'T', label: 'Tooltip', x: 0.52, y: 0.52, w: 200, h: 70, variant: 'note' },
      { id: 'R', label: 'Rule:\nConfirm, don’t decode', x: 0.82, y: 0.52, w: 280, h: 76, variant: 'ok' },
    ],
    edges: [
      { from: 'C', to: 'T' },
      { from: 'T', to: 'R' },
    ],
  },

  'selection-patterns': {
    height: 280,
    ariaLabel: 'Interaction patterns: selection, brushing, and filtering mapped to common tasks.',
    nodes: [
      { id: 'SEL', label: 'Selection\n(click a group)', x: 0.22, y: 0.30, w: 240, h: 76, variant: 'primary' },
      { id: 'BR', label: 'Brushing\n(select a range)', x: 0.50, y: 0.30, w: 240, h: 76, variant: 'primary' },
      { id: 'FIL', label: 'Filtering\n(reduce space)', x: 0.78, y: 0.30, w: 240, h: 76, variant: 'primary' },
      { id: 'T1', label: 'Compare a focus group\nvs others', x: 0.22, y: 0.70, w: 260, h: 76, variant: 'note' },
      { id: 'T2', label: 'Focus on a time window\nor region', x: 0.50, y: 0.70, w: 260, h: 76, variant: 'note' },
      { id: 'T3', label: 'Handle many categories\nor large data', x: 0.78, y: 0.70, w: 260, h: 76, variant: 'note' },
    ],
    edges: [
      { from: 'SEL', to: 'T1', dashed: true, arrow: false, stroke: 'rgba(148,163,184,0.55)' },
      { from: 'BR', to: 'T2', dashed: true, arrow: false, stroke: 'rgba(148,163,184,0.55)' },
      { from: 'FIL', to: 'T3', dashed: true, arrow: false, stroke: 'rgba(148,163,184,0.55)' },
    ],
  },

  'tool-chooser-python': {
    height: 320,
    ariaLabel: 'Practical chooser for Python visualization tools based on artifact needs.',
    nodes: [
      { id: 'Q', label: 'What do you need\nto deliver?', x: 0.18, y: 0.50, w: 260, h: 76, variant: 'primary' },
      { id: 'S', label: 'Static,\nfull control', x: 0.48, y: 0.28, w: 200, h: 70, variant: 'note' },
      { id: 'ST', label: 'Stats plots\n+ facets', x: 0.48, y: 0.50, w: 200, h: 70, variant: 'note' },
      { id: 'G', label: 'Grammar spec\n(+ light interaction)', x: 0.48, y: 0.72, w: 240, h: 76, variant: 'note' },
      { id: 'M', label: 'Matplotlib', x: 0.78, y: 0.28, w: 200, h: 66, variant: 'ok' },
      { id: 'SB', label: 'Seaborn', x: 0.78, y: 0.50, w: 200, h: 66, variant: 'ok' },
      { id: 'A', label: 'Altair', x: 0.78, y: 0.72, w: 200, h: 66, variant: 'ok' },
      { id: 'P', label: 'Interactive\nHTML dashboard', x: 0.78, y: 0.90, w: 240, h: 76, variant: 'accent' },
    ],
    edges: [
      { from: 'Q', to: 'S' },
      { from: 'Q', to: 'ST' },
      { from: 'Q', to: 'G' },
      { from: 'S', to: 'M' },
      { from: 'ST', to: 'SB' },
      { from: 'G', to: 'A' },
      { from: 'A', to: 'P', dashed: true, stroke: 'rgba(148,163,184,0.55)' },
      { from: 'SB', to: 'P', dashed: true, stroke: 'rgba(148,163,184,0.55)' },
      { from: 'M', to: 'P', dashed: true, stroke: 'rgba(148,163,184,0.55)' },
    ],
  },
}
