# DATA101 Comprehensive Long Quiz (50 points)

## Scope
This quiz is a full-course assessment covering all course themes covered in this section.

Questions are mixed-format and intentionally hard. All questions are directly derived from the taught slide material, and **answer keys are embedded directly after each question in bold** for Canvas import use.

### 1) MCQ (2 pts)
You receive the request: "Show if faculty performance dropped after policy change and identify who was helped." Which should be the first action before any chart is selected?

- A) Ask if the audience prefers a donut chart and then scale bars to that aspect ratio.
- B) Convert the request into explicit tasks and data requirements (output, action, constraints, audience).
- C) Normalize all metrics first and then choose a comparison template.
- D) Select a network view in case performance relationships need to be inferred.

**Answer: B.**

### 2) Matching (1 pt)
Match each statement to the abstraction error it most directly warns against.

- 1) "A line chart of attendance and satisfaction is shown without stating that one is per-capita and the other is raw count."
- 2) "A dashboard chooses a small-multiples layout for only 5 unique categories."
- 3) "A pie chart is proposed first, then variables are forced into three mutually exclusive slices."

Errors:
- A) Baseline mismatch and untracked granularity.
- B) Overengineering first-pass layout without task evidence.
- C) Chart-first trap.

**Answer: 1→A, 2→B, 3→C.**

### 3) Multiple answers (2 pts)
Select all valid reasons to choose a dataset re-shape (tidy vs wide) before visualization.

- A) A single task asks for comparisons across regions and dates.
- B) A distribution task includes outliers that must be grouped by cohort and period.
- C) A dashboard will only show one value card and no interactions.
- D) A spatial overlay will join regions from different source systems.
- E) A line chart is requested and data are stored already in one JSON blob per entity.

**Answer: A, B, D.**

### 4) Ranking (2 pts)
Rank the best first three steps for a high-stakes comparison question from most important (1) to least important (4):
- A) Choose chart type.
- B) Write the task statement (action, target, constraints, output).
- C) Resolve attribute scales (units, rate vs count, missingness, temporal unit).
- D) Choose color palette.

**Answer: 1) B, 2) C, 3) A, 4) D.**

### 5) Short answer (2 pts)
Rewrite this vague request into a defensible task statement template: "Compare city performance and detect anomalies in monthly support fulfillment."

**Answer: Action: compare monthly fulfillment across cities and detect outlier months for intervention; Target: support-fulfillment records by city and month; Constraints: fixed baseline period, same denominator and missing-month treatment; Output: ranked city-month anomaly list with trend view and uncertainty.**

### 6) MCQ (2 pts)
Which mapping is least appropriate for precise magnitude comparison?

- A) Position on a shared baseline
- B) Length along aligned axes
- C) Hue hue-shading differences
- D) Ordered bar endpoints

**Answer: C.**

### 7) Multiple answers (2 pts)
Choose all that are valid responses to the chart-reading rule “if attention is limited, reduce cognitive load.”

- A) Keep one strong visual hierarchy and limit color categories in first view.
- B) Add dual-axis to expose hidden patterns in one panel.
- C) Use direct labels where possible instead of dense legend hunting.
- D) Add six new decorative icons for storytelling emphasis.
- E) Group related marks with proximity and shared space.

**Answer: A, C, E.**

### 8) MCQ (2 pts)
A chart displays a diverging political preference with a meaningful midpoint near zero. Which palette type is correct?

- A) Qualitative palette.
- B) Sequential low-to-high palette.
- C) Diverging palette anchored at midpoint.
- D) Binary red/green pair for all classes.

**Answer: C.**

### 9) Ranking (1 pt)
Order the perceptual pitfalls from highest to lowest impact on trust in a report:
1) Truncated y-axis, 2) inconsistent unit labels, 3) rainbow color ramp, 4) tiny legend.

**Answer:** 1) inconsistent unit labels, 2) truncated y-axis, 3) rainbow color ramp, 4) tiny legend.

### 10) Short answer (1 pt)
List one reliability check for color interpretation in a map/chart report.

**Answer: Ensure color semantics are consistent with variable meaning and provide redundant cues (pattern/labels/annotation) rather than relying on hue alone, plus CVD-safe contrast checks.**

### 11) MCQ (2 pts)
You have 6 groups across 24 months with irregular missing dates and campaign interventions. The question is who improved most and who regressed fastest. Best approach?

