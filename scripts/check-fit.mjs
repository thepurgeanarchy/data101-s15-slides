import http from 'node:http'
import path from 'node:path'
import fs from 'node:fs/promises'
import { existsSync, createReadStream } from 'node:fs'
import { chromium } from 'playwright-chromium'

const projectRoot = process.cwd()
const distDir = path.join(projectRoot, 'dist')
const slidesPath = path.join(projectRoot, 'slides.md')

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

      // SPA fallback for history routing: `/2` should serve `index.html`
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
    throw new Error('Missing `dist/`. Run `npm run build` first.')

  const slidesMd = await fs.readFile(slidesPath, 'utf8')
  const totalSlides = countSlides(slidesMd)

  const { server, baseUrl } = await startStaticServer(distDir)

  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 980, height: 552 } })

  const failures = []
  try {
    for (let no = 1; no <= totalSlides; no++) {
      await page.goto(`${baseUrl}${no}`, { waitUntil: 'load' })
      await page.waitForSelector(`[data-slidev-no="${no}"]`, { timeout: 15_000 })

      // Give Mermaid a chance to render on slides that have diagrams.
      await page.waitForFunction((slideNo) => {
        const root = document.querySelector(`[data-slidev-no="${slideNo}"]`)
        if (!root) return false
        const mermaids = Array.from(root.querySelectorAll('.mermaid'))
        return mermaids.every((m) => m.querySelector('svg'))
      }, no, { timeout: 10_000 }).catch(() => {})

      const result = await page.evaluate((slideNo) => {
        const root = document.querySelector(`[data-slidev-no="${slideNo}"]`)
        const layout = root?.querySelector('.slidev-layout')
        const title = root?.querySelector('h1, h2')?.textContent?.trim() || ''
        if (!root || !layout) return { ok: true, title }

        const overflowY = layout.scrollHeight - layout.clientHeight
        const overflowX = layout.scrollWidth - layout.clientWidth

        const rect = layout.getBoundingClientRect()
        const rootRect = root.getBoundingClientRect()

        const outLeft = rootRect.left - rect.left
        const outTop = rootRect.top - rect.top
        const outRight = rect.right - rootRect.right
        const outBottom = rect.bottom - rootRect.bottom

        const ok =
          overflowY <= 2 &&
          overflowX <= 2 &&
          outLeft <= 1 &&
          outTop <= 1 &&
          outRight <= 1 &&
          outBottom <= 1

        return {
          ok,
          title,
          overflowX,
          overflowY,
          outLeft,
          outTop,
          outRight,
          outBottom,
          client: { w: layout.clientWidth, h: layout.clientHeight },
          scroll: { w: layout.scrollWidth, h: layout.scrollHeight },
        }
      }, no)

      if (!result.ok) {
        failures.push({ no, ...result })
        const outDir = path.join(projectRoot, 'dist', 'fit-check')
        await fs.mkdir(outDir, { recursive: true })
        await page.screenshot({ path: path.join(outDir, `slide-${String(no).padStart(2, '0')}.png`) })
      }
    }
  }
  finally {
    await page.close()
    await browser.close()
    await new Promise((resolve) => server.close(resolve))
  }

  if (failures.length) {
    console.error(`Layout overflow detected on ${failures.length} slide(s):`)
    for (const f of failures) {
      console.error(
        `- #${f.no} ${f.title ? `(${f.title}) ` : ''}` +
        `overflowX=${Math.round(f.overflowX)} overflowY=${Math.round(f.overflowY)} ` +
        `out=[${Math.round(f.outLeft)},${Math.round(f.outTop)},${Math.round(f.outRight)},${Math.round(f.outBottom)}]`,
      )
    }
    console.error('Screenshots saved to `dist/fit-check/`.')
    process.exit(1)
  }

  console.log(`OK: ${totalSlides} slide(s) checked, no overflow detected.`)
}

main().catch((err) => {
  console.error(err?.stack || err)
  process.exit(1)
})
