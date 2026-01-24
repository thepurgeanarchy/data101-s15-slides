---
title: Perception & Color
subtitle: "DATA101 — Chart Reading, Accessibility, and Misleading Encodings"
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

# Perception & Color

Designing charts for the human visual system — then learning how to *read* charts defensibly.

<div class="absolute bottom-10 left-14 leading-tight">
  <div class="text-xl font-700">Marc Reyes</div>
  <div class="op70">Professional Lecturer · marc.reyes@dlsu.edu.ph</div>
  <div class="op70">DATA101 — De La Salle University</div>
</div>

<!--
TALK TRACK (≈3–4 min)

Good day everyone—I'm Marc Reyes. Today’s lecture is about perception and color, and then we’ll shift into chart reading—how to spot misleading encodings and common pitfalls.

If you’ve ever looked at a chart and thought, “This looks convincing… but I’m not sure it’s true,” that’s chart literacy. A good data visualization student doesn’t only know how to make charts—they know how to *audit* charts.

Perception is the bridge. Visualization is not math on a page; it’s information going through a human visual system—attention, memory, and interpretation. That means design is constrained by how people see patterns, compare quantities, and get misled.

Color is where many visualizations succeed or fail. Color can organize categories, show magnitude, and guide attention—but it can also imply patterns that don’t exist, hide uncertainty, and exclude viewers when accessibility is ignored.

So our goal today is twofold:
first, understand what the eye is good at and what it’s bad at; second, use that understanding to both design and critique visualizations. When you can defend your choices and also critique other charts, your work starts to look professional—because it’s grounded in how perception actually works.
-->

---

## Today’s Plan

<div class="grid grid-cols-2 gap-4 mt-6">
  <div class="card">
    <div class="kicker">01 · Perception</div>
    <div class="text-2xl font-700 mt-1">How people see charts</div>
    <div class="op70 mt-2">Preattentive cues, grouping, and limits.</div>
  </div>
  <div class="card">
    <div class="kicker">02 · Color</div>
    <div class="text-2xl font-700 mt-1">Mapping colors to data</div>
    <div class="op70 mt-2">Palette types + accessibility basics.</div>
  </div>
  <div class="card">
    <div class="kicker">03 · Chart Reading</div>
    <div class="text-2xl font-700 mt-1">Spot misleading encodings</div>
    <div class="op70 mt-2">Pitfalls that break trust.</div>
  </div>
  <div class="card">
    <div class="kicker">04 · Practice</div>
    <div class="text-2xl font-700 mt-1">Audit + redesign</div>
    <div class="op70 mt-2">A workflow you can repeat.</div>
  </div>
</div>

<!--
TALK TRACK (≈3 min)

Here’s the structure for today.

We start with perception: what your visual system does instantly—like detecting a strong outlier—and what it struggles with—like comparing areas accurately. This matters because charts can either align with perception or fight against it.

Next is color. We’ll treat color like a tool with rules: different palette types for different data types, and clear constraints for accessibility. I’ll give you practical “if-then” guidelines you can apply immediately to your projects.

Then we shift into chart reading. This is where you learn to be skeptical in a productive way. We’ll cover the most common ways charts mislead: truncated axes, dual axes, wrong baselines, inappropriate color scales, and aggregation that hides the real distribution.

Finally, we practice. You’ll use a checklist to audit a chart and propose fixes. In the real world, that audit step is how you prevent errors and build trust with stakeholders.
-->

---

## Learning Outcomes

<div class="grid grid-cols-2 gap-4 mt-8">
  <div class="card">
    <div class="kicker">Perception</div>
    <div class="text-xl font-700 mt-1">Choose channels that humans compare well</div>
    <div class="op70 mt-2">Position and length beat area and angle.</div>
  </div>
  <div class="card">
    <div class="kicker">Color</div>
    <div class="text-xl font-700 mt-1">Match palette type to data type</div>
    <div class="op70 mt-2">Qualitative vs sequential vs diverging.</div>
  </div>
  <div class="card">
    <div class="kicker">Accessibility</div>
    <div class="text-xl font-700 mt-1">Design beyond “color only”</div>
    <div class="op70 mt-2">Contrast + redundancy + clear labeling.</div>
  </div>
  <div class="card">
    <div class="kicker">Chart Reading</div>
    <div class="text-xl font-700 mt-1">Audit charts for misleading choices</div>
    <div class="op70 mt-2">Axes, baselines, scales, and aggregation.</div>
  </div>
</div>

<!--
TALK TRACK (≈3–4 min)

These are the outcomes you should be able to demonstrate after this session.

First: you can choose visual channels humans compare accurately. This is why professional charts lean heavily on aligned position—because it’s the most precise comparison channel for our perception.

Second: you can match palette types to data types. A categorical variable needs distinct hues; an ordered variable needs a monotonic lightness ramp; a “positive vs negative” measure needs a diverging scale anchored at a meaningful midpoint.

Third: you can design accessibly. Accessibility is not an optional “nice to have.” It’s part of correctness—because a chart that only works for some viewers is incomplete communication. We’ll cover contrast, color‑blind safe choices, and redundant encoding patterns.

Fourth: you can audit charts. In data work, you will constantly consume charts made by others—news outlets, dashboards, reports. You must be able to spot whether the visualization is faithful to the data or engineered to persuade.

If you can do these four things, your projects will feel professional because your design decisions are explainable, defensible, and reliable.
-->

---
layout: section
---

<div class="kicker">Part 1 · Perception</div>

# <span class="accent-text">Perception</span> is the interface

The chart is not the message. The *viewer’s perception* is.

<!--
TALK TRACK (≈4–5 min)

This is the core idea: the chart is not the message by itself. The message only exists after a human perceives it, interprets it, and decides what it means.

That means visualization is a human factors problem. Two charts can encode the same data, but one can lead to the right conclusions and the other can lead to wrong conclusions—because the second chart fights perception.

For example, our eyes compare position on a shared scale very well. That’s why dot plots and line charts can be powerful. But our eyes compare areas poorly. That’s why bubble charts and 3D pies are so risky—viewers will misjudge differences.

Perception also has limits. Attention is selective and working memory is small. If a chart forces you to constantly look back and forth between legend and marks, or to compare 12 different colors, it creates cognitive friction and increases error.

So today, I want you to adopt a professional mindset: treat perception as a design requirement. Your job is not only to make something “look nice,” but to make the *intended reading* effortless and the *wrong reading* difficult.
-->

---

## The Visualization Pipeline (Where Errors Enter)

<D3ConceptDiagram diagram="viz-pipeline" class="mt-6" />

<!--
TALK TRACK (≈3–4 min)

This pipeline is a simple way to remember where visualization errors come from.

We start with data—measurements and records. Even here, mistakes happen: using counts when you need rates, comparing different populations without normalization, or mixing inconsistent units.

Next is encoding: your choice of marks and channels—position, length, color, shape, area. This is where many “pretty but wrong” charts happen. The chart looks polished, but the encoding encourages misreading.

Then perception: how the viewer actually sees the chart. If your design overloads attention—too many categories, too many annotations, too many panels—the viewer will either give up or make mistakes.

Then interpretation: the mental story people form. Humans are pattern-seeking. If your color scale creates false boundaries, people will interpret noise as structure.

Finally action: the whole point of visualization. If the earlier steps are flawed, the decision becomes unreliable. So a professional workflow is basically: reduce error at every stage of this pipeline.
-->

---

## Preattentive Cues (What the Eye Sees “Immediately”)

<div class="grid grid-cols-2 gap-4 mt-6">
  <div class="card">
    <div class="kicker">Fast comparisons</div>
    <div class="text-lg font-700 mt-1">Position, length, slope</div>
    <div class="op70 mt-2">Best for “how much” and trends.</div>
  </div>
  <div class="card">
    <div class="kicker">Fast grouping</div>
    <div class="text-lg font-700 mt-1">Hue, shape, enclosure</div>
    <div class="op70 mt-2">Best for “which group?”</div>
  </div>
</div>

<D3ConceptDiagram diagram="preattentive-ranking" class="mt-6" />

<!--
TALK TRACK (≈4–5 min)

