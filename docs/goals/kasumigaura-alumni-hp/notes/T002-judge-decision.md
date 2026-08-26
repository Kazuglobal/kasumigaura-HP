# T002: Judge 決定 — 技術スタック・未解決事項・Worker パッケージ・コンテンツ計画

Task: `T002`
Kind: `judge`
Status: `current`

## Summary

T001 の解析(DOM / PM ブラウザ観察 / PC・SP スクショ)は相互に整合。スタックは **Next.js App Router + TS、グローバル CSS + CSS Modules(1rem=10px で数値をそのまま移植)、Swiper 11 React、GSAP は History パララックスのみ、リビールは IntersectionObserver、next/font Montserrat 600 + システム Yu Gothic スタック**に確定。§8 未解決事項を解決し、3 つの Worker パッケージ(T003 雛形〜ヒーロー〜バナー / T004 残りセクション + 残存語 grep / T005 差分修正 + site-brief)を定義。実在校の事実は捏造せず `[要確認]` をデータファイルに集約する。

## Decisions

```yaml
decisions:
  stack:
    framework: "Next.js (latest 16.x) App Router + TypeScript, src/ dir, alias @/*; reactStrictMode default (true)"
    css: >
      Global CSS (src/styles/globals.css: html{font-size:62.5%} 1rem=10px, CSS custom properties for tokens,
      body 1.5rem/500/ls .05em/lh 2/palt, body min-width:1200px above 767px) + CSS Modules per component.
      NOT Tailwind v4: reference values are rem/px/vw/% numerics which would become arbitrary-value soup;
      also avoids --color-base/text-base collision gotcha. No anime.js.
    tokens: "--c-primary #005099; --c-bg2 #F5F3EC; --c-primary-l1 #6696C2; --c-primary-l2 #4C84B8; --c-primary-l3 #B2CAE0; --c-rail #E2D7BF; --c-required #E4050B; --ov-white rgba(255,255,255,.8); --ov-head rgba(47,33,11,.3); --ease-out-cubic cubic-bezier(.33,1,.68,1); --dur-reveal 600ms; --stagger 300ms; --bp-sp 767px; radii 10/15/20/40px"
    fonts: >
      Montserrat 600 via next/font/google (variable --font-en; .enTitle/.pageTop/.btnCircle).
      Body = system Yu Gothic stack exactly as reference. Noto Sans JP NOT loaded.
      If next/font fetch fails at build (offline), fall back to a <link> Google Fonts stylesheet and record a deviation; do not stop.
    swiper: "swiper@11 swiper/react, modules Autoplay/Navigation/Scrollbar; all Swiper components 'use client'; CSS imported inside the client component"
    gsap: "gsap + @gsap/react useGSAP for History scrub parallax ONLY (C2). All reveals (C1) = IntersectionObserver + CSS transition. Page-top C4 = window.scrollTo smooth."
    responsive: "Single 767px breakpoint. useIsSp() matchMedia hook returning undefined until mount (SSR-safe, no reload)."
    hero_height: "CSS min(100svh, 825px) instead of JS innerHeight to avoid hydration mismatch"
  open_questions_resolved:
    q1_bread_mask: "Replace with border-radius 40px rounded rectangles (History img01/02/03, img04 SP); PAGETOP = 90px circle with white inner circle growing 0→83% on hover (E7); News scrollbar drag = 16px navy circle; headStyle02 icon = small navy circle."
    q2_omission_rules: >
      SNS: data-driven array in src/data/site.ts, default [] → list not rendered. Pasco-logo slot → text link 「霞ヶ浦高等学校 公式サイト」 href '#' [要確認 URL].
      YouTube: no ID → circular button reads 'VIEW PHOTOS' and opens the same fade modal (E10) with a placeholder photo grid; youtubeId in data switches to iframe.
      Banners: 6 internal banners (anchors only).
    q3_hero_placeholders: "public/placeholder/hero-intro.svg + hero-01..06.svg (navy/sky/beige gradients with faint wave shapes), lineup icons public/icons/card-01..06.svg (navy line icons), other placeholders same style. Catch copy rendered as HTML text. No image generation."
    q4_body_font: "System Yu Gothic stack. Documented in site-brief as a swap point."
  risks:
    - "Swiper SSR/hydration: keep Swiper in 'use client' components; render SP lineup Swiper only after mount."
    - "next/font offline build failure → <link> fallback; never skip build."
    - "React StrictMode double-run: useGSAP handles ScrollTrigger cleanup; IntersectionObserver hooks disconnect in cleanup; hover state via CSS classes not timers."
    - "min-width:1200px on PC: REPRODUCE; disabled under 767px."
    - "create-next-app may refuse a non-empty dir: prefer hand-written package.json + pnpm install (or scaffold in test-1/_scaffold then mv; no rm -rf)."
    - "Japanese text in Bash heredocs breaks on this host: Worker writes every file with Write/Edit tools."
    - "Home dir is git root: Worker never runs git add ., never commits."
    - "Residual-word grep includes パン which can false-positive (ジャパン): reword to avoid, keep grep at 0 lines."
    - "hover screenshots: puppeteer page.hover on lineup card 3 then wait 700ms; is-mini shot after scrollTo(0, 900)."
```

