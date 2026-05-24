# ArtiSea Development Progress Tracker

> **⚠️ AI Directive:** This file is the single source of truth for project progress.
> At the **start** of every session, READ this file to understand current state.
> At the **end** of every session, UPDATE this file with what was completed and what changed.

---

## 🟢 Last Updated
- **Date:** May 24, 2026
- **Session:** Fixed undefined 'filter' error in Navbar when notifications API response does not contain data array
- **Current Build:** pass - `npm run build` succeeds with zero errors, 27/27 routes
- **Build Status:** ✅ `npm run build` — 100% compile success

---

## ✅ Completed Work

### Foundation (Types, API, Providers)
- [x] Complete type system (8 files) matching ERD — `types/`
- [x] Barrel export `types/index.ts`
- [x] API client with JWT, timeout, error handling — `lib/api-client.ts`
- [x] API services: auth, articles, authors, interactions — `lib/api/`
- [x] Finalized API endpoint registry matching `/api/v1` spec — `lib/api/endpoints.ts`
- [x] API services added for notifications, search, tags, media, and admin
- [x] API service paths aligned to finalized backend routes
- [x] Next rewrite proxy configured for `/api/v1/:path*` to backend API base URL
- [x] Public feeds, article detail, author profile, stories, search, and library wired to live API services
- [x] Dashboard, write editor, profile, settings, follow, like, save, publish, delete, and media upload wired to live API services
- [x] API response normalizers added for backend shape tolerance
- [x] `useDebounce` hook — `lib/hooks/use-debounce.ts`
- [x] AuthProvider + `useAuth()` — `components/providers/auth-provider.tsx`
- [x] ThemeProvider + `useTheme()` — `components/providers/theme-provider.tsx`
- [x] Composite Providers wrapper — `components/providers/providers.tsx`

### Layout & Navigation
- [x] Root layout — Providers, Footer, Sans-serif (Inter) stack
- [x] Social Layout (3-column) — Refined widgets, Top Authors, Community CTA
- [x] Navbar — sticky glassmorphism, mobile drawer, dark mode toggle, auth-aware dropdown, notifications bell
- [x] Footer — 3-column nav, brand tagline, copyright

### Auth Pages
- [x] Login — wired to `useAuth`, validation, loading, error alerts
- [x] Register — full form with client-side validation

### Bug Fixes (10 Critical)
- [x] `author-card.tsx` — CRASH: referenced `article.*` instead of `author.*`
- [x] `author-navigation.tsx` — exported `ArticleNavigation` instead of `AuthorNavigation`
- [x] `article/[slug]/page.tsx` — missing barrel import `@/types`
- [x] `article/[slug]/page.tsx` — Article type mismatch
- [x] `authors/page.tsx` — wrong `Author` import from `next/dist`
- [x] `app/layout.tsx` — `p4` class typo
- [x] `dashboard/page.tsx` — `Metadata` import in client component
- [x] `article-feed.tsx` — missing `username` in mock data
- [x] `footer.tsx` — empty file
- [x] `ArticleCard` / `StoryCard` — Removed `font-serif` for modern sans-serif pivot
- [x] `ArticleCard` — Refactored to 3-column social layout
- [x] `Editor UI` — Aligned typography styles (font, size, line-height) globally via `globals.css` for Edit and Preview consistency
- [x] `Editor Layout` — Made A4 paper padding, title size, and settings sidebar responsive on mobile viewports
- [x] `Editor Toolbar` — Fixed layout wrapping by making formatting tools scrollable while navigation/action buttons remain fixed
- [x] `navbar.tsx` — CRASH: "Cannot read properties of undefined (reading 'filter')" when notifications is undefined.

### Pages (All 13 Routes)
- [x] Home `/` — article feed with tabs, skeleton fallback
- [x] Article detail `/article/[slug]` — cover image, interactions, follow
- [x] Authors listing `/authors` — feed with tabs
- [x] Author profile `/authors/[username]` — avatar, stats, articles, follow
- [x] Dashboard `/dashboard` — stats cards, tab filters, edit/delete
- [x] Write `/write` — cover area, settings panel, auto-save, visibility
- [x] Profile `/profile` — avatar edit, bio, location, view/edit mode
- [x] Settings `/settings` — account, theme, notifications, danger zone
- [x] Library `/library` — saved articles, folder chips, card grid
- [x] Search `/search` — query-based, empty states
- [x] Login `/login` — glassmorphism, wired auth
- [x] Register `/register` — full form, validation

