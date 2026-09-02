/**
 * 卒業生紹介「つながるストーリー」 — one alumnus = one book.
 *
 * Every person here is a PLACEHOLDER. Names, years and episodes are invented so the layout, the
 * jacket art and the shelf can be built and reviewed; nothing on this page is a fact about a real
 * graduate of 霞ヶ浦高等学校. Replace each record (and its portrait) once the interview and the
 * publication consent are in hand — see `placeholderNote`.
 */

/** Where the portrait sits on the jacket. Normalised 0..1 against the cover canvas. */
export type CoverPhoto =
  | {
      readonly shape: 'rect'
      readonly x: number
      readonly y: number
      readonly w: number
      readonly h: number
      /** Vertical anchor when cropping the portrait (0 = top). Faces sit high, so keep it low. */
      readonly fit: number
      /** Edge the photo bleeds off, if any. A shadow is drawn along the opposite edge. */
      readonly bleed?: 'top' | 'bottom' | 'right'
    }
  | {
      readonly shape: 'circle'
      readonly cx: number
      readonly cy: number
      readonly r: number
      readonly fit: number
    }

export type CoverLayout = {
  readonly photo: CoverPhoto
  /** Band the type is printed in. The scrim is measured against the artwork underneath it. */
  readonly band: { readonly from: 'top' | 'bottom'; readonly size: number }
  readonly align: 'left' | 'center'
  /** The six covers are split between the two faces so they do not read as one series. */
  readonly face: 'mincho' | 'gothic'
  readonly nameSize: number
  readonly roleSize: number
}

export type Story = {
  readonly slug: string
  readonly name: string
  readonly kana: string
  /** 卒業期. Placeholder until the alumni register is checked. */
  readonly term: string
  readonly role: string
  readonly field: string
  /** The club the jacket art was drawn from. */
  readonly club: string
  readonly quote: string
  readonly body: readonly string[]
  readonly cover: string
  readonly photo: string
  readonly layout: CoverLayout
}

export const storiesSection = {
  id: 'stories',
  en: 'Stories',
  jp: '卒業生紹介',
  copy: ['一人ひとりの歩みが、', '母校の物語になる。'],
  lead: [
    '霞ヶ浦高等学校を巣立った先輩たちのその後を、一人一冊の本に見立てて並べました。',
    '気になる背表紙を選ぶと、その人のページが開きます。',
  ],
  shelfHint: '左右の矢印キーで本を選び、Enter で開きます。',
  shelfHintTouch: '気になる本をタップすると、その人のページが開きます。',
  listLabel: '卒業生一覧',
  button: '卒業生紹介を見る',
  buttonHref: '/stories',
  backLabel: '卒業生紹介へ戻る',
} as const

export const placeholderNote =
  '※ 掲載している氏名・卒業期・経歴・写真はすべてダミーです [要確認 取材・掲載許諾]。'

