/**
 * Interactions API service — likes, comments, saves, shares.
 * Endpoints from SRS §9.3
 */

import { apiClient } from '@/lib/api-client';
import type { Comment } from '@/types/interaction';
import type { PaginatedResponse, ApiResponse } from '@/types/common';
import type { InteractRequest, CommentRequest } from '@/types/api';

export async function interactWithArticle(
  articleId: string,
  payload: InteractRequest
): Promise<void> {
  await apiClient<void>(`/articles/${articleId}/interact`, {
    method: 'POST',
    body: payload,
  });
}

export async function removeInteraction(
  articleId: string,
  type: 'like' | 'save'
): Promise<void> {
  await apiClient<void>(`/articles/${articleId}/interact?type=${type}`, {
    method: 'DELETE',
  });
}

export async function getComments(
  articleId: string,
  params?: { page?: number; limit?: number }
): Promise<PaginatedResponse<Comment>> {
  const query = params ? '?' + new URLSearchParams(
    Object.entries(params)
      .filter(([, v]) => v !== undefined)
      .map(([k, v]) => [k, String(v)])
  ).toString() : '';

  return apiClient<PaginatedResponse<Comment>>(
    `/articles/${articleId}/comments${query}`,
    { public: true }
  );
}

export async function postComment(
  articleId: string,
  payload: CommentRequest
): Promise<Comment> {
  const res = await apiClient<ApiResponse<Comment>>(
    `/articles/${articleId}/comments`,
    { method: 'POST', body: payload }
  );
  return res.data;
}