Preattentive cues are visual features your brain processes very quickly—often before conscious attention. This is why a good chart can “pop” with an outlier or a strong trend.

But not all cues are equal for quantitative comparison. The rule of thumb is the ranking you see here: position on a common scale is best. If you want accurate comparison, use aligned position—dot plots, bar charts, line charts.

Length is also strong—bars can work well when baseline is correct. Angle and area are weaker. This is why pie charts are less precise for comparing categories, and bubble charts are dangerous when you need exact magnitude comparisons.

Color lightness can encode magnitude, but it’s less precise than position. Hue is not good for “how much,” but it is very effective for grouping—“which category does this belong to?”

So the design takeaway is simple: if the task is precise comparison, prefer position. If the task is grouping or highlighting, use hue sparingly. This one principle alone explains many professional chart choices.
-->

---

## Attention + Working Memory (Why “Too Much” Breaks Charts)

<div class="grid grid-cols-3 gap-4 mt-8">
  <div class="card">
    <div class="kicker">Attention</div>
    <div class="text-2xl font-700 mt-1">Selective</div>
    <div class="op70 mt-2">Viewers don’t read everything.</div>
  </div>
  <div class="card">
    <div class="kicker">Memory</div>
    <div class="text-2xl font-700 mt-1">Limited</div>
    <div class="op70 mt-2">Don’t force “legend hunting.”</div>
  </div>
  <div class="card">
    <div class="kicker">Comparison</div>
    <div class="text-2xl font-700 mt-1">Fragile</div>
    <div class="op70 mt-2">Use shared scales + alignment.</div>
  </div>
</div>

<div class="callout mt-6">
  <div class="kicker">Rule of thumb</div>
  <div class="text-xl font-700 mt-2">If your chart needs a paragraph to explain how to read it, redesign the chart.</div>
</div>

<!--
TALK TRACK (≈3–4 min)

This slide is about why a chart can be “technically correct” but still fail in practice.

Attention is selective. Most viewers look at the title, then whatever visually stands out, then maybe the axes. They do not read every label. That means your design must control what stands out first: the main trend, the key comparison, the critical outlier.

Working memory is limited. If a viewer has to keep multiple categories in mind while scanning a legend and then searching for the matching color, errors increase quickly. That’s why direct labels often beat legends, and why too many categories is a design smell.

Comparison is fragile. Humans can compare accurately when marks share a baseline and scale. But when scales differ across panels or when encodings switch from one part of a dashboard to another, viewers misinterpret the magnitude.

So here’s a practical rule: if the chart requires a paragraph to teach someone how to read it, redesign. A professional chart is not “clever”—it’s readable.
-->

---

## Gestalt Principles (How Viewers Group Marks)

<D3ConceptDiagram diagram="gestalt-mindmap" class="mt-6" />

<!--
TALK TRACK (≈3–4 min)

Gestalt principles describe how viewers automatically group visual elements.

Proximity means “things that are near each other belong together.” This is why faceting and clustering can work without a legend—you’re using spatial grouping.

Similarity means “things that look alike belong together.” This includes color, shape, size, and texture. This is powerful, but also dangerous—if you reuse colors inconsistently, you create false groupings.

Enclosure means a region defines a group. Boxes, shaded panels, or background cards can create structure. If you’re building slides or dashboards, enclosure is a professional way to separate modules.

Connection means lines imply relationships. In a line chart, the connection implies continuity over time—so only connect points when it’s meaningful to interpret as a continuous series.

Figure-ground is about hierarchy: what is foreground versus background. On a dark theme, your background should recede and your data should be legible without being harsh.

These principles are not “art theory.” They are practical rules you can use to reduce confusion and control interpretation.
-->

---

## Proximity: Grouping Without Extra Ink

<D3ConceptDiagram diagram="proximity-grouping" class="mt-7" />

<div class="callout mt-3">
  <div class="kicker">Design move</div>
  <div class="text-lg font-700 mt-2">Use spacing and faceting to group — before adding more colors.</div>
</div>

<!--
TALK TRACK (≈3–4 min)

Proximity is the cheapest grouping tool you have. It costs almost no cognitive effort: when items are close, we treat them as a group.

In practice, proximity is how professional dashboards organize complexity: small multiples, grouped tables, aligned panels. It’s also how you can reduce color overload. Before you add a new hue, ask: can spacing or faceting do the grouping?

For example, if you have four programs, you can facet into four small panels. Now you don’t need four colors; you might use one color for “current” and one neutral for “baseline,” and let proximity do the rest.

This matters because color is a scarce resource. Too many colors reduce clarity and increase legend dependency. Proximity lets you save color for what it does best: highlighting or signaling categories when grouping alone is not enough.
-->

---

## Similarity: When Color Creates Categories

<D3ConceptDiagram diagram="similarity-categories" class="mt-6" />

<div class="mt-3 grid grid-cols-2 gap-4">
  <div class="card">
    <div class="kicker">Use similarity for</div>
    <div class="text-lg font-700 mt-1">Grouping, not magnitude</div>
    <div class="op70 mt-2">Hue answers “which group?”</div>
  </div>
  <div class="card">
    <div class="kicker">Common mistake</div>
    <div class="text-lg font-700 mt-1">Hue implies “how much”</div>
    <div class="op70 mt-2">Prefer lightness for ordered data.</div>
  </div>
</div>

<!--
TALK TRACK (≈3–4 min)

Similarity is why color is so powerful: our brain treats same-colored marks as the same kind of thing.

This is great for categorical data. If the question is “which program does this belong to?” then hue can encode the program. If the question is “which condition is this?” hue can separate conditions.

But similarity is also why color can mislead. Hue is not a natural magnitude scale. If you assign random hues across ordered values, viewers will still group them, but they cannot reliably compare them.

So here’s the professional rule: use hue to communicate categories and grouping. Use lightness—how bright or dark something is—to communicate order or magnitude, and only when you design a proper sequential scale.

If you remember that one distinction—hue for “which,” lightness for “how much”—your color choices will improve immediately.
-->

---

## Connection + Enclosure (When Lines and Boxes Mean Something)

<D3ConceptDiagram diagram="connection-enclosure" class="mt-6" />

<!--
TALK TRACK (≈3–4 min)

Two Gestalt tools you will use constantly in visualization: connection and enclosure.

Connection is what makes line charts work. The line tells your brain: “these points belong to one series” and “the value changes continuously over this order.” That’s why line charts are great for time series.

But the same property can mislead. If your x-axis is not truly ordered—like categories or unrelated bins—connecting points implies a trend that doesn’t exist. So only connect marks when the connection is meaningful: time, ordered bins, or a defined sequence.

Enclosure is how you build structure without noise. Panels, cards, and shaded regions create groups. For example, a dashboard might enclose “KPIs” in one region and “diagnostic charts” in another. This makes reading faster because the viewer knows where to look for each kind of information.

So the design reminder is: lines imply relationships; boxes imply grouping. Use them deliberately.
-->

---

## Visual Hierarchy (Make the Intended Reading Obvious)

<div class="grid grid-cols-2 gap-4 mt-6">
  <div class="card">
    <div class="kicker">Hierarchy recipe</div>
    <div class="text-lg font-700 mt-1">1 headline + 1 takeaway</div>
    <div class="op70 mt-2">State what to look for before showing details.</div>
  </div>
  <div class="card">
    <div class="kicker">Reduce noise</div>
    <div class="text-lg font-700 mt-1">De-emphasize non-data ink</div>
    <div class="op70 mt-2">Light gridlines, fewer ticks, direct labels.</div>
  </div>
</div>

<D3ConceptDiagram diagram="visual-hierarchy" class="mt-6" />

<!--
TALK TRACK (≈3–4 min)

Visual hierarchy is how you guide attention. If everything is equally loud, nothing stands out.

A simple recipe for a professional chart or slide is: one strong headline that names the task or takeaway, then the key marks highlighted, and then the remaining context pushed into the background.

This is why gridlines should usually be subtle. It’s why we often use a neutral color for baseline and a single accent for “current term.” It’s why we label key points directly instead of forcing the viewer to decode a legend.

Hierarchy is also about typography: the main message should be readable at a glance. In professional reports, the audience may only give a chart five seconds. If the chart can’t communicate the takeaway quickly, it will be ignored.

