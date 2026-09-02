import { Header } from '@/components/layout/header'
import { Hero } from '@/components/hero/hero'
import { BannerSection } from '@/components/banner/banner-section'
import { AboutSection } from '@/components/sections/about-section'
import { HistorySection } from '@/components/sections/history-section'
import { NewsSection } from '@/components/sections/news-section'
import { GallerySection } from '@/components/sections/gallery-section'
import { StoriesHome } from '@/components/stories/stories-home'
import { BusinessHome } from '@/components/business/business-home'
import { JoinSection } from '@/components/sections/join-section'
import { ContactSection } from '@/components/sections/contact-section'
import { SiteFooter } from '@/components/layout/site-footer'

export default function HomePage() {
  return (
    <>
      <Header />
      <div id="container">
        <main id="main">
          <Hero />
          <BannerSection />
          <AboutSection />
          <HistorySection />
          <NewsSection />
          <GallerySection />
          <StoriesHome />
          <BusinessHome />
        </main>
        <div className="bnrArea">
          <JoinSection />
          <ContactSection />
        </div>
        <SiteFooter />
      </div>
    </>
  )
}
