import { Article } from "@/types/article.";
import Link from "next/link";

interface AuthorArticleCardProps {
    article: Article;
}

export default function AuthorArticleCard({ article }: Readonly<AuthorArticleCardProps>) {
    return(
        <article className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 hover:shadow-lg transition-shadow duration-200 bg-white dark:bg-zinc-900">
            <Link href={`/article/${article.slug}`} className="group">
            {article.coverImage && (
                <img 
                    src={article.coverImage} 
                    alt={article.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                />
            )}
                <h3 className="font-sans text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {article.title}
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 line-clamp-2">
                    {article.excerpt}
                </p>
            </Link>
        </article>
    )
}