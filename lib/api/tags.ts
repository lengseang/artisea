import { apiClient } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { normalizeTag, unwrapData, unwrapList } from '@/lib/api/normalizers';
import type { Article, Tag } from '@/types/article';
import type { PaginatedResponse } from '@/types/common';

export interface TagWithArticles extends Tag {
  articles?: Article[];
}

export async function getTags(): Promise<Tag[]> {
  const res = await apiClient<unknown>(API_ENDPOINTS.tags.list, {
    public: true,
  });

  return unwrapList<unknown>(res).map(normalizeTag);
}

export async function getTagBySlug(slug: string): Promise<TagWithArticles> {
  const res = await apiClient<unknown>(
    API_ENDPOINTS.tags.bySlug(slug),
    { public: true }
  );

  return unwrapData<TagWithArticles>(res);
}

export async function getTagArticles(slug: string): Promise<PaginatedResponse<Article>> {
  const tag = await getTagBySlug(slug);
  return {
    data: tag.articles ?? [],
    total: tag.articles?.length ?? 0,
    page: 1,
    limit: tag.articles?.length ?? 0,
  };
}
