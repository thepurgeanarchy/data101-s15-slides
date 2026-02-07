---
title: Interactive Charts and Data Apps
subtitle: "DATA101 — Plotly in Python, Interactive Libraries, and Dash Fundamentals"
theme: apple-basic
colorSchema: dark
layout: intro
transition: fade-out
author: Marc Reyes
mdc: true
addons:
  - slidev-addon-python-runner
monacoRun:
  python:
    loadPackagesFromImports: true
python:
  loadPackagesFromImports: true
  suppressDeprecationWarnings: true
  alwaysReload: false
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
  mono:
    - ui-monospace
    - SFMono-Regular
    - Menlo
    - Monaco
    - Consolas
    - "Liberation Mono"
    - "Courier New"
    - monospace
defaults:
  layout: default
  transition: fade-out
  class: "leading-relaxed"
info: |
  Professional Lecturer: Marc Reyes (marc.reyes@dlsu.edu.ph)
---

# Interactive Charts and Data Apps

Plotly in Python, interactive chart patterns, and Dash fundamentals (layout + callbacks).

<div class="absolute bottom-10 left-14 leading-tight">
  <div class="text-xl font-700">Marc Reyes</div>
  <div class="op70">Professional Lecturer · marc.reyes@dlsu.edu.ph</div>
  <div class="op70">DATA101 — De La Salle University</div>
</div>

---

## Today’s Plan

<div class="grid grid-cols-2 gap-4 mt-6">
  <div class="card">
    <div class="kicker">01 · Interactivity</div>
    <div class="text-2xl font-700 mt-1"><span class="icon-inline sm i-carbon:cursor-1 mr-2"></span>Show not tell</div>
    <div class="op70 mt-2">Hover, zoom, selections, and linked views.</div>
  </div>
  <div class="card">
    <div class="kicker">02 · Plotly (Python)</div>
    <div class="text-2xl font-700 mt-1"><span class="icon-inline sm i-carbon:chart-line-data mr-2"></span>Interactive charts</div>
    <div class="op70 mt-2">Build a figure, export HTML, ship.</div>
  </div>
  <div class="card">
    <div class="kicker">03 · Choosing tools</div>
    <div class="text-2xl font-700 mt-1"><span class="icon-inline sm i-carbon:notebook-reference mr-2"></span>Other libraries</div>
    <div class="op70 mt-2">Altair, Bokeh, Panel, Streamlit, Dash.</div>
  </div>
  <div class="card">
    <div class="kicker">04 · Dash</div>
    <div class="text-2xl font-700 mt-1"><span class="icon-inline sm i-carbon:application-web mr-2"></span>Layout + callbacks</div>
    <div class="op70 mt-2">From charts to data apps.</div>
  </div>
</div>

---

## Learning Outcomes

<div class="grid grid-cols-2 gap-4 mt-8">
  <div class="card">
    <div class="kicker">Design</div>
    <div class="text-xl font-700 mt-1">Choose interactions intentionally</div>
    <div class="op70 mt-2">Task first, then hover/zoom/selection.</div>
  </div>
  <div class="card">
    <div class="kicker">Plotly</div>
    <div class="text-xl font-700 mt-1">Ship a single HTML artifact</div>
    <div class="op70 mt-2">Interactive, portable, reproducible.</div>
  </div>
  <div class="card">
    <div class="kicker">Dash</div>
    <div class="text-xl font-700 mt-1">Explain layout + callbacks</div>
    <div class="op70 mt-2">Inputs → function → outputs.</div>
  </div>
  <div class="card">
    <div class="kicker">Professionalism</div>
    <div class="text-xl font-700 mt-1">Make defaults readable</div>
    <div class="op70 mt-2">If it only works on hover, it is fragile.</div>
  </div>
</div>

---

## Why Interactivity Exists

<div class="grid grid-cols-2 gap-4 mt-8">
  <div class="card">
    <div class="kicker">When static breaks</div>
    <div class="text-xl font-800 mt-1">Dense charts</div>
    <div class="op70 mt-2">Too many points, too many series, too many categories.</div>
  </div>
  <div class="card">
    <div class="kicker">What interactivity does</div>
    <div class="text-xl font-800 mt-1">Reduces viewer work</div>
    <div class="op70 mt-2">Filter, zoom, and inspect without crowding the canvas.</div>
  </div>
</div>

<div class="callout mt-6">
  <div class="font-800">Rule</div>
  <div class="op80 mt-1">Interactivity must support a task, not decorate a chart.</div>
</div>

---
class: tight-layout
---

## Interactive Chart vs Data App

<D3ConceptDiagram diagram="interactive-chart-vs-app" class="mt-5 viz-compact" />

<div class="grid grid-cols-2 gap-4 mt-3">
  <div class="card !p-3">
    <div class="kicker">Interactive chart</div>
    <div class="op70 mt-1">A single figure with built-in interactions.</div>
  </div>
  <div class="card !p-3">
    <div class="kicker">Data app</div>
    <div class="op70 mt-1">A set of callbacks that update multiple views.</div>
  </div>
</div>

---

## The 3 Non-Negotiables

