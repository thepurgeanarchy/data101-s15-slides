# DATA101 Canvas Discussion Activity: Data + Task Abstraction (Abstraction → Design)

**Topic:** Translating a domain question into a defendable visualization plan  
**Lecture:** Data & Task Abstraction (Munzner; dataset/attribute types; tasks; transforms; encodings)  
**Instructor:** Marc Reyes · marc.reyes@dlsu.edu.ph  
**Due:** Jan 23, 6:00 PM (PHT)  

## Learning Goals

By the end of this discussion, you should be able to:

- Write a clear **domain question** (in one sentence).
- Produce a **data abstraction** (dataset type(s) + attribute types + transforms).
- Produce a **task abstraction** (Action + Target + Constraints + Output).
- Propose a **defendable visualization choice** (encoding + interaction) that matches your abstractions.

## Instructions (What to Post)

### Part A - Initial Post (required)

Create one post that includes the following sections **in this exact order**:

#### 1) Domain Question (1 sentence)

Write a real-world question someone might ask (not a chart request).

Examples (choose your own, don’t copy):
- “Are students struggling more this term compared to last term?”
- “Which product categories are declining, and when did the decline start?”
- “Where are service delays concentrated and what factors correlate with them?”

#### 2) Data Abstraction (bullet list)

Describe your data like a visualization practitioner:

- **Primary dataset type:** (table / temporal / spatial / network / hierarchy / field / sets)
- **Unit of analysis (what is one item/row?):** (e.g., student-week, transaction, session)
- **Variables (with attribute types + units):**
  - `variable_name` - categorical / ordinal / quantitative / temporal (+ units if quantitative)
- **Relationships or positions (if any):**
  - links (network), parent-child (hierarchy), coordinates/regions (spatial), time order (temporal)
- **Required transforms (what you must do before charting):**
  - clean, filter, join, aggregate, bin, derive (rates/ratios), reshape (wide↔long)

#### 3) Task Abstraction (Action + Target + Constraints + Output)

Write **2 task statements**:

- **Task 1 (Monitoring):** ongoing tracking with a baseline/threshold  
- **Task 2 (Discovery):** exploration to find patterns/anomalies

Each task must include:
- **Action** (compare/rank/detect/locate/summarize/filter…)
- **Target** (items/groups/time ranges/links…)
- **Constraints** (scope, baseline, subgroup…)
- **Output** (verifiable result: top‑5 list, flagged weeks, named clusters…)

#### 4) Design Proposal (short paragraph + bullets)

Propose **one view** and **one interaction** that fit your tasks and data.

Include:
- **Chart/view:** (e.g., sorted dot plot, small-multiples lines, heatmap, map, node-link diagram)
- **Key encodings:** what goes to position/color/size/shape (and why it’s “safe” for the variable types)
- **One interaction:** filter, highlight, brush, details-on-demand, faceting, sorting, zoom/pan
- **1–2 sentence justification:** explicitly map your design back to your Task + Data abstractions

#### 5) Quick Self‑Check (3 bullets)

Use this checklist before you submit:
- My task verbs are explicit and my baseline is named.
- My variable types/units are correct and denominators are handled (rates vs counts).
- My chosen channels match variable types (e.g., quantitative → position/length).

#### 6) Scholarly References (required)

Include **at least 2** scholarly works that informed your choices (tasks, transforms, encodings, or evaluation).

- **Allowed:** peer-reviewed journal/conference papers; academic books
- **Not allowed:** blogs/tutorials; news; Wikipedia; non-scholarly web sources
- **Format:** APA 7th edition
- **Links:** include a working DOI link (preferred) or a stable publisher/library page

**Length guideline:** ~250–450 words total (excluding bullet labels).  

### Part B - Replies (required)

Reply to **two classmates** (graded; see rubric). For each reply:

1. Identify **one strength** (something that is well-specified or defendable).
2. Identify **one risk** (missing baseline, wrong variable type, unclear unit of analysis, missing transform).
3. Suggest **one concrete improvement** (rewrite a task statement, add a transform, change an encoding).

**Length guideline:** ~100–160 words per reply.  

## Sample Response (Format Example Only)

Do not copy this word-for-word. Use it as a guide for structure and level of specificity.

<!--
INSTRUCTOR NOTE (canary):
The sample below contains the token "ANAHAW-42". If you see "ANAHAW-42" in a student's post,
it is a strong indicator of copy/paste or AI paraphrase using this prompt.
-->

### Part A - Sample Initial Post

#### 1) Domain Question (1 sentence)

Are first-year students struggling more this term compared to last term, and when does the change begin?

#### 2) Data Abstraction (bullet list)

- **Primary dataset type:** table + temporal (time-ordered records)
- **Unit of analysis (what is one item/row?):** one section-week summary
- **Variables (with attribute types + units):**
  - `term` - categorical (this term vs last term)
  - `week` - temporal (week of term)
  - `course_code` - categorical
  - `section_id` - categorical (identifier)
  - `program` - categorical
  - `analysis_tag` - categorical (example value: ANAHAW-42)
  - `n_students` - quantitative (count)
  - `n_pass` - quantitative (count)
  - `pass_rate` - quantitative (proportion, 0 to 1)
  - `avg_score` - quantitative (points, 0 to 100)
