---
title: Visualization Design Practice
titleTemplate: ':title'
subtitle: "Tabular, Dashboards, Network, and Spatial Data"
theme: apple-basic
colorSchema: dark
layout: intro
transition: fade-out
author: Marc Reyes
mdc: true
fonts:
  provider: none
  sans:
    - -apple-system
    - BlinkMacSystemFont
    - "SF Pro Text"
    - "SF Pro Display"
    - "Helvetica Neue"
    - Arial
    - sans-serif
defaults:
  layout: default
  transition: fade-out
  class: "leading-relaxed"
info: |
  DATA101 — Advanced Visualization Practice
---

# Visualization Practice Deep Dive

From data structure to structure of views.

<div class="absolute bottom-10 left-14 leading-tight">
  <div class="text-xl font-700">Marc Reyes</div>
  <div class="op70">Professional Lecturer · De La Salle University</div>
  <div class="op70">DATA101 — Visualization and Storytelling</div>
</div>

---
class: "leading-relaxed viz-slide"

## Part 1: Tabular Data

Tabular data is the default language of business, science, and education dashboards: rows and columns.

<div class="viz-frame mt-5">
  <div class="card">
    <div class="kicker">Tabular structure</div>
    <div class="grid grid-cols-2 gap-4 mt-3">
      <div>
        <div class="text-sm font-700">Rows (records)</div>
        <div class="op70">student, day, product, station</div>
      </div>
      <div>
        <div class="text-sm font-700">Columns (attributes)</div>
        <div class="op70">metric_1, metric_2, category, date, region</div>
      </div>
    </div>
    <div class="mt-2 text-sm op70">
      <span class="font-700">Value</span> is the numeric measure attached to each row/column intersection.
    </div>
  </div>
</div>

<div class="viz-grow">
  <D3ConceptDiagram diagram="dataset-types-menu" fullscreen />
</div>

---
class: "leading-relaxed viz-slide"

## What the dataset can do for us first

<div class="grid grid-cols-2 gap-4 mt-6">
  <div class="card">
    <div class="kicker">Comparison</div>
    <div class="mt-2">Compare groups, categories, products, or time slices.</div>
  </div>
  <div class="card">
    <div class="kicker">Trend</div>
    <div class="mt-2">Read change over ordered coordinates (time, distance, sequence).</div>
  </div>
  <div class="card">
    <div class="kicker">Distribution</div>
    <div class="mt-2">Read spread, shape, tails, concentration, and extremes.</div>
  </div>
  <div class="card">
    <div class="kicker">Decision</div>
    <div class="mt-2">Pick chart family by question before picking visuals.</div>
  </div>
</div>

---
class: "leading-relaxed viz-slide"

## What the dataset can do for us first (mapping by task)

<div class="viz-grow">
  <D3ConceptDiagram diagram="type-to-channels" fullscreen />
</div>

---
class: "leading-relaxed viz-slide"
## Comparison Tasks: one-row cheat sheet

<div class="viz-grow">
  <D3DecisionMatrix mode="comparison" class="viz-fill" />
</div>

---
class: "leading-relaxed viz-slide"
## Comparison Tasks: one-row cheat sheet (interactive routing map)

<div class="viz-grow">
  <D3ConceptDiagram diagram="type-to-channels" fullscreen />
</div>

---
class: "leading-relaxed viz-slide"
## Comparison View Choice: few categories

<div class="viz-grow">
  <D3ConceptDiagram diagram="comparison-few-categories" fullscreen />
</div>

<div class="callout mt-3">
  <div class="kicker">Design move</div>
  <div class="text-md font-700">Sort before color. Keep scale constant across comparable panels.</div>
</div>

---
class: "leading-relaxed viz-slide"

## Comparison View Choice: many categories

When categories exceed perceptual limits, move from item-level comparison to pattern-level comparison.

