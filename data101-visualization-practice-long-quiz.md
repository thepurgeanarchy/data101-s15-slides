# DATA101 Long Quiz (50 points, all slides)

## Scope
This assessment covers **all** material in the current deck (all previously covered slide sections):  
Part 1: Tabular Data, Part 2: Multi-view Dashboards, Part 3: Network/Graph Data, Part 4: Spatial Data, and integrated cross-part application questions.

**Use exact terms from lecture where possible.  
Answer keys are shown in bold immediately after each item for Canvas reference use.**

## Part 1 — Tabular Data (14 points)

### 1) MCQ (3 pts)
A school tracks daily completion percentages for 24 cohorts over 18 months with missing days and unequal intervals. Stakeholders ask for “which cohort improved most from month 1 to month 18” and “which one slowed down after policy change.”  
Which combination is best?

- A) Raw heatmap of completion percentage by cohort × month.
- B) Slope chart + interpolated/imputed shared timeline + baseline normalization.
- C) Two standalone pie charts (initial vs final) with percentages.
- D) Box plots split by month with all missing months omitted.

**Answer: B.**  
**Why:** The task is change over ordered time plus pre/post intervention comparison; gaps must be made comparable before slope-based ranking, and normalization enables fair “change” interpretation.  

### 2) Multiple answers (2 pts)
Select all that are methodologically sound when comparing distributions across segments.

- A) Always choose equal-width bins because they simplify the interface.
- B) Keep bin edges/widths comparable across cohorts for first-pass visual claims.
- C) Report sample sizes and transformation choice when discussing long-tailed tails.
- D) Use the same color scale for histograms even if medians differ greatly.
- E) Switch to violin or density plots when bins produce unstable ordering at tiny n.

**Answer: B, C, E.**  

### 3) Ranking (2 pts)
Rank from **most useful (1)** to **least useful (4)** for a task requiring median trend + outlier bursts in grouped KPI data.

- A) Small-multiple line charts with synchronized y-scale and optional smoothing controls.
- B) Single dense line chart with one line per group.
- C) Ridge plot of each group.
- D) Grouped box plots by period.

**Answer: 1) A, 2) D, 3) B, 4) C.**  

### 4) Short answer (2 pts)
You only have room for one chart to answer: “Which regions have the most volatile retention and which dropped most after launch?”  
With non-uniform sampling and heavy outliers, what is the **single highest-priority step** before chart selection?

**Answer:** Normalize the time basis to a consistent ordered grid (or explicitly model it), then clip/flag outliers so volatility and slope are computed on comparable intervals.  

### 5) Mini-workflow design (2 pts)
Pick **exactly three** chart primitives for a tabular case with 30 cohorts, uneven n, heavy-tailed outcomes. The dashboard must show:
- central tendency shift,
- spread change,
- and outlier emergence over time.

Also provide one non-visual statistic required to keep interpretation honest.

**Answer:** Small-multiple trend line (or quantile trend), violin/box panel, and density outlier panel (or standardized residual map); plus bootstrap CI/uncertainty band or confidence interval around median/quantiles.  

### 6) Case triage (0 pt)
Given a table with 120 rows and 15 metrics:
Which first action should occur before choosing chart family for comparison tasks?

- A) Sort rows by ID.
- B) Determine whether the question is comparison, trend, or distribution.
- C) Pick a high-ink chart with most colors.
- D) Normalize all columns to percent of row total.

**Answer: B.**  

## Part 2 — Dashboards & Layout Patterns (11 points)

### 7) MCQ (2 pts)
In an operations cockpit, multiple audiences share state; some need headline status, others need detailed diagnostics.
What is the best first-pass layout?

- A) One giant matrix with all controls visible by default.
- B) Duplicated dashboard per audience.
- C) Overview strip + diagnostic modules for analysts + action lane with progressive disclosure.
- D) One KPI-only screen with hidden all details by role toggle.

**Answer: C.**  

