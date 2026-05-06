/**
 * Authors / Profiles API service.
 * Endpoints from SRS §9.1 (profiles) and §9.3 (follow).
 */

import { apiClient } from '@/lib/api-client';
import type { Author } from '@/types/author';
import type { PaginatedResponse, ApiResponse } from '@/types/common';
import type { ProfileUpdateRequest } from '@/types/api';

export async function getAuthors(params?: {
  page?: number;
  limit?: number;
  search?: string;
  sort?: 'popular' | 'latest';
}): Promise<PaginatedResponse<Author>> {
  const query = params ? '?' + new URLSearchParams(
    Object.entries(params)
      .filter(([, v]) => v !== undefined)
      .map(([k, v]) => [k, String(v)])
  ).toString() : '';

  return apiClient<PaginatedResponse<Author>>(`/authors${query}`, { public: true });
}

export async function getAuthorByUsername(username: string): Promise<Author> {
  const res = await apiClient<ApiResponse<Author>>(`/profiles/${username}`, { public: true });
  return res.data;
}

export async function getMyProfile(): Promise<Author> {
  const res = await apiClient<ApiResponse<Author>>('/profiles/me');
  return res.data;
}

export async function updateMyProfile(payload: ProfileUpdateRequest): Promise<Author> {
  const res = await apiClient<ApiResponse<Author>>('/profiles/me', {
    method: 'PATCH',
    body: payload,
  });
  return res.data;
}

export async function followAuthor(authorId: string): Promise<void> {
  await apiClient<void>(`/authors/${authorId}/follow`, { method: 'POST' });
}

export async function unfollowAuthor(authorId: string): Promise<void> {
  await apiClient<void>(`/authors/${authorId}/follow`, { method: 'DELETE' });
}
