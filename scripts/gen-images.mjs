// Generate site imagery through the Codex CLI (ChatGPT subscription, built-in image_gen; no API key).
// Runs strictly one job at a time to avoid the generated_images race, verifies each destination file,
// and stops early when the subscription usage limit is reported.
// Usage: node scripts/gen-images.mjs [name ...]   (no args = every missing asset)
import { spawn } from 'node:child_process'
import { access } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { ASSETS } from './image-prompts.mjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const OUT_DIR = path.join(ROOT, 'public', 'images')
const CODEX = process.platform === 'win32' ? 'codex.cmd' : 'codex'
const USAGE_LIMIT_RE = /usage limit/i
const CODEX_IMAGES = 'C:/Users/s1598/.codex/generated_images/'

const exists = (file) =>
  access(file).then(
    () => true,
    () => false,
  )

const buildPrompt = ({ name, size, prompt }) => {
  const dest = `${OUT_DIR.replace(/\\/g, '/')}/${name}.png`
  return [
    `Use the built-in image_gen tool (subscription, no API key) to generate ONE image, ${size}:`,
    prompt,
    'No readable text, no letters, no logos, no watermark.',
    `After generation: locate the produced PNG ONLY inside this session's own folder under ${CODEX_IMAGES} (the folder created for THIS run; never scan other session folders), copy it to ${dest}, then run 'ls -l ${dest}' and print the output. Do not modify any other files.`,
  ].join('\n')
}

// The prompt is piped through stdin (codex exec reads instructions from stdin when no PROMPT arg is
// given) so multi-line prompts survive the Windows shell without quoting problems.
const runCodex = (prompt) =>
  new Promise((resolve) => {
    const child = spawn(
      CODEX,
      ['exec', '-C', JSON.stringify(ROOT), '--skip-git-repo-check', '-s', 'workspace-write'],
      { cwd: ROOT, shell: process.platform === 'win32', windowsHide: true },
    )
    let output = ''
    const collect = (chunk) => {
      output += chunk.toString()
    }
    child.stdout.on('data', collect)
    child.stderr.on('data', collect)
    child.on('close', (code) => resolve({ code, output }))
    child.stdin.end(prompt)
  })

const main = async () => {
  const wanted = new Set(process.argv.slice(2))
  const queue = ASSETS.filter((a) => wanted.size === 0 || wanted.has(a.name))
  const results = []
  for (const asset of queue) {
    const dest = path.join(OUT_DIR, `${asset.name}.png`)
    if (wanted.size === 0 && (await exists(dest))) {
      results.push({ name: asset.name, status: 'skipped (exists)' })
      continue
    }
    process.stdout.write(`\n=== ${asset.name} (${asset.size})\n`)
    const { output } = await runCodex(buildPrompt(asset))
    if (USAGE_LIMIT_RE.test(output)) {
      const when = output.match(/try again at ([^.\n]+)/i)?.[1] ?? 'unknown'
      results.push({ name: asset.name, status: `usage limit (retry ${when})` })
      process.stdout.write(`usage limit reached; stopping. Retry at: ${when}\n`)
      break
    }
    const ok = await exists(dest)
    results.push({ name: asset.name, status: ok ? 'ok' : 'MISSING' })
    process.stdout.write(ok ? `saved ${path.relative(ROOT, dest)}\n` : `MISSING ${dest}\n${output.slice(-600)}\n`)
  }
  process.stdout.write('\n=== summary\n')
  for (const r of results) process.stdout.write(`${r.name}: ${r.status}\n`)
  const failed = results.some((r) => r.status !== 'ok' && !r.status.startsWith('skipped'))
  process.exit(failed ? 1 : 0)
}

main().catch((error) => {
  process.stderr.write(`${error?.stack ?? error}\n`)
  process.exit(1)
})
