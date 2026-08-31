import Image from 'next/image'
import Link from 'next/link'
import { FlowVox } from '@/components/motion/flow-vox'
import { SectionHead } from '@/components/sections/section-head'
import { placeholderNote, stories, storiesSection, storyNumber } from '@/data/stories'
import { BookShelf } from './book-shelf'
import styles from './stories.module.css'

/** 卒業生紹介: the 3D shelf sits above the list it leads into, never in front of it. */
export function StoriesSection() {
  const s = storiesSection
  return (
    <section id={s.id} className={styles.section} aria-labelledby="stories-title">
      <FlowVox className={styles.inner}>
        <SectionHead en={s.en} jp={s.jp} id="stories-title" />
        <p className={styles.lead}>
          {s.lead.map((line) => (
            <span key={line} className={styles.leadLine}>
              {line}
            </span>
          ))}
        </p>
        <BookShelf />
        <h3 className={styles.listHead}>{s.listLabel}</h3>
        <ul className={styles.cards}>
          {stories.map((story) => (
            <li key={story.slug}>
              <Link href={`/stories/${story.slug}`} className={styles.card}>
                <span className={styles.thumb}>
                  <Image
                    src={story.photo}
                    alt={`${story.name}さんの写真 [要確認 写真]`}
                    fill
                    sizes="(max-width: 767px) 100vw, 360px"
                    unoptimized
                  />
                </span>
                <span className={styles.no}>No.{storyNumber(story)}</span>
                <span className={styles.name}>{story.name}</span>
                <span className={styles.role}>
                  {story.role}／{story.field}
                </span>
                <span className={styles.quote}>「{story.quote}」</span>
              </Link>
            </li>
          ))}
        </ul>
        <p className={styles.note}>{placeholderNote}</p>
      </FlowVox>
    </section>
  )
}
