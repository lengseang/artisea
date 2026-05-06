import type { Metadata } from 'next';
import Link from 'next/link';
import { Bookmark, FolderOpen } from 'lucide-react';
import { EmptyState } from '@/components/shared/empty-state';
import { PageHeader } from '@/components/shared/page-header';

export const metadata: Metadata = {
  title: 'Library – Artisea',
  description: 'Your personal collection of saved articles.',
};

const MOCK_SAVED = [
  { id: '1', title: 'The Future of Collaborative Writing', slug: 'future-of-collaborative-writing', author: 'Jane Smith', saved_at: '2024-03-16', folder: 'Writing', cover: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=300&h=200&fit=crop' },
  { id: '2', title: 'On Craft: Finding Your Voice', slug: 'on-craft-finding-your-voice', author: 'Alex Johnson', saved_at: '2024-03-21', folder: 'Writing', cover: 'https://images.unsplash.com/photo-1519682577862-22b62b24e493?w=300&h=200&fit=crop' },
  { id: '3', title: 'Building Reliable API Endpoints', slug: 'reliable-api-endpoints', author: 'Backend Guru', saved_at: '2024-03-25', folder: 'Tech', cover: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=300&h=200&fit=crop' },
];

export default function LibraryPage() {
  const folders = [...new Set(MOCK_SAVED.map((s) => s.folder))];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <PageHeader title="Library" description="Your personal collection of saved articles." />

        {MOCK_SAVED.length === 0 ? (
          <EmptyState icon={Bookmark} title="No saved articles" description="Articles you save will appear here for easy access." />
        ) : (
          <>
            {/* Folder chips */}
            <div className="flex items-center gap-2 mb-8">
              <button className="rounded-full bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 px-4 py-1.5 text-sm font-medium">All</button>
              {folders.map((f) => (
                <button key={f} className="rounded-full border border-zinc-200 dark:border-zinc-700 px-4 py-1.5 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                  <FolderOpen className="inline h-3.5 w-3.5 mr-1" />{f}
                </button>
              ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {MOCK_SAVED.map((item) => (
                <Link key={item.id} href={`/article/${item.slug}`} className="group block rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden hover:shadow-lg transition-all">
                  {item.cover && <img src={item.cover} alt={item.title} className="w-full h-40 object-cover" loading="lazy" />}
                  <div className="p-4">
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 mb-1">{item.title}</h3>
                    <p className="text-xs text-zinc-500">{item.author} · Saved {item.saved_at}</p>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
