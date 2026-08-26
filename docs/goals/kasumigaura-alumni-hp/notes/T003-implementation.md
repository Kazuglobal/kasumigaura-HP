# T003: 雛形 + 最初の縦割りスライス(ヘッダー / ヒーロー / ラインアップ / バナー / FlowVox / shots)

Task: `T003`
Kind: `worker`
Status: `done`

## Summary

`C:\Users\s1598\test-1` に Next.js 16.3.2(App Router, Turbopack)+ TypeScript + CSS Modules のプロジェクトを手書き package.json から構築し、T002 の worker_packages.T003 の 10 項目をすべて実装した。`pnpm build` / `pnpm lint` / `node scripts/shots.mjs`(5 枚 + 3 アサーション)/ 残存語・console.log・lorem の grep はすべて緑。文言は content_plan どおりで `[要確認]` は src/data/*.ts に 10 箇所。

## File tree

```
package.json / pnpm-lock.yaml / .npmrc / .gitignore
next.config.ts (reactStrictMode, turbopack.root) / tsconfig.json / eslint.config.mjs / next-env.d.ts (生成物)
scripts/shots.mjs
src/app/layout.tsx            lang ja, next/font Montserrat 600 (--font-en), body.home, #wrapper
src/app/page.tsx              Header / Hero(+Lineup) / BannerSection / SectionStubs
src/styles/globals.css        tokens, 1rem=10px, body typography, min-width 1200px, A1 introFade, .enTitle/.headStyle01/.copyTxt/.btnStyle01(E1)/.hoverFade(E8)
src/data/site.ts              サイト名・英字名・sns:[]・公式サイトリンク([要確認 URL])・breakpointSp 767
src/data/nav.ts               navPc 5 件、megaMenu 6 件(+ note「日程は [要確認]」)、a11y ラベル
src/data/hero.ts              catchCopy / sub / heroCards 6 件(copy・body・href・image・icon)
src/data/banners.ts           banners 6 件 + Swiper 設定値
src/data/sections.ts          T004 用アンカー見出し 7 件
src/hooks/use-is-sp.ts        useSyncExternalStore + matchMedia(767px)、SSR 時 undefined
src/hooks/use-body-class.ts   body クラス付与 + スクロールロック/復元(E9)
src/components/layout/header.tsx / global-nav.tsx / header-right.tsx / header.module.css / section-stubs.tsx
src/components/hero/hero.tsx / hero-item.tsx / hero.module.css / lineup.tsx / lineup-card.tsx / lineup-swiper.tsx / lineup.module.css
src/components/motion/flow-vox.tsx / flow-vox.module.css / wave-divider.tsx / wave-divider.module.css
src/components/banner/banner-section.tsx / banner-slider.tsx / banner.module.css
public/placeholder/hero-intro.svg, hero-01..06.svg   自作グラデ + 波形(ネイビー/スカイ/ベージュ)
public/icons/card-01..06.svg, mega-01..06.svg, arrow-white.svg, arrow-navy.svg, chevron-white.svg
shots/pc-hero.png pc-hover-card3.png pc-mini-header.png sp-hero.png sp-nav-open.png (.gitignore 対象)
```

## Animation IDs → 実装

| ID | 実装箇所 | 内容 |
|---|---|---|
| A1 | globals.css `#wrapper` | `@keyframes introFade` opacity 0→1、500ms linear、forwards(reduced-motion 時 1ms) |
| B1 | hero.tsx / hero-item.tsx / hero.module.css | `HeroState {active, hiding}` を不変更新。active → `.isActive`(z53、.img opacity 0→1 / translateY(10px)→0 `transition: all .5s`、.outline opacity/transform .5s、SP は translateX)。leaving は `.isHide`(z52)を `onTransitionEnd(opacity)` まで保持 |
| B2 | hero.tsx `useEffect` | `(any-hover:hover)` 時のみ document `mouseover` を監視し、`#mainVisualWrapper` 外なら deactivate |
| B3 | lineup.module.css | hover / `.isActive` で文字白、`.cInner` translateY(-10px)、`.cInner::before` 440×150 ネイビー楕円 translate(-50%,100%)→(-50%,50%) + opacity(.3s)、`::before` 丸 scale 0→1(.6s)/opacity(.4s)、`::after` 枠丸 top 15→5px |
| B4 | lineup-swiper.tsx | SP のみ mount 後に Swiper(`slidesPerView:'auto'`, `spaceBetween:10`, `loop`, Navigation prev/next 丸ボタン)。tap で toggle、`.closeBtn`(ネイビー円 ×)で閉じる |
| C1 | motion/flow-vox.tsx | IntersectionObserver `rootMargin: 0 0 -{innerHeight×(横長 .3 / 縦長 .2)}px`, threshold 0, 一度きり(disconnect)。子要素 translateY(60px)/opacity 0 → 0/1、600ms `cubic-bezier(.33,1,.68,1)`、`transition-delay = index×stagger(300ms)`(nth-child 1..12)。prefers-reduced-motion は即表示。`as` / `className` / `stagger` props。page ではセクションスタブ 7 箇所で使用 |
| C3 | layout/header.tsx | scroll/resize で `#siteHeader.is-mini` を classList.toggle(PC: scrollY > `#js-lineupList` の top / SP: >10px)。wrapper 110→90px、bg→#F5F3EC、文字→黒、丸→ネイビー、ロゴ 120→90px(各 .3s) |
| D1 | banner/banner-slider.tsx | 6 バナー ×2 = 12 スライド、`slidesPerView` PC 'auto'(650px) / SP 1.4、`centeredSlides`, `loop`, `speed 1500`, `autoplay {delay 3000, disableOnInteraction:false}`、spaceBetween 50/15。`key` で PC/SP を再マウント。swiper CSS はクライアント内 import |
| E1 | globals.css `.btnStyle01` | pill ネイビー min-width 260 / padding 15px 55px / 1.7rem bold。hover で `::after` 背景 +16px/+4px、`::before` 矢印 background-position right→left(.3s) |
| E3 | header.module.css `.navLink::after` | 7px 丸 top -3→-5px、opacity 0→1(.3s)。is-mini 時ネイビー丸 + 文字ネイビー |
| E4 | header.module.css `.hasSub:hover .sub` | メガメニュー 900px 白 radius 20px ネイビー 1px 枠 fixed top 90px、6 項目 120px アイコン、opacity/visibility .3s |
| E8 | globals.css `.hoverFade` | ロゴ / バナー / メガ項目 / 公式サイトリンク opacity→.7(.2s ease-in-out) |
| E9 | header.tsx + use-body-class.ts + header.module.css | 56px ネイビー角ハンバーガー → `body.is-navOpen`(position fixed + top 復元でスクロールロック)、`#js-gNavBg` 白 80%、`@keyframes gNavFadeIn`(translateY(-50%+5px)→-50%, opacity)0.5s ease-out、3 本線→×(中央 opacity 0、±35deg) |
| Wave | motion/wave-divider.tsx | 自作ベジェ 1 パス(viewBox 1440×120)、props `fill / flip / height(padding-top %) / className`。ヒーローでは各 `.img` の下端にベージュ塗りで配置 |

## Verify outputs

```
pnpm install                     -> Done in 1m 22.4s (next 16.3.2, react 19.2.8, swiper 11.2.10, gsap 3.15.0, @gsap/react 2.1.2, eslint 9.39.5, eslint-config-next 16.3.3, puppeteer-core 24.43.1, typescript 5.9.3)
pnpm build                       -> exit 0 (Compiled successfully / TypeScript OK / 3 static pages)
pnpm lint                        -> exit 0, 0 problems
node scripts/shots.mjs           -> exit 0; saved pc-hero.png pc-hover-card3.png pc-mini-header.png sp-hero.png sp-nav-open.png
                                    assertions passed: #siteHeader.is-mini after scrollTo(0,900) / SP scrollWidth === 390 / body.is-navOpen after #gNavOpener click
grep -rniE 'pasco|パスコ|超熟|choujuku|敷島|食パン|レシピ|パン' src public | wc -l   -> 0
grep -rn 'console.log' src | wc -l   -> 0
grep -rn -i 'lorem' src | wc -l      -> 0
grep -c '要確認' src/data/*.ts       -> banners 4 / hero 3 / nav 1 / site 2 / sections 0
```

目視確認(Read ツール): pc-hero(ロゴタブ・グラデヘッダー・キャッチ・波形・6 カード)、pc-hover-card3(3 枚目に楕円 + 白文字 + 丸、白 80% カード + pill ボタン、ボタンがカードと重ならない)、pc-mini-header(ベージュ 90px・黒文字・ロゴ 90px、About の FlowVox 発火済み)、sp-hero(100×85 ロゴ、56px ハンバーガー、2 行キャッチ、Swiper + prev/next)、sp-nav-open(× 化、白 80% + blur、ナビ + メガ 6 件 + 公式サイトリンクが 1 画面に収まる)。

## Deviations

1. **lint 修正 1 回**: `FlowVox` の `createElement(as, { ref })` が `react-hooks/refs`(React Compiler ルール)でエラー → JSX `<Tag ref>` に変更。ビルド・shots は初回から成功(fix attempts: lint 1 / build 0 / shots 0)。
2. **`.outline` の padding-bottom を 170px → 320px**: 参照値 170px ではカード + pill ボタンがラインアップ 6 カード(bottom 75px、高さ約 200px)と重なった。ボタン下端がカード上端より上に収まる値へ調整(1 回目 300px でも接触したため 320px)。
3. **SP ナビ背景に `backdrop-filter: blur(8px)` を追加**: 白 80% のみだとヒーローのキャッチコピーがナビ文字に透けて可読性が落ちたため。参照には無い装飾(T005 で不要と判断すれば 1 行削除で戻せる)。同様に SP のメガメニューはアイコン 40px・3 列に縮小し、パネルに `max-height: calc(100svh - 120px); overflow-y: auto` を付与。
4. **波形の位置**: T001 の「下端を白に切替」ではなく ref-pc-hero.png の見た目(画像 → ベージュ帯の上にカード)に合わせ、波形の塗りは `#F5F3EC`、各 `.img` の高さは `calc(100% - 200px)`(SP 185px)として下端に波形を重ねた。
5. **next.config.ts に `turbopack.root: process.cwd()`**: ホームディレクトリの pnpm-lock.yaml をルートと誤認する警告が出たため固定。
6. **tsconfig.json は `next build` により自動整形**(`jsx: react-jsx`、include に `.next/dev/types/**/*.ts` 追加)。内容は許可範囲内なのでそのまま採用。
7. `.gitignore` で `shots/` と `next-env.d.ts` を除外(検証時はローカルに生成される)。
8. `hero.ts` の `heroCards[].button` は content_plan に無いラベル「詳しく見る」を追加(pill ボタン用)。`hero.ts` の `prevLabel/nextLabel/closeLabel`、`nav.ts` の a11y ラベルも同様の補助文言。

## Open issues (T004 / T005 向け)

- `#about #history #events #news #gallery #join #contact` は見出しのみのスタブ(FlowVox 付き)。T004 で本文を実装する。
- ヒーローのプレースホルダ SVG 自体に波形模様を入れているため、実写真に差し替えるまで下端の波形区切りとやや重なって見える(T005 で調整可)。
- next/font の Montserrat 取得はオンラインで成功した(フォールバック未使用)。

## Board Receipt Snippet

```yaml
receipt:
  result: done
  note: notes/T003-implementation.md
  summary: "Next.js 16 + TS 雛形と最初の縦割りスライス(tokens/globals, layout + Montserrat + A1, Header C3/E3/E4/E9, Hero B1-B4 + 波形, FlowVox C1, WaveDivider, Banner D1, data/*.ts に content_plan, shots.mjs)を実装。build/lint/shots 5 枚/grep 0 すべて緑。"
  evidence:
    - shots/pc-hero.png
    - shots/pc-hover-card3.png
    - shots/pc-mini-header.png
    - shots/sp-hero.png
    - shots/sp-nav-open.png
  deviations:
    - "outline padding-bottom 170→320px(カード重なり回避)"
    - "SP ナビ背景に blur(8px) 追加、SP メガメニュー縮小"
    - "FlowVox を createElement→JSX に変更(react-hooks/refs)"
```
