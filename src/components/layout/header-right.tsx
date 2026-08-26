import Image from 'next/image'
import { site } from '@/data/site'
import styles from './header.module.css'

const SNS_ICON_SIZE = 24

/** SNS list is data-driven and omitted entirely when empty (T002 q2). */
export function HeaderRight() {
  const { sns, officialSiteLink } = site
  return (
    <div className={styles.right}>
      {sns.length > 0 && (
        <ul className={styles.snsList}>
          {sns.map((s) => (
            <li key={s.href}>
              <a href={s.href} className="hoverFade" aria-label={s.label} target="_blank" rel="noreferrer">
                <Image src={s.icon} alt="" width={SNS_ICON_SIZE} height={SNS_ICON_SIZE} unoptimized />
              </a>
            </li>
          ))}
        </ul>
      )}
      <a href={officialSiteLink.href} className={`${styles.official} hoverFade`}>
        {officialSiteLink.label}
      </a>
    </div>
  )
}
