'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  businessFilters,
  businessNote,
  businessSection,
  businesses,
  type Business,
} from '@/data/business'
import { initDirectory } from './directory'
import { initShots } from './shots'
import '@/styles/business.css'

/**
 * 卒業生事業・店舗紹介。1件1見開きの本として読ませる。
 *
 * HP-test（奥南会）の /business/ の移植。クラス名と `data-*` は移植元のまま置いて
 * ある。絞り込み・めくり・写真の切り替えは directory.js / shots.js が `data-*` を
 * たどって受け持つので、**属性名を変えると例外も出さずに黙って動かなくなる**
 * （契約の一覧は directory.js の冒頭を参照）。
 *
 * このコンポーネントは state を持たない。初期 DOM を一度描くだけで、以後の
 * hidden / data-book-active / 件数の書き換えはスクリプト側が行う。React が
 * 再描画しない限り、両者が同じノードを取り合うことはない。
 *
 * JS が無い環境でも9件すべてが素のマークアップとして読める（本のめくりは
 * 見せ方であって、内容の入れ物ではない）。カードをスクリプトで生成しないのは
 * そのため。
 */
export function BusinessDirectory() {
  const rootRef = useRef<HTMLDivElement>(null)
  const s = businessSection
  const total = businesses.length
  const first = businesses[0]
  const last = businesses[total - 1]
  const second = businesses[1 % total]

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const stopDirectory = initDirectory(root)
    const stopShots = initShots(root)
    return () => {
      stopDirectory()
      stopShots()
    }
  }, [])

  return (
    <div className="business-main" data-directory-root ref={rootRef}>
      <section className="business-directory" aria-labelledby="business-book-title">
        <div className="business-directory__inner">
          <header className="business-directory__header">
            <div className="business-directory__heading-copy">
              <p className="business-directory__eyebrow">{s.en}</p>
              <h1 className="business-directory__title" id="business-book-title">
                {s.jp}
              </h1>
            </div>
            <button
              className="business-filters__toggle"
              type="button"
              data-directory-toggle-details
              aria-controls="business-filter-panel"
              aria-expanded="false"
            >
              {s.filtersLabel}
            </button>
          </header>

          <div className="business-directory__masthead">
            <p className="business-directory__lead">
              {s.lead[0]}
              <br />
              {s.lead[1]}
            </p>
            <p className="business-directory__intro">{s.intro}</p>
            <p className="business-directory__apply">
              <Link className="business-directory__apply-link" href={s.applyHref}>
                {s.applyLabel}
              </Link>
            </p>
          </div>

          <form
            className="business-filters"
            id="business-filter-panel"
            data-directory-filters
            data-directory-detail-filters
          >
            <div className="business-filters__fields">
              {businessFilters.map((filter) => (
                <label className="business-filters__field" key={filter.key}>
                  <span>{filter.label}</span>
                  <select name={filter.key} data-filter-key={filter.key} defaultValue="">
                    <option value="">すべて</option>
                    {filter.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
              ))}
            </div>
            <button className="business-filters__reset" type="button" data-directory-reset>
              {s.resetLabel}
            </button>
          </form>

          <p className="business-directory__count" aria-live="polite">
            <span data-directory-count>{total}</span>件を表示
            <span className="business-directory__count-total">（全{total}件）</span>
          </p>

          <div className="business-book-stage">
            <button
              className="business-side-book business-side-book--previous"
              type="button"
              data-business-prev
              aria-label="前の店舗へ"
            >
              <span className="business-side-book__label">{s.prevLabel}</span>
              <span className="business-side-book__number" data-business-prev-number>
                {last.folio}
              </span>
              <span className="business-side-book__name" data-business-prev-name>
                {last.name}
              </span>
            </button>

            <div className="business-book">
              <span className="business-book__cover" aria-hidden="true" />
              <span className="business-book__leaves" aria-hidden="true" />
              <div className="business-directory__grid" aria-live="polite">
                {businesses.map((entry) => (
                  <BusinessCard
                    key={entry.slug}
                    entry={entry}
                    total={total}
                    isActive={entry === first}
                  />
                ))}
              </div>
              <span className="business-book__gutter" aria-hidden="true" />
            </div>

            <button
              className="business-side-book business-side-book--next"
              type="button"
              data-business-next
              aria-label="次の店舗へ"
            >
              <span className="business-side-book__label">{s.nextLabel}</span>
              <span className="business-side-book__number" data-business-next-number>
                {second.folio}
              </span>
              <span className="business-side-book__name" data-business-next-name>
                {second.name}
              </span>
            </button>
          </div>

          <nav className="business-book-nav" aria-label="店舗の切り替え">
            <button
              className="business-book-nav__button business-book-nav__button--previous"
              type="button"
              data-business-prev
            >
              {s.prevLabel}
            </button>
            <p className="business-book-nav__position">
              <span data-business-position>1</span> / <span data-business-total>{total}</span>
            </p>
            <button
              className="business-book-nav__button business-book-nav__button--next"
              type="button"
              data-business-next
            >
              {s.nextLabel}
            </button>
          </nav>

          <p className="business-directory__empty" data-directory-empty hidden>
            {s.emptyLabel}
          </p>

          <p className="business-directory__hint">{s.hint}</p>
          <p className="business-directory__note">{businessNote}</p>
        </div>
      </section>
    </div>
  )
}

