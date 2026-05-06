import type { Metadata } from 'next';
import { Suspense } from 'react';
import { AuthorFeed, AuthorFeedSkeleton } from '@/components/author/author-feed';
import { AuthorNavigation } from '@/components/author/author-navigation';

export const metadata: Metadata = {
  title: 'Authors – Artisea',
  description: 'Explore our talented community of writers on Artisea.',
};

import { SocialLayout } from '@/components/layout/social-layout';

export default async function AuthorsPage({
  searchParams,
}: Readonly<{ searchParams: Promise<{ feed?: string }> }>) {
  const { feed } = await searchParams;
  const currentFeed = feed || 'featured';

  return (
    <SocialLayout>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Header */}
        <section className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
            Authors
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Explore our talented community of writers and storytellers.
          </p>
        </section>

        {/* Feed Tabs */}
        <Suspense>
          <AuthorNavigation />
        </Suspense>

        {/* Author Grid */}
        <Suspense fallback={<AuthorFeedSkeleton />}>
          <AuthorFeed feedType={currentFeed} />
        </Suspense>
      </div>
    </SocialLayout>
  );
}

