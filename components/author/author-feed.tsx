import { AuthorCard } from '@/components/author/author-card';
import { AuthorCardSkeleton } from '@/components/ui/skeleton';
import { getAuthors } from '@/lib/api/authors';
import type { Author } from '@/types/author';

interface AuthorFeedProps {
  feedType: string;
}

function toAuthorParams(feedType: string) {
  return {
    q: '',
    limit: 20,
    sort: feedType === 'featured' ? ('popular' as const) : ('latest' as const),
  };
}

export async function AuthorFeed({ feedType }: Readonly<AuthorFeedProps>) {
  let authors: Author[] = [];
  let errorMessage: string | null = null;

  try {
    const response = await getAuthors(toAuthorParams(feedType));
    authors = response.data;
  } catch (error) {
    errorMessage =
      error instanceof Error ? error.message : 'Unable to load authors from the API.';
  }

  if (errorMessage) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-300">
        {errorMessage}
      </div>
    );
  }

  if (authors.length === 0) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        No authors found for &ldquo;{feedType}&rdquo;.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-0">
      {authors.map((author) => (
        <AuthorCard key={author.id} author={author} />
      ))}
    </div>
  );
}

export function AuthorFeedSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-0">
      {Array.from({ length: 3 }).map((_, i) => (
        <AuthorCardSkeleton key={i} />
      ))}
    </div>
  );
}