### Shared/Reusable Components (12 new)
- [x] `ui/avatar.tsx` — sizes xs–xl, initials fallback
- [x] `ui/badge.tsx` — 8 semantic variants
- [x] `ui/card.tsx` — Card + sub-components
- [x] `ui/skeleton.tsx` — base + article/author presets
- [x] `ui/tabs.tsx` — active state, optional count
- [x] `ui/textarea.tsx` — matches Input design
- [x] `shared/interaction-bar.tsx` — like/comment/save/share with micro-animations
- [x] `shared/follow-button.tsx` — toggle with loading state
- [x] `shared/empty-state.tsx` — icon + title + description + action
- [x] `shared/page-header.tsx` — title + description + action slot

### Config
- [x] `next.config.ts` — image domains (dicebear, unsplash)
- [x] `tailwind.config.ts` — `darkMode: 'class'`, serif font
- [x] `.gitignore` — added `/.dev/`

---

## 🟡 Remaining Work

### 🔴 High Priority — Backend Integration
- [ ] Set `NEXT_PUBLIC_API_URL` env and connect to live NestJS backend
- [ ] Swap mock data in ArticleFeed → `getArticles()` API call
- [ ] Swap mock data in AuthorFeed → `getAuthors()` API call
- [ ] Swap mock data in article/[slug] → `getArticleBySlug()` API call
- [ ] Swap mock data in authors/[username] → `getAuthorByUsername()` API call
- [ ] Wire dashboard CRUD → real article management API
- [ ] Wire InteractionBar buttons → `interactWithArticle()` API calls
- [ ] Wire FollowButton → `followAuthor()` / `unfollowAuthor()` API calls
- [ ] Wire comment system → `getComments()` / `postComment()` API calls
- [ ] Wire profile page → `updateMyProfile()` API call
- [ ] Wire settings page → account update API
- [ ] Wire search page → full-text search API
- [ ] Wire library page → saved articles API

### 🔴 High Priority — Auth & Security
- [ ] Auth middleware — server-side protection for `(protected)` routes
- [ ] Auto token refresh on 401 responses
- [ ] Redirect unauthenticated users from write/dashboard/profile/settings
- [ ] CSRF protection (if using cookie auth)

### 🟡 Medium Priority — Features
- [ ] Rich-text editor — replace textarea with Tiptap or Lexical (SRS requirement)
- [ ] Cover image upload — wire to S3/DigitalOcean Spaces
- [ ] Avatar upload — file upload to storage
- [ ] Toast notification system — success/error feedback on actions
- [ ] Comment section UI — threaded comments on article detail
- [ ] Notification feed — real-time bell icon dropdown
- [ ] Share modal — copy link, social share
- [ ] Image lightbox — full-screen viewer for covers/inline images
- [ ] Infinite scroll / pagination — for feeds

### 🟢 Low Priority — Polish & QA
- [ ] Dynamic OG images + JSON-LD structured data
- [ ] Custom 404 page
- [ ] Error boundaries for 500s / network failures
- [ ] Accessibility audit — ARIA, keyboard nav, contrast
- [ ] Mobile QA — test at 375px, 768px, 1440px
- [ ] Performance — lazy images, bundle optimization, Lighthouse
- [ ] PWA / service worker (SRS mentions offline-first)
- [ ] Sitemap.xml generation

### ⬜ Out of Scope (SRS §3.2)
- Monetization / subscription paywalls
- Collaboration / co-authoring
- Native mobile app

---

## 📊 Stats

| Metric | Value |
|--------|-------|
| Total routes | 13 |
| New files created | 35 |
| Files modified | 18 |
| Bugs fixed | 9 |
| Reusable components | 12 |
| Type definitions | 8 files |
| API service modules | 4 |
| Build errors | 0 |