<div class="grid grid-cols-2 gap-4 mt-6">
  <div class="card">
    <div class="kicker">Primary strategy</div>
    <div class="mt-2">Aggregate into cohorts then compare cohort medians.</div>
  </div>
  <div class="card">
    <div class="kicker">Secondary strategy</div>
    <div class="mt-2">Switch from labels to ranked tables linked to bar sparkline thumbnails.</div>
  </div>
  <div class="card">
    <div class="kicker">Encoding</div>
    <div class="mt-2">Heatmap of percentage-of-max per group by time/segment.</div>
  </div>
  <div class="card">
    <div class="kicker">Interaction</div>
    <div class="mt-2">Search + sort + filter to narrow to top-k before compare.</div>
  </div>
</div>

<div class="viz-grow">
  <D3ConceptDiagram diagram="category-order" fullscreen />
</div>

---
class: "leading-relaxed viz-slide"

## Comparison Anti-patterns (hard-fail)

<div class="card">
  <div class="kicker">1) Baseline confusion</div>
  <div class="mt-2">Comparing percentages from incompatible denominators as if they were absolute counts.</div>
</div>

<div class="card mt-4">
  <div class="kicker">2) Area overload</div>
  <div class="mt-2">Stacked bars for comparison of small components create false visual hierarchy.</div>
</div>

<div class="card mt-4">
  <div class="kicker">3) Zero-order sorting</div>
  <div class="mt-2">Alphabetical category order while task needs ranked or temporal order.</div>
</div>

<div class="viz-grow">
  <D3ConceptDiagram diagram="chart-first-trap" fullscreen />
</div>

---
class: "leading-relaxed viz-slide"
## Trends: what changes over ordered domain

A trend task requires:

- A shared ordered axis.
- A stable baseline.
- A meaningful sampling interval.

<div class="viz-grow">
  <D3MiniInteractiveLine class="viz-fill" />
</div>

---
class: "leading-relaxed viz-slide"
## Trend Encodings: select by signal type

<div class="grid grid-cols-2 gap-4 mt-5">
  <div class="card">
    <div class="kicker">Volatility sensitive</div>
    <div class="text-xl font-700 mt-1">Line + area accents</div>
    <div class="op70 mt-2">Use only if trend magnitude is positive and cumulative meaning is clear.</div>
  </div>
  <div class="card">
    <div class="kicker">Relative trend</div>
    <div class="text-xl font-700 mt-1">Indexed baseline (100)</div>
    <div class="op70 mt-2">Compare percentages over time even with different starting values.</div>
  </div>
  <div class="card">
    <div class="kicker">Event-based trend</div>
    <div class="text-xl font-700 mt-1">Vertical markers + annotations</div>
    <div class="op70 mt-2">Make interventions legible next to inflection points.</div>
  </div>
  <div class="card">
    <div class="kicker">Sparsely sampled</div>
    <div class="text-xl font-700 mt-1">Step + markers</div>
    <div class="op70 mt-2">Do not interpolate between unrelated records.</div>
  </div>
</div>

<div class="viz-grow">
  <D3ConceptDiagram diagram="trend-task-router" fullscreen />
</div>

---
class: "leading-relaxed viz-slide"
## Trend Encodings: select by signal type (interactive selector)

<div class="viz-grow">
  <D3ConceptDiagram diagram="smoothing" fullscreen />
</div>

---
class: "leading-relaxed viz-slide"
## Trend traps you can still catch in peer review

- Implicitly connecting non-equidistant timestamps.
- Smoothed lines that erase short-cycle oscillation.
- One shared y-axis for fundamentally different magnitudes.
- Axis clipping that deletes dip and recovery.

<div class="callout mt-4">
  <div class="kicker">Repair pattern</div>
  <div class="text-md">Show the raw line in light gray, then overlay modeled trend in bold.</div>
</div>

<div class="viz-grow">
  <D3ConceptDiagram diagram="smoothing" fullscreen />
</div>

---
class: "leading-relaxed viz-slide"
## Distribution: what a distribution asks

For one variable: concentration, symmetry, extremes.
For two+ variables: shape shift, overlap, and tail risk.

<div class="viz-grow">
  <D3MiniHistogramFacets class="viz-fill" />
</div>

---
class: "leading-relaxed viz-slide"

## Histograms: binning is a claim

A histogram is not a neutral view. Bins are a modeling decision.

