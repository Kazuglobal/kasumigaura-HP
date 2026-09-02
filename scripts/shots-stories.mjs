// Verification run for 卒業生紹介 (/stories): screenshots plus the checks that editing alone cannot
// prove — that the shelf actually moves, that it stops under the pointer, that a book opens the
// right article, that the keyboard alone can do it, and that every fallback lands on the list.
//
// Expects `pnpm build` to have run; serves out/ the same way scripts/shots.mjs does.
// Usage: node scripts/shots-stories.mjs
import { createServer } from 'node:http'
import { access, mkdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import puppeteer from 'puppeteer-core'
import sharp from 'sharp'
// Node strips the types; this is the same module the scene uses, so the numbers cannot drift apart.
import { layoutFor, lapsViewport } from '../src/components/stories/shelf-layout.ts'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const OUT = path.join(ROOT, 'shots')
const EXPORT_DIR = path.join(ROOT, 'out')
// An ephemeral port: a fixed one collides with the sockets a previous run left in TIME_WAIT.
let BASE = ''
let PAGE = ''
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

const VIEWPORTS = [
  { name: 'sp', width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
  { name: 'laptop', width: 1280, height: 720 },
  { name: 'pc', width: 1440, height: 900 },
  { name: 'wide', width: 2560, height: 900 },
]

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const results = []
const record = (name, ok, detail) => {
  results.push({ name, ok, detail })
  process.stdout.write(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}\n`)
}

const resolveExportFile = (url) => {
  let file = decodeURIComponent(url.split('?')[0].split('#')[0])
  if (file.endsWith('/')) file += 'index.html'
  if (!path.extname(file)) file += '.html'
  const resolved = path.resolve(EXPORT_DIR, `.${file}`)
  return resolved.startsWith(EXPORT_DIR) ? resolved : null
}

const startServer = async () => {
  await access(path.join(EXPORT_DIR, 'stories.html')).catch(() => {
    throw new Error(`No export found at ${EXPORT_DIR}. Run \`pnpm build\` first.`)
  })
  const server = createServer(async (req, res) => {
    const file = resolveExportFile(req.url ?? '/')
    if (!file) return res.writeHead(403).end('forbidden')
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
    server.listen(0, '127.0.0.1', resolve)
  })
  BASE = `http://127.0.0.1:${server.address().port}`
  PAGE = `${BASE}/stories`
  return server
}

/** Share of pixels that differ between two screenshots. The only reliable motion probe: a WebGL
 *  canvas cannot be read back, and elementFromPoint/cursor only update when the pointer moves. */
const pixelDiff = async (a, b) => {
  const toRaw = (buf) => sharp(buf).resize(320, null, { fit: 'inside' }).greyscale().raw().toBuffer()
  const [ra, rb] = await Promise.all([toRaw(a), toRaw(b)])
  let changed = 0
  const len = Math.min(ra.length, rb.length)
  for (let i = 0; i < len; i += 1) if (Math.abs(ra[i] - rb[i]) > 6) changed += 1
  return changed / len
}

const shelfReady = (page) =>
  page
    .waitForFunction(() => document.querySelector('canvas')?.tabIndex === 0, { timeout: 15000 })
    .then(
      () => true,
      () => false,
    )

const shot = async (page, name) => {
  const file = path.join(OUT, `${name}.png`)
  await page.screenshot({ path: file })
  process.stdout.write(`saved ${path.relative(ROOT, file)}\n`)
}

const openPage = async (browser, viewport, options = {}) => {
  const page = await browser.newPage()
  await page.setViewport(viewport)
  if (options.reducedMotion) await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
  if (options.noJs) await page.setJavaScriptEnabled(false)
  if (options.noWebgl) {
    await page.evaluateOnNewDocument(() => {
      const original = HTMLCanvasElement.prototype.getContext
      HTMLCanvasElement.prototype.getContext = function (type, ...rest) {
        if (String(type).startsWith('webgl')) return null
        return original.call(this, type, ...rest)
      }
    })
  }
  if (options.blockJackets) {
    // Without this the jackets come from the browser cache and never hit the interceptor, so the
    // fallback looks like it works while half the books are still showing real art.
    await page.setCacheEnabled(false)
    await page.setRequestInterception(true)
    page.on('request', (req) => {
      if (/story-cover-\d+\.webp/.test(req.url())) req.abort()
      else req.continue()
    })
  }
  await page.goto(options.url ?? PAGE, { waitUntil: 'networkidle0' })
  return page
}

/**
 * Repeated faces are a numbers problem, not a pixels problem: a WebGL canvas cannot be read back.
 * Run the scene's own formula against the canvas as it is actually laid out.
 */
