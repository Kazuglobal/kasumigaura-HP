# 霞ヶ浦高等学校同窓会 Webサイト(pasconet 超塾サイトのデザイン・アニメーション再現)

## Objective

参照サイト https://www.pasconet.co.jp/choujuku/ のビジュアルデザイン・レイアウト・スクロール/ホバー/ローディング等のアニメーションを忠実に再現しつつ、
すべてのコンテンツ(文言・画像・セクション構成・ナビゲーション)を「霞ヶ浦高等学校同窓会」向けに置き換えた Web サイトを、
`C:\Users\s1598\test-1` 配下に動作する形(ローカルでビルド・起動でき、ブラウザでアニメーションが確認できる状態)で作成する。

## Original Request

> https://www.pasconet.co.jp/choujuku/ このデザインアニメーションを再現し、内容は霞ヶ浦高等学校同窓会用にして作成します。まずは目標として設定して

## Intake Summary

- Input shape: `specific`(参照URLと対象が明確。ただし参照サイトの構造・アニメーション詳細は未調査 → 最初は Scout)
- Audience: 霞ヶ浦高等学校(茨城県阿見町)の同窓会会員・卒業生・在校生保護者・学校関係者
- Authority: `requested`
- Proof type: `demo` + `artifact`
- Completion proof:
  - `test-1` 配下に Next.js(App Router)+ TypeScript + GSAP のプロジェクトが存在し `pnpm build`(または npm)が成功する
  - `pnpm dev` で起動したページを headless ブラウザ(puppeteer-core / Playwright)でスクリーンショット撮影し、参照サイトの主要セクション(ヒーロー/導入/特徴/一覧/CTA/フッター等、Scout が特定したもの)と対応する構成・アニメーションが再現されている
  - 参照サイトの固有名詞(パスコ/超塾 等)が残存参照ゼロ(grep で確認)、全文言が霞ヶ浦高校同窓会向け
  - PC(1440px)・SP(390px)の両ビューポートでレイアウト崩れがない
- Likely misfire:
  - 参照サイトの見た目だけをコピーしてアニメーション(ローディング・スクロール連動・テキスト分割・パララックス等)を省略する
  - 逆にアニメーションだけ再現して内容がプレースホルダ(Lorem ipsum / 塾の文言のまま)で終わる
  - 参照サイトの画像・ロゴ・フォントファイルをそのまま流用する(著作権上不可。画像はプレースホルダ or 自作、フォントは Google Fonts 等の代替)
- Blind spots considered:
  - 参照サイトの実装が JS ライブラリ依存(GSAP/Lenis/Swiper 等)の可能性 → Scout で使用ライブラリを特定してから選定
  - 霞ヶ浦高校同窓会の実データ(会長名・会員数・行事日程・会費)はユーザー未提供 → 仮データは「要差し替え」と明示し `docs/site-brief.md` にまとめる(既存の同窓会HP案件と同じ運用)
  - 参照サイトが塾の LP 構造(コース紹介・料金・入塾の流れ)のため、同窓会向けには「同窓会について/年間行事/会報・お知らせ/会員名簿・会費/入会・住所変更/お問い合わせ」等への再マッピングが必要
  - `test-1` は独立 git リポジトリではなくホームディレクトリ全体が git ルート → `git add` はパス限定必須、破壊的 git 操作厳禁
- Existing plan facts: なし(ユーザー提供の手順はなし)

### 訂正(2026-08-25 PM 確認): 参照サイトは「塾」ではなく Pasco(敷島製パン)の食パンブランド「超熟」ブランドサイト

- 実ブラウザで確認済み。上記の「塾 LP」前提は誤りで、参照サイトの構成は:
  ヘッダー(固定・スクロールで is-mini 化・ロゴ白タブ) → MV スライダー(キャッチコピー画像+ラインアップ 6 カード横並び) → バナー帯(横スクロール) → Concept(丸角写真+テキストカード重ね) → History(パララックス画像 + テキスト) → Recipe(Swiper カルーセル 10 枚) → CM Gallery(全幅動画 + PLAY MOVIE) → Supporter's Club バナー → フッター(ロゴ・SNS・ナビ・PAGETOP 丸ボタン)