<div class="grid grid-cols-3 gap-4 mt-8">
  <div class="card">
    <div class="kicker">01</div>
    <div class="text-xl font-900 mt-1">Good defaults</div>
    <div class="op70 mt-2">Readable without hovering.</div>
  </div>
  <div class="card">
    <div class="kicker">02</div>
    <div class="text-xl font-900 mt-1">Fixed scales</div>
    <div class="op70 mt-2">Comparable frames and states.</div>
  </div>
  <div class="card">
    <div class="kicker">03</div>
    <div class="text-xl font-900 mt-1">Clear reset</div>
    <div class="op70 mt-2">No mystery states.</div>
  </div>
</div>

<div class="callout mt-6">
  <div class="font-800">Professional habit</div>
  <div class="op80 mt-1">Assume your viewer will screenshot your chart while it is in a weird state.</div>
</div>

---
layout: section
---

<div class="kicker">Part 1 · Interactive Charts</div>

# <span class="icon-inline i-carbon:cursor-1 mr-3"></span>Interactivity supports a task

Hover, zoom, selection, and linked views.

---

## What Interactivity Is For

<div class="grid grid-cols-2 gap-4 mt-6">
  <div class="card">
    <div class="kicker">Inspect</div>
    <div class="text-xl font-800 mt-1">Hover for exact values</div>
    <div class="op70 mt-2">Tooltips replace cluttered labels.</div>
  </div>
  <div class="card">
    <div class="kicker">Focus</div>
    <div class="text-xl font-800 mt-1">Zoom and pan dense series</div>
    <div class="op70 mt-2">Same scale, smaller window.</div>
  </div>
  <div class="card">
    <div class="kicker">Compare</div>
    <div class="text-xl font-800 mt-1">Filter groups on demand</div>
    <div class="op70 mt-2">Legend click, dropdown, brush.</div>
  </div>
  <div class="card">
    <div class="kicker">Connect</div>
    <div class="text-xl font-800 mt-1">Linked views</div>
    <div class="op70 mt-2">One interaction updates another chart.</div>
  </div>
</div>

---

## Pattern: Tooltips

<div class="grid grid-cols-2 gap-4 mt-8">
  <div class="card">
    <div class="kicker">Goal</div>
    <div class="text-xl font-800 mt-1">Precision without clutter</div>
    <div class="op70 mt-2">Do not label everything. Label on demand.</div>
  </div>
  <div class="card">
    <div class="kicker">Tooltip should include</div>
    <ul class="mt-3">
      <li><span class="font-900">Entity</span> (what point is this?)</li>
      <li><span class="font-900">Value</span> with formatting and units</li>
      <li><span class="font-900">Context</span> (time, group, filter)</li>
    </ul>
  </div>
</div>

<div class="callout mt-6">
  <div class="font-800">Trap</div>
  <div class="op80 mt-1">If the story only exists on hover, the default view is failing.</div>
</div>

---

## Pattern: Zoom and Pan

<div class="grid grid-cols-2 gap-4 mt-8">
  <div class="card">
    <div class="kicker">Use when</div>
    <div class="text-xl font-800 mt-1">Time series is dense</div>
    <div class="op70 mt-2">The viewer needs a lens, not a different chart.</div>
  </div>
  <div class="card">
    <div class="kicker">Design rule</div>
    <div class="text-xl font-800 mt-1">Keep comparisons stable</div>
    <div class="op70 mt-2">Fixed axes, clear reset, visible current range.</div>
  </div>
</div>

---

## Pattern: Legend Filtering

<div class="grid grid-cols-2 gap-4 mt-8">
  <div class="card">
    <div class="kicker">Use when</div>
    <div class="text-xl font-800 mt-1">Many groups</div>
    <div class="op70 mt-2">Let the viewer isolate and compare groups quickly.</div>
  </div>
  <div class="card">
    <div class="kicker">Design rule</div>
    <div class="text-xl font-800 mt-1">Make clicks predictable</div>
    <div class="op70 mt-2">Click toggles; double-click isolates; always offer reset.</div>
  </div>
</div>

---

## Pattern: Selection / Brush

<div class="grid grid-cols-2 gap-4 mt-8">
  <div class="card">
    <div class="kicker">Use when</div>
    <div class="text-xl font-800 mt-1">Pick a range</div>
    <div class="op70 mt-2">Weeks 5–13, scores 80–90, or a region on a map.</div>
  </div>
  <div class="card">
    <div class="kicker">Design rule</div>
    <div class="text-xl font-800 mt-1">Show the selection state</div>
    <div class="op70 mt-2">Selected window, count of rows, and a clear way to clear.</div>
  </div>
</div>

---

## Pattern: Linked Views

<div class="grid grid-cols-2 gap-4 mt-8">
  <div class="card">
    <div class="kicker">Use when</div>
    <div class="text-xl font-800 mt-1">Overview → details</div>
    <div class="op70 mt-2">Trends first, then distributions, then record lookup.</div>
  </div>
  <div class="card">
    <div class="kicker">Design rule</div>
    <div class="text-xl font-800 mt-1">One source of truth</div>
    <div class="op70 mt-2">A single filtered dataset should drive all outputs.</div>
  </div>
