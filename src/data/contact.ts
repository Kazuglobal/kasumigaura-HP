export type ContactRow = {
  readonly label: string
  readonly value: string
}

/** #contact card. Every real value is [要確認]; no form on this page. */
export const contactSection = {
  id: 'contact',
  en: 'Contact',
  jp: 'お問い合わせ',
  office: '霞ヶ浦高等学校同窓会 事務局',
  rows: [
    { label: '所在地', value: '[要確認 所在地]' },
    { label: 'TEL', value: '[要確認 電話番号]' },
    { label: 'Mail', value: '[要確認 メールアドレス]' },
  ] as readonly ContactRow[],
  button: 'メールでお問い合わせ',
  buttonHref: '#contact',
  buttonNote: 'メールアドレス確定後に mailto: リンクへ差し替えます([要確認])。',
  hours: '受付時間 [要確認]',
} as const
