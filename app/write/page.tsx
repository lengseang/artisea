'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

// Type definition (move to types/article.ts when ready)
interface PublicationItem {
  id: string
  title: string
  excerpt: string
  content: string
  status: 'published' | 'draft'
}

// Placeholder data (move to features/shared/constants when ready)
const PUBLICATIONS_DATA: PublicationItem[] = [
  { id: '1', title: 'The Future of Collaborative Writing', excerpt: 'How modern tools are reshaping the way writers work together.', content: '', status: 'published' },
  { id: '2', title: 'On Craft: Finding Your Voice', excerpt: 'Practical exercises to help you discover your unique style.', content: '', status: 'draft' },
]

function WriteEditor() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [initialData, setInitialData] = useState<PublicationItem | null>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  // Hydrate from query param
  useEffect(() => {
    const id = searchParams.get('id')
    if (id) {
      const found = PUBLICATIONS_DATA.find((p) => p.id === id)
      if (found) {
        setInitialData(found)
        setTitle(found.title)
        setContent(found.content)
      }
    }
  }, [searchParams])

  const handlePublish = () => {
    const article: PublicationItem = {
      id: initialData?.id ?? Date.now().toString(),
      title,
      excerpt: content.slice(0, 120),
      content,
      status: 'published',
    }
    console.log('Published:', article)
    alert('Article Published Successfully!')
    router.push('/dashboard')
  }

  const handleSaveDraft = () => {
    console.log('Draft saved:', { title, content })
    alert('Draft Saved!')
  }

  const handleCancel = () => {
    router.back()
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col">
      {/* Toolbar */}
      <header className="sticky top-0 z-10 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm px-4 sm:px-8 py-3 flex items-center justify-between gap-4">
        <button
          onClick={handleCancel}
          className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
        >
          ← Cancel
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSaveDraft}
            className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            Save Draft
          </button>
          <button
            onClick={handlePublish}
            className="rounded-xl bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 px-4 py-2 text-sm font-semibold hover:opacity-80 transition-opacity"
          >
            Publish
          </button>
        </div>
      </header>

      {/* Editor */}
      <main className="flex-1 mx-auto w-full max-w-2xl py-12 px-4 sm:px-6 flex flex-col gap-6">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Article title…"
          className="w-full font-serif text-3xl font-bold text-zinc-900 dark:text-zinc-50 bg-transparent border-none outline-none placeholder-zinc-300 dark:placeholder-zinc-700 resize-none"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Tell your story…"
          rows={20}
          className="w-full flex-1 text-base leading-8 text-zinc-700 dark:text-zinc-300 bg-transparent border-none outline-none placeholder-zinc-300 dark:placeholder-zinc-700 resize-none"
        />
      </main>
    </div>
  )
}

export default function WritePage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-zinc-400">Loading editor…</div>}>
      <WriteEditor />
    </Suspense>
  )
}
