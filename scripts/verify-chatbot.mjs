import { createServer } from 'node:http'
import { access, mkdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import puppeteer from 'puppeteer-core'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const OUT = path.join(ROOT, 'shots')
const EXPORT_DIR = path.join(ROOT, 'out')
const PORT = 3105
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

    // --- 1. PC View Test ---
    console.log('[Test 1/2] Testing PC Chatbot...')
    await page.setViewport(PC)
    await page.goto(URL, { waitUntil: 'networkidle0' })
    await sleep(800)

    // ランチャーボタンの存在確認
    const launcherExists = await page.evaluate(() => {
      const btn = document.querySelector('button[aria-label*="同窓会Webコンシェルジュを開く"]')
      return Boolean(btn)
    })
    assert(launcherExists, 'Chatbot launcher button should exist')
    console.log('✓ Launcher button found on page')

    // クリックして開く
    await page.click('button[aria-label*="同窓会Webコンシェルジュを開く"]')
    await sleep(600)

    // チャットウィンドウが開いているか確認
    const isWindowOpen = await page.evaluate(() => {
      const win = document.querySelector('div[role="dialog"][aria-label="同窓会Webコンシェルジュ"]')
      return Boolean(win)
    })
    assert(isWindowOpen, 'Chatbot window should open on click')
    console.log('✓ Chatbot window opened')
    await shot(page, 'chatbot-pc-open')

    // 選択肢チップのクリックテスト（「📍 住所・連絡先の変更」）
    const optionClicked = await page.evaluate(() => {
      const chips = Array.from(document.querySelectorAll('button'))
      const chip = chips.find((c) => c.textContent?.includes('住所・連絡先の変更'))
      if (chip) {
        chip.click()
        return true
      }
      return false
    })
    assert(optionClicked, 'Option chip "住所・連絡先の変更" should be clickable')
    console.log('✓ Clicked option chip "住所・連絡先の変更"')

    // タイピングと回答待ち（800ms）
    await sleep(1000)

    // 回答が表示されているか確認
    const hasAnswer = await page.evaluate(() => {
      const bubbles = Array.from(document.querySelectorAll('div'))
      return bubbles.some((b) => b.textContent?.includes('【ご住所・ご連絡先の変更について】'))
    })
    assert(hasAnswer, 'Bot should answer with address change information')
    console.log('✓ Bot responded with address change FAQ')
    await shot(page, 'chatbot-pc-interaction')

    // テキスト入力送信テスト（「会費について」）
    await page.type('input[placeholder*="質問を入力"]', '会費の支払い方法')
    await sleep(300)
    await page.click('button[type="submit"]')
    await sleep(1000)

    const hasFeeAnswer = await page.evaluate(() => {
      const bubbles = Array.from(document.querySelectorAll('div'))
      return bubbles.some((b) => b.textContent?.includes('【入会・年会費のご案内】'))
    })
    assert(hasFeeAnswer, 'Bot should answer with fee and join information')
    console.log('✓ Free-text input answered successfully')

    // 閉じるテスト
    await page.click('button[title="閉じる"]')
    await sleep(400)
    const isClosed = await page.evaluate(() => {
      return !document.querySelector('div[role="dialog"]')
    })
    assert(isClosed, 'Chatbot window should close when clicking close button')
    console.log('✓ Chatbot window closed successfully')

    // --- 2. Mobile (SP) View Test ---
    console.log('[Test 2/2] Testing Mobile (SP) Chatbot...')
    await page.setViewport(SP)
    await page.goto(URL, { waitUntil: 'networkidle0' })
    await sleep(800)

    await page.click('button[aria-label*="同窓会Webコンシェルジュを開く"]')
    await sleep(600)
    await shot(page, 'chatbot-sp-open')
    console.log('✓ Mobile chatbot opened successfully')

    console.log('\n🎉 ALL VERIFICATION CHECKS PASSED!')
  } finally {
    if (browser) await browser.close()
    stopServer(server)
  }
}

runTest().catch((err) => {
  console.error(err)
  process.exit(1)
})
