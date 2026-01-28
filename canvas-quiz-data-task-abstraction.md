# DATA101 Quiz — Data & Task Abstraction (15 items)

## Instructions (Read First)

- This is an **individual** assessment.
- Choose the **single best** answer for each question.
- Read carefully: some options are designed to be plausible but incorrect.
- **One-question-at-a-time:** each question appears only once.
- **No backtracking:** once you move to the next question, you cannot return.

## Academic Integrity / Anti‑Cheating Policy

- The quiz is monitored using Canvas quiz logs (e.g., timestamps, session/activity logs, and related access metadata).
- **Multiple sessions are not allowed.** Do not open the quiz in multiple tabs/windows or on multiple devices/browsers. Doing so may be flagged for review.
- Any attempt to gain an unfair advantage (e.g., answer sharing, using unauthorized resources, or using AI tools to generate answers) is considered **academic dishonesty**.
- **Any detected/verified cheating results in an automatic 0 for the course.**

## Questions

1) A stakeholder says, “Make a bar chart of programs,” and you want a workflow that prevents you from picking a chart first and then forcing the data to fit it. Which sequence describes an abstraction-first process where the chart choice is the *result* of clarified requirements (not the starting point)?
   - A. Question → design → tasks → transforms → data needs
   - **B. Question → tasks → data needs → transforms → design**
   - C. Question → data needs → design → transforms → tasks
   - D. Question → pick a chart → force the data → weak story

2) You are “stuck” because the chart feels impossible to justify: the goal is vague (“students are struggling”), the baseline is unclear, and it’s not obvious what the visualization should enable. In Munzner’s nested model, which level is the translation layer where you define tasks and data structures so the later encoding choices become defensible?
   - A. Algorithm / implementation
   - B. Visual encoding & interaction
   - **C. Data & task abstraction**
   - D. Domain problem (people + goals)

3) Before you open Tableau, Excel, or any charting library, you want two short written artifacts that make your design decisions defendable (“I chose this view because it supports this task on this data structure”). Which pair of artifacts should you write first?
   - A. A style guide and a wireframe
   - **B. A task spec and a data spec**
   - C. A chart type list and color palette
   - D. A storyboard and animation plan

4) You are drafting a “data abstraction” section for a report. You want to include only what belongs in a data abstraction deliverable (dataset types, variable meaning, and required transforms), and avoid mixing in design choices too early. Which item does NOT belong in the data abstraction deliverable?
   - A. Dataset type(s)
   - B. Variable list with attribute types + units
   - C. Required transformations (clean/aggregate/bin/derive)
   - **D. Interaction techniques (brush, filter, tooltip)**

5) You’re cleaning a dataset and deciding what can be meaningfully averaged, plotted as magnitude, or used in calculations. Using the test “If I average this, does the result mean anything?”, which variable should NOT be treated as a quantitative measure?
   - A. `pass_rate`
   - B. `session_minutes`
   - **C. `StudentID`**
   - D. `avg_score`

6) A classmate argues that because 20°C is larger than 10°C, it must be “twice as hot.” You remember that some scales allow meaningful differences but do *not* allow ratio statements. Which claim is specifically invalid for an interval scale like Celsius?
   - A. “Differences are meaningful.”
   - **B. “20°C is twice as hot as 10°C.”**
   - C. “You can compute 20°C − 10°C.”
   - D. “You can compare changes (differences) across time.”

7) Your dataset contains `program_code` values like `1=CS, 2=IT`. The values are numeric in storage, but the meaning is “different kinds,” not “more vs less.” How should this variable be treated so you don’t accidentally invent a false ordering or meaningless averages?
   - A. A quantitative measure because it is numeric
   - **B. A category code (categorical), even though it looks numeric**
   - C. A ratio variable because it has a “true zero” (1)
   - D. A temporal variable because it can be ordered

8) You need to compare programs fairly, but the programs have very different numbers of students. If you compare raw counts of failures, larger programs will almost always look “worse” even if the proportion is better. Which derived measure best supports a fair comparison across different group sizes?
   - A. Total number of passes
   - B. Average `StudentID` per program
   - **C. Pass rate = passes / enrolled**
   - D. Number of sections per program

9) A dashboard shows only weekly averages, and the Dean wants to make decisions that affect individual students. You suspect the averages might hide who is actually struggling. Which statement best captures the key risk of aggregation and the reason distributions can be necessary?
   - **A. Aggregation hides variance; averages can conceal who is affected**
   - B. Aggregation is always better because it reduces noise
   - C. Granularity is mostly a formatting choice, not a design decision
   - D. Distributions are optional if you include a trend line

10) You have “wide” quiz data (quiz1, quiz2, quiz3 as separate columns), but you want a structure that makes grouping/faceting by quiz consistent and scalable. Which description matches “long / tidy” data in this context?
   - A. One row per dataset (all values in one row)
   - **B. One row per observation, with a column indicating which variable is measured**
   - C. One column per observation, with a row indicating the variable name
   - D. One row per visualization (each chart gets its own row)

11) You’re rewriting a vague request (“make a dashboard”) into something testable. The result should be specific enough that another person can check whether the visualization succeeds. Which structure best matches a strong task statement?
   - A. Chart type + color palette + caption
   - B. Goal + aesthetic + storytelling tone
   - **C. Action + Target + Constraints + Output**
   - D. Dataset type + attribute types + transforms

12) You are labeling parts of a task using the WHY/HOW/WHAT framework. You want words that describe motivation (the *goal*) rather than actions (verbs) or targets (objects). Which option contains only goal terms?
   - **A. Discover, Present, Monitor, Lookup**
   - B. Filter, Sort, Group, Benchmark
   - C. Locate, Detect, Explore, Rank
   - D. Items, Groups, Attributes, Links

13) You describe a task as “filter the dataset to first-year students, then compare their weekly pass rates to last term.” In the action vocabulary, “filter” belongs to which HOW bucket?
   - A. Search
   - **B. Query**
   - C. Compare
   - D. Detect

14) You need students to make accurate magnitude comparisons quickly (e.g., ranking sections by pass rate). Which visual channel supports the most precise comparison, assuming a shared axis and aligned scales?
   - A. Hue (color)
   - B. Area
   - **C. Position on a common scale**
   - D. Shape

15) When you do an early dataset “inventory,” you separate items (rows), variables (columns), relationships (links), and positions (time order/coordinates). In that inventory vocabulary, time order and coordinates are classified as:
   - A. Items
   - B. Variables
   - C. Relationships
   - **D. Positions**
