import type { TextLink } from './site'

/** content_plan.footer.nav */
export const footerNav: readonly TextLink[] = [
  { label: 'トップページ', href: '#' },
  { label: '同窓会について', href: '#about' },
  { label: '沿革・歩み', href: '#history' },
  { label: '年間行事', href: '#events' },
  { label: '会報・お知らせ', href: '#news' },
  { label: 'ギャラリー', href: '#gallery' },
  { label: '卒業生紹介', href: '/stories' },
  { label: 'お問い合わせ', href: '#contact' },
] as const

export const footerLabels = {
  pageTop: 'PAGE TOP',
  pageTopA11y: 'ページの先頭へ戻る',
  copyrightPrefix: '©',
} as const
