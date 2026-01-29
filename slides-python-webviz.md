---
title: Python Visualization Basics
subtitle: "DATA101 — Web Outputs, Modern Chart Components, and Interactive Graphics"
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

# Python Visualization Basics

From notebooks → web-ready charts: SVG/HTML outputs, interactive graphics, and modern chart components.

<div class="absolute bottom-10 left-14 leading-tight">
  <div class="text-xl font-700">Marc Reyes</div>
  <div class="op70">Professional Lecturer · marc.reyes@dlsu.edu.ph</div>
  <div class="op70">DATA101 — De La Salle University</div>
</div>

<!--
TALK TRACK (≈3–4 min)

Good day everyone—I'm Marc Reyes. Today we’ll focus on Python visualization, but with a very specific goal: producing charts that are not just “correct,” but *publishable*—the kind you can embed in a report, a website, or a dashboard.

In practice, visualization work doesn’t end when your chart appears in a notebook. You usually need to export it, reuse it, style it consistently, and ship it somewhere: a PDF, an HTML page, a learning platform, or a portfolio.

So we’ll connect three layers:
first, the web outputs that browsers understand—HTML, CSS, and SVG;
second, the Python tools that generate those outputs—pandas, Matplotlib/Seaborn, and grammar-based tools like Altair or interactive tools like Plotly;
third, the “modern chart components” mindset—thinking in reusable parts: data transforms, scales, marks, axes, guides, annotations, and interactions.

You’ll also see runnable code snippets. The point is not memorizing APIs—it’s learning the mental model so you can build charts intentionally and debug them quickly.
-->

---

## Today’s Plan

<div class="grid grid-cols-2 gap-4 mt-6">
  <div class="card">
    <div class="kicker">01 · Web outputs</div>
    <div class="text-2xl font-700 mt-1"><carbon:application-web class="inline-block mr-2 text-[1.05em] align-[-0.14em]" />HTML, CSS, SVG</div>
    <div class="op70 mt-2">What the browser actually renders.</div>
  </div>
  <div class="card">
    <div class="kicker">02 · Python workflow</div>
    <div class="text-2xl font-700 mt-1"><carbon:logo-python class="inline-block mr-2 text-[1.05em] align-[-0.14em]" />Notebook → chart → export</div>
    <div class="op70 mt-2">Reproducible visuals you can ship.</div>
  </div>
  <div class="card">
    <div class="kicker">03 · Modern components</div>
    <div class="text-2xl font-700 mt-1"><carbon:assembly-cluster class="inline-block mr-2 text-[1.05em] align-[-0.14em]" />Scales, marks, guides</div>
    <div class="op70 mt-2">A reusable mental model.</div>
  </div>
  <div class="card">
    <div class="kicker">04 · Interactivity</div>
    <div class="text-2xl font-700 mt-1"><carbon:cursor-1 class="inline-block mr-2 text-[1.05em] align-[-0.14em]" />Selections + tooltips</div>
    <div class="op70 mt-2">When interactivity is worth it.</div>
  </div>
</div>

<!--
TALK TRACK (≈3 min)

This is the flow.

We start with the web basics—not because you’re becoming a front-end developer, but because the “final product” of many Python charts is an HTML or SVG artifact.

Then we turn that into a Python workflow you can repeat: load data, transform in pandas, plot with a library, and export in the format you need.

Next, we formalize “modern chart components,” which is how professional teams design chart systems: the same parts appear in Matplotlib, Altair, Plotly, and even D3—just with different APIs.

Finally, we cover interactivity from a practical angle: what interactions add clarity, and what interactions add confusion.
-->

---

## Learning Outcomes

<div class="grid grid-cols-2 gap-4 mt-8">
  <div class="card">
    <div class="kicker">Web</div>
    <div class="text-xl font-700 mt-1">Explain SVG vs PNG vs HTML</div>
    <div class="op70 mt-2">And choose the right export format.</div>
  </div>
  <div class="card">
    <div class="kicker">Python</div>
    <div class="text-xl font-700 mt-1">Build a reproducible chart workflow</div>
    <div class="op70 mt-2">Data → transforms → plot → export.</div>
  </div>
  <div class="card">
    <div class="kicker">Design</div>
    <div class="text-xl font-700 mt-1">Name modern chart components</div>
    <div class="op70 mt-2">Scales, axes, marks, guides, interactions.</div>
  </div>
  <div class="card">
    <div class="kicker">Practice</div>
    <div class="text-xl font-700 mt-1">Write code that produces legible outputs</div>
    <div class="op70 mt-2">Readable on slides, PDFs, and web pages.</div>
  </div>
</div>

<!--
TALK TRACK (≈3–4 min)

This lecture is practical: you should leave with a workflow, not just vocabulary.

You should be able to explain export formats and choose them intentionally—SVG when you need crisp scaling, PNG when you need a fixed raster, and HTML when you need interactive rendering.

You should be able to produce the same chart tomorrow and get the same answer—which means you control transformations, labels, and units in code, not in manual tweaking.

And you should be able to describe charts as components. When you can name the components, you can debug: “my scale is wrong,” “my axis is misleading,” “my marks are too dense,” “my legend is doing work the chart should do.”
-->

---
layout: section
---

<div class="kicker">Part 1 · Web Outputs</div>

# <carbon:application-web class="inline-block mr-3 text-[1.08em] align-[-0.14em]" />What the browser understands

HTML + CSS + SVG as the delivery layer for charts

<!--
TALK TRACK (≈3–4 min)

We start with the web because even “Python charts” often end up being web artifacts:
embedded in learning pages, dashboards, notebooks rendered to HTML, or exported to SVG for slides.

If you know what the browser understands, you can export correctly and fix layout problems quickly.
-->

---
class: viz-slide
---

## The Web Output Stack (for Charts)

<div class="viz-grow mt-6">
  <D3ConceptDiagram diagram="web-viz-stack" class="viz-fill" />
</div>

<!--
TALK TRACK (≈4–5 min)

Think of this as the minimal stack for web visualization.

HTML is the structure—containers, headings, and the place your chart lives.
CSS is the styling—fonts, spacing, colors, and layout rules.
SVG is the drawing surface—shapes, lines, text, and coordinates.

This matters because Python tools export to these forms:
Matplotlib can export to PNG or SVG.
Altair can export an HTML page driven by a Vega-Lite specification.
Plotly can export to HTML with interactive JavaScript inside.

If you can point to which layer is responsible for which part, you can fix issues without guessing.
-->

---
class: viz-slide
---

## SVG: The “Native” Format of Many Charts

<div class="grid grid-cols-2 gap-4 mt-4">
  <div class="card !p-3">
    <div class="kicker">Why SVG</div>
    <ul class="mt-2 space-y-0.5 op80 text-sm">
      <li>Scales crisply (great for slides and PDFs)</li>
      <li>Text remains selectable and searchable</li>
      <li>Shapes are editable (Illustrator/Figma)</li>
    </ul>
  </div>
  <div class="card !p-3">
    <div class="kicker">When not SVG</div>
    <ul class="mt-2 space-y-0.5 op80 text-sm">
      <li>Huge point clouds (file size)</li>
      <li>Complex maps with many paths</li>
      <li>Photographic backgrounds</li>
    </ul>
  </div>
</div>

<div class="viz-grow mt-3">
  <D3ConceptDiagram diagram="svg-coordinates" class="viz-fill" />
</div>

<!--
TALK TRACK (≈4–5 min)

SVG is a coordinate-based drawing format, which makes it perfect for charts.
Bars are rectangles. Lines are paths. Points are circles. Labels are text elements.

For slides and PDFs, SVG is often the best export because it stays crisp at any zoom.

But SVG is not always the right tool: if you have 200,000 points, SVG becomes heavy and slow because each point is a DOM element. That’s when you switch to raster outputs or to WebGL-based renderers.

For this course, SVG is a strong default for publication-quality static visuals.
-->

---

## CSS: The Hidden Part of “Professional”

