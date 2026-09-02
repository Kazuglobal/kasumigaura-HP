import type { Metadata } from 'next'
import { Header } from '@/components/layout/header'
import { SiteFooter } from '@/components/layout/site-footer'
import { StoriesSection } from '@/components/stories/stories-section'
import { site } from '@/data/site'
import { storiesSection } from '@/data/stories'

export const metadata: Metadata = {
  title: `${storiesSection.jp} | ${site.name}`,
  description: storiesSection.lead.join(''),
}

export default function StoriesPage() {
  return (
    <>
      <Header />
      <div id="container">
        <main id="main">
          <StoriesSection />
        </main>
        <SiteFooter isHome={false} />
      </div>
    </>
  )
}
