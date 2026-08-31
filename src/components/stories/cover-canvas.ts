/**
 * Jacket compositing for 卒業生紹介.
 *
 * The generated artwork carries no type at all (Japanese is unreliable in image models), so every
 * character — number, name, role — is printed here on a canvas, and the ink colour is chosen from
 * the measured luminance of the artwork underneath the band rather than hard-coded: the six
 * jackets range from near-black to near-white grounds, and a fixed colour disappears on one of them.
 *
 * The layout (where the portrait sits, which edge it bleeds off, where the type goes) comes from
 * `story.layout` in src/data/stories.ts, so it stays in step with what each jacket prompt leaves
 * covered. All three faces of a book are drawn here: front cover, spine, and the opened spread.
 */
import type { CoverPhoto, Story } from '@/data/stories'
import { storyNumber } from '@/data/stories'

export type CoverArt = {
  readonly cover: HTMLImageElement | null
  readonly photo: HTMLImageElement | null
}

const MINCHO = '"Yu Mincho", "游明朝", YuMincho, "Hiragino Mincho ProN", serif'
const GOTHIC = '"Yu Gothic", "游ゴシック", YuGothic, "Hiragino Kaku Gothic ProN", sans-serif'
const NAVY = '#005099'
const BEIGE = '#f5f3ec'

export const COVER_W = 512
export const COVER_H = 768
/** Spine width as a share of the cover width; more than this reads as a box, not a book. */
export const SPINE_RATIO = 0.1

const faceOf = (story: Story): string => (story.layout.face === 'mincho' ? MINCHO : GOTHIC)

/** Resolves to null instead of rejecting: a missing jacket must not take the shelf down. */
export const loadImage = (src: string): Promise<HTMLImageElement | null> =>
  new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.decoding = 'async'
    img.onload = () => resolve(img)
    img.onerror = () => resolve(null)
    img.src = src
  })

export const loadArt = async (story: Story): Promise<CoverArt> => {
  const [cover, photo] = await Promise.all([loadImage(story.cover), loadImage(story.photo)])
  return { cover, photo }
}

const canvasOf = (w: number, h: number): [HTMLCanvasElement, CanvasRenderingContext2D] => {
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('2d context unavailable')
  return [canvas, ctx]
}

/** Mean luminance of a region, sampled coarsely — enough to pick between dark and light ink. */
const luminanceOf = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
): number => {
  const left = Math.max(0, Math.round(x))
  const top = Math.max(0, Math.round(y))
  const width = Math.max(1, Math.min(ctx.canvas.width - left, Math.round(w)))
  const height = Math.max(1, Math.min(ctx.canvas.height - top, Math.round(h)))
  // A tainted canvas throws here. Losing the measurement is survivable; losing the shelf is not.
  let data: Uint8ClampedArray
  try {
    data = ctx.getImageData(left, top, width, height).data
  } catch {
    return 128
  }
  let sum = 0
  let count = 0
  for (let i = 0; i < data.length; i += 4 * 16) {
    sum += 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
    count += 1
  }
  return count === 0 ? 128 : sum / count
}

/** Ground for a book whose jacket image failed to load: plain plate, window and rule. */
const drawFallbackGround = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
  ctx.fillStyle = BEIGE
  ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = NAVY
  ctx.fillRect(0, 0, w, h * 0.12)
  ctx.strokeStyle = 'rgba(0, 80, 153, 0.5)'
  ctx.lineWidth = w * 0.008
  ctx.strokeRect(w * 0.04, h * 0.04, w * 0.92, h * 0.92)
}

/** Cover-fit a source image into a box, anchored vertically by `fit` (0 = top). */
const drawFitted = (
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number,
  fit: number,
) => {
  const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight)
  const dw = img.naturalWidth * scale
  const dh = img.naturalHeight * scale
  ctx.drawImage(img, x - (dw - w) / 2, y - (dh - h) * fit, dw, dh)
}

/** Window for the portrait when there is no portrait to put in it. */
const drawPhotoFallback = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
) => {
  ctx.fillStyle = 'rgba(0, 80, 153, 0.18)'
  ctx.fillRect(x, y, w, h)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)'
  ctx.lineWidth = Math.max(2, w * 0.01)
  ctx.strokeRect(x, y, w, h)
}