<div class="grid grid-cols-2 gap-4 mt-4">
  <div class="card !p-3">
    <div class="kicker">CSS controls</div>
    <div class="text-lg font-700 mt-1">Hierarchy + spacing + readability</div>
    <div class="op70 mt-2 text-sm">Font sizes, line heights, margins, contrast.</div>
  </div>
  <div class="card !p-3">
    <div class="kicker">Chart implication</div>
    <div class="text-lg font-700 mt-1">Your chart lives inside a layout</div>
    <div class="op70 mt-2 text-sm">So it must be responsive and legible.</div>
  </div>
</div>

<D3ConceptDiagram diagram="css-for-charts" class="mt-3 viz-compact" />

<!--
TALK TRACK (≈3–4 min)

Many “student charts” look amateur not because the data is wrong, but because typography and spacing are inconsistent.

In web contexts, CSS controls the reading experience around the chart: titles, captions, and how the chart fits into a grid.

Even if you generate the SVG in Python, you’ll often place it in an HTML layout later. So you need to think about: does it fit? are labels readable? does it respect a consistent type scale?
-->

---
layout: section
---

<div class="kicker">Part 2 · Python Workflow</div>

# <carbon:logo-python class="inline-block mr-3 text-[1.08em] align-[-0.14em]" />Notebook → chart → export

Reproducible visuals you can ship

<!--
TALK TRACK (≈3–4 min)

Now we connect the web output idea to Python practice.
Professional visualization is repeatable: you can rerun it next week, change a dataset, and the chart updates without manual edits.
-->

---
class: viz-slide
---

## A Repeatable Python Visualization Pipeline

<div class="viz-grow mt-6">
  <D3ConceptDiagram diagram="python-viz-pipeline" class="viz-fill" />
</div>

<!--
TALK TRACK (≈4–5 min)

This is the pipeline you should aim for in projects.

Start with data: load, validate types, and fix obvious issues.
Then transform: group, aggregate, derive measures, reshape.
Then visualize: choose a chart that matches the task and the data type.
Then export: SVG/PNG for static deliverables, HTML for interactive deliverables.

The key professional shift is that export is not an afterthought—it’s part of the design constraints.
-->

---

## Pandas as the “Chart Data Engine”

<div class="grid grid-cols-2 gap-4 mt-4">
  <div class="card !p-3">
    <div class="kicker">Common transforms</div>
    <ul class="mt-2 space-y-0.5 op80 text-sm">
      <li><code>groupby</code> + aggregate</li>
      <li>derive rates and deltas</li>
      <li><code>melt</code> / tidy reshape</li>
      <li>sort for ranking</li>
    </ul>
  </div>
  <div class="card !p-3">
    <div class="kicker">Why it matters</div>
    <div class="text-lg font-700 mt-1">Most chart bugs are data bugs</div>
    <div class="op70 mt-2 text-sm">Wrong denominator, wrong unit, wrong grain.</div>
  </div>
</div>

<D3ConceptDiagram diagram="tidy-to-chart" class="mt-3 viz-compact" />

<!--
TALK TRACK (≈4 min)

Pandas is where you make the chart possible.

If your chart is “wrong,” it’s often because the data is wrong:
you used counts instead of rates,
you aggregated at the wrong level,
or you didn’t reshape for the chart you intend to make.

So treat pandas as the engine that produces chart-ready data, and treat the charting library as the renderer.
-->

---
layout: two-cols
---

# Demo A: Chart-ready tables (rates + deltas)

::left::
<div class="card !p-3">
  <div class="kicker">Goal</div>
  <div class="text-lg font-700 mt-1">Turn counts into comparable measures</div>
  <ul class="mt-2 space-y-0.5 op80 text-sm">
    <li>Counts → rate (pass_rate)</li>
    <li>Rate over time → delta (change)</li>
    <li>One row = one observation (tidy)</li>
  </ul>
</div>

<div class="card !p-3 mt-4">
  <div class="kicker">Professional habit</div>
  <div class="text-lg font-700 mt-1">Write the table before the chart</div>
  <div class="op70 mt-2 text-sm">If the table is wrong, the chart will be wrong—no matter how polished it looks.</div>
</div>

::right::
<div class="mt-2">
  <D3MiniTableDemo />
</div>

<!--
TALK TRACK (≈4–5 min, deep dive)

This example is small on purpose. The goal is to make the “chart-ready table” idea concrete.

We start with counts: passes and students. Then we derive the measure we actually care about for comparison: pass_rate.

Then we compute a delta over time per program. That delta becomes a powerful visual variable: it tells you direction and change.

Notice what we did not do: we did not pick a chart first. We prepared the data so multiple charts become possible: a time trend, a ranked delta view, or a small-multiples comparison.
-->

---
layout: default
class: code-only
---

# Code Demo A — Run

```py {monaco-run height=320px outputHeight=220px}
import pandas as pd

df = pd.DataFrame(
    {
        "program": ["A", "A", "B", "B", "C", "C"],
        "week": [1, 2, 1, 2, 1, 2],
        "n_pass": [70, 62, 90, 88, 40, 44],
        "n_students": [100, 100, 120, 120, 50, 50],
    }
)

df["pass_rate"] = df["n_pass"] / df["n_students"]

weekly = df.sort_values(["program", "week"]).assign(
    delta=lambda d: d.groupby("program")["pass_rate"].diff()
)

print(weekly.to_string(index=False))
```

<!--
TALK TRACK (≈3–4 min)

I’ll run this once so you see what “chart-ready” looks like as a table.

The output is the deliverable before any chart:
one row per program-week, a comparable measure (pass_rate), and a change metric (delta).
-->

---
class: viz-slide
---

## Matplotlib: The “Artist” Model (Mental Map)

<div class="viz-grow mt-6">
  <D3ConceptDiagram diagram="matplotlib-anatomy" class="viz-fill" />
</div>

<!--
TALK TRACK (≈4–5 min)

Matplotlib is everywhere, and it’s worth learning the mental model.

The figure is the whole canvas. An axes is the plotting region with x/y scales.
Marks like lines, points, and bars are artists that live on an axes.

If you understand figure vs axes vs artists, you can control layout and export reliably—especially when you move beyond one simple plot.
-->

---
layout: two-cols
---

# Demo B: Matplotlib → SVG export (web-ready)

::left::
<div class="card !p-3">
  <div class="kicker">Why SVG</div>
  <div class="text-lg font-700 mt-1">Crisp + editable + searchable</div>
  <ul class="mt-2 space-y-0.5 op80 text-sm">
    <li>Perfect for slides + PDF export</li>
    <li>Shapes editable in Figma/Illustrator</li>
    <li>Text stays selectable (accessibility + search)</li>
  </ul>
</div>

<div class="callout mt-4">
  <div class="kicker">Habit</div>
  <div class="text-lg font-700 mt-1">Export intentionally (don’t screenshot)</div>
</div>

::right::
<div class="card !p-3">
  <div class="kicker">Rendered result (illustration)</div>
  <div class="op70 mt-1 text-sm">Your SVG will scale crisply in slides.</div>
</div>

<D3MiniLineDemo class="mt-0.5 viz-compact" />

<!--
TALK TRACK (≈5 min, deep dive)

This slide is about “shipping,” not just plotting.

We choose a figure size intentionally and label everything. That’s already a professional step: the chart should be legible without a paragraph of explanation.

Then we export to SVG. SVG is ideal for slides and PDFs because it stays sharp at any zoom.

The practical habit: always set figure size, always set labels and limits intentionally, and always export explicitly—don’t rely on screenshots.
-->

---
layout: default
class: code-only
---

# Code Demo B — Run

```py {monaco-run height=300px outputHeight=180px}
import io

import matplotlib.pyplot as plt
import numpy as np

x = np.arange(1, 7)
y = np.array([0.70, 0.62, 0.75, 0.73, 0.80, 0.78])

fig, ax = plt.subplots(figsize=(7.2, 3.2))
ax.plot(x, y, marker="o", linewidth=2)
ax.set_title("Pass rate over weeks")
ax.set_xlabel("Week")
ax.set_ylabel("Pass rate")
ax.set_ylim(0.5, 0.9)
ax.grid(True, alpha=0.25)
fig.tight_layout()

buf = io.StringIO()
fig.savefig(buf, format="svg")
svg = buf.getvalue()

print("SVG chars:", len(svg))
print("Starts with:", svg.splitlines()[0][:72] + "…")
```

