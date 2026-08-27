// Screenshot runner: builds nothing, expects `pnpm build` to have run.
// next.config.ts sets `output: 'export'`, so `next start` refuses to run; serve the exported out/
// directory over a tiny static server instead, capture PC/SP shots into shots/, exit.
import { createServer } from 'node:http'
import { access, mkdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import puppeteer from 'puppeteer-core'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const OUT = path.join(ROOT, 'shots')
const EXPORT_DIR = path.join(ROOT, 'out')
const PORT = 3100
const URL = `http://localhost:${PORT}`
const MIME = {
  '.css': 'text/css',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
}
const PC = { width: 1440, height: 900 }
const SP = { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true }

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

// Mirrors the export host's routing: `/` -> index.html, extension-less paths -> `<path>.html`.
const resolveExportFile = (url) => {
  let file = decodeURIComponent(url.split('?')[0].split('#')[0])
  if (file.endsWith('/')) file += 'index.html'
  if (!path.extname(file)) file += '.html'
  const resolved = path.resolve(EXPORT_DIR, `.${file}`)
  return resolved.startsWith(EXPORT_DIR) ? resolved : null
}

const startServer = async () => {
  await access(path.join(EXPORT_DIR, 'index.html')).catch(() => {
    throw new Error(`No export found at ${EXPORT_DIR}. Run \`pnpm build\` first.`)
  })
  const server = createServer(async (req, res) => {
    const file = resolveExportFile(req.url ?? '/')
    if (!file) {
      res.writeHead(403).end('forbidden')
      return
    }
    try {
      const body = await readFile(file)
      res.writeHead(200, { 'content-type': MIME[path.extname(file)] ?? 'application/octet-stream' })
      res.end(body)
    } catch {
      res.writeHead(404).end('not found')
    }
  })
  await new Promise((resolve, reject) => {
    server.once('error', reject)
    server.listen(PORT, resolve)
  })
  return server
}

const stopServer = (server) => {
  if (server) server.close()
}

const assert = (cond, message) => {
  if (!cond) throw new Error(`Assertion failed: ${message}`)
}

const shot = async (page, name) => {
  const file = path.join(OUT, `${name}.png`)
  await page.screenshot({ path: file })
  process.stdout.write(`saved ${path.relative(ROOT, file)}\n`)
}

// globals.css sets `scroll-behavior: smooth`; disable it so programmatic jumps are instant for captures.
const disableSmoothScroll = (page) =>
  page.evaluate(() => {
    document.documentElement.style.scrollBehavior = 'auto'
  })

// Scroll through the whole page so every FlowVox reveal has fired, then return to top.
const scrollThrough = async (page, step = 400) => {
  await disableSmoothScroll(page)
  await page.evaluate(async (s) => {
    const wait = (ms) => new Promise((r) => setTimeout(r, ms))
    const h = document.documentElement.scrollHeight
    for (let y = 0; y < h; y += s) {
      window.scrollTo({ top: y, behavior: 'instant' })
      await wait(120)
    }
    window.scrollTo({ top: 0, behavior: 'instant' })
    await wait(700)
  }, step)
}

const scrollTo = async (page, selector, wait = 800) => {
  await disableSmoothScroll(page)
  await page.evaluate((sel) => {
    const el = document.querySelector(sel)
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY - 120
    window.scrollTo({ top, behavior: 'instant' })
  }, selector)
  await sleep(wait)
}

const fullShot = async (page, name) => {
  const file = path.join(OUT, `${name}.png`)
  await page.screenshot({ path: file, fullPage: true })
  process.stdout.write(`saved ${path.relative(ROOT, file)}\n`)
}

const runPc = async (page) => {
  await page.setViewport(PC)
  await page.goto(URL, { waitUntil: 'networkidle0' })
  await sleep(900)
  await shot(page, 'pc-hero')

  await page.hover('#js-lineupList li:nth-child(3) a')
  await sleep(700)
  await shot(page, 'pc-hover-card3')

  await page.evaluate(() => window.scrollTo(0, 900))
  await sleep(600)
  const isMini = await page.evaluate(() =>
    document.querySelector('#siteHeader')?.classList.contains('is-mini'),
  )
  assert(isMini === true, '#siteHeader should have .is-mini after scrolling to 900')
  await shot(page, 'pc-mini-header')

  // Leave the hovered lineup card so the hero overlay (B2 .is-hide) has reverted before full-page capture.
  await page.mouse.move(0, 0)
  await sleep(700)
  await scrollThrough(page)
  await fullShot(page, 'pc-full')

  await scrollTo(page, '#history')
  await shot(page, 'pc-history')

  await scrollTo(page, '#news')
  await shot(page, 'pc-news')

  await scrollTo(page, '#gallery')
  await page.click('#js-galleryBtn')
  await sleep(700)
  const popupOpen = await page.evaluate(() => Boolean(document.querySelector('#popupContents')))
  assert(popupOpen, '#popupContents should exist after clicking the gallery button')
  await shot(page, 'pc-gallery-modal')
  await page.keyboard.press('Escape')
  await sleep(500)
}

const runSp = async (page) => {
  await page.setViewport(SP)
  await page.goto(URL, { waitUntil: 'networkidle0' })
  await sleep(900)
  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
  assert(scrollWidth === SP.width, `SP scrollWidth ${scrollWidth} should equal ${SP.width}`)
  await shot(page, 'sp-hero')

  await page.click('#gNavOpener')
  await sleep(700)
  const navOpen = await page.evaluate(() => document.body.classList.contains('is-navOpen'))
  assert(navOpen, 'body should have .is-navOpen after tapping #gNavOpener')
  await shot(page, 'sp-nav-open')
  await page.click('#gNavOpener')
  await sleep(600)

  await scrollThrough(page, 300)
  const fullWidth = await page.evaluate(() => document.documentElement.scrollWidth)
  assert(fullWidth === SP.width, `SP scrollWidth after scroll ${fullWidth} should equal ${SP.width}`)
  await fullShot(page, 'sp-full')

  await scrollTo(page, '#siteFooter')
  await shot(page, 'sp-footer')
}

const main = async () => {
  await mkdir(OUT, { recursive: true })
  const server = await startServer()
  let browser
  try {
    browser = await puppeteer.launch({
      channel: 'chrome',
      headless: true,
      args: ['--hide-scrollbars', '--no-first-run', '--no-default-browser-check'],
    })
    const page = await browser.newPage()
    await runPc(page)
    await runSp(page)
  } finally {
    if (browser) await browser.close()
    stopServer(server)
  }
}

main().catch((error) => {
  process.stderr.write(`${error?.stack ?? error}\n`)
  process.exit(1)
})
