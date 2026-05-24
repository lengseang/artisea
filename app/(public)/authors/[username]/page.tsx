import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { FollowButton } from '@/components/shared/follow-button';
import { Badge } from '@/components/ui/badge';
import { getAuthorArticles, getAuthorByUsername } from '@/lib/api/authors';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  const author = await getAuthorByUsername(username).catch(() => null);

  if (!author) {
    return { title: 'Author Not Found - Artisea' };
  }

  return {
    title: `${author.name} (@${author.username}) - Artisea`,
    description: author.bio ?? `Read articles by ${author.name} on Artisea.`,
  };
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default async function AuthorProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const author = await getAuthorByUsername(username).catch(() => null);

  if (!author) {
    notFound();
  }

  const articles = await getAuthorArticles(author.id)
    .then((response) => response.data)
    .catch(() => []);

  return (
    <div className="min-h-screen transition-colors duration-200">
      <main className="mx-auto max-w-4xl py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <Avatar
              src={author.avatar_url}
              alt={author.name}
              size="xl"
              className="ring-4 ring-white dark:ring-zinc-900 shadow-lg"
            />
            <div className="flex-1">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                      {author.name}
                    </h1>
                    {author.is_featured && <Badge variant="info">Featured</Badge>}
                  </div>
                  <p className="text-zinc-500 dark:text-zinc-400 mt-1">
                    @{author.username}
                  </p>
                </div>
                <FollowButton authorId={author.id} />
              </div>

              {author.bio && (
                <p className="mt-4 text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  {author.bio}
                </p>
              )}

              {author.location && (
                <div className="flex items-center gap-1 mt-3 text-sm text-zinc-500 dark:text-zinc-400">
                  <MapPin className="h-3.5 w-3.5" />
                  {author.location}
                </div>
              )}

              <div className="flex items-center gap-6 mt-4 text-sm">
                <span>
                  <strong className="text-zinc-900 dark:text-zinc-50">
                    {author.follower_count.toLocaleString()}
                  </strong>{' '}
                  <span className="text-zinc-500 dark:text-zinc-400">followers</span>
                </span>
                <span>
                  <strong className="text-zinc-900 dark:text-zinc-50">
                    {author.following_count.toLocaleString()}
                  </strong>{' '}
                  <span className="text-zinc-500 dark:text-zinc-400">following</span>
                </span>
                <span>
                  <strong className="text-zinc-900 dark:text-zinc-50">
                    {author.article_count}
                  </strong>{' '}
                  <span className="text-zinc-500 dark:text-zinc-400">articles</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-6">
            Articles by {author.name}
          </h2>

          {articles.length === 0 ? (
            <p className="text-zinc-500 dark:text-zinc-400 text-center py-12">
              No articles published yet.
            </p>
          ) : (
            <div className="space-y-6">
              {articles.map((article) => (
                <article
                  key={article.id}
                  className="group border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 hover:shadow-lg transition-all duration-200 bg-white dark:bg-zinc-900"
                >
                  <Link href={`/article/${article.slug}`} className="block">
                    {article.cover_image && (
                      <img
                        src={article.cover_image}
                        alt={article.title}
                        className="w-full h-48 object-cover rounded-xl mb-4"
                        loading="lazy"
                      />
                    )}
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-zinc-600 dark:text-zinc-400 line-clamp-2 mb-3">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-zinc-400 dark:text-zinc-500">
                      <time>{formatDate(article.published_at)}</time>
                      {article.read_time_minutes > 0 && (
                        <>
                          <span>|</span>
                          <span>{article.read_time_minutes} min read</span>
                        </>
                      )}
                      <span>|</span>
                      <span>{article.like_count} likes</span>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
