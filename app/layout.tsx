import type { Metadata } from 'next'
import { Sintony} from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/layout/navbar'

const sintony = Sintony({ 
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-sintony', 
})

export const metadata: Metadata = {
  title: 'Artisea – Thoughtful Writing',
  description: 'Discover and share thoughtful stories from a community of curious minds.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${sintony.className} antialiased bg-zinc-50 dark:bg-zinc-950`}>
        <Navbar />
        <main className='container mx-auto p4 md:p-8'>
          {children}  
        </main>
      </body>
    </html>
  )
}
