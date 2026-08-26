import Image from 'next/image'
import { aboutSection } from '@/data/sections'
import { FlowVox } from '@/components/motion/flow-vox'
import { WaveDivider } from '@/components/motion/wave-divider'
import { SectionHead } from './section-head'
import styles from './about.module.css'

const WAVE_HEIGHT = 8

/** Reference conceptSection: beige band flowing into a wave, big rounded photo + white text card. */
export function AboutSection() {
  const s = aboutSection
  return (
    <section id={s.id} className={styles.section} aria-labelledby="about-title">
      <FlowVox className={styles.inner}>
        <SectionHead en={s.en} jp={s.jp} id="about-title" />
        <div className={`${styles.conceptVox} containerL`}>
          <div className={styles.img}>
            <Image src={s.image} alt="" fill sizes="(max-width: 767px) 100vw, 1300px" unoptimized />
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
        </div>
      </FlowVox>
      <WaveDivider fill="#fff" height={WAVE_HEIGHT} className={styles.wave} />
    </section>
  )
}
