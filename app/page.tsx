import type { Metadata } from 'next'
import { Suspense } from 'react'
import { ArticleFeed } from '@/components/article/ArticleFeed'
import { ArticleNavigation } from '@/components/article/ArticleNavigation'

export const metadata: Metadata = {
  title: 'Artisea – Discover Stories',
  description: 'Discover featured articles from our community of writers.',
}

export default async function HomePage({
  searchParams,
}: Readonly<{ searchParams: Promise<{ feed?: string }> }>) {
  const { feed } = await searchParams
  const currentFeed = feed || 'featured'

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors duration-200">
      <main className="mx-auto max-w-5xl py-12 px-4 sm:px-6 lg:px-8">

        {/* Hero */}
        <section className="mb-12 text-center">
          <h1 className="font-serif text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
            Discover Stories
          </h1>
          <p className="text-lg text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
            Thoughtful writing from a community of curious minds.
          </p>
        </section>

        {/* Feed Tabs */}
        <Suspense>
          <ArticleNavigation />
        </Suspense>

        {/* Article Grid */}
        <Suspense
          fallback={
            <div className="py-12 text-center text-zinc-400 dark:text-zinc-600">
              Loading articles…
            </div>
          }
        >
          <ArticleFeed feedType={currentFeed} />
        </Suspense>
    
      </main>
    </div>
  )
}
