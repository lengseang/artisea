import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Avatar } from '@/components/ui/avatar';
import { FollowButton } from '@/components/shared/follow-button';
import { Badge } from '@/components/ui/badge';
import type { Author } from '@/types/author';
import type { Article } from '@/types/article';
import Link from 'next/link';
import { MapPin } from 'lucide-react';

async function getAuthorByUsername(username: string): Promise<Author | null> {
  // Mock data — replace with API call
  return {
    id: '1',
    name: 'Jane Doe',
    username: username,
    bio: 'Passionate writer exploring technology, culture, and human stories. Based in San Francisco, writing about the things that matter.',
    avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
    cover_image_url: null,
    location: 'San Francisco, CA',
    social_links: { twitter: 'janedoe', website: 'janedoe.com' },
    is_featured: true,
    follower_count: 1240,
    following_count: 89,
    article_count: 34,
  };
}

async function getAuthorArticles(_authorId: string): Promise<Article[]> {
  return [
    {
      id: '1',
      author_id: '1',
      agent_id: null,
      title: 'Understanding Modern Web Development',
      excerpt: 'A deep dive into the latest trends and best practices in web development...',
      slug: 'understanding-modern-web',
      content: null,
      content_text: null,
      cover_image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop',
      status: 'published',
      visibility: 'public',
      is_verified: false,
      verified_at: null,
      published_at: '2024-03-15T10:00:00Z',
      read_time_minutes: 6,
      view_count: 1240,
      like_count: 48,
      comment_count: 12,
      save_count: 23,
      share_count: 8,
      created_at: '2024-03-10T10:00:00Z',
      updated_at: '2024-03-15T10:00:00Z',
      auto_saved_at: null,
      tags: [{ id: 't1', name: 'Web Dev', slug: 'web-dev', usage_count: 99 }],
    },
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  const author = await getAuthorByUsername(username);

  if (!author) {
    return { title: 'Author Not Found – Artisea' };
  }

  return {
    title: `${author.name} (@${author.username}) – Artisea`,
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
  const author = await getAuthorByUsername(username);

  if (!author) {
    notFound();
  }

  const articles = await getAuthorArticles(author.id);

  return (
    <div className="min-h-screen transition-colors duration-200">
      <main className="mx-auto max-w-4xl py-12 px-4 sm:px-6 lg:px-8">
        {/* Author Header */}
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

              {/* Stats */}
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

        {/* Articles Section */}
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
                      <span>·</span>
                      <span>{article.read_time_minutes} min read</span>
                      <span>·</span>
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