</div>

---
class: viz-slide
---

## Demo: Hover + Zoom + Legend Filter

<div class="op70">Try: hover a point, drag to zoom, scroll to zoom, click legend items to isolate a program.</div>

<div class="mt-3">
  <a class="launch-btn" href="./lab/index.html#hover-legend" target="_blank" rel="noopener noreferrer">
    <span class="icon-inline i-carbon:launch"></span>
    Open interactive lab (new tab)
  </a>
</div>

<div class="viz-grow mt-4">
  <PlotlyMiniTimeSeries class="viz-fill" />
  <div class="mt-2 text-xs op60">Tip: double-click to reset zoom.</div>
</div>

---

## Deconstruct the Demo (Why It Works)

<div class="grid grid-cols-3 gap-4 mt-8">
  <div class="card">
    <div class="kicker">Default view</div>
    <div class="text-lg font-800 mt-1">Readable line</div>
    <div class="op70 mt-2">Grid is subtle; labels are complete.</div>
  </div>
  <div class="card">
    <div class="kicker">Interaction</div>
    <div class="text-lg font-800 mt-1">Adds detail</div>
    <div class="op70 mt-2">Hover gives exact values, not more clutter.</div>
  </div>
  <div class="card">
    <div class="kicker">State</div>
    <div class="text-lg font-800 mt-1">Resettable</div>
    <div class="op70 mt-2">Zoom is reversible and predictable.</div>
  </div>
</div>

---
class: viz-slide
---

## Demo: Tooltip + Zoom (Same Data, Different Engine)

<div class="op70">This is a D3-style interaction pattern: tooltip + zoom/pan + focus line.</div>

<div class="mt-3">
  <a class="launch-btn" href="./lab/index.html#hover-legend" target="_blank" rel="noopener noreferrer">
    <span class="icon-inline i-carbon:launch"></span>
    Open interactive lab (new tab)
  </a>
</div>

<div class="viz-grow mt-4">
  <D3MiniInteractiveLine class="viz-fill" />
</div>

---

## Linked View Case Study (Reading Order)

<D3ConceptDiagram diagram="linked-views-reading-order" class="mt-8" />

<div class="callout mt-6">
  <div class="font-800">Rule</div>
  <div class="op80 mt-1">Start broad, then narrow. Do not start with tables of raw rows.</div>
</div>

---
class: viz-slide
---

## Demo: Overview → Brush → Distribution (Linked Views)

<div class="op70">Drag on the left chart to select a week range. Watch the distribution update.</div>

<div class="mt-3">
  <a class="launch-btn" href="./lab/index.html#linked-views" target="_blank" rel="noopener noreferrer">
    <span class="icon-inline i-carbon:launch"></span>
    Open interactive lab (new tab)
  </a>
</div>

<div class="viz-grow mt-4">
  <D3CaseStudyOverviewDetail class="viz-fill" />
</div>

---

## Animation (When It Helps)

<div class="grid grid-cols-2 gap-4 mt-8">
  <div class="card">
    <div class="kicker">Use animation when</div>
    <ul class="mt-3">
      <li>The task is to see <span class="font-900">change over time</span>.</li>
      <li>You keep a <span class="font-900">fixed scale</span> (comparable frames).</li>
      <li>You still provide a <span class="font-900">static alternative</span> for precision.</li>
    </ul>
  </div>
  <div class="card">
    <div class="kicker">Do not use when</div>
    <ul class="mt-3">
      <li>It is only for “wow”.</li>
      <li>It hides the baseline.</li>
      <li>It changes the scale per frame.</li>
    </ul>
  </div>
</div>

---
class: viz-slide
---

## Demo: Animation = Transitions Between States

<div class="op70">Same data, same scale. The marks move. That is all animation should be.</div>

<div class="mt-3">
  <a class="launch-btn" href="./lab/index.html#animation" target="_blank" rel="noopener noreferrer">
    <span class="icon-inline i-carbon:launch"></span>
    Open interactive lab (new tab)
  </a>
</div>

<div class="viz-grow mt-4">
  <D3AnimatedPassRateDots class="viz-fill" />
</div>

---
layout: two-cols
---

## Plotly Animations (Python Concept)

<div class="card !p-3">

```python
import plotly.express as px

# A frame per time step (week)
fig = px.scatter(
    df,
    x="pass_rate",
    y="program",
    animation_frame="week",
    animation_group="program",
    range_x=[0.60, 0.92],
)

fig.update_layout(template="plotly_dark")
fig.write_html("animated.html", include_plotlyjs="cdn")
```

</div>

::right::

<div class="card">
  <div class="kicker">What to notice</div>
  <ul class="mt-3">
    <li>Animation is just <span class="font-900">frames</span>.</li>
    <li>Keep a <span class="font-900">fixed axis range</span>.</li>
    <li>Export as a <span class="font-900">single HTML</span> when sharing.</li>
  </ul>
  <div class="mt-3 text-sm">
    <a href="https://plotly.com/python/animations/" target="_blank" rel="noopener noreferrer">plotly.com/python/animations</a>
  </div>
</div>

---
class: viz-slide
---