- Few bins: smooth story, less detail.
- Many bins: sensitive tails, more noise.
- Equal-width bins: default, but can hide skew in sparse regions.
- Density-equalized bins: safer when long-tail behavior matters.

<div class="viz-grow">
  <D3ConceptDiagram diagram="bins-scales" fullscreen />
</div>

<div class="callout mt-4">
  <div class="kicker">Rule</div>
  <div class="text-md">Keep bin strategy explicit in caption and tooltip metadata.</div>
</div>

---
class: "leading-relaxed viz-slide"

## Box and violin: same data, different stories

<div class="grid grid-cols-2 gap-4 mt-6">
  <div class="card">
    <div class="kicker">Box plot</div>
    <div class="mt-2">Great for median, IQR, and outlier thresholds.</div>
    <div class="mt-2">Weak with multimodality.</div>
  </div>
  <div class="card">
    <div class="kicker">Violin plot</div>
    <div class="mt-2">Great for modality and density shape.</div>
    <div class="mt-2">Can hide small-sample uncertainty unless annotated.</div>
  </div>
</div>

<div class="viz-grow">
  <D3ConceptDiagram diagram="box-vs-violin" fullscreen />
</div>

  <div class="card mt-4">
    <div class="kicker">Cross-check</div>
    <div class="mt-2">Never pair box + violin without reporting sample size.</div>
  </div>

---
class: "leading-relaxed viz-slide"
## Box and violin: micro-interactions on comparisons

<div class="viz-grow">
  <D3ConceptDiagram diagram="subtasks-mindmap" fullscreen />
</div>

---
class: "leading-relaxed viz-slide"
## Mini workflow: comparison + trend + distribution in one tabular task

<div class="viz-frame mt-4">
  <div class="card">
    <div class="kicker">Mini workflow for one question</div>
    <div class="mt-2"><span class="font-700">1.</span> Specify task: compare regions on average score, track trend across months, inspect distribution of students per region.</div>
    <div class="mt-2"><span class="font-700">2.</span> Choose coordinated views: ranked bars, trend lines, histogram panel.</div>
    <div class="mt-2"><span class="font-700">3.</span> Link filtering by region and month.</div>
    <div class="mt-2"><span class="font-700">4.</span> Hide noncritical legend text by default; reveal on hover.</div>
  </div>
</div>

<div class="viz-grow">
  <D3ConceptDiagram diagram="case-study-student-flow" fullscreen />
</div>

---
class: "leading-relaxed viz-slide"
## Transition to Part 2: dashboards

One question: if you can solve all insights in one chart, do you still need a dashboard?

<aside>
If no, make it two or more coordinated views.
</aside>

<div class="viz-grow">
  <D3ConceptDiagram diagram="iteration-cycle" fullscreen />
</div>

---
class: "leading-relaxed viz-slide"

## Part 2: Multi-view Dashboards

Dashboards are not collections. They are arguments arranged in space.

<div class="callout mt-6">
  <div class="text-lg font-700">Decision-first principle</div>
  <div class="mt-2">Every view exists to answer a decision-relevant question.</div>
</div>

<div class="viz-grow">
  <D3ConceptDiagram diagram="dash-layout-tree" fullscreen />
</div>

---
class: "leading-relaxed viz-slide"
## What to show

<div class="grid grid-cols-3 gap-4 mt-5">
  <div class="card">
    <div class="kicker">Must include</div>
    <div class="mt-2">Current state KPI</div>
  </div>
  <div class="card">
    <div class="kicker">Must include</div>
    <div class="mt-2">Primary driver(s) of change</div>
  </div>
  <div class="card">
    <div class="kicker">Must include</div>
    <div class="mt-2">Context and comparison baseline</div>
  </div>
</div>

<div class="viz-grow">
  <D3ConceptDiagram diagram="chart-components" fullscreen />
</div>

---
class: "leading-relaxed viz-slide"
## What to show (interactive map)

<div class="viz-grow">
  <D3ConceptDiagram diagram="chart-components" fullscreen />
</div>

---
class: "leading-relaxed viz-slide"
## What to hide

<div class="card">
  <div class="kicker">Hide by default</div>
  <div class="mt-2">Complex labels, raw IDs, secondary metrics, decorative effects, unused controls.</div>
