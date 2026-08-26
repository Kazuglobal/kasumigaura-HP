import { BannerSlider } from './banner-slider'
import styles from './banner.module.css'

/** Beige banner band under the hero (D1). */
export function BannerSection() {
  return (
    <div id="content" className={styles.bnrList}>
      <BannerSlider />
    </div>
  )
}
