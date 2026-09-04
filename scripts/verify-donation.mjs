import { createServer } from 'node:http'
import { access, mkdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import puppeteer from 'puppeteer-core'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const OUT = path.join(ROOT, 'shots')
const EXPORT_DIR = path.join(ROOT, 'out')
const PORT = 3107
const URL = `http://localhost:${PORT}/donation`
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
const PC = { width: 1440, height: 1200 }
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
  await access(path.join(EXPORT_DIR, 'donation.html')).catch(() => {
    throw new Error(`No export found at ${EXPORT_DIR}/donation.html. Run \`npm run build\` first.`)
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
    console.log('[Test 1/2] Testing PC Donation Page...')
    await page.setViewport(PC)
    await page.goto(URL, { waitUntil: 'networkidle0' })
    await sleep(800)

    // 見出し確認
    const heading = await page.evaluate(() => document.querySelector('h2')?.textContent)
    assert(heading?.includes('寄付・協賛のお願い'), 'Page heading should include 寄付・協賛のお願い')
    console.log(`✓ Page heading confirmed: "${heading}"`)

    // 使途カードが4枚存在することを確認
    const purposeCardCount = await page.evaluate(() => {
      return document.querySelectorAll('div[class*="purposeCard"]').length
    })
    assert(purposeCardCount === 4, `Should render 4 purpose cards, got ${purposeCardCount}`)
    console.log('✓ All 4 purpose cards rendered properly')

    await shot(page, 'donation-pc-top')

    // 未入力での確認ボタンクリック（バリデーション確認）
    await page.click('button[type="submit"]')
    await sleep(400)
    const hasErrors = await page.evaluate(() => {
      const errs = document.querySelectorAll('p[class*="errorText"]')
      return errs.length > 0
    })
    assert(hasErrors, 'Validation errors should be displayed for empty required fields')
    console.log('✓ Validation errors shown for empty required fields')

    // フォーム入力（10,000円選択、氏名、フリガナ、電話、メール、同意）
    // 30,000円チップをクリックしてみる
    await page.evaluate(() => {
      const chips = Array.from(document.querySelectorAll('button[class*="chipBtn"]'))
      const chip30k = chips.find((c) => c.textContent?.includes('30,000円'))
      chip30k?.click()
    })
    console.log('✓ Selected 30,000円 donation preset chip')

    await page.type('#name', '霞ヶ浦 花子')
    await page.type('#kana', 'カスミガウラ ハナコ')
    await page.type('#gradYear', '第48期（2008年卒）')
    await page.type('#phone', '080-9876-5432')
    await page.type('#email', 'kasumigaura.hanako@example.com')
    await page.type('#message', 'レスリング部と野球部の甲子園・全国制覇を応援しています！')

    // 同意チェック
    await page.click('input[name="agreed"]')
    await sleep(300)
    await shot(page, 'donation-pc-form-filled')

    // 確認画面へ
    await page.click('button[type="submit"]')
    await sleep(800)

    // Step 2 確認
    const isStep2 = await page.evaluate(() => {
      return Boolean(document.querySelector('table[class*="confirmTable"]'))
    })
    assert(isStep2, 'Should navigate to confirmation step (Step 2)')
    console.log('✓ Navigated to Step 2 (Confirmation Table)')
    await shot(page, 'donation-pc-confirm')

    // 金額が 30,000円 になっているか確認
    const confirmAmount = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('tr'))
      const amountRow = rows.find((r) => r.textContent?.includes('ご寄付金額'))
      return amountRow?.textContent
    })
    assert(confirmAmount?.includes('30,000円'), `Confirm amount should be 30,000円, got ${confirmAmount}`)
    console.log(`✓ Confirmed donation amount: ${confirmAmount?.replace(/\s+/g, ' ')}`)

    // 送信完了（Step 3）へ
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'))
      const sendBtn = btns.find((b) => b.textContent?.includes('この内容でお申し込みを送信する'))
      sendBtn?.click()
    })
    await sleep(800)

    const isComplete = await page.evaluate(() => {
      return Boolean(document.querySelector('h3[class*="completeTitle"]'))
    })
    assert(isComplete, 'Should navigate to complete step (Step 3)')
    console.log('✓ Navigated to Step 3 (Complete Screen)')
    await shot(page, 'donation-pc-complete')

    // --- 2. Mobile (SP) View Test ---
    console.log('\n[Test 2/2] Testing Mobile (SP) Donation Page...')
    await page.setViewport(SP)
    await page.goto(URL, { waitUntil: 'networkidle0' })
    await sleep(800)
    await shot(page, 'donation-sp-top')
    console.log('✓ Mobile view captured')

    console.log('\n🎉 ALL DONATION PAGE VERIFICATION CHECKS PASSED!')
  } finally {
    if (browser) await browser.close()
    stopServer(server)
  }
}

runTest().catch((err) => {
  console.error(err)
  process.exit(1)
})
