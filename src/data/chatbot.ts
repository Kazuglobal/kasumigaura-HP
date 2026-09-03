export type ActionLink = {
  label: string
  href: string
  isExternal?: boolean
}

export type ChatOption = {
  id: string
  label: string
  query: string
}

export type BotResponse = {
  text: string
  options?: ChatOption[]
  actions?: ActionLink[]
}

export type ChatMessage = {
  id: string
  sender: 'bot' | 'user'
  text: string
  timestamp: string
  options?: ChatOption[]
  actions?: ActionLink[]
}

export const INITIAL_OPTIONS: ChatOption[] = [
  { id: 'opt-address', label: '📍 住所・連絡先の変更', query: '住所変更' },
  { id: 'opt-join', label: '💳 会費・入会について', query: '会費について' },
  { id: 'opt-events', label: '📅 年間行事・総会日程', query: '年間行事' },
  { id: 'opt-news', label: '📖 会報・最新ニュース', query: '会報について' },
  { id: 'opt-stories', label: '🎓 卒業生紹介 (Stories)', query: '卒業生紹介' },
  { id: 'opt-business', label: '🏢 事業・店舗紹介', query: '店舗・事業紹介' },
  { id: 'opt-gallery', label: '🏛️ 母校フォトギャラリー', query: 'ギャラリー' },
  { id: 'opt-contact', label: '✉️ 事務局へのお問い合わせ', query: '問い合わせ先' },
]

export const WELCOME_MESSAGE: BotResponse = {
  text: 'こんにちは！霞ヶ浦高等学校同窓会のWebコンシェルジュです。\n\n同窓会のお手続きや行事、母校の最新情報などを分かりやすくご案内いたします。\n気になる項目を選択するか、下の入力欄からお気軽にご質問ください。',
  options: INITIAL_OPTIONS,
}

type KnowledgeEntry = {
  id: string
  keywords: string[]
  response: (query: string) => BotResponse
}

