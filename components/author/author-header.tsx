import { Avatar } from '@/components/ui/avatar';
import { FollowButton } from '@/components/shared/follow-button';
import type { Author } from '@/types/author';

interface AuthorHeaderProps {
  author: Author;
}

export default function AuthorHeader({ author }: Readonly<AuthorHeaderProps>) {
  return (
    <div className="mb-8 flex items-center gap-6">
      <Avatar src={author.avatar_url} alt={author.name} size="xl" />
      <div className="flex-1">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-1">
              {author.name}
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400">@{author.username}</p>
          </div>
          <FollowButton authorId={author.id} />
        </div>
        {author.bio && (
          <p className="text-zinc-700 dark:text-zinc-300 text-lg mt-3 leading-relaxed">
            {author.bio}
          </p>
        )}
        <div className="flex gap-4 mt-3 text-sm">
          <span><strong className="text-zinc-900 dark:text-zinc-50">{author.follower_count}</strong> <span className="text-zinc-500">followers</span></span>
          <span><strong className="text-zinc-900 dark:text-zinc-50">{author.article_count}</strong> <span className="text-zinc-500">articles</span></span>
        </div>
      </div>
    </div>
  );
}
