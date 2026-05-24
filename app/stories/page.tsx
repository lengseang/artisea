import Link from 'next/link';
import { ArticleCard } from '@/components/article/article-card';
import { SocialLayout } from '@/components/layout/social-layout';
import { getArticles } from '@/lib/api/articles';
import { cn } from '@/lib/utils';

export const dynamic = 'force-dynamic';

const STORY_TABS = [
  { feed: 'latest', label: 'Latest' },
  { feed: 'trending', label: 'Trending' },
  { feed: 'featured', label: 'Featured' },
];

export default async function StoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ feed?: string }>;
}) {
  const { feed = 'latest' } = await searchParams;
  const articles = await getArticles({
    sort: feed === 'latest' ? 'latest' : 'popular',
    limit: 20,
  })
    .then((response) => response.data)
    .catch(() => []);

  return (
    <SocialLayout>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <section className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
            Stories
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Explore deep-dives, creative essays, and technical insights.
          </p>
        </section>

        <div className="flex items-center gap-2 mb-8 border-b border-border/40 pb-px">
          {STORY_TABS.map(({ feed: itemFeed, label }) => (
            <Link
              key={itemFeed}
              href={`/stories?feed=${itemFeed}`}
              className={cn(
                'h-9 px-2 sm:px-4 text-sm transition-colors',
                feed === itemFeed
                  ? 'font-semibold text-foreground border-b-2 border-foreground rounded-none text-zinc-900 dark:text-zinc-50'
                  : 'text-muted-foreground font-medium hover:text-foreground'
              )}
            >
              {label}
            </Link>
          ))}
        </div>

        <section className="flex flex-col">
          {articles.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              No stories returned by the API.
            </div>
          ) : (
            articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))
          )}
        </section>
      </div>
    </SocialLayout>
  );
}
