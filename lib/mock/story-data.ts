/**
 * Mock data for ArtiSea stories.
 * Images are local assets in /public/images/stories/
 */

export interface Story {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: {
    name: string;
    avatar: string;
    username: string;
  };
  tags: string[];
  readTime: string;
  publishedAt: string;
}

export const MOCK_STORIES: Story[] = [
  {
    id: '1',
    title: 'The Neon Horizon: A Glimpse into 2077',
    excerpt: 'Exploring the architectural wonders and digital shadows of the first fully holographic metropolis.',
    content: 'Long form content about the neon horizon...',
    coverImage: '/images/stories/cover-1.png',
    author: {
      name: 'Elena Vance',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena',
      username: 'elevance',
    },
    tags: ['Future', 'Technology', 'Architecture'],
    readTime: '8 min read',
    publishedAt: 'May 12, 2026',
  },
  {
    id: '2',
    title: 'The Art of Slow Writing',
    excerpt: 'In an age of instant gratification, finding solace in the rhythmic dance of a physical pen on paper.',
    content: 'Long form content about slow writing...',
    coverImage: '/images/stories/cover-2.png',
    author: {
      name: 'Julian Thorne',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Julian',
      username: 'jthorne',
    },
    tags: ['Creativity', 'Philosophy', 'Lifestyle'],
    readTime: '5 min read',
    publishedAt: 'May 10, 2026',
  },
  {
    id: '3',
    title: 'Flowing Thoughts: The Neuroscience of Creativity',
    excerpt: 'How our brains navigate the golden rivers of imagination to produce original ideas.',
    content: 'Long form content about neuroscience...',
    coverImage: '/images/stories/cover-3.png',
    author: {
      name: 'Dr. Sarah Chen',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      username: 'schen_neuro',
    },
    tags: ['Science', 'Mind', 'Innovation'],
    readTime: '12 min read',
    publishedAt: 'May 8, 2026',
  },
];