</div>

<div class="grid grid-cols-2 gap-4 mt-4">
  <div class="card">
    <div class="kicker">Reveal-on-demand</div>
    <div class="mt-2">Methodology notes, outlier definitions, metadata lineage.</div>
  </div>
<div class="card">
  <div class="kicker">Reveal-on-hover/click</div>
  <div class="mt-2">Secondary details and drill-down tables.</div>
  </div>
</div>

<div class="viz-grow">
  <D3ConceptDiagram diagram="tasks-to-interactions" fullscreen />
</div>

---
class: "leading-relaxed viz-slide"

## Layout pattern: overview then decision lanes

This pattern is the first structural decision of any dashboard: show a single orientation lane before branching into alternatives.

<div class="callout mt-4">
  <div class="kicker">Why</div>
  <div class="text-md">Decision-makers scan top-down. Put orientation first, interrogation second.</div>
</div>

<div class="viz-grow">
  <D3ConceptDiagram diagram="dashboard-overview-lanes" fullscreen />
</div>

---
class: "leading-relaxed viz-slide"
## Layout pattern: overview then decision lanes (interactive)

<div class="viz-grow">
  <D3ConceptDiagram diagram="dashboard-overview-lanes" fullscreen />
</div>

---
class: "leading-relaxed viz-slide"

## Layout pattern: investigative triage

<div class="grid grid-cols-2 gap-4 mt-4">
  <div class="card">
    <div class="kicker">Panel A</div>
    <div class="mt-2">Hypothesis selector + filters.</div>
  </div>
  <div class="card">
    <div class="kicker">Panel B</div>
    <div class="mt-2">Filtered main chart with interaction state.</div>
  </div>
  <div class="card">
    <div class="kicker">Panel C</div>
    <div class="mt-2">Evidence panel: top contributors.</div>
  </div>
  <div class="card">
    <div class="kicker">Panel D</div>
    <div class="mt-2">Counter-evidence and risk notes.</div>
  </div>
</div>

<div class="viz-grow">
  <D3ConceptDiagram diagram="dash-layout-tree" fullscreen />
</div>

---
class: "leading-relaxed viz-slide"

## Layout pattern: operations cockpit

A cockpit needs action proximity:

- Filter controls close to the chart they change.
- Confirmation feedback immediate and low noise.
- Undo + clear state visible at all times.

<div class="viz-grow">
  <D3ConceptDiagram diagram="tasks-to-interactions" fullscreen />
</div>

<div class="callout mt-4">
  <div class="kicker">Anti-pattern</div>
  <div class="text-md">Global filters that change every panel without explanation.</div>
</div>

---
class: "leading-relaxed viz-slide"

## Coordinated interaction rules

1. Selection in one chart must filter/brush linked views.
2. Hover states should be symmetric across views.
3. Tooltips should explain why data is included or excluded.

<div class="card mt-5">
  <div class="kicker">Rule</div>
  <div class="mt-2">One interaction, one effect, one source of truth.</div>
</div>

<div class="viz-grow">
  <D3ConceptDiagram diagram="selection-patterns" fullscreen />
</div>

---
class: "leading-relaxed viz-slide"

## Dashboard anti-patterns to remove

<div class="grid grid-cols-3 gap-4 mt-5">
  <div class="card">
    <div class="kicker">Anti-pattern</div>
    <div class="mt-2">Three color scales for one logical value.</div>
  </div>
  <div class="card">
    <div class="kicker">Anti-pattern</div>
    <div class="mt-2">Unlabeled filters with implicit defaults.</div>
  </div>
  <div class="card">
    <div class="kicker">Anti-pattern</div>
    <div class="mt-2">Legend repetition across every panel.</div>
  </div>
</div>

<div class="card mt-4">
  <div class="kicker">Fix</div>
  <div class="mt-2">Single shared semantic scale + minimal legends + explicit defaults.</div>
</div>

<div class="viz-grow">
  <D3ConceptDiagram diagram="inconsistent-scales" fullscreen />
</div>

---

class: "leading-relaxed viz-slide"

## Part 3: Network / Graph Data

