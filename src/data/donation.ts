export type PurposeItem = {
  id: string
  title: string
  subtitle: string
  description: string
  icon: string
}

export type BankAccountInfo = {
  bankName: string
  branchName: string
  accountType: string
  accountNumber: string
  accountHolder: string
  note: string
}

export const donationData = {
  heading: {
    en: 'Donation & Support',
    jp: '寄付・協賛のお願い',
  },
  lead: [
    '母校・霞ヶ浦高等学校は、霞ヶ浦の雄大な自然とともに歩み、これまで多くの卒業生を社会へ送り出してまいりました。',
    '同窓会では、母校の教育環境のさらなる充実と、全国の舞台や日々の学業に励む後輩たちを支援するため、会員および有志の皆さまからの温かいご支援・ご協力を心よりお願い申し上げます。',
  ],
  purposes: [
    {
      id: 'sports-culture',
      title: '部活動・全国大会出場支援',
      subtitle: '夢に向かって挑戦する後輩たちの背中を押す',
      description:
        'レスリング部、野球部、ヨット部をはじめ、全国大会・関東大会等で活躍する運動部・文化部の遠征費、遠征用具・活動環境の整備を支援します。',
      icon: 'trophy',
    },
    {
      id: 'education-ict',
      title: '教育環境・施設ICT設備の充実',
      subtitle: '次代を担う生徒のための先進的な学びの場づくり',
      description:
        '生徒たちが日々学ぶ校舎施設、図書室、ICT学習機器、特別教室などの教育設備更新・整備のサポートに充当いたします。',
      icon: 'school',
    },
    {
      id: 'scholarship',
      title: '奨学・就学支援基金',
      subtitle: 'すべての生徒が安心して学業に専念できるように',
      description:
        '向学心に燃えながらも経済的困難を抱える生徒への就学支援や、学業・人物ともに優れた生徒への奨励サポートを行います。',
      icon: 'award',
    },
    {
      id: 'alumni-project',
      title: '同窓会・周年記念事業',
      subtitle: '世代を越えた絆と母校の歴史を未来へつなぐ',
      description:
        '同窓会員相互の交流・親睦行事、会報発行事業、母校の節目を祝う記念事業の推進に活用させていただきます。',
      icon: 'users',
    },
  ] as const satisfies readonly PurposeItem[],
  guidelines: {
    individual: {
      title: '個人寄付（卒業生・保護者・一般有志）',
      amountText: '一口 5,000円 / 10,000円 より（何口でも結構です）',
      note: '※少額からの温かいご志納も歓迎いたします。',
    },
    corporate: {
      title: '法人・企業協賛',
      amountText: '一口 30,000円 / 50,000円 より',
      note: '※同窓会会報やWebサイト（事業・店舗紹介等）への協賛社名掲載特典がございます。',
    },
  },
  bankAccount: {
    bankName: '[要確認 金融機関名（例: 常陽銀行）]',
    branchName: '[要確認 支店名（例: 阿見支店）]',
    accountType: '普通預金',
    accountNumber: '[要確認 口座番号]',
    accountHolder: '霞ヶ浦高等学校同窓会 会長 [要確認 会長名]',
    note: '※お振込みの際は、依頼人名欄に「卒業期（数字）＋お名前」をご入力いただけますと照合がスムーズになります。（例: 45 カスミガウラ タロウ）',
  } satisfies BankAccountInfo,
  benefits: [
    '同窓会報へのご芳名掲載（※ご希望者のみ・匿名可）',
    '同窓会公式Webサイト「寄付者ご芳名録」への掲載（※ご希望者のみ）',
    '高額寄付・法人協賛への感謝状・記念品の進呈',
  ],
} as const

export const DONATION_PRESETS = [
  { label: '5,000円', value: 5000 },
  { label: '10,000円', value: 10000 },
  { label: '30,000円', value: 30000 },
  { label: '50,000円', value: 50000 },
  { label: '100,000円', value: 100000 },
] as const
