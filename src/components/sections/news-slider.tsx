'use client'

import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Scrollbar } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/scrollbar'
import { newsItems, newsSection, type NewsItem } from '@/data/news'
import { useIsSp } from '@/hooks/use-is-sp'
import styles from './news.module.css'

function NewsCard({ item }: { item: NewsItem }) {
  return (
    <a href={item.href} className={styles.card}>
      <span className={styles.cardImg}>
        <Image src={item.image} alt="" fill sizes="320px" unoptimized />
      </span>
      <span className={styles.cardBody}>
        <span className={styles.meta}>
          <time className={styles.date}>{item.date}</time>
          <span className={styles.chip}>{item.category}</span>
        </span>
        <span className={styles.title}>{item.title}</span>
        <span className={styles.more}>{newsSection.cardLink}</span>
      </span>
    </a>
  )
}

/** D2: slidesPerView auto (320px), prev/next round buttons (E6), custom draggable scrollbar. */
export function NewsSlider() {
  const isSp = useIsSp() === true
  const s = newsSection
  return (
    <div className={styles.sliderWrap}>
      <Swiper
        id="js-newsSlider"
        modules={[Navigation, Scrollbar]}
        slidesPerView="auto"
        spaceBetween={isSp ? s.spaceBetweenSp : s.spaceBetweenPc}
        navigation={{ prevEl: `.${styles.btnPrev}`, nextEl: `.${styles.btnNext}` }}
        scrollbar={{ el: `.${styles.scrollbar}`, draggable: true, dragSize: s.dragSize, hide: false }}
        className={styles.swiper}
      >
        {newsItems.map((item) => (
          <SwiperSlide key={item.id} className={styles.slide}>
            <NewsCard item={item} />
          </SwiperSlide>
        ))}
      </Swiper>
      <div className={styles.navigation}>
        <button type="button" className={`${styles.navBtn} ${styles.btnPrev}`}>
          <span className="srOnly">{s.prevLabel}</span>
        </button>
        <button type="button" className={`${styles.navBtn} ${styles.btnNext}`}>
          <span className="srOnly">{s.nextLabel}</span>
        </button>
      </div>
      <div className={styles.scrollbar} />
    </div>
  )
}
