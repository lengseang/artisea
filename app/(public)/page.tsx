import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ArticleFeed, ArticleFeedSkeleton } from '@/components/article/article-feed';
import { ArticleNavigation } from '@/components/article/article-navigation';
import { SocialLayout } from '@/components/layout/social-layout';

export const metadata: Metadata = {
  title: 'Artisea – Discover Stories',
  description: 'Discover featured articles from our community of writers.',
};

export default async function HomePage({
  searchParams,
}: Readonly<{ searchParams: Promise<{ feed?: string }> }>) {
  const { feed } = await searchParams;
  const currentFeed = feed || 'best';

  return (
    <SocialLayout>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Header/Greeting */}
        <section className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
            Welcome to Artisea
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Thoughtful writing from a community of curious minds.
          </p>
        </section>

        {/* Feed Tabs */}
        <Suspense>
          <ArticleNavigation />
        </Suspense>

        {/* Article Grid */}
        <Suspense fallback={<ArticleFeedSkeleton />}>
          <ArticleFeed feedType={currentFeed} />
        </Suspense>
      </div>
    </SocialLayout>
  );
}