## Worker packages

```yaml
worker_packages:
  - id: T003
    objective: >
      In C:/Users/s1598/test-1 scaffold a Next.js App Router + TypeScript project (pnpm, src/, no Tailwind) and implement
      the first vertical slice with BOTH animation fidelity and alumni content:
      (1) design tokens + globals.css (1rem=10px, body typography, min-width 1200px PC, 767px breakpoint);
      (2) root layout with next/font Montserrat 600, #wrapper intro fade (opacity 0→1, 500ms linear, CSS keyframes);
      (3) fixed Header: white logo tab 140×120→90 on .is-mini (scrollY passes lineup top; 10px on SP),
      gNavWrapper 110→90px + bg→#F5F3EC + text white→black (.3s), 5 nav items with E3 dot hover, mega menu (900px,
      white, radius 20px, navy border, fixed top 90px, 6 items with 120px icon) on hover of item 3 (E4 .3s),
      SP hamburger 56px navy (E9: body.is-navOpen scroll lock, white 80% bg, gNavFadeIn .5s ease-out, bars→×);
      (4) Hero: min(100svh,825px), bg #F5F3EC, intro figure with text catch copy (width 31.25%, top 31.5%, left 11.7%),
      6 overlay items switched by PC hover / SP tap (B1/B2), wave SVG divider at bottom (own path);
      (5) lineup 6 cards (calc(16.6% - 8px), max 175px, radius 20px, icon 120px, name 1.4rem bold navy, 10px dot)
      with B3 hover on PC, Swiper slidesPerView auto / spaceBetween 10 / loop / prev-next on SP (B4);
      (6) reusable <FlowVox> reveal (IntersectionObserver, rootMargin bottom -20%/-30%, y60→0 + fade 600ms
      cubic-bezier(.33,1,.68,1), children stagger 300ms via transition-delay, once); (7) <WaveDivider> component;
      (8) banner Swiper D1 (6 internal banners ×2, 650px radius 15px, centered, loop, speed 1500, autoplay 3000, SP 1.4/15);
      (9) data files src/data/*.ts holding all copy from the content plan with [要確認] markers;
      (10) scripts/shots.mjs: puppeteer-core channel 'chrome', spawns `next start -p 3100`, captures PC 1440×900
      (hero, hover card 3, scrolled is-mini) and SP 390×844 (hero, nav open) into shots/, then exits.
    allowed_files:
      - "test-1/package.json, pnpm-lock.yaml, pnpm-workspace.yaml, .npmrc, .gitignore, next.config.ts, next-env.d.ts, tsconfig.json, eslint.config.mjs, README.md"
      - "test-1/src/**"
      - "test-1/public/**"
      - "test-1/scripts/shots.mjs"
      - "test-1/shots/**"
      - "test-1/docs/goals/kasumigaura-alumni-hp/notes/T003-*.md"
    verify:
      - "pnpm install"
      - "pnpm build   # exit 0"
      - "pnpm lint    # 0 errors"
      - "node scripts/shots.mjs   # shots/pc-hero.png pc-hover-card3.png pc-mini-header.png sp-hero.png sp-nav-open.png"
      - "grep -rniE 'pasco|パスコ|超熟|choujuku|敷島|食パン|レシピ|パン' src public | wc -l   # 0"
      - "grep -rn 'console.log' src | wc -l   # 0"
      - "grep -rn 'Lorem\\|lorem' src | wc -l   # 0"
    stop_if:
      - "Need files outside allowed_files or any path outside C:/Users/s1598/test-1."
      - "Behavior is ambiguous after reading notes/T001-* and T002 decision."
      - "pnpm build or shots.mjs fails twice after root-cause fixes."
      - "Any step would require rm -rf, git add ., git reset, or network resources beyond npm/Google Fonts."
  - id: T004
    objective: >
      Implement all remaining sections: About (large radius-40 placeholder photo + overlaid white text card left 90px width 45%,
      copyTxt 3rem, btnStyle01 pill with E1, FlowVox, ::after wave); History (right 510px text column, three radius-40 images
      552/128/252px absolutely placed, GSAP ScrollTrigger scrub y 100→-200 / 50→-50 / 100→-100, SP single image 0→-50, via useGSAP);
      News (beige band with top/bottom waves, Swiper D2 auto 320px cards radius 20, spaceBetween 40/20, 54px navy round prev/next E6,
      custom scrollbar 410px rail #E2D7BF drag 16px circle, E5 image scale 1.05, 「お知らせ一覧」button);
      Gallery (full-width placeholder, right 75% text, 152px white-ring circular button E2 → fade modal E10 with placeholder grid
      or YouTube iframe if id set); CTA banner (1000px radius 20 入会・会費・住所変更のご案内, round arrow, SP Swiper D4 1.5/centered);
      Contact section (事務局 [要確認], mailto placeholder); Footer (beige, logo 125px, SNS omitted when empty, fNav 1.3rem,
      © dynamic year, 90px circular PAGETOP with E7 hover and smooth scroll C4). Extend scripts/shots.mjs with full-page PC/SP and
      per-section captures after scrolling. Only additive changes to T003 components.
    allowed_files:
      - "test-1/src/**, public/**, scripts/shots.mjs, shots/**, package.json, pnpm-lock.yaml"
      - "test-1/docs/goals/kasumigaura-alumni-hp/notes/T004-*.md"
    verify:
      - "pnpm build && pnpm lint"
      - "node scripts/shots.mjs   # adds shots/pc-full.png sp-full.png pc-history.png pc-news.png pc-gallery-modal.png sp-footer.png"
      - "grep -rniE 'pasco|パスコ|超熟|choujuku|敷島|食パン|レシピ|パン|supporter' src public | wc -l   # 0"
      - "grep -rn 'console.log' src | wc -l   # 0"
      - "grep -rn 'Lorem\\|lorem' src | wc -l   # 0"
      - "grep -c '要確認' src/data/*.ts   # >0"
    stop_if:
      - "Need files outside allowed_files."
      - "Behavior is ambiguous (section order or copy not covered by content_plan)."
      - "Verification fails twice after root-cause fixes."
      - "GSAP scrub parallax cannot be made StrictMode-safe without removing ScrollTrigger (report instead of silently replacing)."
  - id: T005
    objective: >
      Compare shots/pc-full.png and sp-full.png (plus section shots) against notes/ref/ref-pc-full.jpg and ref-sp-full.jpg;
      fix layout, spacing (vw margins 20/31.25/14vw), wave heights, header timing, hover/reveal timing and easing differences;
      ensure PC 1440 and SP 390 have no overflow (SP scrollWidth === innerWidth). Write docs/site-brief.md: purpose, section map,
      full [要確認] replacement list, font/asset swap notes, run/verify commands. Regenerate shots.
    allowed_files:
      - "test-1/src/**, public/**, scripts/shots.mjs, shots/**, docs/site-brief.md"
      - "test-1/docs/goals/kasumigaura-alumni-hp/notes/T005-*.md"
    verify:
      - "pnpm build && pnpm lint"
      - "node scripts/shots.mjs   # asserts SP scrollWidth === 390 and PC header .is-mini after scroll"
      - "grep -rniE 'pasco|パスコ|超熟|choujuku|敷島|食パン|レシピ|パン|supporter' src public | wc -l   # 0"
      - "grep -c '要確認' docs/site-brief.md   # >= 10"
      - "grep -rn 'console.log' src | wc -l   # 0"
    stop_if:
      - "Need files outside allowed_files."
      - "Verification fails twice."
      - "A fidelity gap needs reference assets or copyrighted material to close (record as accepted difference)."
```