## Demo: Plotly Frames (In-Slide)

<div class="op70">Use the Play button or the slider. Notice the fixed x-axis range.</div>

<div class="viz-grow mt-4">
  <PlotlyMiniAnimationDots class="viz-fill" />
</div>

---

## Exporting Interactive Work

<div class="grid grid-cols-3 gap-4 mt-8">
  <div class="card">
    <div class="kicker">HTML</div>
    <div class="text-xl font-800 mt-1">Interactive</div>
    <div class="op70 mt-2">Hover, zoom, legend filtering.</div>
    <div class="op70 mt-2 text-sm">Best for: web pages, LMS, dashboards.</div>
  </div>
  <div class="card">
    <div class="kicker">PNG / SVG</div>
    <div class="text-xl font-800 mt-1">Static</div>
    <div class="op70 mt-2">Reliable for PDF + slides.</div>
    <div class="op70 mt-2 text-sm">Best for: reports, print, thumbnails.</div>
  </div>
  <div class="card">
    <div class="kicker">JSON spec</div>
    <div class="text-xl font-800 mt-1">Reusable</div>
    <div class="op70 mt-2">Store a figure, regenerate outputs.</div>
    <div class="op70 mt-2 text-sm">Best for: pipelines and QA.</div>
  </div>
</div>

---

## Static Fallback and Accessibility

<div class="grid grid-cols-2 gap-4 mt-8">
  <div class="card">
    <div class="kicker">Fallback</div>
    <div class="text-xl font-800 mt-1">Default view must stand alone</div>
    <div class="op70 mt-2">Assume the viewer prints it or screenshots it.</div>
  </div>
  <div class="card">
    <div class="kicker">Accessibility</div>
    <div class="text-xl font-800 mt-1">Do not encode with color only</div>
    <div class="op70 mt-2">Use labels, line styles, or direct annotations when needed.</div>
  </div>
</div>

<div class="callout mt-6">
  <div class="font-800">Rule</div>
  <div class="op80 mt-1">Interactivity should reveal detail, not hide structure.</div>
</div>

---

## Pitfalls (Interactive Charts)

<div class="grid grid-cols-2 gap-4 mt-8">
  <div class="card">
    <div class="kicker">Noise</div>
    <div class="text-xl font-800 mt-1">Too many tools</div>
    <div class="op70 mt-2">Mode bars, buttons, and sliders everywhere.</div>
  </div>
  <div class="card">
    <div class="kicker">Comparability</div>
    <div class="text-xl font-800 mt-1">Changing scales</div>
    <div class="op70 mt-2">Every frame looks “dramatic” but is misleading.</div>
  </div>
  <div class="card">
    <div class="kicker">State</div>
    <div class="text-xl font-800 mt-1">No reset</div>
    <div class="op70 mt-2">The viewer cannot recover from a weird interaction.</div>
  </div>
  <div class="card">
    <div class="kicker">Data</div>
    <div class="text-xl font-800 mt-1">Wrong grain</div>
    <div class="op70 mt-2">Most chart bugs are still data bugs.</div>
  </div>
</div>

---
layout: section
---

<div class="kicker">Part 2 · Plotly in Python</div>

# <span class="icon-inline i-carbon:chart-line-data mr-3"></span>Build figures you can ship

A figure is a spec. A deliverable is an artifact.

---

## Plotly’s Mental Model

<div class="grid grid-cols-2 gap-4 mt-6 items-start">
  <div class="card">
    <div class="kicker">Key idea</div>
    <div class="text-xl font-800 mt-1">A figure is a spec</div>
    <div class="op70 mt-2">In Python you build a figure object. In the browser, Plotly renders it as HTML + JavaScript.</div>
  </div>
  <D3ConceptDiagram diagram="plotly-mental-model" class="viz-compact" />
</div>

---

## Plotly Express vs Graph Objects

<div class="grid grid-cols-2 gap-4 mt-8">
  <div class="card">
    <div class="kicker">Plotly Express</div>
    <div class="text-xl font-800 mt-1">Fast, opinionated</div>
    <div class="op70 mt-2">Great for tidy data: `px.line`, `px.scatter`, `px.histogram`.</div>
  </div>
  <div class="card">
    <div class="kicker">graph_objects</div>
    <div class="text-xl font-800 mt-1">Explicit control</div>
    <div class="op70 mt-2">When you need subplots, custom traces, or non-standard layouts.</div>
  </div>
</div>

<div class="callout mt-6">
  <div class="font-800">Rule</div>
  <div class="op80 mt-1">Start with Express. Switch to graph_objects only when you can name the missing control.</div>
</div>

---

## Your Data Shape Controls Your Workload

<div class="grid grid-cols-2 gap-4 mt-8">
  <div class="card">
    <div class="kicker">Best default</div>
    <div class="text-xl font-800 mt-1">Tidy / long tables</div>
    <div class="op70 mt-2">One row = one observation. Columns = fields.</div>
  </div>
  <div class="card">
    <div class="kicker">Common fix</div>
    <div class="text-xl font-800 mt-1">Reshape before plotting</div>
    <div class="op70 mt-2">`melt`, `groupby`, and explicit sorting solve most problems.</div>
  </div>
