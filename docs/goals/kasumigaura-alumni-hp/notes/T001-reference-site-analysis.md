# T001: 参照サイト(pasconet 超熟)構造・デザイン・アニメーション解析

Task: `T001`
Kind: `scout`
Status: `current`

## Summary

参照 https://www.pasconet.co.jp/choujuku/ は **Pasco(敷島製パン)の食パンブランド「超熟」ブランドサイト**であり、塾 LP ではない(goal.md / state.yaml の初期前提「超塾」「コース・料金・入塾の流れ」は誤読 → PM が訂正済み)。技術は **Swiper + 自社 UMD バンドル azlib(anime.js 内包・IntersectionObserver ベースの FlowVox)+ GSAP 3.12.2 ScrollTrigger(パララックス 1 箇所のみ)**。ローディングオーバーレイは存在せず、`#wrapper` の opacity 0→1(500ms linear)のみ。デザイントークンはネイビー #005099 / ベージュ #F5F3EC / 白、本文 Yu Gothic 15px・英字ラベル Montserrat 600(Google Fonts)、コンテナ 1000〜1200px、ブレークポイント 767px。全 10 ブロック、アニメーション 17 種を列挙し、同窓会サイトへの再マッピングと Next.js 構成案を付記する。

## Details

### 0. 前提の訂正(Judge 要注意)

- パス `choujuku` = **超熟(食パン)**。ナビは「超熟のこだわり / 超熟のヒストリー / 商品ラインアップ / レシピ / CMギャラリー」。
- 固有名詞残存チェック用語は「パスコ / Pasco / 超熟 / choujuku / 敷島」とすべき。
- 分析ソース: `choujuku.html` (48.9KB), `import.min.css` (50.0KB), `home.min.css` (19.7KB), `content.js` (799行), `azlib_light.bundle.js` (86KB minified)。画像・フォントは未取得。PM 補足 `notes/T001-browser-observations.md` と矛盾なし。

### 1. ページ構成(DOM 順)

`body.is-skip.is-popup.home > #wrapper > #siteHeader + #container > #main + #popupContents + .bnrArea + #siteFooter`

