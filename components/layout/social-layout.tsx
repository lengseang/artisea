'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { 
  Home, 
  TrendingUp, 
  Users, 
  Bookmark, 
  History,
  Hash,
  ChevronRight,
  Info,
  ExternalLink,
  Star
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Avatar } from '@/components/ui/avatar';

interface SocialLayoutProps {
  children: React.ReactNode;
  showLeftSidebar?: boolean;
  showRightSidebar?: boolean;
}

export function SocialLayout({ 
  children, 
  showLeftSidebar = true, 
  showRightSidebar = true 
}: SocialLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] lg:grid-cols-[240px_1fr_320px] gap-8 py-8">
        
        {/* LEFT SIDEBAR: Navigation */}
        {showLeftSidebar && (
          <aside className="hidden md:block sticky top-28 h-[calc(100vh-120px)] overflow-y-auto">
            <nav className="space-y-6">
              <div className="space-y-1">
                <p className="px-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Feeds</p>
                <SidebarLink href="/" icon={Home} label="Home" active={pathname === '/'} />
                <SidebarLink href="/popular" icon={TrendingUp} label="Popular" active={pathname === '/popular'} />
                <SidebarLink href="/authors" icon={Users} label="Authors" active={pathname === '/authors'} />
              </div>

              <div className="space-y-1">
                <p className="px-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">My Library</p>
                <SidebarLink href="/library" icon={Bookmark} label="Saved" />
                <SidebarLink href="/history" icon={History} label="History" />
              </div>

              <div className="space-y-1">
                <p className="px-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Topics</p>
                <SidebarLink href="/tag/technology" icon={Hash} label="Technology" />
                <SidebarLink href="/tag/writing" icon={Hash} label="Writing" />
                <SidebarLink href="/tag/design" icon={Hash} label="Design" />
                <button className="flex w-full items-center gap-3 px-3 py-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                  <span className="flex-1 text-left">Show More</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </nav>
          </aside>
        )}

        {/* CENTER COLUMN: The Feed */}
        <main className={cn(
          "min-w-0 flex flex-col gap-8",
          !showRightSidebar && "lg:col-span-2"
        )}>
          {children}
        </main>

        {/* RIGHT SIDEBAR: Widgets */}
        {showRightSidebar && (
          <aside className="hidden lg:block sticky top-28 h-fit space-y-6">
            {/* About Artisea */}
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Info className="h-4 w-4 text-zinc-400" />
                <h4 className="font-bold text-zinc-900 dark:text-zinc-100">About Artisea</h4>
              </div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-4">
                Artisea is a digital publishing platform focused on a distraction-free environment for writers and readers.
              </p>
              <div className="flex flex-wrap gap-2 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <FooterLink label="Terms" />
                <FooterLink label="Privacy" />
                <FooterLink label="Content Policy" />
              </div>
            </div>

            {/* Trending Tags */}
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm">
              <h4 className="font-bold text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-orange-500" />
                Trending Topics
              </h4>
              <div className="space-y-4">
                <TrendingItem tag="nextjs" posts="1.2k" />
                <TrendingItem tag="writingtips" posts="842" />
                <TrendingItem tag="futureoftech" posts="654" />
                <TrendingItem tag="mindfulness" posts="521" />
              </div>
              <button className="w-full mt-4 py-2 text-xs font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                Show More
              </button>
            </div>

            {/* Top Authors */}
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm">
              <h4 className="font-bold text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-500" />
                Top Authors
              </h4>
              <div className="space-y-4">
                <AuthorItem name="Elena Vance" username="elevance" followers="12.4k" avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Elena" />
                <AuthorItem name="Julian Thorne" username="jthorne" followers="8.2k" avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Julian" />
                <AuthorItem name="Maria Chen" username="mchen_reports" followers="6.1k" avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Maria" />
              </div>
              <button className="w-full mt-4 py-2 text-xs font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                View All
              </button>
            </div>

            {/* Community Support */}
            <div className="rounded-3xl bg-zinc-900 dark:bg-zinc-100 p-6 text-zinc-50 dark:text-zinc-900 shadow-xl shadow-zinc-200 dark:shadow-none overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 dark:bg-black/5 rounded-full -mr-16 -mt-16 blur-3xl" />
              <h4 className="font-bold text-lg mb-2 relative z-10">Start Writing</h4>
              <p className="text-sm opacity-80 mb-6 relative z-10">Your stories deserve to be heard by a global community.</p>
              <button className="w-full py-3 rounded-xl bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 text-sm font-bold hover:scale-[1.02] active:scale-[0.98] transition-all relative z-10">
                Create Article
              </button>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}

/* ─── Helper Components ──────────────────────────────────── */

function SidebarLink({ href, icon: Icon, label, active }: { href: string; icon: any; label: string; active?: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
        active 
          ? "bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 shadow-sm" 
          : "text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100"
      )}
    >
      <Icon className="h-5 w-5" />
      {label}
    </Link>
  );
}

function TrendingItem({ tag, posts }: { tag: string; posts: string }) {
  return (
    <div className="flex items-center justify-between group cursor-pointer">
      <div>
        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">#{tag}</p>
        <p className="text-xs text-zinc-500">{posts} articles</p>
      </div>
      <ExternalLink className="h-3.5 w-3.5 text-zinc-300 opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-4px] group-hover:translate-x-0" />
    </div>
  );
}

function AuthorItem({ name, username, followers, avatar }: { name: string; username: string; followers: string; avatar: string }) {
  return (
    <div className="flex items-center justify-between group cursor-pointer">
      <div className="flex items-center gap-3">
        <Avatar src={avatar} alt={name} size="sm" className="ring-1 ring-zinc-100 dark:ring-zinc-800" />
        <div>
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 group-hover:underline">{name}</p>
          <p className="text-xs text-zinc-500">@{username} • {followers} followers</p>
        </div>
      </div>
      <button className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
        Follow
      </button>
    </div>
  );
}

function FooterLink({ label }: { label: string }) {
  return (
    <Link href="#" className="text-xs text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
      {label}
    </Link>
  );
}