</div>

---
layout: two-cols
---

## Plotly in Python (Minimal Recipe)

<div class="card !p-3">

```python
import plotly.express as px

fig = px.line(
    df,
    x="week",
    y="pass_rate",
    color="program",
    markers=True,
    title="Pass rate by week",
)

fig.update_layout(
    template="plotly_dark",
    legend_title_text="Program",
    hovermode="x unified",
)

fig.write_html("pass_rate_by_week.html", include_plotlyjs="cdn")
```

</div>

::right::

<div class="card">
  <div class="kicker">What to check</div>
  <ul class="mt-3">
    <li><span class="font-900">Labels</span> are complete (units when needed).</li>
    <li><span class="font-900">Legend</span> supports comparison (click behavior).</li>
    <li><span class="font-900">Default view</span> reads without interaction.</li>
  </ul>
</div>

---

## Styling That Signals Professional Work

<div class="grid grid-cols-3 gap-4 mt-8">
  <div class="card">
    <div class="kicker">Margins</div>
    <div class="text-lg font-900 mt-1">Breathing room</div>
    <div class="op70 mt-2">Titles and axes should not collide.</div>
  </div>
  <div class="card">
    <div class="kicker">Typography</div>
    <div class="text-lg font-900 mt-1">Intentional sizes</div>
    <div class="op70 mt-2">Large enough at 100% zoom.</div>
  </div>
  <div class="card">
    <div class="kicker">Grids</div>
    <div class="text-lg font-900 mt-1">Subtle</div>
    <div class="op70 mt-2">Data is loud. Scaffolding is quiet.</div>
  </div>
</div>

---
layout: two-cols
---

## Hovertemplate (Precision Without Clutter)

<div class="card !p-3">

```python
fig.update_traces(
    hovertemplate=
        "<b>%{legendgroup}</b>" +
        "<br>week=%{x}" +
        "<br>pass_rate=%{y:.3f}" +
        "<extra></extra>"
)
```

</div>

::right::

<div class="card">
  <div class="kicker">Why this matters</div>
  <div class="op70 mt-2">Default tooltips are often noisy. A good tooltip reads like a label, not a log file.</div>
  <div class="callout mt-4 !p-3">
    <div class="font-800">Rule</div>
    <div class="op80 mt-1">Format numbers the way you would in a report.</div>
  </div>
</div>

---

## Facets (Small Multiples)

<div class="grid grid-cols-2 gap-4 mt-8">
  <div class="card">
    <div class="kicker">Use when</div>
    <div class="text-xl font-800 mt-1">Compare distributions</div>
    <div class="op70 mt-2">Same axes, same bins, easy comparison.</div>
  </div>
  <div class="card">
    <div class="kicker">Design rule</div>
    <div class="text-xl font-800 mt-1">Align scales</div>
    <div class="op70 mt-2">Small multiples are only useful when the scale is shared.</div>
  </div>
</div>

---

## Subplots and Shared Axes

<div class="grid grid-cols-2 gap-4 mt-8">
  <div class="card">
    <div class="kicker">Problem</div>
    <div class="text-xl font-800 mt-1">Too much in one panel</div>
    <div class="op70 mt-2">Multiple metrics, multiple views, or multiple tasks.</div>
  </div>
  <div class="card">
    <div class="kicker">Solution</div>
    <div class="text-xl font-800 mt-1">Split views, share scales</div>
    <div class="op70 mt-2">Keep comparisons valid and reduce clutter.</div>
  </div>
</div>

---

## Category Ordering Is Part of the Story

<div class="grid grid-cols-2 gap-4 mt-8">
  <div class="card">
    <div class="kicker">Default trap</div>
    <div class="text-xl font-800 mt-1">Alphabetical ordering</div>
    <div class="op70 mt-2">It rarely matches the question.</div>
  </div>
  <div class="card">
    <div class="kicker">Professional move</div>
    <div class="text-xl font-800 mt-1">Sort by meaning</div>
    <div class="op70 mt-2">Sort by value, change, or a domain order.</div>
  </div>
</div>

---

## Color: Encode Meaning, Not Preference

<div class="grid grid-cols-3 gap-4 mt-8">
  <div class="card">
    <div class="kicker">Categorical</div>
    <div class="text-lg font-900 mt-1">Different groups</div>
    <div class="op70 mt-2">Avoid rainbow. Keep contrast.</div>
  </div>
  <div class="card">
    <div class="kicker">Sequential</div>
    <div class="text-lg font-900 mt-1">Low → high</div>
    <div class="op70 mt-2">Lightness carries order.</div>
  </div>
  <div class="card">
    <div class="kicker">Diverging</div>
    <div class="text-lg font-900 mt-1">Below / above</div>
    <div class="op70 mt-2">A meaningful midpoint.</div>
  </div>
</div>

---

## Performance (When Data Gets Big)

