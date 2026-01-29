import http from 'node:http'
import path from 'node:path'
import fs from 'node:fs/promises'
import { existsSync, createReadStream } from 'node:fs'
import { chromium } from 'playwright-chromium'

const projectRoot = process.cwd()
const slideArg = process.argv[2] || 'slides.md'
const distArg = process.argv[3] || 'dist'
const outArg = process.argv[4] || 'inspect'

const distDir = path.isAbsolute(distArg) ? distArg : path.join(projectRoot, distArg)
const slidesPath = path.isAbsolute(slideArg) ? slideArg : path.join(projectRoot, slideArg)
const outDir = path.isAbsolute(outArg) ? outArg : path.join(projectRoot, outArg)

function countSlides(markdown) {
  const lines = markdown.split(/\r?\n/)
  let inCode = false
  let inFrontmatter = false
  let slideCount = 0

  const isFence = (line) => /^```/.test(line.trim())
  const isDelimiter = (line) => line.trim() === '---'
  const isYamlKey = (line) => /^[A-Za-z0-9_-]+\s*:\s*/.test(line)

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (isFence(line)) {
      inCode = !inCode
      continue
    }
    if (inCode) continue

    if (i === 0 && isDelimiter(line) && isYamlKey(lines[i + 1] || '')) {
      slideCount = 1
      inFrontmatter = true
      continue
    }

    if (isDelimiter(line)) {
      if (inFrontmatter) {
        inFrontmatter = false
        continue
      }
      slideCount += 1
      let j = i + 1
      while (j < lines.length && lines[j].trim() === '') j++
      if (j < lines.length && isYamlKey(lines[j])) inFrontmatter = true
    }
  }

  return slideCount
}

function contentType(filepath) {
  const ext = path.extname(filepath).toLowerCase()
  switch (ext) {
    case '.html': return 'text/html; charset=utf-8'
    case '.js': return 'text/javascript; charset=utf-8'
    case '.css': return 'text/css; charset=utf-8'
    case '.json': return 'application/json; charset=utf-8'
    case '.svg': return 'image/svg+xml'
    case '.png': return 'image/png'
    case '.jpg':
    case '.jpeg': return 'image/jpeg'
    case '.webp': return 'image/webp'
    case '.map': return 'application/json; charset=utf-8'
    case '.woff2': return 'font/woff2'
    default: return 'application/octet-stream'
  }
}

async function startStaticServer(rootDir) {
  const server = http.createServer((req, res) => {
    try {
      const url = new URL(req.url || '/', 'http://localhost')
      let pathname = decodeURIComponent(url.pathname)
      if (pathname.endsWith('/')) pathname += 'index.html'
      const safePath = path.normalize(pathname).replace(/^(\.\.(\/|\\|$))+/, '')
      let filepath = path.join(rootDir, safePath)

      if (!filepath.startsWith(rootDir)) {
        res.statusCode = 403
        res.end('Forbidden')
        return
      }

      if (!existsSync(filepath)) {
        const hasExtension = path.extname(pathname) !== ''
        if (!hasExtension) filepath = path.join(rootDir, 'index.html')
      }

      if (!existsSync(filepath)) {
        res.statusCode = 404
        res.end('Not Found')
        return
      }

      res.setHeader('Content-Type', contentType(filepath))
      createReadStream(filepath).pipe(res)
    }
    catch (err) {
      res.statusCode = 500
      res.end(String(err?.message || err))
    }
  })

  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
  const address = server.address()
  const port = typeof address === 'object' && address ? address.port : 0
  return { server, baseUrl: `http://127.0.0.1:${port}/` }
}

