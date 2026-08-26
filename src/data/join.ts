import { banners, type Banner } from './banners'

export type CtaBanner = {
  readonly id: string
  readonly title: string
  readonly sub: string
  readonly href: string
  readonly image: string
}

/** #join CTA banner (reference bnrArea). Fee is [要確認]. */
export const joinCta: CtaBanner = {
  id: 'join-cta',
  title: '入会・会費・住所変更のご案内',
  sub: '年会費 [要確認] / お手続きは事務局まで',
  href: '#contact',
  image: '/placeholder/cta.svg',
} as const

const extraIds: readonly Banner['id'][] = ['address', 'donation']

const toCta = (b: Banner): CtaBanner => ({
  id: b.id,
  title: b.title,
  sub: b.sub,
  href: b.href,
  image: '/placeholder/cta.svg',
})

/** SP Swiper (D4) shows the CTA plus two internal banners. */
export const joinSpBanners: readonly CtaBanner[] = [
  joinCta,
  ...banners.filter((b) => extraIds.includes(b.id)).map(toCta),
]

export const joinSwiperConfig = {
  slidesPerView: 1.5,
  spaceBetween: 15,
  speed: 1500,
  autoplayDelay: 3000,
  minSlidesForSwiper: 3,
} as const

export const joinLabels = {
  arrow: '詳しく見る',
} as const
