import { cn } from '@/lib/utils';

interface AvatarProps {
  src?: string | null;
  alt: string;
  fallback?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const SIZE_MAP = {
  xs: 'h-6 w-6 text-[10px]',
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-base',
  xl: 'h-24 w-24 text-xl',
} as const;

export function Avatar({
  src,
  alt,
  fallback,
  size = 'md',
  className,
}: Readonly<AvatarProps>) {
  const initials =
    fallback ?? alt.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div
      className={cn(
        'shrink-0 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800',
        SIZE_MAP[size],
        className
      )}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center font-semibold text-zinc-500 dark:text-zinc-400">
          {initials}
        </div>
      )}
    </div>
  );
}
