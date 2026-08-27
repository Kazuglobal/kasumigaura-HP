// Convert generated PNGs in public/images/ into web-sized WebP files.
// Usage: node scripts/optimize-images.mjs [name ...]   (no args = all *.png)
import { readdir, stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const DIR = path.join(ROOT, 'public', 'images')
const QUALITY = 82

/** Longest-edge targets per asset family (px). Anything else falls back to DEFAULT_WIDTH. */
const WIDTHS = {
  'hero-intro': 1920,
  hero: 1600,
  about: 1600,
  gallery: 1920,
  history: 1200,
  news: 800,
  photo: 1000,
  cta: 1400,
  card: 480,
}
const DEFAULT_WIDTH = 1400

const familyOf = (name) => {
  if (name.startsWith('hero-intro')) return 'hero-intro'
  return name.split('-')[0]
}

/**
 * Card icons come out of image_gen with wildly different internal margins, so they read as
 * different sizes when dropped into the fixed 120px lineup slot. Trim the transparent border and
 * re-centre the artwork inside a square canvas with a uniform margin so every icon has the same
 * optical weight.
 */
const CARD_CONTENT_RATIO = 0.84

const normalizeCard = async (file, width) => {
  const trimmed = await sharp(file).trim({ threshold: 1 }).toBuffer()
  const inner = Math.round(width * CARD_CONTENT_RATIO)
  const fitted = await sharp(trimmed)
    .resize({ width: inner, height: inner, fit: 'inside', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer()
  const { width: w = inner, height: h = inner } = await sharp(fitted).metadata()
  const left = Math.round((width - w) / 2)
  const top = Math.round((width - h) / 2)
  return sharp(fitted).extend({
    left,
    top,
    right: width - w - left,
    bottom: width - h - top,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
}

const convert = async (file) => {
  const name = path.basename(file, '.png')
  const family = familyOf(name)
  const width = WIDTHS[family] ?? DEFAULT_WIDTH
  const out = path.join(DIR, `${name}.webp`)
  const pipeline =
    family === 'card'
      ? await normalizeCard(file, width)
      : sharp(file).resize({ width, withoutEnlargement: true })
  const info = await pipeline.webp({ quality: QUALITY }).toFile(out)
  const before = (await stat(file)).size
  process.stdout.write(
    `${name}.png (${Math.round(before / 1024)}KB) -> ${name}.webp ${info.width}x${info.height} (${Math.round(info.size / 1024)}KB)\n`,
  )
}

const main = async () => {
  const wanted = new Set(process.argv.slice(2))
  const files = (await readdir(DIR))
    .filter((f) => f.endsWith('.png'))
    .filter((f) => wanted.size === 0 || wanted.has(path.basename(f, '.png')))
    .map((f) => path.join(DIR, f))
  if (files.length === 0) throw new Error(`No PNG files found in ${DIR}`)
  for (const file of files) await convert(file)
}

main().catch((error) => {
  process.stderr.write(`${error?.stack ?? error}\n`)
  process.exit(1)
})
