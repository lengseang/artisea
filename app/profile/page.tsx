import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Profile – Artisea',
  description: 'Manage your personal information and articles.',
}

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors duration-200">
      <main className="mx-auto max-w-5xl py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">My Profile</h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          Manage your personal information and articles.
        </p>
        {/* TODO: Add ProfileCard and ArticleList components */}
      </main>
    </div>
  )
}
