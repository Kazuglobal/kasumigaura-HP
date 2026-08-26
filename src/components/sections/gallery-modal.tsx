'use client'

import Image from 'next/image'
import { useEffect, useRef, type AnimationEvent } from 'react'
import { gallerySection } from '@/data/sections'
import { site } from '@/data/site'
import { useBodyClass } from '@/hooks/use-body-class'
import styles from './gallery.module.css'

type Props = {
  closing: boolean
  onClose: () => void
  onClosed: () => void
}

const youtubeSrc = (id: string): string => `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`

/** E10: fade-in popup (56.25vw 16:9 area) with YouTube iframe or a placeholder photo grid. */
export function GalleryModal({ closing, onClose, onClosed }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null)
  useBodyClass('is-popupOpen', true, true)

  useEffect(() => {
    closeRef.current?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const handleAnimationEnd = (event: AnimationEvent<HTMLDivElement>) => {
    if (closing && event.target === event.currentTarget) onClosed()
  }

  const cls = [styles.popup, closing ? styles.popupOut : styles.popupIn].join(' ')

  return (
    <div
      id="popupContents"
      className={cls}
      role="dialog"
      aria-modal="true"
      aria-label={gallerySection.modalTitle}
      onAnimationEnd={handleAnimationEnd}
    >
      <div className={styles.overlay} onClick={onClose} aria-hidden="true" />
      <div className={styles.popupWrapper}>
        <button ref={closeRef} type="button" className={styles.closeBtn} onClick={onClose}>
          <span className="srOnly">{gallerySection.closeLabel}</span>
        </button>
        <div className={styles.media}>
          {site.youtubeId ? (
            <iframe
              className={styles.iframe}
              src={youtubeSrc(site.youtubeId)}
              title={gallerySection.modalTitle}
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <ul className={styles.grid}>
              {gallerySection.photos.map((photo) => (
                <li key={photo.id} className={styles.tile}>
                  <Image src={photo.src} alt={photo.caption} fill sizes="33vw" unoptimized />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
