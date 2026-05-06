import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  action,
  className,
}: Readonly<PageHeaderProps>) {
  return (
    <div className={cn('flex items-start justify-between gap-4 mb-8', className)}>
      <div>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
          {title}
        </h1>
        {description && (
          <p className="text-zinc-500 dark:text-zinc-400 mt-1 text-sm">
            {description}
          </p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}
