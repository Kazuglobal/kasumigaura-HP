import { megaMenu } from './nav'

export type EventItem = {
  readonly id: string
  readonly label: string
  readonly date: string
  readonly note: string
}

const notes: readonly string[] = [
  '会員の皆さまが一堂に会する年に一度の総会です。',
  '同期・学年を越えて旧交を温める懇親の場です。',
  '各地の支部が主催する地域ごとの集まりです。',
  '部活動ごとの OB・OG が集う交流会です。',
  '会員の皆さまへ会報をお届けします。',
  '卒業を迎えた新入会員をお迎えします。',
]

/** #events list under History (headStyle02). Dates are [要確認]. */
export const events: readonly EventItem[] = megaMenu.map((item, index) => ({
  id: `event-${index + 1}`,
  label: item.label,
  date: '日程 [要確認]',
  note: notes[index] ?? '',
}))

export const eventsSection = {
  id: 'events',
  title: '年間行事',
  lead: '一年を通して、再会の場をご用意しています。各行事の日程は決まり次第お知らせします。',
} as const
