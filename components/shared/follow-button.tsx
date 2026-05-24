'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { UserPlus, UserCheck, Loader2 } from 'lucide-react';
import { followAuthor, unfollowAuthor } from '@/lib/api/authors';

interface FollowButtonProps {
  authorId: string;
  isFollowing?: boolean;
  onFollow?: (authorId: string) => Promise<void>;
  onUnfollow?: (authorId: string) => Promise<void>;
  size?: 'sm' | 'md';
  className?: string;
}

export function FollowButton({
  authorId,
  isFollowing: initialFollowing = false,
  onFollow,
  onUnfollow,
  size = 'md',
  className,
}: Readonly<FollowButtonProps>) {
  const [isFollowing, setIsFollowing] = useState(initialFollowing);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      if (isFollowing) {
        await (onUnfollow ?? unfollowAuthor)(authorId);
        setIsFollowing(false);
      } else {
        await (onFollow ?? followAuthor)(authorId);
        setIsFollowing(true);
      }
    } catch (err) {
      console.error('Follow action failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-lg font-medium transition-all',
        size === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm',
        isFollowing
          ? 'border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-red-300 hover:text-red-600 dark:hover:border-red-800 dark:hover:text-red-400'
          : 'bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 hover:opacity-80',
        isLoading && 'opacity-50 cursor-not-allowed',
        className
      )}
      aria-label={isFollowing ? 'Unfollow' : 'Follow'}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isFollowing ? (
        <UserCheck className="h-4 w-4" />
      ) : (
        <UserPlus className="h-4 w-4" />
      )}
      {isFollowing ? 'Following' : 'Follow'}
    </button>
  );
}
