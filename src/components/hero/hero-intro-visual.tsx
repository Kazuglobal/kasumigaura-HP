'use client'

import { useEffect, useState } from 'react'
import { hero } from '@/data/hero'
import { WaveDivider } from '@/components/motion/wave-divider'
import styles from './hero.module.css'

const WAVE_HEIGHT = 5
const WAVE_FILL = 'var(--c-bg2)'

const SP_QUERY = '(max-width: 767px)'

/**
 * A3: the intro slideshow behind the catch copy.
 * The image sources live in hero.module.css so each breakpoint downloads
 * only its own art direction (landscape on PC, portrait full-bleed on SP).
 * PC runs all 5 slides; SP drops the landscape opener and runs the 4 photos.
 */
export function HeroIntroVisual() {
  const [index, setIndex] = useState(0)
  const [count, setCount] = useState<number>(hero.introSlidesPc)

  useEffect(() => {
    const mq = window.matchMedia(SP_QUERY)
    const sync = () => {
      const next = mq.matches ? hero.introSlidesSp : hero.introSlidesPc
      setCount(next)
      setIndex((i) => (i < next ? i : 0))
    }
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    if (count < 2) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % count)
    }, hero.introIntervalMs)
    return () => window.clearInterval(id)
  }, [count])

  return (
    <div className={styles.introVisual} aria-hidden>
      {Array.from({ length: hero.introSlidesPc }, (_, i) => (
        <div key={i} className={`${styles.slide} ${i === index ? styles.slideActive : ''}`} />
      ))}
      <div className={styles.scrim} />
      <WaveDivider fill={WAVE_FILL} height={WAVE_HEIGHT} className={styles.wave} />
    </div>
  )
}
