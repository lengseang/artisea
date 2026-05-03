import type { Author } from '@/types/author';

interface AuthorHeaderProps {
    author: Author;
}

export default function AuthorHeader({ author }: Readonly<AuthorHeaderProps>) {
    return (
        <div className="mb-8 flex items-center gap-6">
            <img
                src={author.avatarUrl}
                alt={author.name}
                className="w-24 h-24 rounded-full object-cover border-2 border-zinc-200 dark:border-zinc-800"
            />
            <div className="flex-1">
                <h1 className="font-serif text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
                    {author.name}
                </h1>
                <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                    @{author.username}
                </p>
                {author.bio && (
                    <p className="text-zinc-700 dark:text-zinc-300 text-lg">
                        {author.bio}
                    </p>
                )}
            </div>
        </div>
    )
}