<!--
TALK TRACK (≈3–4 min)

When this runs, the key point is that the SVG is text.
That’s why it scales without getting blurry.

In practice: decide your export format early, then design labels and spacing for that format.
-->

---

## Seaborn: Statistics Defaults + Cleaner Styles

<div class="grid grid-cols-2 gap-4 mt-6">
  <div class="card !p-3">
    <div class="kicker">What it adds</div>
    <ul class="mt-2 space-y-0.5 op80 text-sm">
      <li>Statistical plots (distributions, categories)</li>
      <li>Reasonable default aesthetics</li>
      <li>Easy small multiples (<code>FacetGrid</code>)</li>
    </ul>
  </div>
  <div class="card !p-3">
    <div class="kicker">Common trap</div>
    <div class="text-lg font-700 mt-1">Pretty defaults ≠ correct story</div>
    <div class="op70 mt-2 text-sm">Always check units, bins, and baselines.</div>
  </div>
</div>

<D3ConceptDiagram diagram="seaborn-when" class="mt-3 viz-compact" />

<!--
TALK TRACK (≈3–4 min)

Seaborn is great when you want statistical summaries quickly—especially distributions and comparisons across categories.

But be careful: nice defaults can hide important choices. Bin width, smoothing, and aggregation can change conclusions. Treat those as design decisions, not cosmetics.
-->

---
layout: two-cols
---

# Code Demo C: Faceted Histograms

::left::
<div class="card !p-3">
  <div class="kicker">Runnable next slide</div>
  <div class="text-lg font-700 mt-1">Generate data + summarize spread</div>
  <div class="op70 mt-2 text-sm">
    We’ll compute stats and histogram bin counts (what a faceted histogram is actually drawing).
  </div>
</div>

::right::
<div class="card !p-3">
  <div class="kicker">What to look for</div>
  <ul class="mt-2 space-y-0.5 op80 text-sm">
    <li>Panels share axes (fair comparison)</li>
    <li>Shape shows variance (not just the mean)</li>
    <li>Bins + scale are design decisions</li>
  </ul>
</div>

<!--
TALK TRACK (≈4–5 min, deep dive)

This is a key visualization lesson packaged as code.

We create three programs where the “center” can look similar, but the spread differs. One program can be consistent, another can have high variance—meaning more struggling students even if the average looks fine.

Faceting makes this comparison easy because axes are aligned. The viewer can compare shapes without doing legend hunting.

So the design principle is: when the task involves fairness and decisions about people, distribution views are often necessary.
-->

---
layout: default
class: code-only
---

# Code Demo C — Run

```py {monaco-run height=320px outputHeight=220px}
import numpy as np
import pandas as pd

rng = np.random.default_rng(7)
program = np.repeat(list("ABC"), 250)
score = np.concatenate(
    [
        rng.normal(76, 6, 250),
        rng.normal(76, 14, 250),
        rng.normal(70, 8, 250),
    ]
)
df = pd.DataFrame({"program": program, "score": score})

summary = df.groupby("program")["score"].agg(["mean", "std", "min", "max"]).round(2)
print("Summary stats (mean can be similar while spread differs):")
print(summary.to_string())

bins = np.linspace(df["score"].min(), df["score"].max(), 19)
counts = (
    df.assign(bin=pd.cut(df["score"], bins=bins, include_lowest=True))
    .groupby(["program", "bin"])
    .size()
    .rename("count")
)
print("\nFirst 6 histogram bins for Program A:")
print(counts.loc["A"].head(6).to_string())
```

<!--
TALK TRACK (≈3–4 min)

This is runnable without plotting libraries.

I’m generating three groups with different spreads, then printing:
- summary stats (especially std),
- and the first few histogram bin counts (the “data” behind the chart).
-->

---
layout: two-cols
---

# Code Demo C (Output): Small Multiples Reveal Spread

::left::
<div class="card !p-3">
  <div class="kicker">Interpretation</div>
  <div class="text-lg font-700 mt-1">Same mean, different risk</div>
  <ul class="mt-2 space-y-0.5 op80 text-sm">
    <li>Wider distributions imply more extreme outcomes</li>
    <li>Aligned panels make differences obvious</li>
    <li>Label bins and units when you publish</li>
  </ul>
</div>

::right::
<div class="card !p-3">
  <div class="kicker">Rendered result (illustration)</div>
  <div class="op70 mt-2 text-sm">This is what your FacetGrid histogram should resemble.</div>
</div>

<div class="mt-3 h-[360px]">
  <D3MiniHistogramFacets class="viz-fill" />
</div>

<!--
TALK TRACK (≈4–5 min, deep dive)

Notice how small multiples let us compare three distributions without changing scales.

If one program is much wider, it can mean more students are at risk even if the average looks “fine.”
This is a common real-world mistake: summarizing by averages only.

So in practice: when your task is diagnosis or equity, include distribution views.
-->

---
layout: section
---

<div class="kicker">Part 3 · Modern Components</div>

# <carbon:assembly-cluster class="inline-block mr-3 text-[1.08em] align-[-0.14em]" />Think in chart parts

Build charts like reusable UI components

<!--
TALK TRACK (≈3–4 min)

Now we shift to the “components” mindset.
This is the bridge to professional work: you stop thinking “a chart,” and start thinking “a system of parts” you can reuse across many charts.
-->

---
class: viz-slide
---

## The Modern Chart Component Checklist

<div class="viz-grow mt-6">
  <D3ChartComponentsAnnotated class="viz-fill" />
</div>

<!--
TALK TRACK (≈4–5 min)

Every modern chart has the same parts, regardless of library.

Data and transforms: filtering, grouping, deriving measures.
Scales: how values map to position, color, size.
Axes: the readable interface to the scale.
Marks: bars, lines, points.
Guides: legends, labels, gridlines.
Annotations: reference lines, callouts, events.
Interaction: tooltips, brushing, highlighting, filtering.
Layout: margins, facets, responsive behavior.

When something looks wrong, debug by component: “my scale domain is wrong,” “my marks are too dense,” “my legend is doing too much work.”
-->

---
class: viz-slide
---

## “D3 Concepts” in a Python World

<div class="grid grid-cols-2 gap-4 mt-5">
  <div class="card">
    <div class="kicker">Core idea</div>
    <div class="text-xl font-700 mt-1">Data ↔ marks mapping</div>
    <div class="op70 mt-2">Bind rows to marks; encode columns to channels.</div>
  </div>
  <div class="card">
    <div class="kicker">Python analogy</div>
    <div class="text-xl font-700 mt-1">DataFrame → spec → renderer</div>
    <div class="op70 mt-2">Altair/Plotly generate web renderers.</div>
  </div>
</div>

<div class="viz-grow mt-4">
  <D3ConceptDiagram diagram="binding-to-spec" class="viz-fill" />
</div>

<!--
TALK TRACK (≈4 min)

Even though we’re focusing on Python, the fundamental concept behind modern visualization is similar to D3: data drives marks.

In “spec-based” Python tools, you typically write a mapping from fields to channels. The renderer then draws marks for each row and updates interactions.

So you don’t need to write JavaScript to understand the concept: you need to understand the relationship between your data table and the marks the user sees.
-->

---
layout: two-cols
---

# Code Demo D: Altair Encodings

::left::
<div class="card !p-3">
  <div class="kicker">Grammar-style visualization</div>
  <div class="text-lg font-700 mt-1">Field → channel mappings</div>
  <div class="op70 mt-2 text-sm">
    A spec is a contract between data and marks. You can critique it before any pixels are rendered.
  </div>
</div>

::right::
<div class="card !p-3">
  <div class="kicker">What to watch</div>
  <ul class="mt-2 space-y-0.5 op80 text-sm">
    <li>Domains are explicit (comparison-friendly)</li>
    <li>Color encodes category, not magnitude</li>
    <li>Tooltip adds detail without clutter</li>
  </ul>
