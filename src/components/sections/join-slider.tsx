'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import 'swiper/css'
import { joinSpBanners, joinSwiperConfig } from '@/data/join'
import { CtaCard } from './cta-card'
import styles from './join.module.css'

/** D4: SP-only footer banner Swiper (1.5 / centered / 15px / loop / 1500ms / 3000ms). */
export function JoinSlider() {
  const cfg = joinSwiperConfig
  if (joinSpBanners.length < cfg.minSlidesForSwiper) {
    return <CtaCard banner={joinSpBanners[0]} />
  }
  // Reference clones slides when 3 or fewer so loop mode has room.
  const slides = [...joinSpBanners, ...joinSpBanners]
  return (
    <Swiper
      id="js-footerBnr"
      modules={[Autoplay]}
      slidesPerView={cfg.slidesPerView}
      spaceBetween={cfg.spaceBetween}
      centeredSlides
      loop
      speed={cfg.speed}
      autoplay={{ delay: cfg.autoplayDelay, disableOnInteraction: false }}
      className={styles.slider}
    >
      {slides.map((b, i) => (
        <SwiperSlide key={`${b.id}-${i}`} className={styles.slide}>
          <CtaCard banner={b} />
        </SwiperSlide>
      ))}
    </Swiper>
  )
}
