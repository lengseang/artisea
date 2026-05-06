'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { MoreHorizontal } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { InteractionBar } from '@/components/shared/interaction-bar';
import type { Article } from '@/types/article';

interface ArticleCardProps {
  article: Article;
  className?: string;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function ArticleCard({ article, className }: Readonly<ArticleCardProps>) {
  return (
    <article
      className={cn(
        'group relative flex flex-col border-b border-zinc-200 dark:border-zinc-800 p-4 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900/50 sm:p-5',
        className
      )}
    >
      {/* Full-card link */}
      <Link href={`/article/${article.slug}`} className="absolute inset-0 z-0">
        <span className="sr-only">Read {article.title}</span>
      </Link>

      {/* Author row */}
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar
            src={article.author?.avatar_url}
            alt={article.author?.display_name ?? 'Author'}
            size="md"
          />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:gap-1.5">
            <Link
              href={`/authors/${article.author?.username ?? ''}`}
              className="font-semibold text-zinc-900 hover:underline dark:text-zinc-50"
            >
              {article.author?.display_name ?? 'Unknown'}
            </Link>
            {article.author?.username && (
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                @{article.author.username}
              </span>
            )}
            {article.published_at && (
              <span className="text-xs text-zinc-400 dark:text-zinc-500">
                · {formatDate(article.published_at)}
              </span>
            )}
          </div>
        </div>

        <button className="relative z-10 rounded-full p-2 text-zinc-400 transition-colors hover:bg-zinc-200 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-50">
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>

      {/* Content row */}
      <div className="mb-3 flex gap-4 pl-[52px]">
        <div className="flex-1 pointer-events-none">
          <h3 className="mb-1.5 text-lg font-bold leading-snug text-zinc-900 group-hover:underline dark:text-zinc-50">
            {article.title}
          </h3>
          {article.excerpt && (
            <p className="line-clamp-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              {article.excerpt}
            </p>
          )}
          {/* Meta */}
          <div className="mt-2 flex items-center gap-3 text-xs text-zinc-400 dark:text-zinc-500">
            {article.read_time_minutes > 0 && (
              <span>{article.read_time_minutes} min read</span>
            )}
            {article.tags && article.tags.length > 0 && (
              <span className="rounded-full bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5">
                {article.tags[0].name}
              </span>
            )}
          </div>
        </div>

        {article.cover_image && (
          <div className="relative z-10 shrink-0 overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
            <div className="h-24 w-24 sm:h-28 sm:w-28">
              <img
                src={article.cover_image}
                alt={article.title}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        )}
      </div>

      {/* Interaction bar */}
      <div className="relative z-10 pl-[52px] pr-8">
        <InteractionBar
          likeCount={article.like_count}
          commentCount={article.comment_count}
          saveCount={article.save_count}
          shareCount={article.share_count}
        />
      </div>
    </article>
  );
}