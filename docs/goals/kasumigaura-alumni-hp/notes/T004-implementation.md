# T004: 残り全セクション + フッター実装

Task: `T004`
Kind: `worker`
Status: `current`

## Summary

About / History(GSAP scrub パララックス + 年間行事リスト)/ News(Swiper + カスタム scrollbar)/ Gallery(円形ボタン + フェードモーダル)/ Join CTA(PC 1000px バナー、SP Swiper D4)/ Contact / Footer(PAGE TOP E7)を実装し、`page.tsx` に配線。`scripts/shots.mjs` に全ページ・セクション別・モーダル・フッターの撮影と SP 横はみ出しアサーションを追加。build / lint / shots / 残存語 grep すべて緑。

Worker エージェントはセッション上限で途中終了(About〜Gallery のコンポーネントと data/placeholder まで作成済み)。以降の Join / Contact / Footer / page.tsx / shots.mjs 拡張と検証は PM が引き継いで完了した。

## Details

### 追加・変更ファイル
- `src/components/sections/`: `section-head.tsx`, `about-section.tsx` + `about.module.css`, `history-section.tsx`, `history-parallax.tsx`, `events-list.tsx` + `history.module.css`, `news-section.tsx`, `news-slider.tsx` + `news.module.css`, `gallery-section.tsx`, `gallery-trigger.tsx`, `gallery-modal.tsx` + `gallery.module.css`, `cta-card.tsx`, `join-section.tsx`, `join-slider.tsx` + `join.module.css`, `contact-section.tsx` + `contact.module.css`
- `src/components/layout/`: `site-footer.tsx`, `page-top-button.tsx`, `footer.module.css`
- `src/data/`: `events.ts`, `news.ts`, `join.ts`, `contact.ts`, `footer.ts`(`sections.ts` / `site.ts` に about/history/gallery/youtubeId を追加)
- `src/styles/globals.css`: `.headStyle02`, `.btnStyle02`(E2), `.sectionHead`, `fadeIn/fadeOut`, `body.is-popupOpen`
- `public/placeholder/`: about / history-01..04 / news-01..10 / gallery / photo-01..06 / cta(自作 SVG)
- `src/app/page.tsx`: 全セクション配線(`section-stubs.tsx` は未使用化)
- `scripts/shots.mjs`: `scrollThrough` / `scrollTo`(smooth scroll 無効化)/ `fullShot`、pc-full / pc-history / pc-news / pc-gallery-modal / sp-full / sp-footer、SP scrollWidth アサーション

### アニメーション ID 対応
| ID | 実装 |
|---|---|
| C1 | 各セクションを `<FlowVox>` で包む(About / History / Events / News / Gallery / Join / Contact) |
| C2 | `history-parallax.tsx`: `useGSAP` + ScrollTrigger scrub、PC img01 100→-200 / img02 50→-50 / img03 100→-100、SP img04 0→-50(`data-parallax-from/to`) |
| C4 | `page-top-button.tsx`: `window.scrollTo({top:0, behavior:'smooth'})` |
| D2 | `news-slider.tsx`: slidesPerView auto(320px)、spaceBetween 40/20、Navigation、Scrollbar dragSize 16 |
| D4 | `join-slider.tsx`: SP のみ 1.5 / centered / 15 / loop / 1500 / 3000(3 枚未満なら静的) |
| E1 | 全 `.btnStyle01` |
| E2 | `.btnStyle02` 円形 152px + hover でネイビー円が -25→-15px |
| E5 | News カード画像 hover scale 1.05 |
| E6 | 54px 丸ボタン、矢印 bg-position right→left |
| E7 | PAGE TOP `::before` 白円 0→83% + 文字ネイビー |
| E10 | `gallery-modal.tsx`: fadeIn/fadeOut keyframes、Esc / overlay で閉じる、focus 復帰、scroll lock |

### 検証結果
- `pnpm build` exit 0(Next.js 16.3.2、静的 3 ページ)
- `pnpm lint` 0 problems
- `node scripts/shots.mjs` exit 0、11 PNG(assertions: is-mini / SP scrollWidth 390(初回・全スクロール後)/ is-navOpen / #popupContents)
- `grep -rniE 'pasco|パスコ|超熟|choujuku|敷島|食パン|レシピ|パン|supporter' src public | wc -l` → 0
- `grep -rn 'console.log' src | wc -l` → 0 / `grep -rni lorem src | wc -l` → 0
- `grep -c '要確認' src/data/*.ts` → banners 4 / contact 6 / events 2 / hero 3 / join 2 / nav 1 / news 11 / sections 11 / site 3

### Deviations
- Worker がセッション上限で中断 → PM が残りを実装(ボード規律上は PM タスク扱い。allowed_files 内のみ編集)。
- `html{scroll-behavior:smooth}` により撮影スクリプトの `scrollTo` 直後が移動途中になっていた → スクリプト側で `scrollBehavior='auto'` + `behavior:'instant'` に変更。
- History の img03(bottom -235px)が年間行事リストに重なった → `.events{margin-top:300px}`。
- `CtaCard` を `cta-card.tsx` に分離(server/client の循環 import 回避)。
- Contact の「メールでお問い合わせ」は mailto 未確定のため `#contact` へのアンカー + 注記。

### T005 への申し送り
- ヒーロー用プレースホルダ SVG の波と下端 WaveDivider の視覚的競合(T003 open issue)
- About セクション見出しと写真の間の余白が参照よりやや広い(SP)
- History の SectionHead 位置(参照は右カラム上)と img02 の重なり具合の微調整
- pc-full 撮影時にカード hover が残る問題はスクリプトで修正済み(次回 shots で確認)

## Board Receipt Snippet

```yaml
receipt:
  result: done
  note: notes/T004-implementation.md
  summary: "About/History(パララックス)/News(Swiper)/Gallery(モーダル)/Join/Contact/Footer を実装し配線。build/lint/shots(11 PNG + assertions)/残存語 0 すべて緑。Worker 中断分は PM が引き継ぎ完了。"
```