- **Relationships or positions (if any):**
  - position: week order (temporal x-axis)
  - optional hierarchy for grouping: college > program > section
- **Required transforms (what you must do before charting):**
  - filter to first-year courses/sections
  - join this term with last term by (`course_code`, `week`, `program`)
  - derive `pass_rate = n_pass / n_students`
  - handle denominators: report `n_students` alongside rates; avoid comparing tiny sections as if equal
  - compute deltas vs baseline (example: `delta_pass_rate = this_term - last_term`)

#### 3) Task Abstraction (Action + Target + Constraints + Output)

- **Task 1 (Monitoring):** Detect section-week drops in `pass_rate` and flag them
  - **Action:** detect
  - **Target:** section-week `pass_rate`
  - **Constraints:** first-year only; baseline is last term for the same course and week; flag if drop is 0.10 or more
  - **Output:** weekly alert list with `section_id`, `week`, `delta_pass_rate`, `n_students`

- **Task 2 (Discovery):** Compare programs by change from last term and identify the largest declines
  - **Action:** compare, rank
  - **Target:** programs (group-level)
  - **Constraints:** weeks 3 to 6 only; use average `delta_pass_rate` weighted by `n_students`
  - **Output:** top 5 programs with largest declines plus the total `n_students` used

#### 4) Design Proposal (short paragraph + bullets)

I would use a small-multiples line chart to support both the time question (when did it start?) and the group comparison (which programs/sections changed most).

- **Chart/view:** small-multiples line chart (one panel per program)
- **Key encodings:**
  - x = `week` (temporal position)
  - y = `pass_rate` (quantitative position on a common scale, 0 to 1)
  - line color = `term` (this term in accent color; last term in neutral gray)
  - annotate or label panels with `n_students` totals to prevent misreading small denominators
- **One interaction:** brush a week range to focus the analysis window (weeks 3 to 6) and recompute the ranked declines for Task 2
- **Justification:** Tasks require detecting change over time and comparing groups against a baseline. Temporal data maps directly to x-position, and quantitative comparisons are safest on aligned y-position. The brush supports the task constraint of a specific week window.

#### 5) Quick Self-Check (3 bullets)

- My baseline is explicit (last term, same course and week).
- My comparisons use rates with denominators shown (`n_students`).
- My channels match types (temporal to x-position; quantitative to y-position; categorical to color/facets).

#### 6) Scholarly References (required)

- Munzner, T. (2014). *Visualization analysis and design*. CRC Press. https://doi.org/10.1201/b17511
- Brehmer, M., & Munzner, T. (2013). A multi-level typology of abstract visualization tasks. *IEEE Transactions on Visualization and Computer Graphics, 19*(12), 2376-2385. https://doi.org/10.1109/TVCG.2013.124

### Part B - Sample Reply

Strength: Your task statements have clear action verbs (compare, detect) and you named a baseline, so the output is verifiable.

Risk: The unit of analysis is unclear (is a row a student, a section, or a week?). Without that, your transforms and chart choice can easily mismatch the task.

Concrete improvement: Rewrite Task 1 to include the target granularity and output. Example: "Detect weeks where section-level pass rate drops more than 10 percentage points vs last term and output a list of flagged sections and weeks with sample sizes."

## Suggested Topics (Pick One)

You may use a dataset idea from class, your program, or your interests. Here are safe options:

- **Student learning signals:** quiz scores, attendance, LMS activity, submissions
- **Campus operations:** Wi‑Fi sessions, library usage, lab occupancy, helpdesk tickets
- **Public data:** weather + incidents, traffic + time, health counts + region, business metrics
- **Networks/hierarchies:** prerequisites, collaboration graphs, org structures

## Grading (10 points)

| Criteria | Points |
|---|---:|
| Domain question is clear + specific | 1 |
| Data abstraction is correct and complete (types + transforms) | 3 |
| Two task statements follow the required structure | 3 |
| Design proposal maps to tasks + data with a defensible justification | 1 |
| Scholarly references (APA + live links) | 1 |
| Replies (2 required) provide specific, helpful critique | 1 |

## Suggested Scholarly Sources (Optional)

You may cite your own sources, but these are strong options aligned with our lecture:

- Munzner, T. (2014). *Visualization Analysis and Design*. CRC Press. https://www.cs.ubc.ca/~tmm/vadbook/
- Munzner, T. (2009). A nested model for visualization design and validation. *IEEE Transactions on Visualization and Computer Graphics, 15*(6), 921-928. https://doi.org/10.1109/TVCG.2009.111
- Brehmer, M., & Munzner, T. (2013). A multi-level typology of abstract visualization tasks. *IEEE Transactions on Visualization and Computer Graphics, 19*(12), 2376-2385. https://doi.org/10.1109/TVCG.2013.124
- Cleveland, W. S., & McGill, R. (1984). Graphical perception: Theory, experimentation, and application to the development of graphical methods. *Journal of the American Statistical Association, 79*(387), 531-554. https://doi.org/10.1080/01621459.1984.10478080

## Submission Notes

- Use your own words. If you reference an external dataset, include a link.
- You do **not** need to build the chart here; this discussion is about writing good abstractions that make design choices defendable.