<div class="grid grid-cols-2 gap-4 mt-8">
  <div class="card">
    <div class="kicker">Symptoms</div>
    <div class="text-xl font-800 mt-1">Lag, stutter, freezes</div>
    <div class="op70 mt-2">The browser is doing too much work per frame.</div>
  </div>
  <div class="card">
    <div class="kicker">Mitigations</div>
    <ul class="mt-3">
      <li>Aggregate or sample.</li>
      <li>Use WebGL traces (`scattergl`).</li>
      <li>Limit hover points.</li>
    </ul>
  </div>
</div>

---

## Exporting From Python

<div class="grid grid-cols-3 gap-4 mt-8">
  <div class="card">
    <div class="kicker">HTML</div>
    <div class="text-lg font-900 mt-1">`write_html`</div>
    <div class="op70 mt-2">Best for interactive delivery.</div>
  </div>
  <div class="card">
    <div class="kicker">PNG / SVG</div>
    <div class="text-lg font-900 mt-1">Kaleido</div>
    <div class="op70 mt-2">Static exports for reports.</div>
  </div>
  <div class="card">
    <div class="kicker">Spec</div>
    <div class="text-lg font-900 mt-1">JSON</div>
    <div class="op70 mt-2">Store the figure for reproducibility.</div>
  </div>
</div>

---

## Pitfalls and Debugging (Plotly)

<div class="grid grid-cols-2 gap-4 mt-8">
  <div class="card">
    <div class="kicker">Data bugs</div>
    <div class="text-xl font-800 mt-1">Wrong unit or grain</div>
    <div class="op70 mt-2">Wrong denominators cause wrong stories.</div>
  </div>
  <div class="card">
    <div class="kicker">Chart bugs</div>
    <div class="text-xl font-800 mt-1">Defaults not reviewed</div>
    <div class="op70 mt-2">Axis ranges, sorting, and hover formatting.</div>
  </div>
</div>

<div class="callout mt-6">
  <div class="font-800">Debugging trick</div>
  <div class="op80 mt-1">Print the filtered table shape first. If the data is wrong, the figure will be wrong.</div>
</div>

---

## When Not to Use Plotly

<div class="grid grid-cols-2 gap-4 mt-8">
  <div class="card">
    <div class="kicker">Static deliverables</div>
    <div class="text-xl font-800 mt-1">You only need a PDF</div>
    <div class="op70 mt-2">Matplotlib can be simpler and lighter.</div>
  </div>
  <div class="card">
    <div class="kicker">Complex custom visuals</div>
    <div class="text-xl font-800 mt-1">Highly bespoke interactions</div>
    <div class="op70 mt-2">Consider D3 or a custom front end.</div>
  </div>
</div>

<div class="mt-6 text-sm">
  <a href="https://plotly.com/python/" target="_blank" rel="noopener noreferrer">plotly.com/python</a>
</div>

---
layout: section
---

<div class="kicker">Part 3 · Choosing Tools</div>

# <span class="icon-inline i-carbon:decision-tree mr-3"></span>Pick by delivery

HTML artifact vs deployed app.

---

## Quick Heuristic

<div class="grid grid-cols-2 gap-4 mt-8">
  <div class="card">
    <div class="kicker">Altair</div>
    <div class="text-xl font-800 mt-1">Declarative exploration</div>
    <div class="op70 mt-2">Tidy data + compact specs + selections.</div>
  </div>
  <div class="card">
    <div class="kicker">Bokeh</div>
    <div class="text-xl font-800 mt-1">Custom tools</div>
    <div class="op70 mt-2">When interactions are the product.</div>
  </div>
  <div class="card">
    <div class="kicker">Panel</div>
    <div class="text-xl font-800 mt-1">Widget composition</div>
    <div class="op70 mt-2">Quick dashboards for exploration.</div>
  </div>
  <div class="card">
    <div class="kicker">Streamlit</div>
    <div class="text-xl font-800 mt-1">Fast apps</div>
    <div class="op70 mt-2">Great defaults, less callback control.</div>
  </div>
</div>

---
class: tight-layout
---

## Other Python Libraries (Quick Links)

<div class="grid grid-cols-2 gap-3 mt-5 items-start">
  <div class="card !p-3">
    <div class="kicker">Altair</div>
    <div class="text-lg font-900 mt-1">Vega-Lite grammar</div>
    <div class="mt-2 text-sm"><a href="https://altair-viz.github.io/" target="_blank" rel="noopener noreferrer">altair-viz.github.io</a></div>
  </div>
  <div class="card !p-3">
    <div class="kicker">Bokeh</div>
    <div class="text-lg font-900 mt-1">Interactive plotting</div>
    <div class="mt-2 text-sm"><a href="https://docs.bokeh.org/en/latest/" target="_blank" rel="noopener noreferrer">docs.bokeh.org</a></div>
  </div>
  <div class="card !p-3">
    <div class="kicker">Panel</div>
    <div class="text-lg font-900 mt-1">HoloViz ecosystem</div>
    <div class="mt-2 text-sm"><a href="https://panel.holoviz.org/" target="_blank" rel="noopener noreferrer">panel.holoviz.org</a></div>
  </div>
  <div class="card !p-3">
    <div class="kicker">Streamlit</div>
    <div class="text-lg font-900 mt-1">Data apps fast</div>
    <div class="mt-2 text-sm"><a href="https://streamlit.io/" target="_blank" rel="noopener noreferrer">streamlit.io</a></div>
  </div>
