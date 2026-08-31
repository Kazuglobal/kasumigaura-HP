export type MegaItem = {
  readonly label: string
  readonly href: string
  readonly icon: string
}

export type NavItem = {
  readonly label: string
  readonly href: string
  readonly mega?: readonly MegaItem[]
}

export const megaMenu: readonly MegaItem[] = [
  { label: '定期総会', href: '#events', icon: '/icons/mega-01.svg' },
  { label: '懇親会・同期会', href: '#events', icon: '/icons/mega-02.svg' },
  { label: '支部会', href: '#events', icon: '/icons/mega-03.svg' },
  { label: '部活動 OB・OG 会', href: '#events', icon: '/icons/mega-04.svg' },
  { label: '会報発行', href: '#news', icon: '/icons/mega-05.svg' },
  { label: '新入会員歓迎会', href: '#events', icon: '/icons/mega-06.svg' },
] as const

export const megaMenuNote = '日程は [要確認]'

export const navPc: readonly NavItem[] = [
  { label: '同窓会について', href: '#about' },
  { label: '沿革・歩み', href: '#history' },
  { label: '年間行事', href: '#events', mega: megaMenu },
  { label: '会報・お知らせ', href: '#news' },
  { label: 'ギャラリー', href: '#gallery' },
  { label: '卒業生紹介', href: '/stories' },
] as const

export const navLabels = {
  openMenu: 'メニューを開く',
  closeMenu: 'メニューを閉じる',
  toTop: 'トップページ',
} as const

/**
 * The nav is written against the one-page home, so its `#` targets only exist there. On a sub page
 * (卒業生紹介 etc.) the same item has to point back at the home section instead of doing nothing.
 */
export const anchorHref = (href: string, isHome: boolean): string => {
  if (isHome || !href.startsWith('#')) return href
  return href === '#' ? '/' : `/${href}`
}
