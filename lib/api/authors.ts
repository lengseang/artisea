/**
 * Authors / Profiles API service.
 * Endpoints from SRS §9.1 (profiles) and §9.3 (follow).
 */

import { apiClient } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { normalizeArticle, normalizeAuthor, toPaginatedResponse, unwrapData } from '@/lib/api/normalizers';
import type { Author } from '@/types/author';
import type { Article } from '@/types/article';
import type { PaginatedResponse } from '@/types/common';
import type { ProfileUpdateRequest } from '@/types/api';

export async function getAuthors(params?: {
  q?: string;
  page?: number;
  limit?: number;
  search?: string;
  sort?: 'popular' | 'latest';
}): Promise<PaginatedResponse<Author>> {
  const queryParams = { q: params?.search ?? '', ...params };
  const query = '?' + new URLSearchParams(
    Object.entries(queryParams)
      .filter(([, v]) => v !== undefined)
      .map(([k, v]) => [k, String(v)])
  ).toString();

  const res = await apiClient<unknown>(`${API_ENDPOINTS.search.users}${query}`, {
    public: true,
  });
  return toPaginatedResponse<Author>(res, normalizeAuthor);
}

export async function getAuthorByUsername(username: string): Promise<Author> {
  const res = await apiClient<unknown>(API_ENDPOINTS.users.byUsername(username), {
    public: true,
  });
  return normalizeAuthor(unwrapData(res));
}

export async function getMyProfile(): Promise<Author> {
  const res = await apiClient<unknown>(API_ENDPOINTS.auth.me);
  return normalizeAuthor(unwrapData(res));
}

export async function updateMyProfile(payload: ProfileUpdateRequest): Promise<Author> {
  const res = await apiClient<unknown>(API_ENDPOINTS.users.profile, {
    method: 'PATCH',
    body: payload,
  });
  return normalizeAuthor(unwrapData(res));
}

export async function followAuthor(authorId: string): Promise<void> {
  await apiClient<void>(API_ENDPOINTS.users.follow(authorId), { method: 'POST' });
}

export async function unfollowAuthor(authorId: string): Promise<void> {
  await apiClient<void>(API_ENDPOINTS.users.follow(authorId), { method: 'POST' });
}

export async function getAuthorArticles(authorId: string): Promise<PaginatedResponse<Article>> {
  const res = await apiClient<unknown>(API_ENDPOINTS.users.articles(authorId), {
    public: true,
  });
  return toPaginatedResponse<Article>(res, normalizeArticle);
}
