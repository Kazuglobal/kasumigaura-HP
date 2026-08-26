import Image from 'next/image'
import { joinLabels, type CtaBanner } from '@/data/join'
import styles from './join.module.css'

/** Rounded 20px CTA banner with a round navy arrow (bottom-right), E8 hover fade. */
export function CtaCard({ banner }: { banner: CtaBanner }) {
  return (
    <a href={banner.href} className={`${styles.bnr} hoverFade`}>
      <Image src={banner.image} alt="" fill sizes="(max-width: 767px) 80vw, 1000px" unoptimized />
      <span className={styles.bnrTxt}>
        <span className={styles.bnrTitle}>{banner.title}</span>
        <span className={styles.bnrSub}>{banner.sub}</span>
      </span>
      <span className={styles.arrow}>
        <span className="srOnly">{joinLabels.arrow}</span>
      </span>
    </a>
  )
}
