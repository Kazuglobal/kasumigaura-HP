import Image from 'next/image'
import type { MouseEvent } from 'react'
import type { HeroCard } from '@/data/hero'
import styles from './lineup.module.css'

const ICON_SIZE = 120

type Props = {
  card: HeroCard
  isActive: boolean
  onMouseEnter?: () => void
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void
}

export function LineupCard({ card, isActive, onMouseEnter, onClick }: Props) {
  const cls = [styles.card, isActive ? styles.isActive : ''].filter(Boolean).join(' ')
  return (
    <a href={card.href} className={cls} onMouseEnter={onMouseEnter} onClick={onClick}>
      <span className={styles.cInner}>
        <span className={styles.icon}>
          <Image src={card.icon} alt="" width={ICON_SIZE} height={ICON_SIZE} unoptimized />
        </span>
        <span className={styles.name}>{card.title}</span>
      </span>
    </a>
  )
}