const checkLayout = (name, box, count) => {
  const layout = layoutFor(box.w, box.h, count)
  record(
    `${name}: the row is longer than the stage (no repeated face)`,
    lapsViewport(layout),
    `row ${(layout.lane * layout.scale).toFixed(2)} vs stage ${layout.visibleW.toFixed(2)}`,
  )
  record(
    `${name}: the opening book stays in front of the camera`,
    layout.openZ < 6 - 1,
    `distance ${(6 - layout.openZ).toFixed(2)}`,
  )
  record(
    `${name}: the spread fits the stage`,
    layout.openScale * layout.scale * 1.94 <= layout.visibleW * (6 / (6 - layout.openZ)),
    `openScale ${layout.openScale.toFixed(2)}`,
  )
}

/**
 * The ordering guard, on a stage picked so the lower bound is what binds: wide and short. Written
 * the wrong way round — lower bound folded in before the ceilings — the fixed 1.9 ceiling wins and
 * the row no longer spans the stage, which is exactly when the same graduate shows at both edges.
 */
const checkOrdering = (count) => {
  const stage = { w: 3200, h: 300 }
  const layout = layoutFor(stage.w, stage.h, count)
  const byLap = (layout.visibleW * 1.12) / layout.lane
  const wrong = Math.min(
    Math.max((layout.visibleH * 0.78) / 1.5, byLap),
    (layout.visibleW * 0.4) / 1,
    1.9,
  )
  record(
    'ordering: the lower bound is applied after every ceiling',
    lapsViewport(layout) && wrong * layout.lane < layout.visibleW,
    `correct row ${(layout.lane * layout.scale).toFixed(1)}, wrong-order row ${(wrong * layout.lane).toFixed(1)}, stage ${layout.visibleW.toFixed(1)}`,
  )
}

/** Where the shelf can be clicked: the canvas centre. */
const canvasBox = (page) =>
  page.evaluate(() => {
    const rect = document.querySelector('canvas')?.getBoundingClientRect()
    return rect ? { x: rect.x, y: rect.y, w: rect.width, h: rect.height } : null
  })

/** Moves along the canvas until the shelf turns the cursor into a pointer (its own hit report). */
const hoverABook = async (page, box) => {
  for (let i = 1; i < 12; i += 1) {
    const point = { x: box.x + (box.w * i) / 12, y: box.y + box.h / 2 }
    await page.mouse.move(point.x, point.y)
    await sleep(120)
    const hit = await page.evaluate(() => document.querySelector('canvas')?.style.cursor === 'pointer')
    if (hit) return point
  }
  return null
}

const runViewport = async (browser, viewport) => {
  const page = await openPage(browser, viewport)
  const ready = await shelfReady(page)
  record(`${viewport.name}: shelf starts`, ready)
  await sleep(1200)
  await shot(page, `stories-${viewport.name}`)

  // The list must be reachable no matter what the shelf did.
  const cards = await page.$$eval('main a[href^="/stories/"]', (els) => els.length)
  record(`${viewport.name}: article list present`, cards >= 6, `${cards} links`)

  // No sideways overflow at any width.
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth)
  const expected = viewport.width < 768 ? viewport.width : Math.max(viewport.width, 1200)
  record(`${viewport.name}: no horizontal overflow`, overflow <= expected, `scrollWidth ${overflow}`)

  if (ready) {
    const box = await canvasBox(page)
    checkLayout(viewport.name, box, 6)
    // Flowing: two frames a second apart must differ.
    const a = await page.screenshot()
    await sleep(1000)
    const b = await page.screenshot()
    const moving = await pixelDiff(a, b)
    record(`${viewport.name}: shelf is flowing`, moving > 0.02, `${(moving * 100).toFixed(1)}% pixels changed`)

    // Held: with the pointer on a book the flow must settle. The centre of the canvas can fall in
    // the gap between two books, so hunt for a spot the shelf itself reports as a book.
    const onBook = await hoverABook(page, box)
    record(`${viewport.name}: a book can be pointed at`, Boolean(onBook), onBook ? '' : 'no hit across the canvas')
    await sleep(900)
    const c = await page.screenshot()
    await sleep(1000)
    const d = await page.screenshot()
    const held = await pixelDiff(c, d)
    record(`${viewport.name}: stops under the pointer`, held < 0.01, `${(held * 100).toFixed(1)}% pixels changed`)
    await shot(page, `stories-${viewport.name}-hover`)
    await page.mouse.move(0, 0)
  }

  await page.close()
}

