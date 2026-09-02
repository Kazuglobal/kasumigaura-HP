import Link from 'next/link'
import { FlowVox } from '@/components/motion/flow-vox'
import { SectionHead } from '@/components/sections/section-head'
import { placeholderNote, storiesSection } from '@/data/stories'
import { BookShelf } from './book-shelf'
import styles from './stories.module.css'

/**
 * トップの卒業生紹介。/stories と同じ本棚をそのまま置き、一覧は載せない
 * （一覧まで出すとトップが卒業生紹介のページになる）。背表紙を選べばその人の
 * 記事へ直行し、選ばなければ下のボタンから一覧へ進む。
 *
 * 本棚は WebGL が無い・prefers-reduced-motion・ハッシュ付きで開いた場合には
 * 何も描かず高さも取らない。そのときは見出しとボタンだけが残る。
 */
export function StoriesHome() {
  const s = storiesSection
  return (
    <section id={s.id} className={styles.homeSection} aria-labelledby="stories-home-title">
      <FlowVox className={styles.inner}>
        <SectionHead en={s.en} jp={s.jp} id="stories-home-title" />
        <p className={styles.lead}>
          {s.lead.map((line) => (
            <span key={line} className={styles.leadLine}>
              {line}
            </span>
          ))}
        </p>
        <BookShelf />
        <p className={`btnStyle01 ${styles.homeBtn}`}>
          <Link href={s.buttonHref}>{s.button}</Link>
        </p>
        <p className={styles.note}>{placeholderNote}</p>
      </FlowVox>
    </section>
  )
}