</div>

<div class="callout mt-4 !p-3">
  <div class="font-800">Decision rule</div>
  <div class="op80 mt-1">Pick the tool that matches your delivery: a single HTML file, or a real app with server-side callbacks.</div>
</div>

---

## The Practical Split

<div class="grid grid-cols-2 gap-4 mt-8">
  <div class="card">
    <div class="kicker">If you need</div>
    <div class="text-xl font-900 mt-1">A single file to share</div>
    <div class="op70 mt-2">Plotly HTML, Altair HTML, Bokeh HTML.</div>
  </div>
  <div class="card">
    <div class="kicker">If you need</div>
    <div class="text-xl font-900 mt-1">A real app</div>
    <div class="op70 mt-2">Dash, Panel, Streamlit (server-side state).</div>
  </div>
</div>

---
layout: section
---

<div class="kicker">Part 4 · Data Apps</div>

# <span class="icon-inline i-carbon:application-web mr-3"></span>Dash fundamentals

Layout describes structure. Callbacks define behavior.

---

## From Chart to App

<D3ConceptDiagram diagram="chart-to-app-loop" class="mt-8" />

---

## Dash Layout Is a Tree

<D3ConceptDiagram diagram="dash-layout-tree" class="mt-6" />

---
layout: two-cols
---

## Dash Layout (Structure)

<div class="card !p-3">

```python
from dash import Dash, html, dcc

app = Dash(__name__)

app.layout = html.Div(
    [
        html.H1("Pass rate dashboard"),
        dcc.Dropdown(["CS", "DS", "IS", "IT"], "CS", id="program"),
        dcc.RangeSlider(1, 20, value=[5, 13], id="week_range"),
        dcc.Graph(id="trend"),
    ],
    className="page",
)
```

</div>

::right::

<div class="card">
  <div class="kicker">Mental model</div>
  <div class="text-xl font-800 mt-1">Layout is declarative</div>
  <div class="op70 mt-2">You describe the UI once. Callbacks provide the behavior.</div>
</div>

<div class="callout mt-4 !p-3">
  <div class="font-800">Pro habit</div>
  <div class="op80 mt-1">Add components one at a time. Test IDs and wiring early.</div>
</div>

---

## Callback Mental Model

<div class="grid grid-cols-3 gap-4 mt-8">
  <div class="card">
    <div class="kicker">Inputs</div>
    <div class="text-lg font-900 mt-1">Controls</div>
    <div class="op70 mt-2">Dropdowns, sliders, buttons.</div>
  </div>
  <div class="card">
    <div class="kicker">Callback</div>
    <div class="text-lg font-900 mt-1">Compute</div>
    <div class="op70 mt-2">Filter, aggregate, reshape.</div>
  </div>
  <div class="card">
    <div class="kicker">Outputs</div>
    <div class="text-lg font-900 mt-1">Views</div>
    <div class="op70 mt-2">Charts, tables, KPI cards.</div>
  </div>
</div>

<div class="callout mt-6">
  <div class="font-800">Rule</div>
  <div class="op80 mt-1">Treat callbacks like pure functions of state. That is how you debug them.</div>
</div>

---
layout: two-cols
---

## Dash Callbacks (Behavior)

<div class="card !p-3">

```python
from dash import Input, Output, callback
import plotly.express as px

@callback(
    Output("trend", "figure"),
    Input("program", "value"),
    Input("week_range", "value"),
)
def update_trend(program, week_range):
    lo, hi = week_range
    view = df.query("program == @program and @lo <= week <= @hi")
    fig = px.line(view, x="week", y="pass_rate", markers=True)
    fig.update_layout(template="plotly_dark", hovermode="x unified")
    return fig
```

</div>

::right::

<div class="card">
  <div class="kicker">Debugging order</div>
  <ul class="mt-3">
    <li>Confirm input values.</li>
    <li>Print the filtered row count.</li>
    <li>Validate units and grain.</li>
    <li>Then style the figure.</li>
  </ul>
</div>

---

## Debugging Checklist (Dash)

<div class="grid grid-cols-2 gap-4 mt-8">
  <div class="card">
    <div class="kicker">Data</div>
    <ul class="mt-3">
      <li>Do you aggregate to the correct grain?</li>
      <li>Are types and units correct?</li>
      <li>Are missing values handled explicitly?</li>
    </ul>
  </div>
  <div class="card">
    <div class="kicker">App</div>
    <ul class="mt-3">
      <li>Are component IDs unique?</li>
      <li>Do callbacks guard empty filters?</li>
      <li>Is there a clear reset state?</li>
    </ul>
  </div>
</div>

---
class: viz-slide
---

## Demo: Live Mini Dashboard (Callback Behavior)

<div class="flex items-center justify-between gap-4">
  <div class="op70">This slide is a simulated mini app. In Dash, callbacks do the same state updates.</div>
  <a class="launch-btn shrink-0" href="./lab/index.html#callbacks" target="_blank" rel="noopener noreferrer">
    <span class="icon-inline i-carbon:launch"></span>
    Open interactive lab
  </a>
