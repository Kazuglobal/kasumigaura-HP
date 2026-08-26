'use client'

import { useCallback, useRef, useState } from 'react'
import { gallerySection } from '@/data/sections'
import { site } from '@/data/site'
import { GalleryModal } from './gallery-modal'
import styles from './gallery.module.css'

type ModalState = 'closed' | 'open' | 'closing'

/** Circular .btnStyle02 button; label switches to PLAY MOVIE when site.youtubeId is set. */
export function GalleryTrigger() {
  const [state, setState] = useState<ModalState>('closed')
  const triggerRef = useRef<HTMLButtonElement>(null)
  const label = site.youtubeId ? gallerySection.circleLabelMovie : gallerySection.circleLabelPhotos

  const open = useCallback(() => setState('open'), [])
  const close = useCallback(() => setState((prev) => (prev === 'open' ? 'closing' : prev)), [])
  const finishClose = useCallback(() => {
    setState('closed')
    triggerRef.current?.focus()
  }, [])

  return (
    <>
      <button
        id="js-galleryBtn"
        ref={triggerRef}
        type="button"
        className={`btnStyle02 ${styles.circle}`}
        onClick={open}
        aria-haspopup="dialog"
        aria-expanded={state !== 'closed'}
      >
        {label}
      </button>
      {state !== 'closed' && (
        <GalleryModal closing={state === 'closing'} onClose={close} onClosed={finishClose} />
      )}
    </>
  )
}