### 8) Multiple answers (2 pts)
Which interventions directly fix dashboard failure when you see duplicated controls/semantics across views and users reporting confusion?

- A) Hide all legends and move semantics to narration.
- B) Standardize scale semantics in a shared registry (field+metric binding).
- C) Persist shared filters in one interaction bus.
- D) Expose advanced controls by default to avoid hidden states.
- E) Put non-critical controls in drawers and keep defaults minimal.

**Answer: B, C, E.**  

### 9) Matching (2 pts)
Match each design tactic to intent.

- 1) “Show only anomaly and drill-up details once user zooms in.”
- 2) “Keep time window and filters consistent while switching cards.”
- 3) “Bundle highly correlated metrics.”

Rationales:
- i) Reduce cognitive load and clutter.
- ii) Preserve shared analytical context.
- iii) Reduce redundant interpretation load.

**Answer: 1→i, 2→ii, 3→iii.**  

### 10) Short answer (2 pts)
You have **5 KPIs, 4 actions, 8 filters**.  
Specify what should be visible immediately versus progressively disclosed on first load.

**Answer:** Show mission-critical KPIs + current context/status + one primary action lane by default; keep less-used filters/actions and secondary diagnostics hidden until demand/interaction justifies them.  

### 11) Prioritization (1 pt)
Rank from highest to lowest priority for first incident response dashboard launch:
1) synchronized temporal filter, 2) contextual brushing on trend, 3) deep-link export.

**Answer:** 1) synchronized temporal filter, 2) contextual brushing on trend, 3) deep-link export.  

## Part 3 — Network / Graph Data (13 points)

### 12) MCQ (4 pts)
Need to inspect community structure, weak bridges, and suspect anomalies in a **25k-node sparse** graph for non-expert stakeholders. Best baseline?

- A) Node-link only with edge bundling and a single color map.
- B) Matrix only with no sorting.
- C) Hybrid: node-link overview + sorted matrix for dense substructures.
- D) Treemap of node degrees only.

**Answer: C.**  

### 13) Multiple answers (3 pts)
When should matrix views be preferred over node-link?

- A) Dense or near-complete neighborhoods.
- B) Need to inspect directionality and path flow.
- C) Need block/cluster structure comparison.
- D) Need bridge node interpretation by narrative for general audience.
- E) Need edge weight contrast in sparse whole-graph overviews.

**Answer: A, C.**  

### 14) Short answer (2 pts)
Designing an interactive directed-signed graph, what minimum fields are required and how should strength vs polarity be encoded to avoid channel collision?

**Answer:** `source`, `target`, `weight`, `sign/polarity` (plus optional timestamp/type for interactivity). Use color hue/arrow semantics for polarity and width/opacity/line intensity for strength, not the same channel for both.  

### 15) Matching (2 pts)
Match task to primary + fallback view.

- 1) “Expose allocation share in hierarchical business units.”
- 2) “Find actors that connect two partitions.”
- 3) “Inspect dense interaction block quality quickly.”

- A) Node-link primary + matrix fallback
- B) Treemap primary + node-link fallback
- C) Matrix primary + node-link fallback

**Answer: 1→B, 2→A, 3→C.**  

### 16) Case analysis (1 pt)
A graph story uses community detection then asks audiences to inspect bridge quality and hierarchy simultaneously.  
Which single interaction architecture is best?

- A) One static layout fixed; no interactions.
- B) Start with treemap to avoid clutter, then on-click swap to node-link force mode.
- C) Start with node-link with filtering, then transition to matrix for cluster blocks and edge-density anomalies.

**Answer: C.**  

## Part 4 — Spatial Data (12 points)

### 17) MCQ (4 pts)
Which setup is most defensible for comparing incidence across small counties with uneven population?

- A) Raw choropleth using raw counts and quantile breaks.
- B) Choropleth using raw rates + no denominator note.
- C) Per-capita normalized choropleth + explicit classing rationale + denominator transparency.
- D) Bubble-only map with one dot per 1,000 residents.

