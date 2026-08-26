export type NewsCategory = '会報' | 'お知らせ' | '行事報告'

export type NewsItem = {
  readonly id: string
  readonly date: string
  readonly category: NewsCategory
  readonly title: string
  readonly image: string
  readonly href: string
}

const img = (n: number): string => `/placeholder/news-${String(n).padStart(2, '0')}.svg`

/** 10 cards for the News Swiper (D2). Dates and issue numbers are [要確認]. */
export const newsItems: readonly NewsItem[] = [
  { id: 'n01', date: '[要確認 日付]', category: '会報', title: '会報 第[要確認]号を発行しました', image: img(1), href: '#news' },
  { id: 'n02', date: '[要確認 日付]', category: 'お知らせ', title: '定期総会のご案内(開催日 [要確認])', image: img(2), href: '#events' },
  { id: 'n03', date: '[要確認 日付]', category: '行事報告', title: '懇親会・同期会を開催しました', image: img(3), href: '#events' },
  { id: 'n04', date: '[要確認 日付]', category: 'お知らせ', title: '住所変更・改姓のお届けについて', image: img(4), href: '#join' },
  { id: 'n05', date: '[要確認 日付]', category: '行事報告', title: '支部会([要確認 支部名])を開催しました', image: img(5), href: '#events' },
  { id: 'n06', date: '[要確認 日付]', category: '会報', title: '会報バックナンバーを公開しました', image: img(6), href: '#news' },
  { id: 'n07', date: '[要確認 日付]', category: 'お知らせ', title: '新入会員歓迎会のご案内(日程 [要確認])', image: img(7), href: '#events' },
  { id: 'n08', date: '[要確認 日付]', category: '行事報告', title: '部活動 OB・OG 会 活動報告', image: img(8), href: '#events' },
  { id: 'n09', date: '[要確認 日付]', category: 'お知らせ', title: '年会費([要確認])納入のお願い', image: img(9), href: '#join' },
  { id: 'n10', date: '[要確認 日付]', category: 'お知らせ', title: '事務局の開所日・連絡先について([要確認])', image: img(10), href: '#contact' },
] as const

export const newsSection = {
  id: 'news',
  en: 'News',
  jp: '会報・お知らせ',
  cardLink: '詳しく見る',
  button: 'お知らせ一覧',
  buttonHref: '#news',
  prevLabel: '前へ',
  nextLabel: '次へ',
  slideWidth: 320,
  spaceBetweenPc: 40,
  spaceBetweenSp: 20,
  dragSize: 16,
} as const
