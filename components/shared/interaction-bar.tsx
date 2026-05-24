'use client';

import { Heart, MessageCircle, Bookmark, Share2 } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { interactWithArticle, removeInteraction } from '@/lib/api/interactions';

interface InteractionBarProps {
  articleId?: string;
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
  articleId,
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
  const [liked, setLiked] = useState(isLiked);
  const [saved, setSaved] = useState(isSaved);
  const [likes, setLikes] = useState(likeCount);
  const [saves, setSaves] = useState(saveCount);
  const [isBusy, setIsBusy] = useState(false);

  const handleLike = async () => {
    if (onLike) {
      onLike();
      return;
    }
    if (!articleId || isBusy) return;

    setIsBusy(true);
    const nextLiked = !liked;
    setLiked(nextLiked);
    setLikes((current) => current + (nextLiked ? 1 : -1));
    try {
      if (nextLiked) {
        await interactWithArticle(articleId, { type: 'like' });
      } else {
        await removeInteraction(articleId, 'like');
      }
    } catch {
      setLiked(!nextLiked);
      setLikes((current) => current + (nextLiked ? -1 : 1));
    } finally {
      setIsBusy(false);
    }
  };

  const handleSave = async () => {
    if (onSave) {
      onSave();
      return;
    }
    if (!articleId || isBusy) return;

    setIsBusy(true);
    const nextSaved = !saved;
    setSaved(nextSaved);
    setSaves((current) => current + (nextSaved ? 1 : -1));
    try {
      if (nextSaved) {
        await interactWithArticle(articleId, { type: 'save' });
      } else {
        await removeInteraction(articleId, 'save');
      }
    } catch {
      setSaved(!nextSaved);
      setSaves((current) => current + (nextSaved ? -1 : 1));
    } finally {
      setIsBusy(false);
    }
  };

  const handleShare = async () => {
    if (onShare) {
      onShare();
      return;
    }
    if (typeof navigator !== 'undefined' && navigator.share) {
      await navigator.share({ url: window.location.href }).catch(() => undefined);
      return;
    }
    if (typeof navigator !== 'undefined') {
      await navigator.clipboard?.writeText(window.location.href).catch(() => undefined);
    }
  };

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
          onClick={handleLike}
          disabled={isBusy}
          className={cn(
            'group/btn flex items-center gap-1.5 transition-colors',
            liked
              ? 'text-pink-600 dark:text-pink-400'
              : 'hover:text-pink-600 dark:hover:text-pink-400'
          )}
          aria-label={liked ? 'Unlike' : 'Like'}
        >
          <Heart
            className={cn(
              'h-[18px] w-[18px] transition-transform group-hover/btn:scale-110',
              liked && 'fill-current'
            )}
          />
          {likes > 0 && (
            <span className="text-xs">{formatCount(likes)}</span>
          )}
        </button>
      </div>

      {/* Right group: save + share */}
      <div className="flex items-center gap-5">
        <button
          onClick={handleSave}
          disabled={isBusy}
          className={cn(
            'group/btn transition-colors',
            saved
              ? 'text-amber-600 dark:text-amber-400'
              : 'hover:text-amber-600 dark:hover:text-amber-400'
          )}
          aria-label={saved ? 'Unsave' : 'Save'}
        >
          <Bookmark
            className={cn(
              'h-[18px] w-[18px] transition-transform group-hover/btn:scale-110',
              saved && 'fill-current'
            )}
          />
          {saves > 0 && (
            <span className="sr-only">{formatCount(saves)} saves</span>
          )}
        </button>

        <button
          onClick={handleShare}
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