const KNOWLEDGE_BASE: KnowledgeEntry[] = [
  {
    id: 'address',
    keywords: [
      '住所',
      '引越し',
      '引っ越し',
      '転居',
      '移転',
      '届出',
      '変更',
      '連絡先',
      '電話番号',
      'メールアドレス',
      '名前変更',
      '改姓',
    ],
    response: () => ({
      text: '【ご住所・ご連絡先の変更について】\n\nご転居や改姓、ご連絡先（電話番号・メールアドレス）の変更がございましたら、同窓会事務局までお知らせください。\n会報や重要なお知らせを確実にお届けできるよう、登録情報の更新を行わせていただきます。',
      actions: [
        { label: '住所変更フォームを開く', href: '/address' },
        { label: '事務局へ連絡（お問い合わせ）', href: '#contact' },
      ],
      options: [
        { id: 'opt-join-fee', label: '会費の納入方法について知りたい', query: '会費の納入方法' },
        { id: 'opt-contact-office', label: '事務局の受付時間・連絡先', query: '事務局の連絡先' },
      ],
    }),
  },
  {
    id: 'fee-and-join',
    keywords: ['会費', '年会費', '納入', '入会', '支払い', '振込', '口座', 'いくら', '金額', '終身会費'],
    response: () => ({
      text: '【入会・年会費のご案内】\n\n霞ヶ浦高等学校同窓会では、母校の教育環境支援や部活動支援、会員相互の親睦を深める各種行事の運営のため、皆さまからの温かいご協力を賜っております。\n\n年会費のお振込みや入会・再加入の詳細につきましては、事務局窓口にてご案内しております。',
      actions: [
        { label: '入会・会費のご案内へ', href: '#join' },
        { label: '事務局へ問い合わせる', href: '#contact' },
      ],
      options: [
        { id: 'opt-address-change', label: '住所変更の手続きをしたい', query: '住所変更' },
        { id: 'opt-events-info', label: '同窓会行事について知りたい', query: '年間行事' },
      ],
    }),
  },
  {
    id: 'events',
    keywords: [
      '行事',
      'イベント',
      '総会',
      '定期総会',
      '懇親会',
      '同期会',
      'クラス会',
      '同窓会',
      '支部',
      '支部会',
      'ob会',
      'og会',
      '部活動',
      '日程',
      'スケジュール',
      'いつ',
    ],
    response: () => ({
      text: '【年間行事・イベント情報】\n\n霞ヶ浦高等学校同窓会では、以下のような年間行事・交流の機会を設けております：\n\n・定期総会（年に一度の全体総会）\n・懇親会・同期会（世代を越えた旧交の場）\n・各地域支部会\n・部活動 OB・OG会\n・新入会員歓迎会\n\n本年度の開催日程および詳細は、決まり次第「年間行事」「お知らせ」にてご案内いたします。',
      actions: [
        { label: '年間行事一覧を見る', href: '#events' },
        { label: '最新お知らせ・会報を見る', href: '#news' },
      ],
      options: [
        { id: 'opt-news-check', label: '最新の会報・お知らせを確認', query: '会報について' },
        { id: 'opt-stories-check', label: '卒業生の活躍記事を見る', query: '卒業生紹介' },
      ],
    }),
  },
  {
    id: 'news',
    keywords: ['会報', 'ニュース', 'お知らせ', '活動報告', 'バックナンバー', '届かない', '発行', '最新'],
    response: () => ({
      text: '【会報・お知らせについて】\n\n同窓会員の皆さまへ向けて、母校の現況や同窓生の活躍、行事報告を掲載した「同窓会報」を定期発行しております。\n\nWebサイト上でも最新ニュースを随時更新しておりますので、ぜひご覧ください。会報が届かない場合は、ご登録住所の確認を承ります。',
      actions: [
        { label: '最新お知らせ一覧を見る', href: '#news' },
        { label: '会報未着のお問い合わせ', href: '#contact' },
      ],
      options: [
        { id: 'opt-addr-news', label: '住所が変わったので変更したい', query: '住所変更' },
        { id: 'opt-about-news', label: '同窓会の活動方針について', query: '同窓会について' },
      ],
    }),
  },
  {
    id: 'stories',
    keywords: ['卒業生', 'ob', 'og', 'ストーリー', 'インタビュー', '記事', '活躍', '先輩', '紹介', 'stories'],
    response: () => ({
      text: '【卒業生紹介（Stories）】\n\n社会の第一線や地域で情熱を持って挑戦し続ける、霞ヶ浦高等学校の卒業生（OB・OG）への特別インタビュー企画です。\n高校時代の思い出や現在の取り組み、母校や後輩へのメッセージをお届けしています。',
      actions: [
        { label: '卒業生紹介ページを見る', href: '/stories' },
        { label: '事業・店舗紹介ページを見る', href: '/business' },
      ],
      options: [
        { id: 'opt-business-go', label: '同窓生のお店・企業を見たい', query: '店舗・事業紹介' },
        { id: 'opt-gallery-go', label: '母校の写真を見たい', query: 'ギャラリー' },
      ],
    }),
  },
  {
    id: 'business',
    keywords: [
      'ビジネス',
      '企業',
      '店舗',
      'お店',
      'ショップ',
      '会社',
      '事業',
      '事業紹介',
      '掲載',
      '応援',
      '飲食',
      '病院',
      'クリニック',
      'business',
    ],
    response: () => ({
      text: '【事業・店舗紹介（Business Directory）】\n\n同窓生が経営または活躍されている企業・飲食店・ショップ・医療機関などの事業所をご紹介するディレクトリです。\n同窓生同士のつながりや地域活性化、相互のビジネス応援を支援しています。',
      actions: [
        { label: '事業・店舗紹介ページへ', href: '/business' },
        { label: '掲載について問い合わせる', href: '#contact' },
      ],
      options: [
        { id: 'opt-stories-go', label: '卒業生のインタビュー記事を見る', query: '卒業生紹介' },
        { id: 'opt-contact-go', label: '自社の掲載希望・お問い合わせ', query: '問い合わせ先' },
      ],
    }),
  },
  {
    id: 'gallery',
    keywords: ['写真', 'フォト', 'ギャラリー', '動画', '校舎', '部活', '体育祭', '文化祭', '風景', 'youtube', 'gallery'],
    response: () => ({
      text: '【母校紹介・フォトギャラリー】\n\n霞ヶ浦の雄大な自然に囲まれた母校キャンパス、体育祭・文化祭などの学校行事、全国レベルで活躍する部活動の熱気あふれる風景を写真でご紹介しています。',
      actions: [
        { label: 'フォトギャラリーを見る', href: '#gallery' },
      ],
      options: [
        { id: 'opt-history-go', label: '母校の沿革・歴史を知りたい', query: '学校の歴史' },
        { id: 'opt-events-go', label: '年間行事の日程を見る', query: '年間行事' },
      ],
    }),
  },
  {
    id: 'about-history',
    keywords: ['学校', '母校', '歴史', '沿革', '設立', '理念', '会長', '役員', '組織', '会則', '阿見町', '霞ヶ浦高校'],
    response: () => ({
      text: '【同窓会について・母校の歩み】\n\n霞ヶ浦高等学校は茨城県稲敷郡阿見町に位置し、霞ヶ浦の水辺とともに多くの優秀な卒業生を社会へと送り出してきました。\n\n同窓会は、卒業生相互の親睦と母校の持続的な発展に寄与することを目指して活動しています。会長挨拶や組織構成、これまでの歩みは下記よりご覧いただけます。',
      actions: [
        { label: '同窓会について', href: '#about' },
        { label: '沿革・母校の歩み', href: '#history' },
      ],
      options: [
        { id: 'opt-about-join', label: '入会や会費について知りたい', query: '会費について' },
        { id: 'opt-about-contact', label: '事務局へのお問い合わせ', query: '問い合わせ先' },
      ],
    }),
  },
  {
    id: 'contact',
    keywords: ['問い合わせ', '問合せ', '連絡', '連絡先', '電話', 'tel', 'メール', 'mail', '事務局', '場所', '所在地', '住所どこ', '受付'],
    response: () => ({
      text: '【同窓会事務局 お問い合わせ】\n\n霞ヶ浦高等学校同窓会 事務局\n・所在地：茨城県稲敷郡阿見町（霞ヶ浦高等学校内）\n・各種お問い合わせ（住所変更、会費、総会、掲載など）を承っております。\n\nご質問やご相談は、下記のお問い合わせセクションよりご連絡ください。',
      actions: [
        { label: 'お問い合わせセクションへ', href: '#contact' },
      ],
      options: [
        { id: 'opt-addr-from-cnt', label: '住所変更について確認する', query: '住所変更' },
        { id: 'opt-fee-from-cnt', label: '会費について確認する', query: '会費について' },
      ],
    }),
  },
  {
    id: 'greeting',
    keywords: ['こんにちは', 'こんばんは', 'おはよう', 'はじめまして', 'ハロー', 'hello'],
    response: () => ({
      text: 'こんにちは！霞ヶ浦高等学校同窓会Webコンシェルジュです。\n本日はいかがされましたか？どのようなことでもお気軽にお尋ねください。',
      options: INITIAL_OPTIONS.slice(0, 4),
    }),
  },
  {
    id: 'thanks',
    keywords: ['ありがとう', '助かりました', '感謝', 'サンキュー', 'thanks'],
    response: () => ({
      text: 'お役に立てて光栄です！\nその他にも何か気になることやご不明な点がございましたら、いつでもお声がけくださいね。母校のさらなる発展と同窓生の皆さまのご活躍を心よりお祈り申し上げます。',
      options: INITIAL_OPTIONS.slice(0, 4),
    }),
  },
]

export function searchChatbotKnowledge(userInput: string): BotResponse {
  const normalized = userInput.toLowerCase().trim()
  if (!normalized) {
    return WELCOME_MESSAGE
  }

  // 1. 直接的なキーワードマッチング
  for (const entry of KNOWLEDGE_BASE) {
    const isMatched = entry.keywords.some((kw) => normalized.includes(kw.toLowerCase()))
    if (isMatched) {
      return entry.response(userInput)
    }
  }

  // 2. マッチしなかった場合の親切なフォールバック
  return {
    text: `ご質問ありがとうございます。\n「${userInput}」についてのお問い合わせですね。\n\n現在ご質問の内容を直接特定できませんでしたが、同窓会事務局にて個別にご対応が可能です。\nまたは、以下のよくあるメニューから近い項目をお選びいただくか、事務局までお気軽にご連絡ください。`,
    actions: [
      { label: '事務局へのお問い合わせ', href: '#contact' },
    ],
    options: INITIAL_OPTIONS,
  }
}
