import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion'
import {
  DRIFTS,
  DRIFT_PCT,
  EDGE_RATIO,
  HOLD,
  LIFT_PCT,
  LIFT_SCALE,
  SHADOW_RATIO,
  SLIDE,
  SLIDES,
  WAVE_RATIO,
  WIPE,
  ZOOM_TO,
  type HeroVariant,
} from './slides'
import { belowCrestPath, crestPath } from './wave'

/**
 * 紙が走る速度。サイトの signature easing（強い ease-out）はここでは使わない。
 * 強い ease-out は「到着するもの」の曲線で、画面を横切る掃きに当てると最初の
 * 数フレームで大半が終わり、めくっている途中が見えなくなる。紙は手で持ち上げて
 * から落ちるので、両端だけ和らげた曲線を当てる。
 *
 * 値は「稜線が画面内にいるフレーム数」で選んだ。(0.65,0,0.35,1) は入りが緩すぎて
 * 動き出しが鈍く、(0.45,0.05,0.35,1) は逆に7割の時点で抜けきって最後の0.3秒が
 * 死んだ。(0.5,0.1,0.5,0.9) なら30フレーム中23フレーム＝0.77秒が見える。
 * サイト全体で例外はこの1つだけ。
 */
const SWEEP = Easing.bezier(0.5, 0.1, 0.5, 0.9)

/** 紙の色。サイトの --c-bg2 と揃え、写真を生成りの紙に刷ったように見せる。 */
const PAPER = '#f5f3ec'

const BLUR_ID = 'heroEdgeBlur'

/**
 * 1枚の紙。寄りと流れだけを持ち、めくりには関与しない。
 * `local` はその紙が現れてからのフレーム数。
 */
const Slide: React.FC<{
  readonly src: string
  readonly index: number
  readonly local: number
  readonly lift: number
}> = ({ src, index, local, lift }) => {
  const zoom = interpolate(local, [0, SLIDE], [1, ZOOM_TO], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const [dx, dy] = DRIFTS[index % DRIFTS.length]
  const travel = interpolate(local, [0, SLIDE], [0, DRIFT_PCT], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  // めくられる側は持ち上がりながら奥へ逃げる。位置だけだと「隠れた」に見える。
  const away = 1 + (LIFT_SCALE - 1) * (lift / LIFT_PCT)

  return (
    <AbsoluteFill
      style={{
        backgroundColor: PAPER,
        overflow: 'hidden',
        transform: `translateY(${-lift}%) scale(${away})`,
      }}
    >
      <AbsoluteFill
        style={{ transform: `scale(${zoom}) translate(${dx * travel}%, ${dy * travel}%)` }}
      >
        <Img src={staticFile(src)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </AbsoluteFill>
    </AbsoluteFill>
  )
}

/** 質感。紙の地色をごく薄く敷き、四隅を落とす。これ以上は足さない。 */
const Paper: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: 'none' }}>
    <AbsoluteFill style={{ backgroundColor: PAPER, opacity: 0.07, mixBlendMode: 'soft-light' }} />
    <AbsoluteFill
      style={{
        background:
          'radial-gradient(120% 85% at 50% 42%, rgba(0,0,0,0) 55%, rgba(0,24,48,0.22) 100%)',
      }}
    />
  </AbsoluteFill>
)

/**
 * ファーストビューの背景。
 *
 * i 枚目は `i * HOLD` に現れ、WIPE フレームかけて稜線が下から上へ走り、その線より
 * 下が新しい紙になる。**紙に見せているのは切り抜きの形ではなく、影と光の縁**。
 * 持ち上がった紙は下の紙に影を落とし、めくれた縁は光を受ける。この2つが無いと、
 * どれだけ形を凝ってもマスクにしか見えない（最初の版がそうだった）。
 *
 * 最後にもう一度1枚目を置き、その紙が入りきった瞬間で切る。先頭フレームと終端
 * フレームがほぼ同じ絵になるので、ループの継ぎ目が出ない。
 */
