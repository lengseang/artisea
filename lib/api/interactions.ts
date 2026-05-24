/**
 * Interactions API service — likes, comments, saves, shares.
 * Endpoints from SRS §9.3
 */

import { apiClient } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import type { Comment } from '@/types/interaction';
import type { PaginatedResponse, ApiResponse } from '@/types/common';
import type { InteractRequest, CommentRequest } from '@/types/api';

export async function interactWithArticle(
  articleId: string,
  payload: InteractRequest
): Promise<void> {
  if (payload.type === 'share') {
    throw new Error('Share interactions are not exposed by the finalized API.');
  }

  const endpoint =
    payload.type === 'save'
      ? API_ENDPOINTS.interactions.save(articleId)
      : API_ENDPOINTS.interactions.like(articleId);

  await apiClient<void>(endpoint, { method: 'POST' });
}

export async function removeInteraction(
  articleId: string,
  type: 'like' | 'save'
): Promise<void> {
  const endpoint =
    type === 'save'
      ? API_ENDPOINTS.interactions.save(articleId)
      : API_ENDPOINTS.interactions.like(articleId);

  await apiClient<void>(endpoint, { method: 'POST' });
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
    `${API_ENDPOINTS.interactions.comments(articleId)}${query}`,
    { public: true }
  );
}

export async function postComment(
  articleId: string,
  payload: CommentRequest
): Promise<Comment> {
  const res = await apiClient<ApiResponse<Comment>>(
    API_ENDPOINTS.interactions.comments(articleId),
    { method: 'POST', body: payload }
  );
  return res.data;
}
