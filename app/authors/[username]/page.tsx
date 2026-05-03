import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Author } from '@/types/author'
import { Article } from '@/types/article..ts'

async function getAuthorByUsername(username: string): Promise<Author | null> {
  return {
    id: '1',
    name: 'Jane Doe',
    username: username,
    bio: 'Passionate writer exploring technology, culture, and human stories.',
    avatarUrl: '/placeholder-avatar.jpg',
    profileUrl: `/authors/${username}`
  }
}

async function getAuthorArticles(authorId: string): Promise<Article[]> {
  return [
    {
      id: '1',
      title: 'Understanding Modern Web Development',
      excerpt: 'A deep dive into the latest trends and best practices...',
      slug: 'understanding-modern-web',
      author: 'Jane Doe',
      username: 'janedoe',
      coverImage: '/placeholder.jpg'
    }
  ]
}

// Generate metadata for SEO
export async function generateMetadata(
  { params }: { params: Promise<{ username: string }> }
): Promise<Metadata> {
  const { username } = await params
  const author = await getAuthorByUsername(username)
  
  if (!author) {
    return {
      title: 'Author Not Found – Artisea'
    }
  }

  return {
    title: `${author.name} (@${author.username}) – Artisea`,
    description: author.bio || `Read articles by ${author.name} on Artisea.`,
  }
}

export default async function AuthorProfilePage({
  params
}: {
  params: Promise<{ username: string }>
}) {
  const { username } = await params
  const author = await getAuthorByUsername(username)
  
  if (!author) {
    notFound()
  }

  const articles = await getAuthorArticles(author.id)

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors duration-200">
      <main className="mx-auto max-w-4xl py-12 px-4 sm:px-6 lg:px-8">
        
        {/* Author Header */}
        <div className="mb-12">
          <div className="flex items-start gap-6">
            <img
              src={author.avatarUrl}
              alt={author.name}
              className="w-24 h-24 rounded-full object-cover border-2 border-zinc-200 dark:border-zinc-800"
            />
            <div className="flex-1">
              <h1 className="font-serif text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
                {author.name}
              </h1>
              <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                @{author.username}
              </p>
              {author.bio && (
                <p className="text-zinc-700 dark:text-zinc-300 text-lg">
                  {author.bio}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Articles Section */}
        <div>
          <h2 className="font-serif text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-6">
            Articles by {author.name}
          </h2>
          
          {articles.length === 0 ? (
            <p className="text-zinc-500 dark:text-zinc-400 text-center py-12">
              No articles published yet.
            </p>
          ) : (
            <div className="space-y-6">
              {articles.map((article) => (
                <article
                  key={article.id}
                  className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 hover:shadow-lg transition-shadow duration-200 bg-white dark:bg-zinc-900"
                >
                  <a href={`/article/${article.slug}`} className="group">
                    {article.coverImage && (
                      <img
                        src={article.coverImage}
                        alt={article.title}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                    )}
                    <h3 className="font-serif text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-zinc-600 dark:text-zinc-400 line-clamp-2">
                      {article.excerpt}
                    </p>
                  </a>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}