</div>

<!--
TALK TRACK (≈4–5 min, deep dive)

This is the grammar-of-graphics idea in practice.

We define a mark type (circles), then encode fields to channels: x-position, y-position, and color. We also add tooltip, which is often the simplest “high value” interaction.

The professional habit here is: treat encoding as a contract. If a field is categorical, use categorical channels. If it’s quantitative, use a quantitative scale. And always control your y-domain when comparison matters—don’t let defaults hide the story.
-->

---
layout: default
class: code-only
---

# Code Demo D — Run

```py {monaco-run height=320px outputHeight=220px}
import json

import pandas as pd

df = pd.DataFrame(
    {
        "x": [1, 2, 3, 4, 5, 6],
        "y": [0.70, 0.62, 0.75, 0.73, 0.80, 0.78],
        "term": ["baseline"] * 3 + ["current"] * 3,
    }
)

spec = {
    "mark": {"type": "circle", "size": 110},
    "encoding": {
        "x": {"field": "x", "type": "quantitative"},
        "y": {"field": "y", "type": "quantitative", "scale": {"domain": [0.5, 0.9]}},
        "color": {"field": "term", "type": "nominal"},
        "tooltip": [{"field": "x"}, {"field": "y"}, {"field": "term"}],
    },
}

print("First 3 rows:")
print(df.head(3).to_string(index=False))
print("\nEncoding spec (Vega-Lite style, excerpt):")
spec_text = json.dumps(spec, indent=2).splitlines()
print("\n".join(spec_text[:26] + ["..."]))
```

<!--
TALK TRACK (≈3–4 min)

This is runnable without any special chart library.

I’m showing that “encoding” is information:
we can inspect it, critique it, and make domains explicit before we render anything.
-->

---
layout: two-cols
---

# Code Demo D (Output): Encoded Scatter + Tooltip

::left::
<div class="card !p-3">
  <div class="kicker">Design note</div>
  <div class="text-lg font-700 mt-1">Encoding is a contract</div>
  <ul class="mt-2 space-y-0.5 op80 text-sm">
    <li>Quantitative → position/scale</li>
    <li>Categorical → hue/grouping</li>
    <li>Set domains when comparisons matter</li>
  </ul>
</div>

::right::
<div class="card !p-3">
  <div class="kicker">Rendered result (illustration)</div>
  <div class="op70 mt-2 text-sm">Your Altair chart should match this structure.</div>
</div>

<div class="mt-3 h-[360px]">
  <D3MiniScatterDemo class="viz-fill" />
</div>

<!--
TALK TRACK (≈4–5 min, deep dive)

This is “grammar-style” visualization: you describe encodings and let the renderer draw marks.

The big professional move here is controlling scales:
if you let defaults pick domains, the story can change when the data changes.

Tooltips are high-value because they add exactness without adding ink.
-->

---
layout: section
---

<div class="kicker">Part 4 · Interactivity</div>

# <carbon:cursor-1 class="inline-block mr-3 text-[1.08em] align-[-0.14em]" />Interactivity with purpose

Tooltips, selection, filtering, and readable dashboards

<!--
TALK TRACK (≈3–4 min)

Interactivity is powerful—but it’s easy to add interactivity that makes charts harder to read.
So we focus on “purposeful” interactions: ones that directly support a task.
-->

---
class: viz-slide
---

## Tooltips Are “Details on Demand”

<div class="grid grid-cols-2 gap-4 mt-5">
  <div class="card">
    <div class="kicker">Good tooltip</div>
    <div class="text-lg font-700 mt-1">Confirms values</div>
    <div class="op70 mt-2">Units, exact numbers, IDs for traceability.</div>
  </div>
  <div class="card">
    <div class="kicker">Bad tooltip</div>
    <div class="text-lg font-700 mt-1">Replaces the chart</div>
    <div class="op70 mt-2">If you need to hover everything, redesign.</div>
  </div>
</div>

<div class="viz-grow mt-4">
  <D3ConceptDiagram diagram="tooltip-rule" class="viz-fill" />
</div>

<!--
TALK TRACK (≈3–4 min)

Tooltips are excellent for exact values and metadata, but they shouldn’t be a crutch.

If the chart is not readable without hovering every mark, the encoding or layout is doing too little work. Use tooltips to confirm, not to decode.
-->

---
class: viz-slide
---

## Selections, Brushing, and Filtering (Task-Driven)

<div class="viz-grow mt-6">
  <D3ConceptDiagram diagram="selection-patterns" class="viz-fill" />
</div>

<!--
TALK TRACK (≈4–5 min)

Three interaction patterns cover most needs:
selection (click a group), brushing (select a range), and filtering (reduce the data space).

Use selection when the task is “compare this group against others.”
Use brushing when the task is “focus on a time window” or “select a region.”
Use filtering when the dataset is large and the user needs to narrow the view.

Interactivity is only professional when it supports a named task.
-->

---
layout: two-cols
---

# Demo E: Interactive HTML artifacts

::left::
<div class="card !p-3">
  <div class="kicker">When to use HTML</div>
  <div class="text-lg font-700 mt-1">Interactivity supports a task</div>
  <ul class="mt-2 space-y-0.5 op80 text-sm">
    <li>Hover to confirm exact values</li>
    <li>Zoom/pan for dense time series</li>
    <li>Highlight/filter to compare groups</li>
  </ul>
</div>

<div class="callout mt-4">
  <div class="kicker">Deliverable</div>
  <div class="text-lg font-700 mt-1">A single HTML file you can share</div>
</div>

::right::
<div class="card">
  <div class="kicker">Rendered result (illustration)</div>
  <div class="op70 mt-2 text-sm">Hover + zoom are built in.</div>
</div>

<D3MiniInteractiveLine class="mt-5" />

<!--
TALK TRACK (≈4–5 min, deep dive)

This is the fastest path from Python to an interactive web artifact.

HTML is an artifact: you can host it, submit it, or embed it.

But remember: the purpose is not “interaction for interaction’s sake.” Use it when the task benefits—like inspecting exact values, exploring ranges, or supporting drill-down.
-->

---
layout: default
class: code-only
---

# Code Demo E — Run