const drawPhoto = (
  ctx: CanvasRenderingContext2D,
  spec: CoverPhoto,
  photo: HTMLImageElement | null,
  w: number,
  h: number,
) => {
  if (spec.shape === 'circle') {
    const cx = spec.cx * w
    const cy = spec.cy * h
    const r = spec.r * w
    ctx.save()
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.clip()
    if (photo) drawFitted(ctx, photo, cx - r, cy - r, r * 2, r * 2, spec.fit)
    else drawPhotoFallback(ctx, cx - r, cy - r, r * 2, r * 2)
    ctx.restore()
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)'
    ctx.lineWidth = Math.max(2, w * 0.008)
    ctx.stroke()
    return
  }

  const x = spec.x * w
  const y = spec.y * h
  const bw = spec.w * w
  const bh = spec.h * h
  ctx.save()
  ctx.beginPath()
  ctx.rect(x, y, bw, bh)
  ctx.clip()
  if (photo) drawFitted(ctx, photo, x, y, bw, bh, spec.fit)
  else drawPhotoFallback(ctx, x, y, bw, bh)
  ctx.restore()

  // A single band of shadow where the photo meets the jacket: makes it read as printed, not pasted.
  const shade = (gx0: number, gy0: number, gx1: number, gy1: number, sx: number, sy: number, sw: number, sh: number) => {
    const grad = ctx.createLinearGradient(gx0, gy0, gx1, gy1)
    grad.addColorStop(0, 'rgba(0, 0, 0, 0.35)')
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)')
    ctx.fillStyle = grad
    ctx.fillRect(sx, sy, sw, sh)
  }
  const band = h * 0.03
  if (spec.bleed === 'top') shade(x, y + bh, x, y + bh + band, x, y + bh, bw, band)
  if (spec.bleed === 'bottom') shade(x, y, x, y - band, x, y - band, bw, band)
  if (spec.bleed === 'right') shade(x, y, x - band, y, x - band, y, band, bh)
  if (!spec.bleed) {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)'
    ctx.lineWidth = Math.max(2, w * 0.008)
    ctx.strokeRect(x, y, bw, bh)
  }
}

/** Shrink until the string fits `max`, so a long 肩書き never runs off the jacket. */
const fitText = (
  ctx: CanvasRenderingContext2D,
  text: string,
  family: string,
  weight: string,
  size: number,
  max: number,
): number => {
  let px = size
  ctx.font = `${weight} ${px}px ${family}`
  while (ctx.measureText(text).width > max && px > size * 0.5) {
    px -= 1
    ctx.font = `${weight} ${px}px ${family}`
  }
  return px
}

export const drawCoverCanvas = (story: Story, art: CoverArt): HTMLCanvasElement => {
  const w = COVER_W
  const h = COVER_H
  const [canvas, ctx] = canvasOf(w, h)
  const { layout } = story

  if (art.cover) ctx.drawImage(art.cover, 0, 0, w, h)
  else drawFallbackGround(ctx, w, h)

  drawPhoto(ctx, layout.photo, art.photo, w, h)

  // Type band: measured, then lifted off the artwork with a scrim of the ground's own tone.
  const bandH = layout.band.size * h
  const bandY = layout.band.from === 'bottom' ? h - bandH : 0
  const light = luminanceOf(ctx, 0, bandY, w, bandH) > 140
  const scrim = ctx.createLinearGradient(
    0,
    layout.band.from === 'bottom' ? h : 0,
    0,
    layout.band.from === 'bottom' ? bandY : bandH,
  )
  scrim.addColorStop(0, light ? 'rgba(255, 255, 255, 0.92)' : 'rgba(0, 0, 0, 0.72)')
  scrim.addColorStop(1, light ? 'rgba(255, 255, 255, 0)' : 'rgba(0, 0, 0, 0)')
  ctx.fillStyle = scrim
  ctx.fillRect(0, bandY, w, bandH)

  const ink = light ? '#12233a' : '#f4f1e8'
  const sub = light ? 'rgba(18, 35, 58, 0.75)' : 'rgba(244, 241, 232, 0.8)'
  const family = faceOf(story)
  const centered = layout.align === 'center'
  const pad = w * 0.09
  const tx = centered ? w / 2 : pad
  ctx.textAlign = centered ? 'center' : 'left'
  ctx.textBaseline = 'alphabetic'

  // Anchor the block to the inner edge of the band so top- and bottom-banded covers mirror cleanly.
  const inner = layout.band.from === 'bottom' ? h - bandH : bandH
  const dir = layout.band.from === 'bottom' ? 1 : -1
  let y = inner + dir * bandH * 0.34

  const noSize = w * 0.045
  ctx.fillStyle = sub
  ctx.font = `600 ${noSize}px ${GOTHIC}`
  ctx.fillText(`No.${storyNumber(story)}`, tx, y)

  y += dir * bandH * 0.1
  ctx.strokeStyle = sub
  ctx.lineWidth = Math.max(1, w * 0.004)
  ctx.beginPath()
  const ruleHalf = centered ? w * 0.14 : 0
  ctx.moveTo(centered ? tx - ruleHalf : pad, y)
  ctx.lineTo(centered ? tx + ruleHalf : pad + w * 0.28, y)
  ctx.stroke()

  y += dir * bandH * 0.3
  const nameSize = fitText(ctx, story.name, family, 'bold', layout.nameSize * w, w - pad * 2)
  ctx.fillStyle = ink
  ctx.font = `bold ${nameSize}px ${family}`
  ctx.fillText(story.name, tx, y)

  y += dir * bandH * 0.18
  const roleSize = fitText(ctx, story.role, GOTHIC, '500', layout.roleSize * w, w - pad * 2)
  ctx.fillStyle = sub
  ctx.font = `500 ${roleSize}px ${GOTHIC}`
  ctx.fillText(story.role, tx, y)

  return canvas
}

