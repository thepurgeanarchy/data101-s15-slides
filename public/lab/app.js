/* global d3 */

(() => {
  const $ = (sel) => document.querySelector(sel)
  const d3x = window.d3

  const theme = {
    bg: '#0b0f17',
    panelFill: 'rgba(255,255,255,0.04)',
    panelStroke: 'rgba(255,255,255,0.12)',
    grid: 'rgba(255,255,255,0.10)',
    axis: 'rgba(255,255,255,0.16)',
    text: 'rgba(245,247,250,0.92)',
    textMuted: 'rgba(245,247,250,0.72)',
    textFaint: 'rgba(245,247,250,0.60)',
    primary: '#4da3ff',
    cyan: '#22d3ee',
    violet: '#a78bfa',
    orange: '#f59e0b',
  }

  function colorMap(programs) {
    const palette = [theme.primary, theme.cyan, theme.violet, theme.orange]
    const m = new Map()
    programs.forEach((p, i) => m.set(p, palette[i % palette.length]))
    return m
  }

  function clamp(v, lo, hi) {
    return Math.max(lo, Math.min(hi, v))
  }

  async function loadRows() {
    const res = await fetch('./data-task-abstraction-dataset.csv', { cache: 'no-store' })
    const text = await res.text()
    return d3x
      .csvParse(text, (d) => ({
        term: String(d.term),
        week: Number(d.week),
        program: String(d.program),
        section_id: String(d.section_id),
        n_students: Number(d.n_students),
        n_pass: Number(d.n_pass),
        avg_score: Number(d.avg_score),
      }))
      .filter((r) => Number.isFinite(r.week) && Number.isFinite(r.n_students) && r.n_students > 0 && Number.isFinite(r.n_pass))
  }

  function latestTerm(rows) {
    const terms = Array.from(new Set(rows.map((r) => r.term))).sort()
    return terms.at(-1) || 'unknown'
  }

  function aggregatePassRate(rows, term) {
    const termRows = rows.filter((r) => r.term === term)
    const programs = Array.from(new Set(termRows.map((r) => r.program))).sort()
    const byProgramWeek = d3x.rollup(
      termRows,
      (v) => ({
        n_pass: d3x.sum(v, (d) => d.n_pass),
        n_students: d3x.sum(v, (d) => d.n_students),
      }),
      (d) => d.program,
      (d) => d.week,
    )

    const weeks = Array.from(new Set(termRows.map((r) => r.week))).filter(Number.isFinite).sort((a, b) => a - b)
    const series = programs.map((program) => {
      const m = byProgramWeek.get(program) || new Map()
      const values = weeks
        .map((week) => {
          const a = m.get(week)
          const pass_rate = a && a.n_students > 0 ? a.n_pass / a.n_students : NaN
          return { week, pass_rate }
        })
        .filter((d) => Number.isFinite(d.pass_rate))
      return { program, values }
    })

    const valueByProgramWeek = new Map()
    for (const s of series) {
      const wm = new Map()
      for (const v of s.values) wm.set(v.week, v.pass_rate)
      valueByProgramWeek.set(s.program, wm)
    }

    const passRates = series.flatMap((s) => s.values.map((v) => v.pass_rate))
    const extent = d3x.extent(passRates)
    const yMin = clamp((extent[0] ?? 0.6) - 0.04, 0, 1)
    const yMax = clamp((extent[1] ?? 0.9) + 0.04, 0, 1)

    return { term, termRows, programs, weeks, series, valueByProgramWeek, yDomain: [yMin, yMax] }
  }

  function styleAxis(axisGroup) {
    axisGroup.selectAll('path').attr('stroke', theme.axis).attr('stroke-width', 1.2)
    axisGroup.selectAll('line').attr('stroke', theme.axis).attr('stroke-width', 1.2)
    axisGroup
      .selectAll('text')
      .attr('fill', theme.textMuted)
      .style('font-size', '12px')
      .style('font-weight', '650')
  }

  function renderHoverLegendDemo(host, agg) {
    host.innerHTML = ''
    const meta = $('#hoverLegendMeta')
    meta.textContent = `Term: ${agg.term} · hover to inspect · scroll to zoom · drag to pan · click legend to filter`

    const width = 980
    const height = 360
    const margin = { top: 72, right: 18, bottom: 48, left: 62 }
    const plotW = width - margin.left - margin.right
    const plotH = height - margin.top - margin.bottom

    const colors = colorMap(agg.programs)
    const [minWeek, maxWeek] = d3x.extent(agg.weeks)

    const x0 = d3x.scaleLinear().domain([minWeek, maxWeek]).range([0, plotW])
    let xScale = x0
    const y = d3x.scaleLinear().domain(agg.yDomain).nice().range([plotH, 0])

    const svg = d3x
      .select(host)
      .append('svg')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('role', 'img')
      .attr('aria-label', 'Hover and legend filtering demo')
      .style('font-family', 'inherit')

    svg
      .append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', width)
      .attr('height', height)
      .attr('rx', 20)
      .attr('ry', 20)
      .attr('fill', theme.panelFill)
      .attr('stroke', theme.panelStroke)
      .attr('stroke-width', 1.2)

    svg
      .append('text')
      .attr('x', margin.left)
      .attr('y', 28)
      .attr('fill', theme.text)
      .style('font-size', '16px')
      .style('font-weight', '900')
      .text('Hover + legend filtering (D3)')

    svg
      .append('text')
      .attr('x', width - margin.right)
      .attr('y', 28)
      .attr('text-anchor', 'end')
      .attr('fill', theme.textMuted)
      .style('font-size', '11px')
      .style('font-weight', '650')
      .text('Scroll to zoom · drag to pan · hover to inspect')

    const legend = svg.append('g').attr('transform', `translate(${margin.left},${50})`)
    const legendItems = legend
      .selectAll('g.item')
      .data(agg.programs)
      .enter()
      .append('g')
      .attr('class', 'item')
      .attr('transform', (d, i) => `translate(${i * 88},0)`)
      .style('cursor', 'pointer')

    legendItems
      .append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', 6)
      .attr('fill', theme.bg)
      .attr('stroke', (d) => colors.get(d))
      .attr('stroke-width', 3)

    legendItems
      .append('text')
      .attr('x', 12)
      .attr('y', 4)
      .attr('fill', theme.textMuted)
      .style('font-size', '12px')
      .style('font-weight', '800')
      .text((d) => d)

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

    g.append('g')
      .selectAll('line')
      .data(y.ticks(4))
      .enter()
      .append('line')
      .attr('x1', 0)
      .attr('x2', plotW)
      .attr('y1', (t) => y(t))
      .attr('y2', (t) => y(t))
      .attr('stroke', theme.grid)
      .attr('stroke-width', 1)

    const xAxisG = g.append('g').attr('transform', `translate(0,${plotH})`).call(d3x.axisBottom(xScale).ticks(10).tickFormat(d3x.format('d')))
    const yAxisG = g.append('g').call(d3x.axisLeft(y).ticks(4).tickFormat(d3x.format('.2f')))
    styleAxis(xAxisG)
    styleAxis(yAxisG)

    g.append('text')
      .attr('x', plotW / 2)
      .attr('y', plotH + 38)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.textMuted)
      .style('font-size', '12px')
      .style('font-weight', '650')
      .text('Week')

    g.append('text')
      .attr('x', -42)
      .attr('y', plotH / 2)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.textMuted)
      .style('font-size', '12px')
      .style('font-weight', '650')
      .attr('transform', `rotate(-90 ${-42} ${plotH / 2})`)
      .text('pass_rate')

    const visible = new Set(agg.programs)

    const line = d3x
      .line()
      .x((d) => xScale(d.week))
      .y((d) => y(d.pass_rate))
      .curve(d3x.curveMonotoneX)

    const seriesG = g.append('g')
    const paths = seriesG
      .selectAll('path.series')
      .data(agg.series, (d) => d.program)
      .enter()
      .append('path')
      .attr('class', 'series')
      .attr('fill', 'none')
      .attr('stroke', (d) => colors.get(d.program))
      .attr('stroke-width', 3.2)
      .attr('stroke-linecap', 'round')
      .attr('stroke-linejoin', 'round')
      .attr('d', (d) => line(d.values))

    const pointsG = g.append('g')
    const points = pointsG
      .selectAll('g.p')
      .data(agg.series, (d) => d.program)
      .enter()
      .append('g')
      .attr('class', 'p')
      .selectAll('circle')
      .data((d) => d.values.map((v) => ({ program: d.program, ...v })))
      .enter()
      .append('circle')
      .attr('cx', (d) => xScale(d.week))
      .attr('cy', (d) => y(d.pass_rate))
      .attr('r', 4.8)
      .attr('fill', theme.bg)
      .attr('stroke', (d) => colors.get(d.program))
      .attr('stroke-width', 2.2)
      .attr('opacity', 0.9)

    const focus = g.append('g').style('opacity', 0)
    const focusLine = focus
      .append('line')
      .attr('y1', 0)
      .attr('y2', plotH)
      .attr('stroke', 'rgba(34,211,238,0.55)')
      .attr('stroke-width', 1.8)
      .attr('stroke-dasharray', '5 5')

    const focusDots = focus.append('g')

    const tip = focus.append('g')
    const tipBg = tip
      .append('rect')
      .attr('rx', 14)
      .attr('ry', 14)
      .attr('fill', 'rgba(11, 18, 32, 0.92)')
      .attr('stroke', 'rgba(255,255,255,0.18)')
      .attr('stroke-width', 1)

    const tipText = tip
      .append('text')
      .attr('x', 12)
      .attr('y', 18)
      .attr('fill', theme.text)
      .style('font-size', '12px')
      .style('font-weight', '800')

    function setVisibility() {
      paths.attr('opacity', (d) => (visible.has(d.program) ? 1 : 0.12))
      points.attr('opacity', (d) => (visible.has(d.program) ? 0.9 : 0.06))
      legendItems.attr('opacity', (d) => (visible.has(d) ? 1 : 0.35))
    }

    legendItems
      .on('click', (event, program) => {
        if (visible.has(program)) visible.delete(program)
        else visible.add(program)
        if (visible.size === 0) agg.programs.forEach((p) => visible.add(p))
        setVisibility()
      })
      .on('dblclick', (event, program) => {
        event.preventDefault()
        if (visible.size === 1 && visible.has(program)) {
          visible.clear()
          agg.programs.forEach((p) => visible.add(p))
        }
        else {
          visible.clear()
          visible.add(program)
        }
        setVisibility()
      })

    setVisibility()

    const overlay = g
      .append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', plotW)
      .attr('height', plotH)
      .attr('fill', 'transparent')
      .style('cursor', 'crosshair')

    const fmt = d3x.format('.3f')

    const zoom = d3x
      .zoom()
      .scaleExtent([1, 8])
      .translateExtent([
        [0, 0],
        [plotW, plotH],
      ])
      .extent([
        [0, 0],
        [plotW, plotH],
      ])
      .on('zoom', (event) => {
        xScale = event.transform.rescaleX(x0)

        xAxisG.call(d3x.axisBottom(xScale).ticks(10).tickFormat(d3x.format('d')))
        styleAxis(xAxisG)

        paths.attr('d', (d) => line(d.values))
        points.attr('cx', (d) => xScale(d.week))
      })

    overlay.call(zoom).on('dblclick.zoom', null)

    overlay
      .on('mousemove', (event) => {
        const [mx] = d3x.pointer(event, overlay.node())
        const week = clamp(Math.round(xScale.invert(mx)), minWeek, maxWeek)

        focus.style('opacity', 1)
        const fx = xScale(week)
        focusLine.attr('x1', fx).attr('x2', fx)

        const rows = agg.programs
          .filter((p) => visible.has(p))
          .map((program) => {
            const v = agg.valueByProgramWeek.get(program)?.get(week)
            return { program, value: v }
          })
          .filter((d) => Number.isFinite(d.value))

        const dots = focusDots.selectAll('circle').data(rows, (d) => d.program)
        dots
          .enter()
          .append('circle')
          .attr('r', 7.2)
          .attr('fill', theme.bg)
          .attr('stroke-width', 2.6)
          .merge(dots)
          .attr('cx', fx)
          .attr('cy', (d) => y(d.value))
          .attr('stroke', (d) => colors.get(d.program))

        dots.exit().remove()

        const lines = [`Week ${week}`].concat(rows.map((d) => `${d.program}: ${fmt(d.value)}`))
        tipText.selectAll('tspan').remove()
        lines.forEach((lineText, i) => {
          tipText
            .append('tspan')
            .attr('x', 12)
            .attr('dy', i === 0 ? 0 : 16)
            .attr('fill', i === 0 ? theme.textMuted : theme.text)
            .style('font-weight', i === 0 ? '750' : '850')
            .text(lineText)
        })

        const tipW = 168
        const tipH = 18 + (lines.length - 1) * 16 + 12
        tipBg.attr('width', tipW).attr('height', tipH)

        const tx = clamp(fx + 12, 8, plotW - tipW - 8)
        const ty = clamp(14, 8, plotH - tipH - 8)
        tip.attr('transform', `translate(${tx},${ty})`)
      })
      .on('mouseleave', () => {
        focus.style('opacity', 0)
      })
      .on('dblclick', () => {
        overlay.transition().duration(240).call(zoom.transform, d3x.zoomIdentity)
      })
  }

  function boxStats(values) {
    const v = values.filter(Number.isFinite).slice().sort(d3x.ascending)
    if (v.length === 0) return null
    const q1 = d3x.quantile(v, 0.25)
    const med = d3x.quantile(v, 0.5)
    const q3 = d3x.quantile(v, 0.75)
    const iqr = (q3 ?? 0) - (q1 ?? 0)
    const lo = (q1 ?? v[0]) - 1.5 * iqr
    const hi = (q3 ?? v[v.length - 1]) + 1.5 * iqr
    const min = d3x.min(v.filter((x) => x >= lo)) ?? v[0]
    const max = d3x.max(v.filter((x) => x <= hi)) ?? v[v.length - 1]
    return { n: v.length, q1, med, q3, min, max }
  }

  function renderLinkedViewsDemo(host, agg) {
    host.innerHTML = ''
    const meta = $('#linkedMeta')

    const width = 980
    const height = 420
    const pad = 22
    const gap = 18

    const leftW = 610
    const rightW = width - pad * 2 - gap - leftW
    const panelH = height - pad * 2

    const left = { x: pad, y: pad, w: leftW, h: panelH }
    const right = { x: pad + leftW + gap, y: pad, w: rightW, h: panelH }

    const colors = colorMap(agg.programs)
    const [minWeek, maxWeek] = d3x.extent(agg.weeks)

    const svg = d3x
      .select(host)
      .append('svg')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('role', 'img')
      .attr('aria-label', 'Linked views: brush updates distribution')
      .style('font-family', 'inherit')

    svg
      .append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', width)
      .attr('height', height)
      .attr('rx', 20)
      .attr('ry', 20)
      .attr('fill', theme.panelFill)
      .attr('stroke', theme.panelStroke)
      .attr('stroke-width', 1.2)

    svg
      .append('text')
      .attr('x', pad)
      .attr('y', 30)
      .attr('fill', theme.text)
      .style('font-size', '16px')
      .style('font-weight', '900')
      .text('Linked views: brush a week range to update a distribution')

    const leftG = svg.append('g').attr('transform', `translate(${left.x},${left.y})`)
    const rightG = svg.append('g').attr('transform', `translate(${right.x},${right.y})`)

    leftG
      .append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', left.w)
      .attr('height', left.h)
      .attr('rx', 18)
      .attr('ry', 18)
      .attr('fill', 'rgba(255,255,255,0.02)')
      .attr('stroke', 'rgba(255,255,255,0.10)')
      .attr('stroke-width', 1)

    rightG
      .append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', right.w)
      .attr('height', right.h)
      .attr('rx', 18)
      .attr('ry', 18)
      .attr('fill', 'rgba(255,255,255,0.02)')
      .attr('stroke', 'rgba(255,255,255,0.10)')
      .attr('stroke-width', 1)

    leftG
      .append('text')
      .attr('x', 18)
      .attr('y', 34)
      .attr('fill', theme.text)
      .style('font-size', '14px')
      .style('font-weight', '900')
      .text('Overview: pass_rate by program')

    rightG
      .append('text')
      .attr('x', 18)
      .attr('y', 34)
      .attr('fill', theme.text)
      .style('font-size', '14px')
      .style('font-weight', '900')
      .text('Detail: avg_score distribution (selected weeks)')

    const leftMargin = { top: 54, right: 18, bottom: 44, left: 56 }
    const leftPlotW = left.w - leftMargin.left - leftMargin.right
    const leftPlotH = left.h - leftMargin.top - leftMargin.bottom

    const leftPlot = leftG.append('g').attr('transform', `translate(${leftMargin.left},${leftMargin.top})`)

    const x = d3x.scaleLinear().domain([minWeek, maxWeek]).range([0, leftPlotW])
    const y = d3x.scaleLinear().domain(agg.yDomain).nice().range([leftPlotH, 0])

    leftPlot
      .append('g')
      .selectAll('line')
      .data(y.ticks(4))
      .enter()
      .append('line')
      .attr('x1', 0)
      .attr('x2', leftPlotW)
      .attr('y1', (t) => y(t))
      .attr('y2', (t) => y(t))
      .attr('stroke', theme.grid)
      .attr('stroke-width', 1)

    const xAxisG = leftPlot.append('g').attr('transform', `translate(0,${leftPlotH})`).call(d3x.axisBottom(x).ticks(10).tickFormat(d3x.format('d')))
    const yAxisG = leftPlot.append('g').call(d3x.axisLeft(y).ticks(4).tickFormat(d3x.format('.2f')))
    styleAxis(xAxisG)
    styleAxis(yAxisG)

    leftPlot
      .append('text')
      .attr('x', leftPlotW / 2)
      .attr('y', leftPlotH + 36)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.textMuted)
      .style('font-size', '12px')
      .style('font-weight', '650')
      .text('Week')

    leftPlot
      .append('text')
      .attr('x', -42)
      .attr('y', leftPlotH / 2)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.textMuted)
      .style('font-size', '12px')
      .style('font-weight', '650')
      .attr('transform', `rotate(-90 ${-42} ${leftPlotH / 2})`)
      .text('pass_rate')

    const line = d3x
      .line()
      .x((d) => x(d.week))
      .y((d) => y(d.pass_rate))
      .curve(d3x.curveMonotoneX)

    leftPlot
      .append('g')
      .selectAll('path')
      .data(agg.series)
      .enter()
      .append('path')
      .attr('fill', 'none')
      .attr('stroke', (d) => colors.get(d.program))
      .attr('stroke-width', 2.8)
      .attr('stroke-linecap', 'round')
      .attr('stroke-linejoin', 'round')
      .attr('d', (d) => line(d.values))

    const rightMargin = { top: 54, right: 18, bottom: 44, left: 52 }
    const rightPlotW = right.w - rightMargin.left - rightMargin.right
    const rightPlotH = right.h - rightMargin.top - rightMargin.bottom
    const rightPlot = rightG.append('g').attr('transform', `translate(${rightMargin.left},${rightMargin.top})`)

    const programBand = d3x.scaleBand().domain(agg.programs).range([0, rightPlotW]).padding(0.35)
    const yScore = d3x.scaleLinear().domain([75, 100]).nice().range([rightPlotH, 0])

    rightPlot
      .append('g')
      .selectAll('line')
      .data(yScore.ticks(4))
      .enter()
      .append('line')
      .attr('x1', 0)
      .attr('x2', rightPlotW)
      .attr('y1', (t) => yScore(t))
      .attr('y2', (t) => yScore(t))
      .attr('stroke', 'rgba(255,255,255,0.08)')
      .attr('stroke-width', 1)

    const xP = rightPlot.append('g').attr('transform', `translate(0,${rightPlotH})`).call(d3x.axisBottom(programBand))
    const yP = rightPlot.append('g').call(d3x.axisLeft(yScore).ticks(4))
    styleAxis(xP)
    styleAxis(yP)

    rightPlot
      .append('text')
      .attr('x', rightPlotW / 2)
      .attr('y', rightPlotH + 36)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.textMuted)
      .style('font-size', '12px')
      .style('font-weight', '650')
      .text('Program')

    rightPlot
      .append('text')
      .attr('x', -38)
      .attr('y', rightPlotH / 2)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.textMuted)
      .style('font-size', '12px')
      .style('font-weight', '650')
      .attr('transform', `rotate(-90 ${-38} ${rightPlotH / 2})`)
      .text('avg_score')

    const defaultRange = [Math.max(minWeek, minWeek + 4), Math.min(maxWeek, minWeek + 12)]
    let selected = defaultRange

    const status = svg
      .append('text')
      .attr('x', right.x + 18)
      .attr('y', right.y + right.h - 10)
      .attr('fill', theme.textMuted)
      .style('font-size', '11px')
      .style('font-weight', '650')

    function updateDetail([w0, w1]) {
      selected = [Math.round(w0), Math.round(w1)]
      const lo = Math.min(selected[0], selected[1])
      const hi = Math.max(selected[0], selected[1])

      const view = agg.termRows.filter((r) => r.week >= lo && r.week <= hi && Number.isFinite(r.avg_score))
      const nRows = view.length

      const stats = agg.programs.map((program) => {
        const values = view.filter((r) => r.program === program).map((r) => r.avg_score)
        return { program, s: boxStats(values) }
      })

      const all = stats.flatMap((d) => (d.s ? [d.s.min, d.s.max] : [])).filter(Number.isFinite)
      if (all.length) {
        const e = d3x.extent(all)
        yScore.domain([Math.floor((e[0] ?? 75) - 1), Math.ceil((e[1] ?? 100) + 1)]).nice()
        yP.call(d3x.axisLeft(yScore).ticks(4))
        styleAxis(yP)
      }

      const boxW = Math.max(18, programBand.bandwidth() - 12)

      const box = rightPlot.selectAll('g.box').data(stats, (d) => d.program)
      const boxEnter = box.enter().append('g').attr('class', 'box')

      boxEnter.append('line').attr('class', 'whisker').attr('stroke-width', 2.2).attr('stroke', theme.textFaint)
      boxEnter.append('rect').attr('class', 'iqr').attr('rx', 10).attr('ry', 10).attr('fill', 'transparent').attr('stroke-width', 2.2)
      boxEnter.append('line').attr('class', 'median').attr('stroke-width', 2.6).attr('stroke', theme.text)
      boxEnter.append('circle').attr('class', 'mean').attr('r', 4.5).attr('fill', theme.bg).attr('stroke-width', 2.2)

      const boxAll = boxEnter.merge(box)

      boxAll
        .transition()
        .duration(550)
        .ease(d3x.easeCubicOut)
        .attr('transform', (d) => `translate(${programBand(d.program) + programBand.bandwidth() / 2},0)`)

      boxAll.select('line.whisker')
        .transition()
        .duration(550)
        .attr('x1', 0)
        .attr('x2', 0)
        .attr('y1', (d) => yScore(d.s?.min ?? 0))
        .attr('y2', (d) => yScore(d.s?.max ?? 0))
        .attr('opacity', (d) => (d.s ? 1 : 0.18))

      boxAll.select('rect.iqr')
        .transition()
        .duration(550)
        .attr('x', -boxW / 2)
        .attr('width', boxW)
        .attr('y', (d) => yScore(d.s?.q3 ?? 0))
        .attr('height', (d) => Math.max(0, yScore(d.s?.q1 ?? 0) - yScore(d.s?.q3 ?? 0)))
        .attr('stroke', (d) => colors.get(d.program))
        .attr('opacity', (d) => (d.s ? 1 : 0.18))

      boxAll.select('line.median')
        .transition()
        .duration(550)
        .attr('x1', -boxW / 2)
        .attr('x2', boxW / 2)
        .attr('y1', (d) => yScore(d.s?.med ?? 0))
        .attr('y2', (d) => yScore(d.s?.med ?? 0))
        .attr('opacity', (d) => (d.s ? 1 : 0.18))

      boxAll.select('circle.mean')
        .transition()
        .duration(550)
        .attr('cx', 0)
        .attr('cy', (d) => yScore(d.s?.med ?? 0))
        .attr('stroke', (d) => colors.get(d.program))
        .attr('opacity', (d) => (d.s ? 1 : 0.18))

      box.exit().remove()

      meta.textContent = `Term: ${agg.term} · selected weeks: ${lo}–${hi}`
      status.text(`Selected weeks: ${lo}–${hi} (${nRows} rows)`)
    }

    const brush = d3x
      .brushX()
      .extent([
        [0, 0],
        [leftPlotW, leftPlotH],
      ])
      .on('brush end', (event) => {
        if (!event.selection) return
        const [a, b] = event.selection
        updateDetail([x.invert(a), x.invert(b)])
      })

    const brushG = leftPlot.append('g').attr('class', 'brush')
    brushG.call(brush)
    brushG.call(brush.move, [x(defaultRange[0]), x(defaultRange[1])])
    updateDetail(defaultRange)
  }

  function renderAnimationDemo(host, agg) {
    host.innerHTML = ''
    const meta = $('#animMeta')
    const playBtn = $('#animPlay')
    const slider = $('#animWeek')
    const label = $('#animWeekLabel')

    const width = 980
    const height = 320
    const margin = { top: 54, right: 26, bottom: 44, left: 84 }
    const plotW = width - margin.left - margin.right
    const plotH = height - margin.top - margin.bottom

    const colors = colorMap(agg.programs)
    const [minWeek, maxWeek] = d3x.extent(agg.weeks)

    slider.min = String(minWeek)
    slider.max = String(maxWeek)
    slider.value = String(agg.weeks[Math.max(0, Math.floor(agg.weeks.length / 4))] || minWeek)

    const byWeek = new Map()
    const allRates = []
    for (const week of agg.weeks) {
      const entries = agg.programs.map((program) => {
        const v = agg.valueByProgramWeek.get(program)?.get(week)
        if (Number.isFinite(v)) allRates.push(v)
        return { program, pass_rate: Number.isFinite(v) ? v : NaN }
      })
      byWeek.set(week, entries)
    }

    const e = d3x.extent(allRates)
    const xMin = clamp((e[0] ?? 0.6) - 0.04, 0, 1)
    const xMax = clamp((e[1] ?? 0.9) + 0.04, 0, 1)

    const x = d3x.scaleLinear().domain([xMin, xMax]).nice().range([0, plotW])
    const y = d3x.scaleBand().domain(agg.programs).range([0, plotH]).padding(0.35)

    const svg = d3x
      .select(host)
      .append('svg')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('role', 'img')
      .attr('aria-label', 'Animated dot plot')
      .style('font-family', 'inherit')

    svg
      .append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', width)
      .attr('height', height)
      .attr('rx', 20)
      .attr('ry', 20)
      .attr('fill', theme.panelFill)
      .attr('stroke', theme.panelStroke)
      .attr('stroke-width', 1.2)

    svg
      .append('text')
      .attr('x', margin.left)
      .attr('y', 30)
      .attr('fill', theme.text)
      .style('font-size', '16px')
      .style('font-weight', '900')
      .text('Animation = transitions between states (fixed scale)')

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

    g.append('g')
      .selectAll('line')
      .data(x.ticks(4))
      .enter()
      .append('line')
      .attr('x1', (t) => x(t))
      .attr('x2', (t) => x(t))
      .attr('y1', 0)
      .attr('y2', plotH)
      .attr('stroke', theme.grid)
      .attr('stroke-width', 1)

    const xAxisG = g.append('g').attr('transform', `translate(0,${plotH})`).call(d3x.axisBottom(x).ticks(4).tickFormat(d3x.format('.2f')))
    const yAxisG = g.append('g').call(d3x.axisLeft(y).tickSizeOuter(0))
    styleAxis(xAxisG)
    styleAxis(yAxisG)

    g.append('text')
      .attr('x', plotW / 2)
      .attr('y', plotH + 36)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.textMuted)
      .style('font-size', '12px')
      .style('font-weight', '650')
      .text('pass_rate (fixed range)')

    const dotsG = g.append('g')

    function updateWeek(week, animate = true) {
      const frame = byWeek.get(week) || []
      meta.textContent = `Term: ${agg.term} · Week ${week}`
      label.textContent = `Week ${week}`

      const t = animate ? svg.transition().duration(650).ease(d3x.easeCubicOut) : svg.transition().duration(0)

      const sel = dotsG.selectAll('circle').data(frame, (d) => d.program)
      sel
        .enter()
        .append('circle')
        .attr('cy', (d) => (y(d.program) ?? 0) + y.bandwidth() / 2)
        .attr('cx', x(xMin))
        .attr('r', 7)
        .attr('fill', theme.bg)
        .attr('stroke', (d) => colors.get(d.program))
        .attr('stroke-width', 2.6)
        .merge(sel)
        .transition(t)
        .attr('cy', (d) => (y(d.program) ?? 0) + y.bandwidth() / 2)
        .attr('cx', (d) => x(Number.isFinite(d.pass_rate) ? d.pass_rate : xMin))
        .attr('opacity', (d) => (Number.isFinite(d.pass_rate) ? 1 : 0.22))

      sel.exit().remove()
    }

    let playing = false
    let timer = null

    function setPlayState(next) {
      playing = next
      playBtn.innerHTML = `<span class=\"dot\" style=\"background: var(--violet)\"></span>${playing ? 'Pause' : 'Play'}`
      if (!playing && timer) {
        clearInterval(timer)
        timer = null
      }
      if (playing && !timer) {
        timer = setInterval(() => {
          const w = Number(slider.value)
          const nextWeek = w >= maxWeek ? minWeek : w + 1
          slider.value = String(nextWeek)
          updateWeek(nextWeek)
        }, 900)
      }
    }

    slider.addEventListener('input', () => updateWeek(Number(slider.value)))
    playBtn.addEventListener('click', () => setPlayState(!playing))

    const startWeek = Number(slider.value)
    updateWeek(startWeek, false)
    setPlayState(false)
  }

  function renderAppDemo(host, rows, baseAgg) {
    host.innerHTML = ''
    const meta = $('#appMeta')
    const termSel = $('#appTerm')
    const weekStart = $('#appWeekStart')
    const weekEnd = $('#appWeekEnd')
    const weekLabel = $('#appWeekLabel')
    const progHost = $('#appPrograms')
    const kpi = $('#appKpi')
    const kpiDetail = $('#appKpiDetail')

    const terms = Array.from(new Set(rows.map((r) => r.term))).sort()
    termSel.innerHTML = ''
    terms.forEach((t) => {
      const opt = document.createElement('option')
      opt.value = t
      opt.textContent = t
      termSel.appendChild(opt)
    })
    termSel.value = baseAgg.term

    const [minWeek, maxWeek] = d3x.extent(baseAgg.weeks)
    weekStart.min = String(minWeek)
    weekStart.max = String(maxWeek)
    weekEnd.min = String(minWeek)
    weekEnd.max = String(maxWeek)
    weekStart.value = String(minWeek)
    weekEnd.value = String(maxWeek)

    let selectedPrograms = new Set(baseAgg.programs.slice(0, 3))

    function buildProgramToggles(programs) {
      progHost.innerHTML = ''
      const colors = colorMap(programs)
      programs.forEach((p) => {
        const btn = document.createElement('button')
        btn.type = 'button'
        btn.className = 'pill'
        btn.style.cursor = 'pointer'
        btn.innerHTML = `<span class=\"swatch\" style=\"background:${colors.get(p)}\"></span><strong style=\"color: var(--text)\">${p}</strong>`
        btn.addEventListener('click', () => {
          if (selectedPrograms.has(p)) selectedPrograms.delete(p)
          else selectedPrograms.add(p)
          if (selectedPrograms.size === 0) selectedPrograms = new Set(programs.slice(0, 1))
          update()
        })
        progHost.appendChild(btn)
      })
    }

    buildProgramToggles(baseAgg.programs)

    function currentRange() {
      const a = Number(weekStart.value)
      const b = Number(weekEnd.value)
      return [Math.min(a, b), Math.max(a, b)]
    }

    function renderLines(programs, weeks, series, colors) {
      host.innerHTML = ''

      const width = 980
      const height = 320
      const margin = { top: 40, right: 18, bottom: 46, left: 62 }
      const plotW = width - margin.left - margin.right
      const plotH = height - margin.top - margin.bottom

      const [w0, w1] = d3x.extent(weeks)
      const vals = series.flatMap((s) => s.values.map((d) => d.pass_rate))
      const ext = d3x.extent(vals)
      const yMin = clamp((ext[0] ?? 0.6) - 0.04, 0, 1)
      const yMax = clamp((ext[1] ?? 0.9) + 0.04, 0, 1)

      const x = d3x.scaleLinear().domain([w0, w1]).range([0, plotW])
      const y = d3x.scaleLinear().domain([yMin, yMax]).nice().range([plotH, 0])

      const svg = d3x
        .select(host)
        .append('svg')
        .attr('viewBox', `0 0 ${width} ${height}`)
        .attr('role', 'img')
        .attr('aria-label', 'Mini app line chart')
        .style('font-family', 'inherit')

      svg
        .append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', width)
        .attr('height', height)
        .attr('rx', 20)
        .attr('ry', 20)
        .attr('fill', theme.panelFill)

      svg
        .append('text')
        .attr('x', margin.left)
        .attr('y', 26)
        .attr('fill', theme.text)
        .style('font-size', '14px')
        .style('font-weight', '900')
        .text('Output: chart updated by inputs')

      const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

      g.append('g')
        .selectAll('line')
        .data(y.ticks(4))
        .enter()
        .append('line')
        .attr('x1', 0)
        .attr('x2', plotW)
        .attr('y1', (t) => y(t))
        .attr('y2', (t) => y(t))
        .attr('stroke', theme.grid)
        .attr('stroke-width', 1)

      const xAxisG = g.append('g').attr('transform', `translate(0,${plotH})`).call(d3x.axisBottom(x).ticks(10).tickFormat(d3x.format('d')))
      const yAxisG = g.append('g').call(d3x.axisLeft(y).ticks(4).tickFormat(d3x.format('.2f')))
      styleAxis(xAxisG)
      styleAxis(yAxisG)

      const line = d3x
        .line()
        .x((d) => x(d.week))
        .y((d) => y(d.pass_rate))
        .curve(d3x.curveMonotoneX)

      g.append('g')
        .selectAll('path')
        .data(series)
        .enter()
        .append('path')
        .attr('fill', 'none')
        .attr('stroke', (d) => colors.get(d.program))
        .attr('stroke-width', 3.0)
        .attr('stroke-linecap', 'round')
        .attr('stroke-linejoin', 'round')
        .attr('d', (d) => line(d.values))
    }

    function update() {
      const term = termSel.value
      const agg = aggregatePassRate(rows, term)
      const colors = colorMap(agg.programs)

      const [lo, hi] = currentRange()
      weekLabel.textContent = `Weeks ${lo}–${hi}`

      const programs = agg.programs.filter((p) => selectedPrograms.has(p))
      if (programs.length === 0) programs.push(agg.programs[0])

      const weeks = agg.weeks.filter((w) => w >= lo && w <= hi)

      const series = agg.series
        .filter((s) => programs.includes(s.program))
        .map((s) => ({ program: s.program, values: s.values.filter((v) => v.week >= lo && v.week <= hi) }))

      const rowsView = agg.termRows.filter((r) => programs.includes(r.program) && r.week >= lo && r.week <= hi)
      const n_students = d3x.sum(rowsView, (d) => d.n_students)
      const n_pass = d3x.sum(rowsView, (d) => d.n_pass)
      const pass_rate = n_students > 0 ? n_pass / n_students : NaN

      kpi.textContent = Number.isFinite(pass_rate) ? pass_rate.toFixed(3) : '—'
      kpiDetail.textContent = `${n_pass} / ${n_students} students · ${rowsView.length} rows`
      meta.textContent = `Term: ${term} · programs: ${programs.join(', ')}`

      renderLines(programs, weeks, series, colors)
    }

    termSel.addEventListener('change', () => {
      const agg = aggregatePassRate(rows, termSel.value)
      const [w0, w1] = d3x.extent(agg.weeks)
      weekStart.min = String(w0)
      weekStart.max = String(w1)
      weekEnd.min = String(w0)
      weekEnd.max = String(w1)
      weekStart.value = String(w0)
      weekEnd.value = String(w1)
      selectedPrograms = new Set(agg.programs.slice(0, 3))
      buildProgramToggles(agg.programs)
      update()
    })
    weekStart.addEventListener('input', update)
    weekEnd.addEventListener('input', update)

    update()
  }

  async function main() {
    const rows = await loadRows()
    const term = latestTerm(rows)
    const agg = aggregatePassRate(rows, term)

    renderHoverLegendDemo($('#demo-hover-legend'), agg)
    renderLinkedViewsDemo($('#demo-linked'), agg)
    renderAnimationDemo($('#demo-animation'), agg)
    renderAppDemo($('#demo-app'), rows, agg)

    $('#animWeek').max = String(d3x.max(agg.weeks) ?? 20)
    $('#animWeek').min = String(d3x.min(agg.weeks) ?? 1)
  }

  main().catch((err) => {
    console.error(err)
    $('#hoverLegendMeta').textContent = 'Failed to load dataset.'
    $('#linkedMeta').textContent = 'Failed to load dataset.'
    $('#animMeta').textContent = 'Failed to load dataset.'
    $('#appMeta').textContent = 'Failed to load dataset.'
  })
})()