So as you design, ask yourself: what should the viewer see first? second? third? Then use contrast, color, and spacing to enforce that order.
-->

---
layout: section
---

<div class="kicker">Part 2 · Color</div>

# Mapping <span class="accent-text">Color</span> to data

Color is powerful — and easy to misuse.

<!--
TALK TRACK (≈3–4 min)

Now we shift into color. Color is one of the most expressive channels you have, but it’s also where charts become misleading quickly.

The key idea is that color carries meaning, even when you didn’t intend it. Hue creates categories. Lightness creates order. Certain colors imply “good” or “bad.” And in a dark theme, contrast behaves differently than in a white background.

So we’ll treat color like a mapping problem: what is the data type, what is the task, and what palette type is appropriate? Then we’ll add accessibility constraints: can this chart be read without color, and does it have enough contrast?

If you can answer those questions, your color choices will look professional and will be defensible.
-->

---

## Color Has Three Useful Dimensions

<D3ConceptDiagram diagram="color-dimensions" class="mt-7" />

<div class="callout mt-6">
  <div class="kicker">Key message</div>
  <div class="text-xl font-700 mt-2">Hue answers “which group?” Lightness answers “how much?”</div>
</div>

<!--
TALK TRACK (≈4–5 min)

When you say “use color,” you should ask: which dimension of color are we using?

Hue is the most common: blue vs green vs purple. Hue is excellent for separating categories. But hue is not naturally ordered—so it’s weak for showing magnitude.

Lightness—how bright or dark a color is—is what creates a visual order. That’s why a good sequential scale changes lightness smoothly. Lightness is not as precise as position, but it can work for heatmaps and choropleths when designed carefully.

Chroma or saturation is intensity. It’s tempting to use saturation as a scale, but it can be inconsistent across hues and can be hard to compare. Saturation is best used to create emphasis: a fully saturated highlight mark against a desaturated background.

So the key message: hue for categories, lightness for magnitude. If you follow that rule, many common color mistakes disappear.
-->

---

## Three Palette Types You Should Know

<D3PaletteTypes class="mt-8" />

<!--
TALK TRACK (≈3–4 min)

These three palette types cover most visualization needs.

Qualitative palettes are sets of distinct hues. They are for categories: program A vs program B, product lines, regions—anything without an inherent order.

Sequential palettes are for magnitude: low to high, using a lightness ramp. They should change smoothly in brightness so that the viewer can perceive ordering.

Diverging palettes are for deviations around a meaningful midpoint: zero, average, baseline, target. They use two ramps so that negative and positive values are visually distinct.

If you choose the wrong palette type, you create semantic errors. A qualitative palette on ordered data destroys order. A sequential palette on categories implies order that doesn’t exist. And a diverging palette without a meaningful midpoint suggests a false “good vs bad” structure.

So you can think of palette choice as a type check: does the palette type match what the data means?
-->

---

## Match Color to Data Type + Task

<div class="scale-80 origin-top -mt-2">
<D3ConceptDiagram diagram="color-match-tree" />
</div>

<!--
TALK TRACK (≈4–5 min)

This is the decision tree I want you to internalize.

First ask: what kind of variable is this? If it’s categorical, you want distinct hues. If it’s ordered or quantitative, you want a sequential ramp where lightness increases monotonically. If it’s a difference relative to a baseline—current minus previous—you want a diverging palette centered at zero.

Then ask: what is the task? If the task is to compare precisely, you may not need color at all; position could do the job. Color might only be needed to highlight.

Also notice the warnings. Too many categories breaks the usefulness of hue—viewers can’t keep 12 colors in mind, and the legend becomes a scavenger hunt. Nonuniform sequential scales—like rainbow—create artificial boundaries. And diverging palettes with a meaningless midpoint imply a story of positive versus negative that might not be true.

A professional choice is not “this palette looks nice.” A professional choice is “this palette matches the variable type and the task, and it won’t mislead.”
-->

---

## Qualitative Palettes: Practical Rules

<div class="grid grid-cols-2 gap-4 mt-6">
  <div class="card">
    <div class="kicker">How many?</div>
    <div class="text-2xl font-700 mt-1">≤ 6 categories</div>
    <div class="op70 mt-2">Beyond that, use facets, grouping, or interaction.</div>
  </div>
  <div class="card">
    <div class="kicker">How to label?</div>
    <div class="text-2xl font-700 mt-1">Direct labels &gt; legends</div>
    <div class="op70 mt-2">Legends are fine, but don’t make them mandatory.</div>
  </div>
  <div class="card">
    <div class="kicker">How to highlight?</div>
    <div class="text-2xl font-700 mt-1">One accent</div>
    <div class="op70 mt-2">Gray everything else, highlight the point of interest.</div>
  </div>
  <div class="card">
    <div class="kicker">Consistency</div>
    <div class="text-2xl font-700 mt-1">Same color = same meaning</div>
    <div class="op70 mt-2">Across slides, charts, and the whole project.</div>
  </div>
</div>

<!--
TALK TRACK (≈3–4 min)

Here are rules that make your categorical color use look professional.

First: limit the number of categories you encode with color. Six is a good practical ceiling for a static chart. If you need more categories, consider faceting, grouping into “Other,” or adding interaction where viewers can filter.

Second: prefer direct labels when possible. A legend forces the viewer to translate color to category over and over. Direct labels reduce working memory load and reduce errors.

Third: use one accent color for emphasis. Many professional charts are mostly neutral with one highlight. That’s because the goal is not to show off your palette—it’s to guide attention to what matters.

Fourth: consistency. If blue means “Current term” on one slide, it must mean the same thing everywhere. Inconsistent mapping is one of the fastest ways to confuse your audience.

Follow these rules and your charts will immediately feel cleaner and more credible.
-->

---

## A Colorblind-Safer Qualitative Palette (Example)

<div class="grid grid-cols-8 gap-2 mt-8">
  <div class="h-14 rounded-xl border border-white/15" style="background:#0072B2"></div>
  <div class="h-14 rounded-xl border border-white/15" style="background:#56B4E9"></div>
  <div class="h-14 rounded-xl border border-white/15" style="background:#009E73"></div>
  <div class="h-14 rounded-xl border border-white/15" style="background:#E69F00"></div>
  <div class="h-14 rounded-xl border border-white/15" style="background:#D55E00"></div>
  <div class="h-14 rounded-xl border border-white/15" style="background:#CC79A7"></div>
  <div class="h-14 rounded-xl border border-white/15" style="background:#F0E442"></div>
  <div class="h-14 rounded-xl border border-white/15" style="background:#9CA3AF"></div>
</div>

<div class="grid grid-cols-8 gap-2 mt-2 text-xs op70">
  <div class="text-center">Blue</div>
  <div class="text-center">Sky</div>
  <div class="text-center">Green</div>
  <div class="text-center">Orange</div>
  <div class="text-center">Vermillion</div>
  <div class="text-center">Purple</div>
  <div class="text-center">Yellow</div>
  <div class="text-center">Gray</div>
</div>

<div class="callout mt-6">
  <div class="kicker">Use it like this</div>
  <div class="text-lg font-700 mt-2">Pick 4–6 colors + keep one neutral for baseline/context.</div>
</div>

<!--
TALK TRACK (≈4–5 min)

Here’s an example of a palette often recommended for better colorblind accessibility: the Okabe–Ito style set.

Two points: first, no palette is perfect, but sets like this reduce the chance that categories collapse into the same appearance for viewers with common forms of color vision deficiency.

Second, you still need to design responsibly. Don’t use eight bright colors at once just because the palette offers them. Choose only the number of categories you truly need, and keep a neutral color for context.

On a dark theme, yellow can be visually loud, so use it sparingly—often for a highlight, not for a baseline series. Also keep an eye on contrast: some lighter colors can bloom on dark backgrounds, so pair them with thin borders or use them for lines rather than large filled areas.

In your projects, if you establish a small set of “brand” colors and reuse them consistently, your whole deck will look cohesive—like a professional system instead of random color choices per slide.
-->

---

## Sequential Scales (Magnitude: Low → High)

<D3SequentialScale class="mt-6" />

