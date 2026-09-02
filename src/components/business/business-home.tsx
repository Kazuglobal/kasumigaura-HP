import Image from 'next/image'
import Link from 'next/link'
import { FlowVox } from '@/components/motion/flow-vox'
import { SectionHead } from '@/components/sections/section-head'
import {
  businessHome,
  businessNote,
  businessSection,
  businesses,
  homeBusinesses,
  type Business,
} from '@/data/business'
import styles from './business-home.module.css'

/**
 * トップの卒業生事業・店舗紹介。/business の記念誌そのもの（紙のめくり・絞り込み）は
 * 持ち込まず、丁付けを残した抜粋3件だけを置く。めくりは読み物のための仕掛けで、
 * トップに要るのは「こういうページがある」と分かることだから。
 */
export function BusinessHome() {
  const s = businessHome
  return (
    <section id={s.id} className={styles.section} aria-labelledby="business-home-title">
      <FlowVox className={styles.inner}>
        <SectionHead en={s.en} jp={s.jp} id="business-home-title" />
        <p className={styles.lead}>
          {s.lead.map((line) => (
            <span key={line} className={styles.leadLine}>
              {line}
            </span>
          ))}
        </p>
        <p className={styles.intro}>{s.intro}</p>
        <p className={styles.pick}>
          {s.pickLabel}
          <span className={styles.pickCount}>（全{businesses.length}件）</span>
        </p>
        <ul className={styles.cards}>
          {homeBusinesses.map((entry) => (
            <li key={entry.slug}>
              <BusinessPick entry={entry} />
            </li>
          ))}
        </ul>
        <p className={`btnStyle01 ${styles.btn}`}>
          <Link href={businessSection.buttonHref}>{businessSection.button}</Link>
        </p>
        <p className={styles.note}>{businessNote}</p>
      </FlowVox>
    </section>
  )
}

function BusinessPick({ entry }: { entry: Business }) {
  const s = businessSection
  return (
    <Link href={s.buttonHref} className={styles.card}>
      <span className={styles.figure}>
        {entry.cover.kind === 'photo' ? (
          <Image
            src={entry.cover.src}
            alt={entry.cover.alt}
            fill
            sizes="(max-width: 767px) 100vw, 360px"
            unoptimized
          />
        ) : (
          <span className={styles.plate}>{entry.name}</span>
        )}
        <span className={styles.badge}>{s.badge}</span>
      </span>
      <span className={styles.folio}>{entry.folio}</span>
      <span className={styles.meta}>
        {entry.region}／{entry.industry}
      </span>
      <span className={styles.name}>{entry.name}</span>
      <span className={styles.owner}>
        {entry.ownerName}（{entry.club}）
      </span>
      <span className={styles.quote}>
        {entry.quote.map((line) => (
          <span key={line} className={styles.quoteLine}>
            {line}
          </span>
        ))}
      </span>
      <span className={styles.discount}>{s.discountFlag}</span>
    </Link>
  )
}
