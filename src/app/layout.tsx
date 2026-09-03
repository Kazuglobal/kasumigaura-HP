import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Montserrat } from 'next/font/google'
import { site } from '@/data/site'
import { Chatbot } from '@/components/chatbot/chatbot'
import '@/styles/globals.css'

const montserrat = Montserrat({
  weight: '600',
  subsets: ['latin'],
  variable: '--font-en',
  display: 'swap',
})

export const metadata: Metadata = {
  title: site.name,
  description: site.description,
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja" className={montserrat.variable}>
      <body className="home">
        <div id="wrapper">
          {children}
          <Chatbot />
        </div>
      </body>
    </html>
  )
}