```py {monaco-run height=360px outputHeight=220px}
import pandas as pd

df = pd.DataFrame(
    {"week": [1, 2, 3, 4, 5, 6], "pass_rate": [0.70, 0.62, 0.75, 0.73, 0.80, 0.78]}
)

width, height = 720, 320
pad_l, pad_r, pad_t, pad_b = 56, 18, 22, 44

xmin, xmax = df["week"].min(), df["week"].max()
ymin, ymax = 0.5, 0.9


def sx(x: float) -> float:
    return pad_l + (x - xmin) / (xmax - xmin) * (width - pad_l - pad_r)


def sy(y: float) -> float:
    return pad_t + (1 - (y - ymin) / (ymax - ymin)) * (height - pad_t - pad_b)


pts = [(sx(r.week), sy(r.pass_rate)) for r in df.itertuples(index=False)]
path = "M " + " L ".join(f"{x:.1f},{y:.1f}" for x, y in pts)

circles = []
for r in df.itertuples(index=False):
    circles.append(
        f"<circle cx='{sx(r.week):.1f}' cy='{sy(r.pass_rate):.1f}' r='6' "
        f"data-week='{r.week}' data-rate='{r.pass_rate:.2f}' />"
    )

svg = f"""
<svg viewBox='0 0 {width} {height}' width='{width}' height='{height}' xmlns='http://www.w3.org/2000/svg'>
  <style>
    .axis {{ stroke: #94a3b8; stroke-opacity: 0.5; }}
    .line {{ fill: none; stroke: #60a5fa; stroke-width: 3; }}
    circle {{ fill: #0ea5e9; stroke: #0b1220; stroke-width: 2; cursor: default; }}
    text {{ fill: #cbd5e1; font: 12px -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif; }}
  </style>
  <text x='{pad_l}' y='16' font-weight='700'>Pass rate over weeks (HTML + SVG)</text>
  <line class='axis' x1='{pad_l}' y1='{height - pad_b}' x2='{width - pad_r}' y2='{height - pad_b}' />
  <line class='axis' x1='{pad_l}' y1='{pad_t}' x2='{pad_l}' y2='{height - pad_b}' />
  <path class='line' d='{path}' />
  {''.join(circles)}
</svg>
""".strip()

html_doc = f"""<!doctype html>
<html>
<head>
<meta charset='utf-8'>
<meta name='viewport' content='width=device-width, initial-scale=1'>
<title>Pass rate over weeks</title>
<style>
  body {{ margin: 0; background: #0b1220; color: #e5e7eb;
         font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif; }}
  .wrap {{ padding: 16px; }}
  .tip {{ position: fixed; pointer-events: none; background: rgba(17,24,39,0.92);
          border: 1px solid rgba(148,163,184,0.35); border-radius: 10px;
          padding: 8px 10px; font-size: 12px; opacity: 0; }}
</style>
</head>
<body>
<div class='wrap'>
{svg}
</div>
<div class='tip' id='tip'></div>
<script>
  const tip = document.getElementById('tip');
  function showTip(e) {{
    const w = e.target.getAttribute('data-week');
    const r = e.target.getAttribute('data-rate');
    if (!w || !r) return;
    tip.textContent = `Week ${w} · pass_rate ${r}`;
    tip.style.left = (e.clientX + 12) + 'px';
    tip.style.top = (e.clientY + 12) + 'px';
    tip.style.opacity = 1;
  }}
  function hideTip() {{ tip.style.opacity = 0; }}
  document.querySelectorAll('circle').forEach(c => {{
    c.addEventListener('mousemove', showTip);
    c.addEventListener('mouseleave', hideTip);
  }});
</script>
</body>
</html>"""

print("HTML chars:", len(html_doc))
print("First 12 lines:")
for line in html_doc.splitlines()[:12]:
    print(line)
```

<!--
TALK TRACK (≈4–5 min, deep dive)

This generates a self-contained HTML file (inline SVG + tooltip).

The point is to make the artifact idea concrete:
SVG is a mark layer, HTML is the container, and a tiny script can add “details on demand.”
-->

---
class: viz-slide
---

## Choosing the Right Tool (A Practical Heuristic)

<div class="viz-grow mt-6">
  <D3ConceptDiagram diagram="tool-chooser-python" class="viz-fill" />
</div>

<!--
TALK TRACK (≈4 min)

Here’s a practical heuristic:

If you need a publication-quality static chart with full control, Matplotlib is reliable.
If you need statistical plots and fast small multiples, Seaborn is efficient.
If you want a grammar-of-graphics spec and lightweight interactivity, Altair is strong.
If you want interactive dashboards and sharing via HTML, Plotly is a solid default.

The best tool is the one that produces the right *artifact* with the least friction—while remaining correct and legible.
-->

---

## Export Formats: What You Hand In (and Why)

<div class="grid grid-cols-3 gap-4 mt-8">
  <div class="card">
    <div class="kicker">SVG</div>
    <div class="text-xl font-700 mt-1">Slides + print</div>
    <div class="op70 mt-2">Crisp, editable, searchable.</div>
  </div>
  <div class="card">
    <div class="kicker">PNG</div>
    <div class="text-xl font-700 mt-1">Fixed images</div>
    <div class="op70 mt-2">Good for dense marks; stable layout.</div>
  </div>
  <div class="card">
    <div class="kicker">HTML</div>
    <div class="text-xl font-700 mt-1">Interactive</div>
    <div class="op70 mt-2">Tooltips, zoom, filters.</div>
  </div>
</div>

<div class="callout mt-6">
  <div class="kicker">Rule</div>
  <div class="text-xl font-700 mt-2">Choose format based on *use case*, not preference.</div>
</div>

<!--
TALK TRACK (≈3–4 min)

Export is a design constraint.

If you’re presenting, SVG is usually best.
If you’re submitting a dense scatter plot, PNG may be safer.
If you’re doing a critique or interactive exploration, HTML is the right artifact.

Make the export format a deliberate choice early, because it affects how you design labels, spacing, and interactivity.
-->

---

## Micro-Checklist: “Looks Professional” in Practice

<div class="grid grid-cols-2 gap-4 mt-6">
  <div class="card">
    <div class="kicker">Typography</div>
    <ul class="mt-3 space-y-1 op80">
      <li>Readable title (claim or task)</li>
      <li>Axis labels with units</li>
      <li>Limited tick density</li>
    </ul>
  </div>
  <div class="card">
    <div class="kicker">Graphics</div>
    <ul class="mt-3 space-y-1 op80">
      <li>Aligned scales for comparisons</li>
      <li>Legend only if necessary</li>
      <li>One clear emphasis (not rainbow)</li>
    </ul>
  </div>
  <div class="card">
    <div class="kicker">Data</div>
    <ul class="mt-3 space-y-1 op80">
      <li>Rates vs counts handled</li>
      <li>Missingness shown explicitly</li>
      <li>Aggregation explained</li>
    </ul>
  </div>
  <div class="card">
    <div class="kicker">Export</div>
    <ul class="mt-3 space-y-1 op80">
      <li>SVG/PNG/HTML matches use case</li>
      <li>Consistent sizing across figures</li>
      <li>Works on dark backgrounds</li>
    </ul>
  </div>
</div>

<!--
TALK TRACK (≈3–4 min)

This is how you keep reputation-level quality.

Professional is not “more effects.” It’s correct, readable, consistent, and intentional.
Use this checklist before you export or submit anything.
-->

---

## Practice (In Class): Make One Chart, Three Exports

<div class="callout mt-6">
  <div class="kicker">Task</div>
  <div class="text-2xl font-700 mt-2">Create one chart and export it as SVG, PNG, and HTML.</div>
  <div class="op70 mt-2">Then explain which format you would submit for: slides, a PDF report, and an interactive critique.</div>
</div>

<v-clicks>

- Pick a simple dataset (10–200 rows)
- Include units and a baseline if relevant
- Write 2–3 sentences justifying your export choices

</v-clicks>

<!--
TALK TRACK (≈3–5 min)

This practice is about owning the full workflow.

The chart can be simple. What matters is that you can deliver it in the right format for the right context, and you can explain why.
-->

---

layout: section
---

<div class="kicker">Part 5 · Practice</div>

# Python-first visualization craft

Make charts that ship: readable, accessible, reusable.

<!--
TALK TRACK (≈3–4 min)

Up to now we covered the “what” of web-ready outputs and the “how” of a Python pipeline.

This last part is about craft: the habits that make your charts feel professional.
That means: consistent styling, meaningful color, reusable chart templates, and a workflow that scales beyond one notebook.
-->

---

## Styling is a constraint, not decoration

<div class="grid grid-cols-2 gap-4 mt-6">
  <div class="card">
    <div class="kicker">Professional habit</div>
    <div class="text-xl font-700 mt-1">Use one theme across charts</div>
    <div class="op70 mt-2">Typography, sizes, gridlines, colors.</div>
  </div>
  <div class="card">
    <div class="kicker">Why it matters</div>
    <div class="text-xl font-700 mt-1">Consistency builds trust</div>
    <div class="op70 mt-2">Viewers stop re-learning your chart style each slide.</div>
  </div>
</div>

<div class="callout mt-6">
  <div class="kicker">Design rule</div>
  <div class="text-lg font-700 mt-1">Make the data loud. Keep the scaffolding quiet.</div>
</div>

<!--
TALK TRACK (≈3–4 min)

Professional charts feel “calm” because the non-data ink is controlled:
light gridlines, consistent fonts, aligned margins, predictable legends.

Your job is to make the data the first thing people see—not your styling choices.
-->

---
layout: two-cols
---

# Live Python: A consistent Matplotlib style

