import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { FlowVox } from '@/components/motion/flow-vox'
import { Header } from '@/components/layout/header'
import { SiteFooter } from '@/components/layout/site-footer'
import { OpenedFocus } from '@/components/stories/opened-focus'
import styles from '@/components/stories/stories.module.css'
import { site } from '@/data/site'
import { placeholderNote, stories, storiesSection, storyBySlug, storyNumber } from '@/data/stories'

type Params = { slug: string }

export function generateStaticParams(): Params[] {
  return stories.map((story) => ({ slug: story.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const story = storyBySlug((await params).slug)
  if (!story) return { title: site.name }
  return {
    title: `${story.name}｜${storiesSection.jp} | ${site.name}`,
    description: `${story.role}／${story.field}。${story.quote}`,
  }
}

/**
 * The article a book opens into. The order — portrait, name, role, quote — is the same as the
 * spread drawn on the book, so the page reads as the book carried on rather than a new screen.
 */
export default async function StoryPage({ params }: { params: Promise<Params> }) {
  const story = storyBySlug((await params).slug)
  if (!story) notFound()

  return (
    <>
      <Header />
      <div id="container">
        <main id="main" className={styles.detail}>
          <OpenedFocus slug={story.slug} target="story-title" />
          <p className={styles.crumbs}>
            <Link href="/stories">{storiesSection.jp}</Link> ／ {story.name}
          </p>
          <FlowVox className={styles.inner} as="article">
            <div className={styles.spread}>
              <div>
                <div className={styles.portrait}>
                  <Image
                    src={story.photo}
                    alt={`${story.name}さんの写真 [要確認 写真]`}
                    fill
                    sizes="(max-width: 767px) 100vw, 380px"
                    unoptimized
                  />
                </div>
                <dl className={styles.meta}>
                  <div>
                    <dt>卒業期</dt>
                    <dd>{story.term}</dd>
                  </div>
                  <div>
                    <dt>在学中の部活動</dt>
                    <dd>{story.club}</dd>
                  </div>
                  <div>
                    <dt>分野</dt>
                    <dd>{story.field}</dd>
                  </div>
                </dl>
              </div>
              <div>
                <p className={styles.detailNo}>No.{storyNumber(story)}</p>
                <h1 id="story-title" className={styles.detailName} tabIndex={-1}>
                  {story.name}
                </h1>
                <p className={styles.detailKana}>{story.kana}</p>
                <p className={styles.detailRole}>{story.role}</p>
                <blockquote className={styles.detailQuote}>「{story.quote}」</blockquote>
                <div className={styles.detailBody}>
                  {story.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>
            <p className={styles.note}>{placeholderNote}</p>
            <p className={`btnStyle01 ${styles.detailFoot}`}>
              <Link href="/stories">{storiesSection.backLabel}</Link>
            </p>
          </FlowVox>
        </main>
        <SiteFooter isHome={false} />
      </div>
    </>
  )
}
