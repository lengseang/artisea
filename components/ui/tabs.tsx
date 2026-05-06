'use client';

import { cn } from '@/lib/utils';

interface TabItem {
  value: string;
  label: string;
  count?: number;
}

interface TabsProps {
  items: TabItem[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function Tabs({ items, value, onChange, className }: Readonly<TabsProps>) {
  return (
    <div
      className={cn(
        'flex items-center gap-1 border-b border-border/40 pb-px',
        className
      )}
      role="tablist"
    >
      {items.map((item) => (
        <button
          key={item.value}
          role="tab"
          aria-selected={value === item.value}
          onClick={() => onChange(item.value)}
          className={cn(
            'inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors rounded-none border-b-2',
            value === item.value
              ? 'border-foreground text-foreground'
              : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
          )}
        >
          {item.label}
          {item.count !== undefined && (
            <span className="ml-1 text-xs text-muted-foreground/70">
              ({item.count})
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