</div>

<div class="viz-grow mt-1">
  <DashMiniApp />
</div>

---

## Multi-Output Pattern (Common in Dash)

<div class="grid grid-cols-2 gap-4 mt-8">
  <div class="card">
    <div class="kicker">One filter</div>
    <div class="text-xl font-900 mt-1">Many outputs</div>
    <div class="op70 mt-2">Graph updates, KPI cards update, table updates.</div>
  </div>
  <div class="card">
    <div class="kicker">Rule</div>
    <div class="text-xl font-900 mt-1">Compute once</div>
    <div class="op70 mt-2">Derive a filtered table once, then reuse it for all views.</div>
  </div>
</div>

---

## Input vs State vs Store

<div class="grid grid-cols-3 gap-4 mt-8">
  <div class="card">
    <div class="kicker">Input</div>
    <div class="text-lg font-900 mt-1">Triggers callback</div>
    <div class="op70 mt-2">User changes it.</div>
  </div>
  <div class="card">
    <div class="kicker">State</div>
    <div class="text-lg font-900 mt-1">Read-only context</div>
    <div class="op70 mt-2">Used inside callback, does not trigger.</div>
  </div>
  <div class="card">
    <div class="kicker">Store</div>
    <div class="text-lg font-900 mt-1">Cached data</div>
    <div class="op70 mt-2">Avoid recomputing on every interaction.</div>
  </div>
</div>

---

## Scaling Beyond One Callback

<div class="grid grid-cols-2 gap-4 mt-8">
  <div class="card">
    <div class="kicker">Pattern matching</div>
    <div class="text-xl font-900 mt-1">Dynamic components</div>
    <div class="op70 mt-2">Generate many similar charts and wire callbacks cleanly.</div>
  </div>
  <div class="card">
    <div class="kicker">Clientside callbacks</div>
    <div class="text-xl font-900 mt-1">Fast UI updates</div>
    <div class="op70 mt-2">Move lightweight logic to the browser when needed.</div>
  </div>
</div>

---

## Performance and Reliability

<div class="grid grid-cols-2 gap-4 mt-8">
  <div class="card">
    <div class="kicker">Performance</div>
    <ul class="mt-3">
      <li>Cache expensive transforms.</li>
      <li>Keep callbacks small and predictable.</li>
      <li>Do not re-render huge figures unnecessarily.</li>
    </ul>
  </div>
  <div class="card">
    <div class="kicker">Reliability</div>
    <ul class="mt-3">
      <li>Guard empty selections.</li>
      <li>Use sensible defaults.</li>
      <li>Log inputs when debugging.</li>
    </ul>
  </div>
</div>

---

## What I’d Ship (Professional Checklist)

<div class="grid grid-cols-2 gap-4 mt-6">
  <div class="card">
    <div class="kicker">Task</div>
    <div class="text-xl font-800 mt-1">What question is this answering?</div>
    <div class="op70 mt-2">Interactivity must reduce viewer work.</div>
  </div>
  <div class="card">
    <div class="kicker">Interaction</div>
    <div class="text-xl font-800 mt-1">Reset, defaults, fixed scales</div>
    <div class="op70 mt-2">No mystery states.</div>
  </div>
  <div class="card">
    <div class="kicker">Data</div>
    <div class="text-xl font-800 mt-1">Units, grain, validation</div>
    <div class="op70 mt-2">Most bugs are data bugs.</div>
  </div>
  <div class="card">
    <div class="kicker">Ship</div>
    <div class="text-xl font-800 mt-1">HTML artifact or deployed app</div>
    <div class="op70 mt-2">Pick the delivery format early.</div>
  </div>
</div>

---

## References (Recommended)

<div class="grid grid-cols-2 gap-4 mt-6">
  <div class="card">
    <div class="text-lg font-700">Plotly Python docs</div>
    <div class="op70 mt-1">Interactive charts + HTML export + animations</div>
    <div class="mt-2 text-sm">
      <a href="https://plotly.com/python/" target="_blank" rel="noopener noreferrer">plotly.com/python</a>
    </div>
  </div>
  <div class="card">
    <div class="text-lg font-700">Dash docs</div>
    <div class="op70 mt-1">Layout, callbacks, deployment patterns</div>
    <div class="mt-2 text-sm">
      <a href="https://dash.plotly.com/" target="_blank" rel="noopener noreferrer">dash.plotly.com</a>
    </div>
  </div>
  <div class="card">
    <div class="text-lg font-700">Altair docs</div>
    <div class="op70 mt-1">Declarative grammar + interactive selections</div>
    <div class="mt-2 text-sm">
      <a href="https://altair-viz.github.io/" target="_blank" rel="noopener noreferrer">altair-viz.github.io</a>
    </div>
  </div>
  <div class="card">
    <div class="text-lg font-700">Bokeh docs</div>
    <div class="op70 mt-1">Custom tools + interactive plotting</div>
    <div class="mt-2 text-sm">
      <a href="https://docs.bokeh.org/en/latest/" target="_blank" rel="noopener noreferrer">docs.bokeh.org</a>
    </div>
  </div>
</div>
