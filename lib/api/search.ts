import { apiClient } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { normalizeArticle, normalizeAuthor, toPaginatedResponse } from '@/lib/api/normalizers';
import type { Article } from '@/types/article';
import type { Author } from '@/types/author';
import type { PaginatedResponse } from '@/types/common';

function toQuery(params: Record<string, string | number | undefined>): string {
  const query = new URLSearchParams(
    Object.entries(params)
      .filter(([, value]) => value !== undefined)
      .map(([key, value]) => [key, String(value)])
  ).toString();

  return query ? `?${query}` : '';
}

export async function searchArticles(params: {
  q: string;
  page?: number;
  limit?: number;
}): Promise<PaginatedResponse<Article>> {
  const res = await apiClient<unknown>(
    `${API_ENDPOINTS.search.articles}${toQuery(params)}`,
    { public: true }
  );
  return toPaginatedResponse<Article>(res, normalizeArticle);
}

export async function searchUsers(params: {
  q: string;
  page?: number;
  limit?: number;
}): Promise<PaginatedResponse<Author>> {
  const res = await apiClient<unknown>(
    `${API_ENDPOINTS.search.users}${toQuery(params)}`,
    { public: true }
  );
  return toPaginatedResponse<Author>(res, normalizeAuthor);
}
