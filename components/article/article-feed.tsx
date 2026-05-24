import { ArticleCard } from './article-card';
import { ArticleCardSkeleton } from '@/components/ui/skeleton';
import { getArticles } from '@/lib/api/articles';
import type { Article } from '@/types/article';

interface ArticleFeedProps {
  feedType: string;
}

function toArticleParams(feedType: string) {
  if (feedType === 'new') return { sort: 'latest' as const, limit: 20 };
  if (feedType === 'top') return { sort: 'popular' as const, limit: 20 };
  return { sort: 'popular' as const, limit: 20 };
}

export async function ArticleFeed({ feedType }: Readonly<ArticleFeedProps>) {
  let articles: Article[] = [];
  let errorMessage: string | null = null;

  try {
    const response = await getArticles(toArticleParams(feedType));
    articles = response.data;
  } catch (error) {
    errorMessage =
      error instanceof Error ? error.message : 'Unable to load articles from the API.';
  }

  if (errorMessage) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-300">
        {errorMessage}
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        No articles found for &ldquo;{feedType}&rdquo;.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-0">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}

export function ArticleFeedSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-0">
      {Array.from({ length: 3 }).map((_, i) => (
        <ArticleCardSkeleton key={i} />
      ))}
    </div>
  );
}