::left::
<div class="card !p-3">
  <div class="kicker">What you’re building</div>
  <div class="text-lg font-700 mt-1">A tiny “style system”</div>
  <ul class="mt-2 space-y-0.5 op80 text-sm">
    <li>Figure size is intentional (export-ready)</li>
    <li>Typography is consistent</li>
    <li>Gridlines are subtle</li>
  </ul>
</div>

<div class="callout mt-4">
  <div class="kicker">Rule</div>
  <div class="text-lg font-700 mt-1">Make the data loud. Keep scaffolding quiet.</div>
</div>

::right::
<div class="card !p-3">
  <div class="kicker">What to notice</div>
  <ul class="mt-2 space-y-0.5 op80 text-sm">
    <li>Font sizes are intentional</li>
    <li>Gridlines are subtle</li>
    <li>Labels are complete (units when needed)</li>
  </ul>
</div>

<!--
TALK TRACK (≈4–5 min, deep dive)

This is a small “style system.”

The point isn’t the exact numbers. The point is: you can set defaults once and stop fighting readability on every chart.

In project work, this is how you maintain a consistent visual language across dozens of figures.
-->

---
layout: default
class: code-only
---

# Live Python — Run

```py {monaco-run height=320px outputHeight=180px}
import io

import matplotlib.pyplot as plt
import numpy as np

plt.rcParams.update({"figure.dpi": 120, "font.size": 12})

x = np.arange(1, 9)
y = np.array([72, 71, 74, 76, 75, 78, 80, 79])

fig, ax = plt.subplots(figsize=(7.2, 2.8))
ax.plot(x, y, marker="o", linewidth=2)
ax.set_title("Consistent style: readable by default")
ax.set_xlabel("Week")
ax.set_ylabel("Score")
ax.grid(True, alpha=0.25)
fig.tight_layout()

buf = io.StringIO()
fig.savefig(buf, format="svg")
svg = buf.getvalue()
print("SVG length:", len(svg))
print("Starts with:", svg.splitlines()[0][:72] + "…")
```

<!--
TALK TRACK (≈3–4 min)

When I run this, I want you to notice the habit:
explicit size + explicit labels + quiet grid + explicit export format.

Those four things create “professional” by default.
-->

---

## Color is a data encoding (not a theme)

<div class="grid grid-cols-2 gap-4 mt-6">
  <div class="card">
    <div class="kicker">Match meaning</div>
    <div class="text-xl font-700 mt-1">Type → palette</div>
    <div class="op70 mt-2">Categorical, ordered magnitude, baseline differences.</div>
  </div>
  <div class="card">
    <div class="kicker">Common failure</div>
    <div class="text-xl font-700 mt-1">Pretty ≠ interpretable</div>
    <div class="op70 mt-2">If the scale is wrong, the chart is wrong.</div>
  </div>
</div>

<div class="mt-5">
  <D3PaletteTypes />
</div>

<!--
TALK TRACK (≈4 min)

Color is not decoration in visualization—it is an encoding.

So you choose palette types based on semantics:
qualitative for categories, sequential for “how much,” diverging for “above vs below baseline.”

Once you commit to that mindset, your color choices become defensible instead of subjective.
-->

---

## Matplotlib colormaps: choose by semantics

<div class="grid grid-cols-2 gap-4 mt-6">
  <div class="card">
    <div class="kicker">Sequential</div>
    <div class="text-lg font-700 mt-1">Magnitude: low → high</div>
    <div class="op70 mt-2">Use lightness ramps so order is visible.</div>
  </div>
  <div class="card">
    <div class="kicker">Diverging</div>
    <div class="text-lg font-700 mt-1">Difference: below ↔ above baseline</div>
    <div class="op70 mt-2">Only when the midpoint is meaningful.</div>
  </div>
</div>

<div class="grid grid-cols-2 gap-4 mt-6">
  <D3SequentialScale />
  <D3DivergingScale />
</div>

<!--
TALK TRACK (≈4–5 min)

This slide is the “palette decision tree” in practice.

If the viewer needs to read order, your palette must have a clear lightness progression.
If the viewer needs to read direction around a baseline, diverging is appropriate—because neutral means something.
-->

---
layout: two-cols
---

# Live Python: sampling colors from a colormap

::left::
<div class="card !p-3">
  <div class="kicker">Concept</div>
  <div class="text-lg font-700 mt-1">Colormaps are functions</div>
  <div class="op70 mt-2 text-sm">
    You can sample them, test them, and keep them consistent across many charts.
  </div>
</div>

::right::
<div class="card !p-3">
  <div class="kicker">Why this matters</div>
  <div class="op70 mt-2 text-sm">
    Colormaps are functions. You can sample them, test them, and keep them consistent across plots.
  </div>
</div>

<!--
TALK TRACK (≈3–4 min)

This is a simple but important idea: colormaps are not “magic.”
They are functions that map numbers to colors.

That means you can reason about them and apply them consistently across multiple charts.
-->

---
layout: default
class: code-only
---

# Live Python — Run

```py {monaco-run height=240px outputHeight=180px}
import matplotlib.cm as cm

cmap = cm.get_cmap("viridis")
samples = [cmap(i / 4) for i in range(5)]

for i, rgba in enumerate(samples):
    print(i, tuple(round(x, 3) for x in rgba))
```

<!--
TALK TRACK (≈3–4 min)

I’m running this to make one idea concrete:
color is generated by a mapping, not “picked” manually.

Once you treat palettes as mappings, you can standardize them across a whole project.
-->

---

## Accessibility basics for color

<div class="grid grid-cols-2 gap-4 mt-6">
  <div class="card">
    <div class="kicker">Do</div>
    <div class="text-xl font-700 mt-1">Add redundancy</div>
    <div class="op70 mt-2">Labels, position, shape—don’t rely on color alone.</div>
  </div>
  <div class="card">
    <div class="kicker">Avoid</div>
    <div class="text-xl font-700 mt-1">Red/green-only meaning</div>
    <div class="op70 mt-2">Many viewers cannot reliably distinguish it.</div>
  </div>
</div>

<div class="mt-6">
  <D3RainbowTrap />
</div>

<!--
TALK TRACK (≈4–5 min, deep dive)

Accessibility is not optional; it’s part of correctness.

If a viewer cannot decode your chart because of color vision deficiency or low contrast, the visualization has failed its job.

The professional solution is redundancy: encode meaning with more than one channel.
-->

---

## Chart components as reusable code

<div class="grid grid-cols-3 gap-4 mt-6">
  <div class="card">
    <div class="kicker">Input</div>
    <div class="text-lg font-700 mt-1">DataFrame</div>
    <div class="op70 mt-2">Types + units + grain.</div>
  </div>
  <div class="card">
    <div class="kicker">Process</div>
    <div class="text-lg font-700 mt-1">Transform + encode</div>
    <div class="op70 mt-2">Compute chart-ready columns.</div>
  </div>
  <div class="card">
    <div class="kicker">Output</div>
    <div class="text-lg font-700 mt-1">Figure object</div>
    <div class="op70 mt-2">Exportable + consistent.</div>
  </div>
</div>

<div class="callout mt-6">
  <div class="text-lg font-700">If your chart can’t be wrapped as a function, it won’t scale to a project.</div>
</div>

<!--
TALK TRACK (≈3–4 min)

Professional visualization is “software,” even when it looks like design.

If you can parameterize it—data in, options in, figure out—you can reuse it and you can review it.
That is what makes a chart robust across datasets and deadlines.
-->

---
layout: two-cols
---

# Live Python: a reusable chart function (template)

::left::
<div class="card !p-3">
  <div class="kicker">Pattern</div>
  <div class="text-lg font-700 mt-1">A “chart component” mindset</div>
  <div class="op70 mt-2 text-sm">
    Turn repeated chart decisions into parameters (fields, scales, annotations, export).
  </div>
</div>

::right::
<div class="card !p-3">
  <div class="kicker">How to use it</div>
  <div class="op70 mt-2 text-sm">
    Turn repeated chart decisions into parameters (titles, fields, scales, annotations).
  </div>
</div>

<!--
TALK TRACK (≈3–4 min)

This is intentionally tiny: it demonstrates the “component” mindset.