Now shift from rows-as-observations to relationships-as-entities.

<div class="viz-grow">
  <D3ConceptDiagram diagram="network-failure-mode" fullscreen />
</div>

---
class: "leading-relaxed viz-slide"
## Network basics in one expression

A graph is any set of entities + relationships.

- Entities = actors, users, places, products, files.
- Relationships = follows, calls, ships, co-occurs, depends-on.
- Relationship attributes = direction, frequency, confidence, duration.

<div class="callout mt-6">
  <div class="kicker">Decision impact</div>
  <div class="text-md">The same entity set can require different structures if edge attributes dominate.</div>
</div>

<div class="viz-grow">
  <D3ConceptDiagram diagram="network-example" fullscreen />
</div>

---
class: "leading-relaxed viz-slide"
## Network basics in one expression (interactive structure)

<div class="viz-grow">
  <D3ConceptDiagram diagram="network-example" fullscreen />
</div>

---
class: "leading-relaxed viz-slide"

## Node-link: strongest fit

Node-link is strongest when tasks are path-aware:
- Is there a route from A to B?
- Which intermediaries bridge two communities?
- Are there key articulation points?

<div class="card mt-5">
  <div class="kicker">Strength</div>
  <div class="mt-2">Intuitive for traversal and local neighborhood reasoning.</div>
</div>

<div class="viz-grow">
  <D3ConceptDiagram diagram="network-failure-mode" fullscreen />
</div>

---
class: "leading-relaxed viz-slide"

## Node-link failure mode

At density > ~30% for N=100+, node-link often fails.

- Hairball effect.
- Long links crossing create visual debt.
- Degree variation hidden without careful scaling.

<div class="viz-grow">
  <D3ConceptDiagram diagram="network-representation-choice" fullscreen />
</div>

---
class: "leading-relaxed viz-slide"

## Matrix view: what it preserves

A matrix keeps all edges explicit.

- Same data with better visibility of dense blocks.
- Symmetric or asymmetric comparison by cell orientation.
- Better for detecting communities when density is high.

<div class="callout mt-5">
  <div class="kicker">Trade-off</div>
  <div class="text-md">Excellent for structure detection, less direct for path semantics.</div>
</div>

<div class="viz-grow">
  <D3ConceptDiagram diagram="network-representation-choice" fullscreen />
</div>

---
class: "leading-relaxed viz-slide"

## Node-link vs matrix selector

<div class="viz-grow">
  <D3DecisionMatrix mode="representation" class="viz-fill" />
</div>

---
class: "leading-relaxed viz-slide"

## Node-link vs matrix selector (interactive switch)

<div class="viz-grow">
  <D3NetworkModeSwitcher class="viz-overflow viz-fill" />
</div>

---
class: "leading-relaxed viz-slide"

## Directed and signed graphs

Directed: who initiated action matters.
Signed: relation can be positive/negative.

Visual consequences:
- Arrowheads are meaningful (not optional decoration).
- Symmetry assumptions break.
- Color and shape must encode polarity and intensity separately.

<div class="card mt-5">
  <div class="kicker">Rule</div>
  <div class="mt-2">Never encode direction and intensity with one channel.</div>
</div>

<div class="viz-grow">
  <D3ConceptDiagram diagram="directed-signed-graph" fullscreen />
</div>

---
class: "leading-relaxed viz-slide"

## Centrality and community: first-level interpretation

Before styling, compute structure:
- Degree centrality for local prominence.
- Betweenness for bridge roles.
- Modularity for community quality.
- Core/periphery for control points.

---
class: "leading-relaxed viz-slide"

## Centrality-driven encoding

Use metrics as an encoding control layer, not decoration.

<div class="callout mt-4">
  <div class="kicker">Design pattern</div>
  <div class="text-md">Scale nodes/labels by centrality, then encode bridges with edge width and direction with arrowheads.</div>
</div>

<div class="viz-grow">
  <D3ConceptDiagram diagram="centrality-community" fullscreen />
</div>

---
class: "leading-relaxed viz-slide"

## Hierarchy from graph data

Hierarchy is a constrained graph where parent-child relations dominate.