export const HeroVideo: React.FC<{ readonly variant: HeroVariant }> = ({ variant }) => {
  const frame = useCurrentFrame()
  const { width, height } = useVideoConfig()
  const sources = SLIDES[variant]
  const waveH = height * WAVE_RATIO
  const order = [...sources, sources[0]]
  const total = sources.length * HOLD + WIPE

  /** i 枚目の進入の進み具合。0 = まだ見えない、1 = 入りきった。 */
  const progressOf = (i: number): number =>
    i === 0
      ? 1
      : interpolate(frame, [i * HOLD, i * HOLD + WIPE], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: SWEEP,
        })

  /** 影と光は、めくり始めと終わりで消す。止まっている紙は影を落とさない。 */
  const edgeOpacity = (p: number): number =>
    p <= 0 || p >= 1 ? 0 : interpolate(p, [0, 0.14, 0.86, 1], [0, 1, 1, 0])

  const shadowWidth = height * SHADOW_RATIO * 2
  const edgeWidth = Math.max(1.2, height * EDGE_RATIO)

  return (
    <AbsoluteFill style={{ backgroundColor: PAPER }}>
      <svg width={0} height={0} style={{ position: 'absolute' }} aria-hidden>
        <defs>
          <filter id={BLUR_ID} x="-20%" y="-200%" width="140%" height="500%">
            <feGaussianBlur stdDeviation={height * 0.022} />
          </filter>
          {order.map((_, i) =>
            i === 0 ? null : (
              <clipPath key={i} id={`crest-${i}`} clipPathUnits="userSpaceOnUse">
                <path d={belowCrestPath(progressOf(i), width, height, waveH)} />
              </clipPath>
            ),
          )}
        </defs>
      </svg>

      {order.map((src, i) => {
        const progress = progressOf(i)
        // まだ現れていない紙は組み立てない。画像の読み込みも起こさない。
        if (progress <= 0) return null
        // 1つ上の紙が入ってくる間だけ、この紙は持ち上がる。
        const lift = LIFT_PCT * progressOf(i + 1)
        const shade = edgeOpacity(progress)
        return (
          <AbsoluteFill
            key={`${src}-${i}`}
            style={i === 0 ? undefined : { clipPath: `url(#crest-${i})` }}
          >
            <Slide
              src={src}
              index={i % sources.length}
              // 末尾の複製だけは寄りを進めない（local が負のまま = 寄り 1.00 に張り付く）。
              // 進めると、最後の1秒で 1.3% 寄った絵で終わり、先頭へ戻る瞬間に跳ねる。
              local={i === order.length - 1 ? frame - total : frame - i * HOLD}
              lift={lift}
            />
            {/*
              持ち上がった紙が落とす影。稜線を太い線で描き、切り抜きで下半分だけを
              残す。切り抜きはこの要素の親に掛かっているので、影は新しい紙の上に
              しか乗らない。
            */}
            {shade > 0 ? (
              <svg
                style={{ position: 'absolute', inset: 0, opacity: shade }}
                width={width}
                height={height}
                viewBox={`0 0 ${width} ${height}`}
                aria-hidden
              >
                <path
                  d={crestPath(progress, width, height, waveH)}
                  fill="none"
                  stroke="rgba(0,18,36,0.62)"
                  strokeWidth={shadowWidth}
                  filter={`url(#${BLUR_ID})`}
                />
              </svg>
            ) : null}
          </AbsoluteFill>
        )
      })}

      {/*
        めくれた縁が受ける光。切り抜きの外に置く。中に入れると線の半分が
        断ち切られ、光ではなく「境目の汚れ」に見える。
      */}
      {order.map((_, i) => {
        if (i === 0) return null
        const shade = edgeOpacity(progressOf(i))
        if (shade <= 0) return null
        return (
          <svg
            key={`edge-${i}`}
            style={{ position: 'absolute', inset: 0, opacity: shade * 0.75 }}
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            aria-hidden
          >
            <path
              d={crestPath(progressOf(i), width, height, waveH)}
              fill="none"
              stroke="rgba(255,252,244,0.85)"
              strokeWidth={edgeWidth}
            />
          </svg>
        )
      })}

      <Paper />
    </AbsoluteFill>
  )
}
