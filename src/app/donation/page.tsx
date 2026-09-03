import type { Metadata } from 'next'
import { Header } from '@/components/layout/header'
import { SiteFooter } from '@/components/layout/site-footer'
import { DonationSection } from '@/components/donation/donation-section'
import { site } from '@/data/site'
import { donationData } from '@/data/donation'

export const metadata: Metadata = {
  title: `${donationData.heading.jp} | ${site.name}`,
  description: '霞ヶ浦高等学校同窓会 寄付・協賛金のお願いです。母校の教育環境充実や全国で活躍する生徒・部活動への支援にご協力をお願いいたします。',
}

export default function DonationPage() {
  return (
    <>
      <Header />
      <div id="container">
        <main id="main">
          <DonationSection />
        </main>
        <SiteFooter isHome={false} />
      </div>
    </>
  )
}