<div class="mt-5 grid grid-cols-2 gap-4">
  <div class="card">
    <div class="kicker">Good scale property</div>
    <div class="text-lg font-700 mt-1">Lightness increases smoothly</div>
    <div class="op70 mt-2">So order is visible even in grayscale.</div>
  </div>
  <div class="card">
    <div class="kicker">Common failure</div>
    <div class="text-lg font-700 mt-1">Hue changes create false boundaries</div>
    <div class="op70 mt-2">Viewers “see” edges that aren’t real.</div>
  </div>
</div>

<!--
TALK TRACK (≈4–5 min)

Sequential scales are for magnitude: low to high.

The key property is that lightness changes smoothly in one direction. This creates an ordered perception—low looks darker, high looks lighter. A good sequential scale remains interpretable even if printed in grayscale, because the order is carried by lightness, not by hue differences.

This matters for heatmaps and choropleth maps. If your scale changes hue dramatically, viewers will perceive boundaries and segments even when the underlying data changes smoothly. That is a perceptual artifact, not a real structure.

So when you choose a sequential palette, prioritize lightness progression and avoid distracting hue changes. In practice, a single-hue ramp—like blue getting lighter—is often safer than a rainbow ramp.

Also remember: sequential scales are less precise than position. Use them when the task is pattern detection and spatial context, not precise comparisons between many cells.
-->

---

## Diverging Scales (Difference Around a Baseline)

<D3DivergingScale class="mt-6" />

<div class="callout mt-6">
  <div class="kicker">Critical requirement</div>
  <div class="text-xl font-700 mt-2">Only use diverging scales when the midpoint is meaningful (0, target, average).</div>
</div>

<!--
TALK TRACK (≈4–5 min)

Diverging scales are for differences around a baseline. Think “current minus previous,” “above or below target,” or “deviation from average.”

The most important design requirement is that the midpoint has meaning. If you pick an arbitrary midpoint, you force a narrative of “negative vs positive” that may not exist. This is a common way dashboards mislead: they use diverging colors because it looks dramatic, not because the data semantics require it.

When used correctly, diverging scales are powerful because they answer two questions at once: direction and magnitude. The viewer can see where values are below baseline and how far below they are.

In professional work, you’ll often pair this with explicit labeling: include a legend with the midpoint labeled “0 (baseline)” and include units. And if the distribution is skewed, consider using asymmetric ranges or a transformed scale, but always explain it.
-->

---

## The Rainbow Trap (Why It Misleads)

<D3RainbowTrap class="mt-5" />

<div class="grid grid-cols-2 gap-4 mt-3">
  <div class="card">
    <div class="kicker">Why it misleads</div>
    <ul class="mt-3 space-y-1 text-sm op80">
      <li>Non‑uniform perception: some hues “pop.”</li>
      <li>False boundaries: hue edges look categorical.</li>
      <li>Not robust: breaks in grayscale and for CVD viewers.</li>
    </ul>
  </div>
  <div class="card">
    <div class="kicker">Do instead</div>
    <div class="text-base font-700 mt-1">Use lightness ramps (and label them)</div>
    <div class="op70 mt-2 text-sm">Sequential for magnitude; diverging only with a meaningful midpoint.</div>
    <div class="op70 mt-2 text-sm">Include units + min/max (+ midpoint for diverging).</div>
  </div>
</div>

<!--
TALK TRACK (≈4–5 min, deep dive)

Let’s talk about the rainbow or “jet” color map. It’s popular because it looks vibrant and dramatic, but it’s one of the most misleading color scales in visualization.

First, perception is non‑uniform. Some hues appear brighter or more salient, so the viewer perceives peaks and valleys that aren’t present in the data. In other words, the color map adds structure that’s not in the measurements.

Second, rainbow scales create false boundaries. When hue changes sharply—like green to yellow—the viewer sees a boundary. But the underlying data may be changing smoothly. This can cause viewers to interpret continuous phenomena as segmented categories.

Third, it’s not robust. Print it in grayscale and you lose the ordering. View it with common color vision deficiencies and some regions collapse into similar tones.

The fix is to choose scales that encode order with lightness—sequential or diverging—so that the ordering remains visible across viewing conditions. This is a professional standard because it reduces the risk of accidental misinterpretation.
-->

---

## Color + Contrast on Dark Backgrounds

<div class="grid grid-cols-4 gap-3 mt-8">
  <div class="h-12 rounded-xl border border-white/10" style="background:#0b0f17"></div>
  <div class="h-12 rounded-xl border border-white/10" style="background:rgba(255,255,255,0.06)"></div>
  <div class="h-12 rounded-xl border border-white/10" style="background:#4da3ff"></div>
  <div class="h-12 rounded-xl border border-white/10" style="background:#eaf2ff"></div>
</div>
<div class="grid grid-cols-4 gap-3 mt-2 text-xs op70">
  <div class="text-center">Background</div>
  <div class="text-center">Surface</div>
  <div class="text-center">Accent</div>
  <div class="text-center">Text</div>
</div>

<div class="grid grid-cols-2 gap-4 mt-6">
  <div class="card">
    <div class="kicker">Contrast for text</div>
    <div class="text-lg font-700 mt-1">Readable labels</div>
    <div class="op70 mt-2">Use off‑white text; increase label size; avoid thin fonts.</div>
  </div>
  <div class="card">
    <div class="kicker">Contrast for marks</div>
    <div class="text-lg font-700 mt-1">Visible data ink</div>
    <div class="op70 mt-2">Thicker strokes; subtle gridlines; keep one strong accent.</div>
  </div>
</div>

<div class="callout mt-6">
  <div class="kicker">Practical checklist</div>
  <div class="text-xl font-700 mt-2">Neutrals + one accent · off‑white text · thicker lines · subtle gridlines</div>
</div>

<!--
TALK TRACK (≈4–5 min)

On dark backgrounds, color and contrast behave differently—so we need simple rules.

First, build with layers: background, surface, text, then one accent. If everything is bright, the slide becomes visually noisy and tiring.

Second, use off‑white text rather than pure white. Pure white creates glare on projectors and can make long reading uncomfortable. Off‑white keeps high contrast while staying softer.

Third, watch thin elements. Thin lines and small labels disappear quickly in dark themes. That’s why professional dark dashboards use slightly thicker strokes and larger label sizes than you might expect.

Fourth, keep gridlines subtle. Gridlines are scaffolding, not the data. If the grid is more visible than the marks, hierarchy is broken.

The goal is legibility and focus: neutrals for structure, a single accent for attention, and enough contrast that the chart survives real-world viewing conditions.
-->

---

## Accessibility: CVD + Redundant Encoding

<div class="grid grid-cols-2 gap-4 mt-6 items-start">
  <div>
<D3ConceptDiagram diagram="accessibility-redundancy" />
  </div>
  <div class="grid gap-4">
  <div class="card">
    <div class="kicker">Do</div>
    <div class="text-lg font-700 mt-1">Design for robustness</div>
    <div class="op70 mt-2">Prefer blue/orange contrasts; use lightness ramps for magnitude; label directly.</div>
  </div>
  <div class="card">
    <div class="kicker">Avoid</div>
    <div class="text-lg font-700 mt-1">Color-only meaning</div>
    <div class="op70 mt-2">Red/green-only signals; unlabeled scales; too many hues; required legend hunting.</div>
  </div>
</div>
</div>

<!--
TALK TRACK (≈4–5 min)

Accessibility doesn’t require a special design style—it requires robust meaning.

Assume some viewers cannot reliably distinguish certain color pairs, especially red/green. If your chart depends on that distinction, it’s fragile.

So the baseline rule is: don’t encode meaning with color alone. Add redundancy: direct labels, different marker shapes, facets, or positional grouping. If someone prints the chart in grayscale or views it on a low-quality projector, the meaning should still survive.

Also make your mapping explicit. Use a labeled legend for sequential or diverging scales, and include “no data” explicitly when needed.

If you build this into your workflow, your charts become more inclusive and more trustworthy—and they’re usually faster to read even for viewers with normal color vision.
-->

---

## Legends Done Right (Small Details, Big Trust)

