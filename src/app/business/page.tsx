import type { Metadata } from 'next'
import { Noto_Serif_JP } from 'next/font/google'
import { Header } from '@/components/layout/header'
import { SiteFooter } from '@/components/layout/site-footer'
import { BusinessDirectory } from '@/components/business/business-directory'
import { site } from '@/data/site'
import { businessSection } from '@/data/business'

/**
 * 記念誌の面は明朝で組む。business.css の `--okn-serif` がこの変数を先頭に持つので、
 * 読み込みに失敗しても Yu Mincho 以降へ素直に落ちる。
 */
const notoSerifJp = Noto_Serif_JP({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  variable: '--font-serif-jp',
  display: 'swap',
})

export const metadata: Metadata = {
  title: `${businessSection.jp} | ${site.name}`,
  description: businessSection.intro,
}

export default function BusinessPage() {
  return (
    <>
      <Header />
      <div id="container" className={notoSerifJp.variable}>
        <main id="main">
          <BusinessDirectory />
        </main>
        <SiteFooter isHome={false} />
      </div>
    </>
  )
}
