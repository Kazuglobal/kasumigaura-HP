export type Banner = {
  readonly id: string
  readonly title: string
  readonly sub: string
  readonly href: string
  readonly tone: 'navy' | 'sky' | 'beige'
}

export const banners: readonly Banner[] = [
  { id: 'meeting', title: '定期総会のご案内', sub: '開催日 [要確認]', href: '#events', tone: 'navy' },
  { id: 'bulletin', title: '会報 最新号', sub: '第[要確認]号 発行', href: '#news', tone: 'sky' },
  { id: 'join', title: '入会・会費のご案内', sub: '年会費 [要確認]', href: '#join', tone: 'beige' },
  { id: 'address', title: '住所変更のお届け', sub: '転居・改姓の際はこちら', href: '/address', tone: 'navy' },
  { id: 'donation', title: '寄付・協賛のお願い', sub: '母校の活動を支える', href: '#join', tone: 'sky' },
  { id: 'official', title: '霞ヶ浦高等学校 公式サイト', sub: '[要確認 URL]', href: '#', tone: 'beige' },
] as const

export const bannerSwiperConfig = {
  slideWidthPc: 650,
  spaceBetweenPc: 50,
  spaceBetweenSp: 15,
  slidesPerViewSp: 1.4,
  speed: 1500,
  autoplayDelay: 3000,
} as const