| # | 要素 | 見出し | 役割 / 内容 | CTA |
|---|---|---|---|---|
| 1 | `header#siteHeader`(fixed, z100) | – | 左上 `#siteLogo`(白タブ 140×120、`.is-mini` で 90px)。`#gNavWrapper`(高さ 110px、上→下 rgba(47,33,11,.3)→0 のグラデ、`.is-mini` でベージュ背景+黒文字)。`nav#gNav` 5 項目、3 項目目 `.js-gNavAcc` にメガドロップダウン `.sub`(900px 白・角丸 20px・ネイビー枠、fixed top 90px、商品 6 件サムネ 120px)。右に `ul.snsList` 5 件 + Pasco ロゴ。SP: `#gNavOpener`(56px ネイビー角ハンバーガー 3 本線) | ナビ 5 + サブ 7 |
| 2 | `#mainVisualWrapper > #mainVisual > .mvSlider#js-mvSlider` | 画像キャッチ「余計なものは入れない。」(SVG) | 高さ = `window.innerHeight`(JS 設定、max 825px)、背景 #F5F3EC。`figure.item.sliderIntro`(常時表示: `.mainCopy` 幅 31.25%, top 31.5%, left 11.7%)+ 商品別 `figure.item` 6 枚(絶対配置で重なり、`.outline` = 白 80% 角丸 40px カード min-width 410px、`h2.title` 2.4rem、`p.copy` 3rem、本文 1.4rem、`.btnStyle01`、SP 用 `.closeBtn`)。`#mainVisual::before` に波形 SVG(padding-top 39%、translateY 88%)で下端を白に切替 | 商品 6 |
| 3 | `.lineupList.swiper#js-lineupList`(MV 下端に absolute) | – | 白カード 6 枚(`width: calc(16.6% - 8px)`, max 175px, 角丸 20px, 画像 120px + 名称 1.4rem bold ネイビー、右上に 10px 丸マーク)。PC は hover で MV 切替、SP は Swiper 横スクロール + prev/next | 商品 6 |
| 4 | `#content > .bnrList > .bnrSlider.swiper#js-bnrList` | – | バナー 6 種 ×2 = 12 スライド(650px 幅、角丸 15px)。centered ループ自動再生。背景ベージュ、下 padding 120px | 外部 6 |
| 5 | `section.conceptSection.flowVox` | `Concept` / 超熟のこだわり | 背景ベージュ → `::after` 波形 SVG(padding-top 32%)。`.conceptVox` 大型角丸写真の上に `.txt`(左 90px、幅 45%、垂直中央、`p.copyTxt` 3rem ネイビー + 本文 + ボタン) | 1 |
| 6 | `section.detailsSection`(内部 `.detailsVox.flowVox`) | `History` / 超熟のヒストリー | 右 510px カラムにテキスト、左に食パン形マスク(`mask: img_mask_in.svg`)画像 3 枚 `.img01`(552px) `.img02`(128px, top -200px) `.img03`(252px, bottom -235px, right -170px)を absolute 配置し **GSAP scrub パララックス**。SP は `.img04` 1 枚のみ | 1 |
| 7 | `section.recipeSection.flowVox` | `Recipe` / レシピ | ベージュ帯(`::before` 波 16.4%、`::after` 波 7.8%)。Swiper 10 カード(320px、白・角丸 20px、画像 78% 比率、`h3.recipeTtl` 1.8rem、「レシピを見る」右下)+ 丸ボタン prev/next(54px ネイビー)+ カスタム scrollbar(410px、レール #E2D7BF、ドラッグはパン形 SVG 16px) | 11 |
| 8 | `section.gallerySection.flowVox` | `CM Gallery` / CMギャラリー | 全幅写真背景 `.galleryVox` に右寄せ `.txt`(75%)。`.btnStyle02` 円形 152px 白枠「PLAY MOVIE」→ YouTube ポップアップ(`#popupContents`、`data-movie` ID を iframe に展開) | 2 |
| 9 | `.bnrArea > .flowVox` | – | 横長角丸 20px バナー 1000px(Supporters Club、右下矢印)。SP のみ `.sub.swiper#js-footerBnr`(1.5 枚見せ) | 1 (+3) |
| 10 | `footer#siteFooter` | – | ベージュ。`.pageTopVox`(90×90 パン形 SVG ボタン、top -30px right 30px)、ロゴ 125px + SNS、`nav#fNav` 横並び 1.3rem、`#copyright` 1rem gray、Pasco ロゴ | 6 |

PC 全高 5,552px / SP 4,608px(PM 観察メモと一致)。

### 2. デザイントークン

**配色**

| 役割 | 値 | 用途 |
|---|---|---|
| Primary | `#005099` | 見出し・ボタン・ナビ hover・カード枠・丸マーク(48 箇所) |
| Background 2 | `#F5F3EC` | ヒーロー / バナー帯 / レシピ帯 / フッター / ミニヘッダー |
| Base | `#FFF` / `#000` | カード・本文 |
| Primary light | `#6696C2` / `#4C84B8` / `#B2CAE0` | サブナビ active・SP closeBtn |
| Accent (rare) | `#E2D7BF`(scrollbar レール)、`#E4050B`(必須表示)、`#016BB5`、`gray`(©) |
| Overlay | `rgba(255,255,255,.8)` MV カード・ナビ背景、`rgba(47,33,11,.3)` ヘッダーグラデ |

**タイポグラフィ**
- `html{font-size:62.5%}` → 1rem = 10px。`body` 1.5rem / weight 500 / `letter-spacing:.05em` / `line-height:2` / `font-feature-settings:"palt"` / `min-width:1200px`(SP で解除)。
- 本文: `"Yu Gothic","游ゴシック",YuGothic,"游ゴシック体","ヒラギノ角ゴ Pro W3","メイリオ",sans-serif`(システムフォント、@font-face なし)。
- 英字: `@import` Google Fonts **Montserrat 600**(`.enTitle`, `.pageTopVox`, `.btnStyle02`)。
- 見出し: `.headStyle01` 2.4rem bold `letter-spacing:.2em` 中央(SP 2rem)。`.enTitle` 1.5rem Montserrat、下に 116px の飾り SVG(白版あり)。`.copyTxt` 3rem bold ls .1em lh 1.6(SP 2.4rem)。`.headStyle02` 1.8rem 左パン形アイコン。`.headStyle03` 2.4rem + 番号丸。
- 部品: ナビ 1.5rem bold(SP 1.8rem)、ボタン 1.7rem bold、カード名 1.4rem、レシピ 1.8rem、フッターナビ 1.3rem、© 1rem。

**レイアウト**
- コンテナ: 1000px(フッター・bnrArea)、1100px(MV outline / lineupList)、1040px(recipe)、1200px(details)、820px(aboutVox)。
- ブレークポイント: **767px 以下 = SP**(`util.spBreakPoint=767`、JS `isRespMode`)。補助 `min-width:960px`、`max-width:350px`。`@media(any-hover:hover)` で hover 効果を限定。SP では大半の `transition:none`。
- 余白: セクション間 `margin-bottom` を vw 指定(concept 20vw / details 31.25vw / recipe 14vw、SP 30〜36vw)。ヘッダー分 `#wrapper{padding-top:120px}`(SP 85px、home は 0)。
- 角丸: 10 / 15 / 20 / 40px、pill `10em`、楕円 `440px/150px`(カード hover の膨らみ)。
- 装飾技法: 波形区切りは **SVG 背景の疑似要素**(bg01〜04.svg、padding-top % で高さ確保)。食パン形は **CSS `mask`**(img_mask_in.svg)と背景 SVG(bread_bg_b/w.svg)。グラデはヘッダーのみ。clip-path / mix-blend / カスタムカーソル / marquee は不使用。

### 3. 使用ライブラリ

| ライブラリ | 用途 |
|---|---|
| Swiper(bundle、ローカル) | bnrList / recipeSlider / SP lineupList / SP footerBnr |
| azlib_light.bundle.js(自社 UMD) | 内包: **anime.js**(既定 easing easeOutElastic)、`Utilities`(spBreakPoint, scrTop, sScroll)、`FlowVox`(IntersectionObserver 表示アニメ)、`SimpleAccordion`、`PopupAdjust`、`ReplaceImageSP`、`LazyLoadBg`、`FadeSlider`/`SimpleSlider`(未使用) |
| GSAP 3.12.2 + ScrollTrigger(cdnjs, defer) | detailsSection 画像パララックスのみ |
| Google Fonts | Montserrat 600 |
| Lenis / SplitText / Locomotive | **不使用**(grep 0 件) |

### 4. アニメーション仕様一覧

**A. 読み込み・イントロ**

| # | トリガー | 対象 | 動き | duration / ease | 実装 |
|---|---|---|---|---|---|
| A1 | DOMContentLoaded 後 `HomeJS.runIntro` | `#wrapper`(CSS 初期 `opacity:0`) | `visibility:visible` + opacity 0→1 | 500ms linear | anime.js |
| A2 | (非 home ページ) `ContentJS.runIntro` | `#loading` → `#wrapper` | `#loading` opacity 1→0(既定 1000ms easeOutElastic、完了で display none)、`#wrapper` opacity→1 delay 400ms / 250ms linear、完了で `body.is-finishedIntro` | – | anime.js。**home は `body.is-skip` で早期 return、`#loading` 要素も HTML に無い** → ローディングオーバーレイは実質なし |
| A3 | 初期表示 | `.item.sliderIntro` | `.outline/.img` は `opacity:1; transform:none` 固定(アニメなし)。キャッチは SVG 画像で静止 | – | CSS |

**B. ヒーロー(MV 切替)**

| # | トリガー | 対象 | 動き | duration / ease |
|---|---|---|---|---|
| B1 | PC: `.lineupList .item` mouseenter / SP: click | `.mvSlider .item[i]` に `.is-active`(他は `.is-hide` → transitionend で除去) | `.img`: opacity 0→1, translateY(10px)→0 / `.outline`: opacity 0→1, translateY(5px)→0(SP は translateX(5px)) | `.img` `transition:all .5s`、`.outline` `opacity .5s, transform .5s`(ease 既定) |
| B2 | `#js-mvSlider` / `#js-lineupList` 外への mouseover | active スライド | `.is-hide` 付与で逆再生(z-index 52 で下層へ) | 0.5s |
| B3 | hover / `.is-active` | `.lineupList .item>a` | 文字色→白、`.cInner` translateY(-10px)、`.cInner::before`(ネイビー楕円 440×150)が translate(-50%,100%)→(-50%,50%) & opacity 0→1、右上 `::before` 丸が scale 0→1 & opacity、`::after` 枠丸 top 15→5px | transform .3s / opacity .3s / 丸 scale .6s, opacity .4s |
| B4 | SP のみ | `#js-lineupList` Swiper | `slidesPerView:'auto', spaceBetween:10, loop:true, navigation(.btnPrev/.btnNext)`(autoplay なし) | Swiper 既定 300ms |

**C. スクロール連動**

| # | トリガー | 対象 | 動き | 値 |
|---|---|---|---|---|
| C1 | IntersectionObserver(`rootMargin: 0 0 -{innerHeight×per}px`、per = 横長 0.3 / 縦長 0.2、threshold 0) | `.flowVox`(conceptSection / detailsVox / recipeSection / gallerySection / bnrArea 内 = 5 箇所)。子要素が 2 つ以上なら **children を個別に stagger** | 初期: translateY(60px) opacity 0(mode 既定 up。data-flow で down/left/right/zoom/away 可、本ページは既定のみ)。交差で translateY→0、opacity [0,1]、`is-beganFlowAnime`→`is-finishedFlowAnime` | duration **600ms**、stagger **300ms**、easing `cubicBezier(0.33,1,0.68,1)`(= easeOutCubic)、isRepeat false(1 回のみ) |
| C2 | GSAP ScrollTrigger `scrub:true`, `start:'top bottom'`, `end:'bottom top'`, `toggleActions:'play none none reverse'` | `.detailsSection .img`(img01/02/03 それぞれ trigger 自身) | `gsap.fromTo(y)`: PC img01 100→-200、img02 50→-50、img03 100→-100 / SP img04 0→-50(他 75→0, 100→0) | ease なし(scrub 追従) |
| C3 | scroll(`util.scrTop`) | `#siteHeader` | home: `#js-lineupList` の top を超えたら `.is-mini`(SP は 10px)。非 home は 10px | `#gNavWrapper` height 110→90px & 背景→#F5F3EC(`transition: height .3s, background .3s`)、`#siteLogo a` height 120→90px(`height .3s`)、文字白→黒 |
| C4 | click | `.pageTopVox button` | `html,body` scrollTop→0 | 500ms easeInOutQuart(anime.js) |
| C5 | load 時 hash / `a[href*="#"].scroll` | ヘッダー高さ分オフセットしたスムーススクロール | `util.sScroll(-(hHeight), 500, 'easeInQuad')` | 500ms |

**D. Swiper 設定**

| # | 要素 | 設定 |
|---|---|---|
| D1 | `#js-bnrList` | `slidesPerView: PC 'auto'(slide 650px 固定) / SP 1.4`, `centeredSlides:true`, `spaceBetween: PC 50 / SP 15`, `loop:true`, `speed:1500`, `autoplay:{delay:3000, disableOnInteraction:false}` |
| D2 | `#js-recipeSlider` | `slidesPerView:'auto'`(320px), `spaceBetween: PC 40 / SP 20`, `navigation`, `scrollbar:{el:'.scrollbar', hide:false, dragSize:16, draggable:true}`(loop / autoplay なし) |
| D3 | `#js-lineupList`(SP) | B4 参照 |
| D4 | `#js-footerBnr`(SP、3 枚以下は clone で倍化) | `slidesPerView:1.5, centeredSlides:true, spaceBetween:15, loop:true, speed:1500, autoplay 3000` |

**E. ホバー / クリック(CSS transition)**

| # | 対象 | 動き | 値 |
|---|---|---|---|
| E1 | `.btnStyle01 a`(pill ネイビー、min-width 260px、padding 15px 55px) | `::after` 背景が width +16px / height +4px に膨張、左矢印 `::before` が `background-position: right→left`(30px 幅 SVG をスライド) | width/height .3s、bg-position .3s |
| E2 | `.btnStyle02`(円 152px、白枠 2px) | `::after` ネイビー円が bottom/left -25px→-15px、opacity 0→1(影がずれて寄る) | .3s |
| E3 | `#gNav>ul>li>a` | `::after` 7px 白丸が top -3→-5px、opacity 0→1。`.is-mini` 時はネイビー丸+文字ネイビー | color .3s、top/opacity .3s |
| E4 | `.js-gNavAcc:hover .sub` | メガメニュー opacity 0→1 / visibility | .3s |
| E5 | `.recipeSliderContainer .item a:hover .img img` | scale 1→1.05 | transform .3s |
| E6 | `.navigation .btn` | 矢印 SVG bg-position right→left | .3s |
| E7 | `.pageTopVox button` | `::before` 白パン形 width/height 0→83%、opacity 0→1、文字→ネイビー | .3s |
| E8 | ロゴ / SNS / バナー / サブナビ | opacity→.7 | `.2s ease-in-out` |
| E9 | `#gNavOpener` click(SP) | `body.is-navOpen`(`position:fixed` でスクロールロック、`#js-gNavBg` 白 80% 全面、`inert` 付与)。`#gNavWrapper` `@keyframes gNavFadeIn`(translateY(-50%+5px)→-50%、opacity 0→1) .5s ease-out。3 本線→×(2 本目 opacity 0、±35deg 回転、色反転) | .4s / .5s |
| E10 | `.popupBtItem.movie` click | `PopupAdjust` で YouTube iframe(autoplay=1)を `.popupWrapper.movie`(56.25vw、閉じる × 50px)に挿入、`@keyframes fadeIn/fadeOut` | – |
| E11 | `.tabVoxWrapper`(下層ページ用) | `.tabs button` click / 矢印キーで `.tabContents.show` 切替、aria 管理 | – |

その他 JS: 500ms debounce の resize で PC/SP モードが変わると **`location.reload()`**(SP/PC を DOM 置換で作り分けているため)。`LazyLoadBg`(`.js-lazyBg` を IntersectionObserver で表示)。count-up / SplitText / 文字分割 / カスタムカーソル / marquee / Lenis 慣性スクロールは **なし**。

### 5. 再現上の要点(数値まとめ)

- 表示アニメ = 「y 60px→0 + fade、600ms、easeOutCubic、子要素 300ms stagger、画面下 20〜30% で発火、1 回のみ」。IntersectionObserver で十分(ScrollTrigger 不要)。
- パララックスは GSAP ScrollTrigger scrub 1 セクションのみ。y 範囲 PC 300 / 100 / 200px。
- 全 transition は 0.2〜0.5s、ease 既定。Swiper 自動再生 3s 間隔・1.5s 送り。
- ヒーローは「スライダー」ではなく **hover 連動のオーバーレイ切替**(自動再生なし)。

### 6. 同窓会サイトへの再マッピング案(レイアウト・アニメーション温存)

| 参照ブロック | 同窓会版 | 内容案([要確認]は仮) | 温存するパターン |
|---|---|---|---|
| ヘッダー 5 ナビ + メガメニュー(商品 6) | 同窓会について / 沿革 / 年間行事(メガ: 総会・懇親会・部会・支部 等 6 件) / 会報・お知らせ / ギャラリー | SNS は同窓会公式のみ(なければ省略)。Pasco ロゴ → 学校サイトリンク | fixed ヘッダー、is-mini、E3/E4/E9 |
| MV(キャッチ + 商品別オーバーレイ 6) | キャッチ「[要確認] つながる、霞ヶ浦。」+ 行事/支部 6 件のカード(hover で校舎・行事写真とカードを切替) | 写真はプレースホルダ(グラデ/イラスト) | A1、B1〜B4、波形区切り |
| lineupList 6 カード | 行事カード 6(総会・懇親会・体育祭OB戦・支部会・会報発行・新入会員歓迎 等 [要確認]) | 画像は SVG アイコン | B3 hover |
| バナー帯 Swiper | お知らせ / 会報最新号 / 寄付・協賛 / 学校 HP / 入会案内バナー | – | D1 |
| Concept「超熟のこだわり」 | 「同窓会について」会長挨拶 + 設立趣旨 | `copyTxt` を挨拶見出し | C1 flowVox、E1 |
| History「ヒストリー」+ パララックス画像 3 | 「沿革・数字で見る同窓会」創立年・卒業生数・支部数 [要確認]、写真 3 枚パララックス | mask 形は校章風 / 角丸に変更可 | C2 ScrollTrigger scrub |
| Recipe Swiper 10 カード | 「会報・お知らせ」記事カード(日付 + タイトル + 「詳しく見る」) | scrollbar ドラッグは校章 / 円形 SVG | D2、E5 |
| CM Gallery + PLAY MOVIE | 「ギャラリー」行事写真 + 動画(なければ「写真を見る」円ボタン) | YouTube ID [要確認] | E2、E10 |
| Supporters Club バナー | 「会費・入会・住所変更のご案内」CTA バナー(→ お問い合わせフォーム) | 会費額 [要確認] | C1、E8 |
| フッター + PAGETOP | ロゴ / 連絡先 / 事務局所在地 [要確認] / ナビ / © 霞ヶ浦高等学校同窓会 | パン形 → 円形 / 校章形 SVG | C4、E7 |

追加推奨(参照に無いが同窓会に必須): 「お問い合わせ」セクション(フォーム or メールリンク)を Supporters Club バナー位置の直後に追加。

### 7. 推奨技術スタック

- **Next.js App Router + TypeScript**(goal.md 既定どおり)。`app/page.tsx` 1 ページ + `components/sections/*`(セクションごと小ファイル)。
- **GSAP + ScrollTrigger**: History パララックス(scrub)のみ。`useGSAP` / `gsap.context` + cleanup で StrictMode 二重登録を回避。**表示アニメ(flowVox)は IntersectionObserver + CSS transition(600ms cubic-bezier(0.33,1,0.68,1)、stagger は `transition-delay` 300ms×index)で実装**(メモリ「GSAP ScrollTrigger StrictMode gotcha」: ScrollTrigger で単純フェードは不透明度が固まる事例あり)。
- **Swiper 11(React `swiper/react`)**: バナー・お知らせ・SP 行事カード。`modules:[Autoplay, Navigation, Scrollbar]`。
- **anime.js は不要**: スムーススクロールは `window.scrollTo({behavior:'smooth'})` か GSAP ScrollToPlugin、`#wrapper` フェードは CSS `@keyframes` 500ms。
- フォント: `next/font/google` で **Montserrat 600** + 本文は `Noto Sans JP`(Yu Gothic は OS 依存のため代替)。1rem = 10px 方式(`html{font-size:62.5%}`)を踏襲すると数値移植が容易。
- 画像: 参照画像は不使用。`public/placeholder/*.svg`(グラデ + 校名)を自作。波形・パン形 SVG は自作パス(単純ベジェ)で代替。
- CSS: CSS Modules または Tailwind v4(v4 の場合 `--color-base` 命名衝突に注意 = メモリ gotcha)。
- レスポンシブ: 767px を単一ブレークポイント。参照は PC/SP で `location.reload()` しているが、React では `matchMedia` フックで分岐する(reload しない)。
- 検証: `pnpm build` + puppeteer-core headless で 1440×900 / 390×844 スクショ、`grep -ri "pasco\|超熟\|choujuku"` がゼロ。

### 8. 未解決・Judge 判断事項

1. History セクションの「食パン形マスク」を同窓会でどう置換するか(校章形 / 角丸長方形 / 円)。
2. SNS 5 アイコン・YouTube 動画・バナー 6 種の実データが無い場合の省略ルール。
3. ヒーロー写真 7 枚分のプレースホルダ方針(単色グラデ + ラベル / 生成画像不可の前提)。
4. 本文フォント代替(Noto Sans JP vs システム Yu Gothic 継続)。

## Board Receipt Snippet

```yaml
receipt:
  result: done
  note: notes/T001-reference-site-analysis.md
  summary: "参照は Pasco 超熟ブランドサイト(塾ではない)。10 ブロック、アニメ 17 種(intro fade 500ms / hover 連動 MV 0.5s / flowVox y60→0 600ms easeOutCubic stagger 300ms / ScrollTrigger scrub パララックス 1 箇所 / Swiper 4 種)。#005099・#F5F3EC、Yu Gothic + Montserrat 600、767px。ローディング演出は無し。同窓会再マッピングと Next.js + IO + GSAP + Swiper 構成を記載。"
```
