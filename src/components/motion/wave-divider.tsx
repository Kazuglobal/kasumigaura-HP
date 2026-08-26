import styles from './wave-divider.module.css'

type Props = {
  /** Fill colour of the wave body (the area under the crest). */
  fill?: string
  /** Mirror vertically so the filled area is above the crest. */
  flip?: boolean
  /** Height as padding-top percentage of the container width. */
  height?: number
  className?: string
}

const WAVE_PATH =
  'M0 84C180 22 400 8 640 52S1000 112 1200 78 1380 36 1440 30V120H0Z'

export function WaveDivider({ fill = '#fff', flip = false, height = 8, className }: Props) {
  const cls = [styles.wave, flip ? styles.flip : '', className ?? ''].filter(Boolean).join(' ')
  return (
    <div className={cls} style={{ paddingTop: `${height}%` }} aria-hidden="true">
      <svg viewBox="0 0 1440 120" preserveAspectRatio="none" focusable="false">
        <path d={WAVE_PATH} fill={fill} />
      </svg>
    </div>
  )
}
