'use client' // Added so we can use onClick events for the image and buttons

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Heart, MessageCircle, Bookmark, Share, MoreHorizontal } from "lucide-react";
import type { Author } from "next/dist/lib/metadata/types/metadata-types";

interface AuthorCardProps {
    author: Author;
    className?: string;
}

export function AuthorCard({ author, className }: Readonly<AuthorCardProps>) {
    
    const handleImageClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        console.log("Opening image:", author.avatarUrl);
        alert("Imagine a full-screen image modal opening here!");
    };

    return (
        <article className={cn(
            "group relative flex flex-col border-b border-zinc-200 p-4 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900/50 sm:p-5",
            className
        )}>
            
            <Link href={`/article/${article.slug}`} className="absolute inset-0 z-0">
                <span className="sr-only">Read {article.title}</span>
            </Link>

            <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                        {article.authorAvatar ? (
                            <img src={article.authorAvatar} alt={article.author} className="h-full w-full object-cover" />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center font-semibold text-zinc-500">
                                {article.author.charAt(0)}
                            </div>
                        )}
                    </div>
                    
                    <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:gap-1.5">
                        <Link href={`/author/${article.username}`} className="font-semibold text-zinc-900 hover:underline dark:text-zinc-50">
                            {article.author}
                        </Link>
                        {article.username && (
                            <span className="text-sm text-zinc-500 dark:text-zinc-400">
                                @{article.username}
                            </span>
                        )}
                    </div>
                </div>
                
                <button className="relative z-10 rounded-full p-2 text-zinc-400 transition-colors hover:bg-zinc-200 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-50">
                    <MoreHorizontal className="h-5 w-5" />
                </button>
            </div>

            <div className="mb-3 flex gap-4 pl-[52px]">
                <div className="flex-1 pointer-events-none">
                    <h3 className="mb-1.5 font-serif text-lg font-bold leading-snug text-zinc-900 group-hover:underline dark:text-zinc-50">
                        {article.title}
                    </h3>
                    <p className="line-clamp-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                        {article.excerpt}
                    </p>
                </div>

                {article.coverImage && (
                    <button 
                        onClick={handleImageClick}
                        className="relative z-10 shrink-0 cursor-zoom-in overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 transition-opacity hover:opacity-90"
                    >
                        <div className="h-24 w-24 sm:h-28 sm:w-28">
                            <img 
                                src={article.coverImage} 
                                alt={article.title} 
                                className="h-full w-full object-cover"
                            />
                        </div>
                    </button>
                )}
            </div>

            <div className="relative z-10 flex items-center justify-between pl-[52px] pr-8 text-zinc-500 dark:text-zinc-400">
                <div className="flex items-center gap-6">
                    <button className="flex items-center gap-1.5 transition-colors hover:text-blue-600">
                        <MessageCircle className="h-4 w-4" />
                        <span className="text-xs">12</span>
                    </button>
                    <button className="flex items-center gap-1.5 transition-colors hover:text-pink-600">
                        <Heart className="h-4 w-4" />
                        <span className="text-xs">48</span>
                    </button>
                </div>
                
                <div className="flex items-center gap-6">
                    <button className="transition-colors hover:text-blue-600">
                        <Bookmark className="h-4 w-4" />
                    </button>
                    <button className="transition-colors hover:text-blue-600">
                        <Share className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </article>
    );
}