/**
 * 見開き1枚。写真・割引・詳細の有無にかかわらず、
 * 丁付け・「掲載イメージ」の印・割引の印・本文2段は必ず揃える。
 */
function BusinessCard({
  entry,
  total,
  isActive,
}: {
  entry: Business
  total: number
  isActive: boolean
}) {
  const s = businessSection
  const folioTotal = String(total).padStart(2, '0')

  return (
    <article
      className="business-card"
      {...(isActive ? { 'data-book-active': 'true' } : null)}
      data-directory-card
      data-industry={entry.industry}
      data-category={entry.category}
      data-region={entry.region}
      data-club={entry.club}
      data-grad-year={entry.gradYear}
    >
      <p className="business-card__folio" aria-hidden="true">
        <span>{entry.folio}</span> / {folioTotal}
      </p>
      <figure
        className={
          entry.cover.kind === 'plate'
            ? 'business-card__figure business-card__figure--plate'
            : 'business-card__figure'
        }
      >
        {entry.cover.kind === 'photo' ? (
          // 主画像はスクリプトが src / alt を差し替える（shots.js）。next/image は
          // 自前のラッパを挟むので、差し替えとめくりの複製の邪魔になる。
          // eslint-disable-next-line @next/next/no-img-element
          <img
            data-card-photo
            src={entry.cover.src}
            alt={entry.cover.alt}
            width={1456}
            height={1092}
            decoding="async"
          />
        ) : (
          <p className="business-card__plate">
            <span className="business-card__plate-name">{entry.name}</span>
            <span className="business-card__plate-note">{entry.cover.note}</span>
          </p>
        )}
        <figcaption className="business-card__badge">{s.badge}</figcaption>
      </figure>
      <div className="business-card__body">
        {entry.shots.length > 0 ? (
          <ul className="business-card__shots" data-card-shots aria-label={s.shotsLabel}>
            {entry.shots.map((shot, index) => (
              <li className="business-card__shots-item" key={`${shot.src}-${index}`}>
                <button
                  className="business-card__shot"
                  type="button"
                  data-card-shot
                  data-shot-src={shot.src}
                  data-shot-alt={shot.alt}
                  {...(index === 0 ? { 'aria-current': 'true' as const } : null)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={shot.src}
                    alt={shot.alt}
                    width={480}
                    height={360}
                    loading="lazy"
                    decoding="async"
                  />
                </button>
              </li>
            ))}
          </ul>
        ) : null}
        <p className="business-card__meta">
          <span className="business-card__region">{entry.region}</span>
          <span className="business-card__type">
            {entry.industry} / {entry.category}
          </span>
          <span className="business-card__club">{entry.club}</span>
        </p>
        <h2 className="business-card__name">{entry.name}</h2>
        <p className="business-card__owner">
          <span className="business-card__owner-name">{entry.ownerName}</span>
          <span className="business-card__owner-details">{entry.ownerDetails}</span>
        </p>
        <blockquote className="business-card__quote">
          {entry.quote[0]}
          <br />
          {entry.quote[1]}
        </blockquote>
        <p className="business-card__summary">{entry.summary}</p>
        <div className="business-card__prose">
          <p>{entry.prose[0]}</p>
          <p>{entry.prose[1]}</p>
        </div>
        <p className="business-card__discount">
          <span className="business-card__discount-flag">{s.discountFlag}</span>
          <span className="business-card__discount-text">{entry.discount}</span>
        </p>
        <details className="business-card__detail" id={`business-detail-${entry.slug}`}>
          <summary aria-label="詳細を見る">{s.detailLabel}</summary>
          <p>{entry.detail}</p>
        </details>
      </div>
    </article>
  )
}
