import Image from 'next/image'
import type { TransitionEvent } from 'react'
import { hero, type HeroCard } from '@/data/hero'
import { WaveDivider } from '@/components/motion/wave-divider'
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

/** Always-visible intro figure with the text catch copy (A3). */
export function HeroIntro() {
  return (
    <figure className={`${styles.item} ${styles.intro}`}>
      <HeroImage src={hero.introImage} priority />
      <figcaption className={styles.mainCopy}>
        <h1 className={styles.catch}>
          <span className={styles.catchPc}>{hero.catchCopy}</span>
          <span className={styles.catchSp}>
            {hero.catchCopySpLines.map((line) => (
              <span key={line}>{line}</span>
            ))}
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
