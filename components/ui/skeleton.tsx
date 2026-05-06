import { cn } from '@/lib/utils';

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="skeleton"
      className={cn('animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800', className)}
      {...props}
    />
  );
}

/** Pre-built skeleton for an article card */
function ArticleCardSkeleton() {
  return (
    <div className="flex flex-col gap-3 border-b border-zinc-200 dark:border-zinc-800 p-5">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <div className="flex gap-4 pl-[52px]">
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <Skeleton className="h-24 w-24 rounded-xl" />
      </div>
    </div>
  );
}

/** Pre-built skeleton for an author card */
function AuthorCardSkeleton() {
  return (
    <div className="flex items-center gap-4 border-b border-zinc-200 dark:border-zinc-800 p-5">
      <Skeleton className="h-14 w-14 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-4 w-full max-w-md" />
      </div>
      <Skeleton className="h-9 w-24 rounded-lg" />
    </div>
  );
}

export { Skeleton, ArticleCardSkeleton, AuthorCardSkeleton };
