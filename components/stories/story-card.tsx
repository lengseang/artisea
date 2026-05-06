'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/ui/avatar';
import { Clock, MoreHorizontal } from 'lucide-react';
import { Story } from '@/lib/mock/story-data';

interface StoryCardProps {
  story: Story;
  className?: string;
}

export function StoryCard({ story, className }: StoryCardProps) {
  return (
    <article
      className={cn(
        'group relative flex flex-col border-b border-zinc-100 dark:border-zinc-900 py-8 transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 sm:py-10',
        className
      )}
    >
      {/* Author row */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar
            src={story.author.avatar}
            alt={story.author.name}
            size="md"
            className="ring-1 ring-zinc-200 dark:ring-zinc-800"
          />
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
            <span className="font-bold text-zinc-900 dark:text-zinc-50">
              {story.author.name}
            </span>
            <span className="text-sm text-zinc-500 dark:text-zinc-400">
              @{story.author.username}
            </span>
            <span className="hidden sm:inline text-zinc-300 dark:text-zinc-700">·</span>
            <span className="text-xs text-zinc-400 dark:text-zinc-500">
              {story.publishedAt}
            </span>
          </div>
        </div>
        <button className="rounded-full p-2 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>

      {/* Content row */}
      <div className="flex gap-8 pl-[52px]">
        <div className="flex-1">
          <Link href={`/stories/${story.id}`} className="group/link">
            <h3 className="mb-2 text-2xl font-bold leading-tight text-zinc-900 dark:text-zinc-50 group-hover/link:underline decoration-zinc-300 dark:decoration-zinc-700 underline-offset-4">
              {story.title}
            </h3>
            <p className="line-clamp-3 text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-400 mb-4">
              {story.excerpt}
            </p>
          </Link>
          
          <div className="flex items-center gap-4 text-xs font-medium text-zinc-400 dark:text-zinc-500">
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {story.readTime}
            </div>
            {story.tags && story.tags.length > 0 && (
              <div className="flex gap-2">
                {story.tags.slice(0, 1).map(tag => (
                  <span key={tag} className="rounded-full bg-zinc-100 dark:bg-zinc-900 px-2.5 py-0.5 text-zinc-600 dark:text-zinc-400">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {story.coverImage && (
          <Link href={`/stories/${story.id}`} className="shrink-0 hidden sm:block">
            <div className="h-28 w-28 lg:h-32 lg:w-32 overflow-hidden rounded-xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
              <img
                src={story.coverImage}
                alt={story.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
          </Link>
        )}
      </div>
    </article>
  );
}
