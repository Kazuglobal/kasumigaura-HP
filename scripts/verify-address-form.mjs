import { createServer } from 'node:http'
import { access, mkdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import puppeteer from 'puppeteer-core'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const OUT = path.join(ROOT, 'shots')
const EXPORT_DIR = path.join(ROOT, 'out')
const PORT = 3106
const URL = `http://localhost:${PORT}/address`
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
  await access(path.join(EXPORT_DIR, 'address.html')).catch(() => {
    throw new Error(`No export found at ${EXPORT_DIR}/address.html. Run \`npm run build\` first.`)
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
    console.log('[Test 1/2] Testing PC Address Change Form...')
    await page.setViewport(PC)
    await page.goto(URL, { waitUntil: 'networkidle0' })
    await sleep(800)

    // 見出しの存在確認
    const heading = await page.evaluate(() => {
      return document.querySelector('h2')?.textContent
    })
    assert(heading?.includes('住所変更のお届け'), 'Page heading should include 住所変更のお届け')
    console.log(`✓ Page heading confirmed: "${heading}"`)

    // 未入力での確認ボタンクリック（バリデーションエラーテスト）
    await page.click('button[type="submit"]')
    await sleep(400)

    const hasErrors = await page.evaluate(() => {
      const errs = document.querySelectorAll('p[class*="errorText"]')
      return errs.length > 0
    })
    assert(hasErrors, 'Validation errors should be displayed for required fields')
    console.log('✓ Validation errors shown for empty required fields')
    await shot(page, 'address-form-pc-validation')

    // フォーム入力
    await page.type('#name', '霞ヶ浦 太郎')
    await page.type('#kana', 'カスミガウラ タロウ')
    await page.type('#gradYear', '第45期（2005年卒）')
    await page.type('#zipCode', '3000331')
    await page.click('button[class*="zipSearchBtn"]')
    await sleep(1200) // API待機

    // 住所自動入力の確認またはフォールバック入力
    const prefValue = await page.evaluate(() => {
      const select = document.querySelector('#prefecture')
      return select ? select.value : ''
    })
    if (!prefValue) {
      await page.select('#prefecture', '茨城県')
      await page.type('#cityAddress', '稲敷郡阿見町阿見4417')
    } else {
      console.log(`✓ Zip search auto-filled prefecture: ${prefValue}`)
    }

    await page.type('#phone', '090-1234-5678')
    await page.type('#email', 'kasumigaura.taro@example.com')
    await page.type('#emailConfirm', 'kasumigaura.taro@example.com')
    await page.type('#remarks', 'いつも会報を楽しみにしております。よろしくお願いいたします。')

    // 同意チェック
    await page.click('input[name="agreed"]')
    await sleep(300)
    await shot(page, 'address-form-pc-filled')

    // 確認画面へ
    await page.click('button[type="submit"]')
    await sleep(800)

    // Step 2 確認
    const isStep2 = await page.evaluate(() => {
      const stepItems = Array.from(document.querySelectorAll('div[class*="stepItem"]'))
      return stepItems[1]?.classList.contains('active') || Boolean(document.querySelector('table[class*="confirmTable"]'))
    })
    assert(isStep2, 'Should navigate to confirmation step (Step 2)')
    console.log('✓ Navigated to Step 2 (Confirmation)')
    await shot(page, 'address-form-pc-confirm')

    // 送信確定（Step 3）へ
    const sendBtn = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'))
      const btn = btns.find((b) => b.textContent?.includes('この内容で送信する'))
      if (btn) {
        btn.click()
        return true
      }
      return false
    })
    assert(sendBtn, 'Send button should exist on confirmation step')
    await sleep(800)

    // 完了メッセージ確認
    const isComplete = await page.evaluate(() => {
      return Boolean(document.querySelector('h3[class*="completeTitle"]'))
    })
    assert(isComplete, 'Should navigate to complete step (Step 3)')
    console.log('✓ Navigated to Step 3 (Complete)')
    await shot(page, 'address-form-pc-complete')

    // --- 2. Mobile (SP) View Test ---
    console.log('\n[Test 2/2] Testing Mobile (SP) Address Change Form...')
    await page.setViewport(SP)
    await page.goto(URL, { waitUntil: 'networkidle0' })
    await sleep(800)

    await shot(page, 'address-form-sp')
    console.log('✓ Mobile view captured')

    console.log('\n🎉 ALL ADDRESS FORM VERIFICATION CHECKS PASSED!')
  } finally {
    if (browser) await browser.close()
    stopServer(server)
  }
}

runTest().catch((err) => {
  console.error(err)
  process.exit(1)
})