async function main() {
  if (!existsSync(distDir))
    throw new Error(`Missing \`${distArg}/\`. Run the matching Slidev build first.`)

  const slidesMd = await fs.readFile(slidesPath, 'utf8')
  const totalSlides = countSlides(slidesMd)

  await fs.mkdir(outDir, { recursive: true })
  const deckId = path.basename(slidesPath).replace(/\.[^.]+$/, '')
  const deckOut = path.join(outDir, deckId)
  await fs.mkdir(deckOut, { recursive: true })

  const { server, baseUrl } = await startStaticServer(distDir)

  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 980, height: 552 } })

  const warnings = []
  try {
    for (let no = 1; no <= totalSlides; no++) {
      await page.goto(`${baseUrl}${no}`, { waitUntil: 'load' })
      await page.waitForSelector(`[data-slidev-no="${no}"]`, { timeout: 15_000 })

      await page.waitForTimeout(100)

      // Mermaid render check.
      await page.waitForFunction((slideNo) => {
        const root = document.querySelector(`[data-slidev-no="${slideNo}"]`)
        if (!root) return false
        const mermaids = Array.from(root.querySelectorAll('.mermaid'))
        return mermaids.every((m) => m.querySelector('svg'))
      }, no, { timeout: 10_000 }).catch(() => {})

      // D3/Vue SVG render check.
      await page.waitForFunction((slideNo) => {
        const root = document.querySelector(`[data-slidev-no="${slideNo}"]`)
        if (!root) return false
        const frames = Array.from(root.querySelectorAll('.viz-frame'))
        return frames.every((f) => f.querySelector('svg'))
      }, no, { timeout: 5_000 }).catch(() => {})

      const metrics = await page.evaluate((slideNo) => {
        const root = document.querySelector(`[data-slidev-no="${slideNo}"]`)
        const title = root?.querySelector('h1, h2')?.textContent?.trim() || ''
        const text = root?.textContent || ''

        let maxSvgFontPx = 0
        const svgTexts = Array.from(root?.querySelectorAll('.viz-frame svg text') || [])
        for (const t of svgTexts) {
          const cs = getComputedStyle(t)
          const px = Number.parseFloat(cs.fontSize || '0')
          if (Number.isFinite(px)) maxSvgFontPx = Math.max(maxSvgFontPx, px)
        }

        const iconOk = Array.from(root?.querySelectorAll('.icon-inline') || []).map((el) => {
          const tag = (el.tagName || '').toLowerCase()
          if (tag === 'svg') {
            const bbox = el.getBoundingClientRect()
            const hasPath = Boolean(el.querySelector('path, circle, rect, polygon, polyline, line'))
            return bbox.width >= 8 && bbox.height >= 8 && hasPath
          }
          const cs = getComputedStyle(el)
          const hasMask =
            (cs.maskImage && cs.maskImage !== 'none') ||
            (cs.webkitMaskImage && cs.webkitMaskImage !== 'none') ||
            (cs.mask && cs.mask !== 'none') ||
            (cs.webkitMask && cs.webkitMask !== 'none')
          const hasBg = Boolean(cs.backgroundImage && cs.backgroundImage !== 'none')
          return Boolean(hasMask || hasBg)
        })

        return {
          title,
          hasCarbonLiteral: text.includes('<carbon:'),
          maxSvgFontPx,
          iconCount: iconOk.length,
          iconsOk: iconOk.every(Boolean),
        }
      }, no)

      if (metrics.hasCarbonLiteral) {
        warnings.push({ no, type: 'literal-icon-tag', title: metrics.title })
      }

      // Extremely large SVG text usually means a layout scale bug.
      if (metrics.maxSvgFontPx >= 72) {
        warnings.push({ no, type: 'svg-text-too-large', title: metrics.title, value: metrics.maxSvgFontPx })
      }

      if (metrics.iconCount > 0 && !metrics.iconsOk) {
        warnings.push({ no, type: 'icons-not-rendering', title: metrics.title })
      }

      await page.screenshot({ path: path.join(deckOut, `slide-${String(no).padStart(2, '0')}.png`) })
    }
  }
  finally {
    await page.close()
    await browser.close()
    await new Promise((resolve) => server.close(resolve))
  }

  if (warnings.length) {
    console.error(`Warnings on ${warnings.length} slide(s):`)
    for (const w of warnings) {
      const details = w.value ? ` value=${Math.round(w.value)}` : ''
      console.error(`- #${w.no} [${w.type}] ${w.title || ''}${details}`)
    }
    console.error(`Screenshots saved to \`${path.relative(projectRoot, deckOut)}/\`.`)
    process.exit(2)
  }

  console.log(`OK: ${totalSlides} slide(s) rendered. Screenshots saved to \`${path.relative(projectRoot, deckOut)}/\`.`)
}

main().catch((err) => {
  console.error(err?.stack || err)
  process.exit(1)
})
