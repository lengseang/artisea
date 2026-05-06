import { AuthorCard } from '@/components/author/author-card';
import { AuthorCardSkeleton } from '@/components/ui/skeleton';
import type { Author } from '@/types/author';

interface AuthorFeedProps {
  feedType: string;
}

const MOCK_AUTHORS: Author[] = [
  {
    id: '1',
    name: 'Jane Smith',
    username: 'janesmith_writer',
    bio: 'Award-winning journalist focusing on the intersection of technology and collaboration.',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
    cover_image_url: null,
    location: 'San Francisco, CA',
    social_links: null,
    is_featured: true,
    follower_count: 1240,
    following_count: 89,
    article_count: 34,
  },
  {
    id: '2',
    name: 'Alex Johnson',
    username: 'alex_crafts',
    bio: 'Writer and educator dedicated to helping new voices find their unique narrative style.',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    cover_image_url: null,
    location: 'New York, NY',
    social_links: null,
    is_featured: true,
    follower_count: 890,
    following_count: 156,
    article_count: 22,
  },
  {
    id: '3',
    name: 'Maria Chen',
    username: 'mchen_reports',
    bio: 'Digital native explorer of long-form narrative and investigative reporting.',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
    cover_image_url: null,
    location: 'London, UK',
    social_links: null,
    is_featured: false,
    follower_count: 2100,
    following_count: 43,
    article_count: 67,
  },
];

const MOCK_FOR_YOU: Author[] = [
  {
    id: '4',
    name: 'Dev Team',
    username: 'dev_central',
    bio: 'A collective of engineers sharing insights on DevOps, CI/CD, and system architecture.',
    avatar_url: 'https://api.dicebear.com/7.x/identicon/svg?seed=DevTeam',
    cover_image_url: null,
    location: null,
    social_links: null,
    is_featured: false,
    follower_count: 560,
    following_count: 12,
    article_count: 18,
  },
  {
    id: '5',
    name: 'Backend Guru',
    username: 'api_master',
    bio: 'Specializing in scalable architecture, Node.js performance, and API security.',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Guru',
    cover_image_url: null,
    location: 'Berlin, Germany',
    social_links: null,
    is_featured: false,
    follower_count: 340,
    following_count: 78,
    article_count: 11,
  },
];

async function getAuthorsFromDatabase(type: string): Promise<Author[]> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  if (type === 'featured') return MOCK_AUTHORS;
  if (type === 'for-you') return MOCK_FOR_YOU;
  return [];
}

export async function AuthorFeed({ feedType }: Readonly<AuthorFeedProps>) {
  const authors = await getAuthorsFromDatabase(feedType);

  if (!authors || authors.length === 0) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        No authors found for &ldquo;{feedType}&rdquo;.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-0">
      {authors.map((author) => (
        <AuthorCard key={author.id} author={author} />
      ))}
    </div>
  );
}

export function AuthorFeedSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-0">
      {Array.from({ length: 3 }).map((_, i) => (
        <AuthorCardSkeleton key={i} />
      ))}
    </div>
  );
}