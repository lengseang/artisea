import { ArticleCard } from './article-card';
import { ArticleCardSkeleton } from '@/components/ui/skeleton';
import type { Article } from '@/types/article';

interface ArticleFeedProps {
  feedType: string;
}

/**
 * Mock data with all required Article fields.
 * Will be replaced with real API calls when backend is connected.
 */
const MOCK_FEATURED: Article[] = [
  {
    id: '1',
    author_id: 'u1',
    agent_id: null,
    title: 'The Future of Collaborative Writing',
    excerpt:
      'How modern tools are reshaping the way writers work together across the globe. A deep dive into platforms, workflows, and philosophies.',
    slug: 'future-of-collaborative-writing',
    content: null,
    content_text: null,
    cover_image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=300&fit=crop',
    status: 'published',
    visibility: 'public',
    is_verified: false,
    verified_at: null,
    published_at: '2024-03-15T10:00:00Z',
    read_time_minutes: 6,
    view_count: 1240,
    like_count: 48,
    comment_count: 12,
    save_count: 23,
    share_count: 8,
    created_at: '2024-03-10T10:00:00Z',
    updated_at: '2024-03-15T10:00:00Z',
    auto_saved_at: null,
    author: {
      display_name: 'Jane Smith',
      username: 'janesmith_writer',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
    },
    tags: [{ id: 't1', name: 'Writing', slug: 'writing', usage_count: 142 }],
  },
  {
    id: '2',
    author_id: 'u2',
    agent_id: null,
    title: 'On Craft: Finding Your Voice',
    excerpt:
      'Practical exercises and philosophies to help you discover what makes your writing uniquely yours.',
    slug: 'on-craft-finding-your-voice',
    content: null,
    content_text: null,
    cover_image: 'https://images.unsplash.com/photo-1519682577862-22b62b24e493?w=400&h=300&fit=crop',
    status: 'published',
    visibility: 'public',
    is_verified: false,
    verified_at: null,
    published_at: '2024-03-20T08:00:00Z',
    read_time_minutes: 8,
    view_count: 890,
    like_count: 35,
    comment_count: 7,
    save_count: 19,
    share_count: 4,
    created_at: '2024-03-18T10:00:00Z',
    updated_at: '2024-03-20T08:00:00Z',
    auto_saved_at: null,
    author: {
      display_name: 'Alex Johnson',
      username: 'alex_crafts',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    },
    tags: [{ id: 't2', name: 'Craft', slug: 'craft', usage_count: 87 }],
  },
  {
    id: '3',
    author_id: 'u3',
    agent_id: null,
    title: 'Long-form Journalism in the Digital Age',
    excerpt:
      'Exploring the resurgence of deep, narrative-driven reporting on digital platforms.',
    slug: 'long-form-journalism-digital-age',
    content: null,
    content_text: null,
    cover_image: 'https://images.unsplash.com/photo-1504711434969-e33886168d6c?w=400&h=300&fit=crop',
    status: 'published',
    visibility: 'public',
    is_verified: false,
    verified_at: null,
    published_at: '2024-03-10T12:00:00Z',
    read_time_minutes: 12,
    view_count: 2100,
    like_count: 92,
    comment_count: 24,
    save_count: 41,
    share_count: 15,
    created_at: '2024-03-08T10:00:00Z',
    updated_at: '2024-03-10T12:00:00Z',
    auto_saved_at: null,
    author: {
      display_name: 'Maria Chen',
      username: 'mchen_reports',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
    },
    tags: [{ id: 't3', name: 'Journalism', slug: 'journalism', usage_count: 64 }],
  },
];

const MOCK_FOR_YOU: Article[] = [
  {
    id: '4',
    author_id: 'u4',
    agent_id: null,
    title: 'Managing CI/CD Pipelines Efficiently',
    excerpt:
      'Best practices for keeping your deployment pipelines clean, fast, and reliable at scale.',
    slug: 'ci-cd-pipelines',
    content: null,
    content_text: null,
    cover_image: null,
    status: 'published',
    visibility: 'public',
    is_verified: false,
    verified_at: null,
    published_at: '2024-03-22T14:00:00Z',
    read_time_minutes: 5,
    view_count: 430,
    like_count: 18,
    comment_count: 3,
    save_count: 9,
    share_count: 2,
    created_at: '2024-03-20T14:00:00Z',
    updated_at: '2024-03-22T14:00:00Z',
    auto_saved_at: null,
    author: {
      display_name: 'Dev Team',
      username: 'dev_central',
      avatar_url: 'https://api.dicebear.com/7.x/identicon/svg?seed=DevTeam',
    },
    tags: [{ id: 't4', name: 'DevOps', slug: 'devops', usage_count: 53 }],
  },
  {
    id: '5',
    author_id: 'u5',
    agent_id: null,
    title: 'Building Reliable API Endpoints',
    excerpt:
      'How to structure and test your endpoints for scale with proper error handling and validation.',
    slug: 'reliable-api-endpoints',
    content: null,
    content_text: null,
    cover_image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop',
    status: 'published',
    visibility: 'public',
    is_verified: false,
    verified_at: null,
    published_at: '2024-03-25T09:00:00Z',
    read_time_minutes: 7,
    view_count: 670,
    like_count: 29,
    comment_count: 8,
    save_count: 14,
    share_count: 5,
    created_at: '2024-03-23T09:00:00Z',
    updated_at: '2024-03-25T09:00:00Z',
    auto_saved_at: null,
    author: {
      display_name: 'Backend Guru',
      username: 'api_master',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Guru',
    },
    tags: [{ id: 't5', name: 'Backend', slug: 'backend', usage_count: 78 }],
  },
];

async function getArticlesFromDatabase(type: string): Promise<Article[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 400));
  
  // Combine all mock data for demonstration
  const allArticles = [...MOCK_FEATURED, ...MOCK_FOR_YOU];
  
  if (type === 'best' || type === 'hot') return allArticles;
  if (type === 'new') return [...allArticles].reverse();
  if (type === 'top') return [...allArticles].sort((a, b) => b.like_count - a.like_count);
  
  return MOCK_FEATURED;
}

export async function ArticleFeed({ feedType }: Readonly<ArticleFeedProps>) {
  const articles = await getArticlesFromDatabase(feedType);

  if (!articles || articles.length === 0) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        No articles found for &ldquo;{feedType}&rdquo;.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-0">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}

/** Skeleton fallback for Suspense */
export function ArticleFeedSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-0">
      {Array.from({ length: 3 }).map((_, i) => (
        <ArticleCardSkeleton key={i} />
      ))}
    </div>
  );
}