## Content plan

```yaml
content_plan:
  site_name: "霞ヶ浦高等学校同窓会"
  school: "霞ヶ浦高等学校(茨城県阿見町)"   # 住所詳細は [要確認]
  nav_pc:
    - { label: "同窓会について", href: "#about" }
    - { label: "沿革・歩み", href: "#history" }
    - { label: "年間行事", href: "#events", mega: true }
    - { label: "会報・お知らせ", href: "#news" }
    - { label: "ギャラリー", href: "#gallery" }
  mega_menu: ["定期総会", "懇親会・同期会", "支部会", "部活動 OB・OG 会", "会報発行", "新入会員歓迎会"]   # 日程は [要確認]
  header_right: { sns: [], official_site_link: { label: "霞ヶ浦高等学校 公式サイト", href: "#", note: "[要確認 URL]" } }
  hero:
    catch_copy: "つながる、ひろがる、霞ヶ浦。"      # PC 1 行 / SP 2 行
    sub: "霞ヶ浦高等学校同窓会 公式サイト"
    cards:
      - { title: "同窓会について", copy: "母校を想う心を、次の世代へ。", body: "会の目的・組織・会長挨拶をご紹介します。", href: "#about" }
      - { title: "年間行事", copy: "一年を通して、再会の場を。", body: "総会・懇親会・支部会などの予定([要確認])。", href: "#events" }
      - { title: "会報・お知らせ", copy: "母校と仲間の「いま」を届ける。", body: "会報最新号とお知らせの一覧。", href: "#news" }
      - { title: "会費・入会", copy: "同窓会を、いっしょに支える。", body: "入会方法・年会費([要確認])・住所変更のご案内。", href: "#join" }
      - { title: "母校紹介", copy: "霞ヶ浦のほとりで、今日も。", body: "学校の今の姿を写真と動画でご紹介。", href: "#gallery" }
      - { title: "お問い合わせ", copy: "ご質問・ご相談はこちらへ。", body: "事務局の連絡先([要確認])。", href: "#contact" }
  banners:
    - { title: "定期総会のご案内", sub: "開催日 [要確認]", href: "#events" }
    - { title: "会報 最新号", sub: "第[要確認]号 発行", href: "#news" }
    - { title: "入会・会費のご案内", sub: "年会費 [要確認]", href: "#join" }
    - { title: "住所変更のお届け", sub: "転居・改姓の際はこちら", href: "#join" }
    - { title: "寄付・協賛のお願い", sub: "母校の活動を支える", href: "#join" }
    - { title: "霞ヶ浦高等学校 公式サイト", sub: "[要確認 URL]", href: "#" }
  sections:
    - { id: about,   en: "About",   jp: "同窓会について", copy: "母校を想う心が、\n世代を越えてつながる。", body: "会長挨拶([要確認 会長名])・設立趣旨・組織。", button: "同窓会について" }
    - { id: history, en: "History", jp: "沿革・母校の歩み", copy: "霞ヶ浦の水辺から、\n未来へ続く歩み。", body: "創立 [要確認 年]・卒業生 [要確認 人数]・支部 [要確認 数]。", button: "沿革を見る" }
    - { id: events,  note: "メガメニューのアンカー先。年間行事は History 内の小見出しリスト(headStyle02)として配置し日程は [要確認]" }
    - { id: news,    en: "News",    jp: "会報・お知らせ", cards: "10 枚(日付 [要確認]、種別: 会報/お知らせ/行事報告、タイトル、「詳しく見る」)", button: "お知らせ一覧" }
    - { id: gallery, en: "Gallery", jp: "母校紹介・フォトギャラリー", circle_button: "VIEW PHOTOS(youtubeId 設定時 PLAY MOVIE)", button: "ギャラリーへ" }
    - { id: join,    type: cta_banner, title: "入会・会費・住所変更のご案内", sub: "年会費 [要確認] / お手続きは事務局まで", href: "#contact" }
    - { id: contact, en: "Contact", jp: "お問い合わせ", body: "霞ヶ浦高等学校同窓会 事務局 / 所在地 [要確認] / TEL [要確認] / Mail [要確認]" }
  footer:
    logo: "霞ヶ浦高等学校同窓会(テキストロゴ、Montserrat 副題 KASUMIGAURA ALUMNI ASSOCIATION)"
    nav: ["トップページ", "同窓会について", "沿革・歩み", "年間行事", "会報・お知らせ", "ギャラリー", "お問い合わせ"]
    sns: []
    copyright: "© {year} 霞ヶ浦高等学校同窓会"
    pagetop: "PAGETOP(90px 円形)"
  placeholder_rule: "実在情報(役員名・会員数・日程・会費・住所・電話・URL・SNS・動画ID)はすべて [要確認] を含む文字列にし、src/data/*.ts に集約。docs/site-brief.md(T005)で一覧化。"
```

## Board Receipt Snippet

```yaml
receipt:
  result: done
  decision: approved
  full_outcome_complete: false
  note: notes/T002-judge-decision.md
  rationale: "T001 の証拠は整合。スタック確定(Next.js + TS + global CSS/CSS Modules 1rem=10px + Swiper 11 + GSAP は parallax のみ + IO リビール)。§8 未解決を解決し、T003/T004/T005 を bounded・reversible・verified なパッケージとして定義。"
```
