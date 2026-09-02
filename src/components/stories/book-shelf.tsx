'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { stories, storiesSection, type Story } from '@/data/stories'
import {
  COVER_H,
  COVER_W,
  drawCoverCanvas,
  drawSpineCanvas,
  drawSpreadCanvas,
  loadArt,
} from './cover-canvas'
import { markOpenedFromShelf } from './opened-from-shelf'
import type { BookArt, ShelfHandle } from './shelf-scene'
import styles from './stories.module.css'

/**
 * The shelf is an addition on top of the list below it, never a gate in front of it: it renders
 * nothing at all unless the browser can run it (WebGL, motion allowed) and every asset loaded.
 * Whatever happens here, the article list underneath stays readable and operable.
 */

const hasWebgl = (): boolean => {
  const probe = document.createElement('canvas')
  try {
    return Boolean(probe.getContext('webgl2') ?? probe.getContext('webgl'))
  } catch {
    return false
  }
}

/** The spread canvas is two covers wide; the book needs its halves as separate faces. */
const halfOf = (spread: HTMLCanvasElement, side: 'left' | 'right'): HTMLCanvasElement => {
  const canvas = document.createElement('canvas')
  canvas.width = COVER_W
  canvas.height = COVER_H
  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.drawImage(spread, side === 'left' ? 0 : COVER_W, 0, COVER_W, COVER_H, 0, 0, COVER_W, COVER_H)
  }
  return canvas
}

const buildArt = async (story: Story): Promise<BookArt> => {
  const art = await loadArt(story)
  const cover = drawCoverCanvas(story, art)
  const spread = drawSpreadCanvas(story, art)
  return {
    story,
    cover,
    spine: drawSpineCanvas(story, cover),
    leftPage: halfOf(spread, 'left'),
    rightPage: halfOf(spread, 'right'),
  }
}

export function BookShelf() {
  const router = useRouter()
  const stageRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const shelfRef = useRef<ShelfHandle | null>(null)
  const [ready, setReady] = useState(false)
  const [focused, setFocused] = useState<Story | null>(null)
  // Arrow keys and Enter mean nothing on a touch screen; say what that reader can actually do.
  const [touch, setTouch] = useState(false)

  const openStory = useCallback(
    (story: Story) => {
      markOpenedFromShelf(story.slug)
      router.push(`/stories/${story.slug}`)
    },
    [router],
  )

  useEffect(() => {
    const stage = stageRef.current
    const canvas = canvasRef.current
    if (!stage || !canvas) return

    // Reasons not to run at all. None of them are reported to the reader — the list is right there.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (window.location.hash) return
    if (!hasWebgl()) return

    let cancelled = false

    const start = async () => {
      try {
        const [{ createShelf }, THREE, books] = await Promise.all([
          import('./shelf-scene'),
          import('three'),
          Promise.all(stories.map(buildArt)),
        ])
        if (cancelled || !canvasRef.current || !stageRef.current) return
        shelfRef.current = createShelf({
          THREE,
          canvas: canvasRef.current,
          container: stageRef.current,
          books,
          onFocus: setFocused,
          onOpened: openStory,
        })
        setTouch(window.matchMedia('(hover: none)').matches)
        setReady(true)
      } catch {
        // three.js failed to load or the scene failed to build: stay with the list.
      }
    }

    // three.js is ~730KB; do not fetch it until the section is close to the viewport.
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        observer.disconnect()
        void start()
      },
      { rootMargin: '200px 0px' },
    )
    observer.observe(stage)

    return () => {
      cancelled = true
      observer.disconnect()
      shelfRef.current?.dispose()
      shelfRef.current = null
    }
  }, [openStory])

  return (
    <div ref={stageRef} className={ready ? `${styles.stage} ${styles.stageReady}` : styles.stage}>
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        tabIndex={ready ? 0 : -1}
        role="application"
        aria-label={`${storiesSection.jp}の本棚。${storiesSection.shelfHint}`}
      />
      {ready ? (
        <p className={styles.shelfStatus} aria-live="polite">
          {focused
            ? `${focused.name}（${focused.role}）`
            : touch
              ? storiesSection.shelfHintTouch
              : storiesSection.shelfHint}
        </p>
      ) : null}
    </div>
  )
}
