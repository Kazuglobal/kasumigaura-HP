'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import { hero, heroCards } from '@/data/hero'
import { LineupCard } from './lineup-card'
import styles from './lineup.module.css'

type Props = {
  active: number | null
  onToggle: (index: number) => void
}

const SPACE_BETWEEN = 10

/** B4: SP lineup Swiper (slidesPerView auto, loop, prev/next). */
export function LineupSwiper({ active, onToggle }: Props) {
  return (
    <div className={styles.swiperWrap}>
      <Swiper
        modules={[Navigation]}
        slidesPerView="auto"
        spaceBetween={SPACE_BETWEEN}
        loop
        navigation={{ prevEl: `.${styles.btnPrev}`, nextEl: `.${styles.btnNext}` }}
        className={styles.swiper}
      >
        {heroCards.map((card, index) => (
          <SwiperSlide key={card.id} className={styles.slide}>
            <LineupCard
              card={card}
              isActive={active === index}
              onClick={(event) => {
                event.preventDefault()
                onToggle(index)
              }}
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <button type="button" className={`${styles.navBtn} ${styles.btnPrev}`}>
        <span className="srOnly">{hero.prevLabel}</span>
      </button>
      <button type="button" className={`${styles.navBtn} ${styles.btnNext}`}>
        <span className="srOnly">{hero.nextLabel}</span>
      </button>
    </div>
  )
}
