import type { Metadata } from 'next';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { EmptyState } from '@/components/shared/empty-state';

export const metadata: Metadata = {
  title: 'Search – Artisea',
  description: 'Search articles, authors, and topics on Artisea.',
};

const MOCK_RESULTS = [
  { id: '1', type: 'article' as const, title: 'The Future of Collaborative Writing', slug: 'future-of-collaborative-writing', excerpt: 'How modern tools are reshaping the way writers work together.', author: 'Jane Smith' },
  { id: '2', type: 'article' as const, title: 'On Craft: Finding Your Voice', slug: 'on-craft-finding-your-voice', excerpt: 'Practical exercises to discover what makes your writing unique.', author: 'Alex Johnson' },
];

export default async function SearchPage({ searchParams }: Readonly<{ searchParams: Promise<{ q?: string }> }>) {
  const { q } = await searchParams;
  const query = q ?? '';
  const results = query ? MOCK_RESULTS.filter((r) => r.title.toLowerCase().includes(query.toLowerCase())) : [];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-6">Search</h1>

        {/* Search form */}
        <form action="/search" method="GET" className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
            <input name="q" defaultValue={query} placeholder="Search articles, authors, topics…"
              className="w-full rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50 transition" />
          </div>
        </form>

        {/* Results */}
        {!query ? (
          <EmptyState icon={Search} title="Start searching" description="Type a query above to find articles and authors." />
        ) : results.length === 0 ? (
          <EmptyState icon={Search} title={`No results for "${query}"`} description="Try different keywords or check your spelling." />
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-zinc-500">{results.length} result{results.length !== 1 && 's'} for &ldquo;{query}&rdquo;</p>
            {results.map((r) => (
              <Link key={r.id} href={`/article/${r.slug}`} className="block rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-1">{r.title}</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">{r.excerpt}</p>
                <p className="text-xs text-zinc-400 mt-2">by {r.author}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
