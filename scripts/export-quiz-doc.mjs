import fs from 'node:fs/promises'
import fsSync from 'node:fs'
import path from 'node:path'
import { chromium } from 'playwright-chromium'
import { marked } from 'marked'

const projectRoot = process.cwd()

const defaultFooter = `<div style="font-size: 8.2pt; width: 100%; text-align: center; color: #555; font-family: Arial, sans-serif; border-top: 0.4mm solid #d4dce6; padding: 1mm 0 0 0;">Page <span class="pageNumber"></span> of <span class="totalPages"></span></div>`

const compactSheetStyle = `
  .cover { font-size: 8.1pt !important; line-height: 1.06 !important; columns: 2 86mm !important; column-gap: 3.1mm !important; column-fill: auto !important; color: #0f172a !important; }
  .cover h1 { font-size: 13.5pt !important; margin: 0 0 0.3mm !important; padding-bottom: 0.8mm !important; }
  .cover h2 { font-size: 9.2pt !important; margin: 0.4mm 0 0.5mm !important; }
  .cover h3 { font-size: 8.7pt !important; margin: 0.7mm 0 0.4mm !important; padding: 0.4mm 0.4mm 0.3mm !important; }
  .cover p, .cover ul, .cover ol, .cover li { font-size: 8.1pt !important; margin: 0 0 0.9mm !important; break-inside: auto !important; page-break-inside: auto !important; orphans: 2 !important; widows: 2 !important; }
  .cover .letterhead { padding: 1.2mm 1.8mm !important; margin-bottom: 0.8mm !important; column-span: all !important; }
  .cover .letterhead img { width: 11mm !important; }
  .cover .school .dept { font-size: 9.2pt !important; }
  .cover .school .course { font-size: 7.8pt !important; }
  .cover .student-meta { margin: 0.6mm 0 0.7mm !important; padding: 0.5mm 0.7mm !important; font-size: 7.6pt !important; }
  .cover .meta-boxes { margin: 0.6mm 0 0.9mm !important; font-size: 7.6pt !important; padding: 0.45mm 0.6mm !important; }
  .cover .question-divider { margin: 0.9mm 0 !important; }
  .cover .answer-space { margin: 0.28mm 0 0.6mm !important; min-height: 0 !important; gap: 1mm !important; padding-left: 0.2mm !important; }
  .cover .answer-line { border-bottom: 0.8px solid #1f2937 !important; height: 3.0mm !important; }
  .cover .mcq-answer .answer-line { height: 3.3mm !important; }
  .cover .short-answer .answer-line { height: 2.6mm !important; }
  .cover .rank-line, .cover .option-line { gap: 0.9mm !important; }
  .cover .matching-line > .match-slot, .cover .match-slot { width: 18mm !important; height: 3.8mm !important; }
  .cover hr { margin: 0.6mm 0 !important; }
`

function stripFrontmatter(source) {
  if (!source.startsWith('---\n'))
    return source

  const endIndex = source.indexOf('\n---', 4)
  if (endIndex < 0)
    return source

  return source.slice(endIndex + 5)
}

function extractStylesAndScripts(source) {
  const cssBlocks = []
  let content = source
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, (match) => {
      const body = match.replace(/^<style[^>]*>/i, '').replace(/<\/style>$/i, '')
      cssBlocks.push(body)
      return ''
    })
    .replace(/<script[\s\S]*?<\/script>/gi, '')

  return {
    content,
    style: cssBlocks.join('\n'),
  }
}

function toDataUri(ext, buffer) {
  const mimeMap = {
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
  }
  const mime = mimeMap[ext.toLowerCase()] || 'application/octet-stream'
  return `data:${mime};base64,${buffer.toString('base64')}`
}

async function normalizeAssetRefs(html, sourceDir) {
  const srcRegex = /src=(["'])([^"']+\.(?:svg|png|jpe?g|webp|gif))\1/gi
  const matches = [...html.matchAll(srcRegex)]

  if (!matches.length)
    return html

  const cache = new Map()
  let stamped = html

  for (const match of matches) {
    const full = match[0]
    const quote = match[1]
    const src = match[2]
    if (src.startsWith('http') || src.startsWith('data:'))
      continue

    const relOrAbs = src.startsWith('..') || src.startsWith('.') ? path.join(sourceDir, src) : path.join(projectRoot, src)
    const resolved = path.resolve(relOrAbs)

    if (!fsSync.existsSync(resolved))
      continue

    if (!cache.has(src)) {
      const buffer = await fs.readFile(resolved)
      cache.set(src, toDataUri(path.extname(resolved), buffer))
    }

    stamped = stamped.replaceAll(full, `src=${quote}${cache.get(src)}${quote}`)
  }

  return stamped
}

async function toPrintHtml(source, sourceDir, compact) {
  const noFrontmatter = stripFrontmatter(source)
  const { content, style } = extractStylesAndScripts(noFrontmatter)
  const mdBody = content.trim()
  const bodyHtml = marked.parse(mdBody, {
    mangle: false,
    headerIds: false,
    gfm: true,
  })

  const stampedBody = await normalizeAssetRefs(bodyHtml, sourceDir)
  const densityCss = compact ? compactSheetStyle : ''

  const mergedCss = `
    @page { size: A4; margin: 8mm 8mm 8mm 8mm; }
    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; }
    .cover { margin: 0; }
    @media print {
      .page-break { page-break-before: always; }
    }
    ${style}
    ${densityCss}
  `

  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <style>${mergedCss}</style>
  </head>
  <body>
    <div class="cover">
      ${stampedBody}
    </div>
  </body>
</html>`
}

async function exportPdf(sourcePath, outputPath) {
  const absSource = path.isAbsolute(sourcePath) ? sourcePath : path.join(projectRoot, sourcePath)
  const absOutput = path.isAbsolute(outputPath) ? outputPath : path.join(projectRoot, outputPath)

  const markdown = await fs.readFile(absSource, 'utf8')
  const isAnswerSheet = absSource.includes(path.join('quiz-answer-sheets', path.sep))
  const html = await toPrintHtml(markdown, path.dirname(absSource), isAnswerSheet)

  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1240, height: 1754 } })
  await page.setContent(html, { waitUntil: 'load' })
  await page.emulateMedia({ media: 'print' })
  await page.waitForLoadState('networkidle')

  await fs.mkdir(path.dirname(absOutput), { recursive: true })

  await page.pdf({
    path: absOutput,
    format: 'A4',
    printBackground: true,
    displayHeaderFooter: true,
    footerTemplate: defaultFooter,
    headerTemplate: '<div></div>',
    margin: {
      top: '8mm',
      right: '8mm',
      bottom: '12mm',
      left: '8mm',
    },
  })

  await page.close()
  await browser.close()
}

async function main() {
  const args = process.argv.slice(2)
  if (!args.length || args.length % 2 !== 0) {
    console.error('Usage: node scripts/export-quiz-doc.mjs <source.md> <output.pdf> [<source.md> <output.pdf> ...]')
    process.exit(1)
  }

  for (let i = 0; i < args.length; i += 2) {
    const source = args[i]
    const output = args[i + 1]
    console.log(`Exporting ${source} -> ${output}`)
    await exportPdf(source, output)
  }
}

main().catch((err) => {
  console.error(err?.stack || err)
  process.exit(1)
})
