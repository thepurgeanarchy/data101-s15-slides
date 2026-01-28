# DATA101 Quiz — Perception & Color (15 items)

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

1) You are auditing a published chart and trying to locate *where* the mistake might have been introduced. In a pipeline that goes from measurements → encoding → perception → interpretation → decision, what does the **encoding** stage specifically involve?
   - A. Meanings and narratives the viewer forms
   - **B. Marks + channels (position, length, color, shape, area)**
   - C. The final decision/action taken from the chart
   - D. The raw measurements and records only

2) You want viewers to instantly see “which group this mark belongs to” without reading every label, but you are not trying to show precise magnitudes. Which set of cues best supports fast grouping rather than fast quantitative comparison?
   - A. Position, length, slope
   - **B. Hue, shape, enclosure**
   - C. Angle, area, volume
   - D. Units, axes, baseline

3) A chart will be used for decisions where small differences matter (e.g., ranking programs or comparing close values). You want the channel that supports the most accurate magnitude comparison when a shared scale is available. Which channel is the best choice?
   - A. Hue (color)
   - B. Area
   - **C. Position on a common scale**
   - D. Saturation (chroma)

4) A designer places marks close together so viewers mentally cluster them—even if there is no line connecting them and no color difference. Which Gestalt grouping principle does the statement **“Near = same group”** describe?
   - A. Similarity
   - **B. Proximity**
   - C. Continuity
   - D. Connection

5) You need a color mapping that communicates ordered magnitude (low → high) and still “works” when printed in grayscale. If hue is used for “which group,” which color dimension is used to communicate “how much”?
   - **A. Lightness**
   - B. Shape
   - C. Texture
   - D. Angle

6) Your metric is a deviation from a reference (e.g., current − baseline), and you want viewers to see both direction (above vs below) and magnitude. The midpoint (baseline) has meaning. Which palette type best matches this semantic structure?
   - A. Qualitative
   - B. Sequential
   - **C. Diverging**
   - D. Randomized rainbow

7) You are choosing the center point for a diverging scale and want it to represent a reference that viewers can interpret as “neutral.” Which midpoint is a valid, meaningful choice for a diverging scale in difference data?
   - **A. 0 (baseline)**
   - B. The maximum value in the dataset
   - C. The most frequent category (mode)
   - D. Whatever midpoint looks most “balanced”

8) You are building a static figure with categories encoded by distinct hues. You want the mapping to remain readable without turning the legend into a scavenger hunt or overloading working memory. About how many categories is a practical ceiling for a qualitative palette in a static chart?
   - A. 2
   - **B. 6**
   - C. 12
   - D. As many as needed if you add a legend

9) A heatmap uses a rainbow/jet-like scale and “looks detailed,” but you suspect the scale is creating structure that is not truly in the data. Which statement is NOT one of the reasons that rainbow/jet-like scales are misleading?
   - A. Non-uniform perception: some hues “pop.”
   - B. False boundaries: hue edges look categorical.
   - C. Not robust: breaks in grayscale and for CVD viewers.
   - **D. It requires a meaningful midpoint to interpret.**

10) You are designing for real viewing conditions: projectors, grayscale printing, and viewers with color vision deficiency. What is the core robustness rule for meaning encoded with color?
   - A. Encode meaning with color alone (it’s fastest)
   - **B. Don’t encode meaning with color alone; add redundancy**
   - C. Use red/green contrasts because they are “standard”
   - D. Remove labels to reduce clutter

11) A diverging color scale is used for differences around a baseline, but the legend is vague and readers cannot tell what “neutral” represents. What single legend feature is most necessary to make a diverging scale interpretable without guesswork?
   - **A. A labeled midpoint (e.g., 0/baseline)**
   - B. The brand color names (e.g., “Sky”, “Vermillion”)
   - C. A 3D legend bar for “depth”
   - D. Random tick marks (more ticks = more trust)

12) In a choropleth or heatmap, some regions/cells have no measurement. If you map missing values to the lowest color, viewers will read “very low,” not “unknown.” What is the correct design approach for missingness so interpretation stays honest?
   - A. Map missing values to the lowest color on the scale
   - B. Drop missing regions so the chart looks cleaner
   - **C. Show missing explicitly (e.g., separate “No data” color/pattern) and explain in the legend**
   - D. Replace missing values with 0 because it’s “neutral”

13) You want the audience to accurately compare values (not just notice categories), and the difference between values is small enough that misreading matters. In that situation, what should you prefer over adding more color?
   - **A. Position (dot plots / aligned bars)**
   - B. More hues (so everything is distinct)
   - C. Higher saturation (so differences “pop”)
   - D. A diverging palette even without a baseline

14) You are trying to read a chart like a skeptic rather than being persuaded by design polish. Before checking axes, units, or encodings, what is the first thing you should identify so you know what the chart is trying to convince you of?
   - A. Check uncertainty and sample size first
   - **B. Read the title as a claim**
   - C. Verify the encoding before reading any text
   - D. Assume the conclusion is correct unless proven otherwise

15) A bar chart shows two categories with a y-axis that starts above zero. The bars appear dramatically different even though the numeric difference is small. Why is this especially misleading for bars (as opposed to, say, dots)?
   - **A. Bars encode length from a baseline, so a nonzero baseline inflates visual differences**
   - B. Bars always require logarithmic scales to be readable
   - C. Bars encode hue, so truncation changes the colors
   - D. Bars only work when categories are sorted alphabetically
