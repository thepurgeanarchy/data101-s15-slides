---
title: Python Visualization Basics
subtitle: "DATA101 — Web Outputs, Modern Chart Components, and Interactive Graphics"
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
    <div class="text-2xl font-700 mt-1">HTML, CSS, SVG</div>
    <div class="op70 mt-2">What the browser actually renders.</div>
  </div>
  <div class="card">
    <div class="kicker">02 · Python workflow</div>
    <div class="text-2xl font-700 mt-1">Notebook → chart → export</div>
    <div class="op70 mt-2">Reproducible visuals you can ship.</div>
  </div>
  <div class="card">
    <div class="kicker">03 · Modern components</div>
    <div class="text-2xl font-700 mt-1">Scales, marks, guides</div>
    <div class="op70 mt-2">A reusable mental model.</div>
  </div>
  <div class="card">
    <div class="kicker">04 · Interactivity</div>
    <div class="text-2xl font-700 mt-1">Selections + tooltips</div>
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

# What the browser understands

HTML + CSS + SVG as the delivery layer for charts

<!--
TALK TRACK (≈3–4 min)

We start with the web because even “Python charts” often end up being web artifacts:
embedded in learning pages, dashboards, notebooks rendered to HTML, or exported to SVG for slides.

If you know what the browser understands, you can export correctly and fix layout problems quickly.
-->

---

## The Web Output Stack (for Charts)

<D3ConceptDiagram diagram="web-viz-stack" class="mt-8" />

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

<D3ConceptDiagram diagram="svg-coordinates" class="mt-3 viz-compact" />

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

# Notebook → chart → export

Reproducible visuals you can ship

<!--
TALK TRACK (≈3–4 min)

Now we connect the web output idea to Python practice.
Professional visualization is repeatable: you can rerun it next week, change a dataset, and the chart updates without manual edits.
-->

---

## A Repeatable Python Visualization Pipeline

<D3ConceptDiagram diagram="python-viz-pipeline" class="mt-8" />

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

# Code Demo A: Make a Chart-Ready Table

::left::
<div class="kicker">Runnable Python</div>
<div class="op70 mt-1 text-sm">Copy into a notebook and run.</div>

```py
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
weekly = (
    df.sort_values(["program", "week"])
    .assign(delta=lambda d: d.groupby("program")["pass_rate"].diff())
)
weekly
```

::right::
<div class="card">
  <div class="kicker">Output you should see</div>
  <div class="op70 mt-2 text-sm">A tidy table with a derived rate + delta.</div>
</div>

<D3MiniTableDemo class="mt-5" />

<!--
TALK TRACK (≈4–5 min, deep dive)

This example is small on purpose. The goal is to make the “chart-ready table” idea concrete.

We start with counts: passes and students. Then we derive the measure we actually care about for comparison: pass_rate.

Then we compute a delta over time per program. That delta becomes a powerful visual variable: it tells you direction and change.

Notice what we did not do: we did not pick a chart first. We prepared the data so multiple charts become possible: a time trend, a ranked delta view, or a small-multiples comparison.
-->

---

## Matplotlib: The “Artist” Model (Mental Map)

<D3ConceptDiagram diagram="matplotlib-anatomy" class="mt-8" />

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

# Code Demo B: Matplotlib → SVG Export

::left::
<div class="card">
  <div class="kicker">Runnable Python</div>
  <div class="op70 mt-2 text-sm">Produces a line chart and saves an SVG.</div>
</div>

```py
import matplotlib.pyplot as plt
import numpy as np

x = np.arange(1, 7)
y = np.array([0.70, 0.62, 0.75, 0.73, 0.80, 0.78])

fig, ax = plt.subplots(figsize=(7.2, 3.6))
ax.plot(x, y, marker="o", linewidth=2)
ax.set_title("Pass rate over weeks")
ax.set_xlabel("Week")
ax.set_ylabel("Pass rate")
ax.set_ylim(0.5, 0.9)
ax.grid(True, alpha=0.25)

fig.tight_layout()
fig.savefig("pass_rate.svg")
```

::right::
<div class="card">
  <div class="kicker">Rendered result (illustration)</div>
  <div class="op70 mt-2 text-sm">Your SVG will scale crisply in slides.</div>
</div>

<D3MiniLineDemo class="mt-5" />

<!--
TALK TRACK (≈5 min, deep dive)

This slide is about “shipping,” not just plotting.

We choose a figure size intentionally and label everything. That’s already a professional step: the chart should be legible without a paragraph of explanation.

Then we export to SVG. SVG is ideal for slides and PDFs because it stays sharp at any zoom.