/**
 * The spine continues the jacket: its ground is the left edge of the cover stretched across, so a
 * row of books does not look like separately painted strips glued on. Japanese characters are set
 * upright and stacked, never rotated as a string.
 */
export const drawSpineCanvas = (story: Story, cover: HTMLCanvasElement): HTMLCanvasElement => {
  const w = Math.round(COVER_W * SPINE_RATIO)
  const h = COVER_H
  const [canvas, ctx] = canvasOf(w, h)
  ctx.drawImage(cover, 0, 0, Math.round(COVER_W * 0.06), h, 0, 0, w, h)
  ctx.fillStyle = 'rgba(0, 0, 0, 0.18)'
  ctx.fillRect(0, 0, w, h)

  const light = luminanceOf(ctx, 0, h * 0.1, w, h * 0.6) > 140
  ctx.fillStyle = light ? '#12233a' : '#f4f1e8'
  const size = w * 0.5
  ctx.font = `bold ${size}px ${faceOf(story)}`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  const chars = [...story.name.replace(/\s+/g, '')]
  const step = size * 1.18
  let y = h * 0.16
  for (const char of chars) {
    ctx.fillText(char, w / 2, y)
    y += step
  }
  return canvas
}

/**
 * The opened spread. Its order matches the article the reader lands on (portrait, name, role,
 * quote), so the page reads as a continuation of the book rather than a different screen.
 */
export const drawSpreadCanvas = (story: Story, art: CoverArt): HTMLCanvasElement => {
  const w = COVER_W * 2
  const h = COVER_H
  const [canvas, ctx] = canvasOf(w, h)
  const page = COVER_W

  ctx.fillStyle = '#fbf9f3'
  ctx.fillRect(0, 0, w, h)

  // Gutter shadow either side of the spine.
  const gutter = ctx.createLinearGradient(page - page * 0.12, 0, page + page * 0.12, 0)
  gutter.addColorStop(0, 'rgba(0, 0, 0, 0)')
  gutter.addColorStop(0.5, 'rgba(0, 0, 0, 0.22)')
  gutter.addColorStop(1, 'rgba(0, 0, 0, 0)')
  ctx.fillStyle = gutter
  ctx.fillRect(page - page * 0.12, 0, page * 0.24, h)

  // Left page: the portrait, framed.
  const px = page * 0.14
  const py = h * 0.12
  const pw = page * 0.72
  const ph = h * 0.56
  ctx.save()
  ctx.beginPath()
  ctx.rect(px, py, pw, ph)
  ctx.clip()
  if (art.photo) drawFitted(ctx, art.photo, px, py, pw, ph, 0.22)
  else drawPhotoFallback(ctx, px, py, pw, ph)
  ctx.restore()
  ctx.strokeStyle = 'rgba(0, 80, 153, 0.35)'
  ctx.lineWidth = 3
  ctx.strokeRect(px, py, pw, ph)

  ctx.textAlign = 'left'
  ctx.fillStyle = NAVY
  ctx.font = `600 ${page * 0.045}px ${GOTHIC}`
  ctx.fillText(`No.${storyNumber(story)}  ${story.field}`, px, py + ph + h * 0.07)
  ctx.fillStyle = 'rgba(18, 35, 58, 0.7)'
  ctx.font = `500 ${page * 0.04}px ${GOTHIC}`
  ctx.fillText(`${story.term} / ${story.club}`, px, py + ph + h * 0.115)

  // Right page: name, role, quote.
  const rx = page + page * 0.12
  const family = faceOf(story)
  ctx.fillStyle = '#12233a'
  const nameSize = fitText(ctx, story.name, family, 'bold', page * 0.13, page * 0.76)
  ctx.font = `bold ${nameSize}px ${family}`
  ctx.fillText(story.name, rx, h * 0.28)

  ctx.fillStyle = NAVY
  ctx.font = `600 ${page * 0.042}px ${GOTHIC}`
  ctx.fillText(story.kana, rx, h * 0.33)
  ctx.fillStyle = 'rgba(18, 35, 58, 0.8)'
  ctx.font = `500 ${page * 0.05}px ${GOTHIC}`
  ctx.fillText(story.role, rx, h * 0.4)

  ctx.strokeStyle = 'rgba(0, 80, 153, 0.4)'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(rx, h * 0.45)
  ctx.lineTo(rx + page * 0.5, h * 0.45)
  ctx.stroke()

  // The quote wraps by measurement; Japanese has no spaces to break on.
  ctx.fillStyle = '#12233a'
  const quoteSize = page * 0.052
  ctx.font = `500 ${quoteSize}px ${family}`
  const max = page * 0.76
  let line = ''
  let ly = h * 0.54
  for (const char of `「${story.quote}」`) {
    if (ctx.measureText(line + char).width > max) {
      ctx.fillText(line, rx, ly)
      ly += quoteSize * 1.7
      line = ''
    }
    line += char
  }
  if (line) ctx.fillText(line, rx, ly)

  return canvas
}
