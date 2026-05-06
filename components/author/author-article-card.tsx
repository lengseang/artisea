import type { Article } from '@/types/article';
import Link from 'next/link';

interface AuthorArticleCardProps {
  article: Article;
}

export default function AuthorArticleCard({ article }: Readonly<AuthorArticleCardProps>) {
  return (
    <article className="group border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 hover:shadow-lg transition-all duration-200 bg-white dark:bg-zinc-900">
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
        {article.excerpt && (
          <p className="text-zinc-600 dark:text-zinc-400 line-clamp-2 mb-3">
            {article.excerpt}
          </p>
        )}
        <div className="flex items-center gap-3 text-xs text-zinc-400 dark:text-zinc-500">
          {article.read_time_minutes > 0 && <span>{article.read_time_minutes} min read</span>}
          {article.like_count > 0 && <span>· {article.like_count} likes</span>}
        </div>
      </Link>
    </article>
  );
}