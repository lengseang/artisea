import type { Metadata } from 'next';
import Link from 'next/link';
import { Search, UserRound } from 'lucide-react';
import { EmptyState } from '@/components/shared/empty-state';
import { searchArticles, searchUsers } from '@/lib/api/search';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Search - Artisea',
  description: 'Search articles, authors, and topics on Artisea.',
};

export default async function SearchPage({
  searchParams,
}: Readonly<{ searchParams: Promise<{ q?: string }> }>) {
  const { q } = await searchParams;
  const query = q?.trim() ?? '';
  const [articles, users] = query
    ? await Promise.all([
        searchArticles({ q: query, limit: 10 }).then((res) => res.data).catch(() => []),
        searchUsers({ q: query, limit: 10 }).then((res) => res.data).catch(() => []),
      ])
    : [[], []];
  const totalResults = articles.length + users.length;

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-6">Search</h1>

        <form action="/search" method="GET" className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
            <input
              name="q"
              defaultValue={query}
              placeholder="Search articles, authors, topics..."
              className="w-full rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50 transition"
            />
          </div>
        </form>

        {!query ? (
          <EmptyState
            icon={Search}
            title="Start searching"
            description="Type a query above to find articles and authors."
          />
        ) : totalResults === 0 ? (
          <EmptyState
            icon={Search}
            title={`No results for "${query}"`}
            description="Try different keywords or check your spelling."
          />
        ) : (
          <div className="space-y-8">
            <p className="text-sm text-zinc-500">
              {totalResults} result{totalResults !== 1 && 's'} for &ldquo;{query}&rdquo;
            </p>

            {articles.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-500">
                  Articles
                </h2>
                {articles.map((article) => (
                  <Link
                    key={article.id}
                    href={`/article/${article.slug}`}
                    className="block rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors"
                  >
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-1">
                      {article.title}
                    </h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
                      {article.excerpt}
                    </p>
                    {article.author?.display_name && (
                      <p className="text-xs text-zinc-400 mt-2">
                        by {article.author.display_name}
                      </p>
                    )}
                  </Link>
                ))}
              </section>
            )}

            {users.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-500">
                  Authors
                </h2>
                {users.map((user) => (
                  <Link
                    key={user.id}
                    href={`/authors/${user.username}`}
                    className="flex items-center gap-3 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors"
                  >
                    <UserRound className="h-5 w-5 text-zinc-400" />
                    <div>
                      <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
                        {user.name}
                      </h3>
                      <p className="text-sm text-zinc-500">@{user.username}</p>
                    </div>
                  </Link>
                ))}
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
