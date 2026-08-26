import { newsSection } from '@/data/news'
import { FlowVox } from '@/components/motion/flow-vox'
import { WaveDivider } from '@/components/motion/wave-divider'
import { SectionHead } from './section-head'
import { NewsSlider } from './news-slider'
import styles from './news.module.css'

const WAVE_TOP = 16.4
const WAVE_BOTTOM = 7.8
const BEIGE = 'var(--c-bg2)'

/** Reference recipeSection: beige band between two waves with the card Swiper (D2). */
export function NewsSection() {
  const s = newsSection
  return (
    <section id={s.id} className={styles.section} aria-labelledby="news-title">
      <WaveDivider fill={BEIGE} height={WAVE_TOP} className={styles.waveTop} />
      <div className={styles.band}>
        <FlowVox className={styles.inner}>
          <SectionHead en={s.en} jp={s.jp} id="news-title" />
          <NewsSlider />
          <p className={`btnStyle01 ${styles.btn}`}>
            <a href={s.buttonHref}>{s.button}</a>
          </p>
        </FlowVox>
      </div>
      <WaveDivider fill={BEIGE} flip height={WAVE_BOTTOM} className={styles.waveBottom} />
    </section>
  )
}
