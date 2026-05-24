import type { Metadata } from 'next';
import Link from 'next/link';
import { InteractionBar } from '@/components/shared/interaction-bar';
import { Avatar } from '@/components/ui/avatar';
import { FollowButton } from '@/components/shared/follow-button';
import { SocialLayout } from '@/components/layout/social-layout';
import { ArticleViewer } from '@/components/shared/article-viewer';
import { getArticleBySlug, recordArticleView } from '@/lib/api/articles';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: Readonly<{
  params: Promise<{ slug: string }>;
}>): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug).catch(() => null);
  return {
    title: article ? `${article.title} - Artisea` : 'Article Not Found - Artisea',
    description: article?.excerpt ?? undefined,
  };
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export default async function ArticlePage({
  params,
}: Readonly<{
  params: Promise<{ slug: string }>;
}>) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug).catch(() => null);

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center text-zinc-900 dark:text-zinc-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Article not found</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mb-8">
            The article you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Link
            href="/"
            className="rounded-xl bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 px-5 py-2.5 text-sm font-semibold hover:opacity-80 transition-opacity"
          >
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  void recordArticleView(article.id).catch(() => undefined);

  return (
    <SocialLayout>
      <article className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 mb-6 transition-colors"
        >
          Back
        </Link>

        {article.cover_image && (
          <div className="mb-8 overflow-hidden rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800">
            <img
              src={article.cover_image}
              alt={article.title}
              className="w-full h-64 sm:h-96 object-cover"
            />
          </div>
        )}

        <header className="mb-8">
          {article.tags && article.tags.length > 0 && (
            <div className="flex items-center gap-2 mb-4">
              {article.tags.map((tag) => (
                <span
                  key={tag.id || tag.slug}
                  className="rounded-full bg-zinc-100 dark:bg-zinc-800 px-3 py-1 text-xs font-semibold text-zinc-600 dark:text-zinc-400"
                >
                  #{tag.name.toLowerCase()}
                </span>
              ))}
            </div>
          )}

          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 leading-tight mb-4 break-words">
            {article.title}
          </h1>
          {article.excerpt && (
            <p className="text-lg text-zinc-500 dark:text-zinc-400 mb-6 font-medium">
              {article.excerpt}
            </p>
          )}

          <div className="flex items-center justify-between p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
            <div className="flex items-center gap-3">
              <Avatar
                src={article.author?.avatar_url}
                alt={article.author?.display_name ?? 'Author'}
                size="md"
              />
              <div className="text-sm">
                <Link
                  href={`/authors/${article.author?.username ?? ''}`}
                  className="font-bold text-zinc-900 dark:text-zinc-100 hover:underline"
                >
                  {article.author?.display_name ?? 'Unknown author'}
                </Link>
                <div className="flex items-center gap-2 text-zinc-400 dark:text-zinc-600 font-medium">
                  <time>{formatDate(article.published_at)}</time>
                  {article.read_time_minutes > 0 && (
                    <>
                      <span>|</span>
                      <span>{article.read_time_minutes} min read</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <FollowButton authorId={article.author_id} size="sm" />
          </div>
        </header>

        <div className="mb-8 border-y border-zinc-100 dark:border-zinc-800 py-4">
          <InteractionBar
            articleId={article.id}
            likeCount={article.like_count}
            commentCount={article.comment_count}
            saveCount={article.save_count}
            shareCount={article.share_count}
          />
        </div>

        <div className="mt-6 mb-12">
          <ArticleViewer content={article.content} contentText={article.content_text} />
        </div>

        <div className="mt-12 border-t border-zinc-100 dark:border-zinc-800 pt-8">
          <InteractionBar
            articleId={article.id}
            likeCount={article.like_count}
            commentCount={article.comment_count}
            saveCount={article.save_count}
            shareCount={article.share_count}
          />
        </div>
      </article>
    </SocialLayout>
  );
}
