'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { SearchBar } from '@/components/ui/searchbar';
import { Avatar } from '@/components/ui/avatar';
import { useAuth } from '@/components/providers/auth-provider';
import { useTheme } from '@/components/providers/theme-provider';
import { cn } from '@/lib/utils';
import {
  Menu,
  X,
  Sun,
  Moon,
  PenSquare,
  LayoutDashboard,
  User,
  Settings,
  LogOut,
  Bell,
  ShieldCheck,
} from 'lucide-react';


/* ─── Navigation config ──────────────────────────────────── */
const PUBLIC_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/stories', label: 'Stories' },
  { href: '/authors', label: 'Authors' },
];

const AUTH_LINKS = [
  { href: '/library', label: 'Library' },
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
];

/* ─── Component ──────────────────────────────────────────── */
export function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const { resolvedTheme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const navLinks = [
    ...PUBLIC_LINKS,
    ...(isAuthenticated ? AUTH_LINKS : []),
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-6 sm:px-12 lg:px-20 gap-x-16">
        {/* Logo (Left side) */}
        <div className="flex-1 flex items-center justify-start">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-foreground transition-opacity hover:opacity-80"
          >
            Artisea
          </Link>
        </div>

        {/* Desktop Navigation (Center) - Simplified/Empty for Social Layout */}
        <div className="hidden md:flex flex-1 items-center justify-center">
          {/* Central space reserved or for Search expansion */}
        </div>


        {/* Right side (Right side) */}
        <div className="flex-1 flex items-center justify-end gap-6">
          {/* Search (desktop) */}
          <div className="hidden lg:block w-full max-w-[240px]">
            <SearchBar />
          </div>

          {/* Dark mode toggle */}
          <button
            onClick={toggleTheme}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Toggle theme"
          >
            {resolvedTheme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>

          {isAuthenticated ? (
            <>
              {/* Write button */}
              <Link
                href="/write"
                className="hidden sm:inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <PenSquare className="h-4 w-4" />
                Write
              </Link>

              {/* Notifications */}
              <button
                className="relative rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
                {/* Notification dot */}
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-pink-500" />
              </button>

              {/* Profile dropdown */}
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="rounded-full ring-2 ring-transparent transition-all hover:ring-border focus:ring-border"
                  aria-label="User menu"
                >
                  <Avatar
                    src={user?.avatar_url}
                    alt={user?.display_name ?? 'User'}
                    size="sm"
                  />
                </button>

                {profileOpen && (
                  <>
                    {/* Backdrop */}
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setProfileOpen(false)}
                    />
                    {/* Menu */}
                    <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-border bg-popover p-1.5 shadow-lg ring-1 ring-black/5 animate-in fade-in-0 zoom-in-95">
                      <div className="px-3 py-2 border-b border-border mb-1">
                        <p className="text-sm font-semibold truncate">
                          {user?.display_name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          @{user?.username}
                        </p>
                      </div>
                      <DropdownItem
                        href="/profile"
                        icon={User}
                        label="Profile"
                        onClick={() => setProfileOpen(false)}
                      />
                      <DropdownItem
                        href="/dashboard"
                        icon={LayoutDashboard}
                        label="Dashboard"
                        onClick={() => setProfileOpen(false)}
                      />
                      {user?.role === 'agent' && (
                        <DropdownItem
                          href="/dashboard?view=agent"
                          icon={ShieldCheck}
                          label="Agent Manager"
                          onClick={() => setProfileOpen(false)}
                        />
                      )}

                      <DropdownItem
                        href="/settings"
                        icon={Settings}
                        label="Settings"
                        onClick={() => setProfileOpen(false)}
                      />
                      <div className="border-t border-border mt-1 pt-1">
                        <button
                          onClick={() => {
                            setProfileOpen(false);
                            logout();
                          }}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                        >
                          <LogOut className="h-4 w-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <Link
              href="/login"
              className="whitespace-nowrap rounded-xl bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 px-6 py-2.5 text-sm font-bold hover:opacity-90 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm"
            >
              Sign In
            </Link>
          )}

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background animate-in slide-in-from-top-2 fade-in-0 duration-200">
          <div className="space-y-1 px-4 py-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive(link.href)
                    ? 'bg-muted text-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated && user?.role === 'agent' && (
              <Link
                href="/dashboard?view=agent"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <ShieldCheck className="h-4 w-4" />
                Agent Manager
              </Link>
            )}

            {isAuthenticated && (
              <Link
                href="/write"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <PenSquare className="h-4 w-4" />
                Write
              </Link>
            )}
          </div>
          {/* Mobile search */}
          <div className="border-t border-border px-4 py-3">
            <SearchBar className="max-w-none" />
          </div>
        </div>
      )}
    </nav>
  );
}

/* ─── Dropdown helper ────────────────────────────────────── */
function DropdownItem({
  href,
  icon: Icon,
  label,
  onClick,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
    >
      <Icon className="h-4 w-4 text-muted-foreground" />
      {label}
    </Link>
  );
}