**Answer: C.**  

### 18) Multiple answers (3 pts)
Select all map pitfalls that can invalidate interpretation in publication:

- A) MAUP effects from changing boundary definitions.
- B) Ecological inference from aggregate to individual claims.
- C) Equal-area projection for short-term travel-time interpretation.
- D) Ignoring projection distortion where distance or adjacency are discussed.
- E) Using the same palette as bars and claiming semantic equivalence.

**Answer: A, B, D.**  

### 19) Short answer (2 pts)
Before publishing choropleth + symbol overlays of the same indicator, what must you confirm first?

**Answer:** Confirm the same denominator scale and comparability assumptions across layers, then align classing/legend logic so color bins and symbol magnitude do not imply contradictory ordering.  

### 20) Ranking (2 pts)
Order these spatial layers from highest to lowest risk of interpretive error if shown together without controls:
1) Flow arcs, 2) Choropleth fill, 3) Symbol bubbles, 4) Legend annotation.

**Answer:** 1) Flow arcs, 2) Symbol bubbles, 3) Choropleth fill, 4) Legend annotation.  

### 21) Layout policy (1 pt)
You publish one-page map with choropleth base, bubbles, and flow arcs. You have only three visible slots in hero area.
Which three should be visible by default?

- A) Base choropleth, choropleth legend, KPI context card.
- B) Flow arcs, bubble totals, full filter panel.
- C) All layers at full opacity, all toggles hidden.
- D) Symbol legend, historical scenario toggle, bubble scale text.

**Answer: A.**  

## Part 5 — Integrative Mastery (10 points)

### 22) Matching (2 pts)
Match each deck part to the primary anti-pattern in this prompt and the correction action.

- Scenarios:
  1) A dashboard uses one fixed color scale for line charts, ranking tables, and maps, but one chart is percentage and another is count.
  2) A node-link chart with 30k nodes is unreadable before any filtering.
  3) A dashboard hides all filters by default, so users cannot recover from misleading defaults.

- Fixes:
  i) Use semantic scale registry + field-linked metadata.
  ii) Add progressive disclosure + high-salience defaults by audience/task.
  iii) Add degree/cluster-aware view switching and focus+context for graph.

**Answer: 1→i, 2→iii, 3→ii.**  

### 23) Multiple answers (2 pts)
A unified interface must combine tabs: tabular trend summaries, dashboard decision pane, community graph module, and county map view. Which are valid guardrails?

- A) Share a single explicit time filter across all modules.
- B) Let each module maintain independent color semantics.
- C) Keep a global interaction bus for filters and highlight state.
- D) Use consistent “show/hide by intent” policy across module boundaries.
- E) Require users to re-filter manually in each module before any insight.

**Answer: A, C, D.**  

### 24) Integrative design prompt (1 pt)
Design a one-screen workflow (no more than 5 major components) for this executive brief:  
“Show whether interventions are reducing churn in high-risk regions; identify regional policy levers; and confirm whether collaboration between districts predicts outcomes.”

Must include: at least one tabular comparison, one dashboard interaction pattern, one graph representation, and one spatial representation.

**Answer:** A workable response: headline KPI strip → faceted trend/interval comparator (tabular) with campaign tags → synchronized temporal filter and drill lane (dashboard pattern) → node-link/matrix switch for collaboration bridges → choropleth + bubble/flow overlay for regional risk with shared time filter and explicit hide/show controls.  

### 25) Hard logic (1 pt)
Given the full 50-slide deck sequence, which order of modules best reduces cognitive transitions for a mixed audience before Q&A?

- A) Dashboard → Network → Spatial → Tabular → Summary.
- B) Tabular → Spatial → Network → Dashboard.
- C) Spatial → Tabular → Network → Dashboard.
- D) Tabular → Dashboard → Spatial → Network.

**Answer: D.**  
**Why:** Builds from familiar structured data and comparison/trends, then introduces coordination patterns, then geographic context, then graph abstractions requiring strongest mental model shift.  
