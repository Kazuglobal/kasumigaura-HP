/**
 * Sizing for the 3D shelf, kept apart from the scene so it can be checked without a browser
 * (scripts/shots-stories.mjs imports this file directly).
 *
 * A WebGL canvas cannot be read back, so "does the same graduate appear twice" is not something a
 * screenshot can answer. It is decided entirely by the numbers below, so they are verified here.
 */

export const BOOK_W = 1
export const BOOK_H = 1.5
/** Thickness ≈ 10% of the height. More than that reads as a box rather than a book. */
export const BOOK_D = 0.15
export const GAP = BOOK_W * 1.45
export const FOV = 46
export const CAMERA_Z = 6
/** How far the opened book is pulled towards the camera. */
export const OPEN_Z = 2.6
/** Width of the spread in cover widths — a shade under two, because the cover overlaps the gutter. */
export const SPREAD_W = 1.94
/** The row of books must span more than the viewport, or one face shows at both edges at once. */
export const LAP_MARGIN = 1.12

export type ShelfLayout = {
  readonly scale: number
  /** How far forward the opened book actually travels, after the near-camera clamp. */
  readonly openZ: number
  readonly openScale: number
  readonly visibleW: number
  readonly visibleH: number
  readonly lane: number
}

export const layoutFor = (width: number, height: number, count: number): ShelfLayout => {
  const aspect = Math.max(0.01, width / Math.max(1, height))
  const half = Math.tan((FOV * Math.PI) / 360)
  const visibleH = 2 * CAMERA_Z * half
  const visibleW = visibleH * aspect
  const lane = count * GAP

  const byHeight = (visibleH * 0.78) / BOOK_H
  const byWidth = (visibleW * 0.4) / BOOK_W
  const byLap = (visibleW * LAP_MARGIN) / lane
  // Order matters: every ceiling first, then the lower bound. Folding the lower bound in earlier
  // lets the fixed ceiling win and puts the same book at both edges at some widths.
  const scale = Math.max(Math.min(byHeight, byWidth, 1.9), byLap)

  // On a very wide, short stage the no-repeat lower bound pushes the scale past every ceiling, and
  // OPEN_Z * scale would then carry the opening book through the camera. Keep it in front.
  const openZ = Math.min(OPEN_Z * scale, CAMERA_Z - 1.2)
  const distance = CAMERA_Z - openZ
  const openW = 2 * distance * half * aspect
  const openH = 2 * distance * half
  const openScale = Math.min(
    (openW * 0.9) / (SPREAD_W * BOOK_W * scale),
    (openH * 0.86) / (BOOK_H * scale),
    1.12,
  )

  return { scale, openZ, openScale, visibleW, visibleH, lane }
}

/** True when the row of books is longer than the viewport — the condition for no repeated face. */
export const lapsViewport = (layout: ShelfLayout): boolean =>
  layout.lane * layout.scale >= layout.visibleW
