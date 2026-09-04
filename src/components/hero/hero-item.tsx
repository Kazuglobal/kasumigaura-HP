import Image from 'next/image'
import type { CSSProperties, TransitionEvent } from 'react'
import { hero, type HeroCard } from '@/data/hero'
import { WaveDivider } from '@/components/motion/wave-divider'
import { HeroIntroVisual } from './hero-intro-visual'
import styles from './hero.module.css'

const WAVE_HEIGHT = 5
const WAVE_FILL = 'var(--c-bg2)'

function HeroImage({ src, priority = false }: { src: string; priority?: boolean }) {
  return (
    <div className={styles.img}>
      <Image src={src} alt="" fill sizes="100vw" priority={priority} unoptimized />
      <WaveDivider fill={WAVE_FILL} height={WAVE_HEIGHT} className={styles.wave} />
    </div>
  )
}

/**
 * 文節ひとつ。下からのマスクリビールで出す。
 *
 * `--part` は文節の通し番号で、行をまたいで連番になっている。PC の1行と SP の
 * 2行で行の割れ方は違うが、読む順は同じなので、遅れの計算は行ではなく文節で
 * 通す。
 */
function CatchPart({ text, order }: { text: string; order: number }) {
  return (
    <span className={styles.part} style={{ '--part': order } as CSSProperties}>
      <span className={styles.partInner}>{text}</span>
    </span>
  )
}

/** Always-visible intro figure with the text catch copy (A3). */
export function HeroIntro() {
  return (
    <figure className={`${styles.item} ${styles.intro}`}>
      <HeroIntroVisual />
      <figcaption className={styles.mainCopy}>
        <h1 className={styles.catch}>
          <span className={styles.catchPc}>
            {hero.catchCopyPcLine.map((text, i) => (
              <CatchPart key={text} text={text} order={i} />
            ))}
          </span>
          <span className={styles.catchSp}>
            {hero.catchCopySpLines.map((parts, line) => {
              // 遅れは行ではなく文節の通し番号で決める。行をまたいでも読む順は続く。
              const offset = hero.catchCopySpLines
                .slice(0, line)
                .reduce((n, l) => n + l.length, 0)
              return (
                <span key={line} className={styles.catchSpLine}>
                  {parts.map((text, i) => (
                    <CatchPart key={text} text={text} order={offset + i} />
                  ))}
                </span>
              )
            })}
          </span>
        </h1>
        <p className={styles.catchSub}>{hero.sub}</p>
      </figcaption>
    </figure>
  )
}

type ItemProps = {
  card: HeroCard
  isActive: boolean
  isHiding: boolean
  onClose: () => void
  onHidden: () => void
}

export function HeroItem({ card, isActive, isHiding, onClose, onHidden }: ItemProps) {
  const cls = [styles.item, isActive ? styles.isActive : '', isHiding ? styles.isHide : '']
    .filter(Boolean)
    .join(' ')

  const handleEnd = (event: TransitionEvent<HTMLElement>) => {
    if (!isHiding || event.propertyName !== 'opacity') return
    onHidden()
  }

  return (
    <figure className={cls} onTransitionEnd={handleEnd} aria-hidden={!isActive}>
      <HeroImage src={card.image} />
      <figcaption className={styles.outline}>
        <div className={styles.txt}>
          <h2 className={styles.title}>{card.title}</h2>
          <p className={styles.copy}>{card.copy}</p>
          <p className={styles.body}>{card.body}</p>
          <div className={`btnStyle01 ${styles.btn}`}>
            <a href={card.href} tabIndex={isActive ? 0 : -1}>
              {card.button}
            </a>
          </div>
          <button type="button" className={styles.closeBtn} onClick={onClose} tabIndex={isActive ? 0 : -1}>
            <span className="srOnly">{hero.closeLabel}</span>
          </button>
        </div>
      </figcaption>
    </figure>
  )
}
