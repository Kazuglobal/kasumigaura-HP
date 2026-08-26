import Image from 'next/image'
import { historySection } from '@/data/sections'
import { FlowVox } from '@/components/motion/flow-vox'
import { SectionHead } from './section-head'
import { HistoryParallax } from './history-parallax'
import { EventsList } from './events-list'
import styles from './history.module.css'

type ImgProps = {
  src: string
  className: string
  range: readonly [number, number]
  sizes: string
}

function ParallaxImage({ src, className, range, sizes }: ImgProps) {
  return (
    <div
      className={`${styles.img} ${className}`}
      data-parallax-from={range[0]}
      data-parallax-to={range[1]}
    >
      <Image src={src} alt="" fill sizes={sizes} unoptimized />
    </div>
  )
}

/** Reference detailsSection: right 510px text column, three rounded images with scrub parallax (C2). */
export function HistorySection() {
  const s = historySection
  const { pc, sp } = s.parallax
  return (
    <section id={s.id} className={styles.section} aria-labelledby="history-title">
      <FlowVox className={`${styles.detailsVox} containerL`}>
        <SectionHead en={s.en} jp={s.jp} id="history-title" className={styles.head} />
        <HistoryParallax className={styles.row}>
          <div className={styles.imgs}>
            <ParallaxImage src={s.images.img01} className={styles.img01} range={pc.img01} sizes="552px" />
            <ParallaxImage src={s.images.img02} className={styles.img02} range={pc.img02} sizes="128px" />
            <ParallaxImage src={s.images.img03} className={styles.img03} range={pc.img03} sizes="252px" />
            <ParallaxImage src={s.images.img04} className={styles.img04} range={sp.img04} sizes="100vw" />
          </div>
          <div className={styles.txt}>
            <p className="copyTxt">
              {s.copy.map((line) => (
                <span key={line} className={styles.copyLine}>
                  {line}
                </span>
              ))}
            </p>
            {s.body.map((p) => (
              <p key={p} className={styles.body}>
                {p}
              </p>
            ))}
            <p className={`btnStyle01 ${styles.btn}`}>
              <a href={s.buttonHref}>{s.button}</a>
            </p>
          </div>
        </HistoryParallax>
      </FlowVox>
      <EventsList />
    </section>
  )
}