export const stories: readonly Story[] = [
  {
    slug: 'mimura-shiori',
    name: '三村 詩織',
    kana: 'Mimura Shiori',
    term: '第[要確認]期',
    role: '湖沼研究者',
    field: '研究・環境',
    club: '生物部',
    quote: '採った水を、濁ったままにしない。それだけを続けています。',
    body: [
      '生物部の朝練は、部室ではなく湖の岸辺から始まりました。採水びんを二本さげて自転車を漕ぎ、水温と透明度を書き取る。三年間で三百回を超えたノートは、いまも研究室の引き出しに入っています。',
      '大学では陸水学を専攻し、現在は霞ヶ浦をふくむ湖沼の水質モニタリングに携わっています。「高校生のノートと同じ項目を、いまも測っています」。',
      '在校生へ。「観測は地味です。でも、続いた記録だけが後から意味を持ちます」。',
    ],
    cover: '/images/story-cover-01.webp',
    photo: '/images/story-photo-01.webp',
    layout: {
      photo: { shape: 'rect', x: 0, y: 0, w: 1, h: 0.55, fit: 0.24, bleed: 'top' },
      band: { from: 'bottom', size: 0.3 },
      align: 'center',
      face: 'mincho',
      nameSize: 0.094,
      roleSize: 0.04,
    },
  },
  {
    slug: 'owada-ryo',
    name: '大和田 遼',
    kana: 'Owada Ryo',
    term: '第[要確認]期',
    role: '洋菓子店 店主',
    field: '飲食・製菓',
    club: '調理研究会',
    quote: '文化祭のシュークリームが、いまの店の原型です。',
    body: [
      '調理研究会の文化祭で焼いたシュークリームは、二日で四百個が売れました。売り切れたあとの空の天板を見て、店をやろうと決めたそうです。',
      '卒業後は都内の洋菓子店で十年修業し、阿見町に戻って自分の店を開きました。朝三時に窯へ火を入れ、地元の卵と牛乳だけで組み立てる焼き菓子が看板です。',
      '「同窓会の総会でお出ししている焼き菓子は、実は毎年うちで焼いています」。',
    ],
    cover: '/images/story-cover-02.webp',
    photo: '/images/story-photo-02.webp',
    layout: {
      photo: { shape: 'rect', x: 0, y: 0.42, w: 1, h: 0.58, fit: 0.22, bleed: 'bottom' },
      band: { from: 'top', size: 0.34 },
      align: 'left',
      face: 'gothic',
      nameSize: 0.088,
      roleSize: 0.038,
    },
  },
  {
    slug: 'niibori-kanae',
    name: '新堀 かなえ',
    kana: 'Niibori Kanae',
    term: '第[要確認]期',
    role: '高等学校教諭（母校勤務）',
    field: '教育',
    club: '吹奏楽部',
    quote: '同じ音楽室に、今度は教える側で立っています。',
    body: [
      '吹奏楽部でクラリネットを担当し、三年生の夏に県大会へ進みました。「本番より、朝の音楽室で誰よりも早く音を出した時間を覚えています」。',
      '教員採用試験を経て、六年目に母校へ赴任。いまは国語科を担当しながら吹奏楽部の顧問を務めています。譜面台の高さを合わせる手つきは、生徒だった頃と変わらないそうです。',
      '「卒業生が学校に戻ってくる道があることを、在校生に見せたかった」。',
    ],
    cover: '/images/story-cover-03.webp',
    photo: '/images/story-photo-03.webp',
    layout: {
      photo: { shape: 'rect', x: 0.4, y: 0, w: 0.6, h: 1, fit: 0.2, bleed: 'right' },
      band: { from: 'bottom', size: 0.26 },
      align: 'left',
      face: 'gothic',
      nameSize: 0.082,
      roleSize: 0.036,
    },
  },
  {
    slug: 'ishioka-yasuhiro',
    name: '石岡 泰弘',
    kana: 'Ishioka Yasuhiro',
    term: '第[要確認]期',
    role: '帆布職人・造船所勤務',
    field: 'ものづくり',
    club: 'ヨット部',
    quote: '帆は縫い目で決まる。風はごまかせません。',
    body: [
      'ヨット部で三年間、霞ヶ浦の風を読み続けました。破れた帆を自分で縫い直したのが、いまの仕事の入口だったといいます。',
      '造船所で船体を学びながら帆布の縫製を覚え、いまは競技用の帆を一枚ずつ仕立てています。手が覚えた縫い目の幅は、三十年経っても狂わないそうです。',
      '「湖で覚えたことは、道具が変わっても効きます」。',
    ],
    cover: '/images/story-cover-04.webp',
    photo: '/images/story-photo-04.webp',
    layout: {
      photo: { shape: 'rect', x: 0.14, y: 0.18, w: 0.72, h: 0.56, fit: 0.26 },
      band: { from: 'bottom', size: 0.24 },
      align: 'center',
      face: 'mincho',
      nameSize: 0.1,
      roleSize: 0.042,
    },
  },
  {
    slug: 'fujinuma-misaki',
    name: '藤沼 実咲',
    kana: 'Fujinuma Misaki',
    term: '第[要確認]期',
    role: '助産師',
    field: '医療・福祉',
    club: '写真部',
    quote: '夜明けの色を覚えたのは、写真部の暗室でした。',
    body: [
      '写真部で蓮田の夜明けを撮り続け、卒業アルバムの表紙にその一枚が使われました。「暗室で像が浮かぶまで待つ時間が好きでした」。',
      '看護大学を経て助産師になり、いまは夜勤の多い産科病棟に勤めています。明け方の窓の色を見るたび、高校の蓮田を思い出すそうです。',
      '「待つ仕事だという点で、暗室と産科はよく似ています」。',
    ],
    cover: '/images/story-cover-05.webp',
    photo: '/images/story-photo-05.webp',
    layout: {
      photo: { shape: 'circle', cx: 0.5, cy: 0.36, r: 0.3, fit: 0.24 },
      band: { from: 'bottom', size: 0.32 },
      align: 'center',
      face: 'gothic',
      nameSize: 0.09,
      roleSize: 0.038,
    },
  },
  {
    slug: 'kubota-kei',
    name: '久保田 慧',
    kana: 'Kubota Kei',
    term: '第[要確認]期',
    role: 'ゲームサウンドデザイナー',
    field: '音・映像',
    club: '放送部',
    quote: '校内放送のチャイムを勝手に作り直したのが、最初でした。',
    body: [
      '放送部で昼の校内放送を担当し、機材室にこもって効果音を作っていました。文化祭の映像に付けた足音は、砂利をトレーに敷いて自分で録ったものです。',
      '専門学校を経てゲーム会社へ。いまは足音や環境音を組み立てる仕事をしています。「音は画面に映らないぶん、外すとすぐ気づかれます」。',
      '「機材は高校の放送室のほうが古かったけれど、やっていることは同じです」。',
    ],
    cover: '/images/story-cover-06.webp',
    photo: '/images/story-photo-06.webp',
    layout: {
      photo: { shape: 'rect', x: 0.3, y: 0.1, w: 0.7, h: 0.68, fit: 0.2, bleed: 'right' },
      band: { from: 'bottom', size: 0.26 },
      align: 'left',
      face: 'mincho',
      nameSize: 0.086,
      roleSize: 0.036,
    },
  },
]

export const storyBySlug = (slug: string): Story | undefined =>
  stories.find((story) => story.slug === slug)

/** 1-based display number, printed on the jacket and on the spine. */
export const storyNumber = (story: Story): string =>
  String(stories.indexOf(story) + 1).padStart(2, '0')
