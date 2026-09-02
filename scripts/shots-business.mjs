// Verification run for 卒業生事業・店舗紹介 (/business): screenshots plus the checks that editing
// alone cannot prove — that a filter actually narrows the book, that reset restores it, that the
// turn advances the open page in a circle over the *visible* cards only, that a paper really moves
// during the 900ms turn, and that all nine listings are still readable with JavaScript off.
//
// Expects `pnpm build` to have run; serves out/ the same way scripts/shots.mjs does.
// Usage: node scripts/shots-business.mjs
import { createServer } from 'node:http'
import { access, mkdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import puppeteer from 'puppeteer-core'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const OUT = path.join(ROOT, 'shots')
const EXPORT_DIR = path.join(ROOT, 'out')
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
  { name: 'pc', width: 1440, height: 900 },
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
  await access(path.join(EXPORT_DIR, 'business.html')).catch(() => {
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
  PAGE = `${BASE}/business`
  return server
}

/** The state the page is actually in, read the way a reader would see it. */
const readState = (page) =>
  page.evaluate(() => {
    const cards = [...document.querySelectorAll('[data-directory-card]')]
    const visible = cards.filter((card) => !card.hidden)
    const active = cards.find((card) => card.getAttribute('data-book-active') === 'true')
    return {
      cards: cards.length,
      visible: visible.length,
      active: active ? active.querySelector('.business-card__name').textContent : null,
      count: document.querySelector('[data-directory-count]').textContent,
      total: document.querySelector('[data-business-total]').textContent,
      position: document.querySelector('[data-business-position]').textContent,
      nextName: document.querySelector('[data-business-next-name]').textContent,
      emptyShown: !document.querySelector('[data-directory-empty]').hidden,
    }
  })

const openPage = async (browser, viewport, options = {}) => {
  const page = await browser.newPage()
  await page.setViewport(viewport)
  if (options.reducedMotion) {
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
  }
  if (options.noJs) await page.setJavaScriptEnabled(false)
  await page.goto(options.url ?? PAGE, { waitUntil: 'networkidle0' })
  return page
}

const shot = async (page, name) => {
  const file = path.join(OUT, `${name}.png`)
  await page.screenshot({ path: file })
  process.stdout.write(`saved ${path.relative(ROOT, file)}\n`)
}

const runViewport = async (browser, viewport) => {
  const page = await openPage(browser, viewport)
  const state = await readState(page)
  record(
    `${viewport.name}: 9件が本になって開く`,
    state.cards === 9 && state.visible === 9 && state.position === '1' && state.total === '9',
    JSON.stringify(state),
  )
  await shot(page, `business-${viewport.name}`)
  await page.close()
}

/** 絞り込み。件数・冊数・開いている紙が一緒に動かないと、丁付けと本文がずれる。 */
const runFilter = async (browser) => {
  const page = await openPage(browser, VIEWPORTS[1])

  // 絞り込みは引き出しの中。開かないと押せないので、まず「条件を変える」から。
  const closed = await page.$eval('[data-directory-detail-filters]', (form) => form.hidden)
  await page.click('[data-directory-toggle-details]')
  await sleep(80)
  const opened = await page.evaluate(() => ({
    hidden: document.querySelector('[data-directory-detail-filters]').hidden,
    expanded: document
      .querySelector('[data-directory-toggle-details]')
      .getAttribute('aria-expanded'),
  }))
  record(
    'filter: 引き出しは閉じて始まり、押すと開いて aria-expanded が追従する',
    closed === true && opened.hidden === false && opened.expanded === 'true',
    JSON.stringify({ closed, ...opened }),
  )

  await page.select('[data-filter-key="region"]', '土浦')
  await sleep(120)
  const filtered = await readState(page)
  record(
    'filter: 地域=土浦 で3件に絞られ、開く紙も可視のものに移る',
    filtered.visible === 3 && filtered.count === '3' && filtered.total === '3',
    JSON.stringify(filtered),
  )

  // 円環の輪から隠れたカードが外れているか。3件なら3回送って元に戻る。
  const names = [filtered.active]
  for (let i = 0; i < 3; i += 1) {
    await page.click('.business-book-nav__button--next')
    await sleep(1100)
    names.push((await readState(page)).active)
  }
  record(
    'filter: 送りは可視の3件だけを円環でめぐる',
    names.length === 4 && names[3] === names[0] && new Set(names.slice(0, 3)).size === 3,
    names.join(' → '),
  )
  await shot(page, 'business-filtered')

  // 出ない組み合わせ。0件の知らせが出て、本は空になる。
  await page.select('[data-filter-key="industry"]', '農業')
  await sleep(120)
  const empty = await readState(page)
  record(
    'filter: 0件のときだけ知らせが出る',
    empty.visible === 0 && empty.count === '0' && empty.emptyShown,
    JSON.stringify(empty),
  )

  await page.click('[data-directory-reset]')
  await sleep(120)
  const reset = await readState(page)
  record(
    'filter: 全解除で9件に戻る',
    reset.visible === 9 && reset.count === '9' && !reset.emptyShown,
    JSON.stringify(reset),
  )
  await page.close()
}

/** めくり。紙が本当に動いているか（aria-busy と、めくる紙の実在）まで見る。 */
const runTurn = async (browser) => {
  const page = await openPage(browser, VIEWPORTS[1])
  const before = await readState(page)
  await page.click('.business-side-book--next')
  await sleep(220)
  const mid = await page.evaluate(() => ({
    busy: document.querySelector('[data-directory-root]').getAttribute('aria-busy'),
    leaves: document.querySelectorAll('.business-page-turn__seg').length,
    turning: document.querySelectorAll('.business-page-turn.is-turning').length,
  }))
  record(
    'turn: めくっている最中は紙が組み上がり aria-busy が立つ',
    mid.busy === 'true' && mid.leaves > 0 && mid.turning === 1,
    JSON.stringify(mid),
  )
  await shot(page, 'business-turning')

  await sleep(1000)
  const after = await readState(page)
  record(
    'turn: 送ったあと次の店が開き、めくった紙は片づく',
    after.active === before.nextName && after.position === '2',
    `${before.active} → ${after.active}`,
  )
  const leftovers = await page.evaluate(
    () => document.querySelectorAll('.business-page-turn').length,
  )
  record('turn: めくり終わりに紙が残らない', leftovers === 0, `残り ${leftovers}`)

  // 先頭で「前」を押すと最後へ回る。
  await page.click('.business-book-nav__button--previous')
  await sleep(1100)
  await page.click('.business-book-nav__button--previous')
  await sleep(1100)
  const wrapped = await readState(page)
  record('turn: 先頭の前は最後（円環）', wrapped.position === '9', JSON.stringify(wrapped))
  await page.close()
}

/** 動きを抑える設定では、紙を組まずに即座に差し替える。 */
const runReducedMotion = async (browser) => {
  const page = await openPage(browser, VIEWPORTS[1], { reducedMotion: true })
  await page.click('.business-book-nav__button--next')
  await sleep(80)
  const state = await page.evaluate(() => ({
    turn: document.querySelectorAll('.business-page-turn').length,
    position: document.querySelector('[data-business-position]').textContent,
  }))
  record(
    'reduced-motion: 紙を組まずに次の店へ差し替わる',
    state.turn === 0 && state.position === '2',
    JSON.stringify(state),
  )
  await page.close()
}

/**
 * JS 無しでも掲載がマークアップとして全部残る。カードをスクリプトで生成せず、
 * 非表示も DOM から抜かずに行うという契約の確認。
 *
 * ただし移植元と同じく、開いていない紙は CSS の `display: none` で伏せてある。
 * つまり JS が無いと目に見えるのは1件目だけで、ブラウザのページ内検索（Ctrl+F）も
 * 伏せた紙には掛からない。ここは移植元 /business/ から引き継いだ制約で、
 * 直すなら「初期表示は全件、スクリプトが動いたら本にたたむ」へ変える必要がある
 * （その場合ハイドレーション前に9件が積み上がって見える一瞬と引き換えになる）。
 */
const runNoJs = async (browser) => {
  const page = await openPage(browser, VIEWPORTS[1], { noJs: true })
  const state = await page.evaluate(() => {
    const cards = [...document.querySelectorAll('[data-directory-card]')]
    return {
      cards: cards.length,
      hidden: cards.filter((card) => card.hidden).length,
      badges: document.querySelectorAll('.business-card__badge').length,
      names: cards.map((card) => card.querySelector('.business-card__name').textContent).length,
      text: document.body.textContent.includes('稲敷ファーム'),
    }
  })
  record(
    'no-js: 9件すべてが hidden も付かずマークアップとして残る',
    state.cards === 9 && state.hidden === 0 && state.badges === 9 && state.text,
    JSON.stringify(state),
  )
  await shot(page, 'business-nojs')
  await page.close()
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
    for (const viewport of VIEWPORTS) await runViewport(browser, viewport)
    await runFilter(browser)
    await runTurn(browser)
    await runReducedMotion(browser)
    await runNoJs(browser)
  } finally {
    if (browser) await browser.close()
    server.close()
  }
  const failed = results.filter((r) => !r.ok)
  process.stdout.write(`\n${results.length - failed.length}/${results.length} passed\n`)
  if (failed.length) process.exitCode = 1
}

main().catch((error) => {
  process.stderr.write(`${error?.stack ?? error}\n`)
  process.exitCode = 1
})
