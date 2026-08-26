export type HeroCard = {
  readonly id: string
  readonly title: string
  readonly copy: string
  readonly body: string
  readonly href: string
  readonly image: string
  readonly icon: string
  readonly button: string
}

export const hero = {
  catchCopy: 'つながる、ひろがる、霞ヶ浦。',
  catchCopySpLines: ['つながる、ひろがる、', '霞ヶ浦。'],
  sub: '霞ヶ浦高等学校同窓会 公式サイト',
  introImage: '/placeholder/hero-intro.svg',
  buttonLabel: '詳しく見る',
  closeLabel: '閉じる',
  prevLabel: '前へ',
  nextLabel: '次へ',
} as const

export const heroCards: readonly HeroCard[] = [
  {
    id: 'about',
    title: '同窓会について',
    copy: '母校を想う心を、次の世代へ。',
    body: '会の目的・組織・会長挨拶をご紹介します。',
    href: '#about',
    image: '/placeholder/hero-01.svg',
    icon: '/icons/card-01.svg',
    button: '詳しく見る',
  },
  {
    id: 'events',
    title: '年間行事',
    copy: '一年を通して、再会の場を。',
    body: '総会・懇親会・支部会などの予定([要確認])。',
    href: '#events',
    image: '/placeholder/hero-02.svg',
    icon: '/icons/card-02.svg',
    button: '詳しく見る',
  },
  {
    id: 'news',
    title: '会報・お知らせ',
    copy: '母校と仲間の「いま」を届ける。',
    body: '会報最新号とお知らせの一覧。',
    href: '#news',
    image: '/placeholder/hero-03.svg',
    icon: '/icons/card-03.svg',
    button: '詳しく見る',
  },
  {
    id: 'join',
    title: '会費・入会',
    copy: '同窓会を、いっしょに支える。',
    body: '入会方法・年会費([要確認])・住所変更のご案内。',
    href: '#join',
    image: '/placeholder/hero-04.svg',
    icon: '/icons/card-04.svg',
    button: '詳しく見る',
  },
  {
    id: 'gallery',
    title: '母校紹介',
    copy: '霞ヶ浦のほとりで、今日も。',
    body: '学校の今の姿を写真と動画でご紹介。',
    href: '#gallery',
    image: '/placeholder/hero-05.svg',
    icon: '/icons/card-05.svg',
    button: '詳しく見る',
  },
  {
    id: 'contact',
    title: 'お問い合わせ',
    copy: 'ご質問・ご相談はこちらへ。',
    body: '事務局の連絡先([要確認])。',
    href: '#contact',
    image: '/placeholder/hero-06.svg',
    icon: '/icons/card-06.svg',
    button: '詳しく見る',
  },
] as const
