'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Metadata } from 'next'

// Type definitions (move to types/article.ts when ready)
export interface PublicationItem {
  id: string
  title: string
  status: 'published' | 'draft' | 'archived'
  date: string
  excerpt: string
}

// Placeholder data (move to features/shared/constants when ready)
const PUBLICATIONS_DATA: PublicationItem[] = [
  { id: '1', title: 'The Future of Collaborative Writing', status: 'published', date: '2024-03-15', excerpt: 'How modern tools are reshaping the way writers work together.' },
  { id: '2', title: 'On Craft: Finding Your Voice', status: 'draft', date: '2024-03-20', excerpt: 'Practical exercises to help you discover your unique style.' },
  { id: '3', title: 'Long-form Journalism in the Digital Age', status: 'published', date: '2024-03-10', excerpt: 'Exploring the resurgence of deep narrative-driven reporting.' },
]

const STATUS_STYLES: Record<PublicationItem['status'], string> = {
  published: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  draft: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  archived: 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400',
}

export default function DashboardPage() {
  const router = useRouter()
  const [articles, setArticles] = useState<PublicationItem[]>([...PUBLICATIONS_DATA])

  const handleEdit = (article: PublicationItem) => {
    router.push(`/write?id=${article.id}`)
  }

  const handleCreate = () => {
    router.push('/write')
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this article?')) {
      setArticles((prev) => prev.filter((a) => a.id !== id))
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors duration-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="font-serif text-3xl font-bold text-zinc-900 dark:text-zinc-50">Dashboard</h1>
            <p className="text-zinc-500 dark:text-zinc-400 mt-1 text-sm">Manage your articles and publications.</p>
          </div>
          <button
            onClick={handleCreate}
            className="rounded-xl bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 px-5 py-2.5 text-sm font-semibold hover:opacity-80 transition-opacity"
          >
            + New Article
          </button>
        </div>

        {/* Articles Table */}
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm overflow-hidden">
          {articles.length === 0 ? (
            <div className="p-12 text-center text-zinc-400 dark:text-zinc-600">
              <p className="text-lg font-serif">No articles yet.</p>
              <p className="text-sm mt-1">Click &ldquo;New Article&rdquo; to get started.</p>
            </div>
          ) : (
            <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {articles.map((article) => (
                <li key={article.id} className="flex items-start justify-between gap-4 p-5 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-zinc-900 dark:text-zinc-100 truncate">{article.title}</p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5 truncate">{article.excerpt}</p>
                    <p className="text-xs text-zinc-400 dark:text-zinc-600 mt-1">{article.date}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${STATUS_STYLES[article.status]}`}>
                      {article.status}
                    </span>
                    <button
                      onClick={() => handleEdit(article)}
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(article.id)}
                      className="text-sm text-red-500 dark:text-red-400 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
