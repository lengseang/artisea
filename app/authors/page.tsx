import type { Metadata } from 'next'
import { Author } from 'next/dist/lib/metadata/types/metadata-types'

export const metadata: Metadata = {
  title: 'Authors – Artisea',
  description: 'Explore our talented community of writers on Artisea.',
}

export default function AuthorsPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors duration-200">
      <main className="mx-auto max-w-5xl py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">Authors</h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          Explore our talented community of writers.
        </p>
        
      </main>
    </div>
  )
}