Once you structure charts as parameterized components, your work becomes easier to maintain and easier to critique.
-->

---
layout: default
class: code-only
---

# Live Python — Run

```py {monaco-run height=260px outputHeight=160px}
from dataclasses import dataclass


@dataclass
class ChartSpec:
    title: str
    x: str
    y: str


def describe_chart(spec: ChartSpec) -> str:
    return f"{spec.title} | x={spec.x} | y={spec.y}"


print(describe_chart(ChartSpec("Pass rate trend", "week", "pass_rate")))
```

<!--
TALK TRACK (≈3–4 min)

This is intentionally tiny: it shows the idea that your chart has a spec.

When you write the spec as parameters, you can reuse, review, and standardize your charts.
-->

---
class: viz-slide
---

## Layout matters (even in notebooks)

<div class="grid grid-cols-2 gap-4 mt-5">
  <div class="card">
    <div class="kicker">Good layout</div>
    <div class="text-xl font-700 mt-1">Aligned comparisons</div>
    <div class="op70 mt-2">Shared scales; predictable reading order.</div>
  </div>
  <div class="card">
    <div class="kicker">Bad layout</div>
    <div class="text-xl font-700 mt-1">Legend hunting</div>
    <div class="op70 mt-2">Too many colors; misaligned axes; crowded labels.</div>
  </div>
</div>

<div class="viz-grow mt-4">
  <D3ConceptDiagram diagram="chart-components" class="viz-fill" />
</div>

<!--
TALK TRACK (≈3–4 min)

Layout is part of encoding.
If you want comparisons, align scales and place related views near each other.

This is why small multiples are such a powerful default: they outsource less work to the viewer.
-->

---

## Performance: reduce complexity before you draw

<div class="grid grid-cols-2 gap-4 mt-6">
  <div class="card">
    <div class="kicker">When data is large</div>
    <div class="text-xl font-700 mt-1">Aggregate or bin</div>
    <div class="op70 mt-2">Histograms, hexbin, summaries.</div>
  </div>
  <div class="card">
    <div class="kicker">When data is dense</div>
    <div class="text-xl font-700 mt-1">Sample or faceting</div>
    <div class="op70 mt-2">Downsample; split into panels.</div>
  </div>
</div>

<div class="callout mt-6">
  <div class="text-lg font-700">If you draw every point, you are encoding latency.</div>
</div>

<!--
TALK TRACK (≈3–4 min)

Performance problems are often design problems.

When you have too much data to draw directly, your job is to transform it into a view that supports the task:
bins for distributions, aggregation for summaries, sampling for exploration, and faceting for comparisons.
-->

---

## Publishing checklist (before you export)

<div class="grid grid-cols-2 gap-4 mt-6">
  <div class="card">
    <div class="kicker">Text</div>
    <ul class="mt-2 space-y-0.5 op80 text-sm">
      <li>Readable title + labels</li>
      <li>Units included</li>
      <li>Consistent font sizes</li>
    </ul>
  </div>
  <div class="card">
    <div class="kicker">Scales</div>
    <ul class="mt-2 space-y-0.5 op80 text-sm">
      <li>Baselines correct</li>
      <li>Domains chosen intentionally</li>
      <li>Comparisons are aligned</li>
    </ul>
  </div>
  <div class="card">
    <div class="kicker">Color</div>
    <ul class="mt-2 space-y-0.5 op80 text-sm">
      <li>Meaning matches palette</li>
      <li>Contrast is sufficient</li>
      <li>No color-only decoding</li>
    </ul>
  </div>
  <div class="card">
    <div class="kicker">Export</div>
    <ul class="mt-2 space-y-0.5 op80 text-sm">
      <li>SVG for vector (slides)</li>
      <li>PNG for raster (photos)</li>
      <li>HTML for interaction</li>
    </ul>
  </div>
</div>

<!--
TALK TRACK (≈4 min)

This checklist is what makes your output feel “finished.”

Most mistakes that hurt credibility are avoidable: missing units, unclear labels, incorrect baselines, or an inappropriate color mapping.

Treat export as part of design constraints, not a last step.
-->

---

## Mini exercise (in-class)

<div class="callout mt-8">
  <div class="kicker">Prompt</div>
  <div class="text-2xl font-800 mt-2">Turn one messy table into a chart-ready table.</div>
  <div class="op70 mt-3">Then choose a single chart and justify it in 4 sentences.</div>
</div>

<div class="grid grid-cols-2 gap-4 mt-6">
  <div class="card">
    <div class="kicker">Deliverable</div>
    <div class="op80 mt-2 text-sm">A tidy table + one exported figure (SVG or PNG).</div>
  </div>
  <div class="card">
    <div class="kicker">Justification</div>
    <div class="op80 mt-2 text-sm">Task → transform → encoding → why it’s readable.</div>
  </div>
</div>

<!--
TALK TRACK (≈3–4 min)

This is the workflow compressed into one exercise:
clean/reshape, compute measures, then pick an encoding that matches the task.

The justification is what makes it “professional.” You are not just showing a chart—you are defending a design choice.
-->

---

## Export formats: choose the right artifact

<div class="grid grid-cols-3 gap-4 mt-6">
  <div class="card">
    <div class="kicker">SVG</div>
    <div class="text-xl font-800 mt-2">Slides + print</div>
    <ul class="mt-3 space-y-1 op80 text-sm">
      <li>Crisp at any zoom</li>
      <li>Searchable/selectable text</li>
      <li>Editable in Figma/Illustrator</li>
    </ul>
    <div class="op60 mt-3 text-sm">Use when marks + labels must stay sharp.</div>
  </div>
  <div class="card">
    <div class="kicker">PNG</div>
    <div class="text-xl font-800 mt-2">Screens + photos</div>
    <ul class="mt-3 space-y-1 op80 text-sm">
      <li>Reliable everywhere</li>
      <li>Good for raster layers (maps)</li>
      <li>Predictable file size</li>
    </ul>
    <div class="op60 mt-3 text-sm">Use when you have imagery or heavy density.</div>
  </div>
  <div class="card">
    <div class="kicker">HTML</div>
    <div class="text-xl font-800 mt-2">Interaction</div>
    <ul class="mt-3 space-y-1 op80 text-sm">
      <li>Tooltips + selections</li>
      <li>Responsive layouts</li>
      <li>Shareable dashboards</li>
    </ul>
    <div class="op60 mt-3 text-sm">Use when interaction supports a task.</div>
  </div>
</div>

<div class="card mt-4 !p-3">
  <div class="kicker">Rule of thumb</div>
  <div class="op80 mt-2 text-sm">If it needs to be read, prefer `SVG`. If it needs to be explored, prefer `HTML`. If it’s an image, prefer `PNG`.</div>
</div>

<!--
TALK TRACK (≈4–5 min)

Professional output starts with picking the artifact intentionally.

SVG is your default for slides because typography stays sharp.
PNG is the safe choice when you have heavy raster backgrounds or extremely dense marks.
HTML is for interactive tasks—when the user will click, filter, brush, or inspect.

If you can’t explain why you exported a format, you probably picked it by accident.
-->

---

## Web-ready exports: what “done” looks like

<div class="grid grid-cols-2 gap-4 mt-6">
  <div class="card">
    <div class="kicker">Ship with context</div>
    <ul class="mt-3 space-y-1 op80 text-sm">
      <li>A one-sentence caption (what + why)</li>
      <li>Units + time window + data source</li>
      <li>A note for missing data / caveats</li>
    </ul>
    <div class="op60 mt-3 text-sm">A chart without context is a decoration.</div>
  </div>
  <div class="card">
    <div class="kicker">Ship with structure</div>
    <ul class="mt-3 space-y-1 op80 text-sm">
      <li>Consistent title sizing</li>
      <li>Aligned margins across figures</li>
      <li>Filenames: `topic_metric_scope_date.svg`</li>
    </ul>
    <div class="op60 mt-3 text-sm">The “professional” look is mostly layout discipline.</div>
  </div>
</div>

