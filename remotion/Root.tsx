import { Composition } from 'remotion'
import { HeroVideo } from './hero/hero'
import { durationOf, FPS } from './hero/slides'

/**
 * ファーストビューの背景動画。PC と SP でアートディレクションを分けているので
 * 構図ごとに別コンポジションにする（同じ動画を切り抜くと、横位置の写真を縦で
 * 見せることになって構図が壊れる）。
 *
 * 文字は入れない。見出しはサイト側の HTML で重ねる。
 */
export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="HeroPc"
      component={HeroVideo}
      durationInFrames={durationOf('pc')}
      fps={FPS}
      // クイックナビを写真の外へ出したので、写真はファーストビューいっぱいを使う。
      // 1440x900 の窓で 1440x825 = 約 1.75:1。窓の寸法で前後するので、素直に 16:9。
      width={1920}
      height={1080}
      defaultProps={{ variant: 'pc' as const }}
    />
    <Composition
      id="HeroSp"
      component={HeroVideo}
      durationInFrames={durationOf('sp')}
      fps={FPS}
      width={1080}
      height={1920}
      defaultProps={{ variant: 'sp' as const }}
    />
  </>
)
