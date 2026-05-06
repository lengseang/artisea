import type { Metadata } from 'next';
import Link from 'next/link';
import type { Article } from '@/types/article';
import { InteractionBar } from '@/components/shared/interaction-bar';
import { Avatar } from '@/components/ui/avatar';
import { FollowButton } from '@/components/shared/follow-button';

// Mock data-fetch (replace with real DB/API call)
async function getArticleBySlug(slug: string): Promise<Article | null> {
  const MOCK: Article[] = [
    {
      id: '1',
      author_id: 'u1',
      agent_id: null,
      slug: 'future-of-collaborative-writing',
      title: 'The Future of Collaborative Writing',
      excerpt:
        'How modern tools are reshaping the way writers work together across the globe.',
      content: `The landscape of writing has shifted dramatically over the past decade. Where once a writer toiled alone, modern collaborative platforms now allow teams to craft stories together in real time.

This piece explores the tools, philosophies, and workflows that are defining the next era of collaborative authorship.

From Google Docs to Notion, from Git-based workflows to real-time multiplayer editors, the tools available to writers today would have seemed like science fiction just twenty years ago. But it's not just about the technology — it's about the fundamental shift in how we think about authorship itself.

The lone genius, laboring away in a garret, is giving way to something more dynamic: writers who collaborate across continents, who build on each other's ideas, who treat writing as a conversation rather than a monologue.

This doesn't mean individual voice is dead. Far from it. The best collaborative writing amplifies individual voices while creating something none of the contributors could have achieved alone.`,
      content_text: null,
      cover_image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=400&fit=crop',
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
      author: {
        display_name: 'Jane Smith',
        username: 'janesmith_writer',
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
      },
      tags: [{ id: 't1', name: 'Writing', slug: 'writing', usage_count: 142 }],
    },
    {
      id: '2',
      author_id: 'u2',
      agent_id: null,
      slug: 'on-craft-finding-your-voice',
      title: 'On Craft: Finding Your Voice',
      excerpt:
        'Practical exercises and philosophies to help you discover what makes your writing uniquely yours.',
      content: `Voice is the most elusive quality in writing. It cannot be taught directly — only cultivated through practice, risk, and a willingness to be honest on the page.

Here are some exercises to help you begin that journey.

First, try writing the same scene three different ways. Write it formally. Write it casually. Write it angrily. Notice which version feels most natural, most alive. That's the beginning of your voice.

Second, read voraciously — but read critically. When you encounter a passage that moves you, stop and ask: why? What is the writer doing technically that creates this effect?

Third, write every day. Not because practice makes perfect, but because practice makes voice. Your voice emerges from the accumulated weight of thousands of sentences, each one teaching you something about who you are on the page.`,
      content_text: null,
      cover_image: 'https://images.unsplash.com/photo-1519682577862-22b62b24e493?w=800&h=400&fit=crop',
      status: 'published',
      visibility: 'public',
      is_verified: false,
      verified_at: null,
      published_at: '2024-03-20T08:00:00Z',
      read_time_minutes: 8,
      view_count: 890,
      like_count: 35,
      comment_count: 7,
      save_count: 19,
      share_count: 4,
      created_at: '2024-03-18T10:00:00Z',
      updated_at: '2024-03-20T08:00:00Z',
      auto_saved_at: null,
      author: {
        display_name: 'Alex Johnson',
        username: 'alex_crafts',
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
      },
      tags: [{ id: 't2', name: 'Craft', slug: 'craft', usage_count: 87 }],
    },
  ];

  return MOCK.find((a) => a.slug === slug) ?? null;
}

export async function generateMetadata({
  params,
}: Readonly<{
  params: Promise<{ slug: string }>;
}>): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  return {
    title: article ? `${article.title} – Artisea` : 'Article Not Found – Artisea',
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

import { SocialLayout } from '@/components/layout/social-layout';

export default async function ArticlePage({
  params,
}: Readonly<{
  params: Promise<{ slug: string }>;
}>) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  // 404 state
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

  return (
    <SocialLayout>
      <article className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 mb-6 transition-colors"
        >
          ← Back
        </Link>

        {/* Cover image */}
        {article.cover_image && (
          <div className="mb-8 overflow-hidden rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800">
            <img
              src={article.cover_image}
              alt={article.title}
              className="w-full h-64 sm:h-96 object-cover"
            />
          </div>
        )}

        {/* Article Header */}
        <header className="mb-8">
          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex items-center gap-2 mb-4">
              {article.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="rounded-full bg-zinc-100 dark:bg-zinc-800 px-3 py-1 text-xs font-semibold text-zinc-600 dark:text-zinc-400"
                >
                  #{tag.name.toLowerCase()}
                </span>
              ))}
            </div>
          )}

          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 leading-tight mb-4">
            {article.title}
          </h1>
          <p className="text-lg text-zinc-500 dark:text-zinc-400 mb-6 font-medium">
            {article.excerpt}
          </p>

          {/* Author info */}
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
                  {article.author?.display_name}
                </Link>
                <div className="flex items-center gap-2 text-zinc-400 dark:text-zinc-600 font-medium">
                  <time>{formatDate(article.published_at)}</time>
                  <span>·</span>
                  <span>{article.read_time_minutes} min read</span>
                </div>
              </div>
            </div>
            <FollowButton authorId={article.author_id} size="sm" />
          </div>
        </header>

        {/* Interaction bar (top) */}
        <div className="mb-8 border-y border-zinc-100 dark:border-zinc-800 py-4">
          <InteractionBar
            likeCount={article.like_count}
            commentCount={article.comment_count}
            saveCount={article.save_count}
            shareCount={article.share_count}
          />
        </div>

        {/* Article Content */}
        <div className="prose prose-zinc dark:prose-invert max-w-none leading-relaxed text-zinc-700 dark:text-zinc-300 whitespace-pre-line text-lg font-normal">
          {article.content}
        </div>

        {/* Interaction bar (bottom) */}
        <div className="mt-12 border-t border-zinc-100 dark:border-zinc-800 pt-8">
          <InteractionBar
            likeCount={article.like_count}
            commentCount={article.comment_count}
            saveCount={article.save_count}
            shareCount={article.share_count}
          />
        </div>

        {/* Comments Section Placeholder (Future Reddit-style comments) */}
        <div className="mt-12 p-8 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
           <h4 className="font-bold mb-4">Comments</h4>
           <p className="text-sm text-zinc-500">Discussion threads will appear here.</p>
        </div>
      </article>
    </SocialLayout>
  );
}