<div class="grid grid-cols-2 gap-4 mt-6">
  <div class="card">
    <div class="kicker">Good legend</div>
    <div class="text-lg font-700 mt-1">Has units + ordering</div>
    <div class="op70 mt-2">Includes midpoint for diverging scales.</div>
  </div>
  <div class="card">
    <div class="kicker">Bad legend</div>
    <div class="text-lg font-700 mt-1">Forces guesswork</div>
    <div class="op70 mt-2">Unlabeled bins, unclear min/max, missing “no data”.</div>
  </div>
</div>

<D3ConceptDiagram diagram="legend-diverging" class="mt-6" />

<!--
TALK TRACK (≈3–4 min)

Legends are where many charts quietly fail.

A good legend does three things: it tells you what the scale means, it tells you the units, and it tells you the direction and key reference points.

For sequential scales, that means min and max labels are clear. For diverging scales, the midpoint must be labeled—often 0 or baseline. Without that, viewers can’t interpret what “neutral” means.

A bad legend forces guesswork: bins are unlabeled, the range is unclear, and “no data” looks the same as “zero.” That’s not a cosmetic issue—it changes interpretation.

Professional takeaway: treat the legend as part of the visualization, not an afterthought. If you want your chart to be trusted, make the mapping explicit.
-->

---

## Missing Data ≠ Zero (A Common Interpretation Bug)

<D3ConceptDiagram diagram="missing-vs-zero" class="mt-6" />

<!--
TALK TRACK (≈3–4 min)

This is a subtle but important correctness issue: missing data is not the same as zero.

If a region has no measurement, mapping it to the lowest value on your scale is lying—because you’re implying the value is small, not unknown.

So the professional approach is to represent missing data explicitly. Use a separate neutral color, a hatch pattern, or a label like “No data.” Then explain it in the legend.

This matters especially in maps and heatmaps, where empty cells are common. If you don’t handle missingness, viewers will interpret gaps as meaningful lows.

Good visualization is honest about what you know and what you don’t know.
-->

---

## Color for Emphasis (Highlight, Don’t Paint Everything)

<div class="grid grid-cols-2 gap-4 mt-6">
  <div class="card">
    <div class="kicker">Baseline context</div>
    <div class="text-lg font-700 mt-1">Neutral</div>
    <div class="op70 mt-2">Gray or low‑saturation colors.</div>
  </div>
  <div class="card">
    <div class="kicker">Focus</div>
    <div class="text-lg font-700 mt-1">One accent</div>
    <div class="op70 mt-2">Use the accent only where you want attention.</div>
  </div>
</div>

<D3ConceptDiagram diagram="emphasis-highlight" class="mt-6" />

<!--
TALK TRACK (≈3–4 min)

One of the most professional uses of color is emphasis.

Instead of giving every series a unique bright color, you keep most marks neutral, then use one accent color to draw the viewer’s attention to the specific series, program, or time window you want them to notice.

This improves comprehension because it reduces the comparison problem. If everything is colorful, the viewer doesn’t know what matters. If only one thing is colorful, the reading is guided.

This also scales better. If you have many categories, you can still keep the chart readable by highlighting on demand—through interaction—or by highlighting only the top or most relevant items.

So remember: color is not decoration; it’s a spotlight.
-->

---

## When Color Is the Wrong Tool

<div class="grid grid-cols-2 gap-4 mt-6">
  <div class="card">
    <div class="kicker">Too many categories</div>
    <div class="text-lg font-700 mt-1">Use small multiples</div>
    <div class="op70 mt-2">Facets + consistent scales beat 12-color legends.</div>
  </div>
  <div class="card">
    <div class="kicker">Precise comparison</div>
    <div class="text-lg font-700 mt-1">Use position</div>
    <div class="op70 mt-2">Dot plots and aligned bars are more accurate.</div>
  </div>
</div>

<D3ConceptDiagram diagram="need-color" class="mt-6" />

<!--
TALK TRACK (≈3–4 min)

This slide is here to prevent a very common student mistake: using color because it looks good, not because the task needs it.

If you have a few categories and you genuinely need to identify them quickly, color can help.

But if the main task is precise comparison—like ranking programs by pass rate—color is not necessary. Position and ordering do the job better and more accurately.

And if you have many categories—10, 15, 20—color is actively harmful in static charts. The legend becomes unreadable and the viewer can’t compare reliably. In that case, use facets, filtering, grouping, or interaction instead.

Professional design is often about restraint: choosing fewer channels, not more.
-->

---
layout: section
---

<div class="kicker">Part 3 · Chart Reading</div>

# Read charts like a <span class="accent-text">skeptic</span>

Trust the data, but verify the encoding.

<!--
TALK TRACK (≈3–4 min)

Now we move into chart reading—how to evaluate charts made by others, and how to prevent your own charts from becoming misleading.

Being skeptical does not mean assuming bad intent. Most misleading charts happen by accident: wrong defaults, sloppy axes, inappropriate encodings, or misunderstood data types.

Your job as a data visualization student is to notice those issues. If you can do this consistently, you become a better designer because you avoid the same pitfalls.

So we’ll use a checklist approach. The goal is not to memorize a thousand rules; the goal is to have a repeatable audit workflow that catches the most common errors.
-->

---

## An 8-Step Chart Reading Checklist

<D3ConceptDiagram diagram="chart-reading-checklist" class="mt-6" />

<!--
TALK TRACK (≈4–5 min, deep dive)

This checklist is your “chart reading muscle memory.”

Step 1: read the title as a claim. Most charts are trying to say something. Identify the claim before you judge the chart.

Step 2: ask what data is being measured and what is missing. What population is included? What time window? What definitions?

Step 3: check units. Many misleading charts are really “unit mistakes”: counts versus rates, percent versus percentage points, linear versus log scales.

Step 4: axes. Look for truncation, inconsistent scales, and inappropriate baselines.

Step 5: encoding. If the chart uses area or 3D to represent magnitude, be cautious. If color is used for magnitude, check if the scale is sequential and labeled.

Step 6: grouping and aggregation. Averages can hide distribution; aggregating too early can mask subgroup patterns.

Step 7: uncertainty and sample size. Are we looking at stable estimates or noisy small samples?

Step 8: only then decide if the conclusion is supported. This keeps you from being persuaded by aesthetics.
-->

---

## Pitfall: Truncated Axis (Especially for Bars)

<div class="grid grid-cols-2 gap-4 mt-6">
  <div class="card">
    <div class="kicker">Why it misleads</div>
    <div class="text-lg font-700 mt-1">Bars encode length from a baseline</div>
    <div class="op70 mt-2">If the baseline is not zero, the visual difference is inflated.</div>
  </div>
  <div class="card">
    <div class="kicker">When acceptable</div>
    <div class="text-lg font-700 mt-1">Use dots/lines for nonzero baselines</div>
    <div class="op70 mt-2">Or clearly mark axis breaks and explain them.</div>
  </div>
</div>

<div class="scale-95 origin-top -mt-1">
<D3TruncatedAxisDemo class="mt-6" />
</div>

<!--
TALK TRACK (≈4–5 min, deep dive)

Truncated axes are one of the most common ways charts mislead, especially bar charts.

Bars encode magnitude as length from a baseline. If the baseline is not zero, the perceived difference is inflated. Two bars that differ slightly can look dramatically different if you zoom the y-axis.

Now, there are legitimate reasons to zoom an axis—like showing small changes in temperature or rates—but if you zoom, you should use a chart type that does not rely on a zero baseline for meaning. Dot plots and line charts can show small differences without implying “length from zero.”

If you must use bars with a nonzero baseline, you need to clearly mark the truncation, use annotations, and be explicit about the scale. But in most cases, the professional fix is: switch to dots or lines and keep comparisons honest.

As a chart reader, your habit should be: check the axis minimum. If it’s not zero and the chart uses bars, treat the visual impression with caution.
-->

---

## Pitfall: Dual Y‑Axes (Two Stories in One Chart)

<D3DualAxisDemo class="mt-6" />

<!--
TALK TRACK (≈3–4 min)

Dual y‑axes are controversial because they can easily manufacture a story.

When you put two variables with different units on two axes, the visual alignment depends on how you scale the axes. You can make two lines look correlated or uncorrelated by adjusting ranges. That makes the chart fragile and easy to misuse.