- A) Single multi-line with all series and arbitrary interpolation.
- B) Slope or indexed mini-trend comparison after harmonized time grid and normalization.
- C) Two pie charts: before and after.
- D) Boxplot per month and ignore campaign dates.

**Answer: B.**

### 12) Multiple answers (2 pts)
For distribution comparison across groups, select all valid methods.

- A) Match binning strategy across groups before first-pass visual claims.
- B) Use median-only charts when tails are central to interpretation.
- C) Report n and scale choices in interpretation notes.
- D) Prefer violin over histogram by default for small n.
- E) Use log or Box-Cox transforms when skew is severe and interpretation remains documented.

**Answer: A, C, E.**

### 13) Matching (1 pt)
Match each goal to the first table-based view choice.

- 1) Detect group medians and trend shifts over time.
- 2) Detect heavy-tailed spread shifts.
- 3) Detect rank changes only for top 5 entities.

- i) Small multiples + trend/quantile panel.
- ii) Distribution glyph (violin/box with CI or whiskers).
- iii) Focused slope/ranker chart after top-k filtering.

**Answer: 1→i, 2→ii, 3→iii.**

### 14) Short answer (2 pts)
A stakeholder asks for "fastest changing cohorts" using a dataset with huge within-group variance. What single preprocessing guard should precede your chart choice?

**Answer: Stabilize sampling intervals and align all observations to an explicit time basis (or explicitly model irregular intervals) so slope/rank calculations are comparable across cohorts.**

### 15) Ranking (1 pt)
Rank these tasks by the degree of information loss if forced into a single chart from most to least harmful:
- A) Compare two cohorts’ medians by month.
- B) Show outlier bursts for each cohort.
- C) Compare within-cohort variance and spread change.
- D) Identify the fastest-growing and fastest-declining entities.

**Answer: 1) C, 2) B, 3) D, 4) A.**

### 16) MCQ (2 pts)
An ops room needs shared state and role-specific views. Best first-pass composition?

- A) Duplicate full dashboard for each role.
- B) Keep only one global chart with all controls open.
- C) Overview strip + diagnostic modules + action lane, with progressive disclosure.
- D) Separate pages and no shared interactions.

**Answer: C.**

### 17) Multiple answers (1 pt)
Which changes reduce dashboard ambiguity?

- A) Centralized scale registry for metric semantics.
- B) One state store shared across coordinated views.
- C) Hide infrequent actions under advanced controls.
- D) Separate unrelated filters per view by default.
- E) Reuse a single tooltip format across every module.

**Answer: A, B, C, E.**

### 18) Matching (1 pt)
Match each pattern to intended outcome.

- 1) Overview then decision lanes.
- 2) Hide/show controls by intent.
- 3) Operative cockpit with synchronized interactions.

- i) reduce cognitive split between context and action.
- ii) preserve shared analytical continuity.
- iii) reduce visual noise and protect first load speed.

**Answer: 1→i, 2→iii, 3→ii.**

### 19) Short answer (2 pts)
A dashboard has 5 KPIs, 4 actions, and 8 filters but users complain about fatigue. Specify default visibility versus hidden controls.

**Answer: Keep high-signal KPIs + current state/time horizon visible; expose secondary filters/actions in drawers and reveal deeper diagnostics only after user intent or drill state so working set remains small by default.**

### 20) MCQ (1 pt)
You need community structure + bridge detection on 25k sparse nodes for executives. Best pairing?

- A) Node-link only, no edge weight.
- B) Matrix only, no ordering.
- C) Hybrid node-link overview + matrix for dense clusters.
- D) Treemap of degree counts only.

**Answer: C.**

### 21) Multiple answers (1 pt)
Select all valid reasons to add a matrix view alongside node-link.

- A) Dense/near-complete regions create entangled edge crossings.
- B) Need to inspect block structure and co-membership.
- C) Need intuitive path tracing at first pass for stakeholders.
- D) Need to inspect asymmetry and edge direction.
- E) Need to keep node labels always visible without hover.

**Answer: A, B.**

### 22) Short answer (2 pts)
For directed-signed graphs, which fields are required and how should polarity and strength be separated in encoding?

**Answer: Use source, target, weight, and sign/polarity (plus optional time/type fields); encode polarity with hue/arrow orientation and strength via line width/opacity/brightness so channels do not collapse sign and magnitude.**

