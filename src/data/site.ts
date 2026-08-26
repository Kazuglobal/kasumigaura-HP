export type SnsLink = {
  readonly label: string
  readonly href: string
  readonly icon: string
}

export type TextLink = {
  readonly label: string
  readonly href: string
  readonly note?: string
}

export const site = {
  name: '霞ヶ浦高等学校同窓会',
  nameEn: 'KASUMIGAURA ALUMNI',
  nameEnLong: 'KASUMIGAURA ALUMNI ASSOCIATION',
  school: '霞ヶ浦高等学校(茨城県阿見町)',
  schoolAddressNote: '[要確認 住所]',
  description: '霞ヶ浦高等学校同窓会 公式サイト',
  sns: [] as readonly SnsLink[],
  officialSiteLink: {
    label: '霞ヶ浦高等学校 公式サイト',
    href: '#',
    note: '[要確認 URL]',
  } satisfies TextLink,
  breakpointSp: 767,
  /** YouTube video ID for the gallery button; null = photo grid modal. [要確認 動画ID] */
  youtubeId: null as string | null,
} as const