Sometimes dual axes are used in dashboards because they “save space,” but space savings is not worth interpretability loss.

Professional alternatives are straightforward: use separate panels with aligned time axes, or normalize variables to comparable units and use one axis. If you truly need to compare two variables, make the relationship explicit with a scatter plot or correlation analysis, not a visually ambiguous dual-axis line chart.

As a reader: when you see dual axes, treat any implied relationship with skepticism and look for the underlying data or a clearer view.
-->

---

## Pitfall: 3D and Perspective

<div class="callout mt-6">
  <div class="kicker">Perception problem</div>
  <div class="text-xl font-700 mt-2">3D turns accurate length comparisons into ambiguous area comparisons.</div>
</div>

<div class="grid grid-cols-2 gap-4 mt-6">
  <div class="card">
    <div class="kicker">What 3D adds</div>
    <div class="text-lg font-700 mt-1">Decoration, not information</div>
    <div class="op70 mt-2">It makes the reading harder, not better.</div>
  </div>
  <div class="card">
    <div class="kicker">Professional fix</div>
    <div class="text-lg font-700 mt-1">Use 2D with labels</div>
    <div class="op70 mt-2">Add annotation if you need emphasis.</div>
  </div>
</div>

<!--
TALK TRACK (≈3–4 min)

3D charts are a perception trap. They look “fancy,” but they reduce accuracy.

In 2D, a bar’s length is easy to compare. In 3D, the bar becomes a volume with perspective distortion. Now you’re comparing perceived area and depth cues, which are not precise and depend on viewpoint.

3D also hides data. Bars in the back are occluded. Labels become harder to place. And when values are similar, perspective makes some bars appear larger than they are.

The professional fix is almost always: remove 3D. If you want emphasis, use annotation, color highlight, or a clean layout. Clarity beats decoration in professional visualization.

As a reader, treat 3D charts as a sign you should double-check the numbers because your perception is being manipulated by perspective.
-->

---

## Pitfall: Area Encodings (Bubbles, Pies, Stacked Areas)

<D3AreaEncodingDemo class="mt-6" />

<div class="callout mt-6">
  <div class="kicker">Design guidance</div>
  <div class="text-xl font-700 mt-2">If comparison matters, avoid area‑only charts. Use aligned position instead.</div>
</div>

<!--
TALK TRACK (≈4–5 min, deep dive)

Area encodings are popular because they look engaging: bubble charts, pie charts, stacked areas. But perception research consistently shows area is a weak channel for precise comparison.

If your task is “which category is largest?” you might get away with area. But if the task is “how much larger?” or “rank these accurately,” area introduces error.

This is why pie charts are criticized: they rely on angle and area comparison, which humans do poorly, especially when slices are similar.

Stacked area charts have an additional problem: only the bottom series has a consistent baseline. Upper series float, making comparisons across time and across categories very difficult.

So the professional approach is to reserve area for cases where precise comparison is not the goal—like showing approximate composition with strong differences. Otherwise, use bars or dots with aligned baselines.
-->

---

## Pitfall: “Average” Hides Distribution

<D3ConceptDiagram diagram="average-distribution" class="mt-6" />

<div class="grid grid-cols-2 gap-4 mt-6">
  <div class="card">
    <div class="kicker">Reader move</div>
    <div class="text-lg font-700 mt-1">Ask: what is the distribution?</div>
    <div class="op70 mt-2">Outliers? bimodal? wide variance?</div>
  </div>
  <div class="card">
    <div class="kicker">Designer move</div>
    <div class="text-lg font-700 mt-1">Show uncertainty or spread</div>
    <div class="op70 mt-2">Box plots, intervals, or small multiples.</div>
  </div>
</div>

<!--
TALK TRACK (≈3–4 min)

Averages are seductive because they simplify. But averages can hide the distribution, and that can change decisions.

Two programs can have the same average score, but one program might have consistent performance and the other might have extreme inequality: some students doing very well and others failing badly. If your intervention is to help struggling students, those two cases require different actions.

As a reader, when you see an average, ask: what is the spread? how many observations? are there outliers? Is the distribution skewed or bimodal?

As a designer, you can add distribution with box plots, dot plots, or uncertainty intervals. Even simply adding sample size or showing min/max can prevent misinterpretation.

Professional visualization often means balancing simplicity with honesty about variability.
-->

---

## Pitfall: Counts vs Rates (Normalization Errors)

<D3ConceptDiagram diagram="counts-vs-rates" class="mt-6" />

<!--
TALK TRACK (≈3–4 min)

This is one of the most common data visualization correctness errors: comparing counts when you need rates.

If one program has 300 students and another has 30, the program with 300 will usually have more of everything—more passes, more fails, more events—simply because it is larger. Counts answer “how many,” not “how common.”

If the task is to compare performance or prevalence, you need rates: pass rate, failure rate, incidents per student, per 1,000 people, etc.

Also, show the denominator. Rates can become unstable for small sample sizes. If you show a rate without n, the reader can’t judge reliability.

As a reader, if a chart compares groups and you don’t see normalization, ask whether the conclusion would change if you used rates. This is a key chart literacy skill.
-->

---

## Pitfall: Binning and Scale Choices (Histograms, Heatmaps)

<div class="grid grid-cols-2 gap-4 mt-6">
  <div class="card">
    <div class="kicker">Binning choice</div>
    <div class="text-lg font-700 mt-1">Controls what patterns appear</div>
    <div class="op70 mt-2">Too few bins hide structure; too many bins add noise.</div>
  </div>
  <div class="card">
    <div class="kicker">Scale choice</div>
    <div class="text-lg font-700 mt-1">Controls contrast</div>
    <div class="op70 mt-2">Linear vs log can change perceived differences.</div>
  </div>
</div>

<D3ConceptDiagram diagram="bins-scales" class="mt-6" />

<!--
TALK TRACK (≈3–4 min)

Binning and scale choices can make the same dataset look like different stories.

In histograms, the number of bins controls resolution. Too few bins smooth everything and hide multimodality. Too many bins make random noise look like structure. There isn’t one “correct” bin count; the choice should be guided by the task and the sample size.

Scale choices do something similar. If values span multiple orders of magnitude, a log scale can reveal structure. But log scales also change interpretation and can confuse audiences if not labeled clearly.

So as a reader, always check bins and scales. As a designer, justify them. A professional chart either uses sensible defaults or explains why a non-default scale is needed.

When you see dramatic patterns, ask: are they data-driven, or a product of binning and scaling?
-->

---

## Pitfall: Smoothing (It Can Hide or Invent Changes)

<D3ConceptDiagram diagram="smoothing" class="mt-6" />

<!--
TALK TRACK (≈3–4 min)

Smoothing is useful, but it’s easy to misuse.

Moving averages reduce noise, which can help reveal long-term trends. But smoothing can also hide spikes that matter—like sudden drops in performance—and it can shift timing, making changes appear earlier or later than they occurred.

Large smoothing windows can even invent trends: the smoothed line becomes a function of the window more than the data.

So the professional rule is: if you smooth, show the raw data faintly behind the smoothed line, and label the smoothing method and window size. That way the viewer can judge whether the smoothing is revealing structure or hiding reality.

As a chart reader, treat a smoothed line as a model, not a measurement. Ask what window was used and what details might be hidden.
-->

---

## Pitfall: Uncertainty Missing (False Precision)

<div class="callout mt-6">
  <div class="kicker">Reader mindset</div>
  <div class="text-xl font-700 mt-2">If you see a single line, ask: how variable is it?</div>
</div>

<div class="grid grid-cols-2 gap-4 mt-6">
  <div class="card">
    <div class="kicker">Add uncertainty</div>
    <div class="text-lg font-700 mt-1">Intervals or distributions</div>
    <div class="op70 mt-2">Error bars, bands, dot plots, or box plots.</div>
  </div>
  <div class="card">
    <div class="kicker">At minimum</div>
    <div class="text-lg font-700 mt-1">Show sample size</div>
    <div class="op70 mt-2">So viewers can judge stability.</div>
  </div>
</div>

<!--
TALK TRACK (≈3–4 min)

Charts often look more certain than the underlying data.

