/**
 * 断ち切りの波形。サイトのセクション境界に使っている WaveDivider と**同じ稜線**。
 *
 * ここを直線ワイプやクロスフェードにすると、ファーストビューだけがサイトの他の
 * 部分と無関係な動きになる。この形が揃っていることが「サイト全体が1冊の記念誌」
 * というコンセプトの拠り所になっている。
 *
 * パスは `transform` で縮めるのではなく、**画面座標のまま組み立てる**。
 * scale を掛けた座標系に置くと、縦横の縮尺が違うぶん線の太さが場所によって
 * 変わり、ぼかしの幅も歪む。影と光の縁を乗せる以上、px で扱えないと困る。
 */

type Point = readonly [number, number]

/** WaveDivider の稜線（viewBox 1440x120）を制御点に分解したもの。 */
const VIEW_W = 1440
const VIEW_H = 120
const START: Point = [0, 84]
const CURVE: readonly Point[] = [
  [180, 22],
  [400, 8],
  [640, 52],
]
const SMOOTH_A: readonly Point[] = [
  [1000, 112],
  [1200, 78],
]
const SMOOTH_B: readonly Point[] = [
  [1380, 36],
  [1440, 30],
]

/**
 * 稜線の縦位置。progress 0 で画面下（新しい紙は1枚も見えない）、
 * 1 で画面上（抜けきって全面が新しい紙）。
 *
 * 出発点は画面下ぎりぎりに置く。稜線の一番高い所は edgeY + 8/120*waveH なので、
 * waveH の 15% ぶん下げれば隠しきれる。まるまる1波ぶん下から始めると、
 * めくりの最初の1割が画面の外で終わってしまい、動き出しが遅れて見える。
 */
const START_MARGIN = 0.15

export const crestY = (progress: number, height: number, waveH: number): number => {
  const from = height + waveH * START_MARGIN
  const to = -waveH
  return from - progress * (from - to)
}

/** 稜線そのもの。線として描く用（影・光の縁）。 */
export const crestPath = (
  progress: number,
  width: number,
  height: number,
  waveH: number,
): string => {
  const sx = width / VIEW_W
  const sy = waveH / VIEW_H
  const y0 = crestY(progress, height, waveH)
  const at = ([x, y]: Point) => `${(x * sx).toFixed(2)} ${(y * sy + y0).toFixed(2)}`
  // S の制御点の反射は拡大・平行移動と交換できるので、点を先に写しても同じ形になる。
  return `M${at(START)}C${CURVE.map(at).join(',')}S${SMOOTH_A.map(at).join(',')}S${SMOOTH_B.map(at).join(',')}`
}

/** 稜線より下を閉じたもの。切り抜き用（新しい紙が下から現れる）。 */
export const belowCrestPath = (
  progress: number,
  width: number,
  height: number,
  waveH: number,
): string => {
  const far = height * 4
  return `${crestPath(progress, width, height, waveH)}L${width.toFixed(2)} ${far}L0 ${far}Z`
}
