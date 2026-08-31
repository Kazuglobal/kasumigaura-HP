import { site } from '@/data/site'
import { footerLabels, footerNav } from '@/data/footer'
import { anchorHref } from '@/data/nav'
import { PageTopButton } from './page-top-button'
import styles from './footer.module.css'

/** Reference #siteFooter: beige, text logo + SNS (omitted when empty), fNav, copyright, school link. */
type Props = {
  /** Sub pages rewrite the home-page anchors to `/#...`. */
  isHome?: boolean
}

export function SiteFooter({ isHome = true }: Props = {}) {
  const year = new Date().getFullYear()
  return (
    <footer id="siteFooter" className={styles.footer}>
      <PageTopButton />
      <div className={`${styles.inner} containerS`}>
        <div className={styles.top}>
          <p className={styles.logo}>
            <a href={anchorHref('#', isHome)} className="hoverFade">
              <span className={styles.logoJp}>{site.name}</span>
              <span className={styles.logoEn}>{site.nameEnLong}</span>
            </a>
          </p>
          {site.sns.length > 0 && (
            <ul className={styles.snsList}>
              {site.sns.map((s) => (
                <li key={s.href}>
                  <a href={s.href} className="hoverFade" target="_blank" rel="noreferrer">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className={styles.bottom}>
          <nav id="fNav" className={styles.fNav} aria-label="フッターナビゲーション">
            <ul>
              {footerNav.map((item) => (
                <li key={item.href}>
                  <a href={anchorHref(item.href, isHome)}>{item.label}</a>
                </li>
              ))}
            </ul>
          </nav>
          <a href={site.officialSiteLink.href} className={`${styles.schoolLink} hoverFade`}>
            {site.officialSiteLink.label}
            <span className={styles.schoolNote}>{site.officialSiteLink.note}</span>
          </a>
        </div>
        <p id="copyright" className={styles.copyright}>
          {footerLabels.copyrightPrefix} {year} {site.name}
        </p>
      </div>
    </footer>
  )
}
