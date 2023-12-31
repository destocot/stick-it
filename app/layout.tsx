import './globals.css'
import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'

export const dynamic = 'force-dynamic'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
})

export const metadata: Metadata = {
  title: 'Stick-It! | Have Something To Say',
  description: 'he user-friendly app that turns your digital canvas into a creative corkboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`()`}>
      <body className={`${poppins.className} from-light-two bg-gradient-to-t to-light-one dark:from-dark-two dark:to-dark-one dark:bg-gradient-to-t dark:text-dark-four `}>
        {children}
      </body>
    </html>
  )
}
