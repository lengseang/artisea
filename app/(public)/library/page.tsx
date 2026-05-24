import type { Metadata } from 'next';
import Link from 'next/link';
import { Bookmark } from 'lucide-react';
import { EmptyState } from '@/components/shared/empty-state';
import { PageHeader } from '@/components/shared/page-header';
import { getArticles } from '@/lib/api/articles';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Library - Artisea',
  description: 'Your personal collection of saved articles.',
};

export default async function LibraryPage() {
  const articles = await getArticles({ sort: 'latest', limit: 12 })
    .then((response) => response.data)
    .catch(() => []);

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <PageHeader
          title="Library"
          description="Saved-article listing is not exposed by the finalized API, so this view uses the article feed until that endpoint exists."
        />

        {articles.length === 0 ? (
          <EmptyState
            icon={Bookmark}
            title="No articles available"
            description="Articles returned by the API will appear here."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((item) => (
              <Link
                key={item.id}
                href={`/article/${item.slug}`}
                className="group block rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden hover:shadow-lg transition-all"
              >
                {item.cover_image && (
                  <img
                    src={item.cover_image}
                    alt={item.title}
                    className="w-full h-40 object-cover"
                    loading="lazy"
                  />
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-zinc-500">
                    {item.author?.display_name ?? 'Unknown author'}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
