# DATA101 Guided Activity - Canvas Assignment Description

## Title
Guided Activity: Data + Task Abstraction to Visualization Design

## Overview
In this guided notebook activity, you will practice turning a domain question into a defensible visualization workflow. You will write your task abstraction and data abstraction first, then implement the required transforms in Python, and finally produce two charts that directly support your tasks.

The notebook uses a standardized (synthetic) class dataset provided as a CSV so everyone's results are comparable.

## Learning Outcomes
By the end of this activity, you should be able to:
- Write a clear task spec (Action + Target + Constraints + Output)
- Write a data spec (dataset type + variable types/units + transforms)
- Implement transforms (derive, aggregate, compare vs baseline)
- Design charts that match the task and data abstractions

## Instructions (What To Do)
1. Open the notebook: `notebooks/data-task-abstraction-activity.ipynb`
   - Keep `notebooks/data-task-abstraction-dataset.csv` available (the notebook will load it automatically).
2. Run the Setup cell. If any imports fail on your JupyterHub, message your instructor with the error text.
3. In the first cell, fill in the Group Information table (Group number + member names).
4. Complete the notebook in order:
   - Part 1: Write your Task Spec
   - Part 2: Fix types and write your Data Spec
   - Part 3: Implement the transforms and produce the required task outputs
   - Part 4: Create two charts that match your tasks
   - Part 5: Write your interpretation and justification
5. Before submitting: Restart the kernel and Run All to confirm the notebook executes top to bottom without errors.

## What To Submit
Submit one `.ipynb` notebook per group that includes:
- Completed Task Spec (written response)
- Completed Data Spec (written response)
- Transform implementation (code runs and produces the required outputs)
- Two charts:
  - A time comparison per program (small multiples)
  - A ranked change summary for the specified window
- A short justification (4 to 6 sentences) linking tasks -> data -> transforms -> design, plus one improvement you would make

Recommended filename:
`DATA101_S15_Group<YourGroupNumber>_DataTaskAbstraction.ipynb`

## Grading (20 points)
This assignment is graded using the same rubric shown at the top of the notebook:
- Task abstraction (explicit baseline + verifiable outputs) - 5
- Data abstraction (dataset type + variable types/units + transforms) - 5
- Transform implementation (rate, aggregation, baseline delta, task outputs) - 4
- Visual design (charts match tasks; readable labels/scales; baseline is clear) - 4
- Justification (connect tasks -> data -> transforms -> design; one improvement) - 2

## Academic Integrity
Use your own words and your own code. If you consulted any outside sources (including tools), acknowledge them briefly in your write-up with a proper citation/link.