<div class="grid grid-cols-3 gap-4 mt-4">
  <div class="card !p-3">
    <div class="kicker">Export</div>
    <div class="op80 mt-2 text-sm">Save at intended size (don’t “resize later”).</div>
  </div>
  <div class="card !p-3">
    <div class="kicker">Check</div>
    <div class="op80 mt-2 text-sm">Open the file and verify labels/units are intact.</div>
  </div>
  <div class="card !p-3">
    <div class="kicker">Embed</div>
    <div class="op80 mt-2 text-sm">Place it into the final layout (slides, PDF, web page).</div>
  </div>
</div>

<!--
TALK TRACK (≈3–4 min)

Students often stop at “the plot appeared.” That’s not the finish line.

“Done” means the chart is understandable without you in the room and looks consistent when placed next to other figures.

Treat the export file as a deliverable: name it, open it, and proofread it.
-->

---

## Accessibility basics (for charts you publish)

<div class="grid grid-cols-2 gap-4 mt-6">
  <div class="card">
    <div class="kicker">Legibility</div>
    <ul class="mt-3 space-y-1 op80 text-sm">
      <li>Contrast passes “squint test”</li>
      <li>Text is large enough at 100% zoom</li>
      <li>Direct labels when possible</li>
    </ul>
  </div>
  <div class="card">
    <div class="kicker">Robustness</div>
    <ul class="mt-3 space-y-1 op80 text-sm">
      <li>No color-only meaning</li>
      <li>Patterns/markers for redundancy</li>
      <li>Clear “no data” encoding</li>
    </ul>
  </div>
</div>

<div class="card mt-4">
  <div class="kicker">Professional habit</div>
  <div class="text-xl font-800 mt-2">Assume your chart will be viewed in bad conditions.</div>
  <div class="op70 mt-2 text-sm">Low brightness, projector washout, grayscale print, or viewers with color-vision differences.</div>
</div>

<!--
TALK TRACK (≈4–5 min, deep dive)

Accessibility is not a “nice to have.” It’s part of being trustworthy.

You can’t control the projector or the phone screen. So you design with redundancy:
labels plus color, markers plus color, and clear handling of missing values.

If the chart fails when color is removed, it was never fully readable.
-->

---

## Case study: from overview to actionable detail

<D3ConceptDiagram diagram="case-study-student-flow" class="mt-10" />

<div class="card mt-6 !p-3">
  <div class="kicker">Why this pattern works</div>
  <div class="op80 mt-2 text-sm">Start broad (see trends), then narrow (choose a range), then inspect (compare distributions), then lookup only when necessary.</div>
</div>

<!--
TALK TRACK (≈4 min)

This is a classic dashboard interaction flow.

Overview shows you where to look. Brushing lets you focus. Details answer the “why.” Lookup is expensive, so you do it last and only when you need it.

Even in Python, you can produce this workflow: charts for overview + a selection widget in a notebook, or export an interactive HTML artifact.
-->

---

## Common export bugs (and quick fixes)

<div class="grid grid-cols-3 gap-4 mt-8">
  <div class="card">
    <div class="kicker">Bug</div>
    <div class="text-xl font-800 mt-2">Tiny text in the final file</div>
    <div class="op70 mt-2 text-sm">It looked fine in the notebook, then became unreadable.</div>
    <div class="kicker mt-4">Fix</div>
    <div class="op80 mt-2 text-sm">Set figure size + font sizes explicitly before export.</div>
  </div>
  <div class="card">
    <div class="kicker">Bug</div>
    <div class="text-xl font-800 mt-2">Cropping / clipped labels</div>
    <div class="op70 mt-2 text-sm">Axis labels or legends get cut off.</div>
    <div class="kicker mt-4">Fix</div>
    <div class="op80 mt-2 text-sm">Use `tight_layout()` / constrained layout and verify the file.</div>
  </div>
  <div class="card">
    <div class="kicker">Bug</div>
    <div class="text-xl font-800 mt-2">Misleading scales after export</div>
    <div class="op70 mt-2 text-sm">Domains/baselines changed across charts.</div>
    <div class="kicker mt-4">Fix</div>
    <div class="op80 mt-2 text-sm">Lock domains for comparisons; label units; avoid implicit defaults.</div>
  </div>
</div>

<div class="card mt-5 !p-3">
  <div class="kicker">Rule</div>
  <div class="op80 mt-2 text-sm">Always open the exported file and proofread it like a report.</div>
</div>

<!--
TALK TRACK (≈3–4 min)

These are not “beginner mistakes.” They happen in real teams.

The fix is a habit: explicit sizing, explicit labels, explicit domains, and always verifying the exported artifact.
-->

---

## Exit ticket (2 minutes)

<div class="grid grid-cols-2 gap-4 mt-8">
  <div class="card">
    <div class="kicker">1</div>
    <div class="text-xl font-800 mt-2">What is your dataset’s “grain” after your transform?</div>
    <div class="op70 mt-2 text-sm">Example: one row = program × week.</div>
  </div>
  <div class="card">
    <div class="kicker">2</div>
    <div class="text-xl font-800 mt-2">Which channel is doing the “hard work”?</div>
    <div class="op70 mt-2 text-sm">Position? Length? Lightness? (Name it.)</div>
  </div>
  <div class="card">
    <div class="kicker">3</div>
    <div class="text-xl font-800 mt-2">What did you export, and why that format?</div>
    <div class="op70 mt-2 text-sm">SVG vs PNG vs HTML.</div>
  </div>
  <div class="card">
    <div class="kicker">4</div>
    <div class="text-xl font-800 mt-2">One improvement you would make next iteration</div>
    <div class="op70 mt-2 text-sm">Labeling, domain, transform, or layout.</div>
  </div>
</div>

<!--
TALK TRACK (≈3 min)

These questions force “engineering clarity.”

If you can state the grain, name the channel, justify your export, and propose a next iteration, you are thinking like a visualization practitioner.
-->

---

## Key Takeaways

<v-clicks>

- Web outputs matter: SVG/HTML are common “final forms”
- Python workflow: data → transforms → chart → export
- Modern charts are components: scales, marks, axes, guides, interaction
- Interactivity is only “professional” when it supports a task

</v-clicks>

<!--
TALK TRACK (≈3–4 min)

The core message is not “use library X.”

The message is: understand the output, build a repeatable pipeline, and think in chart components so you can design and debug like a professional.
-->

---

## References (Recommended)

<div class="grid grid-cols-2 gap-4 mt-6">
  <div class="card">
    <div class="text-lg font-700">Matplotlib documentation</div>
    <div class="op70 mt-1">Figure/Axes model, export formats, styling</div>
    <div class="mt-2 text-sm"><a href="https://matplotlib.org/stable/" target="_blank">https://matplotlib.org/stable/</a></div>
  </div>
  <div class="card">
    <div class="text-lg font-700">Altair documentation</div>
    <div class="op70 mt-1">Grammar of graphics + interactive selections</div>
    <div class="mt-2 text-sm"><a href="https://altair-viz.github.io/" target="_blank">https://altair-viz.github.io/</a></div>
  </div>
  <div class="card">
    <div class="text-lg font-700">Plotly documentation</div>
    <div class="op70 mt-1">Interactive charts + HTML export</div>
    <div class="mt-2 text-sm"><a href="https://plotly.com/python/" target="_blank">https://plotly.com/python/</a></div>
  </div>
  <div class="card">
    <div class="text-lg font-700">Wickham (2014)</div>
    <div class="op70 mt-1">Tidy data as a foundation for chart-ready tables</div>
    <div class="mt-2 text-sm"><a href="https://doi.org/10.18637/jss.v059.i10" target="_blank">https://doi.org/10.18637/jss.v059.i10</a></div>
  </div>
</div>

<!--
TALK TRACK (≈3 min)

If you want to build strong habits quickly, read the docs like reference manuals: look for the concepts, not just the code.

Matplotlib is about explicit control and export.
Altair is about encoding specs and clean interactivity.
Plotly is about interactive HTML artifacts.
And tidy data is the reason your transformations stay consistent and scalable.
-->
