'use client'

import { useEffect } from 'react'

/**
 * Toggles a class on <body> while `active` is true.
 * Restores the previous scroll position when the class is removed
 * (used by the SP nav scroll lock, E9).
 */
export function useBodyClass(className: string, active: boolean, lockScroll = false): void {
  useEffect(() => {
    if (!active) return
    const scrollY = window.scrollY
    const { body } = document
    body.classList.add(className)
    if (lockScroll) {
      body.style.top = `-${scrollY}px`
    }
    return () => {
      body.classList.remove(className)
      if (lockScroll) {
        body.style.top = ''
        window.scrollTo(0, scrollY)
      }
    }
  }, [className, active, lockScroll])
}
