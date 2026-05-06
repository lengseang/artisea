'use client';

import { Suspense } from 'react';
import { MOCK_STORIES } from '@/lib/mock/story-data';
import { StoryCard } from '@/components/stories/story-card';
import { SearchBar } from '@/components/ui/searchbar';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

const STORY_TABS = [
  { feed: 'latest', label: 'Latest' },
  { feed: 'trending', label: 'Trending' },
  { feed: 'featured', label: 'Featured' },
];

function StoriesNavigation() {
  const searchParams = useSearchParams();
  const currentFeed = searchParams.get('feed') || 'latest';

  return (
    <div className="flex items-center gap-2 mb-8 border-b border-border/40 pb-px">
      <NavigationMenu>
        <NavigationMenuList className="gap-2 sm:gap-4">
          {STORY_TABS.map(({ feed, label }) => (
            <NavigationMenuItem key={feed}>
              <NavigationMenuLink asChild>
                <Link
                  href={`/stories?feed=${feed}`}
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "bg-transparent h-9 px-2 sm:px-4 hover:bg-transparent hover:text-foreground",
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

import { SocialLayout } from '@/components/layout/social-layout';

export default function StoriesPage() {
  return (
    <SocialLayout>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <section className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
            Stories
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Explore deep-dives, creative essays, and technical insights.
          </p>
        </section>

        <Suspense>
          <StoriesNavigation />
        </Suspense>

        <section className="flex flex-col gap-6">
          {MOCK_STORIES.map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </section>

        <div className="mt-12 flex justify-center">
          <button className="px-8 py-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-sm font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
            Load more stories
          </button>
        </div>
      </div>
    </SocialLayout>
  );
}

