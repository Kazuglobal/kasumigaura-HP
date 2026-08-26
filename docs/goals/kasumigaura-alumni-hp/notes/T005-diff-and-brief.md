# T005: 参照サイトとの差分修正 + site-brief

Task: `T005`
Kind: `worker`
Status: `current`

## Summary

`shots/pc-full.png` / `sp-full.png` と `notes/ref/ref-pc-full.jpg` / `ref-sp-full.jpg` を比較し、撮影スクリプトの不具合(smooth scroll 途中撮影、hover 残り)、History 画像と行事リストの重なり、ヒーロー用プレースホルダの波と WaveDivider の競合を修正。`docs/site-brief.md`(目的・技術構成・セクションマップ・[要確認] 20 項目・素材差し替え・検証コマンド・既知差分)を作成。build / lint / shots(11 PNG + アサーション)/ 残存語 0 で緑。

## Details

### 比較結果(PC 1440)
| 観点 | 参照 | 実装 | 判定 |
|---|---|---|---|
| ヘッダー(透明→ベージュ is-mini、白ロゴタブ) | ○ | ○(pc-mini-header.png) | 一致 |
| ヒーロー全幅 + 左上キャッチ + 下端 6 カード重ね | ○ | ○ | 一致(写真はプレースホルダ) |
| カード hover でヒーロー上に白 80% 角丸カード | ○ | ○(pc-hover-card3.png) | 一致 |
| バナー帯(中央大・左右見切れ・自動再生) | ○ | ○ | 一致 |
| Concept: 角丸写真 + 左テキストカード + 波で白へ | ○ | ○ | 一致 |
| History: 右テキスト + 左大画像 + 小画像 2 枚 + scrub パララックス | ○ | ○(pc-history.png) | 一致(食パン形→角丸 40px は意図的差分) |
| Recipe/News: ベージュ波帯 + カード Swiper + 丸ボタン + scrollbar | ○ | ○(pc-news.png) | 一致 |
| Gallery: 全幅写真 + 右テキスト + 円形ボタン → モーダル | ○ | ○(pc-gallery-modal.png) | 一致(動画未設定時は写真グリッド) |
| バナー(角丸・右下丸矢印) | ○ | ○ | 一致 |
| フッター(ベージュ・ロゴ・ナビ・© ・PAGE TOP 円) | ○ | ○ | 一致(パン形→円形は意図的差分) |
| 全高 | 5,552px | 7,555px | 年間行事・Contact を追加したため長い(許容) |

### SP 390
- 横はみ出しなし(`scrollWidth === 390` を初回と全スクロール後の 2 回アサート)
- ハンバーガー → 全面ナビ(sp-nav-open.png)、ラインアップ横スクロール、各セクション 1 カラム、フッター 2 列ナビ(sp-footer.png)

### 修正内容
1. `scripts/shots.mjs`: `scroll-behavior:smooth` を無効化し `behavior:'instant'` で移動(pc-history / pc-news / sp-footer が正しい位置に)、hover 後に `mouse.move(0,0)` で B2 を戻してから全ページ撮影
2. `src/components/sections/history.module.css`: `.events{margin-top:300px}`(img03 の下はみ出し 235px + パララックス分を回避)
3. `public/placeholder/hero-intro.svg`: 波形パス 3 本を削除しラジアルグラデ + 円のみに(下端 WaveDivider との競合解消)
4. `docs/site-brief.md` 新規作成

### 検証出力
- `pnpm build`: error 0 行 / `pnpm lint`: 0 problems
- `node scripts/shots.mjs`: exit 0、11 PNG
- 残存語 grep: 0 / console.log: 0
- `grep -c '要確認' docs/site-brief.md`: 16(表 20 行のうち要確認表記を含む行)

### 受け入れた差分(参照素材が必要なもの)
- 実写真・校章・ロゴ・動画は未提供 → 自作 SVG プレースホルダ([要確認] 一覧に記載)
- 食パン形マスク / パン形ボタン → 角丸 / 円形

## Board Receipt Snippet

```yaml
receipt:
  result: done
  note: notes/T005-diff-and-brief.md
  summary: "参照との比較で撮影スクリプト・History 重なり・ヒーロー SVG を修正。site-brief.md 作成([要確認] 20 項目)。build/lint/shots/grep 緑。"
```