- Tree, dendrogram, sunburst, treemap are all hierarchy projections.
- Parent ambiguity is not a styling issue; it is data modeling issue.
- Multi-parent graphs are no longer strict trees and need DAG-aware design.

<div class="viz-grow">
  <D3ConceptDiagram diagram="hierarchy-example" fullscreen />
</div>

---
class: "leading-relaxed viz-slide"
## Hierarchy from graph data (interactive drill-down)

<div class="viz-grow">
  <D3ConceptDiagram diagram="hierarchy-example" fullscreen />
</div>

---
class: "leading-relaxed viz-slide"

## Treemaps: space-filling hierarchy

Treemaps trade geometric legibility for density.

<div class="grid grid-cols-2 gap-4 mt-6">
  <div class="card">
    <div class="kicker">Good</div>
    <div class="mt-2">Excellent for “what dominates” and “where does mass sit?”.</div>
  </div>
  <div class="card">
    <div class="kicker">Weak</div>
    <div class="mt-2">Bad at comparing near-equal siblings due to area perception variance.</div>
  </div>
  <div class="card">
    <div class="kicker">Best use</div>
    <div class="mt-2">Weighted hierarchical budgets and catalogues.</div>
  </div>
  <div class="card">
    <div class="kicker">Fix</div>
    <div class="mt-2">Use squarified treemap + sorted labels + sorted legend.</div>
  </div>
</div>

<div class="viz-grow">
  <D3ConceptDiagram diagram="graph-hierarchy-tree-choice" fullscreen />
</div>

---
class: "leading-relaxed viz-slide"
## Treemap in context with network task

<div class="viz-grow">
  <D3ConceptDiagram diagram="graph-hierarchy-tree-choice" fullscreen />
</div>

---
class: "leading-relaxed viz-slide"
## Part 4: Spatial Data

Spatial data answers questions tied to location and neighborhood context.

- Geometry is inseparable from value.
- Region boundaries and projection choice are part of analysis, not style.
- Spatial joins can silently alter counts.

---
class: "leading-relaxed viz-slide"

## Map data model

<div class="grid grid-cols-2 gap-4 mt-5">
  <div class="card">
    <div class="kicker">Geometry</div>
    <div class="mt-2">Points, lines, polygons, raster cells.</div>
  </div>
  <div class="card">
    <div class="kicker">Join keys</div>
    <div class="mt-2">Region IDs, codes, coordinates, geohash levels.</div>
  </div>
  <div class="card">
    <div class="kicker">Projection</div>
    <div class="mt-2">Mercator, Albers, Equal-area variants.</div>
  </div>
  <div class="card">
    <div class="kicker">Normalize</div>
    <div class="mt-2">Per-capita, rate, density and standardization.</div>
  </div>
</div>

---
class: "leading-relaxed viz-slide"

## Map data model (interactive)

<div class="viz-grow">
  <D3ConceptDiagram diagram="map-data-model" fullscreen />
</div>

---
class: "leading-relaxed viz-slide"

## Choropleth: when it works

Use choropleth when asking about:
- Regional prevalence
- Spatial concentration
- Rate comparisons across territories
 
<div class="callout mt-4">
  <div class="kicker">Decision split</div>
  <div class="text-md">Use only where region size is comparable and denominator is stable.</div>
</div>

---
class: "leading-relaxed viz-slide"

## Choropleth: when it does not fit

Do not use when:
- Population differs drastically between regions
- Regions are tiny but numerous
- Within-region variation is huge

---
class: "leading-relaxed viz-slide"

## Choropleth checks before publish

<div class="callout mt-4">
  <div class="kicker">Mandatory</div>
  <div class="text-md">Normalize before color, and annotate class breaks.</div>
</div>

---
class: "leading-relaxed viz-slide"
## Choropleth: when it works (interactive map)

<div class="viz-grow">
  <D3SpatialMiniMap startMode="choropleth" class="viz-overflow viz-fill" />
</div>

---
class: "leading-relaxed viz-slide"
## Choropleth: color strategy

- Use sequential scales for rates.
- Use diverging scales for positive/negative deviation.
- Avoid rainbow and equal-interval bins when distribution is skewed.

