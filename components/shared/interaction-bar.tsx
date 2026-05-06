'use client';

import { Heart, MessageCircle, Bookmark, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InteractionBarProps {
  likeCount: number;
  commentCount: number;
  saveCount: number;
  shareCount: number;
  isLiked?: boolean;
  isSaved?: boolean;
  onLike?: () => void;
  onComment?: () => void;
  onSave?: () => void;
  onShare?: () => void;
  className?: string;
}

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export function InteractionBar({
  likeCount,
  commentCount,
  saveCount,
  shareCount,
  isLiked = false,
  isSaved = false,
  onLike,
  onComment,
  onSave,
  onShare,
  className,
}: Readonly<InteractionBarProps>) {
  return (
    <div
      className={cn(
        'flex items-center justify-between text-zinc-500 dark:text-zinc-400',
        className
      )}
    >
      {/* Left group: comments + likes */}
      <div className="flex items-center gap-5">
        <button
          onClick={onComment}
          className="group/btn flex items-center gap-1.5 transition-colors hover:text-blue-600 dark:hover:text-blue-400"
          aria-label={`${commentCount} comments`}
        >
          <MessageCircle className="h-[18px] w-[18px] transition-transform group-hover/btn:scale-110" />
          {commentCount > 0 && (
            <span className="text-xs">{formatCount(commentCount)}</span>
          )}
        </button>

        <button
          onClick={onLike}
          className={cn(
            'group/btn flex items-center gap-1.5 transition-colors',
            isLiked
              ? 'text-pink-600 dark:text-pink-400'
              : 'hover:text-pink-600 dark:hover:text-pink-400'
          )}
          aria-label={isLiked ? 'Unlike' : 'Like'}
        >
          <Heart
            className={cn(
              'h-[18px] w-[18px] transition-transform group-hover/btn:scale-110',
              isLiked && 'fill-current'
            )}
          />
          {likeCount > 0 && (
            <span className="text-xs">{formatCount(likeCount)}</span>
          )}
        </button>
      </div>

      {/* Right group: save + share */}
      <div className="flex items-center gap-5">
        <button
          onClick={onSave}
          className={cn(
            'group/btn transition-colors',
            isSaved
              ? 'text-amber-600 dark:text-amber-400'
              : 'hover:text-amber-600 dark:hover:text-amber-400'
          )}
          aria-label={isSaved ? 'Unsave' : 'Save'}
        >
          <Bookmark
            className={cn(
              'h-[18px] w-[18px] transition-transform group-hover/btn:scale-110',
              isSaved && 'fill-current'
            )}
          />
          {saveCount > 0 && (
            <span className="sr-only">{formatCount(saveCount)} saves</span>
          )}
        </button>

        <button
          onClick={onShare}
          className="group/btn transition-colors hover:text-blue-600 dark:hover:text-blue-400"
          aria-label="Share"
        >
          <Share2 className="h-[18px] w-[18px] transition-transform group-hover/btn:scale-110" />
          {shareCount > 0 && (
            <span className="sr-only">{formatCount(shareCount)} shares</span>
          )}
        </button>
      </div>
    </div>
  );
}
