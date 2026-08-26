'use client'

import { useRef, type ReactNode } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { useIsSp } from '@/hooks/use-is-sp'

gsap.registerPlugin(ScrollTrigger, useGSAP)

type Props = {
  children: ReactNode
  className?: string
}

const SELECTOR = '[data-parallax-from]'

const isVisible = (el: HTMLElement): boolean => el.offsetParent !== null

/**
 * C2: GSAP ScrollTrigger scrub parallax. Each descendant carrying
 * `data-parallax-from` / `data-parallax-to` (px) is tweened on `y`
 * from `top bottom` to `bottom top` of its own box. `useGSAP` reverts the
 * context on unmount / dependency change, which keeps StrictMode safe.
 */
export function HistoryParallax({ children, className }: Props) {
  const scope = useRef<HTMLDivElement>(null)
  const isSp = useIsSp()

  useGSAP(
    () => {
      if (isSp === undefined || !scope.current) return
      const targets = gsap.utils.toArray<HTMLElement>(SELECTOR, scope.current).filter(isVisible)
      targets.forEach((el) => {
        const from = Number(el.dataset.parallaxFrom)
        const to = Number(el.dataset.parallaxTo)
        gsap.fromTo(
          el,
          { y: from },
          {
            y: to,
            ease: 'none',
            scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        )
      })
    },
    { scope, dependencies: [isSp], revertOnUpdate: true },
  )

  return (
    <div ref={scope} className={className}>
      {children}
    </div>
  )
}
