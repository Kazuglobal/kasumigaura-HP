export type SectionStub = {
  readonly id: string
  readonly en: string
  readonly jp: string
}

export type SectionCopy = {
  readonly id: string
  readonly en: string
  readonly jp: string
  /** Lines of the large catch copy (.copyTxt). */
  readonly copy: readonly string[]
  /** Body paragraphs. Real facts stay as [要確認]. */
  readonly body: readonly string[]
  readonly button: string
  readonly buttonHref: string
}

/** Kept for the header anchor list; the real sections live below. */
export const sectionStubs: readonly SectionStub[] = [
  { id: 'about', en: 'About', jp: '同窓会について' },
  { id: 'history', en: 'History', jp: '沿革・母校の歩み' },
  { id: 'events', en: 'Events', jp: '年間行事' },
  { id: 'news', en: 'News', jp: '会報・お知らせ' },
  { id: 'gallery', en: 'Gallery', jp: '母校紹介・フォトギャラリー' },
  { id: 'join', en: 'Join', jp: '入会・会費・住所変更のご案内' },
  { id: 'contact', en: 'Contact', jp: 'お問い合わせ' },
] as const

export const aboutSection = {
  id: 'about',
  en: 'About',
  jp: '同窓会について',
  copy: ['母校を想う心が、', '世代を越えてつながる。'],
  body: [
    '霞ヶ浦高等学校同窓会は、卒業生同士の親睦を深め、母校の発展を支えることを目的に活動しています。',
    '会長挨拶([要確認 会長名])、設立趣旨、組織のご紹介はこちらからご覧ください。',
  ],
  button: '同窓会について',
  buttonHref: '#about',
  image: '/placeholder/about.svg',
} as const satisfies SectionCopy & { image: string }

export const historySection = {
  id: 'history',
  en: 'History',
  jp: '沿革・母校の歩み',
  copy: ['霞ヶ浦の水辺から、', '未来へ続く歩み。'],
  body: [
    '創立 [要確認 年] の開校以来、母校は卒業生 [要確認 人数] を社会へ送り出してきました。',
    '同窓会は支部 [要確認 数] を拠点に、世代を越えた交流の場を守り続けています。',
  ],
  button: '沿革を見る',
  buttonHref: '#history',
  images: {
    img01: '/placeholder/history-01.svg',
    img02: '/placeholder/history-02.svg',
    img03: '/placeholder/history-03.svg',
    img04: '/placeholder/history-04.svg',
  },
  /** C2: GSAP scrub parallax y ranges (px). */
  parallax: {
    pc: { img01: [100, -200], img02: [50, -50], img03: [100, -100] },
    sp: { img04: [0, -50] },
  },
} as const

export const gallerySection = {
  id: 'gallery',
  en: 'Gallery',
  jp: '母校紹介・フォトギャラリー',
  body: [
    '霞ヶ浦のほとりに立つ校舎、体育祭や文化祭の一日、部活動の姿。',
    '母校の「いま」を写真と動画でお届けします(動画は [要確認 動画ID])。',
  ],
  circleLabelPhotos: 'VIEW PHOTOS',
  circleLabelMovie: 'PLAY MOVIE',
  modalTitle: 'フォトギャラリー',
  closeLabel: '閉じる',
  photos: [
    { id: 'photo-01', src: '/placeholder/photo-01.svg', caption: '校舎 [要確認 写真]' },
    { id: 'photo-02', src: '/placeholder/photo-02.svg', caption: '体育祭 [要確認 写真]' },
    { id: 'photo-03', src: '/placeholder/photo-03.svg', caption: '文化祭 [要確認 写真]' },
    { id: 'photo-04', src: '/placeholder/photo-04.svg', caption: '部活動 [要確認 写真]' },
    { id: 'photo-05', src: '/placeholder/photo-05.svg', caption: '卒業式 [要確認 写真]' },
    { id: 'photo-06', src: '/placeholder/photo-06.svg', caption: '同窓会総会 [要確認 写真]' },
  ],
  background: '/placeholder/gallery.svg',
  button: 'ギャラリーへ',
  buttonHref: '#gallery',
} as const
