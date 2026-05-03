import type { Metadata } from 'next'
import Link from 'next/link'
import type { Article } from '@/types'

// Mock data-fetch (replace with real DB/API call)
async function getArticleBySlug(slug: string): Promise<Article | null> {
  const MOCK: Article[] = [
    {
      id: '1',
      slug: 'future-of-collaborative-writing',
      title: 'The Future of Collaborative Writing',
      excerpt: 'How modern tools are reshaping the way writers work together across the globe.',
      content: `
        The landscape of writing has shifted dramatically over the past decade. Where once a writer toiled alone, 
        modern collaborative platforms now allow teams to craft stories together in real time. 
        This piece explores the tools, philosophies, and workflows that are defining the next era of collaborative authorship.
      `,
      author: { name: 'Jane Smith' },
      publishedAt: 'March 15, 2024',
    },
    {
      id: '2',
      slug: 'on-craft-finding-your-voice',
      title: 'On Craft: Finding Your Voice',
      excerpt: 'Practical exercises and philosophies to help you discover what makes your writing uniquely yours.',
      content: `
        Voice is the most elusive quality in writing. It cannot be taught directly — only cultivated through practice, 
        risk, and a willingness to be honest on the page. Here are some exercises to help you begin that journey.
      `,
      author: { name: 'Alex Johnson' },
      publishedAt: 'March 20, 2024',
    },
  ]

  return MOCK.find((a) => a.slug === slug) ?? null
}

export async function generateMetadata({
  params,
}: Readonly<{
  params: Promise<{ slug: string }>
}>): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticleBySlug(slug)
  return {
    title: article ? `${article.title} – Artisea` : 'Article Not Found – Artisea',
    description: article?.excerpt,
  }
}

export default async function ArticlePage({
  params,
}: Readonly<{
  params: Promise<{ slug: string }>
}>) {
  const { slug } = await params
  const article = await getArticleBySlug(slug)

  // 404 state
  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
        <div className="text-center">
          <h1 className="font-serif text-4xl font-bold mb-4">Article not found</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mb-8">
            The article you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Link
            href="/"
            className="rounded-xl bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 px-5 py-2.5 text-sm font-semibold hover:opacity-80 transition-opacity"
          >
            Return Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-zinc-50 dark:bg-zinc-950 transition-colors duration-200">
      <article className="mx-auto max-w-2xl py-16 px-4 sm:px-6 lg:px-8">

        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 mb-10 transition-colors"
        >
          ← Back
        </Link>

        {/* Article Header */}
        <header className="mb-10">
          <h1 className="font-serif text-4xl font-bold text-zinc-900 dark:text-zinc-50 leading-tight mb-4">
            {article.title}
          </h1>
          <p className="text-lg text-zinc-500 dark:text-zinc-400 mb-6">{article.excerpt}</p>
          <div className="flex items-center gap-3 text-sm text-zinc-400 dark:text-zinc-600">
            <span className="font-medium text-zinc-700 dark:text-zinc-300">{article.author.name}</span>
            <span>·</span>
            <time>{article.publishedAt}</time>
          </div>
        </header>

        {/* Article Content */}
        <div className="prose prose-zinc dark:prose-invert max-w-none leading-8 text-zinc-700 dark:text-zinc-300 whitespace-pre-line">
          {article.content}
        </div>

      </article>
    </div>
  )
}
