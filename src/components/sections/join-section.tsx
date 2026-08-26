import { joinCta } from '@/data/join'
import { FlowVox } from '@/components/motion/flow-vox'
import { CtaCard } from './cta-card'
import { JoinSlider } from './join-slider'
import styles from './join.module.css'

const SECTION_ID = 'join'

/** Reference bnrArea: 1000px rounded CTA banner on PC, Swiper D4 on SP. */
export function JoinSection() {
  return (
    <section id={SECTION_ID} className={styles.section} aria-label={joinCta.title}>
      <FlowVox className={`${styles.inner} containerS`}>
        <div className={styles.pcOnly}>
          <CtaCard banner={joinCta} />
        </div>
        <div className={styles.spOnly}>
          <JoinSlider />
        </div>
      </FlowVox>
    </section>
  )
}
