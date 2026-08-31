import Image from 'next/image'
import { anchorHref, navPc, megaMenuNote, type NavItem } from '@/data/nav'
import styles from './header.module.css'

type Props = {
  onNavigate: () => void
  /** Off the home page the `#` targets do not exist, so they are rewritten to `/#...`. */
  isHome: boolean
}

const MEGA_ICON_SIZE = 120

function MegaMenu({ item, onNavigate, isHome }: { item: NavItem; onNavigate: () => void; isHome: boolean }) {
  if (!item.mega) return null
  return (
    <div className={styles.sub}>
      <ul className={styles.subList}>
        {item.mega.map((m) => (
          <li key={m.label}>
            <a href={anchorHref(m.href, isHome)} className={`${styles.subItem} hoverFade`} onClick={onNavigate}>
              <Image src={m.icon} alt="" width={MEGA_ICON_SIZE} height={MEGA_ICON_SIZE} unoptimized />
              <span>{m.label}</span>
            </a>
          </li>
        ))}
      </ul>
      <p className={styles.subNote}>{megaMenuNote}</p>
    </div>
  )
}

/** E3 dot hover on top-level items, E4 mega menu fade on the 3rd item. */
export function GlobalNav({ onNavigate, isHome }: Props) {
  return (
    <nav id="gNav" className={styles.nav} aria-label="Global">
      <ul className={styles.navList}>
        {navPc.map((item) => (
          <li key={item.href} className={item.mega ? styles.hasSub : undefined}>
            <a href={anchorHref(item.href, isHome)} className={styles.navLink} onClick={onNavigate}>
              {item.label}
            </a>
            <MegaMenu item={item} onNavigate={onNavigate} isHome={isHome} />
          </li>
        ))}
      </ul>
    </nav>
  )
}