- 波形(wave)の区切りと ベージュ `#F5F3EC` × ネイビー `#005099` の配色、Yu Gothic + Montserrat(英字ラベル)が意匠の核
- 同窓会向け再マッピング: MV → ヒーロー+主要メニュー 6 カード(同窓会について/年間行事/会報・お知らせ/会費・入会/母校紹介/お問い合わせ)、バナー帯 → お知らせ・告知バナー、Concept → 同窓会について(会長挨拶)、History → 沿革・母校の歩み、Recipe(Swiper) → 行事・活動レポート、CM Gallery → 母校紹介ムービー/フォトギャラリー、Supporter's Club → 入会・寄付のご案内
- 残存参照ゼロ対象の固有名詞: Pasco / 敷島 / 超熟 / CHOUJUKU / 食パン・レシピ等の商品文言

## Goal Kind

`specific`

## Current Tranche

継続実行。Scout で参照サイトの構造・アニメーション・使用技術を調査 → Judge で技術選定と最初の Worker パッケージ(プロジェクト雛形+ヒーロー+ローディング演出)を決定 → Worker で縦割りスライス(セクション単位)を順次実装・検証 → 差分比較(diff-iterator 相当)で再現度を詰める → 最終監査で完了条件を確認するまで止まらない。

## Non-Negotiable Constraints

- 参照サイトの画像・ロゴ・ウェブフォントファイル・文章をそのまま複製しない(構成・動き・配色・タイポグラフィの再現に留める)
- 校名は「霞ヶ浦高等学校」、団体名は「霞ヶ浦高等学校同窓会」。実在情報が未確認の項目(役員名・会員数・日程・金額)は捏造せず `[要確認]` プレースホルダにする
- 技術スタック: Next.js App Router + TypeScript + GSAP(既存の同窓会HP案件と統一)。GSAP ScrollTrigger の React StrictMode 問題に注意(単純フェードインは IntersectionObserver)
- コード規約: 不変性・小ファイル(<800行)・console.log 禁止・ハードコード値は定数化
- `C:\Users\s1598\test-1` 以外のディレクトリ(`../HP-test` 等)を編集しない
- `rm -rf` 等の再帰削除は事前に `ls` で対象確認、`git reset --hard` / `push --force` 禁止
- 外部公開(push / デプロイ)はユーザー確認なしに行わない

## Stop Rule

Stop only when a final audit proves the full original outcome is complete.

Do not stop after planning, discovery, or Judge selection if a safe Worker task can be activated.

Do not stop after a single verified Worker package when the broader owner outcome still has safe local follow-up work.

Do not create one Worker/Judge pair per section. Put repeated same-shape work (multiple sections) into one Worker package and review the package as a whole.

## Slice Sizing

Safe means bounded, explicit, verified, and reversible. It does not mean tiny.

A good task is the largest safe useful slice: e.g. 「プロジェクト雛形+レイアウト+ヒーロー+ローディング演出」「中間セクション3つ+スクロールアニメーション」「フッター+SP対応+差分修正」。

Tiny tasks are bad when they keep happening, do not change behavior, or avoid the real milestone.

Do not stop because a slice needs owner input (実データ). Mark that slice blocked with a receipt, use `[要確認]` placeholders, and continue.

## Canonical Board

Machine truth lives at:

`docs/goals/kasumigaura-alumni-hp/state.yaml`

If this charter and `state.yaml` disagree, `state.yaml` wins.

## Run Command

```text
/goal Follow docs/goals/kasumigaura-alumni-hp/goal.md.
```

## PM Loop

On every `/goal` continuation:

1. Read this charter.
2. Read `state.yaml`.
3. Run the bundled GoalBuddy update checker when available and mention a newer version without blocking.
4. Re-check the intake: original request, input shape, authority, proof, blind spots, existing plan facts, and likely misfire.
5. Work only on the active board task.
6. Assign Scout, Judge, Worker, or PM according to the task.
7. Write a compact task receipt.
8. Update the board.
9. If safe local work remains, choose the next largest reversible Worker package and continue unless blocked.
10. If a problem, suggestion, or follow-up should become a repo artifact, ask the operator before creating external artifacts.
11. Review at phase, risk, rejected-verification, ambiguity, or final-completion boundaries; do not review every small Worker by habit.
12. Finish only with a Judge/PM audit receipt that maps receipts and verification back to the original user outcome and records `full_outcome_complete: true`.
