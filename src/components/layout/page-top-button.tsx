'use client'

import { footerLabels } from '@/data/footer'
import styles from './footer.module.css'

/** C4 + E7: 90px circular PAGE TOP button; white inner circle grows to 83% on hover. */
export function PageTopButton() {
  const toTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })
  return (
    <div className={styles.pageTopVox}>
      <button type="button" className={styles.pageTop} onClick={toTop} aria-label={footerLabels.pageTopA11y}>
        <span className={styles.pageTopLabel}>{footerLabels.pageTop}</span>
      </button>
    </div>
  )
}
