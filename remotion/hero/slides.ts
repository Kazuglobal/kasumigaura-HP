/**
 * ファーストビュー動画の素材とタイミング。
 *
 * 文字はここに入れない。日本語の見出しは動画に焼き込まず、サイト側の HTML で
 * 重ねる（検索・拡大・読み上げが効くうえ、文言の差し替えに再レンダリングが要らない）。
 */

export const FPS = 30

/** 1枚あたりの持ち時間。ワイプを引いても3.5秒は落ち着いて見ていられる。 */
export const SLIDE = 135
/**
 * 紙が抜けきるまで。1.0秒。
 * 20フレーム(0.67秒)では、稜線が見える帯を横切るのが0.3秒ほどしかなく、
 * めくりではなくただの切り替わりに見えた。
 */
export const WIPE = 30
/** 次の紙が現れるまでの間隔。1枚の持ち時間からワイプ分を引いたもの。 */
export const HOLD = SLIDE - WIPE

/** 波形の振幅。断ち切り線の高さを画面高に対する比で持つ。 */
export const WAVE_RATIO = 0.11

/**
 * めくられる側の紙の動き。持ち上がって奥へ逃げる。
 * 3%・拡大なしでは「ただ隠れた」ようにしか見えなかった。
 */
export const LIFT_PCT = 6
export const LIFT_SCALE = 1.035

/** 持ち上がった紙が下の紙に落とす影の太さ。画面高に対する比。 */
export const SHADOW_RATIO = 0.085
/** めくれた縁が受ける光の太さ。画面高に対する比。 */
export const EDGE_RATIO = 0.004

/**
 * Ken Burns の寄り幅。1枚の持ち時間をかけて 6% 寄る。
 * 3% は静止画と見分けがつかず、待ち時間が死んでいた。
 */
export const ZOOM_TO = 1.06
/** 流れる幅。画面に対する %。 */
export const DRIFT_PCT = 1.6

/**
 * 流れる向き。1枚ごとに変えて、ループが機械的に見えないようにする。
 * 4方向を順に使い、5枚目で1周する。
 */
export const DRIFTS: readonly (readonly [number, number])[] = [
  [1, 0],
  [-0.6, -0.6],
  [-1, 0],
  [0.6, 0.6],
  [0.7, -0.7],
]

export type HeroVariant = 'pc' | 'sp'

export const SLIDES: Record<HeroVariant, readonly string[]> = {
  pc: [
    'images/hero-intro.webp',
    'images/hero-pc-01.webp',
    'images/hero-pc-02.webp',
    'images/hero-pc-03.webp',
    'images/hero-pc-04.webp',
  ],
  sp: [
    'images/hero-sp-01.webp',
    'images/hero-sp-02.webp',
    'images/hero-sp-03.webp',
    'images/hero-sp-04.webp',
  ],
}

/**
 * 最後にもう一度1枚目を置き、その紙が入りきった瞬間で切る。先頭フレームと
 * 終端フレームがほぼ同じ絵になるので、ループの継ぎ目が出ない。
 */
export const durationOf = (variant: HeroVariant): number =>
  SLIDES[variant].length * HOLD + WIPE
