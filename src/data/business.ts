/**
 * 卒業生事業・店舗紹介「この町で働く、あの人を訪ねて。」
 *
 * 掲載は1件1見開き。ここに並ぶ屋号・氏名・卒業期・写真はすべて PLACEHOLDER で、
 * 実在の卒業生の商いではない [要確認 取材・掲載許諾]。本人確認が済むまで、カードには
 * 必ず「掲載イメージ」の印（`business-card__badge`）を添える — 印のないカードは作らない。
 *
 * 掲載を1件足すときに揃えるもの:
 *  1. `businesses` に1件足す（`folio` は連番、`slug` は他と重複しない）
 *  2. その事業者の 業界 / 業種 / 地域 / 部活 / 期 が `businessFilters` の選択肢に
 *     **完全一致**で存在すること。絞り込みは文字列の完全一致なので、「飲食」と「飲食業」は
 *     別物として扱われ、片方だけだと一生ヒットしないカードができる
 *
 * 分母（全◯件）と丁付けは `businesses.length` から導いているので、手で直す箇所は無い。
 */

/** カードの1枚目。写真が無い掲載は、屋号を刷った扉（plate）で代える。 */
export type BusinessCover =
  | { readonly kind: 'photo'; readonly src: string; readonly alt: string }
  | { readonly kind: 'plate'; readonly note: string }

/** 本文の脇に並ぶ小さな写真。押すと1枚目が差し替わる。 */
export type BusinessShot = {
  readonly src: string
  readonly alt: string
}

export type Business = {
  readonly slug: string
  /** 丁付けの分子。`01` から連番。 */
  readonly folio: string
  readonly name: string
  readonly ownerName: string
  /** 代表者の肩書き行。（卒業年／期／学科）の体裁で揃える。 */
  readonly ownerDetails: string
  readonly industry: string
  readonly category: string
  readonly region: string
  readonly club: string
  /** 期。絞り込みの選択肢と同じ文字列にする。 */
  readonly gradYear: string
  readonly cover: BusinessCover
  readonly shots: readonly BusinessShot[]
  readonly quote: readonly string[]
  readonly summary: string
  /** 本文。紙の丈が決まっているので、ちょうど2段にする。 */
  readonly prose: readonly [string, string]
  /** 卒業生割引の中身。割引の印はどのカードにも出るので、必ず1行書く。 */
  readonly discount: string
  /** 「お店を訪ねる」を開いたときの一段。 */
  readonly detail: string
}

export const businessSection = {
  id: 'business',
  en: 'Alumni Business',
  jp: '卒業生事業・店舗紹介',
  lead: ['この町で働く、', 'あの人を訪ねて。'],
  intro: '卒業生が営む事業や店舗を紹介し、地域のつながりを次の機会へ広げます。',
  applyLabel: 'お店を掲載したい方へ',
  applyHref: '/#contact',
  filtersLabel: '条件を変える',
  resetLabel: '条件をすべて解除',
  emptyLabel: '条件に合うお店がありませんでした。条件を解除してもう一度お試しください。',
  prevLabel: '前のお店',
  nextLabel: '次のお店',
  detailLabel: 'お店を訪ねる',
  badge: '掲載イメージ',
  discountFlag: '卒業生割引あり',
  shotsLabel: 'お店の写真',
  hint: '左右の矢印キー、または紙を横になぞると次のお店に進みます。',
  button: '卒業生事業・店舗紹介を見る',
  buttonHref: '/business',
  backLabel: '卒業生事業・店舗紹介へ戻る',
} as const

/**
 * トップページの抜粋。全9件のうち、地域と業種が重ならない3件を出す。
 * ここを増やすとトップが事業紹介のページになってしまうので、3件のまま。
 */
export const businessHomeSlugs = ['cafe-amino', 'kasumi-motors', 'kasumi-design'] as const

export const businessHome = {
  id: 'business',
  en: 'Alumni Business',
  jp: '卒業生事業・店舗紹介',
  lead: ['この町で働く、', 'あの人を訪ねて。'],
  intro: '卒業生が営むお店や事業を、1件1見開きの記念誌として読めるページにまとめました。',
  pickLabel: '掲載の一部',
} as const

export const businessNote =
  '※ 掲載している屋号・氏名・卒業期・割引・写真はすべてダミーです [要確認 取材・掲載許諾]。'

/**
 * 絞り込みの選択肢。カード側の値と**完全一致**で突き合わせる。
 * `key` はそのまま `data-filter-key` になり、カードの `data-industry` などを指す。
 */