<div class="viz-grow">
  <D3ConceptDiagram diagram="choropleth-pipeline" fullscreen />
</div>

---
class: "leading-relaxed viz-slide"

## Symbol maps and graduated symbols

Symbols handle event counts and discrete magnitude better than choropleth in sparse contexts.

- Mark size with value.
- Keep symbol overlap controlled.
- Add edge buffering so nearby points remain readable.

<div class="viz-grow">
  <D3SpatialMiniMap startMode="symbols" class="viz-overflow viz-fill" />
</div>

<div class="card mt-5">
  <div class="kicker">Do not</div>
  <div class="mt-2">Do not stack symbol and choropleth on same value without encoding distinction.</div>
</div>

---
class: "leading-relaxed viz-slide"

## Spatial overlays and hybrid patterns

Useful combinations:
- Basemap + symbol bubbles + topographic reference.
- Basemap + choropleth + insets.
- Flow lines + symbol nodes for movement tasks.

<div class="viz-grow">
  <D3SpatialMiniMap startMode="both" class="viz-overflow viz-fill" />
</div>

<div class="callout mt-5">
  <div class="kicker">Decision point</div>
  <div class="text-md">Ask: does each layer answer one non-overlapping question?</div>
</div>

---
class: "leading-relaxed viz-slide"

## Common map pitfalls (and fixes)

- MAUP: changing region boundaries changes apparent effect.
- Ecological fallacy: interpreting area-level results as individual behavior.
- Projection distortion: distances and angles misread.
- Color overreach: same palette for divergent metrics.

<div class="grid grid-cols-2 gap-4 mt-6">
  <div class="card">
    <div class="kicker">Fix</div>
    <div class="mt-2">Fix geography, rates, and metadata in methods panel.</div>
  </div>
  <div class="card">
    <div class="kicker">Fix</div>
    <div class="mt-2">Add uncertainty and denominator notes when showing map claims.</div>
  </div>
</div>

<div class="viz-grow">
  <D3ConceptDiagram diagram="spatial-pitfalls" fullscreen />
</div>

---

class: "leading-relaxed viz-slide"

## Spatial mini-checklist before publish

1. Are geometries valid and snapped?
2. Are boundaries explicit in caption?
3. Are values normalized with a defensible denominator?

<div class="viz-grow">
  <D3ConceptDiagram diagram="spatial-pitfalls" fullscreen />
</div>

---
class: "leading-relaxed viz-slide"

## Spatial mini-checklist before publish

<div class="callout mt-5">
  <div class="kicker">Outcome</div>
  <div class="text-md">A map without this checklist is an argument with missing assumptions.</div>
</div>

4. Are class breaks stable and reported?
5. Is colorblind-safe and print-safe?
6. Are projection biases described?

<div class="viz-grow">
  <D3ConceptDiagram diagram="spatial-pitfalls" fullscreen />
</div>

---
class: "leading-relaxed viz-slide"

## Long Quiz: 50 points (all topics)

- Mixed format: multiple-choice + applied analysis.
- One sheet. Cite slide number and one line of justification per item.
- Total: 50 points.

<div class="callout mt-3">
  <div class="kicker">Instruction</div>
  <div class="text-md">No lookup. Write to a task, a data-shape, and a visual trade-off.</div>
</div>

<div class="viz-grow">
  <D3ConceptDiagram diagram="why-how-what-framework" fullscreen />
</div>

---
class: "leading-relaxed viz-slide"

## Quiz Part I — Tabular Data (13 pts)

1) (2 pts) A finance manager asks: which campus unit has the worst change in retention from Month 1 to Month 6?  
a) Small multiples  
b) Single bar line-up  
c) Slope chart with shared baseline  
d) Raw table only
2) (2 pts) Class-size is scored 2–4 and appears clearly bimodal. Which chart stack is the **best first-pass trio** for tails + midpoint shifts?  
a) Box plot only  
b) Histogram trio + median trend  
c) Dot + violin + summary table  
d) Bar chart + area  

---
class: "leading-relaxed viz-slide"

## Quiz Part I — Tabular Data (13 pts) (continued)

