import type { Metadata } from 'next';
import { Roboto_Serif } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/navbar';
import { Providers } from '@/components/providers/providers';

const robotoSerif = Roboto_Serif({
  subsets: ['latin'],
  variable: '--font-roboto-serif',
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Artisea – Discover & Connect',
  description:
    'A social digital publishing platform where curious minds share thoughtful stories and build communities.',
  keywords: ['writing', 'publishing', 'social media', 'stories', 'community'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${robotoSerif.variable} font-sans antialiased bg-zinc-50 dark:bg-zinc-950`}
      >
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}

