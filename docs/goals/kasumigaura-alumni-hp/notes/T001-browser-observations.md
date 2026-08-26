# T001: 参照サイト 実ブラウザ観察メモ(PM 補足)

Task: `T001`
Kind: `scout`
Status: `current`

## Summary

Playwright(Chromium)で https://www.pasconet.co.jp/choujuku/ を PC 1440×900 / SP 390×844 で実表示し、セクション構成・DOM 状態・ScrollTrigger 登録・主要 CSS を確認した。参照サイトは **Pasco(敷島製パン)の食パンブランド「超熟」ブランドサイト**(塾ではない)。スクリーンショットは `notes/ref/` に保存(比較用途のみ。実装には流用しない)。

## Details

### ページ基本
- title: 余計なものは入れない。Pascoの超熟｜Pasco
- 全高: PC 5,552px / SP 4,608px
- body font: "Yu Gothic", 游ゴシック, YuGothic, ヒラギノ角ゴ Pro W3, メイリオ, sans-serif。英字ラベル(Concept/History/Recipe/CM Gallery/PAGETOP)は Montserrat 600
- 主要色: ネイビー `rgb(0,80,153)`=#005099(見出し・ボタン・リンク)、ベージュ `rgb(245,243,236)`=#F5F3EC(帯背景・ミニヘッダー背景)、白、黒テキスト
- 区切りは波形(wave)の曲線。セクション背景がベージュ⇔白で交互に波で切り替わる

### セクション順(PC)
1. `#siteHeader`(fixed, 透明 → スクロールで `.is-mini` + `body.headBg` でベージュ背景・黒文字・高さ 90px)。左上ロゴは白い角タブ(140×120)。ナビ 5 項目(こだわり/ヒストリー/商品ラインアップ/レシピ/CMギャラリー)、右に SNS 5 アイコン + Pasco ロゴ。ナビ hover: 下線 `::after` ネイビーが opacity 1
2. `#mainVisualWrapper > #mainVisual > #js-mvSlider.mvSlider`(高さ 690px)。`.item.sliderIntro` に全幅写真 + `.mainCopy` 画像(width 31.25%, top 31.5%, left 11.7%)。他 `.item` は `.is-active` で `.outline`(白 80% 丸角 40px カード、タイトル 2.4rem/コピー 3rem ネイビー)と `.img` が opacity 0→1, translateY(5〜10px)→0, 0.5s で切替
3. `.lineupList`: 6 カード(白・角丸・右上に丸マーク・商品画像+2行名称)が MV 下端に重なって横並び。SP は横スクロール(prev/next ボタン)
4. バナー帯: 横並び 3 枚(中央大・左右見切れ)。SP はカルーセル
5. `section.conceptSection.flowVox`(723px): 英字ラベル「Concept」+ H2「超熟のこだわり」。大きな丸角写真の左に白いテキストカード(見出し・本文・ネイビー丸ボタン「→ 超熟のこだわり」)を重ねる
6. `section.detailsSection`(491px, 内部 `.detailsVox.flowVox`): 左に `.img.img01`(552px、角が内側に膨らんだ「食パン形」マスク)、右に History テキスト。**ScrollTrigger 1 件**: trigger `.img.img01`, start "top bottom", end "bottom top", scrub true(パララックス)
7. `section.recipeSection.flowVox`(691px, ベージュ波背景): Swiper 10 スライド(カード: 写真+タイトル+「レシピを見る」)、左右丸ボタン、下にプログレスバー、中央にネイビーボタン「→ レシピ一覧」
8. `section.gallerySection.flowVox`(726px): 全幅ムービーサムネ + 右に円形「PLAY MOVIE」、下に「→ CMギャラリーへ」
9. `.flowVox`(Supporter's Club バナー: 横長角丸カード、右下に丸矢印)
10. `#siteFooter`(307px, ベージュ): ロゴ + SNS、ナビ横並び、右に Pasco ロゴ、©。`.pageTopVox`(90×90 パン形 SVG ボタン、右上 -30px、hover で白パン形が 83% にふくらむ)

### アニメーション観察
- スクロール表示: `.flowVox` に `is-beganFlowAnime` → `is-finishedFlowAnime` が付与(IntersectionObserver または独自 scroll 監視。GSAP ScrollTrigger は 1 件のみ)
- MV スライダー: 独自 JS(`.is-active` / `.is-hide` クラス切替、CSS transition 0.5s)。Swiper はレシピ/バナー/SP ラインアップに使用
- ヘッダー: `is-mini` 切替(スクロール量で)。`@keyframes gNavFadeIn/Out`(translateY -50%+5px → -50%, opacity)はドロップダウン用
- PAGETOP hover: `::before` の width/height 0→83%, opacity 0→1, 0.3s
- ローディングオーバーレイは DOM 上未確認(Scout の JS 解析で最終確認)

### SP(390px)
- ヘッダー: ロゴタブ(100×85 程度)+ 右上ネイビー角ハンバーガー(button)。ナビは非表示
- MV: 縦長写真、キャッチコピーは下寄せ 2 行。ラインアップは横スクロールカード 3 枚見え
- 各セクションは 1 カラム縦積み、Concept はカード下に写真、History は画像→テキスト
- フッター: ロゴ+SNS、ナビ 2 列

## Board Receipt Snippet

```yaml
receipt:
  result: done
  note: notes/T001-browser-observations.md
  summary: "参照サイトは Pasco 超熟ブランドサイト。10 ブロック構成、波形区切り、#005099/#F5F3EC、flowVox スクロール表示 + ScrollTrigger パララックス 1 件 + Swiper。PC/SP スクショを notes/ref に保存。"
```
