'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/ui/avatar';
import { FollowButton } from '@/components/shared/follow-button';
import type { Author } from '@/types/author';

interface AuthorCardProps {
  author: Author;
  className?: string;
}

/**
 * AuthorCard — displays an author's profile summary.
 * Previously this component referenced `article.*` variables (copy-paste bug).
 * Now correctly renders Author data.
 */
export function AuthorCard({ author, className }: Readonly<AuthorCardProps>) {
  return (
    <div
      className={cn(
        'group flex items-start gap-4 border-b border-zinc-200 dark:border-zinc-800 p-5 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900/50',
        className
      )}
    >
      {/* Avatar */}
      <Link href={`/authors/${author.username}`}>
        <Avatar
          src={author.avatar_url}
          alt={author.name}
          size="lg"
          className="transition-transform group-hover:scale-105"
        />
      </Link>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Link
              href={`/authors/${author.username}`}
              className="font-semibold text-zinc-900 dark:text-zinc-50 hover:underline"
            >
              {author.name}
            </Link>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              @{author.username}
            </p>
          </div>
          <FollowButton authorId={author.id} size="sm" />
        </div>

        {author.bio && (
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
            {author.bio}
          </p>
        )}

        {/* Stats */}
        <div className="mt-2 flex items-center gap-4 text-xs text-zinc-400 dark:text-zinc-500">
          <span>
            <strong className="text-zinc-600 dark:text-zinc-300">
              {author.follower_count}
            </strong>{' '}
            followers
          </span>
          <span>
            <strong className="text-zinc-600 dark:text-zinc-300">
              {author.article_count}
            </strong>{' '}
            articles
          </span>
        </div>
      </div>
    </div>
  );
}