### 23) Matching (1 pt)
Match task and graph layout.

- 1) Report allocation share by branch.
- 2) Highlight bridge nodes and cut-edges.
- 3) Inspect dense community blocks quickly.

- A) Node-link primary + matrix secondary.
- B) Treemap primary + node-link secondary.
- C) Matrix primary + node-link secondary.

**Answer: 1→B, 2→A, 3→C.**

### 24) Ranking (1 pt)
Order interaction priorities for a live graph brief from highest to lowest: 1) Community toggle, 2) Degree filter slider, 3) Link strength legend, 4) Animated force transition.

**Answer: 1) Degree filter slider, 2) Community toggle, 3) Link strength legend, 4) Animated force transition.**

### 25) MCQ (1 pt)
You compare incidence in uneven counties with many low-population areas. Best baseline choice?

- A) Raw counts in choropleth classes.
- B) Per-capita rates with explicit normalization and binning rationale.
- C) Bubble map only.
- D) Equal-area projection with no distance claims.

**Answer: B.**

### 26) Multiple answers (2 pts)
Which are high-risk pitfalls in spatial interpretation?

- A) MAUP from boundary changes.
- B) Ecological inference.
- C) Ignoring symbol overlap scaling in overlays.
- D) Using CVD-safe colors only.
- E) Ignoring projection distortion when discussing distance.

**Answer: A, B, C, E.**

### 27) Short answer (2 pts)
You publish a choropleth plus symbol map on the same indicator. State one essential pre-publish validation.

**Answer: Verify denominators/time frame and scale semantics are aligned so color classes and symbol magnitudes map the same underlying quantity and do not imply contradictory ordering.**

### 28) MCQ (2 pts)
For publication-quality vector slides and precise labels in a PDF workflow, which default output is usually strongest?

- A) PNG only.
- B) GIF animations.
- C) SVG exports from charts that support it.
- D) Screenshot-only outputs.

**Answer: C.**

### 29) Multiple answers (1 pt)
Select all that are valid reasons to prefer HTML over raster outputs.

- A) Need built-in hover tooltips and interaction.
- B) Need lightweight, fully static printing at 300 DPI.
- C) Need lightweight sharing in a browser and scriptable interactions.
- D) Team has inconsistent browsers and no JS support.
- E) Need crisp scaling of text and paths in web reports.

**Answer: A, C, E.**

### 30) Matching (1 pt)
Match the phrase to its primary implication.

- 1) "Inputs → function → outputs" in app design.
- 2) "Good defaults" in interactive charts.
- 3) "Visible state reset".

- i) Core callback architecture.
- ii) Interaction should work before hovering.
- iii) Undoable state prevents misinterpretation.

**Answer: 1→i, 2→ii, 3→iii.**

### 31) MCQ (1 pt)
A chart interaction works only on hover and fails when captured for review. What is the most defensible redesign?

- A) Keep hover logic and hide issue from static view.
- B) Remove interactivity completely.
- C) Add persistent labels/default callouts + non-hover fallback while preserving hover detail-on-demand.
- D) Increase tooltip font size only.

**Answer: C.**

### 32) Multiple answers (1 pt)
When building cross-module dashboards with interaction, choose all required guardrails.

- A) Central interaction bus for filters and highlight state.
- B) Fixed scales across module switches.
- C) Independent legend meaning per module.
- D) Clear export/readiness checks per output format.
- E) One global data cache only for static screenshots.

**Answer: A, B, D.**

### 33) Integrative scenario (1 pt)
You must build one page with: (i) abstraction-first pipeline, (ii) tabular trend, (iii) dashboard interaction, (iv) graph module, (v) spatial overlay, and (vi) web-app export. In one sentence, propose a defensible sequence of implementation checkpoints.

**Answer:** Start with task/spec and data abstraction, then produce a validated tabular trend baseline, add coordinated interaction rules for dashboard state, attach graph and map modules with shared temporal/filter bus, run accessibility + scale checks, and finish with format-specific exports (SVG for print, HTML for interactivity) with fallback states validated.**

### 34) MCQ (1 pt)
For a new long-form course module, which sequence should come first in a tight instruction flow?

- A) Proofs first, visuals second, case studies last.
- B) Plan and outcomes first, then practical design sequence.
- C) Interactivity demos first, then abstraction.
- D) Spatial maps first, then all other visualization types.

**Answer: B.**
