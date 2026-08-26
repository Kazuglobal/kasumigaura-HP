'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { site } from '@/data/site'
import { navLabels } from '@/data/nav'
import { useIsSp } from '@/hooks/use-is-sp'
import { useBodyClass } from '@/hooks/use-body-class'
import { GlobalNav } from './global-nav'
import { HeaderRight } from './header-right'
import styles from './header.module.css'

const SP_MINI_OFFSET = 10
const LINEUP_ID = 'js-lineupList'
const MINI_CLASS = 'is-mini'

const miniThreshold = (isSp: boolean): number => {
  if (isSp) return SP_MINI_OFFSET
  const lineup = document.getElementById(LINEUP_ID)
  if (!lineup) return SP_MINI_OFFSET
  return lineup.getBoundingClientRect().top + window.scrollY
}

/**
 * Fixed site header.
 * C3: `.is-mini` once scrollY passes the lineup top (PC) / 10px (SP).
 * E9: SP hamburger toggles body.is-navOpen (scroll lock) + fade-in panel.
 */
export function Header() {
  const headerRef = useRef<HTMLElement>(null)
  const [open, setOpen] = useState(false)
  const isSp = useIsSp()
  const navOpen = open && isSp !== false

  useBodyClass('is-navOpen', navOpen, true)

  useEffect(() => {
    const header = headerRef.current
    if (!header) return
    const mq = window.matchMedia(`(max-width: ${site.breakpointSp}px)`)
    const update = () => {
      header.classList.toggle(MINI_CLASS, window.scrollY > miniThreshold(mq.matches))
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  const close = useCallback(() => setOpen(false), [])
  const toggle = useCallback(() => setOpen((prev) => !prev), [])

  return (
    <header id="siteHeader" ref={headerRef} className={styles.header}>
      <div id="siteLogo" className={styles.logo}>
        <a href="#" className="hoverFade" aria-label={navLabels.toTop} onClick={close}>
          <span className={styles.logoJp}>{site.name}</span>
          <span className={styles.logoEn}>{site.nameEn}</span>
        </a>
      </div>

      <button
        id="gNavOpener"
        type="button"
        className={styles.opener}
        aria-expanded={navOpen}
        aria-controls="gNavWrapper"
        onClick={toggle}
      >
        <span className={styles.bar} />
        <span className={styles.bar} />
        <span className={styles.bar} />
        <span className="srOnly">{navOpen ? navLabels.closeMenu : navLabels.openMenu}</span>
      </button>

      <div id="js-gNavBg" className={styles.navBg} onClick={close} aria-hidden="true" />

      <div id="gNavWrapper" className={styles.navWrapper}>
        <GlobalNav onNavigate={close} />
        <HeaderRight />
      </div>
    </header>
  )
}
