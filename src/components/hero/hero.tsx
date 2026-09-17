'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { hero, heroCards } from '@/data/hero'
import { HeroItem, HeroIntro } from './hero-item'
import { Lineup } from './lineup'
import styles from './hero.module.css'

type HeroState = {
  readonly active: number | null
  readonly hiding: number | null
}

const INITIAL: HeroState = { active: null, hiding: null }

/**
 * B1/B2: overlay items switched by lineup hover (PC) or tap (SP).
 * The leaving item keeps `.is-hide` until its transition ends.
 */
export function Hero() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [state, setState] = useState<HeroState>(INITIAL)

  const activate = useCallback((index: number) => {
    setState((s) => (s.active === index ? s : { active: index, hiding: s.active }))
  }, [])

  const deactivate = useCallback(() => {
    setState((s) => (s.active === null ? s : { active: null, hiding: s.active }))
  }, [])

  const toggle = useCallback((index: number) => {
    setState((s) =>
      s.active === index ? { active: null, hiding: index } : { active: index, hiding: s.active },
    )
  }, [])

  const clearHiding = useCallback((index: number) => {
    setState((s) => (s.hiding === index ? { ...s, hiding: null } : s))
  }, [])

  useEffect(() => {
    if (!window.matchMedia('(any-hover: hover)').matches) return
    const onMouseOver = (event: MouseEvent) => {
      const wrapper = wrapperRef.current
      if (!wrapper || wrapper.contains(event.target as Node)) return
      deactivate()
    }
    document.addEventListener('mouseover', onMouseOver)
    return () => document.removeEventListener('mouseover', onMouseOver)
  }, [deactivate])

  return (
    <div id="mainVisualWrapper" ref={wrapperRef} className={styles.wrapper}>
      <section id="mainVisual" className={styles.mainVisual} aria-label={hero.sub}>
        <div id="js-mvSlider" className={styles.slider}>
          <HeroIntro />
          {heroCards.map((card, index) => (
            <HeroItem
              key={card.id}
              card={card}
              isActive={state.active === index}
              isHiding={state.hiding === index}
              onClose={() => toggle(index)}
              onHidden={() => clearHiding(index)}
            />
          ))}
        </div>
      </section>
      {/*
        クイックナビ。以前は写真の上に浮かせていたが、カードの上端が写真に、
        下端が地の色に掛かって、どちらの要素なのか読み取れなかった。
        写真の外に出し、直下の帯として置く。ホバーで上の写真が変わる関係は
        そのまま（#mainVisualWrapper の中にいるので離脱の判定も効く）。
      */}
      <div className={styles.quickNav}>
        <Lineup active={state.active} onEnter={activate} onToggle={toggle} />
      </div>
    </div>
  )
}