export const businessFilters = [
  {
    key: 'industry',
    label: '業界',
    options: ['飲食', '製造', '医療', '運輸', '不動産', 'IT', '農業', '小売'],
  },
  {
    key: 'category',
    label: '業種',
    options: ['カフェ', 'デザイン', '洋菓子', '印刷', '助産院', '書店', '整備', '仲介', '直売'],
  },
  { key: 'region', label: '地域', options: ['阿見', '土浦', 'つくば', '稲敷', '牛久'] },
  {
    key: 'club',
    label: '部活',
    options: [
      '生物部',
      '調理研究会',
      '吹奏楽部',
      'ヨット部',
      '写真部',
      '放送部',
      '硬式野球部',
      '陸上競技部',
    ],
  },
  {
    key: 'grad-year',
    label: '卒年',
    options: ['3期', '8期', '13期', '21期', '23期', '28期', '31期', '35期', '38期'],
  },
] as const satisfies readonly {
  readonly key: string
  readonly label: string
  readonly options: readonly string[]
}[]

export const businesses: readonly Business[] = [
  {
    slug: 'cafe-amino',
    folio: '01',
    name: '喫茶 あみ野',
    ownerName: '佐久間 優子',
    ownerDetails: '（2000年卒／23期／普通科）',
    industry: '飲食',
    category: 'カフェ',
    region: '阿見',
    club: '吹奏楽部',
    gradYear: '23期',
    cover: {
      kind: 'photo',
      src: '/images/business/shop-01.webp',
      alt: '喫茶あみ野でハンドドリップコーヒーを淹れる店主の掲載イメージ',
    },
    shots: [
      {
        src: '/images/business/shop-01.webp',
        alt: '喫茶あみ野でハンドドリップコーヒーを淹れる店主の掲載イメージ',
      },
      { src: '/images/business/scene-01.webp', alt: '喫茶あみ野の店内のようすの掲載イメージ' },
      { src: '/images/business/scene-02.webp', alt: '喫茶あみ野で出す焼き菓子の掲載イメージ' },
    ],
    quote: ['この町で、', 'また会える場所を。'],
    summary:
      '霞ヶ浦の湖畔にほど近い喫茶店。県産の豆と季節の焼き菓子、月に一度の同窓生の集まりが看板です。',
    prose: [
      '朝はゆっくり本を読む人、昼は打ち合わせの人、夕方は部活帰りの高校生。日によって顔ぶれの変わる店内で、豆はその日に出す分だけを毎朝挽いています。',
      '卒業してから、この町で誰かに会える場所が減った——そんな声をきっかけに始めた月一の集まりは、いまでは初対面の卒業生同士が名刺を交換する場になりました。',
    ],
    discount: '同窓会員証の提示でドリンク10%OFF',
    detail:
      '焙煎体験と同窓生交流会を軸に、地域の来訪者と卒業生が自然につながる場を続けています。在校生とのコラボ企画や、地元生産者との限定メニュー開発にも取り組んでいます。',
  },
  {
    slug: 'ami-print',
    folio: '02',
    name: '阿見印刷所',
    ownerName: '飯塚 義春',
    ownerDetails: '（1985年卒／8期／普通科）',
    industry: '製造',
    category: '印刷',
    region: '阿見',
    club: '硬式野球部',
    gradYear: '8期',
    cover: {
      kind: 'photo',
      src: '/images/business/scene-05.webp',
      alt: '阿見印刷所の作業場の掲載イメージ',
    },
    shots: [
      { src: '/images/business/scene-05.webp', alt: '阿見印刷所の作業場の掲載イメージ' },
      {
        src: '/images/business/scene-02.webp',
        alt: '阿見印刷所で刷り上がった印刷物の掲載イメージ',
      },
      { src: '/images/business/scene-01.webp', alt: '阿見印刷所に残る活版の道具の掲載イメージ' },
    ],
    quote: ['紙に残すことで、', 'つながりは続いていく。'],
    summary: '名刺・封筒から記念誌まで。少部数の同窓会印刷物を、版下から一貫して引き受けています。',
    prose: [
      '父の代から数えて六十年。活版の道具はいまも工場の隅に残してあり、記念の一枚だけを昔の機械で刷ることもあります。',
      '安く早くよりも、あとで見返せるものを。支部だよりの紙を一段厚くする、その一手間を惜しまないのが町の印刷屋の役目だと思っています。',
    ],
    discount: '名刺100枚を同窓生価格で',
    detail:
      '小ロットの同窓会印刷物を得意とし、支部だよりや記念誌の版下づくりから納品までを一貫して担当。紙見本の相談も店頭で受け付けています。',
  },
  {
    slug: 'kasumi-midwife',
    folio: '03',
    name: 'かすみ助産院',
    ownerName: '藤代 実咲',
    ownerDetails: '（1990年卒／13期／普通科）',
    industry: '医療',
    category: '助産院',
    region: '土浦',
    club: '写真部',
    gradYear: '13期',
    cover: { kind: 'plate', note: '写真は準備中です' },
    shots: [],
    quote: ['はじめの一日を、', 'この町で。'],
    summary: '出産と産後のケアを担う助産院。母乳外来と産後ケアの宿泊を、平日夜も受け付けています。',
    prose: [
      '開院して三十年、最初に取り上げた子が母親になり、その子を連れてくるようになりました。台帳の棚は、そのままこの町の家族の記録です。',
      '困ってから来る場所ではなく、困る前に寄れる場所に。母校の授業に呼ばれて在校生と顔を合わせるのも、母校とのつながりのひとつです。',
    ],
    discount: '産後ケアの初回相談無料',
    detail:
      '妊娠中から産後まで切れ目なく寄り添う体制を整えています。母校での出張授業の経験を活かし、在校生や保護者の相談にも対応。',
  },
  {
    slug: 'tsuchiura-bakery',
    folio: '04',
    name: '土浦ベーカリー',
    ownerName: '大和田 宏樹',
    ownerDetails: '（2008年卒／31期／普通科）',
    industry: '飲食',
    category: '洋菓子',
    region: '土浦',
    club: '調理研究会',
    gradYear: '31期',
    cover: { kind: 'plate', note: '写真は準備中です' },
    shots: [],
    quote: ['朝の一斤から、', '湖畔の一日を。'],
    summary: '湖岸通りの小さなパン屋。県産小麦の食パンと、朝だけ並ぶ塩バターパンが看板です。',
    prose: [
      '窯に火を入れるのは午前三時。焼き上がる頃には、朝靄の向こうから帆をたたんだ船が戻ってきます。夏は観光の方、冬は近所の常連さんに支えられています。',
      '修業先から戻ってきたのは、この景色の中でパンを焼きたかったからです。湖を見ながら食べてほしくて、店の前にベンチを二つ置いています。',
    ],
    discount: '食パン1斤サービス',
    detail:
      '県産小麦と自家製酵母のパンを毎朝焼き上げ。夏は湖畔を訪れる観光客、冬は地元の常連に支えられています。',
  },
  {
    slug: 'kasumi-motors',
    folio: '05',
    name: 'かすみ自動車工房',
    ownerName: '沼尻 正広',
    ownerDetails: '（1998年卒／21期／普通科）',
    industry: '運輸',
    category: '整備',
    region: '牛久',
    club: '陸上競技部',
    gradYear: '21期',
    cover: {
      kind: 'photo',
      src: '/images/business/scene-03.webp',
      alt: 'かすみ自動車工房の整備場の掲載イメージ',
    },
    shots: [
      { src: '/images/business/scene-03.webp', alt: 'かすみ自動車工房の整備場の掲載イメージ' },
      { src: '/images/business/scene-06.webp', alt: 'かすみ自動車工房の工具棚の掲載イメージ' },
      { src: '/images/business/scene-04.webp', alt: 'かすみ自動車工房の代車の掲載イメージ' },
    ],
    quote: ['冬の道にも、', '頼れる工房を。'],
    summary: '車検・板金から冬タイヤの預かりまで。代車を無料で用意しています。',
    prose: [
      '通学に自転車を使っていた頃、部活の遠征バスを見送りながら整備士になろうと決めました。いまはその遠征バスの点検も引き受けています。',
      '直して長く乗るほうが、結局は安くつく。新しい車をすすめる前に、いまの車をあと何年走らせられるかを一緒に数えるようにしています。',
    ],
    discount: '車検見積り無料',
    detail:
      '一般整備から板金塗装まで自社で対応。冬タイヤの預かりと、通学・通勤で使う車の急な不調にも当日枠を空けています。',
  },
  {
    slug: 'ibaraki-estate',
    folio: '06',
    name: 'いばらき住まいサポート',
    ownerName: '菊池 翔太',
    ownerDetails: '（2015年卒／38期／普通科）',
    industry: '不動産',
    category: '仲介',
    region: 'つくば',
    club: 'ヨット部',
    gradYear: '38期',
    cover: {
      kind: 'photo',
      src: '/images/business/scene-06.webp',
      alt: 'いばらき住まいサポートの相談窓口の掲載イメージ',
    },
    shots: [
      {
        src: '/images/business/scene-06.webp',
        alt: 'いばらき住まいサポートの相談窓口の掲載イメージ',
      },
      { src: '/images/business/scene-04.webp', alt: '内見に向かう道すじの掲載イメージ' },
      { src: '/images/business/scene-01.webp', alt: '相談に使う資料の掲載イメージ' },
    ],
    quote: ['帰ってくる人に、', '最初の居場所を。'],
    summary: '県外からのUターン相談が中心。住まい探しと就職先の情報をあわせて案内します。',
    prose: [
      '一度出た人が戻ってくるとき、いちばん困るのは家より先に「誰に訊けばいいか」でした。まずそこを引き受けようと、相談の窓口を広くとっています。',
      '内見のついでに、通学路だった道を一緒に走ることがあります。住むかどうかは、間取りより先に町の手ざわりで決まると思っています。',
    ],
    discount: '仲介手数料の相談可',
    detail:
      'Uターン・Iターンの住まい探しを中心に、賃貸・売買の両方を扱います。就職先や保育園の情報を、地元の実感つきで案内します。',
  },
  {
    slug: 'kasumi-design',
    folio: '07',
    name: '霞design室',
    ownerName: '久保田 爽頼',
    ownerDetails: '（2012年卒／35期／普通科）',
    industry: 'IT',
    category: 'デザイン',
    region: 'つくば',
    club: '放送部',
    gradYear: '35期',
    cover: {
      kind: 'photo',
      src: '/images/business/scene-04.webp',
      alt: '霞design室の仕事机の掲載イメージ',
    },
    shots: [
      { src: '/images/business/scene-04.webp', alt: '霞design室の仕事机の掲載イメージ' },
      { src: '/images/business/scene-02.webp', alt: '刷り上がったパッケージの掲載イメージ' },
      { src: '/images/business/scene-05.webp', alt: '打ち合わせのようすの掲載イメージ' },
    ],
    quote: ['小さな商いに、', '伝わる輪郭を。'],
    summary: '地元企業のロゴ・パッケージ・Webを一人で担当。小さな相談から引き受けます。',
    prose: [
      '放送部で原稿を削っていた頃から、伝わらないのは中身ではなく輪郭のせいだと思っています。デザインはその輪郭を引く仕事です。',
      '看板の一枚だけ、名刺の一箱だけ、という相談も断りません。町の商いは、その一枚から動き出すことが多いからです。',
    ],
    discount: '初回相談60分無料',
    detail:
      'ロゴ・パッケージ・Webサイトを一貫して制作。同窓会の会報や記念行事の印刷物の相談も受け付けています。',
  },
  {
    slug: 'inashiki-farm',
    folio: '08',
    name: '稲敷ファーム',
    ownerName: '国重 茂樹',
    ownerDetails: '（1980年卒／3期／普通科）',
    industry: '農業',
    category: '直売',
    region: '稲敷',
    club: '生物部',
    gradYear: '3期',
    cover: { kind: 'plate', note: '写真は準備中です' },
    shots: [],
    quote: ['土から始まる、', '次のつながりを。'],
    summary: 'れんこんとさつまいもの生産・直売。秋には収穫体験の受け入れも行っています。',
    prose: [
      '生物部で湖の水を測っていた三年間が、そのまま土の見方になりました。数字にして残しておくと、悪い年の理由が後から分かります。',
      '直売所には、卒業生が家族を連れて寄ってくれます。掘ったばかりの泥つきを渡すたび、この町の食卓とつながっている実感があります。',
    ],
    discount: '直売所で1割引',
    detail:
      'れんこん・さつまいもの生産から直売までを自社で担当。秋の収穫体験は在校生の校外学習も受け入れています。',
  },
  {
    slug: 'tsuchiura-books',
    folio: '09',
    name: '中央通りブックス',
    ownerName: '仲野 敏昭',
    ownerDetails: '（2005年卒／28期／普通科）',
    industry: '小売',
    category: '書店',
    region: '土浦',
    club: '生物部',
    gradYear: '28期',
    cover: { kind: 'plate', note: '写真は準備中です' },
    shots: [],
    quote: ['この町の記憶を、', '本棚に。'],
    summary: '郷土資料と写真集に強い街の書店。月末の読書会は同窓生の参加が多めです。',
    prose: [
      '売れ筋だけを並べれば棚は回ります。それでも郷土の棚を減らさないのは、ここで探さないと誰も探せなくなる本があるからです。',
      '月末の読書会は、卒業して二十年ぶりに顔を合わせる人が毎回います。本の話をしているうちに、部活の話に戻っていきます。',
    ],
    discount: '取り寄せ送料無料',
    detail:
      '郷土資料と写真集を厚めに揃え、取り寄せも当日受付。月末の読書会は同窓会員なら申し込み不要で参加できます。',
  },
]

/**
 * `businessHomeSlugs` の並び順で引く。存在しない slug は落とすのではなく気付けるよう、
 * ここで例外にする（トップから1件消えるより、ビルドで止まるほうがよい）。
 */
export const homeBusinesses: readonly Business[] = businessHomeSlugs.map((slug) => {
  const found = businesses.find((entry) => entry.slug === slug)
  if (!found) throw new Error(`businessHomeSlugs: unknown slug "${slug}"`)
  return found
})