If you plot a single average line without any uncertainty, viewers tend to assume the trend is stable and precise. But many datasets are noisy, especially when sample sizes are small or when measurements vary widely.

Professionally, you add uncertainty when it matters: confidence intervals, error bands, or distribution plots. If full uncertainty is not feasible, at least show sample size. That helps viewers interpret whether an observed change might be real or just noise.

As a reader, it’s good practice to ask: how many observations are behind this point? Are there error bars? If not, is the chart making a claim that requires uncertainty to be credible?

Uncertainty is not a weakness—it’s honesty.
-->

---

## Pitfall: Cherry‑Picked Time Windows

<D3ConceptDiagram diagram="cherry-picked-windows" class="mt-6" />

<!--
TALK TRACK (≈3–4 min)

Time is a powerful storytelling dimension, and that’s why it’s easy to misuse.

If you choose a short window where values happen to be rising or falling, you can make a dramatic story—even if the long-term trend is stable.

Professional reading means asking: what time window is shown, and why? Is there missing context? Is the start date chosen to exaggerate change?

Professional design means showing enough context or offering multiple windows. If you zoom in, explain why—maybe a policy changed at a particular week, or an event happened.

The point is not that zooming is wrong; it’s that zooming without context can mislead. So as a reader, look for context. As a designer, provide it.
-->

---

## Pitfall: Choropleths of Counts (Map Misuse)

<D3ConceptDiagram diagram="choropleth-counts" class="mt-6" />

<!--
TALK TRACK (≈3–4 min)

Maps are persuasive, which makes them dangerous when misused.

A classic mistake is using a choropleth map to show raw counts. Large or populous regions will naturally have higher counts, so the map often becomes a proxy for population size rather than the phenomenon you care about.

The professional fix is to normalize: use rates per population, per area, or per relevant denominator. Then show that denominator somewhere—either as a secondary chart or in the tooltip/annotation—so the reader understands reliability.

Also ask: is a map even necessary? If location is not part of the reasoning, a bar chart may be clearer and more accurate.

As a reader, when you see a choropleth, immediately check: is it counts or rates?
-->

---

## Pitfall: Inconsistent Scales Across Panels

<D3ConceptDiagram diagram="inconsistent-scales" class="mt-6" />

<!--
TALK TRACK (≈3–4 min)

Small multiples are a professional technique, but they come with a common pitfall: inconsistent scales.

If each panel uses a different y-axis range, patterns can look similar even when magnitudes differ dramatically. This makes side-by-side comparison invalid.

So when the task is comparison across groups, share axes. If you choose not to share axes because ranges are extremely different, you must label that clearly and ideally provide a reference—like a shared baseline line or a summary statistic.

As a reader, check whether axes are shared. If not, you should not compare slopes and heights across panels the way you normally would.

Consistency is what makes faceting powerful; without it, faceting can become misleading.
-->

---

## Pitfall: Category Order and Sorting

<div class="grid grid-cols-2 gap-4 mt-6">
  <div class="card">
    <div class="kicker">Unsorted categories</div>
    <div class="text-lg font-700 mt-1">Hide ranking patterns</div>
    <div class="op70 mt-2">Readers waste time scanning.</div>
  </div>
  <div class="card">
    <div class="kicker">Sorted categories</div>
    <div class="text-lg font-700 mt-1">Make comparisons effortless</div>
    <div class="op70 mt-2">Sort by value, by meaningful order, or by grouping.</div>
  </div>
</div>

<D3ConceptDiagram diagram="category-order" class="mt-6" />

<!--
TALK TRACK (≈3–4 min)

Ordering is one of the easiest upgrades you can make to a chart.

If categories are unsorted, readers have to hunt. They scan back and forth trying to find the largest or smallest values. This increases time and increases mistakes.

If you sort categories by value, ranking becomes immediate. If there’s a meaningful domain order—like days of the week—use that. If there are groups, group first and then sort within group.

As a reader, if the chart’s task is comparison or ranking and the categories are not ordered, that is a design flaw. The chart is making the viewer do extra work.

Professional charts use ordering to make tasks easy.
-->

---

## Pitfall: Color Implies Meaning You Didn’t Intend

<div class="callout mt-6">
  <div class="kicker">Common failure</div>
  <div class="text-xl font-700 mt-2">Sequential color on categories implies order.</div>
</div>

<div class="grid grid-cols-2 gap-4 mt-6">
  <div class="card">
    <div class="kicker">Reader check</div>
    <div class="text-lg font-700 mt-1">Is the color scale labeled?</div>
    <div class="op70 mt-2">If not, don’t assume magnitude.</div>
  </div>
  <div class="card">
    <div class="kicker">Designer fix</div>
    <div class="text-lg font-700 mt-1">Use qualitative hues for categories</div>
    <div class="op70 mt-2">Reserve sequential/diverging for ordered measures.</div>
  </div>
</div>

<!--
TALK TRACK (≈3–4 min)

Color carries meaning automatically. This is why it’s easy to create semantic mistakes.

If you apply a sequential color ramp to categories—like program names—you imply an order that doesn’t exist. Viewers will interpret darker as “more” or “better,” even if the variable is purely nominal.

As a reader, check whether the color scale is labeled. If you see colors but no legend, be cautious about what the colors are supposed to mean.

As a designer, match palette type to data type. If it’s categories, use distinct hues. If it’s magnitude, use a sequential ramp with labeled values. If it’s deviation, use a diverging scale centered at a meaningful midpoint.

This slide is a reminder: color isn’t neutral. It tells a story whether you want it to or not.
-->

---
layout: section
---

<div class="kicker">Part 4 · Practice</div>

# Audit, then redesign

Build trust by catching problems early.

<!--
TALK TRACK (≈3–4 min)

Now we move from concepts into a workflow you can actually use.

In professional settings, you rarely build a chart perfectly on the first try. You draft, you test it against the tasks, and you revise. Chart reading skills help you revise your own work—because you can spot the same pitfalls before your audience does.

So we’ll do two things: first, a quick audit checklist you can use on any chart; second, a critique drill where you identify problems and propose fixes.

Think of this as training your “visualization QA”—quality assurance.
-->

---

## A Fast Audit Checklist (Before You Trust a Chart)

<div class="grid grid-cols-2 gap-4 mt-6">
  <div class="card">
    <div class="kicker">Claim</div>
    <div class="text-lg font-700 mt-1">What is this chart trying to prove?</div>
    <div class="op70 mt-2">Is the claim specific and verifiable?</div>
  </div>
  <div class="card">
    <div class="kicker">Data</div>
    <div class="text-lg font-700 mt-1">What is included/excluded?</div>
    <div class="op70 mt-2">Any missing values, filtering, or transformations?</div>
  </div>
  <div class="card">
    <div class="kicker">Encoding</div>
    <div class="text-lg font-700 mt-1">Are channels appropriate?</div>
    <div class="op70 mt-2">Position vs area; color type matches data type.</div>
  </div>
  <div class="card">
    <div class="kicker">Scale</div>
    <div class="text-lg font-700 mt-1">Baselines + axes correct?</div>
    <div class="op70 mt-2">Truncation, log scales, inconsistent panels.</div>
  </div>
  <div class="card col-span-2">
    <div class="kicker">Uncertainty</div>
    <div class="text-lg font-700 mt-1">Could noise or sample size change the story?</div>
    <div class="op70 mt-2">Look for n, intervals, or distributions.</div>
  </div>
</div>

<!--
TALK TRACK (≈3–4 min)

This is your quick audit checklist. You can apply it to a chart in the news, in a research paper, or in your own project drafts.

First, identify the claim. If the claim is vague—“things are better”—the chart is already suspicious. Good charts support specific claims.

Second, check the data. What is included and excluded? What transformations were applied? If you don’t know, the chart may be hiding important context.

Third, check the encoding. Are the channels appropriate? Are bars being used correctly? Is color being used in a way that matches the data type?

Fourth, check scales and baselines. This catches truncation, dual axes, and inconsistent panels.

Finally, check uncertainty. Many charts look precise but are based on small or noisy samples. If the chart supports an important decision, uncertainty matters.

If you train yourself to do this, you’ll avoid being misled and you’ll also produce better charts.
-->

---

## Critique Drill (In Groups)

