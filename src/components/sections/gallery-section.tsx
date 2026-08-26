import Image from 'next/image'
import { gallerySection } from '@/data/sections'
import { FlowVox } from '@/components/motion/flow-vox'
import { SectionHead } from './section-head'
import { GalleryTrigger } from './gallery-trigger'
import styles from './gallery.module.css'

/** Reference gallerySection: full-width photo, right-aligned text, circular button -> modal (E2/E10). */
export function GallerySection() {
  const s = gallerySection
  return (
    <section id={s.id} className={styles.section} aria-labelledby="gallery-title">
      <FlowVox>
        <SectionHead en={s.en} jp={s.jp} id="gallery-title" />
        <div className={styles.galleryVox}>
          <Image src={s.background} alt="" fill sizes="100vw" unoptimized />
          <div className={styles.txt}>
            <p className={styles.lead}>
              {s.body.map((line) => (
                <span key={line} className={styles.leadLine}>
                  {line}
                </span>
              ))}
            </p>
            <GalleryTrigger />
          </div>
        </div>
        <p className={`btnStyle01 ${styles.btn}`}>
          <a href={s.buttonHref}>{s.button}</a>
        </p>
      </FlowVox>
    </section>
  )
}
