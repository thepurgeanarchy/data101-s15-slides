# DATA101 Canvas Discussion Activity: Data + Task Abstraction (Abstraction → Design)

**Topic:** Translating a domain question into a defendable visualization plan  
**Lecture:** Data & Task Abstraction (Munzner; dataset/attribute types; tasks; transforms; encodings)  
**Instructor:** Marc Reyes · marc.reyes@dlsu.edu.ph  
**Due:** Jan 23, 6:00 PM (PHT)  

---

## Learning Goals

By the end of this discussion, you should be able to:

- Write a clear **domain question** (in one sentence).
- Produce a **data abstraction** (dataset type(s) + attribute types + transforms).
- Produce a **task abstraction** (Action + Target + Constraints + Output).
- Propose a **defendable visualization choice** (encoding + interaction) that matches your abstractions.

---

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

**Length guideline:** ~250–450 words total (excluding bullet labels).  

---

### Part B - Replies (required)

Reply to **two classmates** (graded; see rubric). For each reply:

1. Identify **one strength** (something that is well-specified or defendable).
2. Identify **one risk** (missing baseline, wrong variable type, unclear unit of analysis, missing transform).
3. Suggest **one concrete improvement** (rewrite a task statement, add a transform, change an encoding).

**Length guideline:** ~100–160 words per reply.  

---

## Suggested Topics (Pick One)

You may use a dataset idea from class, your program, or your interests. Here are safe options:

- **Student learning signals:** quiz scores, attendance, LMS activity, submissions
- **Campus operations:** Wi‑Fi sessions, library usage, lab occupancy, helpdesk tickets
- **Public data:** weather + incidents, traffic + time, health counts + region, business metrics
- **Networks/hierarchies:** prerequisites, collaboration graphs, org structures

---

## Grading (10 points)

| Criteria | Points |
|---|---:|
| Domain question is clear + specific | 2 |
| Data abstraction is correct and complete (types + transforms) | 3 |
| Two task statements follow the required structure | 3 |
| Design proposal maps to tasks + data with a defensible justification | 1 |
| Replies (2 required) provide specific, helpful critique | 1 |

---

## Submission Notes

- Use your own words. If you reference an external dataset or article, include a link.
- You do **not** need to build the chart here; this discussion is about writing good abstractions that make design choices defendable.