The practical habit: always set figure size, always set labels and limits intentionally, and always export explicitly—don’t rely on screenshots.
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
<div class="kicker">Runnable Python</div>
<div class="op70 mt-1 text-sm">Shows why distribution beats averages.</div>

<div class="text-[0.72rem] leading-[1.05] -mt-1">

```py
import numpy as np, pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

rng=np.random.default_rng(7)
program=np.repeat(list("ABC"), 250)
score=np.r_[rng.normal(76, 6, 250), rng.normal(76, 14, 250), rng.normal(70, 8, 250)]
df=pd.DataFrame({"program": program, "score": score})

sns.displot(
    df, x="score", col="program", bins=18,
    facet_kws=dict(sharex=True, sharey=True),
    height=3, aspect=1.1
)
plt.show()
```

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

# Think in chart parts

Build charts like reusable UI components

<!--
TALK TRACK (≈3–4 min)

Now we shift to the “components” mindset.
This is the bridge to professional work: you stop thinking “a chart,” and start thinking “a system of parts” you can reuse across many charts.
-->

---

## The Modern Chart Component Checklist

<D3ConceptDiagram diagram="chart-components" class="mt-8" />

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

## “D3 Concepts” in a Python World

<div class="grid grid-cols-2 gap-4 mt-6">
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

<D3ConceptDiagram diagram="binding-to-spec" class="mt-6" />

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
<div class="kicker">Runnable Python</div>
<div class="op70 mt-1 text-sm">Data → encoding → interactive tooltip.</div>

<div class="text-[0.72rem] leading-[1.05] -mt-1">

```py
import pandas as pd
import altair as alt

df=pd.DataFrame({
    "x":[1,2,3,4,5,6],
    "y":[0.70,0.62,0.75,0.73,0.80,0.78],
    "term":["baseline"]*3 + ["current"]*3
})

alt.Chart(df).mark_circle(size=110).encode(
    x="x:Q",
    y=alt.Y("y:Q", scale=alt.Scale(domain=[0.5, 0.9])),
    color="term:N",
    tooltip=["x", "y", "term"],
).properties(width=380, height=260, title="Encoded scatter with tooltip")
```

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

# Interactivity with purpose

Tooltips, selection, filtering, and readable dashboards

<!--
TALK TRACK (≈3–4 min)

Interactivity is powerful—but it’s easy to add interactivity that makes charts harder to read.
So we focus on “purposeful” interactions: ones that directly support a task.
-->

---

## Tooltips Are “Details on Demand”

<div class="grid grid-cols-2 gap-4 mt-6">
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

<D3ConceptDiagram diagram="tooltip-rule" class="mt-6" />

<!--
TALK TRACK (≈3–4 min)

Tooltips are excellent for exact values and metadata, but they shouldn’t be a crutch.

If the chart is not readable without hovering every mark, the encoding or layout is doing too little work. Use tooltips to confirm, not to decode.
-->

---

## Selections, Brushing, and Filtering (Task-Driven)

<D3ConceptDiagram diagram="selection-patterns" class="mt-8" />

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

# Code Demo E: Plotly for Interactive HTML

::left::
<div class="card">
  <div class="kicker">Runnable Python</div>
  <div class="op70 mt-2 text-sm">Exports an interactive chart to HTML.</div>
</div>

```py
import pandas as pd
import plotly.express as px

df = pd.DataFrame(
    {
        "week": [1, 2, 3, 4, 5, 6],
        "pass_rate": [0.70, 0.62, 0.75, 0.73, 0.80, 0.78],
    }
)

fig = px.line(df, x="week", y="pass_rate", markers=True, title="Pass rate over weeks")
fig.update_yaxes(range=[0.5, 0.9])
fig.write_html("pass_rate.html", include_plotlyjs="cdn")
fig
```

::right::
<div class="card">
  <div class="kicker">Rendered result (illustration)</div>
  <div class="op70 mt-2 text-sm">Hover + zoom are built in.</div>
</div>

<D3MiniInteractiveLine class="mt-5" />

<!--
TALK TRACK (≈4–5 min, deep dive)

This is the fastest path from Python to an interactive web artifact.

Plotly produces an HTML file you can host or submit. The key is that the output is self-contained enough to share.

But remember: the purpose is not “interaction for interaction’s sake.” Use it when the task benefits—like inspecting exact values, exploring ranges, or supporting drill-down.
-->

---

## Choosing the Right Tool (A Practical Heuristic)

<D3ConceptDiagram diagram="tool-chooser-python" class="mt-8" />

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
