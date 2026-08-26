'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import 'swiper/css'
import { banners, bannerSwiperConfig, type Banner } from '@/data/banners'
import { useIsSp } from '@/hooks/use-is-sp'
import styles from './banner.module.css'

/** Reference doubles the 6 banners to 12 slides so loop mode has room. */
const slides: readonly Banner[] = [...banners, ...banners]

const toneClass: Record<Banner['tone'], string> = {
  navy: styles.toneNavy,
  sky: styles.toneSky,
  beige: styles.toneBeige,
}

export function BannerSlider() {
  const isSp = useIsSp() === true
  const cfg = bannerSwiperConfig

  return (
    <Swiper
      key={isSp ? 'sp' : 'pc'}
      id="js-bnrList"
      modules={[Autoplay]}
      slidesPerView={isSp ? cfg.slidesPerViewSp : 'auto'}
      spaceBetween={isSp ? cfg.spaceBetweenSp : cfg.spaceBetweenPc}
      centeredSlides
      loop
      speed={cfg.speed}
      autoplay={{ delay: cfg.autoplayDelay, disableOnInteraction: false }}
      className={styles.slider}
    >
      {slides.map((b, i) => (
        <SwiperSlide key={`${b.id}-${i}`} className={styles.slide}>
          <a href={b.href} className={`${styles.bnr} ${toneClass[b.tone]} hoverFade`}>
            <span className={styles.bnrTitle}>{b.title}</span>
            <span className={styles.bnrSub}>{b.sub}</span>
          </a>
        </SwiperSlide>
      ))}
    </Swiper>
  )
}
