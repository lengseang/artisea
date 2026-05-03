export interface Article {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  author: string;
  username?: string;
  authorAvatar?: string;
  coverImage?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