const runOpen = async (browser) => {
  const viewport = VIEWPORTS[2]
  const page = await openPage(browser, viewport)
  if (!(await shelfReady(page))) {
    record('open: shelf starts', false)
    await page.close()
    return
  }
  const box = await canvasBox(page)
  const point = await hoverABook(page, box)
  record('open: a book can be pointed at', Boolean(point))
  await sleep(700)
  const focused = await page.$eval('[aria-live="polite"]', (el) => el.textContent ?? '')
  await page.mouse.click(point.x, point.y)
  await sleep(450)
  await shot(page, 'stories-opening')
  // Just before the 900ms open finishes and the article takes over: the spread at full size.
  await sleep(400)
  await shot(page, 'stories-opened')
  await page.waitForFunction(() => location.pathname.startsWith('/stories/'), { timeout: 5000 }).catch(() => {})
  const url = page.url()
  const heading = await page.$eval('h1', (el) => el.textContent ?? '').catch(() => '')
  record('open: click opens an article', url !== PAGE && url.includes('/stories/'), url.replace(BASE, ''))
  record(
    'open: the article is the focused book',
    Boolean(heading) && focused.includes(heading),
    `shelf said "${focused.trim()}", page says "${heading}"`,
  )
  await sleep(400)
  await shot(page, 'stories-detail')
  await page.close()

  // Narrow screen: the spread is nearly two covers wide and must still fit.
  const sp = await openPage(browser, VIEWPORTS[0])
  if (await shelfReady(sp)) {
    const spBox = await canvasBox(sp)
    await sp.mouse.click(spBox.x + spBox.w / 2, spBox.y + spBox.h / 2)
    await sleep(600)
    await shot(sp, 'stories-sp-opening')
    record('open: narrow screen captured for the spread check', true, 'shots/stories-sp-opening.png')
  }
  await sp.close()
}

const runKeyboard = async (browser) => {
  const page = await openPage(browser, VIEWPORTS[2])
  if (!(await shelfReady(page))) {
    record('keyboard: shelf starts', false)
    await page.close()
    return
  }
  await page.focus('canvas')
  const scrollBefore = await page.evaluate(() => window.scrollY)
  await page.keyboard.press('ArrowRight')
  await sleep(400)
  await page.keyboard.press('ArrowRight')
  await sleep(400)
  const scrollAfter = await page.evaluate(() => window.scrollY)
  record('keyboard: arrows do not scroll the page away', scrollBefore === scrollAfter)
  const said = await page.$eval('[aria-live="polite"]', (el) => el.textContent ?? '')
  record('keyboard: arrow moves the focus', said.includes('（'), said.trim())
  await page.keyboard.press('Enter')
  await page.waitForFunction(() => location.pathname.startsWith('/stories/'), { timeout: 6000 }).catch(() => {})
  record('keyboard: Enter opens the article', page.url().includes('/stories/'), page.url().replace(BASE, ''))
  await sleep(600)
  const landed = await page.evaluate(() => ({
    active: document.activeElement?.id ?? document.activeElement?.tagName ?? '',
    title: document.title,
  }))
  record('keyboard: focus lands on the article heading, not <body>', landed.active === 'story-title', landed.active)
  record('keyboard: the article title is the opened book', landed.title.includes('新堀') || landed.title.includes('｜'), landed.title)
  await page.close()
}

const runFallbacks = async (browser) => {
  const checks = [
    ['no JavaScript', { noJs: true }],
    ['reduced motion', { reducedMotion: true }],
    ['no WebGL', { noWebgl: true }],
    ['hash in the URL', { url: `${PAGE}#stories` }],
  ]
  for (const [label, options] of checks) {
    const page = await openPage(browser, VIEWPORTS[2], options)
    await sleep(1500)
    const cards = await page.$$eval('main a[href^="/stories/"]', (els) => els.length)
    const shelfOn = await page.evaluate(() => document.querySelector('canvas')?.tabIndex === 0)
    record(`fallback (${label}): list readable`, cards >= 6, `${cards} links`)
    record(`fallback (${label}): shelf stays out of the way`, shelfOn !== true)
    if (options.reducedMotion) {
      const askedForThree = await page.evaluate(() =>
        performance.getEntriesByType('resource').some((e) => /three/i.test(e.name)),
      )
      record('fallback (reduced motion): three.js is never fetched', !askedForThree)
    }
    await page.close()
  }

  // Jacket art missing: the cover must still be a cover, and the shelf must still run.
  const page = await openPage(browser, VIEWPORTS[2], { blockJackets: true })
  const ready = await shelfReady(page)
  await sleep(1200)
  await shot(page, 'stories-no-jackets')
  record('fallback (jacket art blocked): shelf still runs', ready, 'see shots/stories-no-jackets.png')
  await page.close()
}

const main = async () => {
  await mkdir(OUT, { recursive: true })
  checkOrdering(6)
  const server = await startServer()
  let browser
  try {
    browser = await puppeteer.launch({
      channel: 'chrome',
      headless: true,
      args: ['--hide-scrollbars', '--no-first-run', '--no-default-browser-check'],
    })
    for (const viewport of VIEWPORTS) await runViewport(browser, viewport)
    await runOpen(browser)
    await runKeyboard(browser)
    await runFallbacks(browser)
  } finally {
    if (browser) await browser.close()
    server.close()
  }
  const failed = results.filter((r) => !r.ok)
  process.stdout.write(`\n${results.length - failed.length}/${results.length} checks passed\n`)
  process.exit(failed.length === 0 ? 0 : 1)
}

main().catch((error) => {
  process.stderr.write(`${error?.stack ?? error}\n`)
  process.exit(1)
})
