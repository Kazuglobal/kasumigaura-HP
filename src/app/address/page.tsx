import type { Metadata } from 'next'
import { Header } from '@/components/layout/header'
import { SiteFooter } from '@/components/layout/site-footer'
import { AddressSection } from '@/components/address/address-section'
import { site } from '@/data/site'

export const metadata: Metadata = {
  title: `住所変更のお届け | ${site.name}`,
  description: '霞ヶ浦高等学校同窓会 会員住所・ご連絡先変更のお届けフォームです。ご転居や改姓の際はお手続きをお願いいたします。',
}

export default function AddressPage() {
  return (
    <>
      <Header />
      <div id="container">
        <main id="main">
          <AddressSection />
        </main>
        <SiteFooter isHome={false} />
      </div>
    </>
  )
}
