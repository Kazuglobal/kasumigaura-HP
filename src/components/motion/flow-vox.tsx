'use client'

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'
import styles from './flow-vox.module.css'

type Props = {
  children: ReactNode
  className?: string
  /** Delay between children in ms. 既定は --stagger-reveal と同じ 180ms。 */
  stagger?: number
  as?: 'div' | 'section' | 'ul' | 'li' | 'article'
}

const LANDSCAPE_RATIO = 0.3
const PORTRAIT_RATIO = 0.2

const rootMarginFor = (): string => {
  const ratio = window.innerWidth > window.innerHeight ? LANDSCAPE_RATIO : PORTRAIT_RATIO
  return `0px 0px -${Math.round(window.innerHeight * ratio)}px 0px`
}

/**
 * C1 reveal: children are masked away (clip-path inset from the top) and slide
 * up 18px, then are revealed bottom-up over --dur-reveal with the signature
 * easing and a per-child stagger, once the box enters the viewport
 * (bottom margin -20% portrait / -30% landscape). Runs once.
 *
 * 「紙が下から差し込まれる」— サイト全体で共有するリビールの語彙。
 */
export function FlowVox({ children, className, stagger = 180, as = 'div' }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) {
      el.classList.add(styles.began, styles.finished)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        el.classList.add(styles.began)
        observer.disconnect()
      },
      { rootMargin: rootMarginFor(), threshold: 0 },
    )
    observer.observe(el)

    const onEnd = (event: TransitionEvent) => {
      if (event.target !== el.lastElementChild) return
      el.classList.add(styles.finished)
    }
    el.addEventListener('transitionend', onEnd)

    return () => {
      observer.disconnect()
      el.removeEventListener('transitionend', onEnd)
    }
  }, [])

  const style = { '--stagger': `${stagger}ms` } as CSSProperties
  const cls = [styles.flowVox, className ?? ''].filter(Boolean).join(' ')
  // All allowed tags share the HTMLElement ref shape; narrow for JSX typing.
  const Tag = as as 'div'

  return (
    <Tag ref={ref} className={cls} style={style}>
      {children}
    </Tag>
  )
}
