// Placeholder jackets and portraits for 卒業生紹介, drawn locally with sharp.
//
// The real art comes from `node scripts/gen-images.mjs` (Codex image_gen) followed by
// `node scripts/optimize-images.mjs`. Until that has run — or when its subscription quota is
// exhausted — these stand in so the shelf, the cover compositing and the layout can be built and
// reviewed. Each jacket gets its own palette and pattern; none of them carries text.
//
// Skips any asset whose generated PNG already exists, so it can never overwrite real art.
// Usage: node scripts/gen-story-placeholders.mjs
import { access } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const DIR = path.join(ROOT, 'public', 'images')
const COVER = { width: 512, height: 768 }
const PORTRAIT = { width: 512, height: 640 }

const exists = (file) =>
  access(file).then(
    () => true,
    () => false,
  )

/** One palette per jacket: [ground, accent, ink] — deliberately different lightness per book. */
const COVERS = [
  { name: 'story-cover-01', ground: '#dfe9f0', accent: '#5b8db5', ink: '#123049', pattern: 'ripples' },
  { name: 'story-cover-02', ground: '#3a2417', accent: '#c98a3c', ink: '#f2e3cd', pattern: 'grain' },
  { name: 'story-cover-03', ground: '#eef0e6', accent: '#7fa06a', ink: '#2c3a25', pattern: 'staves' },
  { name: 'story-cover-04', ground: '#cfc7b4', accent: '#8a7f66', ink: '#2b2519', pattern: 'weave' },
  { name: 'story-cover-05', ground: '#131d3a', accent: '#2f4f8f', ink: '#e6ecf8', pattern: 'lotus' },
  { name: 'story-cover-06', ground: '#14161c', accent: '#3fb6c8', ink: '#dfe7ea', pattern: 'waveform' },
]

const PORTRAITS = [
  { name: 'story-photo-01', ground: '#c8d6e0', figure: '#7e93a3' },
  { name: 'story-photo-02', ground: '#d8c7b2', figure: '#95795c' },
  { name: 'story-photo-03', ground: '#dfe2d5', figure: '#8d9580' },
  { name: 'story-photo-04', ground: '#c6cbc9', figure: '#7b8482' },
  { name: 'story-photo-05', ground: '#cdd7e2', figure: '#7f8ea0' },
  { name: 'story-photo-06', ground: '#c2c4cc', figure: '#787c88' },
]

const patterns = {
  ripples: (a) =>
    Array.from({ length: 9 }, (_, i) => {
      const y = 90 + i * 72
      return `<path d="M-20 ${y} C 120 ${y - 26}, 260 ${y + 26}, 540 ${y - 10}" stroke="${a}" stroke-width="${1 + (i % 3)}" fill="none" opacity="0.5"/>`
    }).join(''),
  grain: (a) =>
    Array.from({ length: 160 }, (_, i) => {
      const x = (i * 97) % 512
      const y = (i * 211) % 768
      return `<circle cx="${x}" cy="${y}" r="${1 + (i % 3)}" fill="${a}" opacity="0.35"/>`
    }).join(''),
  staves: (a) =>
    Array.from({ length: 24 }, (_, i) => {
      const y = 40 + i * 30
      return `<rect x="0" y="${y}" width="512" height="2" fill="${a}" opacity="${i % 5 === 0 ? 0.55 : 0.22}"/>`
    }).join(''),
  weave: (a) =>
    Array.from({ length: 40 }, (_, i) => {
      const p = i * 20
      return `<rect x="${p}" y="0" width="6" height="768" fill="${a}" opacity="0.16"/><rect x="0" y="${p}" width="512" height="6" fill="${a}" opacity="0.12"/>`
    }).join(''),
  lotus: (a) =>
    Array.from({ length: 7 }, (_, i) => {
      const cx = 40 + i * 78
      const cy = 640 - (i % 3) * 60
      return `<ellipse cx="${cx}" cy="${cy}" rx="70" ry="22" fill="${a}" opacity="0.5"/>`
    }).join(''),
  waveform: (a) =>
    Array.from({ length: 48 }, (_, i) => {
      const x = 8 + i * 10.5
      const h = 30 + ((i * 37) % 220)
      return `<rect x="${x}" y="${384 - h / 2}" width="4" height="${h}" fill="${a}" opacity="0.55"/>`
    }).join(''),
}

const coverSvg = ({ ground, accent, ink, pattern }) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${COVER.width}" height="${COVER.height}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${ground}"/>
      <stop offset="1" stop-color="${ink}" stop-opacity="0.35"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="${ground}"/>
  <rect width="100%" height="100%" fill="url(#g)"/>
  ${patterns[pattern](accent)}
  <rect x="18" y="18" width="476" height="732" fill="none" stroke="${ink}" stroke-opacity="0.25" stroke-width="2"/>
</svg>`

/** A headless stand-in: shoulders and a head, no face. Clearly not a real person. */
const portraitSvg = ({ ground, figure }) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${PORTRAIT.width}" height="${PORTRAIT.height}">
  <rect width="100%" height="100%" fill="${ground}"/>
  <circle cx="256" cy="210" r="96" fill="${figure}" opacity="0.85"/>
  <path d="M60 640 C 80 470, 170 380, 256 380 C 342 380, 432 470, 452 640 Z" fill="${figure}" opacity="0.85"/>
</svg>`

const write = async (name, svg) => {
  if (await exists(path.join(DIR, `${name}.png`))) {
    process.stdout.write(`${name}: skipped (generated PNG exists)\n`)
    return
  }
  const out = path.join(DIR, `${name}.webp`)
  const info = await sharp(Buffer.from(svg)).webp({ quality: 82 }).toFile(out)
  process.stdout.write(`${name}.webp ${info.width}x${info.height} (${Math.round(info.size / 1024)}KB)\n`)
}

const main = async () => {
  for (const cover of COVERS) await write(cover.name, coverSvg(cover))
  for (const portrait of PORTRAITS) await write(portrait.name, portraitSvg(portrait))
}

main().catch((error) => {
  process.stderr.write(`${error?.stack ?? error}\n`)
  process.exit(1)
})