3) (2 pts) Given the same class-size distribution and n=18 in one class, explain exactly **which choice** between 5-bin and 20-bin histograms is safer for inference and where it fails.
4) (1 pt) Pick one statistic that must be reported before ranking retention quantiles with outliers.

---
class: "leading-relaxed viz-slide"

## Quiz Part I — Tabular Data (13 pts) (continued)

5) (2 pts) Match these tasks to one chart family each (one answer each):  
- Compare 12 regional medians over 8 months  
- Detect whether a long right tail drives subgroup inequality  
- Flag whether a treatment changed a ranking order  
6) (2 pts) Briefly propose a trend+distribution workflow for the same retention table with the least redundancy.
7) (2 pts) A dashboard asks: “what changed, where changed, and how much uncertainty.” Rank three encodings in best-to-worst order and justify the order with two constraints.

<div class="viz-grow">
  <D3ConceptDiagram diagram="comparison-few-categories" fullscreen />
</div>

---
class: "leading-relaxed viz-slide"

## Quiz Part II — Dashboards (12 pts)

1) (2 pts) A manager dashboard has 3 action buttons, 5 KPIs, and 6 filters.  
Which two controls hide by default?  
2) (2 pts) You must build three views for one operational decision. Assign roles to each view and include what state each view persists (or not).  
3) (3 pts) In a monitoring cockpit, evaluate: global filter + immediate sync vs local filter + staged sync.  
4) (2 pts) You discover duplicate legends that repeat across 4 panels. Give two anti-pattern names and two structural remediations.  
5) (1 pt) True/false with explanation: “More tooltips always increase cognitive clarity.”  
6) (2 pts) You need coordinated filtering across a map, table, and trend panel with very different units. Propose interaction semantics in one paragraph.  

<div class="viz-grow">
  <D3ConceptDiagram diagram="dashboard-overview-lanes" fullscreen />
</div>

---
class: "leading-relaxed viz-slide"

## Quiz Part III — Network / Graph (13 pts)

1) (2 pts) For a 12k-edge dense social graph, pick representation for community detection and justify one failure mode in the same sentence.  
2) (3 pts) You must show who bridges two departments and all shortest routes. Choose:  
a) node-link with weighted arrows  
b) matrix with row/col ordering  
c) treemap with hierarchy groups  
d) dual-axis scatter overlay
3) (2 pts) A strict hierarchy has occasional cross-links. Which view is primary, and what becomes the exception case?  
4) (2 pts) Signed + directed edges are present. Propose channel assignment for direction, polarity, and weight that avoids semantic collision.  
5) (2 pts) In one sentence, compare treemap and node-link for budget allocation where both flow and composition are debated.  
6) (2 pts) Given a weighted directed graph where 60% of labels overlap, choose one layout strategy that maximizes path legibility and one that maximizes matrix comparability.

<div class="viz-grow">
  <D3ConceptDiagram diagram="network-representation-choice" fullscreen />
</div>

---
class: "leading-relaxed viz-slide"

## Quiz Part IV — Spatial (10 pts)

1) (2 pts) A policy compares unemployment across provinces with uneven population. Why raw choropleth misleads and what correction is required?  
2) (2 pts) Two maps (choropleth + symbol) show opposite hotspots. Provide two technical causes (not “bad data”).  
3) (2 pts) Which projection type is safer for area-sensitive island comparisons: equal-area or mercator? defend with one sentence.  
4) (2 pts) You need counts + intensity on one map. Which layering order prevents false inference?  
5) (2 pts) Choose three map pitfalls and pair each with one mitigation sentence.

<div class="viz-grow">
  <D3ConceptDiagram diagram="choropleth-counts" fullscreen />
</div>

---
class: "leading-relaxed viz-slide"

## Quiz Part V — Integrated Case (2 pts)

A city reports: student enrolment, social referral graph, and clinic locations by district. Build a 3-view analysis plan.

1) (2 pts) Design the first-pass layout and interaction choreography for first 60 seconds: specify roles for three panels and one transition rule.

<div class="viz-grow">
  <D3ConceptDiagram diagram="case-study-student-flow" fullscreen />
</div>
