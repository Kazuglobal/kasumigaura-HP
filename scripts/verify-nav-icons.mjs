import { createServer } from 'node:http'
import { access, mkdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import puppeteer from 'puppeteer-core'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const OUT = path.join(ROOT, 'shots')
const EXPORT_DIR = path.join(ROOT, 'out')
const PORT = 3108
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

const resolveExportFile = (url) => {
  let file = decodeURIComponent(url.split('?')[0].split('#')[0])
  if (file.endsWith('/')) file += 'index.html'
  if (!path.extname(file)) file += '.html'
  const resolved = path.resolve(EXPORT_DIR, `.${file}`)
  return resolved.startsWith(EXPORT_DIR) ? resolved : null
}

const startServer = async () => {
  await access(path.join(EXPORT_DIR, 'index.html')).catch(() => {
    throw new Error(`No export found at ${EXPORT_DIR}. Run \`npm run build\` first.`)
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
  console.log(`[Screenshot] saved ${path.relative(ROOT, file)}`)
}

const runTest = async () => {
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

    // --- 1. SP Hamburger Menu Test ---
    console.log('[Test 1/2] Testing Mobile (SP) Hamburger Menu Icons...')
    await page.setViewport(SP)
    await page.goto(URL, { waitUntil: 'networkidle0' })
    await sleep(800)

    // ハンバーガーメニューを開く
    await page.click('#gNavOpener')
    await sleep(700)

    // メニューが開いたことを確認
    const navOpen = await page.evaluate(() => document.body.classList.contains('is-navOpen'))
    assert(navOpen, 'Body should have is-navOpen class after clicking opener')
    console.log('✓ Hamburger menu opened')

    // メニューリンクのアイコン数をカウント
    const navLinksWithIcons = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a[class*="navLink"]'))
      return links.map((a) => {
        const icon = a.querySelector('span[class*="navIcon"] img')
        const text = a.querySelector('span[class*="navLabelText"]')?.textContent ?? a.textContent
        return {
          text: text?.trim(),
          hasIcon: Boolean(icon),
          src: icon?.getAttribute('src'),
        }
      })
    })

    console.log(`Found ${navLinksWithIcons.length} navigation items:`)
    for (const item of navLinksWithIcons) {
      console.log(` - [${item.hasIcon ? '✓ ICON' : '✗ NO ICON'}] ${item.text} (${item.src ?? 'none'})`)
      assert(item.hasIcon, `Nav item "${item.text}" should have an icon!`)
    }

    await shot(page, 'sp-nav-icons-unified')

    // --- 2. PC View Intact Test ---
    console.log('\n[Test 2/2] Testing PC Header Navigation...')
    await page.setViewport(PC)
    await page.goto(URL, { waitUntil: 'networkidle0' })
    await sleep(800)

    // PC表示でアイコンが非表示であり、テキストナビが正常に表示されているか
    const pcNavStatus = await page.evaluate(() => {
      const firstLink = document.querySelector('a[class*="navLink"]')
      const iconSpan = firstLink?.querySelector('span[class*="navIcon"]')
      const isIconHidden = iconSpan ? window.getComputedStyle(iconSpan).display === 'none' : true
      return { isIconHidden }
    })
    assert(pcNavStatus.isIconHidden, 'PC nav icons should be hidden to preserve clean desktop header')
    console.log('✓ PC header layout intact (icons cleanly hidden on desktop)')

    await shot(page, 'pc-nav-intact')

    console.log('\n🎉 ALL NAV ICONS VERIFICATION CHECKS PASSED!')
  } finally {
    if (browser) await browser.close()
    stopServer(server)
  }
}

runTest().catch((err) => {
  console.error(err)
  process.exit(1)
})
