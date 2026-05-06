'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';

const FEED_TABS = [
  { feed: 'featured', label: 'Featured' },
  { feed: 'for-you', label: 'For You' },
];

/**
 * AuthorNavigation — tab navigation for the authors listing page.
 * Previously exported as `ArticleNavigation` (name collision bug).
 */
export function AuthorNavigation() {
  const searchParams = useSearchParams();
  const currentFeed = searchParams.get('feed') || 'featured';

  return (
    <div className="flex items-center gap-2 mb-8 border-b border-border/40 pb-px">
      <NavigationMenu>
        <NavigationMenuList className="gap-2 sm:gap-4">
          {FEED_TABS.map(({ feed, label }) => (
            <NavigationMenuItem key={feed}>
              <NavigationMenuLink asChild>
                <Link
                  href={`/authors?feed=${feed}`}
                  className={cn(
                    navigationMenuTriggerStyle(),
                    'bg-transparent h-9 px-2 sm:px-4 hover:bg-transparent hover:text-foreground',
                    currentFeed === feed
                      ? 'font-semibold text-foreground border-b-2 border-foreground rounded-none text-zinc-900 dark:text-zinc-50'
                      : 'text-muted-foreground font-medium'
                  )}
                >
                  {label}
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}