<div class="callout mt-6">
  <div class="kicker">Activity</div>
  <div class="text-2xl font-700 mt-2">Find 3 problems and propose 3 fixes.</div>
</div>

<v-clicks>

- Identify the *claim* the chart is making (1 sentence).
- List 3 potential issues (axes, color, encoding, aggregation, missingness).
- Propose 3 fixes (chart type, scale, palette, labels, transforms).
- Decide whether the original claim still holds after your fixes.

</v-clicks>

<!--
TALK TRACK (≈3–4 min)

Here’s the critique drill.

First, write the claim in one sentence. This forces you to be explicit about what the chart is trying to convince you of.

Second, list three issues. Use the checklist: axes and baselines, encoding choice, color scale type, aggregation level, missing data handling, and whether uncertainty is shown.

Third, propose three fixes. A fix can be changing chart type, changing scale, changing the color mapping, adding direct labels, showing denominators, or showing a distribution instead of only an average.

Finally, decide whether the claim still holds after you fix the design. This is key: sometimes the chart is misleading but the underlying claim is still true; other times the chart’s flaws are hiding that the claim is weak.

This exercise trains you to be critical without being cynical: you’re not just criticizing—you’re improving.
-->

---

## “Spot the Pitfall” (Quick Check)

<div class="grid grid-cols-2 gap-4 mt-6">
  <div class="card">
    <div class="kicker">Scenario</div>
    <div class="text-lg font-700 mt-1">A bar chart shows a tiny change as a huge jump.</div>
    <div class="op70 mt-2">What do you check first?</div>
  </div>
  <div class="card">
    <div class="kicker">Scenario</div>
    <div class="text-lg font-700 mt-1">A heatmap looks like it has “bands.”</div>
    <div class="op70 mt-2">What do you check first?</div>
  </div>
</div>

<v-clicks>

- Bar chart: check the y‑axis minimum and baseline.
- Heatmap: check the color scale type (sequential? labeled?) and whether it’s uniform in lightness.
- Both: check if the claim matches the data + transformations.

</v-clicks>

<!--
TALK TRACK (≈3–4 min)

Let’s do a fast “spot the pitfall” exercise to build instincts.

If a bar chart shows a tiny change as a huge jump, your first move is to check the y‑axis minimum. If the axis is truncated, the visual impression is inflated. Then you ask: why use bars here? Would a dot plot show the change honestly?

If a heatmap looks like it has bands, your first move is to check the color scale. Is it a rainbow scale? Is the scale uniform in lightness? Are the bins labeled? Often the “bands” are a palette artifact rather than a real threshold in the data.

In both cases, the bigger skill is to connect design back to data. What transformations were applied? Are we looking at counts or rates? Are we looking at smoothed values? Those choices strongly affect perception.

This is the kind of quick reasoning I want you to develop: check the most common failure points first.
-->

---

## Build a Simple Color System for Your Project

<D3ConceptDiagram diagram="color-system" class="mt-6" />

<div class="callout mt-6">
  <div class="kicker">Outcome</div>
  <div class="text-xl font-700 mt-2">Your charts look cohesive because your colors are consistent.</div>
</div>

<!--
TALK TRACK (≈3–4 min)

If you want your work to look like a professional system instead of a collection of random charts, build a simple color system.

Start with neutrals: define your background, your panel surface, and your text. These should be consistent across the whole deck.

Then define category colors—only as many as you need, ideally 4 to 6. Reuse them consistently so viewers learn the mapping.

Then define one highlight color. This is your “spotlight” used for emphasis.

Optionally, define status colors like warning or critical—useful in dashboards. But be careful: status colors carry strong semantics and must be accessible.

This approach is what makes professional visualizations feel coherent: not fancy gradients, but consistent, intentional choices that support perception and comprehension.
-->

---

## Wrap-up + Practice

<div class="grid grid-cols-2 gap-4 mt-5">
  <div class="card">
    <div class="kicker">Takeaways</div>
    <ul class="mt-3 space-y-1">
      <li>Use <strong>position/length</strong> for accurate comparisons; avoid area for precision tasks.</li>
      <li>Use <strong>hue</strong> for categories, <strong>lightness</strong> for magnitude, <strong>diverging</strong> for baseline differences.</li>
      <li>Design accessibly: <strong>contrast + redundancy + labeled scales</strong>.</li>
      <li>Read charts with a checklist: claim → data → units → axes → encoding → aggregation → uncertainty.</li>
    </ul>
    <div class="mt-4 op70 text-sm"><strong>Ethics:</strong> Be persuasive by being clear — not by manipulating perception.</div>
  </div>
  <div class="card">
    <div class="kicker">What to practice</div>
    <ul class="mt-3 space-y-1">
      <li>Critique one real chart (write the claim + 3 issues + 3 fixes).</li>
      <li>Redesign one misleading choice (axis, encoding, palette, aggregation).</li>
      <li>Apply accessibility basics (contrast, direct labels, “no data” handling).</li>
      <li>Reuse a consistent palette system across your project.</li>
    </ul>
  </div>
</div>

<!--
TALK TRACK (≈4–5 min)

Let’s wrap up by connecting the full story and turning it into practice.

Perception comes first. If the channel doesn’t match what humans compare well, the chart can mislead even when the data is correct. So default to position and length for comparisons, and be cautious with area and 3D.

Color is powerful when used correctly. Hue is for categories and grouping; lightness is for magnitude; diverging scales are for deviations around meaningful baselines. Always label the mapping and keep it consistent.

Accessibility is part of correctness. Contrast and redundancy make charts readable under real conditions: projectors, grayscale printing, and different viewers. Direct labels and clear legends reduce errors and speed up reading.

Chart literacy is your safety net. When you read charts, don’t be persuaded by aesthetics. Use the checklist: identify the claim, check data and units, inspect axes and baselines, then evaluate encoding and aggregation, and finally ask about uncertainty.

For this week’s work, I want you to critique one chart from the wild and redesign at least one misleading choice. And remember the ethical line: you can be persuasive by making what’s true easier to see, but you should never manipulate perception to manufacture a conclusion.
-->

---

## References (Recommended)

<div class="grid grid-cols-2 gap-4 mt-6">
  <div class="card">
    <div class="text-lg font-700">Ware, C. (2012)</div>
    <div class="op70 mt-1">Information Visualization: Perception for Design (3rd ed.)</div>
    <div class="mt-2 text-sm"><a href="https://www.elsevier.com/books/information-visualization/ware/978-0-12-381464-7" target="_blank">Publisher page</a></div>
  </div>
  <div class="card">
    <div class="text-lg font-700">Cleveland, W. S., & McGill, R. (1984)</div>
    <div class="op70 mt-1">Graphical perception: Theory, experimentation, and application</div>
    <div class="mt-2 text-sm"><a href="https://doi.org/10.1080/01621459.1984.10478080" target="_blank">https://doi.org/10.1080/01621459.1984.10478080</a></div>
  </div>
  <div class="card">
    <div class="text-lg font-700">Munzner, T. (2014)</div>
    <div class="op70 mt-1">Visualization Analysis & Design</div>
    <div class="mt-2 text-sm"><a href="https://www.cs.ubc.ca/~tmm/vadbook/" target="_blank">Author page</a></div>
  </div>
  <div class="card">
    <div class="text-lg font-700">Okabe, M., & Ito, K. (2002)</div>
    <div class="op70 mt-1">Color Universal Design (palette guidance)</div>
    <div class="mt-2 text-sm"><a href="https://jfly.uni-koeln.de/color/" target="_blank">https://jfly.uni-koeln.de/color/</a></div>
  </div>
</div>

<!--
TALK TRACK (≈3 min)

If you want to go deeper, these references are solid.

Ware’s book is a classic because it connects perception research to practical visualization design. It explains why some charts “work” and others fail.

Cleveland and McGill is foundational research on graphical perception—why position is better than area, and why certain encodings are more accurate.

Munzner’s book connects these ideas to a full visualization design workflow—how you go from tasks and data to defensible design decisions.

And for color, the Okabe and Ito resource is a practical guide for more color-universal palettes. Remember, no palette is magic; the goal is to design responsibly with redundancy and clear labels.

Use these as references for your projects and for building your own design principles over time.
-->
