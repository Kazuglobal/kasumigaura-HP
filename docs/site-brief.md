# 霞ヶ浦高等学校同窓会 Web サイト — サイトブリーフ

## 1. 目的・位置づけ

- 対象: 霞ヶ浦高等学校(茨城県阿見町)同窓会の会員・卒業生・学校関係者
- 参照デザイン: https://www.pasconet.co.jp/choujuku/(Pasco「超熟」ブランドサイト)の **レイアウト・配色・アニメーション** を再現し、内容を同窓会向けに全面置換したもの
- 参照サイトの画像・ロゴ・文章・フォントファイルは一切使用していない(プレースホルダはすべて自作 SVG)
- 1 ページ構成(トップ)。下層ページは未作成(ボタンはトップ内アンカーへリンク)

## 2. 技術構成

| 項目 | 内容 |
|---|---|
| フレームワーク | Next.js 16 App Router + TypeScript(`src/`、`@/*` エイリアス、StrictMode 有効) |
| スタイル | `src/styles/globals.css`(1rem = 10px、デザイントークンは CSS 変数)+ CSS Modules |
| アニメーション | IntersectionObserver(`<FlowVox>`: y60→0 + fade 600ms easeOutCubic、子要素 300ms stagger)/ GSAP ScrollTrigger(History 画像の scrub パララックスのみ)/ CSS transition(hover) |
| スライダー | Swiper 11(`swiper/react`)— バナー帯 D1、会報・お知らせ D2、SP ラインアップ B4、SP Join バナー D4 |
| フォント | 英字ラベル: Montserrat 600(`next/font/google`)/ 本文: システム Yu Gothic スタック |
| ブレークポイント | 767px 以下 = SP(単一)。PC は `body{min-width:1200px}` |
| 検証 | `pnpm build` / `pnpm lint` / `node scripts/shots.mjs`(puppeteer-core + Chrome、PC 1440×900 / SP 390×844) |

## 3. セクションマップ(参照サイト → 同窓会版)

| # | 参照 | 同窓会版(id) | 主なアニメーション |
|---|---|---|---|
| 1 | ヘッダー(固定・is-mini・メガメニュー) | `#siteHeader` ナビ 5 + 年間行事メガメニュー 6 + 公式サイトリンク | C3 is-mini、E3 ドット hover、E4 メガメニュー、E9 SP ハンバーガー |
| 2 | MV + 商品カード 6 | ヒーロー「つながる、ひろがる、霞ヶ浦。」+ メニューカード 6(`#js-lineupList`) | A1 intro fade、B1/B2 hover 切替、B3 カード hover、B4 SP Swiper |
| 3 | バナー帯 | お知らせバナー 6 種 ×2 | D1 自動再生 |
| 4 | Concept | `#about` 同窓会について | C1、E1 |
| 5 | History + パララックス | `#history` 沿革・母校の歩み + `#events` 年間行事 | C1、C2 scrub パララックス |
| 6 | Recipe Swiper | `#news` 会報・お知らせ(10 件) | D2、E5、E6 |
| 7 | CM Gallery | `#gallery` 母校紹介・フォトギャラリー(円形ボタン → モーダル) | E2、E10 |
| 8 | Supporter's Club バナー | `#join` 入会・会費・住所変更のご案内 | C1、E8、D4(SP) |
| 9 | (追加) | `#contact` お問い合わせ | C1、E1 |
| 10 | フッター + PAGETOP | `#siteFooter` | C4、E7 |

## 4. 【要確認】差し替え一覧(実データ未提供のため仮置き)

すべて `src/data/*.ts` に集約。`grep -rn '要確認' src/data` で一覧できる。

| # | 項目 | ファイル | 現在の値 |
|---|---|---|---|
| 1 | 会長名・会長挨拶 | `sections.ts` (`aboutSection.body`) | `[要確認 会長名]` |
| 2 | 創立年 | `sections.ts` (`historySection.body`) | `[要確認 年]` |
| 3 | 卒業生数 | `sections.ts` | `[要確認 人数]` |
| 4 | 支部数 | `sections.ts` | `[要確認 数]` |
| 5 | 年間行事の日程(6 件) | `events.ts` | `[要確認 日程]` |
| 6 | 定期総会 開催日 | `banners.ts`, `news.ts` | `[要確認]` |
| 7 | 会報 号数・発行日 | `banners.ts`, `news.ts` | `第[要確認]号` |
| 8 | お知らせ 10 件の日付・本文 | `news.ts` | `[要確認 日付]` |
| 9 | 年会費 | `banners.ts`, `join.ts`, `hero.ts` | `年会費 [要確認]` |
| 10 | 事務局 所在地 | `contact.ts`, `site.ts` | `[要確認 所在地]` |
| 11 | 事務局 電話番号 | `contact.ts` | `[要確認 電話番号]` |
| 12 | 事務局 メールアドレス(mailto 化) | `contact.ts` | `[要確認 メールアドレス]` |
| 13 | 受付時間 | `contact.ts` | `受付時間 [要確認]` |
| 14 | 学校公式サイト URL | `site.ts`, `banners.ts`, `nav.ts` | `href: '#'` + `[要確認 URL]` |
| 15 | SNS アカウント | `site.ts` (`sns: []`) | 空 → 表示なし。追加すると自動表示 |
| 16 | YouTube 動画 ID | `site.ts` (`youtubeId: null`) | null → 写真グリッド。設定すると PLAY MOVIE + iframe |
| 17 | 写真(校舎・行事・部活等) | `sections.ts` (`gallerySection.photos`)、`public/placeholder/*.svg` | 自作 SVG プレースホルダ |
| 18 | ヒーロー写真 7 枚 | `hero.ts`, `public/placeholder/hero-*.svg` | 自作 SVG プレースホルダ |
| 19 | ロゴ | `header.tsx` / `site-footer.tsx`(テキストロゴ) | 校章・ロゴ画像があれば差し替え |
| 20 | キャッチコピー | `hero.ts` | 「つながる、ひろがる、霞ヶ浦。」(仮) |

## 5. 素材・フォントの差し替えメモ

- 画像: `next/image` を `unoptimized` で使用。実写真に置き換える場合は `public/` に配置し `src/data/*.ts` のパスを変更(比率: ヒーロー 1440×825、About 1300×600、History 552/128/252 正方形、News 320×250、Gallery 16:7)
- 本文フォントを Noto Sans JP 等に変えたい場合は `layout.tsx` で `next/font/google` を追加し `--font-body` を上書き
- 参照サイトの食パン形マスク・パン形ボタンは、同窓会版では角丸 40px / 円形に置換済み(校章形にしたい場合は `history.module.css` の `.img` と `footer.module.css` の `.pageTop` を変更)

## 6. 実行・検証コマンド

```bash
pnpm install
pnpm dev            # http://localhost:3000
pnpm build && pnpm lint
node scripts/shots.mjs   # shots/*.png を生成(PC/SP、hover、is-mini、モーダル、全ページ)+ アサーション
grep -rniE 'pasco|パスコ|超熟|choujuku|敷島|食パン|レシピ|パン|supporter' src public | wc -l   # 0 であること
```

## 7. 既知の差分(参照サイトとの意図的な相違)

- ローディングオーバーレイは参照サイトのトップにも存在しないため未実装(`#wrapper` の 500ms フェードのみ)
- 参照は PC/SP 切替時に `location.reload()` するが、本サイトは `useIsSp()`(matchMedia)で再描画
- 参照の食パン形マスク / パン形 SVG ボタンは角丸・円形に置換
- 参照の SNS 5 アイコン・企業ロゴは、同窓会データ未提供のため非表示 / テキストリンク化
