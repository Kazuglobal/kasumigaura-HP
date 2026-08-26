'use client'

import { heroCards } from '@/data/hero'
import { useIsSp } from '@/hooks/use-is-sp'
import { LineupCard } from './lineup-card'
import { LineupSwiper } from './lineup-swiper'
import styles from './lineup.module.css'

type Props = {
  active: number | null
  onEnter: (index: number) => void
  onToggle: (index: number) => void
}

/**
 * B3 lineup cards. PC: static row, mouseenter activates the hero item.
 * SP: Swiper (B4) rendered only after mount; tap toggles the hero item.
 */
export function Lineup({ active, onEnter, onToggle }: Props) {
  const isSp = useIsSp()

  if (isSp) {
    return (
      <div id="js-lineupList" className={`${styles.lineup} ${styles.lineupSp}`}>
        <LineupSwiper active={active} onToggle={onToggle} />
      </div>
    )
  }

  return (
    <div id="js-lineupList" className={`${styles.lineup} ${styles.lineupPc}`}>
      <ul className={styles.list}>
        {heroCards.map((card, index) => (
          <li key={card.id} className={styles.slide}>
            <LineupCard
              card={card}
              isActive={active === index}
              onMouseEnter={() => onEnter(index)}
              onClick={(event) => {
                event.preventDefault()
                onToggle(index)
              }}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}
